# Debug: 02-live-api — Live API Connection Fails Silently

**Created:** 2026-03-01  
**Status:** In progress

## Summary

Live API connection fails silently; app falls back to TTS without surfacing errors. User confirms API key has Live API access.

## Root Cause Analysis

### Flow

1. `getRoastWithFallback` → `getRoast()` (backend) → `playStreamingAudio(roastText)`
2. `playStreamingAudio` → `connectToLiveSession()` → `ai.live.connect()` (SDK)
3. SDK opens WebSocket to `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.{version}.GenerativeService.BidiGenerateContent?key={apiKey}`
4. If connect/stream fails → throw → catch → `speak()` TTS fallback

### Findings

| Area | Finding |
|------|---------|
| **Tests** | `mockRoastApi` blocks `**/*generativelanguage.googleapis.com*` → Live API always aborted in tests. 10–14s latency = TTS fallback. |
| **SDK** | Default `apiVersion` is v1beta. Ephemeral tokens require v1alpha; some Live API features may require v1alpha. |
| **Model** | Using `gemini-2.5-flash-native-audio-latest`. SDK examples use `gemini-live-2.5-flash-preview`. Both valid per docs. |
| **Known issue** | [js-genai#1257](https://github.com/googleapis/js-genai/issues/1257): `live.connect()` can hang in Safari/Bun when WebSocket connects-then-closes; `onopenPromise` never resolves. Error callbacks may fire but `connect()` never returns. |
| **Error visibility** | Fallback uses `console.warn`. Errors may be swallowed or not surfaced clearly. |

### Likely Causes (priority)

1. **API version** — Live API native audio may require `httpOptions: { apiVersion: 'v1alpha' }`
2. **Model availability** — `gemini-2.5-flash-native-audio-latest` may need allowlist/entitlement
3. **Silent error** — WebSocket fails but error isn’t logged clearly
4. **Connect hang** — In some envs, `connect()` hangs instead of rejecting

## Fixes Applied

1. Add `httpOptions: { apiVersion: 'v1alpha' }` to GoogleGenAI for Live API
2. Improve error logging (log full error, stack, and URL)
3. Add connection timeout (10s) to avoid indefinite hang
4. Surface fallback reason to console with structured data

## Verification

- Run `bun dev`, open http://localhost:5173
- Trigger roast, observe console for `[Gemini Live]` and `[roastService]`
- Without mocks: expect either `[Gemini Live] Connected` or a clear error + fallback
- With mocks: expect block + fallback as before
