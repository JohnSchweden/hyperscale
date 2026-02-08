# Phase 03: Polish & Performance - Research

**Researched:** 2026-02-08
**Domain:** React/Tailwind CSS Game UI - Code State Alignment
**Confidence:** HIGH

## Summary

This research analyzes the current codebase state against the existing Phase 3 plans to identify gaps and misalignments. The goal is to align the plans with the actual code that exists after Phases 1 and 2 implementation.

**Key finding:** The code has progressed beyond what the plans anticipated. Several items the plans intend to "add" already exist, while other expected items are missing. Plans need adjustment to reflect actual code state.

**Primary recommendation:** Update plans to acknowledge existing implementation, adjust tasks to cover remaining gaps, and avoid redundant work.

## Current Code State vs Plan Expectations

### What Already Exists (Don't Re-implement)

| Plan Expectation | Current Reality | Status |
|-----------------|-----------------|--------|
| `stage-transition` class with animation | EXISTS in index.html line 122-135 | ✅ Already implemented |
| `will-change` on swipe animations | EXISTS on .swipe-exit-left/right (lines 75, 80) | ✅ Already implemented |
| `LayoutShell` component usage | EXISTS in all 8 render methods | ✅ Already implemented |
| Root wrapper with `stage-transition` and `key={state.stage}` | EXISTS at line 1259 | ✅ Already implemented |
| Card stack (next card behind) | EXISTS in renderGame() lines 843-881 | ✅ Already implemented |
| Spring physics snap-back | EXISTS as `spring-snap-back` class (line 84-87) | ✅ Already implemented |
| Keyboard navigation (arrow keys) | EXISTS in useEffect at lines 381-397 | ✅ Already implemented |
| Touch/mouse swipe handlers | EXISTS with RAF optimization (lines 409-521) | ✅ Already implemented |

### What's Missing (Needs Implementation)

| Plan Requirement | Current State | Gap |
|-----------------|---------------|-----|
| CSS animation variables (`--anim-*`) | NOT present in index.html | ❌ Needs addition |
| Design system CSS variables (colors, spacing) | NOT present in index.html | ❌ Needs addition |
| `swipe-card` performance class | NOT defined - only swipe-exit classes exist | ❌ Needs addition |
| Font smoothing CSS | NOT present | ❌ Needs addition |
| Touch-action CSS for passive scroll | NOT present | ❌ Needs addition |
| Background color standardization | INCONSISTENT across screens | ⚠️ Needs standardization |
| Button style variants | INCONSISTENT (3 variants exist but unstandardized) | ⚠️ Needs audit |
| Container max-widths | INCONSISTENT (varies: max-w-xl to max-w-5xl) | ⚠️ Needs standardization |

## Specific Code Audit Findings

### index.html Analysis

**Current animation timing (hardcoded):**
```css
.stage-transition { animation: fadeSlideIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) }
button { transition: all 0.3s cubic-bezier(...) }
.progress-bar { transition: width 0.7s cubic-bezier(...) }
```

**Missing CSS variables:**
- No `--anim-quick`, `--anim-medium`, `--anim-slow`
- No `--color-*` design tokens
- No `--space-*` spacing scale
- No `--radius-*` or `--shadow-*` tokens

**Existing will-change (correct):**
```css
.swipe-exit-left { will-change: transform, opacity; }
.swipe-exit-right { will-change: transform, opacity; }
.spring-snap-back { will-change: transform; }
```

### App.tsx Screen Analysis

