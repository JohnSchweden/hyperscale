# Roadmap: hyperscale UI/UX Improvements

**Created:** 2026-02-07
**Phases:** 3
**Requirements:** 13 v1 requirements

---

## Overview

This roadmap delivers a comprehensive UI/UX overhaul of the hyperscale game, focusing on:
1. **Layout consistency** across all 8 game stages
2. **Tinder-style swipe animations** with spring physics
3. **Visual polish** and performance optimization

---

## Phase 1: Layout Foundation

**Goal:** Establish consistent, responsive layout system that eliminates visual jumps

**Duration:** 1-2 days
**Requirements:** 5 (LAYOUT-01 through LAYOUT-05)

### Success Criteria

1. Navigate through all 8 stages on desktop — no visual jumps, content stays centered
2. Navigate through all 8 stages on mobile — no visual jumps, content starts from consistent top position
3. Resize browser window on desktop — centered content doesn't shift when scrollbar appears/disappears
4. Scroll on mobile browser — content stays stable when toolbars collapse/expand
5. Code review: LayoutShell component used consistently across all stages

### Plans

**Plans:** 5 plans in 5 waves

- [ ] 01-01-PLAN.md — Create LayoutShell component with responsive logic
- [ ] 01-02-PLAN.md — Update Intro, Personality Select, Role Select screens
- [ ] 01-03-PLAN.md — Update Initializing, Boss Fight, Game Over, Summary screens
- [ ] 01-04-PLAN.md — Refactor Game screen and add scrollbar/viewport fixes
- [ ] 01-05-PLAN.md — Human verification of all 8 stages

### Implementation Notes

**Order of operations:**
1. Create LayoutShell component with responsive logic (Plan 01)
2. Update first 3 non-gameplay screens (Plan 02)
3. Update remaining 4 non-gameplay screens (Plan 03)
4. Refactor Game screen + add scrollbar-gutter + replace 100vh (Plan 04)
5. Human verification across all breakpoints (Plan 05)

**Key files to modify:
- `App.tsx` - Refactor all render methods
- `index.html` - Add scrollbar-gutter CSS
- Create `components/LayoutShell.tsx`

**Testing checklist:**
- [ ] Desktop Chrome, Safari, Firefox
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)
- [ ] Resize from mobile → tablet → desktop breakpoints
- [ ] Navigate: Intro → Personality → Role → Initializing → Game → Boss → Game Over → Summary

---

## Phase 2: Swipe Interactions

**Goal:** Implement Tinder-style swipe animations with spring physics and card stack

**Duration:** 2-3 days
**Requirements:** 4 (SWIPE-01, SWIPE-03, SWIPE-04, SWIPE-05)  
*Note: SWIPE-02 (card lift) was removed per user decision*

### Success Criteria

1. Drag card partially — spring physics returns it smoothly when released
2. Drag past threshold — card exits with rotation animation
3. Next card visible underneath — creates "deck" feel
4. Gradient preview appears when swiping — scales with distance
5. 60fps performance on mid-range mobile device

### Plans

**Plans:** 3 plans in 2 waves

- [ ] 02-01-PLAN.md — CSS Animation System (spring physics + exit animations)
- [ ] 02-02-PLAN.md — Card Stack & Enhanced Preview (SWIPE-03 + SWIPE-04)
- [ ] 02-03-PLAN.md — Human verification of all swipe interactions

### Implementation Notes

**Order of operations:**
1. **Wave 1 (Parallel):**
   - Plan 01: Add spring physics CSS and refine exit animations in index.html
   - Plan 02: Implement card stack and enhanced preview in App.tsx
2. **Wave 2:**
   - Plan 03: Human verification across devices

**Wave Structure:**
```
Wave 1:
├── 02-01: CSS animations (independent)
└── 02-02: Card stack (independent of 02-01)

Wave 2:
└── 02-03: Human verification (depends on 02-01, 02-02)
```

**Key files to modify:**
- `App.tsx` - Game screen renderGame() method
- CSS animations in `index.html` style block

