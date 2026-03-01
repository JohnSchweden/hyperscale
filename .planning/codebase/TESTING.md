# SwipeRisk Testing Strategy

This document outlines the testing frameworks, organization, patterns, and workflows used in the SwipeRisk codebase.

---

## Testing Frameworks

### Playwright (E2E Testing)
The primary E2E testing framework is [Playwright](https://playwright.dev/). Configuration in [`playwright.config.ts`](playwright.config.ts:1):

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 },
      },
    },
  ],
});
```

**Key Configuration Points:**
- Tests located in `./tests` directory
- Runs against local dev server on port 3000
- Two projects: desktop (1280x720) and mobile (Pixel 5)
- Parallel execution locally, single worker in CI
- Traces captured on first retry for debugging

### Bun Test (Unit Testing)
Unit tests use Bun's built-in test runner with Vitest-style assertions. Located in [`unit/`](unit/):

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Voice Playback System', () => {
  beforeEach(() => {
    vi.stubGlobal('AudioContext', vi.fn(() => mockAudioContext));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should load a valid voice file successfully', async () => {
    const { loadVoice } = await import('../services/voicePlayback');
    await expect(loadVoice('roaster', 'onboarding')).resolves.not.toThrow();
  });
});
```

---

## Test Organization and Structure

### Directory Layout
```
tests/
├── helpers/
│   ├── navigation.ts    # Navigation utilities
│   └── selectors.ts     # Centralized selectors
├── stage-snapshots.spec.ts    # Visual regression tests
├── swipe-interactions.spec.ts # Gesture/swipe tests
├── exit-animation.spec.ts     # Animation tests
├── drag-tracking.spec.ts      # Drag behavior tests
├── snap-back.spec.ts          # Snap-back animation tests
├── button-highlight.spec.ts   # UI interaction tests
├── layout-overlay-touch.spec.ts # Mobile touch tests
├── mobile-width.spec.ts       # Responsive design tests
├── roast-console.spec.ts      # Feature-specific tests
└── swipe-consistency.spec.ts  # Consistency checks

unit/
└── voicePlayback.spec.ts      # Unit tests for services
```

### Test File Naming
- E2E tests: `{feature}.spec.ts`
- Unit tests: `{module}.spec.ts`
- Use kebab-case for multi-word names

---

## Test Patterns and Helpers

### Centralized Selectors
All selectors are defined in [`tests/helpers/selectors.ts`](tests/helpers/selectors.ts:1):

```typescript
export const SELECTORS = {
  // Card elements - prioritize data-testid
  card: '[data-testid="incident-card"]',
  cardFallback: 'div[style*="z-index: 10"]',
  
  // Swipe action buttons
  leftButton: '[data-testid="swipe-left-button"]',
  rightButton: '[data-testid="swipe-right-button"]',
  leftButtonFallback: 'button:has-text(/DEBUG|DISABLE|REJECT/i)',
  rightButtonFallback: 'button:has-text(/PASTE|ENABLE|ACCEPT/i)',
  
  // Navigation buttons
  bootButton: '[data-testid="boot-system-button"]',
  bootButtonFallback: 'button:has-text("Boot system")',
  
  // Dynamic selectors (functions)
  personalityButton: (name: string) => `button:has-text("${name}")`,
} as const;
```

**Selector Strategy:**
1. Primary: `data-testid` attributes (most stable)
2. Fallback: Text content patterns using `:has-text()`
3. Last resort: CSS/structural selectors
4. Use `.or()` for fallback chains: `page.locator(primary).or(page.locator(fallback))`

### Navigation Helpers
Common navigation patterns in [`tests/helpers/navigation.ts`](tests/helpers/navigation.ts:1):

```typescript
/**
 * Navigate from intro to the playing stage
 * Waits for all stages to load properly before returning
 */
export async function navigateToPlaying(page: Page): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const bootButton = page.locator(SELECTORS.bootButton)
    .or(page.locator(SELECTORS.bootButtonFallback));
  await bootButton.click();
  await page.waitForTimeout(300);

  const personalityButton = page.locator('button:has-text("V.E.R.A")');
  await personalityButton.waitFor({ state: 'visible' });
  await personalityButton.click();
  
  // ... continue through flow
}

/**
 * Get the card element, with fallback selector
 */
export async function getCard(page: Page) {
  const cardSelector = page.locator(SELECTORS.card);
  const cardCount = await cardSelector.count();

  if (cardCount > 0) {
    return cardSelector.first();
  }
  // Fallback to z-index selector
  return page.locator(SELECTORS.cardFallback).first();
}
```

### Test Structure Pattern
Standard test structure using `test.describe` and `test.beforeEach`:

```typescript
import { test, expect } from '@playwright/test';
import { navigateToPlaying } from './helpers/navigation';

test.use({ baseURL: 'http://localhost:3000' });

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToPlaying(page);
  });

  test('specific behavior', async ({ page }) => {
    // Arrange
    const card = await getCard(page);
    
    // Act
    await card.click();
    
    // Assert
    await expect(page.locator('text=Expected')).toBeVisible();
  });
});
```

---

## Snapshot Testing Approach

