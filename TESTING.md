# Testing Guide

## Overview

This project uses [Playwright](https://playwright.dev/) for end-to-end testing with both functional and visual regression coverage.

## Test Organization

```
tests/
├── helpers/
│   ├── navigation.ts     # Navigation utilities
│   └── selectors.ts      # Element selectors
├── stage-snapshots.spec.ts-snapshots/  # Visual baselines
├── button-highlight.spec.ts
├── drag-tracking.spec.ts
├── exit-animation.spec.ts
├── layout-overlay-touch.spec.ts
├── mobile-width.spec.ts
├── roast-console.spec.ts
├── snap-back.spec.ts
├── stage-snapshots.spec.ts
├── swipe-consistency.spec.ts
└── swipe-interactions.spec.ts
```

## Running Tests

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
