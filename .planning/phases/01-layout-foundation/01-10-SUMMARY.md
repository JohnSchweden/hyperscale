---
phase: 01-layout-foundation
plan: 10
subsystem: ui
tags: [css, positioning, react, mobile, layout]

# Dependency graph
requires:
  - phase: 01-layout-foundation
    provides: LayoutShell component and responsive foundation from plans 01-01 to 01-07
provides:
  - Fixed HUD positioning context via relative container
  - Fixed answer overlay centering by escaping transformed container
  - CSS containing block fix for mobile viewport positioning
affects:
  - Phase 2 (Swipe Interactions) - overlay positioning must work with swipe gestures
  - Phase 3 (Polish & Performance) - stable foundation for animations

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "position: relative container establishes positioning context for absolute children"
    - "React Fragment for multi-element returns without DOM wrapper"
    - "Escape transformed containers to preserve viewport-relative fixed positioning"

key-files:
  created: []
  modified:
    - components/LayoutShell.tsx - Added relative positioning class
    - App.tsx - Moved feedback overlay outside stage-transition container

key-decisions:
  - "Add 'relative' class to LayoutShell to create positioning context for HUD"
  - "Move overlay as sibling to stage-transition div to escape transform containing block"
  - "Use React Fragment instead of div wrapper to avoid extra DOM nodes"

patterns-established:
  - "relative container + absolute children: positioning context established for proper offset calculations"
  - "Fragment wrapper: allows multiple top-level elements without affecting layout"
  - "Escape transform context: move fixed/absolute elements outside transformed ancestors"

# Metrics
duration: 5 min
completed: 2026-02-07
---

# Phase 01 Plan 10: Positioning Context Fix Summary

**Fixed answer overlay centering on mobile and HUD cutoff by establishing proper CSS positioning contexts using relative containers and React Fragments**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-07T23:24:12Z
- **Completed:** 2026-02-07T23:24:55Z
- **Tasks:** 4
- **Files modified:** 2

## Accomplishments

- Fixed HUD cutoff by adding `relative` class to LayoutShell container
- Fixed answer overlay centering by moving it outside transformed stage-transition container
- Used React Fragment to return multiple elements without extra DOM wrapper
- Overlay now properly positions relative to viewport (not affected by CSS transforms)
- HUD now properly positions relative to LayoutShell container (respecting pt-16 padding)

## Task Commits

1. **Task 1: Add relative positioning to LayoutShell** - `e131aae` (fix)
2. **Task 2: Verify HUD positioning with new context** - `e131aae` (docs - part of same commit)
3. **Task 3: Move feedback overlay outside transformed container** - `a19230e` (fix)
4. **Task 4: Verify React Fragment wrapper** - `a19230e` (docs - part of same commit)

## Files Created/Modified

- `components/LayoutShell.tsx` - Added `relative` class to establish positioning context
- `App.tsx` - Moved feedback overlay from renderGame() to main return as sibling to stage-transition div

## Decisions Made

**1. Use 'relative' positioning rather than other approaches**

- Alternative considered: Change HUD to use sticky positioning
- Decision: `relative` on container is cleaner and maintains existing HUD styles
- Rationale: Minimal change, doesn't affect other elements, works with existing pt-16 padding

**2. Move overlay to root level rather than using CSS Portal**

- Alternative considered: Use createPortal() to render overlay to document.body
- Decision: Move to root return with Fragment wrapper
- Rationale: Simpler, no extra imports needed, same visual result

**3. Use React Fragment (<>...</>) instead of wrapper div**

- Alternative considered: Wrap in additional div
- Decision: Use Fragment to avoid extra DOM node
- Rationale: Cleaner DOM structure, no styling conflicts from wrapper

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed without issues. Build passes successfully.

## User Setup Required

None - no external service configuration required.

## Technical Details

### CSS Containing Block Fix

The root cause of the positioning issues was CSS containing blocks:

1. **Overlay centering issue:** `position: fixed` positions relative to viewport UNLESS an ancestor has `transform`, `perspective`, or `filter`. The `stage-transition` animation applied `transform: translateY()` to the root container, creating a containing block that broke viewport-relative positioning.

2. **HUD cutoff issue:** `position: absolute` positions relative to nearest positioned ancestor (has `position: relative/absolute/fixed/sticky`). LayoutShell had no positioned ancestor, so HUD positioned to viewport and ignored the container's `pt-16` padding.

### Solution Applied

1. **For HUD:** Added `relative` class to LayoutShell's root div. This creates a positioning context without affecting layout. Now HUD's `absolute top-2` positions 8px from the container's content edge (after the pt-16 padding and safe area insets).

2. **For Overlay:** Moved the overlay JSX from inside renderGame() (which is inside stage-transition container) to the main App return as a sibling to the stage-transition div. The overlay now renders outside the transformed container, so `position: fixed` properly positions relative to the viewport.

### Code Structure Change

Before:
```tsx
return (
  <div className="stage-transition">  {/* ← transform creates containing block */}
    {renderStage()}  {/* ← overlay was inside here */}
  </div>
);
```

After:
```tsx
return (
  <>  {/* ← Fragment, no DOM node */}
    <div className="stage-transition">
      {renderStage()}  {/* ← overlay removed from here */}
    </div>
    {state.stage === GameStage.PLAYING && feedbackOverlay && (
      <div className="fixed...">  {/* ← overlay now sibling, outside transform */}
        ...
      </div>
    )}
  </>
);
```

## Verification

### Automated Checks
- ✅ TypeScript compilation passes
- ✅ Build completes without errors
- ✅ GameStage import verified (line 2)

### Manual Verification Required

**HUD Verification:**
1. Open app on mobile (or mobile emulator)
2. Navigate to Game screen
3. Verify Budget/Risk/Hype bars are fully visible below status bar
4. Verify proper spacing from top edge (pt-16 + safe-area-top)

**Answer Overlay Verification:**
1. On Game screen, make a choice (swipe or click button)
2. Verify feedback window is centered horizontally and vertically
3. Verify overlay is not offset or misaligned on mobile
4. Test on different mobile sizes: iPhone SE, iPhone 14, Android

## Next Phase Readiness

- ✅ Layout foundation is now stable for Phase 2 (Swipe Interactions)
- ✅ Overlay positioning will work correctly during swipe gestures
- ✅ HUD positioning is consistent and won't be affected by animations
- ⚠️ Monitor for any edge cases with different viewport sizes

---
*Phase: 01-layout-foundation*
*Completed: 2026-02-07*
