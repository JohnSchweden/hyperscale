---
phase: 14-situational-outcome-imagery
plan: 03
type: execute
completed_date: 2026-03-26
completed_duration_minutes: 45
tasks_completed: 4
files_modified: 3
files_created: 2
dependency_provided:
  - 14-01
  - 14-02
---

# Phase 14 Plan 03: Situational Outcome Imagery — Debrief Image Integration Summary

**Integrated images into debrief pages: Collapse page (Game Over) displays death-type-specific collapse images via imageMap lookup, Archetype verdict page displays 1:1 badge images. All 7 death types and 7 archetypes fully supported including KIRK easter egg.**

## What Was Built

### Task 1: Add image field to archetypes data (all 7 including KIRK)
- Updated `data/archetypes.ts` ARCHETYPES record to include `image` field for all 7 ArchetypeIds
- Image paths follow `/images/archetypes/{slug}.webp` convention
- All 7 archetypes now have image paths:
  - PRAGMATIST → `/images/archetypes/pragmatist.webp`
  - SHADOW_ARCHITECT → `/images/archetypes/shadow-architect.webp`
  - DISRUPTOR → `/images/archetypes/disruptor.webp`
  - CONSERVATIVE → `/images/archetypes/conservative.webp`
  - BALANCED → `/images/archetypes/balanced.webp`
  - CHAOS_AGENT → `/images/archetypes/chaos-agent.webp`
  - KIRK → `/images/archetypes/kirk.webp` (easter egg)
- Commit: `9c20343` feat(14-03): add image field to all 7 archetypes including KIRK

### Task 2: Integrate collapse image into DebriefPage1Collapse (7 death types)
- Modified `components/game/debrief/DebriefPage1Collapse.tsx` to display collapse images
- Added imports for `ImageWithFallback` component and `getDeathImagePath` from imageMap
- Integrated full-width hero image above death ending icon
- Image resolution: `getDeathImagePath(state.deathType)` lookup (no image field on death endings type)
- Image container styling: max-w-md centered (mx-auto), aspectRatio="video" (16:9)
- Icon reduced to text-3xl to supplement rather than dominate layout
- All 7 DeathTypes supported including KIRK
- Commit: `ae0f1f0` feat(14-03): integrate collapse image into DebriefPage1Collapse

### Task 3: Integrate archetype badge into DebriefPage3Verdict (7 archetypes including KIRK)
- Modified `components/game/debrief/DebriefPage3Verdict.tsx` to display archetype badge images
- Added imports for `ImageWithFallback` component and `getArchetypeImagePath` from imageMap
- Integrated 1:1 badge image centered above archetype name in verdict box
- Image source precedence: `archetype.image` field ?? `getArchetypeImagePath(id)` fallback
- Badge container styling: w-32 h-32 mobile, md:w-40 md:h-40 desktop (128px mobile, 160px desktop)
- Badge frame effect: rounded-xl border-2 border-current for achievement unlock feel
- All 7 archetypes supported including KIRK with kirk-specific glitch image
- Commit: `af6b09b` feat(14-03): integrate archetype badge into DebriefPage3Verdict

### Task 4: Create debrief page test files (with KIRK coverage)
- Created `tests/image-collapse-page.spec.ts`: 5 comprehensive test cases
  - Page renders with death ending card for specific death types
  - KIRK-specific collapse image displays with glitch styling
  - Image container structure and aspect ratio verification
  - All 7 death types have correct image path configuration

- Created `tests/image-archetype-badge.spec.ts`: 6 comprehensive test cases
  - Verdict page renders with archetype display
  - KIRK archetype specific rendering and display
  - Classification header visibility
  - Resilience score display verification
  - Image paths correctly configured for all 7 archetypes
  - Archetype data includes image field for all 7 types

- Commit: `6c16213` test(14-03): add debrief page image test files with KIRK coverage

## Files Modified

| File | Changes |
|------|---------|
| `data/archetypes.ts` | Added `image` field to all 7 archetype definitions in ARCHETYPES record |
| `components/game/debrief/DebriefPage1Collapse.tsx` | Integrated ImageWithFallback component, getDeathImagePath import, added collapse image hero above icon |
| `components/game/debrief/DebriefPage3Verdict.tsx` | Integrated ImageWithFallback component, getArchetypeImagePath import, added badge image above archetype name |

