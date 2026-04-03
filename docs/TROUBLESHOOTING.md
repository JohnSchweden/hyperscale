# K-Maru Troubleshooting & FAQ

## Quick Diagnostics

Use this table to quickly identify your issue category:

| Symptom | Likely Category | First Check |
|---------|----------------|-------------|
| Dev server won't start | [Development](#development-issues) | `bun install`, port 3000 in use |
| `bun run typecheck` fails | [Development](#typecheck-failures) | Recent type changes, missing imports |
| Tests fail or are flaky | [Test Failures](#test-failures) | `bun run test:smoke`, check selectors |
| No audio / TTS silent | [Audio](#audio-issues) | HTTPS, `VITE_GEMINI_API_KEY`, user gesture |
| Roast shows fallback text | [API](#api-issues) | `GEMINI_API_KEY`, Vercel logs, Gemini quota |
| Haptic not vibrating | [Mobile](#mobile-issues) | Android Chrome ≥1000ms, user gesture |
| Layout broken on mobile | [Mobile](#mobile-issues) | Fixed taskbar overlap, `dvh` units |
| Build fails on Vercel | [Build/Deploy](#builddeploy-issues) | Env vars, Node version, typecheck |
| Slow tests (>20s) | [Performance](#performance-issues) | `networkidle`, full navigation flows |
| Feature works in Chrome but not Safari | [Browser Compatibility](#browser-compatibility) | WebKit autoplay, Vibration API |

---

## Development Issues

### Dev Server Won't Start

| Symptom | Cause | Solution |
|---------|-------|----------|
| `Port 3000 is already in use` | Another process on port 3000 | `lsof -ti:3000 \| xargs kill -9` then `bun run dev` |
| `Cannot find module` after pulling | Dependencies not installed | `bun install` |
| SSL certificate error in browser | `@vitejs/plugin-basic-ssl` uses self-signed cert | Accept the cert warning, or use `--ignore-https-errors` with automation tools |
| Vite crashes on start | Corrupted node_modules or cache | `rm -rf node_modules .vite && bun install` |

### Typecheck Failures

**Command:** `bun run typecheck`

| Error Pattern | Cause | Solution |
|--------------|-------|----------|
| `Cannot find module '...'` | Missing import or wrong path | Check import path; run `bun install` if external package |
| `Property 'X' does not exist on type 'Y'` | Type mismatch after refactor | Update type definition or cast if intentional |
| `Argument of type 'X' is not assignable to parameter of type 'Y'` | Function signature changed | Update call sites to match new signature |
| `Object is possibly 'undefined'` | Missing null check | Add `??` fallback or `if (x)` guard |
| `@ts-expect-error` unused | Type issue was resolved elsewhere | Remove the `@ts-expect-error` comment |

**Common typecheck pitfalls:**
- Card data files (`data/cards/*.ts`) are large (900+ lines); type errors here often cascade
- `@ts-expect-error` in `lib/gif-overlay.ts` — missing type definitions for text-on-gif/canvas packages
- After adding new `GameStage` enum values, update `VALID_TRANSITIONS` map in `hooks/useGameState.ts`

### Test Failures

See [Test Failures](#test-failures) section below.

### Lint Errors

**Command:** `bun run lint` (check) or `bun run lint:fix` (auto-fix)

| Error | Solution |
|-------|----------|
| Biome formatting error | `bun run format` or `bun run fix` |
| Unused import | Remove the import |
| Console.log in production | Replace with proper logger or remove |
| Long line | Break into multiple lines |

**Pre-commit:** Husky + lint-staged run `biome check --write` automatically on commit.

---

## API Issues

### Gemini API Errors

| Symptom | Cause | Solution |
|---------|-------|----------|
| `401 Unauthorized` on `/api/speak` or `/api/roast` | `GEMINI_API_KEY` missing or invalid | Set in Vercel → Settings → Environment Variables; verify key at [Google AI Studio](https://aistudio.google.com/) |
| `429 Too Many Requests` | Gemini API quota exceeded | Check quota in Google Cloud Console; wait or increase quota |
| `500 Internal Server Error` on roast | `@google/genai` SDK bundling failure on Vercel | See [Vercel SDK Bundling](#vercel-sdk-bundling-failure) below |
| Roast returns fallback text | Both lite and flash models failed | Check Vercel Runtime Logs for `Roast Error:`; verify API key and quota |
| TTS returns no audio | `VITE_ENABLE_SPEECH` set to `false` or API key invalid | Check env vars; test `/api/speak` endpoint manually (see [DEPLOYMENT.md](DEPLOYMENT.md#tts-not-working)) |

### Vercel SDK Bundling Failure

**Problem:** `/api/roast` and `/api/speak` crash with `FUNCTION_INVOCATION_FAILED` on Vercel. The `@google/genai` module does not bundle correctly in Vercel serverless runtime.

**Workaround:** Replace SDK calls with direct REST `fetch()` to Gemini endpoint:

```
POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
Header: x-goog-api-key: {GEMINI_API_KEY}
```

See `.planning/debug/resolved/vercel-genai-fix-research.md` for full analysis.

### Rate Limiting

| Service | Limit | Mitigation |
|---------|-------|------------|
| Gemini Live API (`v1alpha`) | Varies by tier | Monitor usage; implement backoff |
| `/api/roast` (serverless) | 30s timeout (`vercel.json`) | Reduce prompt complexity if timing out |
| `/api/speak` (serverless) | 30s timeout | Same as above |
| Ephemeral token endpoint | ~1 hour expiry | Client handles re-auth automatically |

### TTS Not Working

**Diagnosis steps:**

1. Check `VITE_ENABLE_SPEECH` is not `false`
2. Verify `GEMINI_API_KEY` is set and valid
3. Check browser console for `TTS Error:` entries
4. Test endpoint manually:
   ```sh
   curl -X POST https://<your-domain>/api/speak \
     -H "Content-Type: application/json" \
     -d '{"text":"test","voiceName":"Kore"}'
   ```
5. Check Gemini API quota in Google Cloud Console

### Roast Generation Failures

**Diagnosis steps:**

1. Check Vercel Runtime Logs for `Roast Error:` entries
2. Verify `GEMINI_API_KEY` is valid and has quota
3. The roast endpoint has a fallback chain (lite → flash) — if both fail, hardcoded fallback message is returned
4. Test manually:
   ```sh
   curl -X POST https://<your-domain>/api/roast \
     -H "Content-Type: application/json" \
     -d '{"workflow":"test","personality":"ROASTER"}'
   ```

### Gemini Live API Connection Issues

**Symptoms:** Live API streaming audio fails to connect; roast feature freezes.

**Known issues:**
- Hard-coded 15s timeout in `services/geminiLive.ts` — connection may hang if WebSocket doesn't emit `onopen` before timeout
- No exponential backoff or retry logic
- API is `v1alpha`, subject to breaking changes

**Workaround:** The app falls back to `getQuickRoast()` if Live API is unavailable. Set `VITE_TTS_FALLBACK_ENABLED=true` to enable fallback.

---

## Audio Issues

### Voice Not Playing

| Symptom | Cause | Solution |
|---------|-------|----------|
| No audio at all | `VITE_ENABLE_SPEECH=false` or missing API key | Check env vars |
| Audio silent on first interaction | `AudioContext` suspended (autoplay policy) | Audio resumes on first user gesture (tap/click) |
| `ctx.resume()` not awaited | `pressureAudio.ts` calls `resume()` without `await` | Fixed: `await ctx.resume()` before creating oscillators |
| Voice file fetch fails | Missing or moved `.mp3` file | Check `public/audio/voices/`; no fallback currently exists |

**Critical:** Audio requires HTTPS for `getUserMedia` (speech recognition). The dev server uses `@vitejs/plugin-basic-ssl` with self-signed certificates.

### Background Music Issues

| Symptom | Cause | Solution |
|---------|-------|----------|
| BGM controls not visible | `BgmControls` not extracted as standalone component | Check `StarfieldBackground.tsx` for BGM-related code |
| BGM doesn't play | Same autoplay policy as voice | Requires user gesture to start |
| Music files too large | Uncompressed audio in `public/audio/music/` | Run `bun run convert:music:opus` |

### Mobile Audio Problems

| Symptom | Cause | Solution |
|---------|-------|----------|
| No heartbeat on Android Chrome | `AudioContext.resume()` called from `useEffect`, not user gesture | Fixed: one-shot touchend/click listener resumes context |
| Speech recognition fails on mobile | `navigator.mediaDevices` undefined on HTTP | Fixed: guard added; use HTTPS |
| Audio plays but no speech-to-text | `getUserMedia` blocked in non-secure context | Must use HTTPS; see [Speech Recognition](#speech-recognition) |

### Speech Recognition

| Symptom | Cause | Solution |
|---------|-------|----------|
| `undefined is not an object (evaluating 'navigator.mediaDevices.getUserMedia')` | HTTP or unsupported browser | Fixed: guard with clear error message; use HTTPS |
| Pressing Enter during recording doesn't submit | `stopRecording()` not called before submit | Fixed: `handleSubmit` wrapper stops recording first |
| Transcript shows duplicates | Dual state management (`transcript` + `_streamingTranscript`) | Known issue; use only final transcript from `useLiveAPISpeechRecognition` |

---

## Mobile Issues

### Layout Problems

| Symptom | Cause | Solution |
|---------|-------|----------|
| Content cut off at bottom | Fixed taskbar (48px) overlaps content container | Content needs `pb-12` or `mb-12` to account for taskbar |
| Roast terminal cut off | Same fixed taskbar issue | Add bottom padding/margin to roast container |
| Boot button cut off | Taskbar overlap + `overflow-hidden` on roast terminal | Increase bottom padding from `pb-2` (8px) to at least `pb-14` (56px) |
| Answer overlay not centered | `stage-transition` animation applies `transform`, creating a containing block that breaks `position: fixed` | Move overlay outside transformed container or use React Portal |
| Scrollbar flickers on stage change | `stage-transition` animation `translateY(20px)` + nested `min-h-[100dvh]` + `overflow-y-auto` | Known visual quirk; scrollbar disappears after animation |
| Page doesn't start at top after navigation | SPA stage transitions don't reset scroll | Fixed: `window.scrollTo(0, 0)` on stage change in `App.tsx` |

### Touch Issues

| Symptom | Cause | Solution |
|---------|-------|----------|
| Card swipe doesn't register | Gesture threshold not met or RAF cancellation | Check `useSwipeGestures.ts`; threshold is 100px |
| Right swipe shows pressure on next card | `isCritical` includes global heat (heat ≥ 70), not just countdown | Fixed: stress visuals and pressure audio tied to `isUrgent` only |
| Swipe direction wrong | Drag gesture distance is signed (negative = left, positive = right) | Verify sign matches intended direction in drag helpers |
| Card not clickable after animation | CSS animation makes elements briefly unclickable | Use `{ force: true }` in tests; 500ms+ timeouts |

### Haptic Feedback Not Working

| Symptom | Cause | Solution |
|---------|-------|----------|
| No vibration on Android Chrome | `navigator.vibrate([100])` — patterns <1000ms ignored on some Android devices | Fixed: use `[1001]` with immediate cancel via `setTimeout(100, () => navigator.vibrate(0))` |
| No vibration from async callbacks | Chrome blocks `navigator.vibrate` when not triggered by user gesture | Haptics must fire synchronously in touch/click handlers |
| Touch-swipe doesn't vibrate | Vibrate only exists in button path (`onSwipeLeft/onSwipeRight`), not touch-swipe path | Known gap: touch-swipe fires from `setTimeout(350ms)` callback — outside user gesture |
| No vibration on iOS | iOS Safari has no Vibration API support | Expected; haptics are Android-only |

**Haptic rules:**
- Call `navigator.vibrate` synchronously in user gesture handlers
- Pattern total must be ≥1000ms on Android Chrome
- iOS does not support the Vibration API

### Chrome on Android Issues

| Symptom | Cause | Solution |
|---------|-------|----------|
| AudioContext stays suspended | `resume()` must be triggered by user interaction | Add one-shot touchend listener to resume context |
| Vibration patterns <1s ignored | Android Chrome minimum vibration duration | Use ≥1001ms patterns |
| `getUserMedia` fails on HTTP | `mediaDevices` undefined in non-secure context | Use HTTPS; guard added with clear error |

---

## Test Failures

### Common Failure Patterns

| Pattern | Cause | Solution |
|---------|-------|----------|
| Test fails only in CI | Viewport differences, timing, `networkidle` timeouts | Check `playwright.config.ts` CI settings (retries: 2, workers: 1) |
| Flaky card swipe tests | CSS animation completion timing | Use specific element `.waitFor({ state: "visible" })` instead of generic `page.waitForSelector()` |
| Selector not found | Selector depends on layout structure that changes between breakpoints | Use `data-testid` attributes, not CSS class or `nth` position selectors |
| Test passes locally, fails on CI | Different environment, cold starts, parallelism | Run with `--project=chromium-desktop` and `--project=chromium-mobile` locally |

### Flaky Tests

| Test File | Known Issue | Workaround |
|-----------|-------------|------------|
| `immersive-pressure-cues.spec.ts` | 15s pressure countdown causes race conditions | Tests accept either countdown OR feedback dialog |
| `stage-snapshots.spec.ts` | `networkidle` ×4 + long flows + roast waits (197s) | Replace `networkidle` with DOM-based waits |
| `boss-fight-timer.spec.ts` | 30s real-time wait for timer expiry | Mark `@slow`, run in separate suite |
| `personality-feedback.spec.ts` | Full navigation flow + `networkidle` ×4 | Use `navigateToPlayingFast` with localStorage injection |

### How to Debug Failing Tests

1. **Run with UI mode:** `bun run test -- --ui`
2. **Run headed:** `bun run test -- --headed` (see browser)
3. **Run with trace:** `bun run test -- --trace=on`
4. **Open trace:** `bun run playwright:show-trace -- test-results/trace.zip`
5. **Debug mode:** `bun run test -- --debug` (step through)
6. **Single project:** `bun run test -- --project=chromium-desktop`

**Test results artifacts:** `test-results/[test-name]-[project]/` contains `error-context.md`, `trace.zip`, and screenshots.

### Card Swipe Test Rules

- Use `data-testid` selectors, not CSS classes or `nth` position
- Wait for specific element with `.waitFor({ state: "visible" })`
- Do NOT use `.click({ force: true })` — it bypasses visibility checks and masks real bugs
- Use `.dispatchEvent("click")` or regular `.click()` instead
- Account for CSS animation completion time (500ms+)
- For drag testing: use DOM-level synthetic event dispatch, not `page.mouse.move/down/up` — Playwright's synthetic mouse events don't reliably fire window-level listeners

### Running Tests

```sh
bun run test:smoke              # Fast critical checks (~15s)
bun run test:area:gameplay      # Gameplay tests
bun run test:area:input         # Input tests
bun run test:area:layout        # Layout tests
bun run test:area:boss          # Boss fight tests
bun run test:area:audio         # Audio tests
bun run test:visual             # Visual regression tests
bun run test:slow               # Slow tests (excluded from CI)
bun run test:unit               # Vitest unit tests
bun run test:data               # Data validation tests
bun run test:all                # Unit + E2E
```

---

## Build/Deploy Issues

### Vercel Build Failures

| Symptom | Cause | Solution |
|---------|-------|----------|
| Build fails with TypeScript errors | `tsc --noEmit` fails in CI pipeline | Run `bun run typecheck` locally, fix errors |
| Build fails with lint errors | Biome check fails | Run `bun run lint:fix` locally |
| `Cannot find module` during build | Missing dependency or corrupted lockfile | `bun install`, commit `bun.lock` |
| Build succeeds but app broken at runtime | `VITE_GEMINI_API_KEY` missing at build time | Set in Vercel → Settings → Environment Variables (mark as Client) |
| Node version mismatch | Vercel using wrong Node version | Set to `24.x` in Vercel build settings |

### Environment Variable Issues

| Variable | Scope | Common Mistake |
|----------|-------|----------------|
| `VITE_GEMINI_API_KEY` | Client (build-time) | Not marked as Client in Vercel; requires redeploy to take effect |
| `GEMINI_API_KEY` | Server (runtime) | Not set; causes 401 on `/api/speak` and `/api/roast` |
| `RESEND_API_KEY` | Server (runtime) | Unset = emails logged to console only (expected in dev) |
| `VITE_ENABLE_SPEECH` | Client (build-time) | Set to `false` disables TTS globally |

**Important:** Client variables (`VITE_*`) are baked into the build at compile time. Changing them requires a full redeploy. Server variables take effect immediately without redeploy.

### Rollback

1. Vercel Dashboard → Deployments → find last good deployment → **Promote to Production**
2. Or CLI: `vercel deployments promote <deployment-url-or-id>`
3. Emergency: `git revert <bad-commit>` + `git push origin main`

---

## Performance Issues

### Slow Tests

**Primary culprits:**

| Cause | Impact | Fix |
|-------|--------|-----|
| `waitForLoadState("networkidle")` | 30–60s per occurrence | Replace with DOM-based waits |
| Full navigation flows | 10–60s per test | Use `navigateToPlayingFast()` with localStorage injection (~2–4s) |
| Real-time waits (countdown, boss timer) | 7–35s per test | Shorten countdown in test mode; mark `@slow` |
| Repeated `beforeEach` navigation | 3–4s per test | Consider `beforeAll` + shared page |

**Slowest test files:**

| File | Time | Main Cause |
|------|------|------------|
| `stage-snapshots.spec.ts` | 197s | `networkidle` ×4, long flows, roast waits |
| `death-types.spec.ts` | 62s | Full flows, boss fight |
| `boss-fight-timer.spec.ts` | 47s | Full navigation, 30s timer wait |
| `layout-overlay-touch.spec.ts` | 36s | `networkidle` ×2 on intro |

**Analyze slow tests:** `bun run test:slow-files`

### Slow Dev Server

| Symptom | Cause | Solution |
|---------|-------|----------|
| Cold start >10s | Large card data files (900+ lines each) loaded upfront | Known limitation; consider lazy loading by role |
| HMR slow after changes | Many files watched | Exclude `node_modules`, `dist` from watch |
| Bundle size concerns | All card data in initial bundle | Run Vite bundle analyzer; consider code splitting |

### Bundle Size

- Card definition files: `data/cards/*.ts` (954 lines, 905 lines, etc.) — all loaded upfront
- Consider: dynamic imports by archetype, compress card text data
- Audio assets: run `bun run compress:existing` before production builds

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | iOS Safari | Android Chrome |
|---------|--------|---------|--------|------------|----------------|
| Web Audio API | Full | Full | Full | Full (autoplay blocked) | Full (autoplay blocked) |
| `navigator.vibrate` | Full | Full | Not supported | Not supported | Full (≥1000ms patterns) |
| `getUserMedia` | Full (HTTPS) | Full (HTTPS) | Full (HTTPS) | Full (HTTPS) | Full (HTTPS) |
| `dvh` CSS unit | Full | Full | Full (15.4+) | Full (15.4+) | Full |
| CSS `backdrop-filter` | Full | Full | Full (prefixed) | Full (prefixed) | Full |
| WebSocket (Live API) | Full | Full | Full | Full | Full |

### Known Browser-Specific Issues

| Issue | Browser | Details |
|-------|---------|---------|
| AudioContext autoplay blocked | Safari, Android Chrome | Requires user gesture to call `ctx.resume()` |
| Vibration API not supported | iOS Safari | No workaround; haptics are Android-only |
| Short vibration patterns ignored | Android Chrome (some devices) | Patterns <1000ms silently ignored |
| `position: fixed` broken by `transform` | All browsers | `stage-transition` animation creates containing block |
| `backdrop-filter` broken by parent opacity <1 | All browsers | Use `::before` pseudo-element overlay instead |

---

## FAQ

### Why does the app require HTTPS?

Speech recognition (`getUserMedia`) requires a secure context. The dev server uses `@vitejs/plugin-basic-ssl` with self-signed certificates. When using `agent-browser` for automation, use `--ignore-https-errors`.

### Why doesn't haptic feedback work on my phone?

Two requirements:
1. **Android only** — iOS Safari has no Vibration API
2. **User gesture** — `navigator.vibrate` must be called synchronously from a tap/click handler, not from `useEffect` or `setTimeout`
3. **Pattern ≥1000ms** — Some Android Chrome versions ignore patterns shorter than 1 second

### Why does the roast show fallback text instead of AI commentary?

The roast endpoint tries two models (lite → flash). If both fail, a hardcoded fallback message is returned. Common causes:
- `GEMINI_API_KEY` missing or invalid
- API quota exceeded (429)
- Vercel serverless timeout (30s)
- `@google/genai` SDK bundling failure (`FUNCTION_INVOCATION_FAILED`)

### Why do tests pass locally but fail in CI?

Common causes:
- `networkidle` waits longer in CI due to cold starts
- Viewport differences (CI runs both desktop and mobile projects)
- Timing issues with CSS animations
- Different browser versions

Run locally with both projects: `bun run test -- --project=chromium-desktop --project=chromium-mobile`

### Why is the countdown not visible on urgent cards?

Known issue: `useCountdown` does not re-initialize `count` when `isActive` transitions from `false` to `true`. During `INITIALIZING`, count is 0. On transition to `PLAYING`, count stays 0 and `onComplete()` fires immediately. See `.planning/debug/urgent-countdown-not-visible.md`.

### Why don't HUD escalation visuals (Critical labels, color shifts) appear?

The game flow with the default role (Software Engineer) prevents the playing screen with escalated HUD from ever being visible. Any choice sequence that reaches escalation thresholds either shows the feedback overlay (covering the HUD) or triggers GAME_OVER. Escalation is only observable with Management-backed roles. See `.planning/debug/hud-escalation-not-visible.md`.

### Why does the card glow only appear after I touch it?

GPU compositor optimization: `.swipe-card` has `will-change: transform, opacity` which promotes a compositor layer. The `pressure-pulse` animation changes `box-shadow` (a paint property), which the compositor doesn't repaint until something triggers it (like a touch/drag changing the inline transform). See `.planning/debug/card-stress-glow-visible-on-touch.md`.

### Why does the timer restart instead of resolving the incident?

The "fresh activation" fix added `if (count === 0 && startFrom > 0) { setCount(startFrom); return; }` to prevent `onComplete` firing on `INITIALIZING→PLAYING`. This condition is ambiguous: it matches both fresh activation AND natural expiry (count ticked 1→0). Both cases restart; `onComplete()` is never called. See `.planning/debug/timer-restarts-instead-of-resolve.md`.

### Why does the answer overlay appear instantly at game start?

Same root cause as the timer restart issue: `useCountdown` fires `onComplete` immediately when transitioning from inactive to active because count stays 0. See `.planning/debug/timer-expiry-instant-feedback.md`.

### How do I rotate the Gemini API key?

1. Generate new key in [Google AI Studio](https://aistudio.google.com/)
2. Update both `VITE_GEMINI_API_KEY` and `GEMINI_API_KEY` in Vercel
3. Redeploy (required for `VITE_*` client variables)
4. Verify TTS and roast work in production
5. Delete old key in Google AI Studio

### How do I rollback a bad deployment?

1. Vercel Dashboard → Deployments → find last good deployment → **Promote to Production**
2. Or: `vercel deployments promote <deployment-url-or-id>`
3. Emergency: `git revert <bad-commit-hash>` + `git push origin main`

### Why are some tests so slow (>20s)?

Primary cause: `waitForLoadState("networkidle")` waits until ≤2 network connections for 500ms. In an SPA with audio, API calls, and persistent connections, this rarely fires quickly. Replace with DOM-based waits (e.g., wait for specific element to be visible).

Run `bun run test:slow-files` to identify the slowest test files.

### What's the difference between `navigateToPlaying()` and `navigateToPlayingFast()`?

- **Full path** (`navigateToPlaying`): goto → networkidle → Boot → V.E.R.A → Role select → 3-2-1 countdown → wait for Debug → networkidle. **10–60+ seconds.**
- **Fast path** (`navigateToPlayingFast`): localStorage injection → goto → wait for Debug button → wait for card. **2–4 seconds.**

Always prefer the fast path unless testing the full onboarding flow.

### Why does `@google/genai` fail on Vercel but work locally?

Vercel's serverless runtime cannot properly bundle the `@google/genai` module — it looks for `/var/task/node_modules/@google/genai/dist/node/index.cjs` and fails. Workaround: use direct REST `fetch()` to Gemini's API endpoint instead of the SDK.

### How do I test on mobile locally?

1. Dev server must use HTTPS (for `getUserMedia`): `bun run dev` (SSL is configured in `vite.config.ts`)
2. Access from mobile device on same network: `https://<your-local-ip>:3000`
3. Accept the self-signed certificate warning
4. Or use `agent-browser --ignore-https-errors open https://localhost:3000`

### What are the fragile areas in the codebase?

| Area | File | Why Fragile |
|------|------|-------------|
| Gesture recognition | `hooks/useSwipeGestures.ts` | 16 state refs + 7 timers; race condition vectors |
| Deck shuffling with branching | `lib/deck.ts`, `hooks/useGameState.ts` | Order matters (shuffle → branch); untested algorithm |
| Boss fight timer | `hooks/useBossFight.ts` | Timer driven by `useEffect`; potential interval leak |
| Image fallback chain | `components/ImageWithFallback.tsx` | No cascade fallback beyond placeholder; no retry |
| Gemini Live API lifecycle | `services/geminiLive.ts` | 15s timeout, no retry, `v1alpha` API |
| Stage transitions | `hooks/useGameState.ts` | No exhaustiveness check on `VALID_TRANSITIONS` |

See `.planning/codebase/CONCERNS.md` for full analysis.

### How do I compress audio assets?

```sh
bun run compress:existing      # Compress all existing audio
bun run compress:file          # Compress a single file
bun run compress:dir           # Compress a directory
bun run compress:voices        # Compress voice files specifically
bun run convert:music:opus     # Convert background music to Opus
bun run compress:verify        # Verify compressed audio quality
```

Run `bun run build:with-audio` to compress then build.

---

## Diagnostic Commands

```sh
# Quick health check
bun run typecheck && bun run lint:fix && bun run test:smoke

# Full CI pipeline locally
bun run check && bun run typecheck && bun run test

# Find slow test files
bun run test:slow-files

# Test live Gemini API
bun run test:live-api

# Check audio compression
bun run compress:verify

# View Playwright test report
bun run playwright:show-report

# View trace of failed test
bun run playwright:show-trace -- test-results/<trace-file>/trace.zip
```
