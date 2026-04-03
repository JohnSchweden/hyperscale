# API Routes

K-Maru serverless API routes deployed on Vercel. All routes live under the `/api/` directory and are served as Vercel Functions.

## Overview

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| `/api/roast` | POST | Generate AI roast commentary via Gemini | Server API key |
| `/api/speak` | POST | Text-to-speech via Gemini TTS | Server API key |
| `/api/v2-waitlist` | POST | V2 waitlist email signup | None |

**Infrastructure:**
- Runtime: Vercel Serverless Functions (Node.js)
- Max duration: 30s (configured in `vercel.json`)
- Source: `api/*.ts`

---

## Authentication & Rate Limiting

### Authentication

| Route | Mechanism | Details |
|-------|-----------|---------|
| `/api/roast` | Server-side API key | `GEMINI_API_KEY` env var; authenticates to Google Gemini API |
| `/api/speak` | Server-side API key | `GEMINI_API_KEY` env var; authenticates to Google Gemini API |
| `/api/v2-waitlist` | None | Open endpoint; email validation only |

No client-facing authentication (no user accounts, sessions, or tokens required).

### Rate Limiting

No explicit rate limiting is configured on any route. Rate limits are inherited from:
- **Vercel Function limits** — per-deployment and per-account quotas
- **Google Gemini API limits** — governed by the API key's quota tier
- **Resend API limits** — governed by the Resend account tier (email sending only)

---

## Routes

### POST /api/roast

Generates contextual AI roast commentary based on a user's described AI workflow and selected personality.

**Source:** `api/roast.ts`

#### Purpose

Accepts a workflow description and personality type, constructs a prompt with personality-specific tone instructions, and returns AI-generated commentary (~80 words) analyzing the workflow's security posture.

#### Request

**Headers:**

| Header | Required | Value |
|--------|----------|-------|
| `Content-Type` | Yes | `application/json` |

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `workflow` | string | Yes | User's AI workflow description |
| `personality` | string | Yes | One of: `ROASTER`, `ZEN_MASTER`, `LOVEBOMBER` |

**Example request body:**

```json
{
  "workflow": "I use Claude to write production code and deploy it directly without review",
  "personality": "ROASTER"
}
```

#### Response

**200 OK:**

| Field | Type | Description |
|-------|------|-------------|
| `text` | string | Generated roast commentary |

```json
{
  "text": "Even for you, this is remarkably insecure."
}
```

**400 Bad Request:**

```json
{
  "error": "Missing workflow or personality"
}
```

**500 Internal Server Error:**

```json
{
  "error": "Server configuration error"
}
```

or

```json
{
  "error": "Roast generation failed"
}
```

or (all Gemini models exhausted):

```json
{
  "error": "The auditors found your workflow so bad they broke my AI."
}
```

#### Personality Mapping

| Input Value | Display Name | Tone |
|-------------|--------------|------|
| `ROASTER` | V.E.R.A. | Sarcastic, witty, cynical, British humor |
| `ZEN_MASTER` | BAMBOO | Calm, meditative, passive-aggressive, zen koans |
| `LOVEBOMBER` | HYPE-BRO | High-energy, Silicon Valley influencer style |

#### Model Fallback Chain

The route attempts models in order:
1. `gemini-2.5-flash-lite`
2. `gemini-2.5-flash`

If the first model fails, it silently tries the second. If both fail, returns a 500.

#### External Call

```
POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
Headers: x-goog-api-key: {GEMINI_API_KEY}
```

#### Examples

**curl:**

```bash
curl -X POST https://your-domain.vercel.app/api/roast \
  -H "Content-Type: application/json" \
  -d '{"workflow": "I paste customer data into ChatGPT for analysis", "personality": "ROASTER"}'
```

**fetch:**

```typescript
const response = await fetch("/api/roast", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    workflow: "I use AI to auto-respond to all Slack messages",
    personality: "ZEN_MASTER",
  }),
});
const { text } = await response.json();
```

---

### POST /api/speak

Converts text to speech using Google Gemini TTS and returns base64-encoded audio.

**Source:** `api/speak.ts`

#### Purpose

Accepts text and an optional voice name, calls the Gemini TTS model, and returns base64-encoded PCM audio data for client-side playback.

#### Request

**Headers:**

| Header | Required | Value |
|--------|----------|-------|
| `Content-Type` | Yes | `application/json` |

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | Yes | Text to convert to speech |
| `voiceName` | string | No | Voice name (default: `Kore`) |

