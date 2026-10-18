import crypto from "crypto";

// Fallback session key if not provided in environment
const ENCRYPTION_SECRET = process.env.SESSION_SECRET || "youtube-roast-super-secret-key-32bytes!";
// Ensure 32 bytes key for AES-256
const ENCRYPTION_KEY = crypto.createHash("sha256").update(ENCRYPTION_SECRET).digest();

/**
 * Encrypt a string using AES-256-GCM
 */
export function encryptToken(text: string): string {
  const iv = crypto.randomBytes(12); // 96 bits for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:encrypted (all base64)
  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted}`;
}

/**
 * Decrypt a string using AES-256-GCM
 */
export function decryptToken(encryptedData: string): string | null {
  try {
    const parts = encryptedData.split(":");
    if (parts.length !== 3) return null;
    
    const iv = Buffer.from(parts[0], "base64");
    const authTag = Buffer.from(parts[1], "base64");
    const encryptedText = parts[2];
    
    const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, "base64", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch {
    return null;
  }
}

/**
 * Generate a cryptographically secure random PKCE code verifier (43-128 chars)
 */
export function generateCodeVerifier(): string {
  return crypto.randomBytes(48).toString("base64url");
}

/**
 * Generate a PKCE code challenge from code verifier (SHA256, base64url encoded)
 */
export function generateCodeChallenge(verifier: string): string {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

/**
 * Generate a random state token for CSRF protection
 */
export function generateRandomState(): string {
  return crypto.randomBytes(32).toString("hex");
}
