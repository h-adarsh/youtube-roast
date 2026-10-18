# 🔥 YouTube Roast — AI Dopamine & Attention Span Teardown

An AI web application that audits your real YouTube watch habits, sub-60-second dopamine traps, and subscriptions to calculate your deterministic **Brainrot Score (0–100)** and deliver a savage, fact-grounded roast powered by **Gemini 2.5 Flash**.

Every roast directly quotes your actual most-watched creators, playlists, and numbers. Generic roasts are strictly banned.

---

## 🚀 Features

- **Google OAuth 2.0 with PKCE & CSRF Defense:**
  - Secure Authorization Code flow with PKCE (`code_verifier` & `code_challenge` SHA-256 base64url).
  - Minimal read-only scope: `https://www.googleapis.com/auth/youtube.readonly`.
  - Immediate token revocation: Backend revokes the access token with Google the moment the roast is generated.
- **Deterministic Brainrot Algorithm:**
  - Calculates numbers in code, not via unpredictable AI hallucination.
  - Metrics: Shorts ratio (<60s duration), educational vs. entertainment percentage, channel binge factor, subscription sprawl.
  - Guarantees the same data yields the same 0–100 score every time.
- **Prompt Injection Defense & Zod Schema Validation:**
  - Video titles and playlist names are untrusted user input. They are sanitized, stripped of control characters, truncated, and strictly delimited.
  - Strict structured JSON output validated with Zod.
- **Exportable Share Card:**
  - Generates a sleek, high-contrast downloadable PNG card using `html-to-image`.
  - One-click share to X (Twitter) and clipboard copy.
- **Built-in Demo Mode:**
  - Test immediately with 3 realistic profiles without needing Google Cloud credentials right away:
    - *The 3 AM Brainrot Doomscroller*
    - *The 5 AM Cold-Shower Hustle Bro*
    - *The Cozy Nostalgia Escapist*
- **Privacy & DPDP Compliance:**
  - 24-hour automatic TTL cache purge.
  - Working **"Delete My Data"** button to immediately wipe session cookies and cached roasts.
  - Direct link to Google Account security permissions.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Turbopack, TypeScript)
- **Styling:** Karl Storybook Diorama Design System (Signal Yellow `#ffe600`, Globe Azure `#007fff`, Roof Coral `#ef3b2c`, Charcoal Ink `#333333`, Changa One headline display, Arial navigation) with Tailwind CSS v3
- **Auth & Data:** Google OAuth 2.0 (PKCE) + YouTube Data API v3
- **AI Engine:** Google Gemini API (Gemini 2.5 Flash in JSON mode)
- **Security:** AES-256-GCM token encryption, Zod validation, in-memory sliding window rate limiting, Security Headers (CSP, X-Frame-Options, nosniff, HSTS)
- **Visuals:** `html-to-image`, `canvas-confetti`, `lucide-react`

---

## 🏁 Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your credentials:
```ini
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
GEMINI_API_KEY=your-gemini-api-key
SESSION_SECRET=super-secret-random-key-at-least-32-chars-long-youtube-roast
```

> **Note:** If you don't configure Google OAuth credentials immediately, the app will run seamlessly in **Demo Mode** out of the box!

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Security Architecture

| Security Layer | Implementation |
|---|---|
| **Google Login** | Authorization Code flow with PKCE, exact redirect URI, state verification |
| **Token Handling** | AES-256-GCM encryption in HttpOnly cookie; immediately revoked after generation |
| **Prompt Injection** | Control character stripping, length truncation, `<USER_DATA>` delimiter separation |
| **Output Checking** | Strict Zod schema validation; rejection of non-conforming responses |
| **Rate Limiting** | Sliding window rate limiter per IP address to safeguard quotas |
| **Storage & Privacy** | Zero raw video history in DB; 24h automatic cache TTL; instant user deletion |
