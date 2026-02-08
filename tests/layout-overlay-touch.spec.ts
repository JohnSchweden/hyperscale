import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:3004' });

async function navigateToPlaying(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.click('button:has-text("Boot system")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("V.E.R.A")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("Development")');
  await page.waitForTimeout(4000);
  await page.waitForSelector('button:has-text("Debug")', { timeout: 5000 });
}

test.describe('LayoutShell behavior', () => {
  test('desktop centers content (justify-center, items-center) at ≥1024px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    const shell = page.getByTestId('layout-shell');
    const styles = await shell.evaluate((el) => {
      const s = getComputedStyle(el);
      return { alignItems: s.alignItems, justifyContent: s.justifyContent, paddingTop: s.paddingTop };
    });

    expect(styles.alignItems).toBe('center');
    expect(styles.justifyContent).toBe('center');
    expect(styles.paddingTop).toBe('0px');
  });

  test('mobile top-aligns content (items-start) and has pt-16 at <1024px', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await page.goto('/');

    const shell = page.getByTestId('layout-shell');
    const styles = await shell.evaluate((el) => {
      const s = getComputedStyle(el);
      return { alignItems: s.alignItems, paddingTop: s.paddingTop };
    });

    expect(styles.alignItems).toBe('flex-start');
    expect(parseInt(styles.paddingTop, 10)).toBeGreaterThanOrEqual(48); // pt-16 = 4rem
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
  test('swipe uses touch events and triggers card feedback', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-mobile', 'Touch swipe runs only on mobile project');
    await navigateToPlaying(page);

    const card = page.locator('div[style*="z-index: 10"]').first();
    const box = await card.boundingBox();
    expect(box).not.toBeNull();

    if (!box) return;

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    const endX = startX + 120; // Swipe right past threshold (100px)

    await card.evaluate(
      async (el, { startX, startY, endX }) => {
        const touchOpts = (x: number, y: number) => ({
          identifier: 1,
          target: el,
          clientX: x,
          clientY: y,
          radiusX: 2,
          radiusY: 2,
          rotationAngle: 0,
          force: 1,
        });

        const touchStart = new Touch(touchOpts(startX, startY));
        el.dispatchEvent(
          new TouchEvent('touchstart', {
            touches: [touchStart],
            changedTouches: [touchStart],
            targetTouches: [touchStart],
            bubbles: true,
          })
        );

        for (let i = 1; i <= 5; i++) {
          const x = startX + (endX - startX) * (i / 5);
          const touchMove = new Touch(touchOpts(x, startY));
          el.dispatchEvent(
            new TouchEvent('touchmove', {
              touches: [touchMove],
              changedTouches: [touchMove],
              targetTouches: [touchMove],
              bubbles: true,
              cancelable: true,
            })
          );
          await new Promise((r) => setTimeout(r, 20));
        }

        await new Promise((r) => setTimeout(r, 100));

        const touchEnd = new Touch(touchOpts(endX, startY));
        el.dispatchEvent(
          new TouchEvent('touchend', {
            touches: [],
            changedTouches: [touchEnd],
            targetTouches: [],
            bubbles: true,
          })
        );
      },
      { startX, startY, endX }
    );

    await page.waitForTimeout(600);

    const feedbackVisible = await page.locator('role=dialog').isVisible();
    expect(feedbackVisible).toBe(true);
  });
});
