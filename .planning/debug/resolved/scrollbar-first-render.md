---
status: investigating
trigger: "on first render on desktop a scroll bar is visible and scroll is possible. if i don't scroll it disappears. when i switch from one page to the other it is always first there."
created: 2026-02-08T00:00:00Z
updated: 2026-02-08T00:00:00Z
symptoms_prefilled: true
---

## Current Focus

hypothesis: The combination of min-h-[100dvh] on both App root and LayoutShell, combined with overflow-y-auto and the stage-transition animation, causes a brief scroll overflow during the fadeSlideIn animation's translateY(20px) start position
test: Analyzing the stacking context and animation effects on scrollbar
evaluating: Whether nested overflow containers + min-h-[100dvh] + animation transform cause scrollbar flicker
next_action: Report findings

## Symptoms

expected: No scrollbar on first render; content fits viewport without scroll
actual: Scrollbar appears briefly on first render of each game stage on desktop, then disappears. Happens consistently when switching between pages.
errors: None reported
reproduction: Test 1 in UAT - Navigate between game stages on desktop
started: Discovered during Phase 1 UAT

## Eliminated

## Evidence

- timestamp: 2026-02-08T00:00:00Z
  checked: App.tsx render method and root div (line 963)
  found: Root div has `min-h-[100dvh] overflow-y-auto stage-transition` with key={state.stage}
  implication: Root container has both min-height AND overflow-y-auto which creates scroll context

- timestamp: 2026-02-08T00:00:00Z
  checked: LayoutShell.tsx (line 29)
  found: Also uses `min-h-[100dvh]` with flex layout
  implication: Nested min-h-[100dvh] containers can create double-height calculations

- timestamp: 2026-02-08T00:00:00Z
  checked: index.html CSS - stage-transition animation
  found: `@keyframes fadeSlideIn { from { transform: translateY(20px) scale(0.98); } }`
  implication: Animation starts at translateY(20px), pushing content 20px below normal position, temporarily extending document height

- timestamp: 2026-02-08T00:00:00Z
  checked: index.html body styles (line 24)
  found: `body { overflow-y: auto; }` and html has `scrollbar-gutter: stable` for desktop
  implication: Scrollbar gutter is reserved but body also allows scrolling - creates double scroll area potential

## Resolution

root_cause: The stage-transition animation's initial translateY(20px) transform temporarily pushes content beyond the viewport, while the combination of `overflow-y-auto` on both the App root div AND the body, along with nested `min-h-[100dvh]` containers, causes the scrollbar to briefly appear during the animation start. The `key={state.stage}` prop triggers a full remount on each stage change, re-triggering the animation.
fix: 
verification: 
files_changed: []
