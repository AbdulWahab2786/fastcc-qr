const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

const requestBuckets = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

/**
 * In-memory per-user sliding-window rate limiter for AI endpoints
 * (max 5 requests per 10 minutes per user).
 */
export function checkAiRateLimit(userId: string): RateLimitResult {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const existing = requestBuckets.get(userId) ?? [];
  const activeTimestamps = existing.filter((ts) => ts > windowStart);

  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestActive = activeTimestamps[0];
    const retryAfterSec = Math.max(
      1,
      Math.ceil((oldestActive + WINDOW_MS - now) / 1000),
    );
    requestBuckets.set(userId, activeTimestamps);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec,
    };
  }

  activeTimestamps.push(now);
  requestBuckets.set(userId, activeTimestamps);

  // Opportunistic cleanup when map grows large.
  if (requestBuckets.size > 1000) {
    for (const [key, timestamps] of requestBuckets.entries()) {
      if (timestamps.every((ts) => ts <= windowStart)) {
        requestBuckets.delete(key);
      }
    }
  }

  return {
    allowed: true,
    remaining: Math.max(0, MAX_REQUESTS_PER_WINDOW - activeTimestamps.length),
    retryAfterSec: 0,
  };
}
