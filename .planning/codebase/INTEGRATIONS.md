# SwipeRisk External Integrations

## Overview

SwipeRisk integrates with several external services to provide AI-powered gameplay features, voice synthesis, and deployment. This document details all external dependencies, their configurations, and usage patterns.

---

## AI Services

### Google Gemini API

**Primary AI provider for all dynamic content generation.**

#### SDK
- **Package:** `@google/genai` v1.40.0
- **Documentation:** https://ai.google.dev/

#### Models Used

| Model | Purpose | Fallback Order |
|-------|---------|----------------|
| `gemini-2.5-flash-lite` | Roast generation (fast, cost-effective) | Primary |
| `gemini-2.5-flash` | Roast generation (higher quality) | Secondary |
| `gemini-2.5-flash-preview-tts` | Text-to-speech synthesis | Primary |

#### API Routes

##### 1. Roast Generation (`/api/roast.ts`)

Generates personality-driven AI roasts based on user workflows.

```typescript
// Request
POST /api/roast
{
  "workflow": "string",      // User's AI workflow description
  "personality": "ROASTER" | "ZEN_MASTER" | "LOVEBOMBER"
}

// Response
{
  "text": "string"           // Generated roast (under 50 words)
}
```

**Implementation Details:**
- Fallback chain: `gemini-2.5-flash-lite` → `gemini-2.5-flash`
- Personality-specific tone instructions
- Analyzes workflow for public vs. private tool usage
- Error response: "The auditors found your workflow so bad they broke my AI."

##### 2. Text-to-Speech (`/api/speak.ts`)

Converts text to speech using Gemini's native TTS capability.

```typescript
// Request
POST /api/speak
{
  "text": "string",          // Text to synthesize
  "voiceName": "Kore"        // Optional, defaults to "Kore"
}

// Response
{
  "audio": "base64string"    // Base64-encoded PCM audio
}
```

**Implementation Details:**
- Returns 24kHz mono PCM audio
- Available voices: `Kore`, `Puck`, `Zephyr` (mapped to personalities)
- Client-side decoding via [`services/geminiService.ts`](services/geminiService.ts:1)

#### Authentication

**Environment Variables:**
```bash
# Server-side (Vercel functions)
GEMINI_API_KEY=your_api_key_here

# Client-side (browser)
VITE_GEMINI_API_KEY=your_api_key_here
```

**Security:**
- Server-side key used in API routes (protected)
- Client-side key for direct browser access (if needed)
- Keys stored in Vercel environment variables

---

## Voice & Audio

### Web Audio API

**Client-side audio playback for real-time TTS.**

**Usage:** [`services/geminiService.ts`](services/geminiService.ts:1)

```typescript
// AudioContext initialization
audioContext = new (window.AudioContext || window.webkitAudioContext)({ 
  sampleRate: 24000  // Matches Gemini TTS output
});

// Decoding PCM16 to AudioBuffer
const dataInt16 = new Int16Array(data.buffer);
const frameCount = dataInt16.length / numChannels;
const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
```

**Features:**
- 24kHz sample rate (matches Gemini output)
- Mono channel configuration
- Audio buffer source nodes for playback
- Proper cleanup on component unmount

### HTML5 Audio API

**Pre-recorded voice file playback.**

**Usage:** [`services/voicePlayback.ts`](services/voicePlayback.ts:1)

```typescript
// Loading and playing voice files
const response = await fetch('/audio/voices/roaster/onboarding.wav');
const arrayBuffer = await response.arrayBuffer();
const audioBlob = new Blob([audioData], { type: 'audio/wav' });
const audioUrl = URL.createObjectURL(audioBlob);

const audio = new Audio(audioUrl);
audio.volume = 0.6;  // 60% volume
await audio.play();
```

**Voice Assets:**

| Personality | Voice | Files |
|-------------|-------|-------|
| V.E.R.A. (Roaster) | Puck | `onboarding.wav`, `victory.wav`, `failure.wav` |
| BAMBOO (Zen Master) | Zephyr | `onboarding.wav`, `victory.wav`, `failure.wav` |
| HYPE-BRO (Lovebomber) | Kore | `onboarding.wav`, `victory.wav`, `failure.wav` |

**Additional Feedback Files:**
- `roaster/feedback_debug.wav`
- `roaster/feedback_ignore.wav`
- `roaster/feedback_install.wav`
- `roaster/feedback_paste.wav`

---

## Deployment Platform

### Vercel

**Primary hosting and serverless function platform.**

