/**
 * Prompt injection defense & untrusted string sanitization
 */

export function sanitizeUntrustedText(text: string, maxLength = 80): string {
  if (!text || typeof text !== "string") return "";

  // 1. Remove non-printable / control characters except standard space
  let cleaned = text.replace(/[\x00-\x1F\x7F-\x9F]/g, " ");

  // 2. Strip potential prompt injection attempts like markdown brackets or instruction delimiters
  cleaned = cleaned
    .replace(/<system>[\s\S]*?<\/system>/gi, "")
    .replace(/```[\s\S]*?```/gi, "")
    .replace(/system:/gi, "")
    .replace(/instruction:/gi, "")
    .replace(/ignore previous instructions/gi, "[redacted]")
    .replace(/disregard all previous/gi, "[redacted]")
    .trim();

  // 3. Truncate to maximum length
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength) + "…";
  }

  return cleaned;
}

export function sanitizeTitleList(titles: string[], maxCount = 20): string[] {
  return titles
    .slice(0, maxCount)
    .map((t) => sanitizeUntrustedText(t, 70))
    .filter((t) => t.length > 0);
}

export function sanitizeChannelList(channels: { name: string; count: number }[], maxCount = 10): { name: string; count: number }[] {
  return channels
    .slice(0, maxCount)
    .map((c) => ({
      name: sanitizeUntrustedText(c.name, 40),
      count: c.count,
    }))
    .filter((c) => c.name.length > 0);
}
