# Phase 02: Swipe Interactions - Context

**Gathered:** 2026-02-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement Tinder-style swipe animations with spring physics and card stack. Enhance the swipe gesture experience with visual feedback while maintaining existing keyboard navigation and touch/mouse support.

**Requirements to deliver:**
- SWIPE-01: Spring physics snap-back animation
- SWIPE-02: Card lift effect on drag
- SWIPE-03: Card stack showing next card underneath
- SWIPE-04: Enhanced gradient/text swipe preview
- SWIPE-05: Smooth card exit animations

</domain>

<decisions>
## Implementation Decisions

### Spring physics feel
- Use CSS cubic-bezier for spring effect, not JavaScript physics libraries
- Soft bouncy feel with cubic-bezier(0.34, 1.56, 0.64, 1)
- Duration: 500-600ms for natural feel
- Triggered when swipe released under threshold (100px)
- Overshoot should feel premium but not jarring

### Card lift effect
- Scale from 1.0 to 1.05 when drag starts
- Box shadow increases for depth perception (0 20px 60px rgba(0,0,0,0.4))
- Smooth 200ms transition on drag start
- Card returns to scale 1.0 on release

### Card stack visibility
- Next card fully visible underneath (not peeking from edges)
- Same size and dimensions as current card
- Scale: 0.95 (slightly smaller for depth)
- Opacity: 0.6 (dimmed but clearly visible)
- z-index: 0 (behind current card at z-index: 10)
- Creates "deck" feel showing progression

### Swipe preview feedback
- NO generic icons (✕/✓) — contextual text labels only
- Label text shows the actual action: "DEBUG", "PASTE", "BLOCK", "LAUNCH", etc.
- Red gradient overlay when swiping left
- Green gradient overlay when swiping right
- Text label scales from 0.5 to 1.0 with swipe distance
- Appears when swipe exceeds 50px (SWIPE_PREVIEW_THRESHOLD)
- Gradient intensity increases with distance

### Exit animation style
- Left exit: translateX(-120%) rotate(-25deg) + fade out
- Right exit: translateX(120%) rotate(25deg) + fade out
- Duration: 350ms
- Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
- Card should feel like it's being "thrown" off screen

### Claude's Discretion
- Exact gradient color values (use existing swipe-gradient-left/right as base)
- Shadow intensity calculations
- Passive event listener implementation
- will-change property optimization
- Exact rotation curve during drag (currently 0.05 * offset)

</decisions>

<specifics>
## Specific Ideas

- "Tinder-style" card swipe with physics-based animations
- Card should feel "lifted" when dragging (tactile feedback)
- Next card visible underneath creates sense of progression/deck
- Contextual labels matter more than generic icons because decisions are contextual ("Debug" vs "Paste" are different types of actions, not simple yes/no)
- Spring physics: "soft bouncy" — premium feel without being too jarring
- Card opacity should NOT fade during swipe (keep text readable during decision-making)

</specifics>

<deferred>
## Deferred Ideas

- Sound effects for swipe actions — future phase (SOUND-01)
- Haptic feedback on mobile — future phase (HAPTIC-01)
- Stats update animations (budget/heat/hype changes) — future phase (ANIM-01)
- Reduced motion support for accessibility — future phase (A11Y-03)

</deferred>

---

*Phase: 02-swipe-interactions*
*Context gathered: 2026-02-07*
