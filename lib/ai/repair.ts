import { z } from 'zod';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { serverEnv } from '../env';

/**
 * If an LLM returns JSON that fails schema validation, this function asks the LLM to fix it.
 * It passes the original prompt, the malformed output, and the exact Zod errors.
 */
export async function repairOutput<T>(
  originalPrompt: string,
  malformedJson: unknown,
  error: z.ZodError,
  schema: z.ZodType<T>
): Promise<T> {
  if (serverEnv.LLM_PROVIDER === 'mock') {
    throw new Error('Schema repair triggered in mock mode. Check your mock fixtures against the schema.');
  }

  console.warn('[AI Repair] Attempting to repair malformed output...', error.issues);

  // In a real app we'd use the configured model, for brevity here we use the default fallback if needed.
  // We can just use gemini-1.5-pro-latest or whatever is configured.
  const model = google(serverEnv.LLM_MODEL ?? 'gemini-1.5-pro-latest');

  const { object } = await generateObject({
    model,
    schema,
    system: 'You are a JSON repair assistant. Fix the provided JSON so it perfectly matches the schema.',
    prompt: `
The previous output failed validation.
Original task: ${originalPrompt}

Validation Errors:
${JSON.stringify(error.issues, null, 2)}

Malformed Output:
${JSON.stringify(malformedJson, null, 2)}

Please return the corrected JSON.
    `.trim(),
  });

  return object;
}
