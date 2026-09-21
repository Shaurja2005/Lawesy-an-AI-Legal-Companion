import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('Environment config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should parse valid environment variables', async () => {
    process.env.LLM_PROVIDER = 'mock';
    
    const { serverEnv } = await import('../../lib/env');
    expect(serverEnv.LLM_PROVIDER).toBe('mock');
    expect(serverEnv.RATE_LIMIT_PER_MIN).toBe(20);
    expect(serverEnv.MAX_DOC_CHARS).toBe(200000);
  });

  it('should fail when provider is gemini but no key is provided', async () => {
    process.env.LLM_PROVIDER = 'gemini';
    
    await expect(import('../../lib/env')).rejects.toThrow('Invalid environment variables');
  });

  it('should succeed when provider is gemini and key is provided', async () => {
    process.env.LLM_PROVIDER = 'gemini';
    process.env.LLM_MODEL = 'gemini-1.5-pro';
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'fake-key';
    
    const { serverEnv } = await import('../../lib/env');
    expect(serverEnv.LLM_PROVIDER).toBe('gemini');
    expect(serverEnv.GOOGLE_GENERATIVE_AI_API_KEY).toBe('fake-key');
  });

  it('should fail if unknown provider is given', async () => {
    process.env.LLM_PROVIDER = 'unknown' as any;
    
    await expect(import('../../lib/env')).rejects.toThrow('Invalid environment variables');
  });
});
