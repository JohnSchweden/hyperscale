# Testing Guide

## Overview

This project uses two test runners:
- **Playwright** -- end-to-end, visual regression, and integration tests (`tests/`)
- **Vitest** -- unit tests for hooks, utilities, data validation, and components (`unit/`)

## Unit Tests (Vitest)

### Running Unit Tests

```bash
# Run all unit tests
bun run test:unit

# Run in watch mode
bun run test:unit:watch

# Run specific file
bun run test:unit -- unit/useCountdown.spec.ts

# Run with coverage
bun run test:unit -- --coverage
```

### Test File Organization

```
unit/
├── testHelpers.ts              # Shared test utilities (createMockCard, determineDeathType, etc.)
├── *.spec.ts                   # Hook and utility unit tests
├── *.spec.tsx                  # Component unit tests
├── *.test.ts                   # Data validation and business logic tests
└── *.test.tsx                  # (if any)
```

### Test Categories

#### Game Logic & State

| File | What It Tests |
|------|--------------|
| `gameReducer.spec.ts` | Main game state reducer: stage transitions, choice outcomes, stat updates, Kirk easter egg state |
| `deck.test.ts` | Fisher-Yates shuffle, choice-side swapping, branch injection logic |
| `kirkRefusal.test.ts` | Kirk easter egg refusal flow, corruption cascade, counter logic |
| `unlocked-endings.test.ts` | Ending unlock tracking, KIRK exclusion from count |

#### Hooks

| File | What It Tests |
|------|--------------|
| `useCountdown.spec.ts` | Timer initialization, tick behavior, completion/expiry callbacks |
| `email-capture.test.ts` | Email validation, submission state, localStorage persistence |

#### Components

| File | What It Tests |
|------|--------------|
| `feedbackOverlay.spec.tsx` | Overlay rendering, personality voice button, image display |
| `gameHud.spec.tsx` | Stat display, budget formatting, visual state changes |
| `personalitySelect.spec.tsx` | Personality selection UI, callback firing |
| `roleSelect.spec.tsx` | Role selection UI, card count display |
| `pressureCueController.spec.tsx` | Pressure cue rendering, critical state display |

#### Data Validation

| File | What It Tests |
|------|--------------|
| `archetype.test.ts` | Archetype completeness: all required fields, valid IDs |
| `bossQuestions.spec.ts` | Boss question structure: unique IDs, answer counts, explanation presence |
| `deathVectorCoverage.test.ts` | Every card outcome has a deathVector, no orphaned vectors |
| `deathVectors.test.ts` | Death vector resolution logic, edge cases |
| `failureLessons.test.ts` | All death types have lessons, lesson structure validation |
| `feedbackAudioChoice.test.ts` | Audio choice mapping consistency |
| `roles.spec.ts` | Role completeness: labels, descriptions, fine tiers |
| `roastPromptCopy.test.ts` | Roast prompt text consistency |

#### Services & Utilities

| File | What It Tests |
|------|--------------|
| `audioUtils.spec.ts` | Audio utility functions: codec detection, format conversion |
| `formatting.test.ts` | Budget formatting: $XM, $XK, plain dollar display |
| `geminiService.spec.ts` | TTS service: speak function, cleanup, error handling |
| `linkedin-share.test.ts` | Share URL encoding, text formatting |
| `pressureAudio.spec.ts` | Pressure audio: heartbeat, alert triggers |
| `radioEffect.spec.ts` | Radio effect: noise generation, session management |
| `voicePlayback.spec.ts` | Voice loading, playback, caching |
| `v2-waitlist-api.test.ts` | Waitlist API: payload validation, response handling |

### Test Helpers

**File:** [`unit/testHelpers.ts`](../unit/testHelpers.ts)

| Helper | Purpose |
|--------|---------|
| `TEST_DEFAULTS` | Standard budget/heat/hype/role values for tests |
| `NON_KIRK_DEATH_TYPES` | All DeathType values except KIRK |
| `assertValidLesson(lesson)` | Validates failure lesson has title, explanation, example |
| `determineDeathType(args)` | Wrapper around `determineDeathTypeFromVectors` with test defaults |
| `createMockCard(id, leftOverrides, rightOverrides)` | Creates a complete mock Card with optional outcome overrides |
| `createMockOutcome(overrides)` | Creates a mock ChoiceOutcome with defaults |
| `BASE_MOCK_OUTCOME` | Template for mock outcome objects |

