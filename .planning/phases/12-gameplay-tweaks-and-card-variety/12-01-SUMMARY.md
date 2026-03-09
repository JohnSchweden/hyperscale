---
phase: 12-gameplay-tweaks-and-card-variety
plan: 01
subsystem: card-rendering-foundations
tags: [shared-types, ui-rendering, refactor, maintainability]
dependency_graph:
  requires: []
  provides:
    - Expanded AppSource enum (JIRA, NOTION, MEETING)
    - SOURCE_ICONS mapping for all app surfaces
    - Explicit card header rendering logic
  affects:
    - All downstream Phase 12 card-content plans
    - Future card deck additions
tech_stack:
  added: [Font Awesome 6 icon classes, Record type mapping]
  patterns: [enum-to-icon-mapping, fallback-safe lookups]
key_files:
  created:
    - data/sources.ts
  modified:
    - types.ts
    - components/game/CardStack.tsx
decisions:
  - Used Record<AppSource, string> for type-safe icon mapping instead of switch statement
  - Applied SOURCE_ICONS lookup with nullish coalescing fallback (fa-hashtag) for defensive rendering
  - Kept existing visual structure unchanged while replacing ternary logic
metrics:
  duration: "~15 minutes"
  completed_date: "2026-03-09"
  tasks_completed: 3
  files_created: 1
  files_modified: 2
  commits: 3
---

# Phase 12 Plan 01: Expand Shared Card Source Model

**One-liner:** Established type-safe source enum expansion and explicit header icon rendering to unblock Phase 12 card variety without fallback hacks.

## Objective Summary

Extended the shared card source model (`AppSource` enum) to support new scenario surfaces introduced in Phase 12 (JIRA, NOTION, MEETING), and refactored the card header rendering in `CardStack.tsx` to use an explicit `SOURCE_ICONS` mapping instead of hardcoded ternary logic. This provides a maintainable, type-safe foundation for all downstream card-content plans.

## Execution Summary

### Task 1: Expand the shared card source enum

**Status:** Complete

Added JIRA, NOTION, and MEETING enum values to the `AppSource` enum in `types.ts`. All values follow the existing all-caps naming convention for direct use in card metadata.

- **Verification:** `bun run build` passes with no type errors
- **Commit:** 1593ed3

### Task 2: Add SOURCE_ICONS and replace source header fallback logic

**Status:** Complete

Created `data/sources.ts` containing a `SOURCE_ICONS: Record<AppSource, string>` that maps each enum value to its Font Awesome solid icon class:
- SLACK → fa-hashtag
- EMAIL → fa-envelope
- TERMINAL → fa-terminal
- IDE → fa-terminal
- JIRA → fa-list-check
- NOTION → fa-file-lines
- MEETING → fa-users

Refactored `CardStack.tsx` to:
- Import SOURCE_ICONS
- Replace IDE-vs-else ternary with `SOURCE_ICONS[source] ?? "fa-hashtag"` for both current and next card headers
- Preserve existing visual structure completely

- **Verification:** `bun run build` passes with no type errors
- **Commit:** 8d40b37

### Task 3: Prove the shared foundation supports old and new deck content

**Status:** Complete

Ran full build and card-focused Playwright test suite. Results:
- `bun run build` passes with no errors (chunk size warnings are pre-existing)
- Card rendering snapshot tests pass:
  - ✓ playing
  - ✓ playing-roast-after
  - ✓ playing-roast-before-and-after
- Swipe interaction CSS tests pass (spring physics, exit animation, will-change property)

The shared foundation now supports both existing sources (SLACK, EMAIL, TERMINAL, IDE) and new Phase 12 sources (JIRA, NOTION, MEETING) with explicit, maintainable icon logic.

- **Commit:** fd53168

## Deviations from Plan

None — plan executed exactly as written.

## Quality Checklist

- [x] `AppSource` enum expanded with JIRA, NOTION, MEETING
- [x] SOURCE_ICONS Record provides type-safe icon mapping
- [x] CardStack.tsx header rendering uses explicit icon lookup
- [x] Build passes with no type errors
- [x] Card rendering tests pass (all app surfaces render correctly)
- [x] No regressions from source-model change

## Downstream Impact

This plan completes the shared foundation that Phase 12 card-content plans depend on:
- Task 12-02 and later can now add cards with JIRA, NOTION, MEETING sources without touching types or shared rendering logic
- Icon display is maintainable and type-safe
- Visual consistency is guaranteed via the SOURCE_ICONS mapping
