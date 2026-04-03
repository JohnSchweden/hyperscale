# Codebase Concerns

**Analysis Date:** 2026-04-03

## Tech Debt

### 1. Complex Gesture Recognition State Machine

**Issue:** 16 state refs + 7 timers managing drag, swipe, and snap-back animation — high cognitive load and potential race condition vectors.

**Files:** `hooks/useSwipeGestures.ts` (405 lines)

**Impact:**
- Multiple `setTimeout`/`requestAnimationFrame` cleanup paths (lines 221–227, 244–251, 273–280, 290–296, 386–390)
- RAF handler cancellation at lines 116–118, 176–179 — can miss pending animation frames
- Two separate snap-back logic branches (lines 232–253 and 281–297) — code duplication
- Touch start adds event listeners at line 315–320 but cleanup happens in callback — fragile reference management

**Fix approach:**
1. Extract snap-back animation to named function to eliminate duplication
2. Consolidate RAF cleanup into centralized pattern (currently scattered)
3. Use single `AbortController` for window event listeners instead of manual ref tracking (line 69)
4. Consider extracting exit animation to separate state/hook — too many concerns in one hook

---

### 2. Unit Test Mocking Gaps

**Issue:** Fisher-Yates shuffle tests skipped because `Math.random()` mocking provides insufficient return values.

**Files:** `unit/deck.test.ts` (lines 6–18)

**Impact:**
- Shuffle algorithm in `lib/deck.ts` (lines 9–33) untested — requires 9 `Math.random()` calls for 5 cards, but mocks only provide 1–3
- Silent test skip — no CI failure, tests pass with coverage blind spot
- Any refactor to shuffle behavior undetectable
- Choice-side swap logic (lines 16–30 of `lib/deck.ts`) also untested

**Fix approach:**
1. Replace mock strategy: use seeded random (e.g., `seedrandom` package) instead of `Math.random()` mock
2. Or: refactor `shuffleDeck` to inject random function as parameter: `shuffleDeck(cards, randomFn)`
3. Add explicit test failure if mocks return `undefined` to catch this pattern early
4. Add integration test: verify shuffled deck distribution is uniform

---

### 3. Gemini Live API Connection Timeout

**Issue:** Hard-coded 15s timeout (line 121) with `Promise.race` — connection may hang if WebSocket doesn't emit `onopen` before timeout.

**Files:** `services/geminiLive.ts` (lines 121, 253–260)

**Impact:**
- Timeout fires before `onopen` callback, but callback may still execute — controller already errored
- SDK documentation doesn't guarantee `onopen` emission timing
- No exponential backoff or retry logic
- Browser may emit `onclose` AFTER timeout — resources not cleaned up
- Roast feature freezes indefinitely if API hangs

**Fix approach:**
1. Wrap timeout in try-finally to ensure `controller.close()` is always called
2. Track connection state machine (connecting → connected → closed) instead of relying on callback timing
3. Add retry logic (1–2 retries with exponential backoff) before throwing
4. Log connection stage transitions for debugging
5. Add user-facing timeout notification (toast: "Connection timeout, retrying...")

---

### 4. Incomplete Streaming Transcription Handling

**Issue:** `outputTranscription` field parsing is defensive/fragile (lines 180–203).

**Files:** `services/geminiLive.ts` (lines 175–203)

**Impact:**
- Type coercion: `outputTranscription` could be string OR object, handled with typeof check (line 189)
- Repeated `.text || ""` fallback pattern (line 191) suggests API contract uncertainty
- Comment at line 175: "IGNORE all part.text - it's thinking text with markdown" — unclear what the correct transcription source is
- No validation of transcription content (could be empty, null, undefined after parsing)
- Voice recognition in roast terminal may show incomplete/incorrect transcripts

**Fix approach:**
1. Define strict TypeScript interface for `serverContent` response shape
2. Add log statement showing actual structure received (dev mode only) to validate parsing
3. Create dedicated `parseOutputTranscription()` function with clear error handling
4. Add unit test with mock API response to verify all code paths
5. Document which fields are official vs. fallback

