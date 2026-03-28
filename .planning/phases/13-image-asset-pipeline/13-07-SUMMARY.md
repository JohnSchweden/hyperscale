---
phase: 13-image-asset-pipeline
plan: "07"
type: simplification
subsystem: data
tags: [centralization, deduplication, simplification]

# Dependency graph
requires:
  - phase: 13-image-asset-pipeline
    provides: RealWorld constants in card-builder.ts (unused)
provides:
  - Centralized incident/label/violation constants in dedicated files
  - Migrated card files using centralized constants
  - Deleted dead card-builder.ts (297 lines)
affects:
  - data/cards/*.ts (10 files)
  - types.ts (makeCard signature)

# Tech tracking
tech-stack:
  added:
    - data/incidents.ts (70+ incident constants)
    - data/choiceLabels.ts (24 choice label constants)
    - data/violations.ts (9 violation pattern constants)
  removed:
    - data/cards/card-builder.ts (297 lines - unused CardBuilder class)
  patterns:
    - Centralized constants imported via RealWorld, ChoiceLabel, Violation
    - makeCard accepts RealWorldReference object directly

requirements_completed: [PIPELINE-04]

# Metrics
duration: ~15min (2 commits)
completed: 2026-03-28
---

# Phase 13 Plan 07: Centralization & Card Migration Summary

**Centralized incident, choice label, and violation constants; migrated all 10 card files to use constants; deleted dead card-builder.ts**

## Performance

- **Duration:** ~15 min (2 commits)
- **Started:** 2026-03-28
- **Completed:** 2026-03-28
- **Commits:** 2

## Accomplishments

1. Created centralized constant files:
   - `data/incidents.ts` — 70+ RealWorld incident constants
   - `data/choiceLabels.ts` — 24 ChoiceLabel constants  
   - `data/violations.ts` — 9 Violation pattern constants

2. Migrated all 10 card files to use centralized constants:
   - ~95 hardcoded incident references → `RealWorld.X`
   - ~64 choice labels → `ChoiceLabel.x`
   - ~19 violations → `Violation.x`

3. Updated `makeCard()` signature to accept `RealWorldReference` object directly

4. Deleted dead `data/cards/card-builder.ts` (297 lines — unused CardBuilder class)

5. Created migration script `scripts/migrate-card-constants.ts` for future updates

## Task Commits

1. **Commit bc1bdc2** — Create central files, delete card-builder.ts
2. **Commit fc9f64b** — Migrate all 10 card files to use constants

## Files Created/Modified

### New Files
- `data/incidents.ts` — 544 lines of incident constants
- `data/choiceLabels.ts` — 82 lines of choice label constants
- `data/violations.ts` — 35 lines of violation constants
- `scripts/migrate-card-constants.ts` — 482 lines migration utility

### Modified Files (10 card decks)
- `data/cards/agentic-engineer.ts` — migrated
- `data/cards/chief-something-officer.ts` — migrated
- `data/cards/data-scientist.ts` — migrated
- `data/cards/head-of-something.ts` — migrated
- `data/cards/software-architect.ts` — migrated
- `data/cards/software-engineer.ts` — migrated
- `data/cards/something-manager.ts` — migrated
- `data/cards/tech-ai-consultant.ts` — migrated
- `data/cards/vibe-coder.ts` — migrated
- `data/cards/vibe-engineer.ts` — migrated
- `types.ts` — updated makeCard signature

### Deleted Files
- `data/cards/card-builder.ts` — 297 lines, unused

## Key Decisions

- Kept unique labels/incidents inline (not all strings were duplicated)
- Used migration script for programmatic find-replace across 10 large files
- Added barrel exports to `data/index.ts` for convenient imports

## Verification

- `bun run typecheck` — ✅ passes
- `bun run test:data` — ✅ passes

---

*Phase: 13-image-asset-pipeline*
*Completed: 2026-03-28*
