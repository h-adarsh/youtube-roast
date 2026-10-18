import { z } from "zod";

export type RoastLanguage = "en" | "hinglish";
export type RoastSeverity = "mild" | "savage" | "nuclear";

export interface YouTubeVideoItem {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string;
  categoryId?: string;
  duration?: string; // ISO 8601 format e.g. PT45S, PT12M30S
  durationSeconds?: number;
  isShort?: boolean;
  publishedAt?: string;
}

export interface YouTubeSubscriptionItem {
  id: string;
  title: string;
  description: string;
}

export interface YouTubePlaylistItem {
  id: string;
  title: string;
  itemCount: number;
  sampleVideoTitles: string[];
}

export interface CleanedFacts {
  totalVideosAnalyzed: number;
  totalSubscriptions: number;
  totalPlaylists: number;
  shortsCount: number;
  shortsPercentage: number;
  topChannels: { name: string; count: number }[];
  categoryDistribution: { category: string; count: number; percentage: number }[];
  educationalPercentage: number;
  entertainmentPercentage: number;
  brainrotScore: number; // 0-100 calculated deterministically
  sampleVideoTitles: string[];
  samplePlaylists: string[];
  hasNoLikedVideos?: boolean;
}

export const PrescriptionSchema = z.object({
  diagnosis: z.string().min(3).max(250),
  stage: z.string().min(2).max(80),
  dosages: z.array(z.string().min(3).max(350)).min(2).max(8),
  warning: z.string().min(5).max(350),
});

export type DopaminePrescription = z.infer<typeof PrescriptionSchema>;

// Zod Schema for Gemini Roast Output Validation
export const GeminiRoastSchema = z.object({
  archetype: z.string().min(2).max(120),
  one_line_description: z.string().min(5).max(350),
  roast_report: z.string().min(30).max(4000),
  red_flags: z.array(z.string().min(3).max(350)).min(2).max(10),
  habits_exposed: z.array(z.string().min(3).max(350)).min(2).max(8),
  brainrot_analysis: z.string().min(10).max(1000),
  prescription: PrescriptionSchema.optional(),
});

export type GeminiRoastOutput = z.infer<typeof GeminiRoastSchema>;

export interface RoastResult {
  id: string; // UUID v4
  createdAt: number;
  userDisplayName?: string;
  avatarUrl?: string;
  facts: CleanedFacts;
  roast: GeminiRoastOutput;
  isDemo?: boolean;
  language?: RoastLanguage;
  severity?: RoastSeverity;
}

export interface SessionData {
  sessionId: string;
  accessTokenEncrypted?: string;
  userDisplayName?: string;
  avatarUrl?: string;
  createdAt: number;
  language?: RoastLanguage;
  severity?: RoastSeverity;
}
