import 'server-only';
import { z } from 'zod';

const serverSchema = z.object({
  LLM_PROVIDER: z.enum(['gemini', 'anthropic', 'openai', 'mock']).default('mock'),
  LLM_MODEL: z.string().optional(),
  // Comma-separated models tried in order when LLM_MODEL is rate-limited or unavailable
  LLM_FALLBACK_MODELS: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  RATE_LIMIT_PER_MIN: z.coerce.number().positive().default(20),
  MAX_DOC_CHARS: z.coerce.number().positive().default(200000),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.LLM_PROVIDER === 'gemini' && !data.GOOGLE_GENERATIVE_AI_API_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "GOOGLE_GENERATIVE_AI_API_KEY is required when LLM_PROVIDER is gemini",
      path: ['GOOGLE_GENERATIVE_AI_API_KEY'],
    });
  }
  if (data.LLM_PROVIDER === 'anthropic' && !data.ANTHROPIC_API_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "ANTHROPIC_API_KEY is required when LLM_PROVIDER is anthropic",
      path: ['ANTHROPIC_API_KEY'],
    });
  }
  if (data.LLM_PROVIDER === 'openai' && !data.OPENAI_API_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "OPENAI_API_KEY is required when LLM_PROVIDER is openai",
      path: ['OPENAI_API_KEY'],
    });
  }
  if (data.LLM_PROVIDER !== 'mock' && !data.LLM_MODEL) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "LLM_MODEL is required when LLM_PROVIDER is not mock",
      path: ['LLM_MODEL'],
    });
  }
});

const processEnv = {
  LLM_PROVIDER: process.env.LLM_PROVIDER,
  LLM_MODEL: process.env.LLM_MODEL,
  LLM_FALLBACK_MODELS: process.env.LLM_FALLBACK_MODELS,
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  RATE_LIMIT_PER_MIN: process.env.RATE_LIMIT_PER_MIN,
  MAX_DOC_CHARS: process.env.MAX_DOC_CHARS,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
};

const parsed = serverSchema.safeParse(processEnv);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const serverEnv = parsed.data;
