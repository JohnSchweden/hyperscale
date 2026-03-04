---
phase: 02-swipe-interactions
plan: 01
date: 2026-02-08
duration: ~5 minutes
subsystem: CSS Animation System
tags: [css, animations, spring-physics, swipe, performance]
dependencies:
  requires: []
  provides: [".spring-snap-back class", "exit keyframe animations"]
  affects: [02-02]
tech-stack:
  added: []
  patterns:
    - CSS cubic-bezier spring physics
    - will-change for GPU optimization
key-files:
  created: []
  modified:
    - index.html
decisions: []
---

# Phase 02 Plan 01: CSS Animation System Summary

## One-Liner
Implemented spring physics snap-back animations and refined exit animations with precise cubic-bezier curves and GPU performance optimizations.

## What Was Built

### Spring Physics System
- **`.spring-snap-back`** class with soft bouncy feel
  - Duration: 550ms (0.55s) for premium feel
  - Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` creates overshoot/bounce
  - Transition property: transform only (optimized)
  - Will-change hint for GPU acceleration

### Exit Animation Refinements
- **Updated timing**: 0.3s → 0.35s for smoother exit feel
- **Updated transforms**:
  - Left exit: translateX(-120%) rotate(-25deg)
  - Right exit: translateX(120%) rotate(25deg)
- **Fade effect**: Opacity transitions from 1 to 0 during exit
- **Performance**: Added `will-change: transform, opacity` to both exit classes

## Implementation Details

### CSS Classes Added
```css
.spring-snap-back {
    transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
    will-change: transform;
}
```

### Exit Animation Updates
```css
.swipe-exit-left {
    animation: swipeExitLeft 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    will-change: transform, opacity;
}

@keyframes swipeExitLeft {
    from {
        transform: translateX(0) rotate(0deg);
        opacity: 1;
    }
    to {
        transform: translateX(-120%) rotate(-25deg);
        opacity: 0;
    }
}
```

## Key Decisions

### Spring Physics Curve
Selected `cubic-bezier(0.34, 1.56, 0.64, 1)` for spring effect:
- Y1 > 1 (1.56) creates overshoot
- Y2 < 1 (0.64) creates settle-back
- Delivers "premium app" feel without jarring motion

### Exit Animation Values
- 120% translateX: Cards fly off screen but not excessively far
- 25deg rotation: More dramatic arc than previous 20deg
- 0.35s duration: Slightly longer for satisfying "throw" feel

### Performance Optimization
- `will-change: transform, opacity` hints browser to prepare GPU layers
- Applied only to classes that trigger animations (not base elements)
- Prevents layout thrashing during swipe gestures

## Files Modified

| File | Changes | Lines |
|------|---------|-------|
| index.html | Added spring class, updated exit animations | +12/-4 |

## How to Use

### Spring Snap-Back
Apply `.spring-snap-back` to swipeable card element. When drag ends under threshold:
```javascript
element.classList.add('spring-snap-back');
element.style.transform = 'translateX(0) rotate(0)';
// Transition handles the bouncy return
```

### Exit Animation
Apply exit class when swipe passes threshold:
```javascript
// Swiped left (reject)
element.classList.add('swipe-exit-left');

// Swiped right (accept)
element.classList.add('swipe-exit-right');
```

## Verification

✅ `.spring-snap-back` exists with correct cubic-bezier
✅ Exit animations use 0.35s duration
✅ Exit keyframes use ±120% translateX and ±25deg rotate
✅ Exit animations fade to opacity 0
✅ will-change hints added for performance

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

This animation system enables:
- **Plan 02-02**: Card stack & preview (will use spring class for snap-back)
- **Plan 02-03**: Human verification of swipe feel

## Success Criteria

| Criteria | Status | Notes |
|----------|--------|-------|
| Spring physics class exists | ✅ | `.spring-snap-back` implemented |
| Cubic-bezier correct | ✅ | (0.34, 1.56, 0.64, 1) |
| Duration 550ms | ✅ | 0.55s transition |
| Exit animations updated | ✅ | Both left and right |
| Performance optimized | ✅ | will-change hints added |
| Truth: smooth spring | ✅ | Soft bouncy curve |
| Truth: cards thrown off screen | ✅ | 120% translateX |

---

**Commit:** 4ba4ac7
**Plan file:** .planning/phases/02-swipe-interactions/02-01-PLAN.md
