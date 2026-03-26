---
phase: 17-shuffle-aware-feedback-tts-fixes
plan: "01"
subsystem: testing
tags: [shuffle, tts, feedback-audio, vitest, types]

requires:
  - phase: "15-voice-files-expanded"
    provides: Pre-baked feedback clip naming and playback pipeline
provides:
  - Card.choiceSidesSwapped set on every shuffleDeck output
  - authoringFeedbackStem(card, LEFT|RIGHT) → authoring left|right suffix
affects:
  - 17-02-PLAN (App / overlay / useVoicePlayback wiring)

tech-stack:
  added: []
  patterns:
    - "Shuffle metadata records whether presentation order matches authoring onLeft/onRight"
    - "Feedback filenames keyed by authoring arm of chosen visible slot, not swipe direction alone"

key-files:
  created:
    - lib/feedbackAudioChoice.ts
    - unit/feedbackAudioChoice.test.ts
  modified:
    - types.ts
    - lib/deck.ts
    - lib/deck.test.ts

key-decisions:
  - "Every shuffleDeck card gets explicit choiceSidesSwapped true|false (no implicit undefined after shuffle)"
  - "PresentationChoiceSlot uses same LEFT|RIGHT literals as game history"

patterns-established:
  - "authoringFeedbackStem inverts slot→suffix only when choiceSidesSwapped is true"

requirements-completed: [FA-01]

duration: 3min
completed: "2026-03-26"
---

# Phase 17 Plan 01: Shuffle-aware feedback stem foundation

**Card-level `choiceSidesSwapped` after shuffle plus pure `authoringFeedbackStem` maps the visible choice slot to the correct `feedback_*_left|right` authoring suffix.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-26T22:43:00Z
- **Completed:** 2026-03-26T22:45:00Z
- **Tasks:** 2 (each with TDD test + feat commits)
- **Files touched:** 5

## Accomplishments

- `Card.choiceSidesSwapped` documents per-card left/right presentation vs authoring
- `shuffleDeck` always sets the flag and uses explicit copy on the no-swap branch
- `authoringFeedbackStem` encodes swapped vs not × LEFT/RIGHT in one place for upcoming TTS wiring

## Task Commits

1. **Task 1: Card flag + shuffleDeck** — `916beb2` (test), `f16b492` (feat)
2. **Task 2: authoringFeedbackStem helper** — `e6a6909` (test), `6a24707` (feat)

**Plan metadata:** `8ad1d38` (docs: complete plan)

_Note: TDD tasks use paired test → feat commits._

## Files Created/Modified

- `types.ts` — optional `choiceSidesSwapped` on `Card`
- `lib/deck.ts` — set flag on swap and no-swap paths
- `lib/deck.test.ts` — deterministic `Math.random` coverage
- `lib/feedbackAudioChoice.ts` — `authoringFeedbackStem`, `PresentationChoiceSlot`
- `unit/feedbackAudioChoice.test.ts` — table-driven mapping cases

## Decisions Made

- Explicit `choiceSidesSwapped: false` on the no-swap path so every post-shuffle card carries a boolean (no silent undefined).
- Exported `PresentationChoiceSlot` as `LEFT` | `RIGHT` aligned with history typing.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for **17-02**: wire `currentCard`, `FeedbackOverlay`, and `useVoicePlayback` to use `authoringFeedbackStem` for clip paths.

---

_Phase: 17-shuffle-aware-feedback-tts-fixes_

## Self-Check: PASSED

- `lib/feedbackAudioChoice.ts` — FOUND
- `unit/feedbackAudioChoice.test.ts` — FOUND
- Commits `916beb2`, `f16b492`, `e6a6909`, `6a24707`, `8ad1d38` — present on branch
