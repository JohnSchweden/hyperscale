---
phase: 06-debrief-and-replay-system
plan: 02
subsystem: ui
tags: [debrief, archetype, resilience, react, typescript]

# Dependency graph
requires:
  - phase: 06-01
    provides: "GameState structure, death endings, personality system"
provides:
  - 3-page debrief flow (Collapse → Audit Trail → Verdict)
  - DebriefContainer router component
  - useDebrief navigation hook
  - GameStage enum extensions
  - Archetype calculation integration
affects:
  - App.tsx stage routing
  - GameState transitions
  - debrief-and-replay-system

tech-stack:
  added: []
  patterns:
    - "Router pattern: DebriefContainer switches on GameStage"
    - "Hook pattern: useDebrief manages page state and archetype calc"
    - "Stage transition enforcement via STAGE_TRANSITIONS map"

key-files:
  created:
    - components/game/debrief/DebriefPage1Collapse.tsx
    - components/game/debrief/DebriefPage2AuditTrail.tsx
    - components/game/debrief/DebriefPage3Verdict.tsx
    - components/game/debrief/DebriefContainer.tsx
    - hooks/useDebrief.ts
  modified:
    - types.ts
    - hooks/useGameState.ts
    - hooks/index.ts
    - components/game/index.ts
    - App.tsx
    - data/cards/nowin-dilemmas.ts

key-decisions:
  - "Auto-fixed import path in nowin-dilemmas.ts (was breaking typecheck)"
  - "Used biome-ignore for stable array index key in audit trail (chronological log doesn't reorder)"
  - "Archetype calculation memoized in useDebrief, runs once when entering DEBRIEF_PAGE_1"

patterns-established:
  - "Debrief page components accept state and navigation callbacks as props"
  - "DebriefContainer acts as router based on GameStage"
  - "useDebrief hook encapsulates page progression and archetype calculation"
  - "Stage transitions enforced via STAGE_TRANSITIONS map in useGameState"

requirements-completed: [DEBRIEF-05, DEBRIEF-06, DEBRIEF-07, DEBRIEF-08, DEBRIEF-09]

# Metrics
duration: 8min
completed: 2026-03-09
---

# Phase 06 Plan 02: 3-Page Debrief Flow Summary

**Built 3-page debrief UI flow: Collapse (Page 1) → Audit Trail (Page 2) → Verdict (Page 3), with GameStage enum extensions, DebriefContainer router, and useDebrief navigation hook integrating archetype calculation.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-09T20:59:51Z
- **Completed:** 2026-03-09T21:08:10Z
- **Tasks:** 8
- **Files modified:** 11

## Accomplishments

- Extended GameStage enum with DEBRIEF_PAGE_1, DEBRIEF_PAGE_2, DEBRIEF_PAGE_3
- Updated STAGE_TRANSITIONS to enforce: GAME_OVER → Page 1 → Page 2 → Page 3 → INTRO
- Created DebriefPage1Collapse: Game Over summary with metrics and [Debrief Me] button
- Created DebriefPage2AuditTrail: Incident audit log with personality sign-off
- Created DebriefPage3Verdict: Archetype verdict, resilience score, LinkedIn share, restart
- Created DebriefContainer: Router component that renders correct page based on stage
- Created useDebrief hook: Manages page navigation and automatic archetype calculation
- Wired all debrief stages into App.tsx stage router

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend GameStage enum** - `8b771a0` (feat)
2. **Task 2: Create DebriefPage1Collapse** - `cb42b0f` (feat)
3. **Task 3: Create DebriefPage2AuditTrail** - `c3ac026` (feat)
4. **Task 4: Create DebriefPage3Verdict** - `4f74add` (feat)
5. **Task 5: Create DebriefContainer** - `06f7365` (feat)
6. **Task 6: Create useDebrief hook** - `0b410c6` (feat)
7. **Task 7: Wire debrief stages into App.tsx** - `762d842` (feat)
8. **Task 8: Export debrief components** - `dac4177` (feat)

**Plan metadata:** (to be committed)

## Files Created/Modified

- `types.ts` - Added DEBRIEF_PAGE_1, DEBRIEF_PAGE_2, DEBRIEF_PAGE_3 to GameStage enum
- `hooks/useGameState.ts` - Updated STAGE_TRANSITIONS for debrief flow
- `hooks/useDebrief.ts` - New hook for debrief navigation and archetype calculation
- `hooks/index.ts` - Added useDebrief export
- `components/game/debrief/DebriefPage1Collapse.tsx` - Page 1: Game Over + [Debrief Me]
- `components/game/debrief/DebriefPage2AuditTrail.tsx` - Page 2: Audit log + personality sign-off
- `components/game/debrief/DebriefPage3Verdict.tsx` - Page 3: Archetype verdict + share + restart
- `components/game/debrief/DebriefContainer.tsx` - Router component
- `components/game/index.ts` - Added debrief component exports
- `App.tsx` - Wired debrief stages into stage router
- `data/cards/nowin-dilemmas.ts` - Fixed import path (../types → ../../types)

## Decisions Made

- Followed established button styling (white bg, black text, cyan hover) for consistency
- Used max-w-2xl container for focused debrief content
- Archetype calculation runs once when entering DEBRIEF_PAGE_1 (memoized with useRef)
- Audit trail uses index as key (biome-ignored) since it's a chronological log that never reorders

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed import path in data/cards/nowin-dilemmas.ts**
- **Found during:** Task 1 (typecheck verification)
- **Issue:** Import path was `../types` but file is in `data/cards/`, should be `../../types`
- **Fix:** Changed import to `../../types`
- **Files modified:** data/cards/nowin-dilemmas.ts
- **Verification:** Typecheck passes
- **Committed in:** 8b771a0 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor fix to pre-existing import issue. No scope creep.

## Issues Encountered

None - all tasks completed as planned.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 3-page debrief flow is fully implemented and wired into App.tsx
- Archetype calculation integrated via useDebrief hook
- Ready for Wave 2: email capture and LinkedIn share integration
- Requirements DEBRIEF-05, 06, 07, 08, 09 satisfied

---
*Phase: 06-debrief-and-replay-system*
*Completed: 2026-03-09*