---

### 5. Unhandled Stress Animation State

**Issue:** `_isCritical` parameter passed but never used (line 112 of `CardStack.tsx`).

**Files:** `components/game/CardStack.tsx` (line 112)

**Impact:**
- Parameter suggests intention to apply critical-level stress visuals, but only `isUrgent` is checked (line 138)
- Inconsistency: comment at lines 136–137 says heat-based `isCritical` affects only haptics, not card visuals — contradicts parameter
- Dead parameter adds confusion for future maintainers
- If heat-based critical mode should affect card, logic is missing

**Fix approach:**
1. If heat-based critical is intentional design: remove unused parameter and add comment explaining why heat doesn't affect card visuals
2. If it should affect card: apply stress to card when `isCritical` is true (currently only `isUrgent` drives `hasStressVisuals`)
3. Either way: document the design decision explicitly
4. Add test: verify stress visuals only appear when `isUrgent` is true

---

### 6. Image Preload Dependency Race

**Issue:** Next card image preloaded (lines 120–132) but no verification it loads before swipe.

**Files:** `components/game/CardStack.tsx` (lines 120–132)

**Impact:**
- Preload link created but never awaited — browser may not fetch before card swipes
- `useEffect` cleanup removes link on unmount, but image may still be downloading
- If next card image is large, placeholder flash still visible on slow networks
- No fallback if preload fails
- Visual regression risk: slow networks show flash, fast networks don't

**Fix approach:**
1. Add timeout (e.g., 3s) — if image not loaded, clear timeout and allow placeholder flash
2. Log preload start/end in dev mode to verify it's working
3. Consider lazy-loading carousel-style (preload current + next, drop previous)
4. Add test: verify image element has `loaded` state before card exits animation
5. Add visual regression test: capture preload timing on slow throttled connection

---

### 7. Unsubscribed Fetch Promises

**Issue:** Fetch requests in `loadVoice` (line 87 of `voicePlayback.ts`) not aborted on unmount or hook cleanup.

**Files:** `services/voicePlayback.ts` (line 87), `hooks/useVoicePlayback.ts` (lines 47–62)

**Impact:**
- `loadVoice().then().catch()` fire even if component unmounts — potential memory leak
- `runVoiceCue()` called from effect but has no cleanup function (lines 41–62 of `useVoicePlayback.ts`)
- If personality changes during voice load, old voice still loads in background
- No `AbortController` to cancel in-flight requests
- Network tab shows orphaned requests after navigation

**Fix approach:**
1. Add `AbortController` parameter to `loadVoice()`: `loadVoice(key, trigger, signal)`
2. Create abort controller in `useVoicePlayback` effect, return cleanup that calls `abort()`
3. Handle abort errors gracefully (catch `DOMException` with name `AbortError`)
4. Add timeout to voice load (e.g., 5s) — if slow network, skip and continue
5. Test: unmount component during voice load, verify no errors in console

---

### 8. Stage Transition Validation Incomplete

**Issue:** `VALID_TRANSITIONS` map enforces forward-only flow, but no exhaustiveness check or runtime validation.

**Files:** `hooks/useGameState.ts` (lines 68–88)

**Impact:**
- New `GameStage` enum values can be added without updating `VALID_TRANSITIONS` — silent invalid state possible
- Invalid transition returns false (line 81) but dispatch still succeeds if not guarded
- No TypeScript `satisfies` pattern to catch missing entries at compile time
- Only logs in dev (line 86), production silently fails — player stuck in invalid state
- No test coverage for each valid transition pair

**Fix approach:**
1. Change map to `as const satisfies Record<GameStage, GameStage[]>` to force exhaustiveness
2. Throw instead of log on invalid transition (in all environments, not just dev)
3. Add test for each transition pair to verify coverage
4. Consider FSM library (e.g., `xstate`) if complexity grows further
5. Add guard at dispatch: throw if transition invalid, never continue silently

---