### Visual Regression Testing
Stage snapshots test each game stage across viewports:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Stage Snapshots', () => {
  test('intro screen matches snapshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('intro.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });

  test('playing screen matches snapshot', async ({ page }) => {
    await navigateToPlaying(page);
    await expect(page).toHaveScreenshot('playing.png', {
      fullPage: true
    });
  });
});
```

### Snapshot Configuration
- Snapshots stored in `tests/stage-snapshots.spec.ts-snapshots/`
- Platform-specific suffixes: `-chromium-darwin.png`, `-chromium-mobile-darwin.png`
- Desktop and mobile variants for each stage
- `maxDiffPixels` tolerance for minor rendering differences

### Generating Snapshots
```bash
# Update all snapshots
bunx playwright test --update-snapshots

# Update specific test snapshots
bunx playwright test tests/stage-snapshots.spec.ts --update-snapshots
```

---

## Coverage Areas

### Game Flow Tests
- **Intro → Playing**: Navigation through personality/role selection
- **Card Swiping**: Left/right swipe gestures and button clicks
- **Boss Fight**: Question answering flow
- **Game Over**: Death scenarios and endings
- **Summary**: Completion state

### Animation Tests
- **Exit animations**: Cards exit smoothly from drag position
- **Snap-back**: Spring physics when swipe threshold not met
- **Transitions**: CSS transition timing and easing functions

Example from [`tests/exit-animation.spec.ts`](tests/exit-animation.spec.ts:1):
```typescript
test('card exits smoothly from current drag position', async ({ page }) => {
  const card = page.locator(SELECTORS.cardFallback).first();
  const box = await card.boundingBox();
  
  // Simulate drag
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 120, startY, { steps: 10 });
  
  // Verify transition properties
  const transition = await card.evaluate(el => {
    return window.getComputedStyle(el).transition;
  });
  expect(transition).toContain('0.35s');
  expect(transition).toContain('cubic-bezier(0.25, 0.46, 0.45, 0.94)');
});
```

### Responsive Design Tests
- **Mobile width**: Layout at 393px viewport
- **Touch interactions**: Touch event handling on mobile
- **Layout overlays**: Proper z-index and positioning

### Feature-Specific Tests
- **Roast Console**: Terminal output and logging
- **Button highlights**: Visual feedback on interaction
- **Drag tracking**: Mouse/touch coordinate tracking

---

## Testing Commands and Workflows

### Running Tests

```bash
# Run all tests
bunx playwright test

# Run specific test file
bunx playwright test tests/swipe-interactions.spec.ts

# Run with UI mode for debugging
bunx playwright test --ui

# Run in headed mode (see browser)
bunx playwright test --headed

# Run with specific project
bunx playwright test --project=chromium-mobile
```

### Development Workflow

```bash
# Start dev server (tests will reuse it)
bun run dev

# In another terminal, run tests
bunx playwright test

# Debug a failing test
bunx playwright test tests/failing.spec.ts --headed --debug
```

### CI Workflow
```bash
# CI environment automatically:
# - Sets workers to 1 (serial execution)
# - Retries failed tests twice
# - Forbids .only() tests
# - Doesn't reuse existing server
```

---

## Mocking Patterns

### Global Mocks
Mock browser APIs for unit tests:

```typescript
class MockAudioContext {
  state = 'running';
  sampleRate = 24000;
  createBufferSource = vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }));
  // ...
}

beforeEach(() => {
  vi.stubGlobal('AudioContext', vi.fn(() => mockAudioContext));
  vi.stubGlobal('window', {
    AudioContext: vi.fn(() => mockAudioContext),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});
```

### Service Module Imports
Dynamic imports allow mocking before module initialization:

```typescript
it('should load voice', async () => {
  // Import after mocks are set up
  const { loadVoice } = await import('../services/voicePlayback');
  await expect(loadVoice('roaster', 'onboarding')).resolves.not.toThrow();
});
```

---

## Best Practices

### Test Independence
Each test should be independent and not rely on previous test state:

```typescript
// Good - each test navigates fresh
test.beforeEach(async ({ page }) => {
  await navigateToPlaying(page);
});

// Avoid - sequential dependent tests
test('step 1', async () => { ... });
test('step 2', async () => { /* relies on step 1 */ });
```

### Waiting Strategies
Use proper waiting instead of fixed timeouts:

```typescript
// Good - wait for specific state
await page.locator('button:has-text("Debug")')
  .waitFor({ state: 'visible', timeout: 10000 });

// Acceptable - small delays for animations
await page.waitForTimeout(300);

// Avoid - long arbitrary waits
await page.waitForTimeout(5000);
```

### Error Messages
Tests should have descriptive names and assertions:

```typescript
// Good
test('spring physics CSS class exists', async ({ page }) => {
  const hasSpringClass = await page.evaluate(() => {
    // Check for specific cubic-bezier values
  });
  expect(hasSpringClass).toBe(true);
});
```

---

## Troubleshooting

### Common Issues

**Flaky Tests:**
- Add `retries` to playwright.config.ts
- Use `test.slow()` for longer timeouts
- Ensure proper waiting for network idle

**Snapshot Mismatches:**
- Platform differences (macOS vs Linux)
- Font rendering variations
- Use `maxDiffPixels` tolerance

**Timeout Errors:**
- Increase `timeout` in config
- Check dev server is running
- Verify selector exists before interaction

### Debug Tools
```bash
# Generate trace for debugging
bunx playwright test --trace on

# View trace
bunx playwright show-trace trace.zip

# Screenshot on failure (default in config)
```
