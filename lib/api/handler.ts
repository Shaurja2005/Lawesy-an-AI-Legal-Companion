import { NextResponse } from 'next/server';
import { z } from 'zod';
import { serverEnv } from '../env';

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
//
// Strategy: Use Upstash Redis (sliding window) when credentials are present.
// Falls back to a local in-memory Map for local dev without Upstash configured.
//

type RateLimitResult = { success: boolean; limit: number; remaining: number };

// ── Upstash singleton ──────────────────────────────────────────────────────────
let upstashLimiter: ((ip: string) => Promise<RateLimitResult>) | null = null;

function getUpstashLimiter() {
  if (upstashLimiter) return upstashLimiter;

  const url   = serverEnv.UPSTASH_REDIS_REST_URL;
  const token = serverEnv.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  // Lazily import so the edge bundle doesn't import Redis when not configured.
  const { Redis }       = require('@upstash/redis');
  const { Ratelimit }   = require('@upstash/ratelimit');

  const redis = new Redis({ url, token });
  const limit = serverEnv.RATE_LIMIT_PER_MIN;

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, '1 m'),
    analytics: true,
    prefix: 'lawesy:rl',
  });

  upstashLimiter = async (ip: string): Promise<RateLimitResult> => {
    const result = await ratelimit.limit(ip);
    return { success: result.success, limit: result.limit, remaining: result.remaining };
  };

  return upstashLimiter;
}

// ── In-memory fallback ──────────────────────────────────────────────────────────
const _memStore = new Map<string, { count: number; resetAt: number }>();

function checkMemoryRateLimit(ip: string): RateLimitResult {
  const now       = Date.now();
  const windowMs  = 60 * 1000;
  const limit     = serverEnv.RATE_LIMIT_PER_MIN;
  const record    = _memStore.get(ip);

  if (!record || record.resetAt < now) {
    _memStore.set(ip, { count: 1, resetAt: now + windowMs });
    return { success: true, limit, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, limit, remaining: 0 };
  }

  record.count += 1;
  return { success: true, limit, remaining: limit - record.count };
}

async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const upstash = getUpstashLimiter();
  if (upstash) {
    try {
      return await upstash(ip);
    } catch (err) {
      // Upstash unavailable — degrade gracefully to in-memory
      console.warn('[RateLimit] Upstash unreachable, falling back to in-memory:', (err as Error).message);
    }
  }
  return checkMemoryRateLimit(ip);
}

// ─── Handler wrapper ──────────────────────────────────────────────────────────

export type ApiHandler<T> = (
  req: Request,
  parsedBody: T
) => Promise<NextResponse> | NextResponse;

/**
 * Wraps an API route handler with safety checks:
 * - Method check (POST only)
 * - Payload size limit
 * - Rate limiting — Upstash Redis sliding window (falls back to in-memory if not configured)
 * - Zod body validation
 * - Standardized error mapping
 */
export function withApiHandler<T>(
  schema: z.ZodType<T>,
  handler: ApiHandler<T>
) {
  return async (req: Request) => {
    try {
      if (req.method !== 'POST') {
        return NextResponse.json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Only POST allowed' } }, { status: 405 });
      }

      // 1. IP Rate Limiting
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown-ip';
      const rl = await checkRateLimit(ip);

      if (!rl.success) {
        return NextResponse.json(
          { error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later.' } },
          { 
            status: 429, 
            headers: { 
              'Retry-After': '60',
              'X-RateLimit-Limit': String(rl.limit),
              'X-RateLimit-Remaining': '0',
            } 
          }
        );
      }

      // 2. Payload size check
      const contentLength = Number(req.headers.get('content-length') || 0);
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (contentLength > maxSize) {
        return NextResponse.json({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body too large' } }, { status: 413 });
      }

      // 3. Parse JSON Body
      let body: unknown;
      try {
        body = await req.json();
      } catch (err) {
        return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Invalid JSON body' } }, { status: 400 });
      }

      // 4. Validate Schema
      const parsed = schema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ 
          error: { code: 'VALIDATION_ERROR', message: 'Invalid request data', details: parsed.error.format() } 
        }, { status: 400 });
      }

      // 5. Execute Handler
      const response = await handler(req, parsed.data);

      // Attach rate-limit headers to successful responses too
      response.headers.set('X-RateLimit-Limit', String(rl.limit));
      response.headers.set('X-RateLimit-Remaining', String(rl.remaining));

      return response;
      
    } catch (error: any) {
      console.error('[API Error]', error);
      return NextResponse.json(
        { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred while processing the request.' } },
        { status: 500 }
      );
    }
  };
}
