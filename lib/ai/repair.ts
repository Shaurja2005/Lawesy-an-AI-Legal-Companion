import { z } from 'zod';
import { generateObject, type LanguageModel } from 'ai';
import { serverEnv } from '../env';

/**
 * If an LLM returns JSON that fails schema validation, this function asks the LLM to fix it.
 * It passes the original prompt, the malformed output, and the exact validation errors.
 */
export async function repairOutput<T>(
  model: LanguageModel,
  originalPrompt: string,
  malformedJson: unknown,
  error: unknown,
  schema: z.ZodType<T>
): Promise<T> {
  if (serverEnv.LLM_PROVIDER === 'mock') {
    throw new Error('Schema repair triggered in mock mode. Check your mock fixtures against the schema.');
  }

  const issues = (error as z.ZodError)?.issues ?? String(error);
  console.warn('[AI Repair] Attempting to repair malformed output...', issues);

  const { object } = await generateObject({
    model,
    schema,
    maxRetries: 0,
    abortSignal: AbortSignal.timeout(60_000),
    system: 'You are a JSON repair assistant. Fix the provided JSON so it perfectly matches the schema.',
    prompt: `
The previous output failed validation.
Original task: ${originalPrompt}

Validation Errors:
${JSON.stringify(issues, null, 2)}

Malformed Output:
${JSON.stringify(malformedJson, null, 2)}

Please return the corrected JSON.
    `.trim(),
  });

  return object;
}
