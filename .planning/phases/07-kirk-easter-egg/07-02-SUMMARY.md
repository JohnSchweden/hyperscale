---
phase: 07-kirk-easter-egg
plan: "02"
subsystem: ui
tags: [react, css-animations, gesture-detection, easter-egg, kirk]

# Dependency graph
requires:
  - phase: 07-01
    provides: "Kirk state machine (KIRK_REFUSAL action, kirkCounter, kirkCorruptionActive)"
provides:
  - "onSwipeUp callback in useSwipeGestures — vertical-dominant upward swipe detection"
  - "Kirk CSS classes (kirk-flicker, kirk-corrupted, kirk-glitch-text) with reduced-motion support"
  - "IntroScreen Kirk taunt hint: 'Captain Kirk passed this test. You won't.'"
  - "InitializingScreen [REDACTED] boot line"
affects: [07-03, CardStack, App]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Swipe-up detection via lastDeltaX/lastDeltaY persistent refs + isHorizontalSwipe guard + 1.5x ratio"
    - "CSS class names prefixed with kirk- for Easter egg visual layer"
    - "prefers-reduced-motion media query for all Kirk animation classes"

key-files:
  created: []
  modified:
    - "hooks/useSwipeGestures.ts"
    - "index.html"
    - "components/game/IntroScreen.tsx"
    - "components/game/InitializingScreen.tsx"

key-decisions:
  - "Track lastDeltaX/lastDeltaY as persistent refs alongside pendingSwipeRef to capture final position even when RAF clears the pending buffer before touchend fires"
  - "Use 1.5x ratio guard (|deltaY| > |deltaX| * 1.5) combined with !isHorizontalSwipe.current to prevent diagonal false positives"
  - "Swipe-up always snaps card back — does not exit the screen; the trigger is silent to avoid confusion with left/right swipes"
  - "Kirk hint text styled text-slate-500 at 10px — subtle enough to feel like an Easter egg, not primary UI"
  - "[REDACTED] boot line styled text-red-400/50 — muted enough to feel redacted but noticeable on re-read"

patterns-established:
  - "Swipe-up detection pattern: use persistent refs for delta accumulation, guard with horizontal-lock flag and ratio check"
  - "Kirk CSS layer: all effects prefixed kirk-, all have prefers-reduced-motion fallbacks"

requirements-completed: [KIRK-01]

# Metrics
duration: 9min
completed: 2026-03-22
---

# Phase 7 Plan 02: Kirk Easter Egg — Trigger Mechanisms Summary

**Swipe-up gesture detection with 1.5x ratio guard, Kirk CSS glitch keyframes (flicker/corrupt/glitch-text), and subtle IntroScreen/InitializingScreen discoverability hints**

## Performance

- **Duration:** ~9 min
- **Started:** 2026-03-22T22:38:24Z
- **Completed:** 2026-03-22T22:47:38Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Extended `useSwipeGestures` with `onSwipeUp` callback — detects vertical-dominant upward swipes, fires callback, snaps card back cleanly
- Added Kirk CSS glitch animation layer: `kirk-flicker` (150ms brief flash), `kirk-corrupted` (persistent 300ms loop with scanline overlay), `kirk-glitch-text` (RGB-split text shadow) — all with `prefers-reduced-motion` fallbacks
- IntroScreen: added subtle "Captain Kirk passed this test. You won't." taunt in muted `text-slate-500`
- InitializingScreen: added `> override protocols: [REDACTED]` boot line styled with `text-red-400/50`

## Task Commits

Each task was committed atomically:

1. **Task 1: Swipe-up detection in useSwipeGestures** - `190d1ed` (feat)
2. **Task 2: CSS glitch effects and discoverability hints** - `92a6756` (feat)

## Files Created/Modified
- `hooks/useSwipeGestures.ts` - Added `onSwipeUp` to options interface, lastDeltaX/Y tracking refs, swipe-up detection in handleTouchEnd
- `index.html` - Added Kirk CSS: `@keyframes kirk-flicker`, `.kirk-flicker`, `@keyframes kirk-corrupt`, `.kirk-corrupted` with `::before` scanline overlay, `.kirk-glitch-text`, `@keyframes kirk-text-glitch`, reduced-motion block
- `components/game/IntroScreen.tsx` - Kirk taunt hint below WARNING line
- `components/game/InitializingScreen.tsx` - [REDACTED] boot line between compliance budget and neural interface

## Decisions Made
- Persistent `lastDeltaX`/`lastDeltaY` refs alongside `pendingSwipeRef`: the RAF handler may clear `pendingSwipeRef` before `touchend` fires, so the persistent refs ensure we always have the final delta available at end-of-gesture.
- 1.5x vertical dominance ratio + `!isHorizontalSwipe.current` guard: both conditions required to prevent diagonal swipes from triggering the Easter egg.
- Card snaps back on swipe-up (same path as below-threshold horizontal) — no card stuck state, gesture feels natural.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Committed prerequisite 07-01 work before proceeding**
- **Found during:** Task 1 (attempting to commit useSwipeGestures.ts)
- **Issue:** Pre-commit hook (husky + lint-staged) failed because 07-01 files (types.ts, useGameState.ts, etc.) were modified but unstaged. lint-staged stashes unstaged changes, causing tsc to see the old GameState without kirkCounter/kirkCorruptionActive, failing typecheck.
- **Fix:** Discovered 07-01 commits had already been created (`4d30f5e`, `d423878`) by a prior agent. The working tree was already at HEAD matching committed state. The hook failure was a transient worktree/lint-staged stash conflict.
- **Files modified:** None (no additional changes needed)
- **Verification:** `bun run typecheck` passes clean
- **Committed in:** N/A (resolved automatically)

---

**Total deviations:** 1 blocking issue (lint-staged worktree stash conflict with pre-existing 07-01 uncommitted files — resolved by discovery that 07-01 was already committed)
**Impact on plan:** No scope creep. Resolved without additional code changes.

## Issues Encountered
- lint-staged v16 git worktree conflict: when partially-staged files exist with working-tree changes, lint-staged stashes the working-tree changes and runs tsc — which may fail if unstaged prereqs are required. Pre-run `bun run fix:file --` on specific files before staging prevents lint-staged from needing to apply any patch, avoiding the conflict.

## Next Phase Readiness
- `onSwipeUp` callback wired and ready — plan 07-03 can pass it to `useSwipeGestures` in `App.tsx` to trigger `KIRK_REFUSAL` dispatch
- Kirk CSS classes ready to be applied by plan 07-03 logic (add `kirk-flicker` class on first refusal, `kirk-corrupted` on second)
- Discoverability hints live in the game — players will notice the boot line and taunt organically

---
*Phase: 07-kirk-easter-egg*
*Completed: 2026-03-22*