**Background colors (INCONSISTENT):**
- renderIntro: No explicit bg (inherits)
- renderPersonalitySelect: No explicit bg (inherits)
- renderRoleSelect: No explicit bg (inherits)
- renderInitializing: bg-black (line 797)
- renderGame: bg-[#0a0a0c] (line 834)
- renderBossFight: bg-[#0a0a0c] (line 1056)
- renderGameOver: bg-[#1a0505] (line 1147) - semantic red tint
- renderSummary: bg-[#051a0d] (line 1200) - semantic green tint

**Plan expectation mismatch:**
Plan 03-02 expects all navigation screens to use `bg-[#0a0a0c]`, but currently they inherit (no explicit bg class). The gameplay screens (Game, Boss) correctly use `bg-[#0a0a0c]`. Semantic colors for GameOver/Summary are correct.

**Container widths (INCONSISTENT):**
- renderIntro: No max-w (text has max-w-xl)
- renderPersonalitySelect: max-w-5xl
- renderRoleSelect: max-w-4xl
- renderInitializing: max-w-xl
- renderGame: max-w-full lg:max-w-[43rem]
- renderBossFight: max-w-3xl
- renderGameOver: max-w-2xl
- renderSummary: max-w-2xl

## Plan Alignment Recommendations

### Plan 03-01: Transition Animations

**Status:** Partially Complete

**Adjustments needed:**
1. Acknowledge that `stage-transition` class already exists and works
2. Focus task on ADDING CSS variables, not creating the animation system
3. Change Task 2 from "Verify" to "Audit and document" existing implementation
4. Current hardcoded values (0.5s, 0.3s, 0.7s) should be replaced with CSS variables

**Revised scope:**
- Add CSS custom properties (--anim-quick: 150ms, --anim-medium: 450ms, --anim-slow: 600ms)
- Replace hardcoded durations in existing CSS
- Add documentation comment explaining timing hierarchy

### Plan 03-02: Design Audit

**Status:** More complex than planned

**Adjustments needed:**
1. Background colors: Navigation screens need explicit bg-[#0a0a0c] added (currently inheriting)
2. Button standardization is larger task - 3 variants exist but applied inconsistently:
   - Primary CTA: Used at Intro, GameOver, Summary (different styling each)
   - Card buttons: Used at PersonalitySelect, RoleSelect
   - Action buttons: Used at Game (swipe buttons)
3. Container widths need explicit mapping strategy

**Revised scope:**
- Add design token CSS variables to :root
- Add explicit background to navigation screens
- Standardize button classes to 3 consistent variants
- Document container width strategy (wide/nav, standard/gameplay, narrow/focused)

### Plan 03-03: Performance Optimization

**Status:** Partially Complete

**Adjustments needed:**
1. will-change already exists on exit animations - acknowledge this
2. Missing: `swipe-card` class with will-change for active card
3. Missing: Font smoothing CSS
4. Missing: touch-action CSS for passive scroll
5. Lighthouse audit may reveal additional issues

**Revised scope:**
- Add `.swipe-card` class with will-change, backface-visibility
- Add font-smoothing to body CSS
- Add touch-action: pan-y for passive scroll
- Add mobile media query to disable CRT effect (performance)
- Run Lighthouse audit and document results

## Code Examples

### Current stage-transition (exists)
```css
/* index.html line 122-135 */
.stage-transition {
    animation: fadeSlideIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(10px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
```

### Missing: Animation timing variables
```css
/* To add to :root */
--anim-quick: 150ms;
--anim-medium: 450ms;
--anim-slow: 600ms;
```

### Missing: Design tokens
```css
/* To add to :root */
--color-bg-primary: #0a0a0c;
--color-bg-failure: #1a0505;
--color-bg-success: #051a0d;
--color-accent: #22d3ee;
```

### Missing: Performance class
```css
/* To add for swipe-card */
.swipe-card {
    will-change: transform, opacity;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform: translateZ(0);
    touch-action: pan-y;
}
```

### Current swipe implementation (exists, well-optimized)
```typescript
// App.tsx lines 409-521
const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
  // Uses RAF for smooth 60fps updates
  if (rafRef.current !== null) {
    cancelAnimationFrame(rafRef.current);
  }
  rafRef.current = requestAnimationFrame(() => {
    // Update state
  });
}, [isDragging]);
```

## Common Pitfalls

### Pitfall 1: Adding will-change to non-animated elements
**What goes wrong:** Unnecessary GPU memory usage
**Current status:** Card stack (next card) should NOT have will-change - only active card
**How to avoid:** Apply `.swipe-card` only to active card, not the preview card behind it

### Pitfall 2: Conflicting background colors
**What goes wrong:** LayoutShell has bg, screens may override, causing visual inconsistencies
**Current status:** Navigation screens inherit background instead of explicit class
**How to avoid:** Add explicit bg-[#0a0a0c] to navigation screen render methods

### Pitfall 3: Breaking existing swipe physics
**What goes wrong:** Card stack and swipe animations from Phase 2 are carefully tuned
**Current status:** Spring physics (0.55s cubic-bezier(0.34, 1.56, 0.64, 1)) works well
**How to avoid:** Don't change timing or easing of existing swipe animations - only add CSS variables for future flexibility

## State of the Art

| Old Approach | Current Approach | Status |
|--------------|------------------|--------|
| Hardcoded CSS values | CSS custom properties | Transitioning - mix exists |
| 100vh height | 100dvh height | ✅ Already implemented |
| Unoptimized touch handlers | RAF-optimized handlers | ✅ Already implemented |
| No card stack | Card stack preview | ✅ Already implemented |
| Inline styles for swipe | CSS + transform | ✅ Already implemented |

## Open Questions

1. **Button variant complexity:**
   - Current: 3 distinct button styles across 8 screens
   - Plan: Standardize to 3 variants
   - Gap: Each screen has slightly different needs (colors, sizes)
   - Recommendation: Keep 3 semantic variants (Primary, Secondary, Card) with consistent base styling, allow minor contextual adjustments

2. **Container width strategy:**
   - Current: ad-hoc max-widths per screen
   - Plan: Standardize to 3 widths
   - Gap: Game screen needs specific width for card proportions
   - Recommendation: Document the width hierarchy and apply consistently

3. **CRT effect performance impact:**
   - Current: CRT overlay on all screens
   - Plan: Disable on mobile via media query
   - Unclear: How much performance gain? Is it necessary?
   - Recommendation: Test with/without on mobile device, decide based on data

## Sources

### Primary (HIGH confidence)
- `/Users/yevgenschweden/hyperscale/App.tsx` - Full source read, lines 1-1299
- `/Users/yevgenschweden/hyperscale/index.html` - Full source read, lines 1-434
- `/Users/yevgenschweden/hyperscale/.planning/phases/03-polish-performance/03-01-PLAN.md`
- `/Users/yevgenschweden/hyperscale/.planning/phases/03-polish-performance/03-02-PLAN.md`
- `/Users/yevgenschweden/hyperscale/.planning/phases/03-polish-performance/03-03-PLAN.md`

### Analysis Method
Direct code inspection and comparison with plan requirements. No external research needed as this is a code alignment task.

## Metadata

**Confidence breakdown:**
- Code existence: HIGH - Direct file inspection
- Gap identification: HIGH - Clear comparison between plans and code
- Recommendation quality: MEDIUM - Based on code patterns, no user testing

**Research date:** 2026-02-08
**Valid until:** 2026-02-15 (until Phase 3 execution begins)

**Key action for planner:**
Update all three plans (03-01, 03-02, 03-03) to:
1. Acknowledge existing implementation
2. Focus on remaining gaps
3. Avoid redundant work
4. Adjust task descriptions to match current code state
