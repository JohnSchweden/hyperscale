---
phase: 01-layout-foundation
plan: 04
subsystem: ui

tags: [react, tailwindcss, layout, refactoring, viewport, scrollbar-gutter]

# Dependency graph
requires:
  - phase: 01-layout-foundation
    provides: LayoutShell component (from Plan 01-01)
  - phase: 01-layout-foundation
    provides: 7 screens already using LayoutShell (from Plans 01-02, 01-03)
provides:
  - renderGame refactored to use LayoutShell (final screen)
  - All 8 game screens now use consistent LayoutShell component
  - scrollbar-gutter: stable CSS for desktop layout stability
  - All viewport units use 100dvh for mobile stability
affects:
  - 01-05 (final integration and verification)
  - 02-02 (Card Stack - swipe gestures now in unified layout)
  - 02-01 (CSS animations - unified layout base ready)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "LayoutShell wrapping pattern for complex app-like interfaces"
    - "Absolute positioned HUD within LayoutShell"
    - "Fixed taskbar with z-index layering"
    - "scrollbar-gutter: stable prevents desktop layout shifts"
    - "100dvh viewport units for mobile stability"

key-files:
  created: []
  modified:
    - App.tsx - renderGame refactored to use LayoutShell
    - index.html - scrollbar-gutter CSS added

key-decisions:
  - "Preserved Game screen's app-like layout: absolute HUD, fixed taskbar"
  - "Adjusted main content padding to accommodate absolute/fixed elements"
  - "Added z-10 to HUD and z-20 to taskbar for proper stacking context"
  - "scrollbar-gutter: stable only on desktop (≥1024px)"

patterns-established:
  - "Complex screen layout: LayoutShell + absolute elements + z-index layering"
  - "Desktop scrollbar gutter prevents layout shift jumps"
  - "100dvh for mobile viewport stability (handles browser chrome)"

# Metrics
duration: 2min
completed: 2026-02-07
---

# Phase 01 Plan 04: Final Layout Unification

**Game screen refactored to LayoutShell, scrollbar-gutter CSS added for desktop, all viewport units use 100dvh**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-07T22:12:17Z
- **Completed:** 2026-02-07T22:14:21Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments

- renderGame (the complex gameplay screen) now uses LayoutShell with preserved app-like layout
- Absolute positioned HUD at top with z-10 stacking context
- Fixed taskbar at bottom with z-20 stacking context
- Main content area adjusted padding (pt-20 md:pt-24, pb-16 md:pb-20) for HUD/taskbar clearance
- scrollbar-gutter: stable CSS added for desktop (≥1024px) preventing layout shifts
- All 8 game screens now use consistent LayoutShell component
- No min-h-screen remains - all viewport units use 100dvh for mobile stability

## Task Commits

Each task was committed atomically:

1. **Task 1: Add scrollbar-gutter CSS to index.html** - `5ed4231` (feat)
2. **Task 2: Refactor renderGame to use LayoutShell** - `7d5c682` (refactor)
3. **Task 3: Verify no min-h-screen remains** - (verified, no changes needed)

**Plan metadata:** (to be added with final commit)

## Files Created/Modified

- `App.tsx` - Refactored renderGame to use LayoutShell with preserved swipe functionality
- `index.html` - Added scrollbar-gutter: stable CSS for desktop layout stability

## Decisions Made

- Preserved Game screen's unique app-like layout within LayoutShell:
  - Absolute positioned HUD (budget, risk, hype bars) at top
  - Fixed taskbar at bottom (Windows-style)
  - Main content area with swipeable card
- Added z-index layering (z-10 HUD, z-20 taskbar) for proper stacking
- Adjusted padding to accommodate absolute/fixed elements
- scrollbar-gutter: stable only applies to desktop (≥1024px) - mobile browsers handle scrollbars differently

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 8 screens now use LayoutShell consistently (100% complete)
- Layout foundation phase is complete
- Ready for Plan 01-05: Final integration and verification
- Swipe gesture functionality preserved in unified layout
- Desktop scrollbar gutter prevents layout shifts
- Mobile viewport uses 100dvh for stability

---
*Phase: 01-layout-foundation*
*Completed: 2026-02-07*