**Example request body:**

```json
{
  "text": "Brilliant. You just open-sourced our trade secrets.",
  "voiceName": "Puck"
}
```

#### Response

**200 OK:**

| Field | Type | Description |
|-------|------|-------------|
| `audio` | string | Base64-encoded PCM audio data |

```json
{
  "audio": "UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
}
```

**400 Bad Request:**

```json
{
  "error": "Missing text"
}
```

**500 Internal Server Error:**

```json
{
  "error": "Server configuration error"
}
```

or

```json
{
  "error": "TTS generation failed"
}
```

or (no audio data returned):

```json
{
  "error": "No audio generated"
}
```

#### Voice Options

| Voice | Personality | Character |
|-------|-------------|-----------|
| `Puck` | ROASTER | V.E.R.A. — British, sarcastic |
| `Zephyr` | ZEN_MASTER | BAMBOO — Calm, flowing |
| `Kore` | LOVEBOMBER | HYPE-BRO — Energetic, enthusiastic |

#### Audio Format

- Format: PCM
- Bit depth: 16-bit
- Sample rate: 24kHz
- Channels: Single (mono)

Client-side decoding is handled by `services/geminiService.ts`.

#### External Call

```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent
Headers: x-goog-api-key: {GEMINI_API_KEY}
```

#### Examples

**curl:**

```bash
curl -X POST https://your-domain.vercel.app/api/speak \
  -H "Content-Type: application/json" \
  -d '{"text": "Welcome to HyperScale Inc.", "voiceName": "Kore"}'
```

**fetch:**

```typescript
const response = await fetch("/api/speak", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "Your compliance score is abysmal.",
    voiceName: "Puck",
  }),
});
const { audio } = await response.json();
```

---

### POST /api/v2-waitlist

Handles V2 waitlist signups with email validation and optional confirmation email delivery.

**Source:** `api/v2-waitlist.ts`

#### Purpose

Accepts waitlist signup data, validates the payload, logs the signup, and optionally sends a confirmation email via Resend (production) or logs to console (development).

#### Request

**Headers:**

| Header | Required | Value |
|--------|----------|-------|
| `Content-Type` | Yes | `application/json` |

**Body** (type: `V2WaitlistPayload`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Valid email address |
| `role` | string | Yes | Player's role (e.g., `SOFTWARE_ENGINEER`) |
| `archetype` | string | Yes | Player's archetype (e.g., `PRAGMATIST`) |
| `resilience` | number | Yes | Resilience score (0-100) |
| `timestamp` | number | Yes | Signup timestamp (Unix ms) |

**Example request body:**

```json
{
  "email": "user@example.com",
  "role": "SOFTWARE_ENGINEER",
  "archetype": "PRAGMATIST",
  "resilience": 75,
  "timestamp": 1743638400000
}
```

#### Response

**200 OK:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` on success |
| `message` | string | Confirmation message |
| `email` | string | Echoed email address |

```json
{
  "success": true,
  "message": "Thank you for joining the V2 waitlist!",
  "email": "user@example.com"
}
```

**400 Bad Request:**

```json
{
  "error": "Invalid email format or missing fields"
}
```

**405 Method Not Allowed:**

```json
{
  "error": "Method not allowed"
}
```

**500 Internal Server Error:**

```json
{
  "error": "Something went wrong. Please try again."
}
```

#### Email Delivery

| Environment | Behavior |
|-------------|----------|
| Production (`RESEND_API_KEY` set) | Sends confirmation email via Resend API |
| Development (no `RESEND_API_KEY`) | Logs signup to console only |

Email delivery failures are logged but do not cause the signup to fail.

#### External Call (Production Only)

```
POST https://api.resend.com/emails
Headers: Authorization: Bearer {RESEND_API_KEY}
```

#### Examples

**curl:**

```bash
curl -X POST https://your-domain.vercel.app/api/v2-waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "role": "SOFTWARE_ENGINEER",
    "archetype": "PRAGMATIST",
    "resilience": 75,
    "timestamp": 1743638400000
  }'