**Technical considerations:**
- Must maintain keyboard navigation (arrow keys)
- Touch and mouse events both supported
- Card stack requires pre-rendering next card
- Spring physics can be CSS-only (cubic-bezier) or JS-based

**Testing checklist:**
- [ ] Touch swipe on mobile
- [ ] Mouse drag on desktop
- [ ] Arrow key navigation still works
- [ ] Swipe threshold feels right (100px)
- [ ] Card stack visible behind current card
- [ ] Performance: no jank on mid-range phone

---

## Phase 3: Polish & Performance

**Goal:** Consistent transitions, design audit, and performance optimization

**Duration:** 1-2 days
**Requirements:** 3 (TRANS-01, DESIGN-01, PERF-01)

### Plans

**Plans:** 3 plans in 2 waves

- [ ] 03-01-PLAN.md — Standardize stage transition animations (TRANS-01)
- [ ] 03-02-PLAN.md — Design audit and visual system standardization (DESIGN-01)
- [ ] 03-03-PLAN.md — Performance optimization and Lighthouse audit (PERF-01)

### Wave Structure

```
Wave 1 (Parallel):
├── 03-01: Transition animations (independent)
└── 03-02: Design audit (independent of 03-01)

Wave 2:
└── 03-03: Performance optimization (depends on 03-01, 03-02)
```

### Success Criteria

1. All stage transitions feel consistent — same animation, duration, easing
2. Visual audit complete — typography, colors, spacing consistent across all screens
3. Touch gestures run at 60fps — no dropped frames on swipe
4. Lighthouse performance score ≥ 90

### Implementation Notes

**Order of operations:**
1. Standardize stage transition animations
2. Design audit: check all 8 screens for consistency
3. Add performance optimizations (will-change, etc.)
4. Run Lighthouse audit
5. Fix any performance issues

**Key files to modify:**
- `App.tsx` - Transition animations
- All screen render methods — design consistency
- CSS in `index.html` — performance optimizations

**Design audit checklist:**
- [ ] Font sizes consistent
- [ ] Colors consistent (slate palette, cyan accents)
- [ ] Button styles consistent
- [ ] Card styles consistent
- [ ] Spacing consistent (padding, margins, gaps)
- [ ] Border radius consistent
- [ ] Shadows consistent

**Performance checklist:**
- [ ] will-change on animated elements
- [ ] GPU acceleration enabled
- [ ] Passive event listeners
- [ ] No layout thrashing
- [ ] Images optimized (if any)

---

## Risk Factors & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Card stack affects performance | Medium | High | Pre-render next card, use CSS transforms only |
| Spring physics feels wrong | Low | Medium | Use CSS first, iterate on cubic-bezier values |
| Layout changes break mobile | Low | High | Test on real devices, not just emulators |
| Keyboard navigation breaks | Medium | Medium | Maintain existing arrow key handlers |
| Timeline extends | Medium | Low | Phase 3 can be trimmed if needed |

---

## Dependencies

**Phase 1 → Phase 2:**
- LayoutShell must be stable before adding card stack
- Responsive breakpoints defined in Phase 1 used in Phase 2

**Phase 2 → Phase 3:**
- Swipe animations complete before performance optimization
- Card positions finalized before design audit

**No external dependencies:**
- All work is self-contained in existing codebase
- No new libraries needed

---

## Post-Milestone Success Metrics

- [ ] All 13 requirements marked Complete
- [ ] Visual jumps eliminated (subjective evaluation)
- [ ] Swipe feels "premium" (subjective evaluation)
- [ ] Performance: 60fps on target devices
- [ ] Accessibility: Keyboard nav still works
- [ ] Cross-browser: Chrome, Safari, Firefox, Edge

---

## Future Considerations (v2+)

Not in this roadmap but worth noting:
- Sound effects and haptics
- Stats update animations
- Reduced motion support
- PWA enhancements
- Additional card types/mechanics

---

**Next Step:** Run `/gsd-discuss-phase 1` to start Phase 1 execution

*Last updated: 2026-02-07*
