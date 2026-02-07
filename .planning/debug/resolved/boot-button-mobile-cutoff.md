---
status: resolved
trigger: "Boot button (Init roast) and its container window are cut off at the bottom on mobile"
created: 2026-02-08T00:00:00Z
updated: 2026-02-08T00:00:00Z
---

## Current Focus

hypothesis: Fixed taskbar at bottom is overlapping the roast terminal container, cutting off the "Init roast" button
test: Examine LayoutShell and renderGame container structure
expecting: Find overflow:hidden or missing padding to account for fixed taskbar height
next_action: Read LayoutShell component and analyze container hierarchy

## Symptoms

expected: Boot button fully visible and tappable (44px minimum)
actual: "the button including the window is cut off at the bottom"
errors: None reported
reproduction: Test 5 in UAT - Game screen Boot/"Init roast" button on mobile
started: Discovered during Phase 1 UAT

## Eliminated

## Evidence

- timestamp: 2026-02-08
  checked: App.tsx renderGame function around "Side Roaster Terminal" section
  found: Roast terminal container at lines 655-683 with `h-auto lg:h-[260px]` and `overflow-hidden`
  implication: Container has overflow-hidden which could clip content if height is constrained

- timestamp: 2026-02-08
  checked: index.html CSS for safe-area-bottom class
  found: `.safe-area-bottom { padding-bottom: env(safe-area-inset-bottom) }` - only handles device notch, not fixed elements
  implication: safe-area-bottom doesn't account for the fixed taskbar height

- timestamp: 2026-02-08
  checked: App.tsx LayoutShell usage at line 532 and taskbar at line 687
  found: LayoutShell has safe-area-bottom, but taskbar is `fixed bottom-0 h-12 z-20` (48px height)
  implication: Fixed taskbar covers content at bottom of viewport because nothing accounts for its 48px height

- timestamp: 2026-02-08
  checked: Main content container padding in renderGame at line 570
  found: `p-3 pb-2 md:p-8 md:pb-4` - only 8px padding on mobile bottom
  implication: Main content has only 8px bottom padding but 48px taskbar sits on top of it, cutting off ~40px of content

- timestamp: 2026-02-08
  checked: Roast terminal button position at lines 669-675
  found: "Init roast" button is at bottom of roast terminal, which is last element before taskbar
  implication: Button is in the overlap zone between content and fixed taskbar

## Resolution

root_cause: The fixed taskbar (48px height at bottom:0 with z-20) overlaps the main content because the content container only has 8px bottom padding (pb-2) on mobile. The "Init roast" button at the bottom of the roast terminal is in the overlap zone and gets visually cut off by the taskbar.

fix: 
verification: 
files_changed: []
