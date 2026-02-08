import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:3004' });

async function navigateToIntro(page: any) {
  await page.goto('/');
}

async function navigateToPersonalitySelect(page: any) {
  await page.goto('/');
  await page.click('button:has-text("Boot system")');
  await page.waitForTimeout(300);
}

async function navigateToRoleSelect(page: any) {
  await page.goto('/');
  await page.click('button:has-text("Boot system")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("V.E.R.A")');
  await page.waitForTimeout(300);
}

async function navigateToInitializing(page: any) {
  await page.goto('/');
  await page.click('button:has-text("Boot system")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("V.E.R.A")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("Development")');
  await page.waitForTimeout(100); // Catch during countdown
}

async function navigateToPlaying(page: any) {
  await page.goto('/');
  await page.click('button:has-text("Boot system")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("V.E.R.A")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("Development")');
  await page.waitForTimeout(4000); // Countdown 3-2-1 + transition
  await page.waitForSelector('button:has-text("Debug")', { timeout: 5000 });
}

async function navigateToBossFight(page: any) {
  await navigateToPlaying(page);
  // Development has 2 cards; use left swipes (Debug, Ignore) to avoid heat/budget game over
  await page.click('button:has-text("Debug")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Next ticket")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Ignore")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Next ticket")');
  await page.waitForTimeout(500);
  await page.waitForSelector('text=Boss fight', { timeout: 8000 });
}

async function navigateToGameOver(page: any) {
  // Marketing Launch = -15M, bankrupt immediately
  await page.goto('/');
  await page.click('button:has-text("Boot system")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("V.E.R.A")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("Marketing")');
  await page.waitForTimeout(4000);
  await page.click('button:has-text("Launch")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Next ticket")');
  await page.waitForTimeout(500);
  await page.waitForSelector('text=Liquidated', { timeout: 5000 });
}

async function navigateToSummary(page: any) {
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
    const nextLabel = i < answers.length - 1 ? 'Next question' : 'Final result';
    await page.click(`button:has-text("${nextLabel}")`);
    await page.waitForTimeout(300);
  }
  await page.waitForSelector('text=Quarter survived', { timeout: 8000 });
}

async function navigateToFeedbackOverlay(page: any) {
  await navigateToPlaying(page);
  await page.click('button:has-text("Paste")'); // Swipe right = show feedback
  await page.waitForSelector('role=dialog', { timeout: 3000 });
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
    await expect(page).toHaveScreenshot('role-select.png');
  });

  test('initializing', async ({ page }) => {
    await navigateToInitializing(page);
    await expect(page).toHaveScreenshot('initializing.png', {
      mask: [
        page.getByText(/^[123]$|^Start$/),
        page.locator('[style*="width"][class*="progress-shine"]'),
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

  test('feedback-overlay', async ({ page }) => {
    await navigateToFeedbackOverlay(page);
    await expect(page).toHaveScreenshot('feedback-overlay.png', {
      mask: [page.locator('text=/\\d{1,2}:\\d{2}/')],
    });
  });

  test('boss-fight', async ({ page }) => {
    await navigateToBossFight(page);
    await expect(page).toHaveScreenshot('boss-fight.png', {
      mask: [
        page.locator('text=/\\d{1,2}:\\d{2}/'),
        page.getByText(/\d+s/),
      ],
    });
  });

  test('game-over', async ({ page }) => {
    await navigateToGameOver(page);
    await expect(page).toHaveScreenshot('game-over.png', {
      maxDiffPixelRatio: 0.03, // animate-pulse variance
    });
  });

  test('summary', async ({ page }) => {
    test.setTimeout(60000); // Boss fight timer (15s × 5 questions)
    await navigateToSummary(page);
    await expect(page).toHaveScreenshot('summary.png');
  });
});
