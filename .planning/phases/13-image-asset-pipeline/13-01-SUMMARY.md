---
phase: 13-image-asset-pipeline
plan: 13-01
status: completed
completed_date: 2026-03-25
---

# Plan 13-01 Summary — Image Map Module (`data/imageMap.ts`)

**Retrospective.** This plan is done; this file was backfilled because the original completion artifact was never committed to `.planning/`.

## Where the code lives

Same as 13-00: **`gsd/phase-13-image-asset-pipeline`** / worktree **`phase-13-images`** (sibling of `swiperisk`). Not merged to **`main`** at the time this summary was written.

## Delivered

| Piece | Behavior |
|-------|----------|
| `slugifyIncident()` | Normalizes incident strings to kebab-case slugs for filenames |
| `INCIDENT_IMAGES` | Built at module load from all `ROLE_CARDS` → `realWorldReference.incident` → `/images/incidents/{slug}.webp` (~118 unique incidents, all roles) |
| `OUTCOME_IMAGES` | **Legacy:** eight keys (`BUDGET_CRATER`, … `DATA_BREACH`) → `/images/outcomes/{kebab}.webp` |
| `ARCHETYPE_IMAGES` | Seven `ArchetypeId` entries |
| `DEATH_IMAGES` | Seven `DeathType` entries (incl. `KIRK`) |
| Helpers | `getIncidentImagePath` (fallback), `getOutcomeImagePath`, `getArchetypeImagePath`, `getDeathImagePath` |
| Barrel | `data/index.ts` re-exports map symbols and `IncidentSlug`, `OutcomeConsequenceType` |

## Contract vs implementation

**13-CONTRACT.md** (post–plan refresh) specifies **HOS pilot** outcomes as **`{incidentSlug}-left` / `{incidentSlug}-right`**, not the eight global consequence buckets. The module described here is the **Wave 0 / generator-aligned** shape; migrating the map and tests to the contract is **follow-up** (tie to **13-02** and Phase **14**).

## Verification

Wave 0 tests green in the worktree:

```sh
cd ../phase-13-images && bun run test:data
```
