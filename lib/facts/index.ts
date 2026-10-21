import { CleanedFacts, YouTubeVideoItem, YouTubeSubscriptionItem, YouTubePlaylistItem } from "../types";

// YouTube category ID mapping
export const YOUTUBE_CATEGORIES: Record<string, string> = {
  "1": "Film & Animation",
  "2": "Autos & Vehicles",
  "10": "Music",
  "15": "Pets & Animals",
  "17": "Sports",
  "18": "Short Movies",
  "19": "Travel & Events",
  "20": "Gaming",
  "21": "Videoblogging",
  "22": "People & Blogs",
  "23": "Comedy",
  "24": "Entertainment",
  "25": "News & Politics",
  "26": "Howto & Style",
  "27": "Education",
  "28": "Science & Technology",
  "29": "Nonprofits & Activism",
  "30": "Movies",
  "31": "Anime/Animation",
  "43": "Shows",
  "44": "Trailers",
};

/**
 * Parses an ISO 8601 duration string into seconds.
 * Example: 'PT15M33S' => 933, 'PT45S' => 45, 'PT1H2M10S' => 3730
 */
export function parseISO8601Duration(duration: string): number {
  if (!duration) return 0;
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Calculates deterministic quantitative facts, delusion score, and Brainrot metrics
 * from raw YouTube data (liked videos, subscriptions, playlists).
 */
export function calculateFacts(
  videos: YouTubeVideoItem[],
  subscriptions: YouTubeSubscriptionItem[],
  playlists: YouTubePlaylistItem[],
  totalCounts?: {
    totalSubscriptions?: number;
    totalLikedVideos?: number;
    totalPlaylists?: number;
  }
): CleanedFacts {
  const totalVideos = videos.length;
  const subsCount = totalCounts?.totalSubscriptions ?? subscriptions.length;
  const playlistsCount = totalCounts?.totalPlaylists ?? playlists.length;

  const detailedSubscriptions = subscriptions.slice(0, 20).map((s) => ({
    title: s.title,
    description: s.description || "",
  }));

  const detailedPlaylists = playlists.slice(0, 12).map((p) => ({
    title: p.title,
    itemCount: p.itemCount || 0,
  }));

  if (totalVideos === 0) {
    const subChannels = subscriptions.slice(0, 8).map((s) => ({ name: s.title, count: 1 }));
    return {
      totalVideosAnalyzed: 0,
      totalSubscriptions: subsCount,
      totalPlaylists: playlistsCount,
      shortsCount: 0,
      shortsPercentage: 0,
      topChannels: subChannels,
      categoryDistribution: [],
      educationalPercentage: 0,
      entertainmentPercentage: 0,
      brainrotScore: subsCount > 0 ? Math.min(65, 20 + Math.round(subsCount / 3)) : 15,
      sampleVideoTitles: [],
      samplePlaylists: playlists.map((p) => p.title).slice(0, 8),
      hasNoLikedVideos: true,
      attentionSpanSeconds: 45,
      delusionScore: playlistsCount > 5 ? 78 : 42,
      detailedLikedVideos: [],
      detailedSubscriptions,
      detailedPlaylists,
    };
  }

  // 1. Shorts calculation (< 60s) & average duration
  let shortsCount = 0;
  let totalDurationSeconds = 0;
  let durationCount = 0;

  const detailedLikedVideos: { title: string; channelTitle: string; durationSeconds: number; isShort: boolean }[] = [];

  for (const v of videos) {
    const dur = v.durationSeconds ?? (v.duration ? parseISO8601Duration(v.duration) : 0);
    const isShort = dur > 0 && dur <= 60;
    if (isShort) {
      shortsCount++;
    }
    if (dur > 0) {
      totalDurationSeconds += dur;
      durationCount++;
    }
    detailedLikedVideos.push({
      title: v.title,
      channelTitle: v.channelTitle || "Unknown Channel",
      durationSeconds: dur,
      isShort,
    });
  }

  const shortsPercentage = Math.round((shortsCount / totalVideos) * 100);
  const avgDuration = durationCount > 0 ? Math.round(totalDurationSeconds / durationCount) : 180;
  // Perceived attention span shrinks drastically if shorts dominate
  const attentionSpanSeconds = Math.max(8, Math.round(avgDuration * (1 - (shortsPercentage / 100) * 0.75)));

  // 2. Channel frequency count
  const channelCounts: Record<string, number> = {};
  for (const v of videos) {
    const channel = v.channelTitle?.trim() || "Unknown Channel";
    channelCounts[channel] = (channelCounts[channel] || 0) + 1;
  }
  const topChannels = Object.entries(channelCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 3. Category distribution
  const categoryCounts: Record<string, number> = {};
  for (const v of videos) {
    const catName = v.categoryId ? (YOUTUBE_CATEGORIES[v.categoryId] || "Other") : "Entertainment";
    categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
  }

  const categoryDistribution = Object.entries(categoryCounts)
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / totalVideos) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  // 4. Educational vs Entertainment share
  let educationalCount = 0;
  let entertainmentCount = 0;

  for (const v of videos) {
    const catId = v.categoryId;
    if (catId === "27" || catId === "28") {
      educationalCount++;
    } else if (["10", "20", "22", "23", "24"].includes(catId || "24")) {
      entertainmentCount++;
    }
  }

  const educationalPercentage = Math.round((educationalCount / totalVideos) * 100);
  const entertainmentPercentage = Math.round((entertainmentCount / totalVideos) * 100);

  // 5. Delusion Score: Gap between high-effort playlists/subscriptions and low-effort likes
  // High playlists with lots of videos + high subscriptions + high shorts = MAXIMUM DELUSION
  let delusionScore = 40;
  if (playlistsCount > 3) delusionScore += 15;
  if (playlistsCount > 10) delusionScore += 15;
  if (shortsPercentage > 40) delusionScore += 20;
  if (educationalPercentage < 15 && playlistsCount > 5) delusionScore += 10;
  delusionScore = Math.min(99, Math.max(10, delusionScore));

  // 6. Brainrot Score: Deterministic weighted formula
  let score = 20;
  score += Math.round((shortsPercentage / 100) * 45);
  score += Math.round((entertainmentPercentage / 100) * 25);
  score -= Math.round((educationalPercentage / 100) * 20);

  const top3Count = topChannels.slice(0, 3).reduce((acc, c) => acc + c.count, 0);
  if (totalVideos > 5 && top3Count / totalVideos > 0.4) {
    score += 10;
  }
  if (subsCount > 60) {
    score += 5;
  }

  const brainrotScore = Math.min(99, Math.max(5, score));

  // Extract representative sample titles and playlists
  const sampleVideoTitles = videos.map((v) => v.title).slice(0, 25);
  const samplePlaylists = playlists.map((p) => p.title).slice(0, 10);

  return {
    totalVideosAnalyzed: totalVideos,
    totalSubscriptions: subsCount,
    totalPlaylists: playlistsCount,
    shortsCount,
    shortsPercentage,
    topChannels,
    categoryDistribution,
    educationalPercentage,
    entertainmentPercentage,
    brainrotScore,
    sampleVideoTitles,
    samplePlaylists,
    attentionSpanSeconds,
    delusionScore,
    detailedLikedVideos: detailedLikedVideos.slice(0, 25),
    detailedSubscriptions,
    detailedPlaylists,
  };
}
