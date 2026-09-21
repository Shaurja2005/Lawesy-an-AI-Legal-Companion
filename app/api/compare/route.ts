import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withApiHandler } from '@/lib/api/handler';
import { generateStructured } from '@/lib/ai/adapter';
import { getSystemPrompt } from '@/lib/ai/prompts/base';
import { ComparisonReportSchema } from '@/lib/schemas/ai';

const RequestSchema = z.object({
  role: z.string().optional(),
  language: z.string().default('en'),
  pairs: z.array(z.object({
    id: z.string(),
    oldText: z.string(),
    newText: z.string(),
  })),
});

export const POST = withApiHandler(RequestSchema, async (req, { role, language, pairs }) => {
  if (pairs.length === 0) {
    return NextResponse.json({ comparisons: [] });
  }

  const system = getSystemPrompt(language) + `
  
You are an expert legal AI designed to compare multiple versions of contract clauses.
You will be provided with a list of "Original Text" and "New Text" pairs.
  
YOUR TASK FOR EACH PAIR:
1. Identify the material changes (ignore formatting or minor typo fixes).
2. Explain what the change means in plain language.
3. Determine if the change favors the user (who is a ${role || 'party to the contract'}), the other party, or is neutral.
`;

  const pairsText = pairs.map((p, i) => `
PAIR ID: ${p.id}
--- Original ---
${p.oldText}
--- New ---
${p.newText}
`).join('\n\n');

  const prompt = `Analyze the following changed clauses:\n${pairsText}`;

  const result = await generateStructured({
    task: 'compare',
    schema: ComparisonReportSchema,
    system,
    prompt,
  });

  return NextResponse.json(result);
});
