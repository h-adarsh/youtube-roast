import { generateCodeChallenge, generateCodeVerifier, generateRandomState } from "../security/crypto";

export const GOOGLE_OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "openid",
  "profile",
].join(" ");

export interface GoogleAuthUrlOptions {
  clientId: string;
  redirectUri: string;
}

/**
 * Generate Google OAuth authorization URL with PKCE & CSRF state
 */
export function createGoogleAuthUrl(options: GoogleAuthUrlOptions) {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = generateRandomState();

  const params = new URLSearchParams({
    client_id: options.clientId,
    redirect_uri: options.redirectUri,
    response_type: "code",
    scope: GOOGLE_OAUTH_SCOPES,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state: state,
    access_type: "online", // No refresh token! Temporary access only
    prompt: "consent",
    include_granted_scopes: "true",
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return {
    authUrl,
    codeVerifier,
    state,
  };
}

export type ExchangeTokenResult =
  | { success: true; accessToken: string; expiresIn: number; idToken?: string; scope?: string }
  | { success: false; error: string };

/**
 * Exchange Authorization Code for Access Token with PKCE
 */
export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<ExchangeTokenResult> {
  try {
    const cleanClientId = clientId.trim();
    const cleanClientSecret = clientSecret.trim();
    const cleanRedirectUri = redirectUri.trim();
    const cleanCode = code.trim();
    const cleanVerifier = codeVerifier.trim();

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: cleanClientId,
        client_secret: cleanClientSecret,
        code: cleanCode,
        code_verifier: cleanVerifier,
        grant_type: "authorization_code",
        redirect_uri: cleanRedirectUri,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Token exchange failed:", response.status, err);
      let errorMsg = `token_exchange_${response.status}`;
      try {
        const json = JSON.parse(err);
        errorMsg = json.error_description || json.error || errorMsg;
      } catch {
        errorMsg = err.slice(0, 100);
      }
      return { success: false, error: errorMsg };
    }

    const data = await response.json();
    return {
      success: true,
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      idToken: data.id_token,
      scope: data.scope,
    };
  } catch (err) {
    console.error("Error exchanging code for tokens:", err);
    return { success: false, error: err instanceof Error ? err.message : "network_error" };
  }
}

/**
 * Revoke the Google access token immediately after roast creation
 */
export async function revokeGoogleToken(token: string): Promise<boolean> {
  try {
    const res = await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.ok;
  } catch (error) {
    console.error("Failed to revoke Google token:", error);
    return false;
  }
}

/**
 * Fetch basic user profile (name, avatar) from Google userinfo
 */
export async function fetchGoogleUserProfile(accessToken: string): Promise<{ displayName: string; avatarUrl: string } | null> {
  try {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      displayName: data.name || "Anonymous Scroller",
      avatarUrl: data.picture || "",
    };
  } catch {
    return null;
  }
}
