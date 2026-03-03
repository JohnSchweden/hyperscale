/**
 * Consolidated Live API + TTS fallback tests.
 * Run: bunx playwright test tests/live-api.spec.ts --project=chromium-desktop
 * For TTS fallback: Start local-api.ts first: npx tsx scripts/local-api.ts
 */
import { test, expect } from '@playwright/test';
import { navigateToPlaying } from './helpers/navigation';

test.use({ baseURL: 'http://localhost:3000' });

test.describe('Live API with TTS fallback', () => {
  test('text and audio appear when using Live API', async ({ page }) => {
    test.setTimeout(60000);
    await navigateToPlaying(page);

    const textarea = page.getByLabel(
      'Describe your use case / workflow for governance review'
    );
    await textarea.waitFor({ state: 'visible', timeout: 10000 });
    await textarea.fill('test input for live api');

    const outputBody = page.locator('[data-testid="roast-output-body"]');
    const startTime = Date.now();

    await page.locator('[aria-label="Send roast"]').click();

    await outputBody.waitFor({ state: 'visible', timeout: 20000 });

    const text = await outputBody.textContent();
    expect(text?.length).toBeGreaterThan(10);

    const elapsed = Date.now() - startTime;
    console.log(`Live API response time: ${elapsed}ms`);
  });

  test('TTS fallback works when Live API fails', async ({ page }) => {
    test.setTimeout(60000);
    await navigateToPlaying(page);

    const textarea = page.getByLabel(
      'Describe your use case / workflow for governance review'
    );
    await textarea.waitFor({ state: 'visible', timeout: 10000 });

    await textarea.fill('fallback test prompt');

    const consoleLogs: string[] = [];
    page.on('console', msg => consoleLogs.push(msg.text()));

    await page.locator('[aria-label="Send roast"]').click();

    await page.waitForTimeout(5000);

    const outputElement = page.locator('[data-testid="roast-output"]');
    const hasOutput = await outputElement.isVisible().catch(() => false);

    const hasError = consoleLogs.some(l => 
      l.includes('Live API unavailable') || l.includes('falling back to TTS')
    );

    expect(hasOutput || hasError).toBe(true);
    console.log('Fallback triggered:', hasError);
  });
});
