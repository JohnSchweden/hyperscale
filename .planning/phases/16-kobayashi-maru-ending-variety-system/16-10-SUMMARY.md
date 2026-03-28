---
phase: 16-kobayashi-maru-ending-variety-system
plan: "10"
type: simplification
subsystem: game-logic
tags: [dead-code, cleanup, simplification]

# Dependency graph
requires:
  - phase: 16-kobayashi-maru-ending-variety-system
    provides: Death vector system, failure lessons data
provides:
  - Removed deprecated determineDeathType function
  - Fixed type bug in getRoleDeck fallback
  - Stored vectorMap in GameState to avoid recomputation
  - Cleaned up test coverage gaps
affects:
  - hooks/useGameState.ts
  - components/game/debrief/DebriefPage1Collapse.tsx
  - data/deathEndings.ts
  - data/deathVectors.ts
  - unit/deathVectorCoverage.test.ts

# Tech tracking
tech-stack:
  patterns:
    - vectorMap stored in GameState during resolveDeathType
    - Deprecated determineDeathType removed (use determineDeathTypeFromVectors instead)
    - Dead fields/entries removed from data structures

requirements_completed: [DV-02, DV-03]

# Metrics
duration: ~10min (1 commit)
completed: 2026-03-28
---

# Phase 16 Plan 10: Simplification & Cleanup Summary

**Removed dead code, fixed type bugs, stored vectorMap in state, fixed test gaps**

## Performance

- **Duration:** ~10 min (1 commit)
- **Started:** 2026-03-28
- **Completed:** 2026-03-28

## Accomplishments

1. **Removed deprecated determineDeathType function**
   - Had divergent logic from new `determineDeathTypeFromVectors`
   - Tests updated to use the new function

2. **Fixed type bug in getRoleDeck() fallback**
   - `getRoleDeck()` returned string but `accumulateDeathVectors()` expected `Card[]`
   - Fixed to resolve actual card array from `ROLE_CARDS[role]`

3. **Stored vectorMap in GameState**
   - `accumulateDeathVectors()` was running in both reducer and component render
   - Now computed once during `resolveDeathType` and stored in state
   - Component reads from state instead of recomputing

4. **Removed dead code:**
   - `causeHint` field from DeathEnding type and all entries
   - Unused KIRK entry from `ARCHETYPE_DEATH_AFFINITY`
   - Redundant deathType check when deathEnding is truthy
   - Duplicated slugify function in tests

5. **Fixed test gaps:**
   - Added 4 missing roles to `VECTOR_ANNOTATED_ROLES` (CSO, HoS, SM, TAC)
   - Condition-gated image-assets test instead of permanent `.skip()`
   - Removed tautological test ("no single death type exceeds 100%")
   - Simplified PersonalityKey type usage

## Commits

- **Commit 56f889d** — refactor(simplify): remove dead code, fix test gaps, store vectorMap in state

## Files Modified

| File | Changes |
|------|---------|
| `hooks/useGameState.ts` | Store vectorMap in state, use from state |
| `components/game/debrief/DebriefPage1Collapse.tsx` | Read vectorMap from state |
| `data/deathEndings.ts` | Remove causeHint field |
| `data/deathVectors.ts` | Remove KIRK from ARCHETYPE_DEATH_AFFINITY |
| `types.ts` | Add vectorMap to GameState type |
| `unit/deathVectorCoverage.test.ts` | Add missing roles, fix test patterns |
| `tests/data/image-map.test.ts` | Remove duplicated slugify |
| `tests/data/image-assets.test.ts` | Condition-gate on directory existence |

## Not Done (Out of Scope for This Plan)

- Modularization: Extracting hydration.ts and deathResolver.ts from useGameState.ts
  - This was originally in 16-10 but was replaced by the simplification work above

## Verification

- `bun run typecheck` — ✅ passes
- `bun run test:unit` — ✅ passes

---

*Phase: 16-kobayashi-maru-ending-variety-system*
*Completed: 2026-03-28*
