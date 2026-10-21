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

export function sanitizeTitleList(titles: string[], maxCount = 25): string[] {
  return titles
    .slice(0, maxCount)
    .map((t) => sanitizeUntrustedText(t, 80))
    .filter((t) => t.length > 0);
}

export function sanitizeChannelList(channels: { name: string; count: number }[], maxCount = 10): { name: string; count: number }[] {
  return channels
    .slice(0, maxCount)
    .map((c) => ({
      name: sanitizeUntrustedText(c.name, 45),
      count: c.count,
    }))
    .filter((c) => c.name.length > 0);
}

export function sanitizeSubscriptionList(subscriptions: { title: string; description: string }[], maxCount = 20): { title: string; description: string }[] {
  return subscriptions
    .slice(0, maxCount)
    .map((s) => ({
      title: sanitizeUntrustedText(s.title, 45),
      description: sanitizeUntrustedText(s.description, 90),
    }))
    .filter((s) => s.title.length > 0);
}

export function sanitizeDetailedPlaylists(playlists: { title: string; itemCount: number }[], maxCount = 12): { title: string; itemCount: number }[] {
  return playlists
    .slice(0, maxCount)
    .map((p) => ({
      title: sanitizeUntrustedText(p.title, 55),
      itemCount: typeof p.itemCount === "number" ? p.itemCount : 0,
    }))
    .filter((p) => p.title.length > 0);
}

export function sanitizeDetailedVideos(videos: { title: string; channelTitle: string; durationSeconds: number; isShort: boolean }[], maxCount = 25): { title: string; channelTitle: string; durationSeconds: number; isShort: boolean }[] {
  return videos
    .slice(0, maxCount)
    .map((v) => ({
      title: sanitizeUntrustedText(v.title, 75),
      channelTitle: sanitizeUntrustedText(v.channelTitle, 40),
      durationSeconds: v.durationSeconds || 0,
      isShort: !!v.isShort,
    }))
    .filter((v) => v.title.length > 0);
}
