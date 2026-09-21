export interface ComparePromptInput {
  oldText: string;
  newText: string;
  role?: string;
}

export function buildComparePrompt({ oldText, newText, role }: ComparePromptInput) {
  const system = `You are an expert legal AI designed to compare two versions of a contract clause.
You will be provided with the "Original Text" and the "New Text".
  
YOUR TASK:
1. Identify the material changes (ignore formatting or minor typo fixes).
2. Explain what the change means in plain language.
3. Determine if the change favors the user (who is a ${role || 'party to the contract'}), the other party, or is neutral.

OUTPUT FORMAT:
Output JSON matching this schema:
{
  "explanation": "Brief plain language explanation of the change",
  "favorsParty": "user" | "other" | "neutral" | "unclear",
  "significance": "high" | "medium" | "low"
}
`;

  const prompt = `Original Text:
---
${oldText}
---

New Text:
---
${newText}
---
`;

  return { system, prompt };
}
