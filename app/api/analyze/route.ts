import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withApiHandler } from '@/lib/api/handler';
import { generateStructured } from '@/lib/ai/adapter';
import { buildAnalyzePrompt } from '@/lib/ai/prompts/analyze.v1';
import { ClauseAnalysisSchema } from '@/lib/schemas/ai';

const RequestSchema = z.object({
  clauses: z.array(z.object({
    id: z.string(),
    text: z.string(),
  })).max(20), // Process in batches of 20 max to avoid token limits
  role: z.string(),
  jurisdiction: z.string(),
  language: z.string().default('en'),
});

export const POST = withApiHandler(RequestSchema, async (req, { clauses, role, jurisdiction, language }) => {
  const { system, prompt } = buildAnalyzePrompt(clauses, role, jurisdiction, language);
  
  const result = await generateStructured({
    task: 'analyze',
    schema: z.object({ analyses: z.array(ClauseAnalysisSchema) }),
    system,
    prompt,
  });

  return NextResponse.json({ analyses: result.analyses });
});
