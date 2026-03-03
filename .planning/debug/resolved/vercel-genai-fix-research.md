# Vercel + @google/genai Fix Research

**Problem:** `/api/roast` and `/api/speak` crash with `FUNCTION_INVOCATION_FAILED` on Vercel. Root cause: `@google/genai` module not bundled correctly—runtime looks for `/var/task/node_modules/@google/genai/dist/node/index.cjs` and fails.

---

## Option 1: Direct REST API (Recommended)

**Approach:** Replace `@google/genai` SDK with `fetch()` to Gemini's REST endpoint. No SDK = no bundling issues.

**Endpoint (text):**
```
POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
Header: x-goog-api-key: {GEMINI_API_KEY}
Body: { "contents": [{ "parts": [{ "text": "..." }] }] }
```

**Endpoint (TTS):** Same endpoint, add to body:
```json
{
  "contents": [{ "parts": [{ "text": "..." }] }],
  "generationConfig": {
    "responseModalities": ["AUDIO"],
    "speechConfig": {
      "voiceConfig": {
        "prebuiltVoiceConfig": { "voiceName": "Kore" }
      }
    }
  }
}
```

**Pros:** Zero dependency on Google SDK, guaranteed to work on Vercel, minimal code  
**Cons:** Must parse REST response format (candidates[0].content.parts[0].text vs inlineData for audio)  
**Source:** [Vercel community workaround](https://community.vercel.com/t/googlegenerativeai-client-library-failing-on-vercel/23473) — "we are currently resorting to making direct HTTP requests to the Gemini API as a workaround"

---

## Option 2: @ai-sdk/google (Vercel AI SDK)

**Approach:** Use Vercel's official `@ai-sdk/google` + `ai` packages. Designed for serverless.

**Usage:**
```ts
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const { text } = await generateText({
  model: google('gemini-2.5-flash'),
  prompt: '...',
});
```

**Env var:** Uses `GOOGLE_GENERATIVE_AI_API_KEY` by default (or pass `apiKey` in `createGoogleGenerativeAI`).

**Pros:** Vercel-maintained, streaming support, type-safe  
**Cons:** Adds `ai` + `@ai-sdk/google`; TTS (speak) uses different API—`generateText` is text-only. Would need to keep REST for `/api/speak` or find AI SDK TTS support.

**Source:** [AI SDK Google Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai)

---

## Option 3: includeFiles (Attempted, Failed)

**Approach:** Force Vercel to bundle `node_modules/@google/genai/**` via `vercel.json`.

**Config tried:**
```json
{
  "functions": {
    "api/*.ts": {
      "includeFiles": "node_modules/@google/genai/**",
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

**Result:** Still `FUNCTION_INVOCATION_FAILED`.  
**Source:** [Vercel Community](https://community.vercel.com/t/cannot-find-module-for-google-genai-for-serverless-function/13995) — worked for one user with Next.js `app/api/**/*.js` path; may be framework/path dependent.

---

## Option 4: @google/generative-ai (Legacy)

**Approach:** Use older `@google/generative-ai` package instead of `@google/genai`.

**Result:** [Another user](https://community.vercel.com/t/googlegenerativeai-client-library-failing-on-vercel/23473) reports different failure: `new GoogleGenerativeAI(apiKey)` returns `{ apiKey }` instead of class instance—`genAIInstance.listModels is not a function`. Suggests Vercel runtime interference with class instantiation. **Not recommended.**

---

## Recommendation

**Implement Option 1 (Direct REST)** for both `/api/roast` and `/api/speak`:

1. Remove `@google/genai` from API routes.
2. Use `fetch()` to `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`.
3. Parse response: text from `candidates[0].content.parts[0].text`, base64 audio from `candidates[0].content.parts[0].inlineData.data`.

This avoids all SDK bundling and has been validated as a working workaround by other Vercel users.
