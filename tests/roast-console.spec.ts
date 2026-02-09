import { test, expect } from '@playwright/test';
import { navigateToPlaying } from './helpers/navigation';

test.use({ baseURL: 'http://localhost:3000' });

async function assertRoastOutputVisibleAndInViewport(page: import('@playwright/test').Page) {
  const roastContainer = page.getByTestId('roast-output');
  await roastContainer.waitFor({ state: 'visible', timeout: 15000 });
  await expect(roastContainer).toContainText('>>>', { timeout: 15000 });
  await roastContainer.scrollIntoViewIfNeeded();

  const metrics = await roastContainer.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return { height: rect.height, top: rect.top, bottom: rect.bottom, viewportHeight: window.innerHeight };
  });
  expect(metrics.height).toBeGreaterThan(20);
  expect(metrics.top).toBeGreaterThanOrEqual(0);
  expect(metrics.bottom).toBeLessThanOrEqual(metrics.viewportHeight + 2);
}

// Layout stability test removed: roast terminal now expands when output appears (min-h-0 → min-h-[320px]),
// which intentionally shifts content. Card container stays fixed height; roast grows below it.

test.describe('Roast console visibility', () => {
  test('desktop roast output is visible and within viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await navigateToPlaying(page);

    const textarea = page.getByLabel('Describe your use case / workflow for governance review');
    await textarea.fill('I paste production secrets into random AI tools without reading the terms.');

    await page.getByRole('button', { name: /Send roast|Scanning/i }).click();
    await assertRoastOutputVisibleAndInViewport(page);
  });

  test('mobile roast output is visible and within viewport', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await navigateToPlaying(page);

    const textarea = page.getByLabel('Describe your use case / workflow for governance review');
    await textarea.fill('I paste production secrets into random AI tools without reading the terms.');

    await page.getByRole('button', { name: /Send roast|Scanning/i }).click();
    await assertRoastOutputVisibleAndInViewport(page);
  });
});

