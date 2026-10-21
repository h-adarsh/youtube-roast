import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createGoogleAuthUrl } from "@/lib/google/oauth";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { RoastLanguage, RoastSeverity } from "@/lib/types";

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const rate = checkRateLimit(`auth:${ip}`, 15, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many authentication requests. Please try again shortly." },
      { status: 429 }
    );
  }

  const url = new URL(request.url);
  const lang = (url.searchParams.get("lang") as RoastLanguage) || "en";
  const severity = (url.searchParams.get("severity") as RoastSeverity) || "savage";

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const baseUrl = (process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || url.origin).trim();
  const redirectUri = (process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/api/auth/callback`).trim();

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/?auth_error=missing_credentials`);
  }

  const { authUrl, codeVerifier, state } = createGoogleAuthUrl({
    clientId,
    redirectUri,
  });

  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  // Set short-lived PKCE & CSRF state cookies
  cookieStore.set("pkce_verifier", codeVerifier, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  // Save selected roast preferences (Language & Severity)
  cookieStore.set(
    "roast_preferences",
    JSON.stringify({ language: lang, severity }),
    {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 1800,
    }
  );

  return NextResponse.redirect(authUrl);
}
