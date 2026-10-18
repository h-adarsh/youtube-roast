interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory sliding window rate limiter
const rateLimits = new Map<string, RateLimitRecord>();

// Clean up expired records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimits.entries()) {
    if (now > record.resetAt) {
      rateLimits.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Checks if an IP or identifier has exceeded rate limit
 * @param identifier IP or user ID
 * @param maxRequests Maximum allowed requests in window (default 10)
 * @param windowMs Time window in milliseconds (default 15 minutes)
 */
export function checkRateLimit(
  identifier: string,
  maxRequests = 10,
  windowMs = 15 * 60 * 1000
): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const record = rateLimits.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimits.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInMs: windowMs,
    };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: Math.max(0, record.resetAt - now),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetInMs: Math.max(0, record.resetAt - now),
  };
}
