import { getSystemPrompt } from './base';
import type { ReadingLevel } from '../../schemas/ai';

export function buildSimplifyPrompt(text: string, level: ReadingLevel, language: string) {
  let levelInstruction = '';
  if (level === 'simple') levelInstruction = 'Use very simple language, as if explaining to a beginner. Short sentences.';
  if (level === 'standard') levelInstruction = 'Use clear, everyday language. Avoid legal jargon where possible.';
  if (level === 'detailed') levelInstruction = 'Maintain the nuance of the original, but clarify complex structures.';

  return {
    system: getSystemPrompt(language),
    prompt: `
Task: Simplify the following legal section.
Reading level: ${levelInstruction}

Also extract any legal jargon terms used in the section so we can link them to a glossary.

Section Text:
---
${text}
---
    `.trim()
  };
}
