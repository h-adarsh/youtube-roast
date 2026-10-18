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
 * Calculates deterministic quantitative facts and the Brainrot score from raw YouTube data
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
      samplePlaylists: playlists.map((p) => p.title).slice(0, 5),
      hasNoLikedVideos: true,
    };
  }

  // 1. Shorts calculation (< 60s)
  let shortsCount = 0;
  for (const v of videos) {
    const dur = v.durationSeconds ?? (v.duration ? parseISO8601Duration(v.duration) : 0);
    // If under 60 seconds (and > 0), consider a Short
    if (dur > 0 && dur <= 60) {
      shortsCount++;
    }
  }
  const shortsPercentage = Math.round((shortsCount / totalVideos) * 100);

  // 2. Channel frequency count
  const channelCounts: Record<string, number> = {};
  for (const v of videos) {
    const channel = v.channelTitle?.trim() || "Unknown Channel";
    channelCounts[channel] = (channelCounts[channel] || 0) + 1;
  }
  const topChannels = Object.entries(channelCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

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

  // 5. Brainrot Score: Deterministic weighted formula
  // Score starts with a baseline of 20
  let score = 20;

  // + Up to 45 pts from Shorts share (linear scaling: 0% -> 0 pts, 100% -> 45 pts)
  score += Math.round((shortsPercentage / 100) * 45);

  // + Up to 25 pts from Entertainment & Gaming dominance
  score += Math.round((entertainmentPercentage / 100) * 25);

  // - Deduct up to 20 pts if user actually watches educational content
  score -= Math.round((educationalPercentage / 100) * 20);

  // + Binge concentration penalty: if top 3 channels account for > 40% of watch activity
  const top3Count = topChannels.slice(0, 3).reduce((acc, c) => acc + c.count, 0);
  if (totalVideos > 5 && top3Count / totalVideos > 0.4) {
    score += 10;
  }

  // + High subscription sprawl (subscribed to > 60 channels indicates chronic scrolling)
  if (subsCount > 60) {
    score += 5;
  }

  // Clamp strictly between 5 and 99
  const brainrotScore = Math.min(99, Math.max(5, score));

  // Extract representative sample titles (for AI prompt)
  const sampleVideoTitles = videos.map((v) => v.title).slice(0, 15);
  const samplePlaylists = playlists.map((p) => p.title).slice(0, 6);

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
  };
}
