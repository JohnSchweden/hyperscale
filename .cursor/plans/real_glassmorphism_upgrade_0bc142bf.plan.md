---
name: Real glassmorphism upgrade
overview: Replace all fake glass (heavy bg-black/65 + weak backdrop-blur-sm) with real glassmorphism (low-opacity tint + strong blur + saturation boost) across all game components, using the sololevel-marketing-site `.glass-card` recipe as reference.
todos:
  - id: css-classes
    content: Add .glass-card, .glass-strong, .glass-header CSS classes to index.html
    status: pending
  - id: shared-constants
    content: Update GLASS_BACKDROP / GLASS_FILL_STRONG / GLASS_PANEL_DEFAULT in selectionStageStyles.ts
    status: pending
  - id: cardstack
    content: Replace incidentCardGlass and incidentCardHeaderBar in CardStack.tsx
    status: pending
  - id: feedback
    content: Replace fake glass in FeedbackOverlay.tsx (modal panel + learning moment box)
    status: pending
  - id: roast
    content: Replace fake glass in RoastTerminal.tsx (wrapper + title bar)
    status: pending
  - id: initializing
    content: Replace fake glass in InitializingScreen.tsx (card + title bar)
    status: pending
  - id: taskbar
    content: Replace fake glass in Taskbar.tsx (main bar)
    status: pending
  - id: bossfight
    content: Replace fake glass in BossFight.tsx (quiz panel)
    status: pending
  - id: starfield
    content: Replace fake glass in StarfieldBackground.tsx (speed panel)
    status: pending
  - id: verify
    content: Run typecheck + smoke tests + visual spot-check
    status: pending
isProject: false
---

# Real Glassmorphism Upgrade

## Current problem

Every "glass" surface in swiperisk uses the same fake recipe defined in `[selectionStageStyles.ts](components/game/selectionStageStyles.ts)`:

```
GLASS_BACKDROP = "backdrop-blur-[min(40vw,280px)] backdrop-saturate-100"
GLASS_FILL_STRONG = "bg-black/65 shadow-lg ${GLASS_BACKDROP}"
GLASS_PANEL_DEFAULT = "border border-white/10 ${GLASS_FILL_STRONG}"
```

- `bg-black/65` paints over 65% of whatever sits behind -- starfield is barely visible
- `backdrop-saturate-100` is a no-op (100% = no change)
- The enormous `backdrop-blur-[min(40vw,280px)]` is wasted because 65% black absorbs most of the visual effect

The swipe card has its own duplicate recipe:

```
incidentCardGlass = "bg-black/65 border border-white/10 shadow-lg backdrop-blur-sm backdrop-saturate-100"
```

Even worse -- `backdrop-blur-sm` (4px) is barely perceptible.

## Target: Real glass (sololevel reference)

From `[sololevel-marketing-site/index.html](../sololevel-marketing-site/index.html)`:

```css
.glass-card {
  background: rgba(71, 71, 71, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(8px) saturate(150%);
}
```

Key differences: **~22% opacity** fill (not 65%), **real blur** (8-20px), **saturation > 100%**.

## Strategy

1. Define CSS glass classes in `index.html` (like sololevel does), so they work everywhere including non-Tailwind contexts
2. Update the Tailwind constants in `selectionStageStyles.ts` to use the new classes
3. Update `CardStack.tsx` inline constants
4. Update remaining one-off glass occurrences across all target components

## Changes per file

### 1. `[index.html](index.html)` -- Add 3 global glass classes

Add after the existing `:root` / `body` styles:

```css
.glass-card {
  background: rgba(71, 71, 71, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(8px) saturate(150%);
  -webkit-backdrop-filter: blur(8px) saturate(150%);
}
.glass-strong {
  background: rgba(20, 20, 20, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
}
.glass-header {
  background: rgba(14, 14, 14, 0.25);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}
```

