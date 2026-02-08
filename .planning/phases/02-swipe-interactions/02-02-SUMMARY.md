---
phase: "02-swipe-interactions"
plan: "02"
title: "Card Stack & Enhanced Swipe Preview"
subsystem: "gameplay"
dependencies:
  requires:
    - "02-01: CSS Animation System with spring physics classes"
  provides:
    - "Card stack rendering with next card preview"
    - "Distance-scaled swipe preview overlays"
    - "Spring physics snap-back integration"
  affects:
    - "02-03: Human verification (visual feedback testing)"
tech-stack:
  added:
    - None (uses existing CSS classes)
  patterns:
    - "Z-index layering for card stacking"
    - "Dynamic CSS transforms based on gesture state"
    - "Linear interpolation for smooth scaling"
decisions:
  - id: "D01"
    type: "implementation"
    description: "Used conditional spring-snap-back class instead of inline style for easier override"
  - id: "D02"
    type: "visual"
    description: "Simplified next card content to header only for performance and clean look"
metrics:
  duration: "8 minutes"
  completed: "2026-02-08"
  tasks_completed: 3
  files_modified: 1
  lines_added: 75
  lines_removed: 25
---

# Phase 02 Plan 02: Card Stack & Enhanced Swipe Preview Summary

## Overview

Implemented the card stack structure showing the next card underneath the current card, and enhanced the swipe preview with distance-scaled gradients and text labels. This creates the "deck" feel showing progression and makes swipe decisions more intuitive with contextual labels that scale with swipe distance.

## One-Liner

Card stack with next card preview (scale 0.95, opacity 0.6) and swipe preview that scales from 0.5 to 1.0 with distance using spring physics snap-back.

## Implementation Details

### Card Stack Structure (Task 1)

Created a relative-positioned container that houses both the next card (behind) and current card (front):

```tsx
<div className="relative flex-1 w-full max-w-full lg:max-w-[43rem]">
  {/* Next card (behind) */}
  {state.currentCardIndex + 1 < cards.length && (
    <div style={{ zIndex: 0, transform: 'scale(0.95)', opacity: 0.6 }}>
      {/* Simplified header showing next card info */}
    </div>
  )}
  
  {/* Current card (front) */}
  <div style={{ zIndex: 10 }}>
    {/* Full card content */}
  </div>
</div>
```

**Key features:**
- Next card only renders when there IS a next card (bounds check)
- Position: absolute inset-0 ensures identical dimensions
- Scale 0.95 creates depth perception
- Opacity 0.6 dims next card to keep focus on current
- Simplified content: header only with "Next incident loading..." message

### Dynamic Preview Scaling (Task 2)

Updated swipe preview overlay to scale based on swipe distance:

**Gradient opacity:**
- Scales from 0.3 at 50px threshold to 0.8 at 100px max
- Formula: `Math.min(0.8, 0.3 + (abs(offset) - 50) / 50 * 0.5)`

**Text label scaling:**
- Scale transforms from 0.5 to 1.0 as swipe progresses
- Font size increases using `clamp(1.5rem, dynamic, 3.75rem)`
- Opacity increases from 0.5 to 1.0 simultaneously

```tsx
style={{
  opacity: Math.min(0.8, 0.3 + (Math.abs(swipeOffset) - 50) / 50 * 0.5),
  transform: `scale(${0.5 + Math.min(0.5, (Math.abs(swipeOffset) - 50) / 50 * 0.5)})`,
}}
```

### Spring Snap-Back Integration (Task 3)

Applied spring physics for the snap-back transition:

- **Condition:** Applied when `!isDragging && !cardExitDirection && swipeOffset !== 0`
- **CSS class:** `spring-snap-back` (defined in index.html during 02-01)
- **Curve:** `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Duration:** 550ms
- **Effect:** Soft bouncy overshoot for premium feel

**Transition state logic:**
- `isDragging === true`: No transition (direct manipulation)
- `cardExitDirection !== null`: No inline transition (uses CSS keyframe animation)
- Neither above + swipeOffset !== 0: Spring snap-back transition

## Files Modified

### App.tsx

**Lines 570-720:** Complete refactor of card container structure
- Added card stack wrapper div
- Implemented next card conditional rendering
- Updated current card with z-index and spring class
- Replaced static preview overlay with dynamic scaling version
- Integrated spring physics transition logic

## Verification

### Code Verification
- ✅ Next card renders with z-index 0, scale 0.95, opacity 0.6
- ✅ Current card has z-index 10
- ✅ Preview scales dynamically with swipeOffset
- ✅ Spring physics transition is applied for snap-back

### Behavior Verification
- ✅ Card stack is visible in DOM
- ✅ Next card shows behind current card
- ✅ Preview label scales as user swipes further
- ✅ TypeScript compiles without errors

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

1. **Conditional class application:** Used CSS class `spring-snap-back` instead of inline style for the spring transition. This allows easier debugging and potential override via CSS.

2. **Simplified next card:** Next card only shows header with source/context info plus placeholder text. This avoids rendering full card content that's not interactive, improving performance.

3. **Bounds checking:** Next card only renders when `currentCardIndex + 1 < cards.length`, preventing errors on the last card.

## Next Phase Readiness

This plan completes the core swipe interaction implementation:

- ✅ Spring physics defined (02-01)
- ✅ Card stack showing next card (02-02)
- ✅ Enhanced swipe preview (02-02)
- ✅ Exit animations (02-01)

**Ready for:**
- 02-03: Human verification with 6 checkpoints
- Phase 3: Polish & Performance

## Key Technical Links

| Source | Target | Link Mechanism |
|--------|--------|----------------|
| renderGame card container | Next card pre-render | z-index layering with scale/opacity |
| swipeOffset state | Gradient/label scale | Dynamic CSS transform calculations |
| index.html spring-snap-back | Card element | Conditional class application |
| SWIPE_PREVIEW_THRESHOLD | Preview visibility | State-driven conditional rendering |

## Commits

1. `4899b9b`: feat(02-02): implement card stack container structure with next card preview
2. `8ac145b`: feat(02-02): implement dynamic swipe preview scaling
3. `947a19e`: feat(02-02): integrate spring snap-back transition
