import { generateObject, generateText, streamText as aiStreamText, LanguageModel } from 'ai';
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
  prompt: string;
  temperature?: number;
}

/**
 * Get the configured LLM provider based on environment variables
 */
function getModel(): LanguageModel {
  const provider = serverEnv.LLM_PROVIDER;
  const modelName = serverEnv.LLM_MODEL;

  switch (provider) {
    case 'gemini':
      return google(modelName ?? 'gemini-1.5-pro-latest');
    case 'anthropic':
      return anthropic(modelName ?? 'claude-3-5-sonnet-latest');
    case 'openai':
      return openai(modelName ?? 'gpt-4o');
    case 'mock':
    default:
      // In a real app, this might throw or use a custom mock LanguageModel.
      // For this project, we'll intercept calls to mock before hitting the real AI SDK.
      throw new Error('Mock provider should be handled before calling getModel()');
  }
}

/**
 * Handle API retries with backoff for rate limits and server errors
 */
async function withRetry<T>(operation: () => Promise<T>, retries = 2): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = error;
      
      // Don't retry on client errors (4xx) EXCEPT rate limits (429)
      const err = error as Record<string, unknown>;
      const status = (err?.statusCode ?? err?.status) as number | undefined;
      const isRateLimit = status === 429;
      const isServerError = status >= 500 && status < 600;
      
      if (!isRateLimit && !isServerError) {
        throw error;
      }
      
      if (attempt < retries) {
        // Exponential backoff: 1s, 2s, 4s...
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`[AI Adapter] Retry ${attempt + 1}/${retries} after ${delay}ms... (Status: ${status})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Reads a JSON fixture for the mock provider
 */
async function getMockFixture<T>(task: string): Promise<T> {
  // In Next.js App Router, we can read from public or mock it directly.
  // We'll simulate a slight delay to match network latency.
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Try to load fixture based on task
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

  const model = getModel();

  return withRetry(async () => {
    try {
      const { object, usage } = await generateObject({
        model,
        schema: options.schema,
        system: options.system,
        prompt: options.prompt,
        temperature: options.temperature ?? 0,
      });

      console.info(`[AI Adapter] Task: ${options.task} | Tokens: ${usage?.totalTokens || 'unknown'}`);
      return object;
    } catch (error: unknown) {
      const err = error as Error & { value?: unknown; data?: unknown; cause?: unknown };
      if (err.name === 'TypeValidationError' || err.name === 'ZodError') {
        const { repairOutput } = await import('./repair');
        console.warn(`[AI Adapter] Schema validation failed for ${options.task}, attempting repair...`);
        return await repairOutput(options.prompt, err.value ?? err.data, err.cause ?? err, options.schema);
      }
      throw error;
    }
  });
}

/**
 * Stream text output using the configured LLM
 */
export async function streamText(options: StreamOptions) {
  if (serverEnv.LLM_PROVIDER === 'mock') {
    throw new Error('Streaming is not fully supported in the mock provider yet. Please implement a mock stream.');
  }

  const model = getModel();

  // Note: Vercel AI SDK handles streaming natively, we don't manually retry streams once they start.
  // We can retry the *initial* connection though.
  return withRetry(async () => {
    const stream = await aiStreamText({
      model,
      system: options.system,
      prompt: options.prompt,
      temperature: options.temperature ?? 0.3,
    });
    
    return stream;
  });
}