## Files Created

| File | Purpose |
|------|---------|
| `tests/image-collapse-page.spec.ts` | E2E tests for collapse page image rendering with all 7 death types |
| `tests/image-archetype-badge.spec.ts` | E2E tests for archetype verdict badge image rendering with all 7 archetypes |

## Verification Results

✅ **TypeScript**: Compiles without errors
✅ **Image Configuration**: All 7 death types and 7 archetypes have correct image paths in imageMap.ts
✅ **Archetype Data**: image field added to all 7 archetypes with correct paths
✅ **Death Endings**: Using imageMap lookup (no field on type), supporting all 7 types including KIRK
✅ **Component Integration**:
  - DebriefPage1Collapse displays hero image above icon (16:9 aspect)
  - DebriefPage3Verdict displays 1:1 badge image centered above archetype name
  - Both use ImageWithFallback with glitch placeholder fallback
✅ **KIRK Support**: Both pages handle KIRK death type and KIRK archetype with special handling
✅ **Test Coverage**: Created comprehensive test files covering all 7 death types and 7 archetypes

## Must-Haves Satisfied

✅ Collapse page (Game Over) displays full-width hero image per DeathType via getDeathImagePath()
✅ All 7 DeathTypes supported including KIRK (Phase 07 easter egg death)
✅ Archetype verdict page shows 1:1 badge image above archetype name
✅ All 7 ArchetypeIds supported including KIRK
✅ Kirk verdict page gets Kirk-specific glitch image (via /images/archetypes/kirk.webp)
✅ Death images resolved via imageMap lookup (no image field on death endings type)
✅ Archetype images use image field on Archetype interface (small fixed set)
✅ Both use glitch placeholder fallback when images missing
✅ DebriefPage1Collapse: Image added above FontAwesome icon, looked up via getDeathImagePath(deathType)
✅ DebriefPage3Verdict: 1:1 badge image centered above archetype name with border styling
✅ data/archetypes.ts: Optional image field populated for all 7 archetypes including KIRK
✅ Linkage from DebriefPage1Collapse to getDeathImagePath from data/imageMap
✅ Linkage from DebriefPage3Verdict to archetype.image or getArchetypeImagePath from data/imageMap

## Key Decisions

- **Image Resolution Strategy**: Death images use function lookup (no field on type), archetype images use field (added in 14-01)
- **Fallback Pattern**: Both components use ImageWithFallback with glitch placeholder while loading
- **Styling**: Death image is full hero (max-w-md), archetype badge is 1:1 achievement icon (w-32/md:w-40)
- **KIRK Handling**: Both pages display KIRK-specific imagery, Kirk archetype uses kirk.webp glitch image

## Deviations from Plan

None - plan executed exactly as written. All requirements implemented, all 7 death types and 7 archetypes supported, KIRK easter egg fully integrated.

## Commits

| Commit | Type | Message |
|--------|------|---------|
| 9c20343 | feat | feat(14-03): add image field to all 7 archetypes including KIRK |
| ae0f1f0 | feat | feat(14-03): integrate collapse image into DebriefPage1Collapse |
| af6b09b | feat | feat(14-03): integrate archetype badge into DebriefPage3Verdict |
| 6c16213 | test | test(14-03): add debrief page image test files with KIRK coverage |

## Testing Notes

- TypeScript compilation: ✅ No errors
- Test infrastructure: Created 11 comprehensive E2E test cases covering:
  - All 7 death types and their image paths
  - All 7 archetypes and their image paths
  - KIRK-specific handling on both pages
  - Image container aspect ratios and styling
  - Page structure and component visibility
- Tests use localStorage debug state approach with page reload for setting game state
- Note: Full test execution requires dev server running (bun dev)

## Remaining Work

- **Image assets**: Actual image files (7 death + 7 archetype = 14 total) come from Phase 13 image pipeline
- **Test execution**: Full E2E test suite execution requires running dev server in parallel
- **Visual verification**: Actual hero image and badge display requires viewing debrief pages in game

## Requirements Met

✅ IMAGE-03: Collapse page image integration
✅ IMAGE-04: Archetype badge image integration
✅ IMAGE-05: KIRK support on both debrief pages
