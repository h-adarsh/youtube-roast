# 🔥 YouTube Roast — AI Dopamine & Attention Span Teardown

An AI-powered web application that audits your real YouTube watch habits, sub-60-second dopamine traps, and subscriptions to calculate your deterministic **Brainrot Score (0–100)** and deliver a savage, fact-grounded roast powered by **Google Gemini 2.5 Flash**.

Built in the hand-illustrated **Karl Pop-Up Storybook Diorama** design aesthetic with full mobile responsiveness, end-to-end security, and multi-language comedy engines.

---

## 🎨 Visual Identity: Karl Storybook Diorama

The application is styled with a distinct, pop-up storybook diorama on a sunny afternoon:
- **Palette:** Saturated, flat, and warm — `#ffe600` Signal Yellow canvas, `#007fff` Azure globe, `#ef3b2c` Roof Coral accents, `#ffffff` Cloud White cards, and crisp `#333333` Charcoal Ink borders.
- **Typography:** Custom ultra-heavy display typography (**Changa One**) paired with clean uppercase Arial navigation links.
- **Composition:** Dutch canal houses anchoring an azure globe with drifting paper clouds, sticker-badge severity toggles, and zero generic gradients or blurry shadows.

---

## 🚀 Key Features

### 1. 🤖 Fact-Grounded Gemini 2.5 Flash Roasting
- **Every joke quotes real channels, playlists, or stats:** Generic roasts are strictly banned by prompt guardrails.
- **Bilingual Humor Engines:**
  - **English Mode:** Contemporary internet slang (*brainrot, caught in 4K, dopamine receptors on life support*).
  - **Hinglish (Desi Mode):** Authentic colloquial humor (*Tanmay Bhat / CarryMinati style* with relatable Indian punchlines).
- **3 Severity Tiers:** `Mild` (gentle sibling teasing), `Savage` (brutally honest), and `Nuclear` (unhinged existential teardown).

### 2. 🧠 Deterministic Brainrot Scoring Algorithm
- Calculated purely in mathematical code, not through unpredictable AI hallucinations.
- **Formula Inputs:**
  - Ratio of Shorts (<60s duration) vs. longform content.
  - Educational vs. entertainment percentage distribution.
  - Binge concentration factor (top 3 channels dominance).
  - Subscription sprawl (>60 channels penalty).
- Guarantees that the exact same YouTube data always yields the exact same 0–100 score.

### 3. 👻 "Ghost Mode" & Private Account Fallback
- If a user has **"Keep all my liked videos private"** enabled in YouTube Privacy Settings or has 0 public likes, the app does not crash or show blank numbers.
- It activates **Ghost Mode**, analyzes their subscriptions and playlists instead, alerts them with an informational banner, and serves a dedicated *Paranoid Incognito Ghost* roast.

### 4. ⚔️ Friend Duel Mode (`/duel`)
- Side-by-side battle arena comparing two roast results.
- Determines the winner based on Brainrot Scores, category breakdowns, and head-to-head dopamine dependency metrics.
- Includes one-click challenge link generation for social media.

### 5. 💊 Dopamine Prescription Rx
- Clinical breakdown of dopamine receptors featuring:
  - Comical medical diagnosis (e.g., *Acute Shorts-Induced Cerebral Decay*).
  - Brainrot stage assessment (Stages 1 through 4).
  - Prescribed dosages (e.g., *45 minutes of touching physical grass shoes-off*).
  - Urgent black-box warnings.

### 6. 📸 Downloadable Share Cards
- High-contrast, square shareable card rendered in client-side canvas via `html-to-image`.
- One-click share to X (Twitter) and instant clipboard copy.

### 7. 🎭 Interactive Demo Profiles
- Test the application instantly with 3 realistic pre-computed profiles without needing Google Cloud credentials:
  - *The 3 AM Brainrot Doomscroller*
  - *The 5 AM Cold-Shower Hustle Bro*
  - *The Cozy Nostalgia Escapist*

---

## 🛡️ Security & Privacy Architecture

| Security Layer | Implementation |
|---|---|
| **Google Login** | OAuth 2.0 Authorization Code flow with PKCE (`code_verifier` & `code_challenge` SHA-256 base64url) |
| **Minimal Scope** | Strictly requests read-only access: `https://www.googleapis.com/auth/youtube.readonly` |
| **Instant Token Revocation** | Access token is used on-demand and **immediately revoked** (`oauth2.googleapis.com/revoke`) within 5 seconds |
| **Token Handling** | AES-256-GCM encryption in HttpOnly, SameSite cookies; zero refresh tokens stored |
| **Prompt Injection Defense** | Strips control characters, truncates input, isolates untrusted YouTube strings in delimited `<USER_DATA>` blocks |
| **Output Validation** | Strict Zod schema parsing; rejects non-conforming AI outputs and uses deterministic fallback |
| **Sliding Window Rate Limiting** | In-memory IP-based rate limiting (15 requests per 10 minutes) to prevent quota exhaustion |
| **Automatic Retries** | Exponential backoff retry logic (with jitter) for handling Gemini API 429 and 503 limits |
| **Zero Permanent Storage** | No raw video history in databases; automatic 24-hour cache TTL; instant "Delete My Data" endpoint |
| **Hardened HTTP Headers** | Strict CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, TypeScript)
- **Styling:** Vanilla CSS + Tailwind CSS v3 with Storybook Diorama Design Tokens
- **Auth & APIs:** Google OAuth 2.0 (PKCE) & YouTube Data API v3
- **AI Model:** Google Gemini 2.5 Flash (via Generative Language API)
- **Validation:** Zod Schema Validation
- **Visuals:** `canvas-confetti`, `html-to-image`, `lucide-react`

