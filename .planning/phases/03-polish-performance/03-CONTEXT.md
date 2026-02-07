# Phase 03: Polish & Performance - Context

**Gathered:** 2026-02-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Consistent transitions, design audit across all 8 screens, and performance optimization. Standardize visual design and animation patterns while ensuring 60fps performance.

**Requirements to deliver:**
- TRANS-01: Consistent stage transition animations across all 8 stages
- DESIGN-01: Visual design audited and aligned across all screens
- PERF-01: Touch gesture performance optimized

**Success criteria:**
- All stage transitions feel consistent
- Typography, colors, spacing consistent across all screens
- Touch gestures run at 60fps
- Lighthouse performance score ≥ 90

</domain>

<decisions>
## Implementation Decisions

### Stage transition style
- Fade only transitions (opacity 0→1)
- Keep existing timing (approximately 400-500ms based on current CSS)
- All 8 stages use same transition animation
- No directional transitions (to avoid confusion with swipe animations)

### Animation timing hierarchy
- **Quick (150-200ms)**: Button hovers, micro-interactions, feedback
- **Medium (300-500ms)**: Stage transitions, card swipes
- **Slow (500-800ms)**: Emphasis animations, celebrations
- Different speeds create rhythm, prevent monotony

### Design audit scope
- Audit all visual elements:
  - Typography (sizes, weights, line heights)
  - Color palette (slate grays, cyan accents, semantic colors)
  - Spacing scale (padding, margins, gaps)
  - Component styles (buttons, cards, inputs)
  - Borders, shadows, border radius

### Design grouping approach
- Current split:
  - Navigation screens: Intro, Personality, Role, Boss, Game Over, Summary
  - Gameplay screens: Initializing, Game
- Research needed: Should navigation vs gameplay have distinct visual treatments or be unified?

### Performance priorities
- 60fps on mid-range mobile devices
- Lighthouse performance score ≥ 90
- Optimize: will-change, GPU acceleration, passive listeners

### Claude's Discretion
- Exact easing curves for each animation category
- Specific typography scale values
- Exact color values (use existing as base)
- Implementation of performance optimizations (will-change, etc.)
- Research recommendation on navigation vs gameplay design split

</decisions>

<specifics>
## Specific Ideas

- Keep existing stage-transition timing (user said "what is used now is good")
- Hierarchy of animation speeds creates better UX than single timing
- Design audit should cover typography, colors, spacing, components comprehensively
- Question to research: Is it correct to have different designs for navigation vs gameplay screens?

</specifics>

<deferred>
## Deferred Ideas

- None discussed — stayed within phase scope

</deferred>

<research_needed>
## Research Needed

**Navigation vs Gameplay Design Patterns:**
- Should menu/navigation screens have different visual treatment than gameplay screens?
- Best practices for game UI: unified design system vs contextual styling
- Examples from successful web-based games

**Animation Timing Standards:**
- Industry standard timing for micro-interactions vs transitions
- CSS easing curves that work well for each category

</research_needed>

---

*Phase: 03-polish-performance*
*Context gathered: 2026-02-07*
