import { generateObject, streamText as aiStreamText, type LanguageModel, type ModelMessage } from 'ai';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { serverEnv } from '../env';

// Type definitions for adapter functions
export interface GenerateOptions<T> {
  task: string;
  schema: z.ZodType<T>;
  system: string;
  prompt: string;
  temperature?: number;
}

export interface StreamOptions {
  task: string;
  system: string;
  prompt?: string;
  messages?: ModelMessage[];
  temperature?: number;
}

/** Hard cap on a single LLM call so a stalled request never hangs the UI. */
const REQUEST_TIMEOUT_MS = 60_000;
/** How long a model that returned 429 (quota exhausted) is skipped before being tried again. */
const QUOTA_COOLDOWN_MS = 5 * 60_000;

/**
 * Error thrown when the LLM provider fails. `status` is forwarded to the client
 * so the UI can tell "quota exhausted" apart from a genuine server bug.
 */
export class AIProviderError extends Error {
  constructor(message: string, public status: number, public code: string) {
    super(message);
    this.name = 'AIProviderError';
  }
}

/**
 * Ordered list of models to try: LLM_MODEL first, then any LLM_FALLBACK_MODELS.
 */
function getModelNames(): string[] {
  const fallbacks = (serverEnv.LLM_FALLBACK_MODELS ?? '')
    .split(',')
    .map(m => m.trim())
    .filter(Boolean);
  return [...new Set([serverEnv.LLM_MODEL!, ...fallbacks])];
}

function getModel(modelName: string): LanguageModel {
  switch (serverEnv.LLM_PROVIDER) {
    case 'gemini':
      return google(modelName);
    case 'anthropic':
      return anthropic(modelName);
    case 'openai':
      return openai(modelName);
    case 'mock':
    default:
      // For this project, we intercept calls to mock before hitting the real AI SDK.
      throw new Error('Mock provider should be handled before calling getModel()');
  }
}

/** Extract an HTTP status from AI SDK errors (APICallError, RetryError) or aborts. */
function getStatus(error: unknown): number | undefined {
  const err = error as Record<string, unknown> | undefined;
  if (!err) return undefined;
  if (err.name === 'TimeoutError' || err.name === 'AbortError') return 504;
  const status = (err.statusCode ?? err.status) as number | undefined;
  if (typeof status === 'number') return status;
  return getStatus(err.lastError) ?? getStatus(err.cause);
}

const cooledDownUntil = new Map<string, number>();

/**
 * Runs `operation` against each configured model in turn. Quota (429), overload (5xx)
 * and timeout errors move on to the next model; anything else is thrown immediately.
 * The AI SDK's own retries are disabled so failures surface in seconds, not minutes.
 */
async function withModelFallback<T>(task: string, operation: (model: LanguageModel) => Promise<T>): Promise<T> {
  const now = Date.now();
  const all = getModelNames();
  const available = all.filter(m => (cooledDownUntil.get(m) ?? 0) <= now);
  // If every model is cooling down, try them all anyway rather than failing without a request.
  const candidates = available.length > 0 ? available : all;

  let lastStatus: number | undefined;
  for (const modelName of candidates) {
    try {
      return await operation(getModel(modelName));
    } catch (error) {
      const status = getStatus(error);
      const retryable = status === 429 || status === 504 || (status !== undefined && status >= 500);
      if (!retryable) throw error;

      lastStatus = status;
      if (status === 429) cooledDownUntil.set(modelName, Date.now() + QUOTA_COOLDOWN_MS);
      console.warn(`[AI Adapter] ${task}: model ${modelName} failed with ${status}, trying next model...`);
    }
  }

  if (lastStatus === 429) {
    throw new AIProviderError(
      'The AI provider quota has been exhausted. Please try again later or configure LLM_FALLBACK_MODELS.',
      429,
      'AI_QUOTA_EXCEEDED',
    );
  }
  if (lastStatus === 504) {
    throw new AIProviderError('The AI provider took too long to respond. Please try again.', 504, 'AI_TIMEOUT');
  }
  throw new AIProviderError('The AI provider is temporarily unavailable. Please try again shortly.', 503, 'AI_UNAVAILABLE');
}

/**
 * Reads a JSON fixture for the mock provider
 */
async function getMockFixture<T>(task: string): Promise<T> {
  // We'll simulate a slight delay to match network latency.
  await new Promise(resolve => setTimeout(resolve, 800));

  try {
    const fs = await import('fs');
    const path = await import('path');
    const fixturePath = path.join(process.cwd(), 'tests/fixtures/llm', `${task}.json`);

    if (fs.existsSync(fixturePath)) {
      const data = fs.readFileSync(fixturePath, 'utf8');
      return JSON.parse(data) as T;
    }
  } catch (err) {
    console.error(`Mock fixture error for ${task}:`, err);
  }

  throw new Error(`Mock fixture not found for task: ${task}`);
}

/**
 * Generate a structured (JSON) response using the configured LLM
 */
export async function generateStructured<T>(options: GenerateOptions<T>): Promise<T> {
  if (serverEnv.LLM_PROVIDER === 'mock') {
    const mockData = await getMockFixture<T>(options.task);
    // Validate mock data against schema to ensure fixtures are correct
    return options.schema.parse(mockData);
  }

  return withModelFallback(options.task, async (model) => {
    const startedAt = Date.now();
    try {
      const { object, usage } = await generateObject({
        model,
        schema: options.schema,
        system: options.system,
        prompt: options.prompt,
        temperature: options.temperature ?? 0,
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      console.info(`[AI Adapter] Task: ${options.task} | Tokens: ${usage?.totalTokens || 'unknown'} | ${Date.now() - startedAt}ms`);
      return object;
    } catch (error: unknown) {
      const err = error as Error & { value?: unknown; data?: unknown; cause?: unknown };
      if (err.name === 'AI_TypeValidationError' || err.name === 'AI_NoObjectGeneratedError' || err.name === 'TypeValidationError' || err.name === 'ZodError') {
        const { repairOutput } = await import('./repair');
        console.warn(`[AI Adapter] Schema validation failed for ${options.task}, attempting repair...`);
        return await repairOutput(model, options.prompt, err.value ?? err.data, err.cause ?? err, options.schema);
      }
      throw error;
    }
  });
}

/**
 * Stream text output using the configured LLM.
 * Uses the first model not cooling down from a quota error; once a stream has started we cannot switch models.
 */
export function streamText(options: StreamOptions) {
  if (serverEnv.LLM_PROVIDER === 'mock') {
    throw new Error('Streaming is not fully supported in the mock provider yet. Please implement a mock stream.');
  }

  const now = Date.now();
  const names = getModelNames();
  const modelName = names.find(m => (cooledDownUntil.get(m) ?? 0) <= now) ?? names[0];

  const base = {
    model: getModel(modelName),
    system: options.system,
    temperature: options.temperature ?? 0.3,
    maxRetries: 1,
    abortSignal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    onError: ({ error }: { error: unknown }) => console.error(`[AI Adapter] Stream error for ${options.task}:`, error),
  };

  return options.messages
    ? aiStreamText({ ...base, messages: options.messages })
    : aiStreamText({ ...base, prompt: options.prompt ?? '' });
}
