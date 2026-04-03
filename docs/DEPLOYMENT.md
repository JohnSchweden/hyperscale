# Deployment/Operations Guide

## Overview

K-Maru: The Hyperscale Chronicles is deployed on **Vercel** as a static SPA with serverless API routes. The build is handled by Vite, and GitHub Actions run CI on every push and PR.

| Property | Value |
|----------|-------|
| Platform | Vercel |
| Build Tool | Vite 6 |
| Package Manager | bun |
| Node Version | 24.x |
| Serverless Runtime | `@vercel/node` (maxDuration: 30s) |
| CI | GitHub Actions |

---

## Environment Variables

### Required Variables

| Variable | Scope | Description | Where to Set |
|----------|-------|-------------|--------------|
| `VITE_GEMINI_API_KEY` | Client (build-time) | Google Gemini API key for Live API (browser WebSocket) | Vercel → Settings → Environment Variables |
| `GEMINI_API_KEY` | Server (runtime) | Google Gemini API key for serverless routes (`/api/speak`, `/api/roast`) | Vercel → Settings → Environment Variables |

### Optional Variables

| Variable | Scope | Default | Description |
|----------|-------|---------|-------------|
| `RESEND_API_KEY` | Server (runtime) | _(unset)_ | Resend API key for v2 waitlist confirmation emails. Without it, signups log to console only |
| `VITE_ENABLE_SPEECH` | Client (build-time) | `true` | Set to `false` to disable TTS globally |
| `VITE_TTS_FALLBACK_ENABLED` | Client (build-time) | `false` | Enable TTS fallback when Live API fails |
| `VITE_STT_LOW_LATENCY` | Client (build-time) | `false` | Disable echo cancellation/noise suppression for faster STT (reduces quality in noisy environments) |

### Configuring in Vercel

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add each variable with the correct scope:
   - **Production** — for live deployments
   - **Preview** — for preview deployments (optional)
   - **Development** — for `vercel dev` local runs
3. Select the appropriate environment(s) for each variable
4. Client variables (`VITE_*`) must be marked as **Client** so they are exposed to the browser at build time
5. Server variables (`GEMINI_API_KEY`, `RESEND_API_KEY`) should remain **Server-only**

### Local Development

Copy `.env.example` to `.env.local` and fill in values:

```sh
cp .env.example .env.local
```

`.env.local` is git-ignored and never committed.

---

## Deploying to Vercel

### Prerequisites

