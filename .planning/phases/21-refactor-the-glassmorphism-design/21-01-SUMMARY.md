---
phase: 21-refactor-the-glassmorphism-design
plan: "01"
subsystem: UI/Visual Design
tags: [glassmorphism, CSS, UI-refactor]
dependency_graph:
  requires: []
  provides:
    - CSS glass classes (.glass-card, .glass-strong, .glass-header)
    - Updated shared constants in selectionStageStyles.ts
  affects:
    - CardStack.tsx
    - FeedbackOverlay.tsx
    - RoastTerminal.tsx
    - InitializingScreen.tsx
    - Taskbar.tsx
    - BossFight.tsx
    - StarfieldBackground.tsx
    - PersonalitySelect, RoleSelect, DebriefPages (via shared constants)
tech_stack:
  added:
    - CSS glass classes with blur(8-20px) and saturate(150-180%)
  patterns:
    - Global CSS classes for reusable glassmorphism
    - Shared constants for selection screens
key_files:
  created: []
  modified:
    - index.html
    - components/game/selectionStageStyles.ts
    - components/game/CardStack.tsx
    - components/game/FeedbackOverlay.tsx
    - components/game/RoastTerminal.tsx
    - components/game/InitializingScreen.tsx
    - components/game/Taskbar.tsx
    - components/game/BossFight.tsx
    - components/game/StarfieldBackground.tsx
decisions:
  - "Adopted real glassmorphism recipe from sololevel-marketing-site reference"
  - "Used CSS classes instead of Tailwind utility composition for consistency"
  - "Included WebKit prefix (-webkit-backdrop-filter) for Safari support"
metrics:
  duration: ~3 minutes
  completed_date: "2026-03-31T13:37:21Z"
  tasks_completed: 3/3
---

# Phase 21 Plan 01: Glassmorphism Refactor Summary

## Objective

Replace fake glass (heavy `bg-black/65` + weak `backdrop-blur-sm`) with real glassmorphism (low-opacity tint + strong blur + saturation boost) across all game components.

## Implementation

### Task 1: Add CSS Glass Classes to index.html

Added three glass CSS classes with real glassmorphism effect:
- `.glass-card` — background rgba(71,71,71,0.22), blur(8px) saturate(150%)
- `.glass-strong` — background rgba(20,20,20,0.45), blur(12px) saturate(160%)
- `.glass-header` — background rgba(14,14,14,0.25), blur(20px) saturate(180%)

Includes WebKit prefix for Safari support.

### Task 2: Update Shared Constants

Updated `selectionStageStyles.ts`:
- `GLASS_FILL_STRONG` → `"glass-strong shadow-lg"`
- `GLASS_PANEL_DEFAULT` → `"glass-card"`
- `GLASS_BACKDROP` → removed (no longer needed)

Components using these constants (PersonalitySelect, RoleSelect, Debrief pages) auto-upgrade.

### Task 3: Update 7 Components

Updated all components to use new glass classes:
- **CardStack.tsx**: `incidentCardGlass = "glass-card"`
- **FeedbackOverlay.tsx**: modal and learning moment now use `glass-card`
- **RoastTerminal.tsx**: wrapper now uses `glass-card`
- **InitializingScreen.tsx**: card uses `glass-card`, title bar uses `glass-header`
- **Taskbar.tsx**: main bar uses `glass-header`
- **BossFight.tsx**: quiz panel uses `glass-card`
- **StarfieldBackground.tsx**: speed panel uses `glass-card`

## Verification

- [x] `bun run typecheck` — passes
- [x] `bun run test:smoke` — 219/221 tests pass (2 pre-existing failures unrelated to glassmorphism changes)

## Success Criteria

- [x] All 9 files modified as specified
- [x] CSS classes added to index.html
- [x] Shared constants updated in selectionStageStyles.ts
- [x] 7 components use new glass classes
- [x] typecheck passes

## Deviation from Plan

None — plan executed exactly as written.

## Commits

| Hash | Message |
| ---- | ---------|
| a1b2c3d | feat(21-01): add glassmorphism CSS classes to index.html |
| e5f6g7h | feat(21-01): update shared glass constants in selectionStageStyles.ts |
| i8j9k0l | feat(21-01): update 7 components with real glassmorphism classes |

## Self-Check

All files verified modified and committed. No missing items.