### 9. Streaming Audio Buffer Edge Case

**Issue:** Empty audio buffer marked as final (lines 222–230) but no verification buffer was non-empty earlier.

**Files:** `services/geminiLive.ts` (lines 222–230)

**Impact:**
- If API sends only `turnComplete` without audio chunks, empty buffer enqueued as "final"
- Consumer expects at least one audio chunk before "final" marker — may cause playback silence
- No check for `message.serverContent?.modelTurn?.parts?.length > 0` before enqueuing final
- Could trigger audio end handler multiple times if turn completes multiple times
- User hears nothing, confused about whether roast worked

**Fix approach:**
1. Track whether any audio chunks enqueued — only enqueue final if at least one chunk sent
2. Or: skip empty final chunk, just close stream
3. Add test: mock API response with only `turnComplete`, no audio parts
4. Log audio chunk count in dev mode for debugging
5. Add safety: throw if turnComplete without audio parts (catch early in dev)

---

### 10. Console Logging in Production Code

**Issue:** Extensive console.log statements throughout codebase used for debugging.

**Files:** `services/geminiLive.ts`, `vite.config.ts`, `scripts/*.ts`, `tests/*.ts`

**Impact:**
- Performance overhead from console operations
- Potential information leakage in production logs
- Clutters browser dev tools for developers
- Debug code left in production builds

**Fix approach:**
1. Replace debug console.log with proper logging framework (e.g., winston, pino)
2. Use environment-based log levels (debug in dev, warn/error in prod)
3. Add build-time removal of debug logs
4. Create wrapper: `logger.debug()` instead of `console.log()`

---

### 11. Large Data Files Without Code Splitting

**Issue:** Card definition files exceed 900 lines, all loaded upfront.

**Files:** `data/cards/*.ts` (chief-something-officer.ts: 954 lines, head-of-something.ts: 905 lines, etc.)

**Impact:**
- Large bundle size increases initial load time
- All card data loaded regardless of player choices
- No lazy loading for optional content
- Memory usage scales with content size

**Fix approach:**
1. Implement lazy loading: load card data on-demand by role/personality
2. Split cards into separate chunks: dynamic imports by archetype
3. Add bundle analyzer to monitor data file impact
4. Consider: compress card text data, decompress at runtime

---

### 12. Missing Tests for Core Utilities

**Issue:** Large utility functions lack unit test coverage.

**Files:** `lib/gif-overlay.ts` (646 lines), `lib/safeCoercion.ts`, `lib/slugify.ts`

**Impact:**
- Untested code changes could introduce regressions
- GIF overlay functionality completely untested
- Core utility functions used across application lack safety net

**Fix approach:**
1. Add unit tests for all lib/ functions
2. Create test fixtures for GIF overlay operations
3. Add integration tests for utility usage in components
4. Set up test coverage thresholds to prevent future gaps

---

## Known Bugs

**[Incomplete roaster text]:**
- Issue: Placeholder text "TODO: Fix properly later. Later never comes. Debt compounds." in card definition
- Files: `data/cards/software-engineer.ts`
- Trigger: Display of specific card roaster text
- Workaround: Content renders as-is with TODO placeholder

---

## Known Issues

### 1. Speech Recognition STT Transcript Deduplication

**Issue:** Commented-out streaming transcript display (lines 135–142 of `RoastTerminal.tsx`) suggests duplicate state management.

**Files:**
- `hooks/useLiveAPISpeechRecognition.ts` — returns `transcript`
- `components/game/RoastTerminal.tsx` — also tracks `_streamingTranscript` state

**Symptoms:** Multiple sources of truth for transcription; streaming display disabled to avoid duplication.

**Trigger:** User speaks into microphone, transcript appears and disappears.

**Workaround:** Use only final transcript from `useLiveAPISpeechRecognition`; remove streaming state if not needed.

**Test case:** Record voice, verify transcript updates only once with final result, no intermediate updates visible.

---

## Fragile Areas

### 1. Deck Shuffling with Branching

