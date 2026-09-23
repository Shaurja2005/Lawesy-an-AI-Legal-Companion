import { buildAskPrompt } from '@/lib/ai/prompts/ask.v1';
import { streamText } from '@/lib/ai/adapter';
import { serverEnv } from '@/lib/env';

// We use the standard Next.js App Router API route format for streaming
export const maxDuration = 60;

type IncomingMessage = { role?: string; content?: unknown };

export async function POST(req: Request) {
  try {
    const { messages, contextClauses, role, goal, language } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }

    if (!contextClauses || !Array.isArray(contextClauses)) {
      return new Response('Context clauses are required', { status: 400 });
    }

    const latestMessage = messages[messages.length - 1];
    
    // Build the system prompt
    const { system } = buildAskPrompt({
      question: latestMessage.content,
      contextClauses,
      role,
      goal,
      language,
    });

    if (serverEnv.LLM_PROVIDER === 'mock') {
      const mockEncoder = new TextEncoder();
      const mockStream = new ReadableStream({
        async start(controller) {
          const text = "This is a mock response based on the document. The tenant is responsible for maintenance [S1.1]. Could you clarify your question?";
          const chunks = text.split(' ');
          for (const chunk of chunks) {
            controller.enqueue(mockEncoder.encode(`${chunk} `));
            await new Promise(r => setTimeout(r, 100));
          }
          controller.close();
        }
      });
      return new Response(mockStream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    // Client messages carry extra fields (id, createdAt); the model only needs role + content.
    const modelMessages = (messages as IncomingMessage[])
      .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
      .slice(-10)
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content as string }));

    const result = streamText({
      task: 'ask',
      system,
      messages: modelMessages,
      temperature: 0.2,
    });

    // The chat panel reads the body as plain text.
    return result.toTextStreamResponse();
  } catch (err: unknown) {
    console.error('[API Ask Error]', err);
    return new Response('Failed to process chat request', { status: 500 });
  }
}
