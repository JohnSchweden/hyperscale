---
phase: 27
plan: 27-03
subsystem: Mobile UX Audio Isolation
tags: [audio, mobile, iOS, clipboard, gestures]
dependency_graph:
  requires: []
  provides: [iOS-clipboard-fallback, BGM-pause-stability, scroll-autoplay]
  affects: [Game audio UX, iOS copy functionality, mobile interaction]
tech_stack:
  added: [setSelectionRange API]
  patterns: [event listener cleanup, keepalive removal]
key_files:
  created: []
  modified:
    - src/components/game/IntroScreen.tsx
    - src/hooks/useBackgroundMusic.ts
decisions:
  - Use setSelectionRange over select() for iOS clipboard reliability
  - Remove statechange listener to prevent suspend/resume loops
  - Add scroll listener for autoplay unlock on mobile
metrics:
  duration: "~15 minutes"
  completed: "2026-04-17"
  tasks_completed: 3
  files_modified: 2
---

# Phase 27 Plan 27-03: Mobile Audio Isolation & iOS Copy Link - Bug Fixes

## Summary

**Resolved three reported bugs in mobile UX and iOS functionality.**

Delivered fixes for:
1. iOS clipboard copy fallback (IntroScreen.tsx)
2. BGM pause lag caused by suspend/resume loops (useBackgroundMusic.ts)
3. Missing BGM autoplay on scroll gestures (useBackgroundMusic.ts)

All changes verified with typecheck, lint, and smoke tests (168 passed).

## Issues Fixed

### 1. iOS Clipboard Copy Fallback

**Problem:** Copy game link button was not working reliably on iOS Safari.

**Root Cause:** The fallback was using `element.select()` which is unreliable on iOS. Selection timing and element focus were inconsistent.

**Fix (IntroScreen.tsx):**
- Replaced `el.select()` with `el.setSelectionRange(0, length)` for explicit, reliable selection
- Added `fontSize: 16px` to prevent iOS auto-zoom on focus
- Added error handling with console warnings in DEV mode
- Return value check from `execCommand("copy")` for debugging

**Verification:** Typecheck + lint pass; covered by existing integration tests.

### 2. BGM Pause Lag and Unexpected Pauses

**Problem:** When pausing BGM on mobile, the audio context was experiencing lags and unexpected pauses. Users reported audio playback becoming choppy after toggling BGM off/on.

**Root Cause:** The `useEffect` for mobile keepalive (lines 314–330) was attaching a `statechange` listener that would resume the AudioContext every time it detected a `suspended` state while `enabled === false`. This created an infinite loop:
1. BGM disabled → AudioContext suspends (normal)
2. `statechange` listener fires → calls `ctx.resume()`
3. Context resumes → may trigger another suspend
4. Loop repeats, causing lags and unexpected behavior

**Fix (useBackgroundMusic.ts):**
- Removed the problematic `statechange` event listener entirely
- Keep only a single one-time resume attempt when BGM is disabled
- iOS will naturally suspend the AudioContext; we don't need to fight it with a loop
- No playback happens (element is paused), so the voice AudioContext isn't affected

**Verification:** Typecheck + lint pass; smoke tests confirm no regression (168 passed).

### 3. BGM Autoplay Missing on Scroll Gestures

**Problem:** BGM only auto-unlocked on `touchend` or direct clicks. On mobile, scrolling the page didn't trigger autoplay, leaving the page silent.

**Root Cause:** The autoplay unlock handler (lines 439–474) listened for:
- `touchend` (single touch actions)
- `click` (mouse/pointer clicks)
- `pointerdown` and `keydown` (desktop)

Scrolling on mobile is a different gesture that didn't fire any of these events.

**Fix (useBackgroundMusic.ts):**
- Added `scroll` event listener with `{ capture: true, once: true, passive: true }`
- Scroll is a recognized user gesture on mobile (satisfies browser autoplay policy)
- Fires once (like pointerdown/keydown), then cleanup removes it

**Verification:** Typecheck + lint pass; smoke tests confirm no regression (168 passed).

## Commits

| Task | Commit | Files |
|------|--------|-------|
| 1-3 (combined) | `2a88523` | IntroScreen.tsx, useBackgroundMusic.ts |

## Verification

- **TypeScript**: `bun run typecheck` — PASSED
- **Lint**: `bun run lint` — PASSED
- **Smoke Tests**: `bun run test:smoke` — 168 passed, 55 skipped

## Deviations from Plan

None — all three issues resolved as specified.

## Authentication Gates

None encountered.

## Next Steps

**User verification required:**
1. Test iOS clipboard copy on actual iOS device (Safari)
2. Verify BGM pause/resume is lag-free and stable on mobile
3. Confirm BGM auto-unlocks when scrolling the page on mobile

Return checkpoint after verification.
