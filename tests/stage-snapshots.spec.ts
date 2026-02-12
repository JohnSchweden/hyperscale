import { test, expect, Page } from '@playwright/test';
import { navigateToPlaying } from './helpers/navigation';
import { SELECTORS } from './helpers/selectors';

test.use({ baseURL: 'http://localhost:3000' });

async function navigateToIntro(page: Page) {
  await page.goto('/');
}

async function navigateToPersonalitySelect(page: Page) {
  await page.goto('/');
  const bootButton = page.locator(SELECTORS.bootButton).or(page.locator(SELECTORS.bootButtonFallback));
  await bootButton.click();
  await page.waitForTimeout(300);
}

async function navigateToRoleSelect(page: Page) {
  await page.goto('/');
  const bootButton = page.locator(SELECTORS.bootButton).or(page.locator(SELECTORS.bootButtonFallback));
  await bootButton.click();
  await page.waitForTimeout(300);
  const personalityButton = page.locator('button:has-text("V.E.R.A")');
  await personalityButton.waitFor({ state: 'visible' });
  await personalityButton.click();
  await page.waitForTimeout(300);
}

async function navigateToInitializing(page: Page) {
  await page.goto('/');
  const bootButton = page.locator(SELECTORS.bootButton).or(page.locator(SELECTORS.bootButtonFallback));
  await bootButton.click();
  await page.waitForTimeout(300);
  const personalityButton = page.locator('button:has-text("V.E.R.A")');
  await personalityButton.waitFor({ state: 'visible' });
  await personalityButton.click();
  await page.waitForTimeout(300);
  const roleButton = page.locator('button:has-text("Development")');
  await roleButton.waitFor({ state: 'visible' });
  await roleButton.click();
  await page.waitForTimeout(100); // Catch during countdown
}

async function navigateToBossFight(page: Page) {
  await navigateToPlaying(page);
  // Development has 2 cards; use left swipes (Debug, Ignore) to avoid heat/budget game over
  await page.click(SELECTORS.debugButton);
  await page.waitForTimeout(500);
  await page.click(SELECTORS.nextTicketButton);
  await page.waitForTimeout(500);
  await page.click('button:has-text("Ignore")');
  await page.waitForTimeout(500);
  await page.click(SELECTORS.nextTicketButton);
  await page.waitForTimeout(500);
  await page.waitForSelector('text=Boss fight', { timeout: 8000 });
}

async function navigateToGameOver(page: Page) {
  // Marketing Launch = -15M, bankrupt immediately
  await page.goto('/');
  const bootButton = page.locator(SELECTORS.bootButton).or(page.locator(SELECTORS.bootButtonFallback));
  await bootButton.click();
  await page.waitForTimeout(300);
  const personalityButton = page.locator('button:has-text("V.E.R.A")');
  await personalityButton.waitFor({ state: 'visible' });
  await personalityButton.click();
  await page.waitForTimeout(300);
  const roleButton = page.locator('button:has-text("Marketing")');
  await roleButton.waitFor({ state: 'visible' });
  await roleButton.click();
  await page.waitForTimeout(4000);
  await page.click('button:has-text("Launch")');
  await page.waitForTimeout(500);
  await page.click(SELECTORS.nextTicketButton);
  await page.waitForTimeout(500);
  await page.waitForSelector('text=Liquidated', { timeout: 5000 });
}

async function navigateToSummary(page: Page) {
  await navigateToBossFight(page);
  // Answer all 5 questions correctly to reach summary
  const answers = [
    'Data Leakage',
    'Proxy bias',
    'Supply chain attack',
    'Workplace privacy',
    'Right of publicity',
  ];
  for (let i = 0; i < answers.length; i++) {
    await page.click(`button:has-text("${answers[i]}")`);
    await page.waitForTimeout(300);
    const nextLabel = i < answers.length - 1 ? SELECTORS.nextQuestionButton : SELECTORS.finalResultButton;
    await page.click(nextLabel);
    await page.waitForTimeout(300);
  }
  await page.waitForSelector('text=Quarter survived', { timeout: 8000 });
}

async function navigateToFeedbackOverlay(page: Page) {
  await navigateToPlaying(page);
  await page.click('button:has-text("Paste")'); // Swipe right = show feedback
  const feedbackDialog = page.locator(SELECTORS.feedbackDialog).or(page.locator(SELECTORS.feedbackDialogFallback));
  await feedbackDialog.waitFor({ timeout: 3000 });
}

