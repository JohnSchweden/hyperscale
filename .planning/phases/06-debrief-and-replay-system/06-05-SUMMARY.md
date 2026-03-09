---
phase: 06-debrief-and-replay-system
plan: 05
subsystem: ui
tags: [gamification, replay, unlock-progress, reflection, personality]

# Dependency graph
requires:
  - phase: 06-02
    provides: DebriefPage1Collapse, DebriefPage2AuditTrail base components
provides:
  - useUnlockedEndings hook for calculating unlock progress
  - Enhanced unlock progress display on Page 1
  - Reflection prompt with per-choice hints on Page 2
  - Personality-specific replay encouragement language
affects:
  - debrief-flow
  - gamification-system
  - replay-experience

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "TDD: RED-GREEN cycle for hook development"
    - "Personality-specific copy based on PersonalityType"
    - "Conditional hints based on decision history"

key-files:
  created:
    - hooks/useUnlockedEndings.ts
    - unit/unlocked-endings.test.ts
    - tests/debrief-page-1.spec.ts
    - tests/debrief-page-2.spec.ts
    - tests/debrief-flow.spec.ts
  modified:
    - hooks/index.ts
    - components/game/debrief/DebriefPage1Collapse.tsx
    - components/game/debrief/DebriefPage2AuditTrail.tsx

key-decisions:
  - "Use personality-agnostic base text with personality-specific closing lines"
  - "Show hints only for LEFT (safe) choices suggesting RIGHT (risky) alternatives"
  - "6 endings hard-coded based on DeathType enum count"

patterns-established:
  - "useUnlockedEndings: Hook pattern for gamification state calculations"
  - "Personality replay helpers: switch-based copy functions per personality"
  - "Reflection section: Conversational prompt + conditional hints"

requirements-completed:
  - DEBRIEF-03
  - DEBRIEF-04

# Metrics
duration: 9min
completed: 2026-03-09T21:29:00Z
---

# Phase 06 Plan 05: Gamification and Replay Encouragement Summary

**Unlock progress hook with personality-agnostic text, enhanced Page 1/2 displays, and replay hints encouraging exploration of alternate paths.**

## Performance

- **Duration:** 9 min
- **Started:** 2026-03-09T21:21:01Z
- **Completed:** 2026-03-09T21:29:00Z
- **Tasks:** 5
- **Files modified:** 8

## Accomplishments

1. **useUnlockedEndings hook** - Calculates unlock progress (X/6) with encouraging personality-agnostic text for each unlock level (0, 1, 2-4, 5, all 6)
2. **Enhanced Page 1** - Prominent unlock progress display with trophy icons, large X/6 count, gradient border, and personality-specific replay encouragement
3. **Enhanced Page 2** - Expanded reflection prompt with "What would you do differently?" heading, per-choice hints for safe decisions suggesting riskier alternatives
4. **Personality language** - V.E.R.A. (cynical), ZEN_MASTER (philosophical), LOVEBOMBER (enthusiastic) tones on both pages
5. **Test coverage** - 10 unit tests for unlock logic, 19 E2E tests for gamification features

## Task Commits

Each task was committed atomically:

1. **Task 1: Create useUnlockedEndings hook** - `f8cee11` (feat) - TDD with RED-GREEN cycle
2. **Task 2: Update DebriefPage1Collapse** - `14d9fe2` (feat) - Enhanced progress display
3. **Task 3: Add reflection prompt** - `5672343` (feat) - Hints and expanded prompt
4. **Task 4: Personality-specific language** - `c7c230d` (feat) - Replay encouragement
5. **Task 5: Gamification tests** - `b6946f7` (test) - Integration test coverage

## Files Created/Modified

- `hooks/useUnlockedEndings.ts` - Hook calculating unlock progress and text
- `hooks/index.ts` - Export new hook
- `components/game/debrief/DebriefPage1Collapse.tsx` - Enhanced progress display with personality replay line
- `components/game/debrief/DebriefPage2AuditTrail.tsx` - Reflection prompt, hints, personality closing
- `unit/unlocked-endings.test.ts` - 10 unit tests for unlock logic
- `tests/debrief-page-1.spec.ts` - 5 E2E tests for Page 1
- `tests/debrief-page-2.spec.ts` - 7 E2E tests for Page 2
- `tests/debrief-flow.spec.ts` - 7 E2E tests for flow and personalities

## Decisions Made

1. **Personality-agnostic base text** - The main progress text ("You've unlocked X/6 endings...") is consistent across personalities to maintain clarity, with personality-specific closing lines adding flavor
2. **Hints for safe choices only** - Only LEFT (safer) choices get hints suggesting RIGHT (riskier) alternatives, encouraging exploration of the decision space
3. **Conversational not required** - Reflection prompt is narrative text, not a form input, keeping the flow lightweight

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None significant. Pre-existing test failures in unrelated files (gameReducer.spec.ts, useCountdown.spec.ts) were not addressed as out of scope.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Gamification foundation complete
- Ready for final verification and UAT
- DEBRIEF-03 (Unlock all endings progress) and DEBRIEF-04 (Optional reflection prompt) requirements satisfied

---
*Phase: 06-debrief-and-replay-system*
*Completed: 2026-03-09*