### Writing Unit Tests

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize with startFrom value", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useCountdown({ startFrom: 5, onComplete, isActive: false }),
    );
    expect(result.current.timeLeft).toBe(5);
  });
});
```

**Key patterns:**
- Use `vi.useFakeTimers()` for time-based logic
- Use `renderHook` from `@testing-library/react` for hook tests
- Use `createMockCard` from `testHelpers.ts` for card-related tests
- Mock browser APIs via `vi.stubGlobal()`
- Component tests use `@testing-library/react` render/query patterns

---

## Playwright E2E Tests

## Playwright E2E Tests

### Test Organization

```
tests/
├── helpers/
│   ├── navigation.ts         # Stage navigation utilities
│   ├── selectors.ts          # Element selectors
│   ├── km-debug-state.ts     # Debug state injection helpers
│   ├── mockApi.ts            # API mocking utilities
│   ├── keyboardSwipe.ts      # Keyboard-based swipe simulation
│   ├── syntheticMouseSwipe.ts # Synthetic mouse swipe events
│   └── victory-image-screen.ts # Victory screen helpers
├── data/
│   └── *.test.ts             # Data validation tests (Vitest)
├── utils/
│   └── card-test-utils.ts    # Card test utilities
├── stage-snapshots.spec.ts-snapshots/  # Visual baselines
├── stage-snapshots.spec.ts   # Visual regression for all stages
├── stage-transitions.spec.ts # Full stage transition flows
├── swipe-interactions.spec.ts # Touch/drag gesture handling
├── swipe-consistency.spec.ts  # Drag vs button consistency
├── drag-tracking.spec.ts      # Pointer event mechanics
├── exit-animation.spec.ts     # Card exit animations
├── snap-back.spec.ts          # Incomplete swipe snap-back
├── button-highlight.spec.ts   # Button hover synchronization
├── layout-overlay-touch.spec.ts # Responsive layout & touch
├── mobile-width.spec.ts       # Mobile viewport fit
├── roast-console.spec.ts      # AI commentary display
├── debrief-*.spec.ts          # Debrief page flows (11 files)
├── summary-navigation.spec.ts # Summary page navigation
├── voice-*.spec.ts            # Voice/TTS tests (5 files)
├── image-*.spec.ts            # Image pipeline tests (7 files)
├── card-deck-*.spec.ts        # Deck shuffle/branch tests (2 files)
├── boss-fight-*.spec.ts       # Boss fight tests (2 files)
├── kirk-easter-egg.spec.ts    # Kirk easter egg flow
└── verify-linkedin-same-tab.spec.ts # LinkedIn share behavior
```

### Running Tests

### Basic Commands

```bash
# Run all tests
bun run test
# or: bun run test

# Run specific test file
bun run test -- tests/swipe-interactions.spec.ts

# Run with UI mode (interactive debugging)
bun run test -- --ui

# Run in headed mode (see browser)
bun run test -- --headed

# Run specific project (viewport)
bun run test -- --project=chromium-desktop
bun run test -- --project=chromium-mobile

# Run with trace viewer
bun run test -- --trace=on

# Debug mode (step through)
bun run test -- --debug
```

### Test Configuration

**File:** [`playwright.config.ts`](playwright.config.ts)

| Setting | Value | Description |
|---------|-------|-------------|
| `testDir` | `./tests` | Test file location |
| `webServer` | `bun run dev` | Dev server command |
| `baseURL` | `http://localhost:3000` | Application URL |
| `workers` | `undefined` (local) / `1` (CI) | Parallelism |
| `retries` | `0` (local) / `2` (CI) | Retry failed tests |

**Device Configurations:**

| Project | Viewport | Use Case |
|---------|----------|----------|
| `chromium-desktop` | 1280x720 | Desktop testing |
| `chromium-mobile` | 393x851 (Pixel 5) | Mobile testing |

## Test Categories

### 1. Stage Snapshots (`stage-snapshots.spec.ts`)

Visual regression tests for all game stages across viewports.

**Coverage:**
- Intro screen
- Personality select
- Role select
- Playing (including roast console)
- Boss fight
- Game over
- Summary

**How it works:**
1. Navigate to each stage
2. Wait for animations to complete
3. Capture screenshot
4. Compare against baseline (stored in `tests/stage-snapshots.spec.ts-snapshots/`)

**Updating Baselines:**
```bash
# After intentional UI changes
bun run test -- tests/stage-snapshots.spec.ts --update-snapshots
```

### 2. Swipe Interactions (`swipe-interactions.spec.ts`)

Tests gesture-based card interactions.

**Test Cases:**
- Card drag physics (CSS transforms)
- Swipe threshold detection
- Direction preview arrows
- Button hover synchronization
- Card removal animations

**Key Selectors:**
```typescript
// From tests/helpers/selectors.ts
card: '[data-testid="game-card"]',
swipeZone: '[data-testid="swipe-zone"]',
swipeLeftBtn: '[data-testid="swipe-left-btn"]',
swipeRightBtn: '[data-testid="swipe-right-btn"]',
```

### 3. Swipe Consistency (`swipe-consistency.spec.ts`)

Ensures drag and button interactions produce identical results.

**Test Logic:**
1. Swipe via drag → capture result
2. Reset game
3. Swipe via button → capture result
4. Assert outcomes are identical

### 4. Drag Tracking (`drag-tracking.spec.ts`)

