# External Integrations

**Analysis Date:** 2026-04-03

## APIs & External Services

**Google Generative AI (Gemini):**
- Service: Google Generative AI API for text generation, TTS, and Live Audio
  - TTS: `gemini-2.5-flash-preview-tts` model for text-to-speech
  - Roast generation: `gemini-2.5-flash-lite` or `gemini-2.5-flash` (fallback chain)
  - Live API: `gemini-2.5-flash-native-audio-latest` for streaming audio interaction
  - SDK/Client: `@google/generative-ai` (v0.24.1 for REST), `@google/genai` (v1.40.0 for Live API)
  - Auth (server): `GEMINI_API_KEY` via `process.env` (checked in `api/speak.ts:13`, `api/roast.ts:28`)
  - Auth (client): `VITE_GEMINI_API_KEY` via `import.meta.env` (checked in `services/geminiLive.ts:76`)
  - Ephemeral token: Obtained via POST to `https://generativelanguage.googleapis.com/v1beta/tokens?key={apiKey}` (1-hour expiry)

**Resend Email Service (Optional):**
- Service: Transactional email delivery for v2 waitlist signups
  - Purpose: Send confirmation emails to waitlist subscribers
  - SDK/Client: Fetch API (custom HTTP calls in `api/v2-waitlist.ts`)
  - Auth: `RESEND_API_KEY` via `process.env` (checked in `api/v2-waitlist.ts:55`)
  - Endpoint: `https://api.resend.com/emails`
  - Fallback: Dev mode logs email instead of sending (see `api/v2-waitlist.ts:93-94`)

**Vercel Analytics:**
- Service: Usage metrics and analytics collection
  - SDK/Client: `@vercel/analytics/react`
  - Mounted: `<Analytics />` component in `App.tsx:1`
  - No configuration needed; automatically sends metrics to Vercel dashboard

## Data Storage

**Databases:**
- None. Game state is ephemeral (session-only, stored in React state via `useGameState`)
- Waitlist signups validated but not persisted (only logged to console in dev)

**File Storage:**
- Local filesystem only
  - Audio assets: `public/audio/voices/`, `public/audio/music/`
  - Images: `public/images/`
  - No cloud storage service (S3, GCS, etc.)

**Caching:**
- Browser HTTP cache for static assets (CSS, JS, audio files)
- No explicit caching layer (Redis, Memcached, etc.)

## Authentication & Identity

**Auth Provider:**
- None (no user login/registration)
- Email validation only (regex check in `api/v2-waitlist.ts:4-8`)

**Implementation:**
- No session management
- No user accounts or auth flow
- Ephemeral token auth for Gemini Live API (obtained via Google API endpoint)
  - Token life: ~1 hour (expires automatically)
  - No manual token refresh needed in client code

## Monitoring & Observability

**Error Tracking:**
- None configured (Sentry, Datadog, etc.)
- Console logging only: `console.error()`, `console.warn()`, `console.log()`

**Logs:**
- Browser console (dev tools)
- Server-side logs via Vercel function logs
- No centralized logging service

**Analytics:**
- Vercel Analytics (`@vercel/analytics/react`)
  - Automatically captures page views, interactions, performance metrics
  - Sent to Vercel dashboard (no additional config needed)

## CI/CD & Deployment

**Hosting:**
- Vercel platform (serverless functions)
- Deployments via git (auto-deploy on push)

**CI Pipeline:**
- GitHub Actions (inferred from `process.env.CI` checks in `playwright.config.ts:6-8, 18, 21-23`)
- Pre-commit hooks via Husky:
  - `lint-staged` runs Biome on staged files: `*.{ts,tsx,js,jsx,json}`
  - Command: `biome check --write`

**Build Process:**
- `bun run build` → Vite compiles TypeScript/JSX, CSS (Tailwind), outputs to `dist/`
- Vite injects `VITE_*` env vars at build time (via `vite.config.ts` custom loader)
- Server-side API routes served from `api/` directory (Vercel serverless)

## Environment Configuration