```

**fetch:**

```typescript
const response = await fetch("/api/v2-waitlist", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    role: "SOFTWARE_ENGINEER",
    archetype: "PRAGMATIST",
    resilience: 75,
    timestamp: Date.now(),
  }),
});
const body = await response.json();
```

---

## Error Handling

### Error Code Reference

| Status Code | Meaning | Routes |
|-------------|---------|--------|
| 200 | Success | All routes |
| 400 | Bad Request — missing or invalid fields | `roast`, `speak`, `v2-waitlist` |
| 405 | Method Not Allowed — wrong HTTP method | `v2-waitlist` only |
| 500 | Internal Server Error — configuration or upstream failure | All routes |

### Error Response Format

All errors return a JSON object with an `error` field:

```json
{
  "error": "Human-readable error message"
}
```

### Error Scenarios

| Error Message | Cause | Resolution |
|---------------|-------|------------|
| `Missing workflow or personality` | `/api/roast` body missing required fields | Include both `workflow` and `personality` in request body |
| `Missing text` | `/api/speak` body missing `text` field | Include `text` in request body |
| `Server configuration error` | `GEMINI_API_KEY` not set in environment | Configure `GEMINI_API_KEY` in Vercel project settings |
| `Invalid email format or missing fields` | `/api/v2-waitlist` payload failed validation | Ensure all 5 fields present and email is valid format |
| `Method not allowed` | Non-POST request to `/api/v2-waitlist` | Use POST method |
| `Roast generation failed` | Unexpected error in roast handler | Retry; check server logs for details |
| `TTS generation failed` | Unexpected error in TTS handler | Retry; check server logs for details |
| `No audio generated` | Gemini TTS returned no audio data | Check `text` input; retry |
| `The auditors found your workflow so bad they broke my AI.` | All Gemini models failed for roast | Retry; check Gemini API status |
| `Something went wrong. Please try again.` | Unexpected error in waitlist handler | Retry; check server logs for details |

---

## Environment Variables

### Server-Side (API Routes)

| Variable | Required | Used By | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | Yes | `roast`, `speak` | Google Gemini API key for server-side calls |
| `RESEND_API_KEY` | No | `v2-waitlist` | Resend API key for confirmation emails |

### Client-Side

| Variable | Required | Used By | Description |
|----------|----------|---------|-------------|
| `VITE_GEMINI_API_KEY` | Yes | Gemini Live API (client) | API key for browser-based streaming audio |
| `VITE_ENABLE_SPEECH` | No | TTS UI | Feature flag for TTS (default: `"true"`) |
| `VITE_TTS_FALLBACK_ENABLED` | No | TTS fallback | Enable TTS fallback when Live API fails |
| `VITE_STT_LOW_LATENCY` | No | STT | Low-latency speech-to-text mode |

---

## Testing

### Local Development

Start the dev server:

```bash
bun run dev
```

API routes are available at `https://localhost:3000/api/*`.

**Test /api/roast:**

```bash
curl -X POST https://localhost:3000/api/roast \
  -H "Content-Type: application/json" \
  -d '{"workflow": "test workflow", "personality": "ROASTER"}'
```

**Test /api/speak:**

```bash
curl -X POST https://localhost:3000/api/speak \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world", "voiceName": "Kore"}'
```

**Test /api/v2-waitlist:**

```bash
curl -X POST https://localhost:3000/api/v2-waitlist \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "role": "ENGINEER", "archetype": "PRAGMATIST", "resilience": 75, "timestamp": 1743638400000}'
```

### Playwright Tests

**V2 Waitlist API tests** (`tests/debrief-email-api.spec.ts`):

```bash
# All waitlist API tests
bunx playwright test tests/debrief-email-api.spec.ts

# Single test
bunx playwright test tests/debrief-email-api.spec.ts -g "returns 200"
```

Test coverage:
- Valid payload returns 200 with success response
- Invalid email returns 400
- GET request returns 405
- Missing required fields returns 400
- Multiple archetypes accepted

**Live API + TTS fallback tests** (`tests/live-api.spec.ts`):

```bash
bunx playwright test tests/live-api.spec.ts --project=chromium-desktop
```

Test coverage:
- Live API text and audio generation
- TTS fallback when Live API is unavailable

### CI Testing

Tests run automatically via GitHub Actions. The Playwright config detects CI mode via `process.env.CI`.

```bash
# Full test suite
bun run test

# Smoke tests (fast)
bun run test:smoke

# Area-specific tests
bun run test:area:gameplay
```

### Manual Verification Checklist

| Route | Verify |
|-------|--------|
| `/api/roast` | Returns non-empty `text` for valid payload; returns 400 for missing fields |
| `/api/speak` | Returns base64 `audio` for valid text; returns 400 for missing text |
| `/api/v2-waitlist` | Returns 200 for valid payload; returns 400 for invalid email; returns 405 for GET |
