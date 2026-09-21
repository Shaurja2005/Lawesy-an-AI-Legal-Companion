import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withApiHandler } from '@/lib/api/handler';
import { generateStructured } from '@/lib/ai/adapter';
import { getSystemPrompt } from '@/lib/ai/prompts/base';

const RequestSchema = z.object({
  term: z.string(),
  context: z.string().optional(),
  language: z.string().default('en'),
});

const ExplainTermSchema = z.object({
  definition: z.string(),
  example: z.string().optional(),
});

export const POST = withApiHandler(RequestSchema, async (req, { term, context, language }) => {
  const prompt = `
Task: Explain the following legal term in plain language.
Term: "${term}"
${context ? `Context where it appears:\n"${context}"` : ''}

Provide a clear definition and a practical example.
  `.trim();

  const result = await generateStructured({
    task: 'explain-term',
    schema: ExplainTermSchema,
    system: getSystemPrompt(language),
    prompt,
  });

  return NextResponse.json(result);
});
