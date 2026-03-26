---
phase: 17-shuffle-aware-feedback-tts-fixes
plan: "05"
subsystem: audio
tags: [audio, tts, rename, e2e-test, generation-scripts]

# Dependency graph
requires:
  - phase: 17-shuffle-aware-feedback-tts-fixes
    provides: "17-04: authoringFeedbackStem now returns slugified labels instead of _left/_right"
provides:
  - "72 audio files renamed from directional to label-slug names"
  - "E2E test expanded from 8 to 18 cards with slug-based verification"
  - "5 generation scripts updated for label-slug filenames"
affects:
  - "audio playback (filenames now match code output)"
  - "TTS generation (scripts produce correctly-named files)"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Label-slug filename convention: feedback_${cardId}_${slugifiedLabel}.{opus,mp3}"
    - "Per-card object array with leftSlug/rightSlug for test data"

key-files:
  created: []
  modified:
    - public/audio/voices/roaster/feedback/ (72 files renamed)
    - tests/voice-hos-critical-audio.spec.ts
    - scripts/generate-hos-tier1.ts
    - scripts/generate-hos-tier2.ts
    - scripts/generate-hos-tier3.ts
    - scripts/generate-hos-corrupted.ts
    - scripts/generate-hos-remaining.ts

key-decisions:
  - "Used inline shell mv loop with [ -f ] guard for atomic batch rename"
  - "Expanded CRITICAL_HOS_CARDS from 8 to 18 cards (full coverage) with per-card slug objects"

patterns-established:
  - "Rename pattern: _left/_right → label-slug derived from card onLeft/onRight labels"

requirements-completed: [FA-01, FA-02, FA-03]

# Metrics
duration: 8min
completed: 2026-03-27
---

# Phase 17 Plan 05: Rename Directional Audio Files to Label-Slug Names Summary

**72 directional audio files (_left/_right) renamed to label-slug names, E2E test expanded from 8→18 cards with slug-based verification, 5 generation scripts updated to produce label-slug filenames**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-27
- **Completed:** 2026-03-27
- **Tasks:** 2
- **Files modified:** 78 (72 audio + 6 code files)

## Accomplishments
- Renamed all 72 directional audio files (18 card IDs × 2 sides × 2 formats) from `_left`/`_right` suffixes to label-slug names
- Updated E2E test to verify all 18 cards using per-card `leftSlug`/`rightSlug` objects (36 audio files)
- Updated all 5 generation scripts to use label-slug filenames for future re-generation
- All 198 audio tests pass, typecheck clean

## Task Commits

Each task was committed atomically:

1. **Task 1: Rename all directional audio files** - `d9f0869` (chore)
2. **Task 2: Update E2E test and generation scripts** - `cf7b3e3` (test)

## Files Created/Modified
- `public/audio/voices/roaster/feedback/` - 72 files renamed (e.g., `feedback_shadow_ai_hos_1_left.opus` → `feedback_shadow_ai_hos_1_shield-the-team.opus`)
- `tests/voice-hos-critical-audio.spec.ts` - Rewritten with per-card slug objects; expanded from 8→18 cards
- `scripts/generate-hos-tier1.ts` - 4 filenames updated to label slugs
- `scripts/generate-hos-tier2.ts` - 8 filenames updated to label slugs
- `scripts/generate-hos-tier3.ts` - 4 filenames updated to label slugs
- `scripts/generate-hos-corrupted.ts` - 14 filenames updated to label slugs
- `scripts/generate-hos-remaining.ts` - Added `leftSlug`/`rightSlug` fields to 10 card entries; updated filename construction

## Decisions Made
- None — followed plan as specified

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness
- Audio file naming migration complete — code (17-04) returns label slugs, files now have matching names
- All generation scripts will produce correctly-named files on next TTS run
- Plan 17-05 completes the directional→label-slug migration chain (17-01 → 17-04 → 17-05)

---

*Phase: 17-shuffle-aware-feedback-tts-fixes*
*Completed: 2026-03-27*
