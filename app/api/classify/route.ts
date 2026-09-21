import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withApiHandler } from '@/lib/api/handler';
import { generateStructured } from '@/lib/ai/adapter';
import { buildClassifyPrompt } from '@/lib/ai/prompts/classify.v1';
import { ClassifierResultSchema } from '@/lib/schemas/ai';

const RequestSchema = z.object({
  text: z.string().max(10000), // First ~10k chars is enough to classify
  language: z.string().default('en'),
});

export const POST = withApiHandler(RequestSchema, async (req, { text, language }) => {
  const { system, prompt } = buildClassifyPrompt(text, language);
  
  const result = await generateStructured({
    task: 'classify',
    schema: ClassifierResultSchema,
    system,
    prompt,
  });

  return NextResponse.json(result);
});
