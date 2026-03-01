# Testing Patterns

**Analysis Date:** 2026-03-01

## Test Framework

**Runner:**
- Playwright 1.58.2 (E2E testing framework)
- Vitest 4.0.18 (available but not used for tests)
- Bun as package manager/runtime
- Config file: `playwright.config.ts`

**Assertion Library:**
- Playwright's built-in `expect` (from `@playwright/test`)

**Run Commands:**
```bash
bunx playwright test              # Run all tests
bunx playwright test tests/swipe-interactions.spec.ts  # Run specific test file
bunx playwright test --ui         # Interactive UI mode
```

## Test File Organization

**Location:**
- All tests in `tests/` directory at project root
- Tests are co-located, not inside source directories

**Naming:**
- kebab-case with `.spec.ts` suffix: `swipe-interactions.spec.ts`, `stage-snapshots.spec.ts`
- Helper files use `.ts` suffix: `selectors.ts`, `navigation.ts`

**Structure:**
```
tests/
├── *.spec.ts              # Test files
├── helpers/
│   ├── selectors.ts       # Centralized selectors
│   └── navigation.ts      # Navigation utilities
```

## Test Structure

**Suite Organization:**
```typescript
import { test, expect } from '@playwright/test';
import { navigateToPlaying } from './helpers/navigation';
import { SELECTORS } from './helpers/selectors';

test.use({ baseURL: 'http://localhost:3000' });

test.describe('Phase 2 Swipe Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToPlaying(page);
  });

  test('spring physics CSS class exists', async ({ page }) => {
    // Test implementation
  });
});
```

**Patterns:**
- `test.describe()` groups related tests
- `test.beforeEach()` sets up test state
- `test.use()` configures test-scoped settings
- Async/await for all page interactions

## Test Helpers

**Selectors (`tests/helpers/selectors.ts`):**
```typescript
export const SELECTORS = {
  card: '[data-testid="incident-card"]',
  cardFallback: 'div[style*="z-index: 10"]',
  leftButton: '[data-testid="swipe-left-button"]',
  rightButton: '[data-testid="swipe-right-button"]',
  bootButton: '[data-testid="boot-system-button"]',
  feedbackDialog: '[data-testid="feedback-dialog"]',
  personalityButton: (name: string) => `button:has-text("${name}")`,
} as const;
```

Key patterns:
- Primary: `data-testid` attributes for stability
- Fallback: CSS selectors or text-based selectors
- Factory functions for parameterized selectors

**Navigation (`tests/helpers/navigation.ts`):**
```typescript
export async function navigateToPlaying(page: Page): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await bootButton.click();
  await personalityButton.click();
  await roleButton.click();
  await page.locator('button:has-text("Debug")').waitFor({ state: 'visible', timeout: 10000 });
}
```

Key patterns:
- Returns Promise<void>
- Waits for load states (`networkidle`)
- Waits for elements to be visible before interaction
- Timeouts for async operations (10 second default for stage transitions)

## Mocking

**Framework:** Playwright has built-in mocking via `page.route()`

**Patterns:**
- No dedicated mocking libraries (Jest mocks, sinon)
- API mocking done via Playwright's interception:
```typescript
await page.route('**/api/**', route => route.fulfill({ body: '...' }));
```

**External Services:**
- Tests run against live dev server (`bun run dev`)
- No mock for Gemini API (tests skip or timeout if API unavailable)
- Voice playback tests may fail if audio files missing

## Playwright Configuration

**`playwright.config.ts`:**
```typescript
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
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } } },
    { name: 'chromium-mobile', use: { ...devices['Pixel 5'], viewport: { width: 393, height: 851 } } },
  ],
});
```

**Key settings:**
- `baseURL` set for all tests
- `webServer` auto-starts dev server
- CI mode: no `.only` allowed, retries enabled, single worker
- Desktop and mobile viewports tested

## Coverage

**Requirements:** None enforced

**View Coverage:** Not applicable (no coverage tool configured)

**Manual testing:** Visual snapshot testing via `expect(page).toHaveScreenshot()`

## Test Types

**Visual Snapshot Tests (`stage-snapshots.spec.ts`):**
- Tests capture screenshots of each game stage
- Uses Playwright's `toHaveScreenshot()` with `maxDiffPixelRatio` tolerance
- Masks dynamic content (timers, AI responses)
- Tests: intro, personality-select, role-select, initializing, playing, boss-fight, game-over, summary

```typescript
test('playing', async ({ page }) => {
  await navigateToPlaying(page);
  await expect(page).toHaveScreenshot('playing.png', {
    mask: [page.locator('text=/\\d{1,2}:\\d{2}/')],
  });
});
```

**Interaction Tests:**
- Swipe gestures, button clicks, keyboard navigation
- CSS animation verification
- Card stack rendering

**Example from `swipe-interactions.spec.ts`:**
```typescript
test('keyboard navigation works with arrow keys', async ({ page }) => {
  const card = await getCard(page);
  await expect(card).toBeVisible();
  await page.keyboard.press('ArrowRight');
  const feedbackDialog = page.locator(SELECTORS.feedbackDialog).or(page.locator(SELECTORS.feedbackDialogFallback));
  await expect(feedbackDialog).toBeVisible({ timeout: 3000 });
});
```

**Integration Tests:**
- Full user flows (navigateToPlaying, navigateToBossFight, navigateToGameOver)
- Multi-stage sequences tested end-to-end
- State transitions verified via UI elements

## Common Patterns

**Async Testing:**
- Always await page operations
- Use `waitFor()` for element appearance
- Use `waitForLoadState('networkidle')` after navigation
- Timeouts: 2-10 seconds for typical operations

```typescript
await page.goto('/');
await page.waitForLoadState('networkidle');
await bootButton.click();
await page.waitForTimeout(300);  // Animation delays
await personalityButton.waitFor({ state: 'visible' });
```

**Element Finding:**
- Priority: data-testid > text content > CSS selectors
- Use `.or()` for fallback selectors
- Use `.first()` for multiple matches

```typescript
const bootButton = page.locator(SELECTORS.bootButton).or(page.locator(SELECTORS.bootButtonFallback));
const card = page.locator(SELECTORS.card).first();
```

**Error Testing:**
- Tests verify error states render correctly
- Visual snapshots for error screens
- Timeout handling for async failures

**Testing Responsive Behavior:**
- Desktop (1280x720) and mobile (393x851) viewports
- Tests use `test.describe` with device-specific expectations if needed

## Data-testid Attributes

**Pattern:** Elements that need testing have explicit `data-testid` attributes:

**In App.tsx:**
- `data-testid="boot-system-button"` - Boot system button
- `data-testid="incident-card"` - Main game card
- `data-testid="incident-card-container"` - Card stack container
- `data-testid="swipe-left-button"` - Left swipe/choice button
- `data-testid="swipe-right-button"` - Right swipe/choice button
- `data-testid="feedback-dialog"` - Feedback overlay dialog
- `data-testid="roast-output"` - Roast service output
- `data-testid="roast-terminal"` - Roast console terminal

**Recommendation:** Add `data-testid` to all interactive elements for stable test selectors.

---

*Testing analysis: 2026-03-01*
