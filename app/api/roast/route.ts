import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { decryptToken } from "@/lib/security/crypto";
import { fetchLikedVideos, fetchPlaylists, fetchSubscriptions } from "@/lib/youtube/api";
import { calculateFacts } from "@/lib/facts";
import { generateGeminiRoast } from "@/lib/gemini";
import { setCachedRoast } from "@/lib/cache";
import { revokeGoogleToken } from "@/lib/google/oauth";
import { DEMO_PROFILES } from "@/lib/demo-data";
import { RoastLanguage, RoastResult, RoastSeverity } from "@/lib/types";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  
  // Rate limiting per IP: max 15 roast requests per 10 minutes
  const rate = checkRateLimit(`roast:${ip}`, 15, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Rate limit reached. Please wait a few minutes before roasting again." },
      { status: 429 }
    );
  }

  let body: {
    demoProfileId?: string;
    language?: RoastLanguage;
    severity?: RoastSeverity;
  } = {};

  try {
    body = await request.json();
  } catch {
    // Empty body is acceptable
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("yt_roast_session")?.value;
  const prefCookie = cookieStore.get("roast_preferences")?.value;

  let language: RoastLanguage = body.language || "en";
  let severity: RoastSeverity = body.severity || "savage";

  if (prefCookie && (!body.language || !body.severity)) {
    try {
      const parsedPrefs = JSON.parse(prefCookie);
      if (parsedPrefs.language) language = parsedPrefs.language;
      if (parsedPrefs.severity) severity = parsedPrefs.severity;
    } catch {
      // ignore
    }
  }

  // Case 1: Demo / Preview Mode
  if (body.demoProfileId) {
    const demoProfile = DEMO_PROFILES.find((p) => p.id === body.demoProfileId) || DEMO_PROFILES[0];
    
    // Calculate facts deterministically
    const facts = calculateFacts(demoProfile.videos, demoProfile.subscriptions, demoProfile.playlists);
    
    // Call Gemini with selected language & severity
    const roast = await generateGeminiRoast(facts, { language, severity });
    
    const roastResult: RoastResult = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      userDisplayName: demoProfile.displayName,
      avatarUrl: demoProfile.avatarUrl,
      facts,
      roast,
      isDemo: true,
      language,
      severity,
    };

    // Cache for 24 hours
    setCachedRoast(roastResult.id, roastResult);

    return NextResponse.json({
      success: true,
      result: roastResult,
    });
  }

  // Case 2: Live OAuth Session
  if (!sessionCookie) {
    return NextResponse.json(
      { error: "No active Google session found. Please sign in with Google or try a demo profile." },
      { status: 401 }
    );
  }

  let session: {
    sessionId: string;
    accessTokenEncrypted: string;
    userDisplayName?: string;
    avatarUrl?: string;
  };

  try {
    session = JSON.parse(sessionCookie);
  } catch {
    return NextResponse.json({ error: "Invalid session state." }, { status: 400 });
  }

  const accessToken = decryptToken(session.accessTokenEncrypted);
  if (!accessToken) {
    return NextResponse.json({ error: "Failed to decrypt authorization credentials." }, { status: 401 });
  }

  try {
    // 1. Fetch user data in parallel with pagination and exact totalResults
    const [likedVideosResult, subscriptionsResult, playlistsResult] = await Promise.all([
      fetchLikedVideos(accessToken),
      fetchSubscriptions(accessToken),
      fetchPlaylists(accessToken),
    ]);

    // 2. Immediately revoke the token for user privacy & security
    revokeGoogleToken(accessToken).catch((e) => console.warn("Token revocation note:", e));

    // Clear session & preferences cookies immediately
    cookieStore.delete("yt_roast_session");
    cookieStore.delete("roast_preferences");

    // 3. Compute facts & deterministic Brainrot score with true totals
    const facts = calculateFacts(
      likedVideosResult.videos,
      subscriptionsResult.subscriptions,
      playlistsResult.playlists,
      {
        totalSubscriptions: subscriptionsResult.totalCount,
        totalLikedVideos: likedVideosResult.totalCount,
        totalPlaylists: playlistsResult.totalCount,
      }
    );

    // 4. Generate the roast with Gemini
    const roast = await generateGeminiRoast(facts, { language, severity });

    const roastResult: RoastResult = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      userDisplayName: session.userDisplayName || "YouTube Explorer",
      avatarUrl: session.avatarUrl,
      facts,
      roast,
      isDemo: false,
      language,
      severity,
    };

    // 5. Store in 24h cache
    setCachedRoast(roastResult.id, roastResult, session.sessionId);

    return NextResponse.json({
      success: true,
      result: roastResult,
    });
  } catch (err: unknown) {
    console.error("Error creating roast from live data:", err);
    const errorMessage = err instanceof Error ? err.message : "";
    if (errorMessage === "youtube_api_not_enabled") {
      return NextResponse.json(
        { error: "YouTube Data API v3 is not enabled in your Google Cloud project. Please enable it in Google Cloud Console > APIs & Services > Library." },
        { status: 403 }
      );
    }
    if (errorMessage === "youtube_scope_insufficient") {
      return NextResponse.json(
        { error: "YouTube read permission was not granted. Please sign in again and check the box to 'View your YouTube account'." },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your YouTube data. Please try again." },
      { status: 500 }
    );
  }
}
