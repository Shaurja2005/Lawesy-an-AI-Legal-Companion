import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withApiHandler } from '@/lib/api/handler';
import { generateStructured } from '@/lib/ai/adapter';
import { buildSimplifyPrompt } from '@/lib/ai/prompts/simplify.v1';
import { ReadingLevelSchema } from '@/lib/schemas/ai';

const SimplifiedSectionSchema = z.object({
  sectionId: z.string(),
  plain: z.string(),
  termsUsed: z.array(z.string()),
});

const RequestSchema = z.object({
  sectionId: z.string(),
  text: z.string(),
  level: ReadingLevelSchema,
  language: z.string().default('en'),
});

export const POST = withApiHandler(RequestSchema, async (req, { sectionId, text, level, language }) => {
  const { system, prompt } = buildSimplifyPrompt(text, level, language);
  
  const result = await generateStructured({
    task: 'simplify',
    schema: z.object({ plain: z.string(), termsUsed: z.array(z.string()) }),
    system,
    prompt,
  });

  return NextResponse.json({
    sectionId,
    plain: result.plain,
    termsUsed: result.termsUsed,
  });
});
