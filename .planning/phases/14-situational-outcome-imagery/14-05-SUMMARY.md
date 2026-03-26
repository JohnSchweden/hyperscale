---
phase: 14-situational-outcome-imagery
plan: 05
subsystem: situational-outcome-imagery
type: gap-closure
tags: [image-rendering, CSS-consolidation, KIRK-support]
status: complete
completed_date: 2026-03-26T23:15:00Z
duration_minutes: 15
tasks_completed: 2
files_created: 0
files_modified: 3
commits:
  - hash: 253cd26
    message: "feat(14-05): render KIRK collapse image and wire ImageWithFallback to global CSS class"
dependencies:
  requires: [14-04]
  provides: [IMAGE-03, IMAGE-05]
  affects: [debrief-page-layout, image-component]
tech_stack:
  patterns: [CSS-class-consolidation, conditional-rendering]
  added: []
key_files:
  created: []
  modified:
    - components/ImageWithFallback.tsx
    - components/game/debrief/DebriefPage1Collapse.tsx
    - tests/image-fallback.spec.ts
decisions:
  - "Move glitch animation from inline style to global CSS class for consistency with index.html"
  - "Render KIRK collapse image separately from regular death endings (not via DeathEndingCard)"
metrics:
  tasks: 2
  lines_added: 26
  lines_removed: 19
  test_coverage: updated image-fallback tests to validate CSS class approach
---

# Phase 14 Plan 05: Close Image Rendering Gaps — Summary

Close two post-verification gaps in Phase 14: (1) the KIRK collapse image is never rendered because KIRK is excluded from the `hasRegularDeath` guard, and (2) the global `.glitch-placeholder` CSS class in `index.html` is dead code because `ImageWithFallback` duplicates the animation via an inline `<style>` tag instead of using the class.

## Objective

- Render the KIRK collapse image on the debrief page (IMAGE-03 requirement)
- Wire `ImageWithFallback` to use the global `.glitch-placeholder` CSS class, removing inline style duplication (IMAGE-05 requirement)
- Satisfy project image rendering requirements with centralized CSS

## What Was Built

### Task 1: Render KIRK Collapse Image
Added a KIRK-specific image block in `DebriefPage1Collapse` that conditionally renders when `deathType === DeathType.KIRK`. This complements the special KIRK header (glitch text) and is rendered before the regular death ending card block. The image displays via `ImageWithFallback` with the correct path from `getDeathImagePath(DeathType.KIRK)`.

**Files modified:**
- `components/game/debrief/DebriefPage1Collapse.tsx` — Added lines 286-294 (KIRK image block)

### Task 2: Wire ImageWithFallback to Global CSS Class
Removed the inline `<style>` block containing `@keyframes glitch-scan` from `ImageWithFallback` and updated the placeholder div to use the `glitch-placeholder` CSS class. The animation property in the inline style object was also removed. The global `.glitch-placeholder` rule in `index.html` (lines 613-667) now serves as the single source of truth for glitch animation.

**Files modified:**
- `components/ImageWithFallback.tsx` — Removed inline `@keyframes` (13 lines), added `glitch-placeholder` to className, removed `animation` property from style
- `tests/image-fallback.spec.ts` — Updated tests b) and d) to check for CSS class instead of inline animation property

## Verification

All checks from the plan verified successfully:

✓ `bun run typecheck` passes with no errors
✓ `glitch-placeholder` CSS class applied in ImageWithFallback line 93
✓ No `@keyframes` in ImageWithFallback (0 matches)
✓ `getDeathImagePath(DeathType.KIRK)` rendered at line 289 of DebriefPage1Collapse
✓ KIRK image block only renders when `isKirk` is true (conditional wrapper)

## Deviations from Plan

None — plan executed exactly as written.

- **Test Updates:** Updated `tests/image-fallback.spec.ts` tests b) and d) to validate the new CSS class approach instead of inline animation. This is aligned with the change in architecture (moving animation to global CSS) and ensures tests verify the correct behavior.

## Requirements Satisfied

- **IMAGE-03:** All 7 death types (including KIRK) now show a collapse image
- **IMAGE-05:** Placeholder uses global `.glitch-placeholder` CSS class; inline `<style>` removed

## Self-Check: PASSED

All claims verified:
- ✓ `components/ImageWithFallback.tsx` contains `glitch-placeholder` in className at line 93
- ✓ `components/ImageWithFallback.tsx` has 0 matches for `@keyframes` (inline style removed)
- ✓ `components/game/debrief/DebriefPage1Collapse.tsx` calls `getDeathImagePath(DeathType.KIRK)` at line 289
- ✓ Commit 253cd26 exists and contains all three modified files
- ✓ `bun run typecheck` passes