#### Configuration

**Serverless Functions:**
- **Location:** `/api/*.ts` files
- **Runtime:** Node.js with `@vercel/node` types
- **Routing:** Automatic based on file structure

```typescript
// api/roast.ts - Vercel function signature
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest, 
  res: VercelResponse
) {
  // Function implementation
}
```

#### Routes

| Route | File | Purpose |
|-------|------|---------|
| `/api/roast` | `api/roast.ts` | AI roast generation |
| `/api/speak` | `api/speak.ts` | Text-to-speech synthesis |

#### Local Development

**Proxy Configuration (Vite):**
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
}
```

**Local API Server:**
```bash
# Using Bun
bun run scripts/local-api.ts
```

---

## CDN Resources

### Tailwind CSS
- **URL:** `https://cdn.tailwindcss.com`
- **Usage:** Utility-first styling
- **Loaded:** In [`index.html`](index.html:15)

### Font Awesome
- **URL:** `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
- **Usage:** Icon system
- **Loaded:** In [`index.html`](index.html:16)

### Google Fonts
- **URL:** `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=optional`
- **Usage:** Typography
- **Loaded:** In [`index.html`](index.html:18) via CSS `@import`

---

## Environment Configuration

### Required Environment Variables

```bash
# .env.example

# Client-side API key (used by frontend code)
VITE_GEMINI_API_KEY=your_api_key_here

# Server-side API key (used by Vercel API routes)
GEMINI_API_KEY=your_api_key_here

# Client-side flag to disable TTS
VITE_ENABLE_SPEECH=false
```

### Variable Prefixes

| Prefix | Scope | Usage |
|--------|-------|-------|
| `VITE_` | Client-side | Accessible in browser code via `import.meta.env` |
| No prefix | Server-side | Vercel functions only |

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  React App   │  │ Web Audio API│  │ HTML5 Audio API  │  │
│  │              │  │  (TTS play)  │  │ (voice files)    │  │
│  └──────┬───────┘  └──────────────┘  └──────────────────┘  │
│         │                                                    │
│         │ fetch('/api/roast')                                │
│         │ fetch('/api/speak')                                │
│         ▼                                                    │
│  ┌──────────────┐                                            │
│  │  Vite Proxy  │  (dev only)                                │
│  │  localhost   │                                            │
│  └──────┬───────┘                                            │
└─────────┼────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Production)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ /api/roast   │  │ /api/speak   │  │ Static Assets    │  │
│  │  (Node.js)   │  │  (Node.js)   │  │ (audio/voices)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────┘  │
│         │                  │                                 │
│         └──────────────────┘                                 │
│                    │                                         │
│         ┌──────────▼──────────┐                             │
│         │   Google Gemini API │                             │
│         │   @google/genai     │                             │
│         └─────────────────────┘                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Error Handling

### AI Service Failures

**Roast Generation:**
- Attempts primary model, falls back to secondary
- Returns witty error message if all models fail
- Logs errors to console for debugging

**TTS Generation:**
- Validates API key presence
- Returns 500 with descriptive error message
- Client gracefully handles missing audio

### Audio Playback

**Web Audio API:**
- Handles suspended AudioContext (browser autoplay policies)
- Cleans up source nodes to prevent memory leaks
- Feature flag `VITE_ENABLE_SPEECH` to disable entirely

**HTML5 Audio:**
- Preload audio files
- Error messages mapped to personality voice
- Volume fixed at 60% to prevent audio shock

---

## Rate Limits & Quotas

### Google Gemini API

| Model | Rate Limit | Quota |
|-------|------------|-------|
| gemini-2.5-flash-lite | Check Google AI Studio | Per-project |
| gemini-2.5-flash | Check Google AI Studio | Per-project |
| gemini-2.5-flash-preview-tts | Check Google AI Studio | Per-project |

**Best Practices:**
- Implement client-side caching for repeated content
- Use `gemini-2.5-flash-lite` as primary for cost efficiency
- Monitor usage in Google Cloud Console

---

## Security Considerations

1. **API Key Storage:**
   - Server-side keys in Vercel environment variables
   - Client-side keys prefixed with `VITE_`
   - Never commit `.env` files (see `.gitignore`)

2. **CORS:**
   - API routes handle CORS via Vercel's default behavior
   - Proxy in development avoids CORS issues

3. **Input Validation:**
   - API routes validate required fields
   - TypeScript ensures type safety at build time

4. **Content Security:**
   - CDN resources use HTTPS
   - Audio files served from same origin
