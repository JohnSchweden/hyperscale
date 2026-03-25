---
phase: 13-image-asset-pipeline
plan: 13-00
status: completed
completed_date: 2026-03-25
---

# Plan 13-00 Summary — Image Map Test Suite (Wave 0)

**Retrospective.** This plan is done; this file was backfilled because the original completion artifact was never committed to `.planning/`.

## Where the code lives

Implementation and tests are on branch **`gsd/phase-13-image-asset-pipeline`** (local worktree: sibling directory **`phase-13-images`** next to the `swiperisk` repo). **`main` does not yet contain** `data/imageMap.ts` or `tests/data/image-map.test.ts`.

## Delivered

| Deliverable | Location (worktree) |
|-------------|---------------------|
| Dynamic incident map contract tests | `tests/data/image-map.test.ts` |
| On-disk asset smoke tests | `tests/data/image-assets.test.ts` |
| Vitest wiring | `vitest.config.ts` — `tests/data/**/*.test.ts` |

## What the tests assert

- **INCIDENT_IMAGES**: Every `realWorldReference.incident` across `ROLE_CARDS` has a slug key; paths use `/images/incidents/{slug}.webp`; no duplicate slugs; count matches unique incidents from card data (no hardcoded incident totals).
- **OUTCOME_IMAGES**: Eight legacy consequence keys present with expected paths.
- **ARCHETYPE_IMAGES** / **DEATH_IMAGES**: Full key coverage vs `ArchetypeId` / `DeathType`.
- **Helpers**: `getIncidentImagePath`, `getOutcomeImagePath`, `getArchetypeImagePath`, `getDeathImagePath` exercised (incident helper allows fallback path).
- **image-assets.test.ts**: Files exist under `public/images/...`, non-empty, WebP extension (when assets are present in that tree).

## Spec drift (read this)

Planning was later aligned to **`13-CONTRACT.md`** (HOS pilot, outcome keys `{incidentSlug}-left` / `-right`). The **as-built map module** in the worktree still uses the **eight-type `OutcomeConsequenceType`** model. Treat this summary as a snapshot of Wave 0 test coverage; normative product keys are in **13-CONTRACT** + **13-CONTEXT**.

## Verification

```sh
cd ../phase-13-images && bun run test:data
```
