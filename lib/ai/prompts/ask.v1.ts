export interface AskPromptInput {
  question: string;
  contextClauses: {
    id: string;
    normalizedText: string;
    heading: string;
  }[];
  role?: string;
  goal?: string;
  language?: string;
}

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  hi: '6. Respond entirely in Hindi (keep clause IDs like [S1.2] unchanged).',
  ta: '6. Respond entirely in Tamil (keep clause IDs like [S1.2] unchanged).',
};

export function buildAskPrompt({ question, contextClauses, role, goal, language = 'en' }: AskPromptInput) {
  const contextText = contextClauses
    .map(c => `[Clause ID: ${c.id} | Heading: ${c.heading}]\n${c.normalizedText}`)
    .join('\n\n---\n\n');

  const system = `You are a helpful, precise legal AI assistant designed to answer questions about a specific document.
  
The user is asking a question about the document. You have been provided with the most relevant clauses extracted from the document to help you answer.

USER CONTEXT:
${role ? `- Role: ${role}` : ''}
${goal ? `- Goal: ${goal}` : ''}

YOUR INSTRUCTIONS:
1. Base your answer STRICTLY on the provided context clauses. Do not use outside knowledge to invent facts about this document.
2. If the answer cannot be found in the provided clauses, you MUST say "I couldn't find the answer to that in the relevant sections of the document."
3. Cite your sources. Whenever you make a claim based on a clause, append the Clause ID in brackets, e.g., [S1.2]. 
4. Be concise, professional, and accessible. Use plain language.
5. Do not offer formal legal advice. You are a preparatory assistant.
${LANGUAGE_INSTRUCTIONS[language] ?? ''}

CONTEXT CLAUSES:
---
${contextText || '(No relevant clauses found)'}
---
`;

  return { system };
}
