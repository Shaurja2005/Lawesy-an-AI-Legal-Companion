import { getSystemPrompt } from './base';

export function buildSummarizePrompt(text: string, language: string, focusCategories: string[]) {
  const focusInstruction = focusCategories.length > 0 
    ? `Pay special attention to these categories: ${focusCategories.join(', ')}.`
    : '';

  return {
    system: getSystemPrompt(language),
    prompt: `
Task: Create a structured summary of the following document.
${focusInstruction}

Extract:
1. A one-line summary.
2. The parties involved.
3. The term or duration (if any).
4. Money or payments involved (if any).
5. 3 to 5 key points.
6. Verbatim citations for the key points.

Document Text:
---
${text}
---
    `.trim()
  };
}
