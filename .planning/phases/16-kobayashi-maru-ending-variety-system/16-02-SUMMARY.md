---
phase: 16-kobayashi-maru-ending-variety-system
plan: 02
subsystem: game-state-death-resolution
tags: [death-vectors, game-reducer, vector-integration, tdd]
dependency_graph:
  requires: [16-01]
  provides: [vector-aware-death-type-resolution]
  affects: [game-state-reducer, death-type-determination]
tech_stack:
  added: []
  patterns: [helper-function-injection, vector-accumulation-in-state-machine, archetype-tiebreaking]
key_files:
  created: []
  modified:
    - hooks/useGameState.ts
    - data/deathVectors.ts
    - unit/gameReducer.spec.ts
decisions:
  - Vector-aware death type resolution implemented as resolveDeathType() helper function
  - Helper function injected into NEXT_INCIDENT and BOSS_COMPLETE reducer cases
  - Legacy determineDeathType() marked as @deprecated but preserved for backward compatibility
  - All override paths (BANKRUPT, KIRK, REPLACED_BY_SCRIPT) take priority over vectors
  - Archetype tiebreaking used when multiple vectors have equal frequency
metrics:
  duration: 15 minutes
  tasks_completed: 1
  files_created: 0
  files_modified: 3
  test_coverage: 7 new tests covering vector-aware death determination
  test_pass_rate: 26/26 gameReducer tests (100%)
  completion_date: 2026-03-25
---

# Phase 16 Plan 02: Wire Death Vectors into Game Reducer - Summary

**Integrated vector-aware death type resolution into game state machine**

## What Was Built

This plan wired the death vector system (from Plan 01) into the game state reducer, replacing the role-based-only death determination with choice-driven logic. Players' decisions now directly influence which death ending they receive.

### Key Components

**1. resolveDeathType() Helper Function**
- Accumulates death vectors from player history using `accumulateDeathVectors()`
- Calculates dominant archetype via `calculateArchetype()` for tiebreaking
- Calls `determineDeathTypeFromVectors()` with full context (vectors, budget, heat, hype, role, archetype)
- Returns vector-aware death type respecting all override conditions

**2. NEXT_INCIDENT Case Update**
- Line 359: Replaced `determineDeathType(budget, heat, hype, role)` with `resolveDeathType(state)`
- Now uses accumulated player choice patterns to determine death type
- Preserves budget/heat/KIRK override logic (executed before resolveDeathType)

**3. BOSS_COMPLETE Failure Case Update**
- Line 403: Replaced hardcoded `DeathType.AUDIT_FAILURE` with `resolveDeathType(state)`
- Boss fight failure now reflects player's decision pattern, not a fixed death type
- All override logic preserved (BANKRUPT, KIRK, REPLACED_BY_SCRIPT still execute first)

**4. Legacy Function Deprecation**
- Original `determineDeathType()` marked with `@deprecated` JSDoc comment
- Preserved for backward compatibility with existing consumers
- Internal comments explain it should not be used in new code

### Test Coverage

**7 New Tests Added to gameReducer.spec.ts:**

1. **NEXT_INCIDENT with death vectors** - Verifies vector-based death type selection (e.g., CONGRESS from 2+ vector signals)
2. **NEXT_INCIDENT without deathVectors** - Confirms fallback to legacy role-based logic when no vectors present
3. **BOSS_COMPLETE failure uses vectors** - Boss fight failure respects player's choice pattern (PRISON from vectors, not hardcoded AUDIT_FAILURE)
4. **BOSS_COMPLETE fallback** - Fallback to legacy when no vectors in history
5. **BANKRUPT override** - Budget exhaustion still wins over any vectors (highest priority)
6. **KIRK corruption override** - Kirk state still prevents other death types
7. **REPLACED_BY_SCRIPT override** - Heat + low hype still prevents other death types

All 19 existing gameReducer tests still pass (backward compatibility verified).

## Verification

✓ All 26 gameReducer.spec.ts tests pass (19 existing + 7 new)
✓ All 13 deathVectors.spec.ts tests from Plan 01 still pass
✓ TypeScript typecheck passes (no type errors)
✓ Biome linting passes (all style checks)
✓ Pre-commit hooks: all checks passed

## Output Artifacts

- **Commit:** `ab80238` — "feat(16-02): wire death vectors into game reducer with vector-aware death type resolution"
- **Files modified:** 3 (hooks/useGameState.ts, data/deathVectors.ts, unit/gameReducer.spec.ts)
- **Test coverage:** 7 new tests, 100% pass rate
- **Code quality:** No regressions, backward compatible

## Deviations from Plan

None — plan executed exactly as specified. TDD approach with comprehensive test coverage.

## Next Steps

Plan 16-03 and 16-04 will add congressional hearing cards and debrief enhancements to complete the ending variety system. The vector-aware foundation is now ready for content integration.