- `.glass-card` -- lightest tint, for panels/cards where starfield must bleed through
- `.glass-strong` -- slightly more opaque for contexts needing better text contrast (roast terminal, initializing screen, boss fight)
- `.glass-header` -- taskbar, title bars

### 2. `[selectionStageStyles.ts](components/game/selectionStageStyles.ts)` -- Rewire constants

Replace current constants with:

- `GLASS_BACKDROP` -- remove (no longer needed as a separate token; blur lives in the CSS class)
- `GLASS_FILL_STRONG` -- change to `"glass-strong shadow-lg"`
- `GLASS_PANEL_DEFAULT` -- change to `"glass-card"`
- `SELECT_CARD_BASE` -- uses `GLASS_PANEL_DEFAULT` already; no extra change needed

All debrief pages and selection screens consume these constants, so they upgrade automatically.

### 3. `[CardStack.tsx](components/game/CardStack.tsx)` -- Swipe cards

- `incidentCardGlass`: replace `"bg-black/65 border border-white/10 shadow-lg backdrop-blur-sm backdrop-saturate-100"` with `"glass-card"`
- `incidentCardHeaderBar`: replace `"bg-slate-800 border-b border-white/5"` with `"glass-header border-b border-white/5"`

### 4. `[FeedbackOverlay.tsx](components/game/FeedbackOverlay.tsx)` -- "Emotional support" modal

- Outer modal panel (line 131): replace `"bg-slate-900 border border-slate-700"` with `"glass-strong border border-white/10"`
- "Learning moment" box (line 280): replace `"bg-black/50 border border-white/5"` with `"glass-card"`

### 5. `[RoastTerminal.tsx](components/game/RoastTerminal.tsx)` -- Roast console

- Outer wrapper (line 78): replace `"bg-black/80 border border-slate-800"` with `"glass-strong border border-white/10"`
- Title bar (line 81): replace `"bg-slate-900"` with `"glass-header"`

### 6. `[InitializingScreen.tsx](components/game/InitializingScreen.tsx)` -- Timer start

- Main card (line 23): replace `"bg-black/80 border border-slate-800"` with `"glass-strong border border-white/10"`
- Title bar (line 25): replace `"bg-slate-900"` with `"glass-header"`

### 7. `[Taskbar.tsx](components/game/Taskbar.tsx)` -- Bottom taskbar

- Main bar (line 79): replace `"bg-slate-950/55 ... backdrop-blur-lg backdrop-saturate-100"` with `"glass-header"` (keep the custom shadow)

### 8. `[BossFight.tsx](components/game/BossFight.tsx)` -- Boss fight quiz

- Quiz panel (line 52): replace `"bg-slate-900 border border-slate-700"` with `"glass-strong border border-white/10"`

### 9. `[StarfieldBackground.tsx](components/game/StarfieldBackground.tsx)` -- Speed panel

- Speed panel (line 206): replace `"bg-black/65 ... backdrop-blur-sm backdrop-saturate-100"` with `"glass-card"`

## Components upgrading via shared constants (no direct edits needed)

These all use `GLASS_PANEL_DEFAULT` / `GLASS_FILL_STRONG` from `selectionStageStyles.ts`:

- **PersonalitySelect** (emotional support selection cards)
- **RoleSelect** (role selection cards)
- **DebriefPage1Collapse** -- StatCard panels, "Why this ending" boxes, failure lesson cards, unlocked endings box
- **DebriefPage2AuditTrail** -- Audit entries, Kirk footer, personality sign-off
- **DebriefPage3Verdict** -- Archetype verdict card, resilience score, V2 waitlist panel

## Verification

- `bun run typecheck` -- glass classes are string literals in className, no type impact
- `bun run test:smoke` -- visual regression baseline
- Manual: confirm starfield is visible through card/panel surfaces on both desktop and mobile Safari (webkit `-webkit-backdrop-filter` prefix is critical)