Tests drag gesture mechanics.

**Coverage:**
- Pointer down starts drag
- Pointer move updates card position
- Pointer up evaluates threshold
- Snap back animation when below threshold

### 5. Exit Animation (`exit-animation.spec.ts`)

Verifies card removal animations.

**Animation Checks:**
- Card slides in swipe direction
- Opacity fades to 0
- Animation duration (~300ms)
- Next card appears after exit

### 6. Snap Back (`snap-back.spec.ts`)

Tests incomplete swipe behavior.

**Scenario:**
- Drag card <100px (below threshold)
- Release
- Card returns to center with animation
- Choice is NOT triggered

### 7. Button Highlight (`button-highlight.spec.ts`)

Tests visual feedback on card hover.

**Coverage:**
- Hovering left side highlights left button
- Hovering right side highlights right button
- Opacity changes on opposite button
- Visual distinction during decision

### 8. Layout & Touch (`layout-overlay-touch.spec.ts`)

Tests responsive layout and touch interactions.

**Coverage:**
- Layout shell renders correctly
- Header positioning
- Touch event handling on mobile
- Safe area insets (notch handling)

### 9. Mobile Width (`mobile-width.spec.ts`)

Viewport-specific tests for mobile.

**Coverage:**
- Elements fit within mobile viewport
- No horizontal overflow
- Text readable at mobile sizes
- Touch targets appropriately sized

### 10. Roast Console (`roast-console.spec.ts`)

Tests the AI commentary display.

**Coverage:**
- Console renders after choices
- Personality-appropriate console title
- Text content appears
- Proper positioning over game card

## Writing Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { navigateTo } from './helpers/navigation';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    await navigateTo.game(page);
    
    // Act
    await page.dragAndDrop(selectors.card, { x: 150, y: 0 });
    
    // Assert
    await expect(page.locator('[data-testid="next-card"]')).toBeVisible();
  });
});
```

### Navigation Helpers

**File:** [`tests/helpers/navigation.ts`](tests/helpers/navigation.ts)

```typescript
// Quick navigation to specific game stages
await navigateTo.intro(page);
await navigateTo.personalitySelect(page);
await navigateTo.roleSelect(page);
await navigateTo.game(page);
await navigateTo.bossFight(page);
await navigateTo.gameOver(page);
await navigateTo.summary(page);
```

### Selector Guidelines

Prefer `data-testid` attributes over CSS selectors:

```typescript
// ✅ Good - Stable across style changes
<div data-testid="game-card">...</div>
await page.locator('[data-testid="game-card"]');

// ❌ Bad - Breaks with styling changes
await page.locator('.bg-slate-900.rounded-lg');
```

## Visual Regression

### When to Update Snapshots

Update baselines (`--update-snapshots`) when:
- ✅ Intentional UI changes (new features, design updates)
- ✅ Cross-platform differences after verification
- ❌ Never for unintended changes (fix the regression instead)

### Snapshot Review Process

1. Run tests and see failures
2. Check `test-results/` for diff images
3. Verify changes are intentional
4. Update baselines if approved

### Snapshot Files

Baselines stored in:
```
tests/stage-snapshots.spec.ts-snapshots/
├── [test-name]-[project]-[platform].png
└── ...
```

Example: `intro-chromium-desktop-darwin.png`

## Debugging Failed Tests

### Using Trace Viewer

```bash
# Run with trace
bun run test -- --trace=on

# Open trace
bun run playwright:show-trace -- test-results/trace.zip
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Tests fail only in CI | Check viewport, timing issues |
| Flaky tests | Add explicit waits, check animations |
| Snapshot mismatches | Verify intentional, update baseline |
| Timeout errors | Check selector accuracy, element existence |

### Test Results

Failed test artifacts saved to:
```
test-results/
├── [test-name]-[project]/
│   ├── error-context.md
│   ├── trace.zip
│   └── *.png (screenshots)
└── ...
```

## Best Practices

1. **Isolate Tests** - Each test should be independent
2. **Use Navigation Helpers** - Don't manually click through setup
3. **Prefer Data Attributes** - Use `data-testid` for selectors
4. **Wait for Animations** - Account for CSS transitions
5. **Test User Flows** - Cover complete user journeys
6. **Update Intentionally** - Only update snapshots deliberately

## Coverage Goals

| Area | Coverage |
|------|----------|
| Game navigation | All stage transitions |
| Swipe mechanics | Drag, threshold, snap-back |
| Visual states | All stage snapshots |
| Responsive | Desktop + mobile viewports |
| User feedback | Animations, highlights |

## CI/CD Integration

Tests automatically run on:
- Pull requests
- Main branch merges

**CI Configuration:**
- Retries: 2 attempts
- Workers: 1 (sequential)
- Projects: Both desktop and mobile

## Resources

- [Playwright Docs](https://playwright.dev/docs/intro)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)
