---
status: resolved
trigger: "address bar currently never hides and the roast window is cut off at the bottom"
created: "2026-02-08"
updated: "2026-02-08"
---

## Current Focus

hypothesis: Layout doesn't account for fixed taskbar - roast terminal gets cut off by h-12 fixed bottom bar
test: Analyzed code structure and height calculations
expecting: Confirmed - padding/margin missing for fixed taskbar
next_action: Document root cause and suggest fix

## Symptoms

expected: Roast window fully visible on mobile, not cut off
actual: "address bar currently never hides and the roast window is cut off at the bottom"
errors: None reported
reproduction: Test 4 in UAT - Game screen on mobile shows roast terminal window at bottom
started: Discovered during Phase 1 UAT

## Eliminated

## Evidence

- timestamp: 2026-02-08
  checked: App.tsx renderGame function layout structure
  found: Taskbar is fixed bottom-0 with h-12 (48px), roast terminal has h-auto on mobile
  implication: Fixed element overlays content without reserved space

- timestamp: 2026-02-08
  checked: Main content container padding (line 570)
  found: pb-2 on mobile (8px), md:pb-4 on desktop (16px) - insufficient for h-12 taskbar
  implication: Bottom padding doesn't account for 48px fixed taskbar

- timestamp: 2026-02-08
  checked: LayoutShell.tsx viewport handling
  found: Uses min-h-[100dvh] and safe-area-bottom classes
  implication: Viewport handling is correct, but child content doesn't reserve space for fixed elements

## Resolution

rootcause: The Game screen uses a fixed position taskbar at bottom (h-12 = 48px) but the main content container doesn't reserve space for it. The roast terminal has h-auto on mobile which means it expands naturally, but without proper bottom padding/margin, the bottom portion gets obscured by the fixed taskbar.

files_affected:
  - App.tsx (line 570): Main content container needs increased bottom padding
  - App.tsx (line 655): Roast terminal container may need margin-bottom

fix_direction: Add mb-12 (48px) or pb-12 to the main content container, or add mb-12 to the roast terminal container to push it above the fixed taskbar. Alternatively, use bottom padding that accounts for safe area + taskbar height.
