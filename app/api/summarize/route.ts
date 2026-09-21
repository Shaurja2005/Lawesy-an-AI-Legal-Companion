import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withApiHandler } from '@/lib/api/handler';
import { generateStructured } from '@/lib/ai/adapter';
import { buildSummarizePrompt } from '@/lib/ai/prompts/summarize.v1';
import { SummarySchema } from '@/lib/schemas/ai';

const RequestSchema = z.object({
  text: z.string(),
  language: z.string().default('en'),
  focusCategories: z.array(z.string()).default([]),
});

export const POST = withApiHandler(RequestSchema, async (req, { text, language, focusCategories }) => {
  const { system, prompt } = buildSummarizePrompt(text, language, focusCategories);
  
  const result = await generateStructured({
    task: 'summarize',
    schema: SummarySchema,
    system,
    prompt,
  });

  return NextResponse.json(result);
});
