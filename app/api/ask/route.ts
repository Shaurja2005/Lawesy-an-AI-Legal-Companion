import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { buildAskPrompt } from '@/lib/ai/prompts/ask.v1';
import { serverEnv } from '@/lib/env';

// We use the standard Next.js App Router API route format for streaming
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, contextClauses, role, goal } = await req.json();

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

    // Call the AI SDK
    // Since we're using streamText with Vercel's useChat, we pass the messages array
    const result = await streamText({
      model: google(serverEnv.LLM_MODEL ?? 'gemini-2.5-flash'),
      system,
      messages,
      temperature: 0.2,
    });

    return (result as any).toTextStreamResponse();
  } catch (err: any) {
    console.error('[API Ask Error]', err);
    return new Response('Failed to process chat request', { status: 500 });
  }
}
