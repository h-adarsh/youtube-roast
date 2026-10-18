import { parseISO8601Duration } from "../facts";
import { YouTubePlaylistItem, YouTubeSubscriptionItem, YouTubeVideoItem } from "../types";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export interface FetchVideosResult {
  videos: YouTubeVideoItem[];
  totalCount: number;
}

export interface FetchSubscriptionsResult {
  subscriptions: YouTubeSubscriptionItem[];
  totalCount: number;
}

export interface FetchPlaylistsResult {
  playlists: YouTubePlaylistItem[];
  totalCount: number;
}

/**
 * Fetch liked videos of the authorized user with pagination and total count
 */
export async function fetchLikedVideos(accessToken: string, maxPages = 3): Promise<FetchVideosResult> {
  const videos: YouTubeVideoItem[] = [];
  let totalCount = 0;
  let nextPageToken: string | undefined = undefined;
  let pagesFetched = 0;

  try {
    while (pagesFetched < maxPages) {
      const url = new URL(`${YOUTUBE_API_BASE}/videos`);
      url.searchParams.set("myRating", "like");
      url.searchParams.set("part", "snippet,contentDetails");
      url.searchParams.set("maxResults", "50");
      if (nextPageToken) {
        url.searchParams.set("pageToken", nextPageToken);
      }

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn("YouTube liked videos fetch returned status:", res.status, errorText);
        if (res.status === 403) {
          if (errorText.includes("has not been used in project") || errorText.includes("is disabled")) {
            throw new Error("youtube_api_not_enabled");
          }
          if (errorText.includes("insufficientPermissions") || errorText.includes("ACCESS_TOKEN_SCOPE_INSUFFICIENT")) {
            throw new Error("youtube_scope_insufficient");
          }
        }
        break;
      }

      const data = await res.json();
      if (data.pageInfo?.totalResults !== undefined && totalCount === 0) {
        totalCount = data.pageInfo.totalResults;
      }

      const items = data.items || [];
      for (const item of items) {
        const dur = item.contentDetails?.duration || "";
        const durSec = parseISO8601Duration(dur);
        videos.push({
          id: item.id,
          title: item.snippet?.title || "Untitled Video",
          channelTitle: item.snippet?.channelTitle || "Unknown Channel",
          channelId: item.snippet?.channelId || "",
          categoryId: item.snippet?.categoryId || "24",
          duration: dur,
          durationSeconds: durSec,
          isShort: durSec > 0 && durSec <= 60,
          publishedAt: item.snippet?.publishedAt,
        });
      }

      nextPageToken = data.nextPageToken;
      pagesFetched++;
      if (!nextPageToken) break;
    }
  } catch (error) {
    console.error("Error fetching YouTube liked videos:", error);
    throw error;
  }

  return {
    videos,
    totalCount: totalCount || videos.length,
  };
}

/**
 * Fetch user's subscriptions with pagination to get the true total count and channel names
 */
export async function fetchSubscriptions(accessToken: string, maxPages = 4): Promise<FetchSubscriptionsResult> {
  const subs: YouTubeSubscriptionItem[] = [];
  let totalCount = 0;
  let nextPageToken: string | undefined = undefined;
  let pagesFetched = 0;

  try {
    while (pagesFetched < maxPages) {
      const url = new URL(`${YOUTUBE_API_BASE}/subscriptions`);
      url.searchParams.set("mine", "true");
      url.searchParams.set("part", "snippet");
      url.searchParams.set("maxResults", "50");
      if (nextPageToken) {
        url.searchParams.set("pageToken", nextPageToken);
      }

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn("YouTube subscriptions fetch returned status:", res.status, errorText);
        break;
      }

      const data = await res.json();
      if (data.pageInfo?.totalResults !== undefined && totalCount === 0) {
        totalCount = data.pageInfo.totalResults;
      }

      for (const item of data.items || []) {
        subs.push({
          id: item.id,
          title: item.snippet?.title || "Unknown Channel",
          description: item.snippet?.description || "",
        });
      }

      nextPageToken = data.nextPageToken;
      pagesFetched++;
      if (!nextPageToken) break;
    }
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
  }

  return {
    subscriptions: subs,
    totalCount: totalCount || subs.length,
  };
}

/**
 * Fetch user's own playlists with true total count
 */
export async function fetchPlaylists(accessToken: string, maxPages = 2): Promise<FetchPlaylistsResult> {
  const playlists: YouTubePlaylistItem[] = [];
  let totalCount = 0;
  let nextPageToken: string | undefined = undefined;
  let pagesFetched = 0;

  try {
    while (pagesFetched < maxPages) {
      const url = new URL(`${YOUTUBE_API_BASE}/playlists`);
      url.searchParams.set("mine", "true");
      url.searchParams.set("part", "snippet,contentDetails");
      url.searchParams.set("maxResults", "50");
      if (nextPageToken) {
        url.searchParams.set("pageToken", nextPageToken);
      }

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn("YouTube playlists fetch returned status:", res.status, errorText);
        break;
      }

      const data = await res.json();
      if (data.pageInfo?.totalResults !== undefined && totalCount === 0) {
        totalCount = data.pageInfo.totalResults;
      }

      for (const item of data.items || []) {
        playlists.push({
          id: item.id,
          title: item.snippet?.title || "Untitled Playlist",
          itemCount: item.contentDetails?.itemCount || 0,
          sampleVideoTitles: [],
        });
      }

      nextPageToken = data.nextPageToken;
      pagesFetched++;
      if (!nextPageToken) break;
    }
  } catch (error) {
    console.error("Error fetching playlists:", error);
  }

  return {
    playlists,
    totalCount: totalCount || playlists.length,
  };
}
