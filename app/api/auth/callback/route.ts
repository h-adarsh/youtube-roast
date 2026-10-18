import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { exchangeCodeForTokens, fetchGoogleUserProfile } from "@/lib/google/oauth";
import { encryptToken } from "@/lib/security/crypto";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || url.origin;
  const cookieStore = await cookies();

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/?auth_error=${encodeURIComponent(error || "access_denied")}`);
  }

  // Verify CSRF state
  const savedState = cookieStore.get("oauth_state")?.value;
  const codeVerifier = cookieStore.get("pkce_verifier")?.value;

  if (!state || !savedState || state !== savedState) {
    return NextResponse.redirect(`${baseUrl}/?auth_error=state_mismatch`);
  }

  if (!codeVerifier) {
    return NextResponse.redirect(`${baseUrl}/?auth_error=missing_verifier`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/api/auth/callback`;

  // Check query param scope if provided by Google
  const urlScope = url.searchParams.get("scope") || "";
  if (urlScope && !urlScope.includes("youtube")) {
    console.warn("User completed Google login but omitted YouTube scope:", urlScope);
    return NextResponse.redirect(`${baseUrl}/?auth_error=youtube_scope_missing`);
  }

  // Exchange code for tokens
  const tokenData = await exchangeCodeForTokens(code, codeVerifier, clientId, clientSecret, redirectUri);
  if (!tokenData || !tokenData.accessToken) {
    return NextResponse.redirect(`${baseUrl}/?auth_error=token_exchange_failed`);
  }

  // Double-check granted scopes in token response
  if (tokenData.scope && !tokenData.scope.includes("youtube")) {
    console.warn("Token response indicates YouTube scope was not granted:", tokenData.scope);
    return NextResponse.redirect(`${baseUrl}/?auth_error=youtube_scope_missing`);
  }

  // Fetch basic user profile for display
  const userProfile = await fetchGoogleUserProfile(tokenData.accessToken);

  // Encrypt the access token before storing in session
  const encryptedToken = encryptToken(tokenData.accessToken);
  const sessionId = crypto.randomUUID();

  const sessionPayload = JSON.stringify({
    sessionId,
    accessTokenEncrypted: encryptedToken,
    userDisplayName: userProfile?.displayName || "Anonymous Creator",
    avatarUrl: userProfile?.avatarUrl || "",
    createdAt: Date.now(),
  });

  const isProduction = process.env.NODE_ENV === "production";

  // Set session cookie (HttpOnly, Secure, SameSite=Lax, 1 hour expiry)
  cookieStore.set("yt_roast_session", sessionPayload, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 3600, // 1 hour
  });

  // Clean up temporary PKCE and state cookies
  cookieStore.delete("pkce_verifier");
  cookieStore.delete("oauth_state");

  return NextResponse.redirect(`${baseUrl}/?action=generate_roast`);
}
