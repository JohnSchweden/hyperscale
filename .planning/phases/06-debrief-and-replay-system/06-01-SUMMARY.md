---
phase: 06-debrief-and-replay-system
plan: 01
subsystem: debrief
tags: [archetype, personality, resilience, scoring, hooks]

requires:
  - phase: 05-card-system
    provides: [Card, GameState, ROLE_CARDS]

provides:
  - Archetype type definitions (ArchetypeId, Archetype, DebriefState, DebrieRStage)
  - ARCHETYPES mapping with 6 personality types
  - calculateArchetype() function for decision pattern analysis
  - calculateResilienceScore() function for consistency scoring
  - useArchetype hook with memoization
  - Unit tests (22 tests covering all functionality)

affects:
  - 06-debrief-and-replay-system (Wave 1: UI components)

tech-stack:
  added: []
  patterns:
    - "TDD: RED-GREEN-REFACTOR for each feature"
    - "Weighted decision vectors for archetype scoring"
    - "useMemo for archetype calculation caching"
    - "Barrel exports from data/ and hooks/"

key-files:
  created:
    - data/archetypes.ts - Archetype definitions and calculation logic
    - hooks/useArchetype.ts - React hook for archetype calculation
    - unit/archetype.test.ts - Comprehensive unit tests
  modified:
    - types.ts - Added ArchetypeId, Archetype, DebriefState, DebrieRStage types
    - data/index.ts - Exported archetype functions
    - hooks/index.ts - Exported useArchetype hook

key-decisions:
  - "6 archetypes sufficient for MVP (PRAGMATIST, SHADOW_ARCHITECT, DISRUPTOR, CONSERVATIVE, BALANCED, CHAOS_AGENT)"
  - "Resilience score (0-100) based on decision consistency, not correctness"
  - "Archetype calculation happens once via useMemo, not on every render"
  - "Empty history defaults to BALANCED archetype"
  - "Null role returns null archetype (guard against invalid state)"

patterns-established:
  - "Decision vector scoring: map outcomes to trait increments based on penalty thresholds"
  - "Consistency-based resilience: dominant trait score / total score normalized to 0-100"
  - "Hook memoization: useArchetype caches result until inputs change"

requirements-completed: [DEBRIEF-01, DEBRIEF-02, DEBRIEF-12]

duration: 8min
completed: 2026-03-09T21:07:46Z
---

# Phase 06 Plan 01: Archetype System Foundation Summary

**Archetype system with 6 personality types, decision vector scoring, and memoized useArchetype hook for deterministic debrief calculations**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-09T20:59:43Z
- **Completed:** 2026-03-09T21:07:46Z
- **Tasks:** 3 (Tasks 1-3 executed, Task 4 verification integrated throughout)
- **Files modified:** 5

## Accomplishments

- Defined ArchetypeId type union with 6 values (PRAGMATIST, SHADOW_ARCHITECT, DISRUPTOR, CONSERVATIVE, BALANCED, CHAOS_AGENT)
- Created Archetype interface with id, name, description, icon, color, traits
- Added DebriefState and DebrieRStage types for 3-page debrief flow
- Implemented ARCHETYPES map with full definitions for all 6 personality types
- Built mapOutcomeToTraits() to convert decision outcomes to trait increments
- Created calculateArchetype() to determine dominant archetype from decision history
- Implemented calculateResilienceScore() (0-100) based on decision consistency
- Built useArchetype hook with useMemo caching to prevent recalculation on renders
- Wrote 22 unit tests covering types, archetype calculation, scoring, and hook behavior

## Task Commits

Each task was committed atomically:

1. **Task 1: Define archetype types and data structures** - `3c9aca2` (test)
2. **Task 2: Create archetype mapping and scoring logic** - `3ed96d8` (feat)
3. **Task 3: Create useArchetype hook** - `9003915` (feat)

**Plan metadata:** [to be committed with SUMMARY.md]

_Note: TDD approach produced test-first commits for each feature_

## Files Created/Modified

- `types.ts` - Added ArchetypeId, Archetype, DebriefState, DebrieRStage types
- `data/archetypes.ts` - ARCHETYPES map, calculateArchetype(), calculateResilienceScore(), mapOutcomeToTraits()
- `data/index.ts` - Exported archetype functions
- `hooks/useArchetype.ts` - useArchetype hook with memoization
- `hooks/index.ts` - Exported useArchetype
- `unit/archetype.test.ts` - 22 unit tests for archetype system

## Decisions Made

- **6 archetypes sufficient for MVP** - Can expand to 8 in future if UAT shows concentration in single archetype
- **Resilience = consistency, not correctness** - Rewards staying true to a pattern, not "good" decisions (avoids judgment)
- **useMemo for caching** - Archetype calculation happens once when inputs change, not on every render
- **Empty history → BALANCED** - Default archetype when no decisions made (neutral starting point)
- **Null role → null archetype** - Guard against invalid state transitions

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - smooth execution with TDD approach.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Wave 0 (data layer) complete
- Ready for Wave 1: Debrief UI components (DebriefPage1Collapse, DebriefPage2AuditTrail, DebriefPage3Verdict)
- useArchetype hook ready for integration into debrief flow
- Types ready for GameStage extension with DEBRIEF_PAGE_1/2/3

---
*Phase: 06-debrief-and-replay-system*
*Completed: 2026-03-09*
