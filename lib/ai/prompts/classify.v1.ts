import { getSystemPrompt } from './base';

export function buildClassifyPrompt(text: string, language: string) {
  return {
    system: getSystemPrompt(language),
    prompt: `
Task: Classify the following legal document snippet.
Determine its document type, how confident you are (0 to 1), any highly sensitive topics it covers, and its primary language.

Document Snippet:
---
${text}
---
    `.trim()
  };
}
