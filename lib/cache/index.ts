import { RoastResult } from "../types";

// In-memory cache with 24-hour expiration (86,400,000 ms)
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface CacheEntry {
  result: RoastResult;
  ownerSessionId?: string;
  expiresAt: number;
}

const roastCache = new Map<string, CacheEntry>();

// Clean up expired cache items every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of roastCache.entries()) {
    if (now > entry.expiresAt) {
      roastCache.delete(id);
    }
  }
}, 15 * 60 * 1000);

/**
 * Save a roast result to the 24-hour cache
 */
export function setCachedRoast(id: string, result: RoastResult, ownerSessionId?: string): void {
  roastCache.set(id, {
    result,
    ownerSessionId,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

/**
 * Retrieve a cached roast result
 */
export function getCachedRoast(id: string): RoastResult | null {
  const entry = roastCache.get(id);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    roastCache.delete(id);
    return null;
  }

  return entry.result;
}

/**
 * Delete a user's data completely from the cache by ID or session ID
 */
export function deleteUserData(idOrSessionId: string): boolean {
  let deleted = false;
  // If exact match by ID
  if (roastCache.has(idOrSessionId)) {
    roastCache.delete(idOrSessionId);
    deleted = true;
  }

  // Also check if matches ownerSessionId
  for (const [id, entry] of roastCache.entries()) {
    if (entry.ownerSessionId === idOrSessionId || id === idOrSessionId) {
      roastCache.delete(id);
      deleted = true;
    }
  }

  return deleted;
}
