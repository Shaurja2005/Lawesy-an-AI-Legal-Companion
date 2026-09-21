import { getSystemPrompt } from './base';

export function buildAnalyzePrompt(
  clauses: { id: string, text: string }[], 
  role: string, 
  jurisdiction: string,
  language: string
) {
  const clauseText = clauses.map(c => `[ID: ${c.id}]\n${c.text}`).join('\n\n');
  
  return {
    system: getSystemPrompt(language),
    prompt: `
Task: Analyze the following legal clauses.
Context: You are reviewing this on behalf of a "${role}" in "${jurisdiction}".

For each clause, provide:
1. A descriptive title and category.
2. A plain-language summary.
3. Risk level (high/medium/low/info) relative to the "${role}". A clause favoring the other party is higher risk.
4. Reason for the risk rating.
5. Which party the clause favors (user, other, neutral, unclear).
6. Any obligations or deadlines created by the clause.
7. Verbatim citations to ground your analysis.

Clauses to analyze:
---
${clauseText}
---
    `.trim()
  };
}