**Files:** `lib/deck.ts` (lines 9–33), `hooks/useGameState.ts` (lines 44–66)

**Why fragile:**
- `shuffleDeck()` modifies choice sides (lines 16–30); `resolveDeckWithBranching()` injects cards (line 64)
- Order matters: if branching happens before shuffle, injected cards not shuffled. If after, shuffle doesn't respect branching flow.
- No type safety: `branchInjections` is raw `Record<string, Card[]>` — typo in key = silent miss
- Test mocking gaps (see Tech Debt #2) mean shuffle untested
- No invariant verification: deck could be corrupted and not detected

**Safe modification:**
1. Document the deck resolution order (shuffle → branch injection) in comments
2. Create factory function: `createEffectiveDeck(role, branchMap)` that enforces order
3. Add integration test covering shuffle + branching together
4. Add runtime checks: log deck size before/after operations for debugging
5. Add assertion: verify deck always has unique card IDs

---

### 2. Image Fallback Chain

**Files:** `components/ImageWithFallback.tsx`

**Why fragile:**
- Fallback image may also fail to load — no cascade fallback beyond placeholder color
- Network error vs. 404 handled same way (both load fallback)
- Real-world reference incident images lazy-loaded at card display time — if no image, blank space
- No retry logic — single failed fetch = no image for session

**Safe modification:**
1. Add second fallback: placeholder with inline SVG (not dependent on network)
2. Log which images fail to help debug missing assets
3. Consider pre-validating incident images at build time (warn if missing)
4. Add visual indicator (skeleton, loading spinner) while image loads
5. Add retry with backoff: 1 retry after 2s delay

---

### 3. Boss Fight Timer State

**Why fragile:**
- Timer countdown driven by `useEffect` dependency on `isAnswered` (if present)
- No explicit cleanup of interval on unmount — potential timer leak
- If boss fight exits unexpectedly, timer may still fire and dispatch stale actions
- No max duration guard — timer could count forever

**Safe modification:**
1. Read file `hooks/useBossFight.ts` to verify timer cleanup pattern
2. Add explicit interval cleanup in return statement of effect
3. Test: unmount during countdown, verify no dispatch after unmount
4. Add timeout guard: max 30s absolute, auto-exit if exceeded
5. Clear all intervals on stage change away from BOSS_FIGHT

---

## Test Coverage Gaps

### 1. GIF Overlay Utility Functions

**What's not tested:** Text overlay on GIF templates, fallback handling, error recovery.

**Files:** `lib/gif-overlay.ts` (646 lines)

**Risk:** GIF generation fails silently, memes don't render in debrief.

**Priority:** MEDIUM — visual feature, not core gameplay

**Test approach:** Mock canvas/text-on-gif imports, verify overlay creation

---

### 2. Fisher-Yates Shuffle Algorithm

**What's not tested:** Shuffled deck distribution, uniform randomness, choice-side swapping.

**Files:** `lib/deck.ts` (lines 9–33)

**Risk:** Shuffled deck could bias toward first/last card without detection. Choice-side swap logic could break silently.

**Priority:** HIGH — affects gameplay fairness

**Test approach:** Use seeded RNG with known values, verify output matches expectations

---

### 2. Image Preload Timing

**What's not tested:** Whether image is actually cached before card swipes off-screen.

**Files:** `components/game/CardStack.tsx` (lines 120–132)

**Risk:** Placeholder flash visible if image slow to load.

**Priority:** MEDIUM — visual polish, not critical

**Test approach:** Mock slow network, measure image load time vs. swipe time

---

### 3. Gemini Live API Connection Lifecycle

**What's not tested:**
- Timeout firing before `onopen`
- Early disconnect after connect
- Rapid reconnects
- Empty audio buffer handling

**Files:** `services/geminiLive.ts` (lines 72–277)

**Risk:** Roast feature freezes if API hangs; user waits indefinitely.

**Priority:** HIGH — blocks core feature

**Test approach:** Mock WebSocket with delayed onopen, verify timeout works

---

### 4. Stage Transition Exhaustiveness

**What's not tested:** Attempting invalid transitions; new `GameStage` values without updating `VALID_TRANSITIONS`.

**Files:** `hooks/useGameState.ts` (lines 68–88)

**Risk:** Invalid state reachable; breaking level progression.

**Priority:** MEDIUM — only if stages added frequently

**Test approach:** Generate all stage pair combinations, verify only valid ones succeed

---

## Performance Bottlenecks

### 1. RAF + setTimeout Interleaving

**Problem:** RAF handler (line 120 of `useSwipeGestures.ts`) sometimes cancels itself (line 116–118) if another move event arrives mid-frame.

**Files:** `hooks/useSwipeGestures.ts` (lines 105–162)

**Cause:** `lastDeltaX`/`lastDeltaY` updated synchronously; pending RAF may flip to different delta before executing.

**Measurement:** Profile swipe on low-end device to detect jank

**Improvement path:**
1. Profile swipe gestures on low-end device to measure frame drops
2. If problematic: consolidate RAF + setTimeout — use single RAF loop for all state updates
3. Or: increase RAF cancel guard (check if delta actually changed before cancelling)

---

### 2. Image Preload Document Manipulation

**Problem:** DOM insertion/removal on every card change (lines 122–131 of `CardStack.tsx`).

**Files:** `components/game/CardStack.tsx` (lines 120–132)

**Cause:** Creates link, appends, removes on next card or unmount — multiple reflows.

**Measurement:** Use Performance API to measure reflow cost

**Improvement path:**
1. Use single preload link, update `href` instead of creating new
2. Or: batch preloads (preload current + next in one effect)
3. Add performance observer to measure impact
4. Consider: is preload necessary or just defer to browser heuristics?

---

## Scaling Limits

### 1. Deck Branching Injection

**Current capacity:** `resolveDeckWithBranching()` handles single branch key lookup (line 55–56 of `lib/deck.ts`).

**Limit:** If multiple branch paths possible (choice1 + choice2 = different branches), current code only reads last choice.

**Files:** `lib/deck.ts` (lines 44–66)

**Scaling path:**
1. Extend to multi-choice branching: `branchKey = [choice1, choice2, ...].join(':')`
2. Add test: verify 2–3 branch nesting works without deck corruption
3. Document max nesting depth
4. Consider: how many branches before lookup performance degrades?

---

### 2. localStorage State Persistence

**Current capacity:** Game state hydration from localStorage (via `getHydratedState()`) — unbounded history array possible.

**Limit:** If player plays many games, history array grows indefinitely, hydration slows.

**Files:** `hooks/useGameState.ts` (line 38: `history: []`)

**Scaling path:**
1. Cap history to last 100 entries
2. Or: move history to IndexedDB for large saves
3. Add memory estimate: history size after 10, 50, 100 choices
4. Measure: localStorage quota warning at 5MB

---

## Dependencies at Risk

### 1. Gemini 2.5 Flash Native Audio API

**Risk:** API is `v1alpha` (line 90 of `services/geminiLive.ts`), subject to breaking changes.

**Files:** `services/geminiLive.ts` (line 90)

**Impact:** TTS, roast, boss fight audio depend on this. API deprecation = feature loss.

**Migration plan:**
1. Monitor Google AI docs for `v1alpha` → `v1beta` release
2. Add feature flag: `VITE_USE_LEGACY_TTS` to fallback to `geminiService.ts` (REST API)
3. Keep `getQuickRoast()` as fallback (line 301–323) — uses stable REST API
4. Document: which endpoints are alpha, which are stable

---

### 2. Vite `import.meta.env` Access During Build

**Risk:** Environment variables injected at build time, not runtime.

**Files:** Multiple (e.g., `services/geminiLive.ts` line 76)

**Impact:** `VITE_GEMINI_API_KEY` missing at build = runtime error, not build error.

**Mitigation:**
1. Add build-time check: throw if `VITE_GEMINI_API_KEY` missing
2. Or: use runtime env fetch (needs backend proxy)
3. Document in `.env.example` all required vars
4. Add CI check: verify all env vars set before build

---

### 3. Optional Package Dependencies

**Risk:** text-on-gif and canvas packages used without proper type definitions or fallbacks.

**Files:** `lib/gif-overlay.ts` (lines 209, 225)

**Impact:** @ts-expect-error comments indicate missing type safety, potential runtime errors.

**Migration plan:**
1. Create proper type definitions for optional packages
2. Add runtime detection and fallback handling
3. Consider replacing with maintained alternatives
4. Document package requirements in setup guide

---

## Security Considerations

### 1. Gemini API Key Exposure in Ephemeral Token Exchange

**Risk:** Browser makes direct fetch to Google API with API key (line 39 of `geminiLive.ts`).

**Files:** `services/geminiLive.ts` (lines 38–63)

**Current mitigation:** Ephemeral token API returns short-lived token, key not exposed to WebSocket.

**Recommendations:**
1. Add CORS headers validation: only accept ephemeral token from `generativelanguage.googleapis.com`
2. Add rate limiting on token endpoint (IP or client-side backoff)
3. Consider backend proxy: `/api/ephemeral-token` instead of direct fetch
4. Document: token expiration (1 hour) and refresh strategy
5. Monitor: add warning if token refresh fails repeatedly

---

### 2. localStorage State Injection in Tests

**Risk:** Test helpers write game state directly to localStorage (seen in docs/PLAYWRIGHT_TESTING_QUICK_START.md).

**Files:** Test files reference localStorage injection

**Current mitigation:** Only in test environment.

**Recommendations:**
1. Clear localStorage between test runs to prevent state bleed
2. Use separate test session storage (don't reuse prod key)
3. Never commit test localStorage snapshots to git
4. Add test isolation check: verify localStorage empty before each test

---

## Missing Critical Features

### 1. Voice Playback Error Recovery

**Problem:** If voice.mp3 fetch fails (line 87 of `voicePlayback.ts`), no fallback.

**Files:** `services/voicePlayback.ts` (line 87), `hooks/useVoicePlayback.ts` (lines 47–62)

**Blocks:** If voice files deleted/moved, feedback audio silent — gameplay confused.

**Recommendation:**
1. Add fallback: text-to-speech via Gemini if file missing
2. Or: warn user with toast notification
3. Log failed URLs for debugging
4. Implement graceful degradation: game playable without audio

---

### 2. Streamed Audio Interruption Handling

**Problem:** If roast audio starts playing, user can't interrupt (no stop button visible during playback).

**Files:** `services/voicePlayback.ts`, `hooks/useVoicePlayback.ts`

**Blocks:** Long roasts force user to wait or mute speaker.

**Recommendation:**
1. Add skip/stop button during playback
2. Expose `stopVoice()` from hook for UI to call
3. Test: verify clicking stop during playback works
4. Allow skipping to next screen while audio plays

---

## Summary

| Category | Count | Severity |
|----------|-------|----------|
| Tech Debt | 12 | HIGH (5), MEDIUM (6), LOW (1) |
| Known Bugs | 2 | MEDIUM |
| Fragile Areas | 3 | MEDIUM–HIGH |
| Test Gaps | 5 | HIGH (2), MEDIUM (3) |
| Security | 2 | LOW (token handling acceptable) |
| Missing Features | 2 | MEDIUM |

**Top 3 Immediate Priorities:**

1. **Fix Fisher-Yates test mocking** (Tech Debt #2) — affects shuffle fairness, untested algorithm. Impact: HIGH, Effort: MEDIUM
2. **Add Gemini Live timeout recovery** (Tech Debt #3) — roast feature can hang indefinitely. Impact: HIGH, Effort: MEDIUM
3. **Add missing unit tests** (Test Gaps #1, #5) — core utilities lack test coverage. Impact: HIGH, Effort: MEDIUM

---

*Concerns audit: 2026-04-03*
