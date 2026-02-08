# hyperscale

## What This Is

hyperscale is a "Tinder for AI Risk, Governance & Compliance" - a gamified web application where players make quick decisions on AI governance scenarios by swiping left or right on incident cards. Players take on roles (Finance, Marketing, Management) with different AI assistants, managing budget, heat, and hype metrics while navigating through a series of increasingly complex AI risk scenarios.

The game runs entirely in the browser, supporting both desktop (mouse/keyboard) and mobile (touch) gameplay.

## Core Value

**Players experience smooth, responsive gameplay with consistent visual design across all 8 game stages, making intuitive swipe decisions on AI risk scenarios without jarring layout shifts or broken interactions.**

## Requirements

### Validated

- ✓ 8 distinct game stages (Intro, Personality Select, Role Select, Initializing, Gameplay, Boss Fight, Game Over, Summary) — existing
- ✓ Card-based swipe decision making (LEFT/RIGHT) — existing
- ✓ Budget, Heat, and Hype metrics tracking — existing
- ✓ Roaster Terminal for text input and AI feedback — existing
- ✓ Voice narration with personality-specific AI assistants — existing
- ✓ Boss fight quiz mechanics with timed responses — existing
- ✓ Multiple death endings based on metrics — existing
- ✓ Progressive Web App capabilities — existing
- ✓ LAYOUT-01: Unified responsive layout system (Desktop ≥1024px centered, Mobile <1024px top-anchored) — v1.0
- ✓ LAYOUT-02: Eliminate visual jumps between all 8 screens with consistent positioning — v1.0
- ✓ LAYOUT-03: Implement scrollbar-gutter: stable for desktop to prevent layout shifts — v1.0
- ✓ LAYOUT-04: Replace 100vh with 100dvh for mobile browser stability — v1.0
- ✓ LAYOUT-05: Create reusable LayoutShell component for all screens — v1.0
- ✓ SWIPE-01: Implement spring physics for card snap-back animation (soft bouncy feel) — v1.0
- ✓ SWIPE-03: Create card stack showing next card underneath current card — v1.0
- ✓ SWIPE-04: Enhanced gradient/text preview that scales with swipe distance — v1.0
- ✓ SWIPE-05: Smooth card exit animations (translateX + rotate) on commit — v1.0
- ✓ TRANS-01: Consistent stage transition animations across all 8 screens — v1.0
- ✓ DESIGN-01: Audit and align visual design across all screens — v1.0
- ✓ PERF-01: Optimize touch gesture performance with will-change and hardware acceleration — v1.0
- ~~SWIPE-02: Card lift effect (scale 1.05) on drag start — removed per user decision~~

### Out of Scope

- Native mobile apps (Capacitor/iOS/Android) — web browser only for this milestone
- Complex icon-based swipe feedback — contextual text labels work better for varied decision types
- Card opacity fade during swipe — could make text unreadable during decision-making
- Server-side features — keep client-side only for now
- Multiplayer or social features — single player only

## Context

**Technical Environment:**
- React 19 + TypeScript + Tailwind CSS
- Vite build system
- Browser-based only (desktop + mobile web)
- No backend dependencies

**Current Pain Points:**
- 7 of 8 screens use centered layout, Game screen uses offset layout causing visual jumps
- Mobile browser toolbar collapse causes content shifts (100vh issue)
- Desktop scrollbar appearance causes centered content to shift left/right
- Swipe animations lack polish (no spring physics, no lift effect, no card stack)

**Research Completed:**
- Mobile viewport units analysis (100dvh solution)
- Responsive layout patterns (desktop centered vs mobile top-anchored)
- Tinder-style swipe animation research (spring physics, card stack, visual feedback)
- Scrollbar layout shift prevention (scrollbar-gutter: stable)

**Design Philosophy:**
- Contextual button labels ("Debug", "Paste", "Block", "Launch") are more meaningful than generic icons
- Centered layout works for desktop (mouse precision), top-anchored feels more native on mobile
- Visual consistency across screens reduces cognitive load
- Smooth animations make gameplay feel premium

## Constraints

- **Tech Stack**: Must remain React + TypeScript + Tailwind (no framework migration)
- **Browser Support**: Modern browsers only (Chrome, Safari, Firefox, Edge - last 2 versions)
- **Touch + Mouse**: Must support both input methods equally well
- **Performance**: 60fps animations on mid-range mobile devices
- **Accessibility**: Maintain keyboard navigation support (arrow keys)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Desktop centered, Mobile top-anchored | Desktop has vertical space for centering; mobile top-anchored feels more app-like | — Pending |
| Keep contextual text labels (not icons) | "Debug" vs "Paste" are contextual actions, not yes/no decisions | — Pending |
| No opacity fade on swipe | Text must remain readable during decision-making | — Pending |
| scrollbar-gutter: stable for desktop | Prevents layout shifts when scrollbar appears/disappears | — Pending |
| Spring physics (soft bouncy) | Premium feel without being too jarring | — Pending |
| Card stack effect | Shows players there's more content coming, creates "deck" feel | — Pending |

---
*Last updated: 2026-02-07 after project initialization*