**Required env vars (Production - Server):**
- `GEMINI_API_KEY` - For server-side API routes (`api/speak.ts`, `api/roast.ts`)

**Required env vars (Production - Client):**
- `VITE_GEMINI_API_KEY` - For Gemini Live API (browser-based streaming audio)

**Optional env vars:**
- `VITE_ENABLE_SPEECH` - Feature flag for TTS UI (default: "true", can set to "false" to disable)
- `VITE_ENABLE_LIVE_API` - Feature flag for Gemini Live API streaming
- `VITE_STT_LOW_LATENCY` - Low-latency speech-to-text mode (experimental, checked in `hooks/useLiveAPISpeechRecognition.ts:78`)
- `RESEND_API_KEY` - For v2 waitlist email confirmations (dev fallback: logs only)

**Secrets location:**
- `.env` file (git-ignored in `.gitignore`, never committed)
- `.env.local` file (git-ignored, local development overrides)
- Vercel Project Settings → Environment Variables (for production deployment)

## Webhooks & Callbacks

**Incoming:**
- None configured. No incoming webhooks from external services.

**Outgoing:**
- None configured. Game does not send webhooks to external services.

---

## Integration Details

### Gemini TTS (Text-to-Speech)

**File:** `api/speak.ts`
- Endpoint: `/api/speak` (POST)
- Request body: `{ text: string, voiceName?: string }`
  - Default voice: "Kore"
  - Available voices: mapped via personality type
- Response: `{ audio: string }` (base64-encoded PCM) or `{ error: string }`
- Gemini API call: POST to `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent`
- Audio format: PCM (16-bit, 24kHz sample rate, single channel)
- Decoded client-side: `services/geminiService.ts:14-31` converts base64 to AudioBuffer

### Gemini Roast Generation

**File:** `api/roast.ts`
- Endpoint: `/api/roast` (POST)
- Request body: `{ workflow: string, personality: "ROASTER" | "ZEN_MASTER" | "LOVEBOMBER" }`
- Response: `{ text: string }` (roast commentary under 80 words) or `{ error: string }`
- Fallback chain: tries `gemini-2.5-flash-lite` first, then `gemini-2.5-flash` (line 48)
- Gemini API call: POST to `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- Error response: "The auditors found your workflow so bad they broke my AI." (fallback)

### Gemini Live API (Streaming Audio)

**File:** `services/geminiLive.ts`
- Browser-direct WebSocket connection (no backend proxy)
- Authentication: Ephemeral token (obtained via POST to `https://generativelanguage.googleapis.com/v1beta/tokens?key={apiKey}`)
  - Token expires ~1 hour after issuance
  - Endpoint: `getEphemeralToken()` at line 38
- Model: `gemini-2.5-flash-native-audio-latest` (line 95)
- Features:
  - Streaming audio response (24kHz) via WebSocket
  - Personality-specific system instructions (defined at lines 282-295)
  - Input transcription (user speech-to-text, handled at line 206)
  - Output transcription (AI response text, handled at line 186)
  - Timeout: 15 seconds for connection (line 121)
- Error handling: Falls back to `getQuickRoast()` (line 301) if Live API unavailable
- Used by: `useRoast` hook (consumed for gameplay roasts)

### V2 Waitlist Email Signup

**File:** `api/v2-waitlist.ts`
- Endpoint: `/api/v2-waitlist` (POST)
- Request body: `{ email: string, role: string, archetype: string, resilience: number, timestamp: number }`
- Validation: Email regex (line 4), required fields (line 10-24)
- Response: `{ success: true, message: string, email: string }` or `{ error: string }`
- Email service:
  - Production: Resend API if `RESEND_API_KEY` set (line 55)
  - Development: Logs signup to console (line 94)
  - Resend API call: POST to `https://api.resend.com/emails` with header `Authorization: Bearer {RESEND_API_KEY}`
  - Email template: HTML confirmation with role/archetype/resilience info (lines 67-75)

---

*Integration audit: 2026-03-28*