async function navigateToPlayingWithRoastAnswer(page: Page) {
  await navigateToPlaying(page);
  const textarea = page.getByLabel('Describe your use case / workflow for governance review');
  await textarea.fill('I paste production secrets into random AI tools without reading the terms.');
  await page.getByRole('button', { name: /Send roast|Scanning/i }).click();
  await page.getByTestId('roast-output').waitFor({ state: 'attached', timeout: 20000 });
  await expect(page.getByTestId('roast-output')).toContainText('>>>', { timeout: 10000 });
}

test.describe('Stage visual snapshots', () => {
  test('intro', async ({ page }) => {
    await navigateToIntro(page);
    await expect(page).toHaveScreenshot('intro.png');
  });

  test('personality-select', async ({ page }) => {
    await navigateToPersonalitySelect(page);
    await expect(page).toHaveScreenshot('personality-select.png', {
      maxDiffPixelRatio: 0.03, // fade-in animation variance
    });
  });

  test('role-select', async ({ page }) => {
    await navigateToRoleSelect(page);
    // Wait for animations to settle
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('role-select.png', {
      maxDiffPixelRatio: 0.03, // Allow some variance for animations
    });
  });

  test('initializing', async ({ page }) => {
    await navigateToInitializing(page);
    await expect(page).toHaveScreenshot('initializing.png', {
      mask: [
        page.getByText(/^[123]$|^Start$/),
        page.locator('[style*="width"][class*="progress-shine"]'),
        page.locator('.cursor-blink'),
      ],
      maxDiffPixelRatio: 0.02,
    });
  });

  test('playing', async ({ page }) => {
    await navigateToPlaying(page);
    await expect(page).toHaveScreenshot('playing.png', {
      mask: [page.locator('text=/\\d{1,2}:\\d{2}/')],
    });
  });

  test('playing-roast-after', async ({ page }) => {
    await navigateToPlayingWithRoastAnswer(page);
    await page.getByTestId('roast-terminal').scrollIntoViewIfNeeded();
    await expect(page).toHaveScreenshot('playing-roast-after.png', {
      mask: [
        page.locator('text=/\\d{1,2}:\\d{2}/'),
        page.getByTestId('roast-terminal'),
      ],
      maxDiffPixelRatio: 0.15, // AI response varies; mask entire roast terminal
    });
  });

  test('playing roast con before and after', async ({ page }) => {
    await navigateToPlaying(page);
    await page.getByTestId('roast-terminal').scrollIntoViewIfNeeded();
    await expect(page).toHaveScreenshot('playing-roast-before.png', {
      mask: [page.locator('text=/\\d{1,2}:\\d{2}/')],
    });
    const textarea = page.getByLabel('Describe your use case / workflow for governance review');
    await textarea.fill('I paste production secrets into random AI tools without reading the terms.');
    await page.getByRole('button', { name: /Send roast|Scanning/i }).click();
    await page.getByTestId('roast-output').waitFor({ state: 'visible', timeout: 15000 });
    await expect(page.getByTestId('roast-output')).toContainText('>>>', { timeout: 5000 });
    await page.getByTestId('roast-terminal').scrollIntoViewIfNeeded();
    await expect(page).toHaveScreenshot('playing-roast-after.png', {
      mask: [
        page.locator('text=/\\d{1,2}:\\d{2}/'),
        page.getByTestId('roast-terminal'),
      ],
      maxDiffPixelRatio: 0.15, // AI response varies; mask entire roast terminal
    });
  });

  test('feedback-overlay', async ({ page }) => {
    await navigateToFeedbackOverlay(page);
    // Wait for overlay animation to settle
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('feedback-overlay.png', {
      mask: [page.locator('text=/\\d{1,2}:\\d{2}/')],
      maxDiffPixelRatio: 0.02, // Allow some variance for animations
    });
  });

  test('boss-fight', async ({ page }) => {
    await navigateToBossFight(page);
    // Wait for boss fight screen to fully load and animations to settle
    await page.waitForTimeout(1000);
    // Wait for any countdown timers or animations to stabilize
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('boss-fight.png', {
      mask: [
        page.locator('text=/\\d{1,2}:\\d{2}/'),
        page.getByText(/\d+s/),
      ],
      maxDiffPixelRatio: 0.05, // Allow more variance for boss fight dynamic content
    });
  });

  test('game-over', async ({ page }) => {
    await navigateToGameOver(page);
    await expect(page).toHaveScreenshot('game-over.png', {
      maxDiffPixelRatio: 0.05, // animate-pulse and layout variance
    });
  });

  test('summary', async ({ page }) => {
    test.setTimeout(180000); // Boss fight timer (30s × 5 questions + buffer)
    await navigateToSummary(page);
    await expect(page).toHaveScreenshot('summary.png');
  });
});