- Vercel account connected to GitHub
- Repository pushed to GitHub
- Gemini API key obtained from [Google AI Studio](https://aistudio.google.com/)
- (Optional) Resend API key from [Resend](https://resend.com/)

### Step-by-Step Deployment

#### 1. Connect Repository

```
Vercel Dashboard → New Project → Import Git Repository
```

Select the `k-maru-the-hyperscale-chronicles` repository.

#### 2. Configure Build Settings

Vercel auto-detects Vite. Verify these settings:

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Build Command | `vite build` |
| Output Directory | `dist` |
| Install Command | `bun install` |
| Node.js Version | `24.x` |

#### 3. Set Environment Variables

Add all required variables from the [Environment Variables](#environment-variables) section above.

#### 4. Deploy

Click **Deploy**. Vercel will:
1. Install dependencies via `bun install`
2. Run `vite build` to produce static assets in `dist/`
3. Deploy serverless functions from `api/`
4. Serve the SPA with CDN caching

### Deployment Configuration

The `vercel.json` file configures serverless function timeouts:

```json
{
  "functions": {
    "api/*.ts": {
      "maxDuration": 30
    }
  }
}
```

All API routes (`/api/speak`, `/api/roast`, `/api/v2-waitlist`) have a 30-second timeout.

### Auto-Deploy on Push

Once connected, Vercel automatically deploys on every push to `main`. Preview deployments are created for every PR.

---

## CI/CD Pipeline

### GitHub Actions Workflow

**File:** `.github/workflows/ci.yml`

Triggers:
- Push to `main` or `master`
- Pull requests targeting `main` or `master`

### Pipeline Stages

| Stage | Command | Purpose |
|-------|---------|---------|
| Checkout | `actions/checkout@v4` | Pull repository |
| Setup Bun | `oven-sh/setup-bun@v2` | Install bun runtime |
| Install | `bun install --frozen-lockfile` | Install dependencies (deterministic) |
| Typecheck | `bun run typecheck` | TypeScript type checking |
| Lint | `bun run lint` | Biome linting |
| Build | `bun run build` | Vite production build |
| Install Playwright | `bun run playwright:install -- --with-deps` | Install browser binaries |
| Unit/Data Tests | `bun run vitest:run` | Vitest unit and data tests |
| E2E Tests | `bun run test` | Playwright end-to-end tests |

### Pre-Commit Hooks

Husky + lint-staged run on every commit:

| Hook | Command | Files |
|------|---------|-------|
| pre-commit | `biome check --write` | `*.{ts,tsx,js,jsx,json}` |

### Local CI Verification

Run the full pipeline locally before pushing:

```sh
bun run check && bun run typecheck && bun run test
```

For faster feedback during development:

```sh
bun run typecheck          # Type checking only
bun run test:smoke         # Smoke tests (~15s)
bun run test:area:gameplay # Area-specific tests
```

---

## API Routes

Three serverless API routes are deployed from the `api/` directory:

| Route | Method | Purpose | Required Env |
|-------|--------|---------|--------------|
| `/api/speak` | POST | Text-to-speech via Gemini TTS | `GEMINI_API_KEY` |
| `/api/roast` | POST | AI commentary generation | `GEMINI_API_KEY` |
| `/api/v2-waitlist` | POST | Waitlist signup + email | `RESEND_API_KEY` (optional) |

### `/api/speak`

Generates speech audio via Gemini 2.5 Flash Preview TTS.

**Request:**
```json
{
  "text": "string",
  "voiceName": "Kore | Puck | Zephyr"
}
```

**Response:**
```json
{
  "audio": "base64-encoded PCM data"
}
```

### `/api/roast`

Generates contextual AI commentary with fallback chain (lite → flash).

**Request:**
```json
{
  "workflow": "string",
  "personality": "ROASTER | ZEN_MASTER | LOVEBOMBER"
}
```

**Response:**
```json
{
  "text": "AI commentary string"
}
```

### `/api/v2-waitlist`

Handles waitlist signups with optional email confirmation.

**Request:**
```json
{
  "email": "user@example.com",
  "role": "string",
  "archetype": "string",
  "resilience": 75,
  "timestamp": 1640995200000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for joining the V2 waitlist!",
  "email": "user@example.com"
}
```

---

## API Key Management

### Gemini API Key

**Obtaining a key:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create or select a project
3. Generate an API key under **Get API key**

**Rotation procedure:**

1. Generate a new key in Google AI Studio
2. Update in Vercel:
   ```
   Vercel Dashboard → Project → Settings → Environment Variables
   ```
   Update both `VITE_GEMINI_API_KEY` and `GEMINI_API_KEY`
3. Redeploy to apply client-side changes (rebuild required for `VITE_*` vars):
   ```sh
   vercel --prod
   ```
   Or trigger via Vercel Dashboard → Deployments → Redeploy
4. Verify TTS and roast features work in production
5. Delete the old key in Google AI Studio

**Security best practices:**
- Never commit `.env` or `.env.local` to git (enforced by `.gitignore`)
- Use separate API keys for development and production
- Set usage quotas in Google Cloud Console to prevent abuse
- Monitor API usage in Google Cloud Console for anomalies
- Rotate keys on a regular schedule (quarterly recommended)
- Restrict API key to specific APIs (Generative Language API only)

### Resend API Key

**Rotation procedure:**

1. Generate new key in [Resend Dashboard](https://resend.com/)
2. Update `RESEND_API_KEY` in Vercel environment variables
3. No redeploy needed (server-only variable, read at runtime)
4. Verify waitlist emails are delivered
5. Revoke old key in Resend Dashboard

---

## Monitoring

### Vercel Dashboard

Monitor these metrics in the Vercel project dashboard:

| Metric | Location | What to Watch |
|--------|----------|---------------|
| Deployments | Deployments tab | Failed builds, long build times |
| Function Invocations | Functions tab | Error rates, cold starts, timeouts |
| Analytics | Analytics tab | Page views, Core Web Vitals |
| Logs | Runtime Logs | Server-side errors, API failures |

### Vercel Analytics

`@vercel/analytics` is embedded in the app and automatically tracks:
- Page views
- User interactions
- Web Vitals (LCP, INP, CLS)

No additional configuration needed. View metrics in the Vercel dashboard under **Analytics**.

### What to Monitor

| Area | Indicator | Action |
|------|-----------|--------|
| Gemini API | 429/500 errors in runtime logs | Check quota, rotate key, enable fallback |
| TTS Failures | Missing audio in gameplay | Check `VITE_ENABLE_SPEECH`, verify API key |
| Serverless Timeouts | Functions exceeding 30s | Optimize prompts, check Gemini latency |
| Build Failures | CI pipeline red | Fix type errors, lint issues, test failures |
| Waitlist Emails | Resend API errors | Verify `RESEND_API_KEY`, check Resend dashboard |

### Browser Console

For client-side debugging, check browser DevTools console for:
- `TTS Error:` — Gemini TTS failures
- `Roast Error:` — AI commentary generation failures
- `[V2 Waitlist]` — Waitlist signup issues

---

## Production Checklist

### Pre-Deployment

- [ ] All environment variables set in Vercel (both client and server)
- [ ] `bun run typecheck` passes locally
- [ ] `bun run lint` passes locally
- [ ] `bun run test` passes locally (or at minimum `bun run test:smoke`)
- [ ] `bun run build` succeeds locally
- [ ] Gemini API key has sufficient quota
- [ ] (Optional) Resend API key configured for waitlist emails
- [ ] No `.env` or `.env.local` files committed to git
- [ ] `vercel.json` function timeout is appropriate (default: 30s)
- [ ] Audio assets compressed (`bun run compress:existing`)
- [ ] Branch is up to date with `main`

### Post-Deployment

- [ ] Production URL loads without errors
- [ ] TTS works (speak a card, verify audio plays)
- [ ] Roast generation works (swipe a card, verify AI commentary)
- [ ] All game stages accessible (Intro → Personality → Role → Playing → Boss → Summary)
- [ ] Waitlist signup works (submit form, verify response)
- [ ] Vercel Analytics reporting data
- [ ] No errors in Vercel Runtime Logs
- [ ] Core Web Vitals within acceptable range

---

## Rollback Procedures

### Vercel Rollback

Vercel keeps a history of all deployments. To rollback:

1. Go to **Vercel Dashboard** → Project → **Deployments**
2. Find the last known-good deployment
3. Click the deployment → **...** menu → **Promote to Production**
4. Confirm the promotion

This instantly switches production traffic to the selected deployment.

### CLI Rollback

```sh
# List recent deployments
vercel deployments ls

# Promote a specific deployment to production
vercel deployments promote <deployment-url-or-id>
```

### Emergency Rollback

If a deployment introduces a critical bug:

1. Immediately promote the previous deployment via Vercel Dashboard
2. Revert the problematic commit in git:
   ```sh
   git revert <bad-commit-hash>
   git push origin main
   ```
3. Verify the rollback deployment succeeds
4. Investigate and fix the issue in a separate branch

### Important Notes

- Environment variable changes require a redeploy for client-side (`VITE_*`) variables to take effect
- Server-only variable changes take effect immediately without redeploy
- Preview deployments are isolated and do not affect production

---

## Troubleshooting Production Issues

### TTS Not Working

**Symptoms:** No audio plays during gameplay.

**Debug steps:**

1. Check `VITE_ENABLE_SPEECH` is not set to `false` in Vercel
2. Verify `GEMINI_API_KEY` is set and valid in Vercel
3. Check Vercel Runtime Logs for `TTS Error:` entries
4. Test the `/api/speak` endpoint manually:
   ```sh
   curl -X POST https://<your-domain>/api/speak \
     -H "Content-Type: application/json" \
     -d '{"text":"test","voiceName":"Kore"}'
   ```
5. Check Gemini API quota in Google Cloud Console

### Roast Generation Failing

**Symptoms:** AI commentary shows default fallback message.

**Debug steps:**

1. Check Vercel Runtime Logs for `Roast Error:` entries
2. Verify `GEMINI_API_KEY` is valid and has quota
3. The roast endpoint has a fallback chain (lite → flash) — if both fail, the hardcoded fallback message is returned
4. Test manually:
   ```sh
   curl -X POST https://<your-domain>/api/roast \
     -H "Content-Type: application/json" \
     -d '{"workflow":"test","personality":"ROASTER"}'
   ```

### Build Failures

**Symptoms:** Deployment fails during build step.

**Common causes:**

| Cause | Fix |
|-------|-----|
| TypeScript errors | Run `bun run typecheck` locally, fix errors |
| Lint errors | Run `bun run lint` locally, fix or `bun run lint:fix` |
| Missing dependencies | Run `bun install`, commit `bun.lock` |
| Env vars not set | Add required variables in Vercel settings |
| Node version mismatch | Ensure `engines.node` in `package.json` matches Vercel setting |

### Serverless Function Timeouts

**Symptoms:** API routes return 504 Gateway Timeout.

**Debug steps:**

1. Check Vercel Runtime Logs for slow function invocations
2. Gemini API latency can vary — check Google Cloud status page
3. Current timeout is 30s (configured in `vercel.json`)
4. If consistently timing out, consider:
   - Reducing prompt complexity
   - Adding request-level timeouts
   - Increasing `maxDuration` in `vercel.json` (max 60s for Hobby/Pro)

### Waitlist Email Not Sending

**Symptoms:** Waitlist form submits successfully but no email received.

**Debug steps:**

1. Check if `RESEND_API_KEY` is set in Vercel
2. Check Vercel Runtime Logs for `[V2 Waitlist]` entries
3. Verify Resend domain is verified (if using custom domain)
4. Check Resend dashboard for delivery status
5. In development (no `RESEND_API_KEY`), emails are logged to console only — this is expected

### Gemini Live API Connection Issues

**Symptoms:** Live API streaming audio fails to connect.

**Debug steps:**

1. Verify `VITE_GEMINI_API_KEY` is set and valid
2. Check browser console for WebSocket connection errors
3. Ephemeral tokens expire after ~1 hour — the client handles re-authentication
4. The app falls back to `getQuickRoast()` if Live API is unavailable
5. Check `VITE_TTS_FALLBACK_ENABLED` is set to `true` if fallback is desired

### CORS Issues

**Symptoms:** API routes blocked by CORS in production.

Vercel handles CORS automatically for serverless functions. If CORS errors occur:

1. Verify the request origin matches the deployed domain
2. Check that API routes are being called from the same origin
3. Vercel's edge network handles preflight requests automatically

---

## External Services Reference

| Service | Purpose | Dashboard | Status Page |
|---------|---------|-----------|-------------|
| Google Gemini AI | TTS, roast generation, Live API | [AI Studio](https://aistudio.google.com/) | [Google Cloud Status](https://status.cloud.google.com/) |
| Resend | Waitlist confirmation emails | [Resend Dashboard](https://resend.com/) | [Resend Status](https://status.resend.com/) |
| Vercel | Hosting, serverless functions, analytics | [Vercel Dashboard](https://vercel.com/) | [Vercel Status](https://www.vercel-status.com/) |