---

## 🏁 Quickstart

### 1. Clone & Install
```bash
git clone https://github.com/h-adarsh/youtube-roast.git
cd youtube-roast
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Populate the required keys:
```ini
# Google OAuth 2.0 Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Google Gemini API Key (from Google AI Studio)
GEMINI_API_KEY=your-gemini-api-key

# Session Encryption Secret (minimum 32 characters)
SESSION_SECRET=super-secret-random-key-at-least-32-chars-long-youtube-roast

# Optional Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note:** If you don't configure Google OAuth credentials immediately, the application runs seamlessly out-of-the-box in **Demo Mode**!

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Google Cloud Console Setup Guide

To enable live Google login with YouTube access:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., `youtube-roast`).
3. Enable the **YouTube Data API v3**:
   - Navigate to **APIs & Services > Library**.
   - Search for `YouTube Data API v3` and click **Enable**.
4. Configure **OAuth Consent Screen**:
   - Select User Type: **External**.
   - App Name: `YouTube Roast`.
   - Add scope: `https://www.googleapis.com/auth/youtube.readonly`.
   - Under **Test Users**, add your personal Google email address.
5. Create **OAuth 2.0 Client Credentials**:
   - Go to **APIs & Services > Credentials > Create Credentials > OAuth client ID**.
   - Application Type: **Web application**.
   - Authorized JavaScript origins: `http://localhost:3000`.
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback`.
6. Copy the **Client ID** and **Client Secret** into your `.env.local`.

---

## ⚠️ Platform Constraints & Architecture FAQ

### 1. "Free API key" vs Google Login
- A public YouTube Data API Key only accesses public resources (search, channel public stats). It **cannot** read private user data.
- Accessing a user's liked videos and subscriptions requires **Google OAuth 2.0** with the `https://www.googleapis.com/auth/youtube.readonly` scope.

### 2. Watch History & Watch Later API Restriction
- Google deprecated API access to the `Watch History` and `Watch Later` system playlists for user privacy in 2016.
- **Solution:** Our algorithm analyzes **Liked Videos**, **Subscriptions**, and **User-Created Playlists**, which provide an authentic snapshot of user taste without violating YouTube's API boundaries.

### 3. Google "Unverified App" Warning & 100 Test Users Limit
- Apps in "Testing" status in Google Cloud Console can only be accessed by up to 100 registered test user emails and show an "Unverified App" consent screen.
- **Solution:** To launch publicly, submit for **OAuth App Verification** in Google Cloud Console with your domain, Privacy Policy, and a screen recording demo. For immediate testing, our interactive **Demo Mode** allows anyone to test the app without Google sign-in.

### 4. 7-Day Testing Mode Token Expiry
- Refresh tokens for unverified test apps expire after 7 days.
- **Solution:** Our application **never retains long-term tokens**. The access token is used on-demand and **immediately revoked** (`oauth2.googleapis.com/revoke`) within 5 seconds of generating the roast.

### 5. Gemini Free Tier vs Paid Tier Data Terms
- Google's terms for free-tier Gemini API keys state that prompt data may be reviewed by human reviewers to train models.
- **Solution:** All user data is sanitized (stripping emails, IDs, and URLs) before prompting. For strict zero-retention/HIPAA/enterprise compliance, configure a paid Gemini API tier or Vertex AI endpoint.

### 6. Free Tier Rate Limits (HTTP 429)
- High concurrent traffic on Gemini free tier can hit quota limits.
- **Solution:** Built-in **exponential backoff retry logic** (with jitter) absorbs brief traffic spikes, and automatically falls back to an algorithmic real-data generator if the upstream API is unavailable.

### 7. Empty Data & Private Liked Videos
- If a user has "Keep all my liked videos private" enabled in YouTube Settings or has no public likes, the API returns an empty video array.
- **Solution:** The app activates **Ghost Mode**, analyzes their subscriptions and playlists instead, alerts the user with an informational banner, and serves a specialized *Paranoid Incognito Ghost* roast.

---

## 📜 License

MIT License. Created for comedic and educational entertainment purposes.
