# External Integrations

**Analysis Date:** 2026-03-01

## APIs & External Services

**AI/ML:**
- **Google Gemini** - Text generation and Text-to-Speech
  - SDK: `@google/genai` v1.40.0
  - Models used:
    - `gemini-2.5-flash-preview-tts` - For speech generation (TTS)
    - `gemini-2.5-flash-lite` - Fallback for text generation
    - `gemini-2.5-flash` - Primary for satirical roast generation
  - Features:
    - `getRoast()` - Generates satirical feedback based on user's workflow
    - `speak()` - Generates audio from text using TTS model
  - Auth: `GEMINI_API_KEY` environment variable
  - Location: `services/geminiService.ts`

## CDN Resources

**Styles:**
- Tailwind CSS - `https://cdn.tailwindcss.com`
- Font Awesome 6.4.0 - `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`

**Fonts:**
- Google Fonts (Space Grotesk, JetBrains Mono)

## Data Storage

**Local State:**
- React useState/useReducer - Game state management
- No external database required

**Static Assets:**
- Pre-recorded voice audio files in `public/audio/voices/`
  - Organized by personality: `roast_con/`, `zen_con/`, `hype_con/`
  - Triggers: `onboarding.wav`, `failure.wav`, `victory.wav`, etc.

**Caching:**
- None configured (browser-based SPA)

## Authentication & Identity

**Auth Provider:**
- None - Public application, no user accounts
- No login/registration functionality

## Monitoring & Observability

**Error Tracking:**
- Console logging - Primary error reporting
- No external error tracking service (Sentry, Bugsnag, etc.)

**Logs:**
- Browser console via `console.log`, `console.error`, `console.warn`
- Service: Standard browser console output

## CI/CD & Deployment

**Hosting:**
- Static deployment (Vite builds to `dist/`)
- No specific hosting platform configured
- Could deploy to: Vercel, Netlify, GitHub Pages, AWS S3, etc.

**CI Pipeline:**
- Playwright tests - configured in `playwright.config.ts`
- Command: `bun run test` runs `bunx playwright test`
- Test config: Desktop Chrome (1280x720) and Mobile Chrome (Pixel 5)

## Environment Configuration

**Required env vars:**
- `GEMINI_API_KEY` - Google AI API key (required for roast/TTS features)
  - Set in both `.env` and `.env.local`
  - Current value in repo: `[REDACTED]`[REDACTED - rotate if ever exposed]
- `VITE_ENABLE_SPEECH` - Boolean flag to enable/disable TTS
  - Currently set to `false` in `.env`

**Secrets location:**
- `.env` and `.env.local` files in project root
- Note: `.env` is committed to git (should be moved to `.gitignore`)

## Webhooks & Callbacks

**Incoming:**
- None - Client-side only, no backend endpoints

**Outgoing:**
- Google Gemini API calls - For text generation and TTS
- CDN requests - For Tailwind CSS, Font Awesome, Google Fonts

## Audio Handling

**TTS (Text-to-Speech):**
- Uses Google Gemini's `gemini-2.5-flash-preview-tts` model
- Returns base64-encoded audio
- Decoded and played via Web Audio API (`AudioContext`)
- Sample rate: 24000 Hz
- Voices: Prebuilt voices (e.g., 'Kore')

**Pre-recorded Audio:**
- Stored in `public/audio/voices/{personality}/{trigger}.wav`
- Fetched at runtime via `fetch()` in `services/voicePlayback.ts`
- Triggers: onboarding, failure, victory, feedback_*

---

*Integration audit: 2026-03-01*
