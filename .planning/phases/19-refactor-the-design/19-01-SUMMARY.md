---
phase: 19-refactor-the-design
plan: "01"
subsystem: ui
tags: [react, tailwind, feedback-overlay, subtractive-design]

# Dependency graph
requires: []
provides:
  - Simplified FeedbackOverlay with subtractive clutter removal
  - Image height capped at 220px on desktop
  - Unlabeled secondary content block (lesson + teamImpact + realWorldReference)
affects: [feedback-overlay, card-swipe-feedback-loop]

# Tech tracking
tech-stack:
  added: []
  patterns: [subtractive-design-refactor, unlabeled-secondary-block]

key-files:
  modified:
    - components/game/FeedbackOverlay.tsx

key-decisions:
  - "Removed personality name label — quote speaks for itself"
  - "Removed 'Governance alert' section header — violates one-section-one-job rule"
  - "Removed 'Decision logged' noise line — states the obvious"
  - "Capped image at 220px desktop — prevents 40-50% viewport consumption"
  - "Merged teamImpact/realWorldReference into one unlabeled block — no competing labels"

patterns-established:
  - "Subtractive refactor: remove visual noise, keep content. Target flow: [image] -> [icon + fine] -> [quote] -> [lesson + reference (unlabeled)] -> [button]"

requirements-completed: [DESIGN-01]

# Metrics
duration: 18min
completed: 2026-03-29
---

# Phase 19 Plan 01: FeedbackOverlay Clutter Removal Summary

**Subtractive cleanup of FeedbackOverlay: removed personality label, governance header, noise line, uncapped image, and competing sub-section labels**

## Performance

- **Duration:** 18 min
- **Started:** 2026-03-28T23:44:46Z
- **Completed:** 2026-03-29T00:02:29Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Removed 5 visual clutter elements from FeedbackOverlay
- Cleaned up unused imports and variables (PERSONALITIES, personalityName, personality destructure)
- Merged teamImpact and realWorldReference into one unlabeled secondary content block

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove 5 clutter elements from FeedbackOverlay** - `277afda` (feat)

## Files Created/Modified
- `components/game/FeedbackOverlay.tsx` — Removed personality label, governance header, decision noise line, capped image height at 220px desktop, merged teamImpact/realWorldReference labels into unlabeled block, cleaned up unused imports

## Decisions Made
- Removed personality name label above quote — the quote speaks for itself without attribution
- Removed "Governance alert" section header — labeled sub-section header violates the one-section-one-job rule from design DNA
- Removed "Decision logged — no undo" line — states what the UI already communicates
- Capped desktop image at 220px (was uncapped md:max-h-none consuming 40-50% of viewport)
- Merged teamImpact and realWorldReference into single unlabeled secondary block — labels "Team impact" and "Real Case:" competed for attention with the quote

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing typecheck error in `DebriefPage1Collapse.tsx` (TS2304: `getPersonalityReplayLine` not found) — unrelated to this plan's changes
- Pre-existing LSP errors in `lib/gif-overlay.ts`, `tests/helpers/km-debug-state.ts`, `App.tsx` — all unrelated

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- FeedbackOverlay now renders: `[image] -> [icon + fine] -> [quote] -> [lesson + reference (unlabeled)] -> [button]`
- Ready for 19-02 (GameOver clutter removal)

## Self-Check: PASSED

- [x] SUMMARY.md exists at `.planning/phases/19-refactor-the-design/19-01-SUMMARY.md`
- [x] Task commit `bec644f` exists (feat: remove 5 clutter elements)
- [x] Metadata commit `28e8213` exists (docs: complete plan)
- [x] `components/game/FeedbackOverlay.tsx` exists with all changes applied
- [x] STATE.md updated (position, decisions, session log)
- [x] ROADMAP.md updated (Phase 19: 5/5 complete)

---

*Phase: 19-refactor-the-design*
*Completed: 2026-03-29*
