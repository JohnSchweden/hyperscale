import { test, expect } from '@playwright/test';
import { navigateToPlaying } from './helpers/navigation';
import { SELECTORS } from './helpers/selectors';

test.use({ baseURL: 'http://localhost:3004' });

test.describe('LayoutShell behavior', () => {
  test('desktop centers content (justify-center, items-center) at ≥1024px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const layoutRoot = page.locator('[data-testid="layout-shell"]').first();
    await layoutRoot.waitFor({ state: 'attached' });
    
    const styles = await layoutRoot.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        display: s.display,
        alignItems: s.alignItems,
        justifyContent: s.justifyContent,
        paddingTop: s.paddingTop,
      };
    });

    expect(styles.display).toBe('flex');
    expect(styles.alignItems).toBe('center');
    expect(styles.justifyContent).toBe('center');
    expect(styles.paddingTop).toBe('0px');
  });

  test('mobile top-aligns content (items-start) and has pt-16 at <1024px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const layoutRoot = page.locator('[data-testid="layout-shell"]').first();
    await layoutRoot.waitFor({ state: 'attached' });
    
    const styles = await layoutRoot.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        display: s.display,
        alignItems: s.alignItems,
        paddingTop: s.paddingTop,
      };
    });

    expect(styles.display).toBe('flex');
    expect(styles.alignItems).toBe('flex-start');
    expect(parseInt(styles.paddingTop, 10)).toBeGreaterThanOrEqual(48); // pt-16 = 4rem = 64px typically
  });
});

test.describe('Feedback overlay', () => {
  test('modal is visible and centered on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await navigateToPlaying(page);
    await page.click('button:has-text("Paste")');
    await page.waitForSelector('role=dialog', { timeout: 3000 });

    const modal = page.locator('[role=dialog] .modal-content, [role=dialog] [class*="max-w-lg"]').first();
    await expect(modal).toBeVisible();

    const { modalCenterX, viewportCenterX } = await page.evaluate(() => {
      const modal = document.querySelector('[role=dialog] [class*="max-w-lg"]') as HTMLElement;
      if (!modal) return { modalCenterX: 0, viewportCenterX: 0 };
      const box = modal.getBoundingClientRect();
      return {
        modalCenterX: box.left + box.width / 2,
        viewportCenterX: window.innerWidth / 2,
      };
    });

    expect(Math.abs(modalCenterX - viewportCenterX)).toBeLessThan(50);
  });

  test('modal is visible and centered on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await navigateToPlaying(page);
    await page.click('button:has-text("Paste")');
    await page.waitForSelector('role=dialog', { timeout: 3000 });

    const modal = page.locator('[role=dialog] [class*="max-w-lg"]').first();
    await expect(modal).toBeVisible();

    const { modalCenterX, viewportCenterX } = await page.evaluate(() => {
      const modal = document.querySelector('[role=dialog] [class*="max-w-lg"]') as HTMLElement;
      if (!modal) return { modalCenterX: 0, viewportCenterX: 0 };
      const box = modal.getBoundingClientRect();
      return {
        modalCenterX: box.left + box.width / 2,
        viewportCenterX: window.innerWidth / 2,
      };
    });

    expect(Math.abs(modalCenterX - viewportCenterX)).toBeLessThan(30);
  });
});

test.describe('Touch swipe', () => {
  test('swipe (pointer) triggers card feedback', async ({ page }) => {
    await navigateToPlaying(page);

    const card = page.locator(SELECTORS.card).or(page.locator(SELECTORS.cardFallback)).first();
    const box = await card.boundingBox();
    expect(box).not.toBeNull();

    if (!box) return;

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    const endX = startX + 120; // past threshold (100px)

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.waitForTimeout(50);
    await page.mouse.move(endX, startY, { steps: 10 });
    await page.waitForTimeout(50);
    await page.mouse.up();

    await page.waitForSelector(SELECTORS.feedbackDialogFallback, { timeout: 2000 });
    const feedbackVisible = await page.locator(SELECTORS.feedbackDialogFallback).isVisible();
    expect(feedbackVisible).toBe(true);
  });
});
