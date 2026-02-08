import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:3004' });

test.describe('Button Highlight on Swipe', () => {
  test('right button highlights when swiping right', async ({ page }) => {
    // Navigate to game
    await page.goto('/');
    await page.click('button:has-text("Boot system")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("V.E.R.A")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Development")');
    await page.waitForTimeout(2000);

    // Find the card
    const card = await page.locator('div[style*="z-index: 10"]').first();
    const box = await card.boundingBox();
    expect(box).not.toBeNull();

    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;

      // Check initial button state
      const rightButtonBefore = await page.locator('button', { hasText: /PASTE|ENABLE|ACCEPT/i }).first();
      const rightClassBefore = await rightButtonBefore.evaluate(el => el.className);
      console.log('Right button class before swipe:', rightClassBefore);
      // Check that it doesn't have the active bg-cyan-500 (standalone, not hover: or active:)
      const hasActiveCyanBefore = /\sbg-cyan-500\s/.test(rightClassBefore + ' ');
      expect(hasActiveCyanBefore).toBe(false);

      // Start drag to the right
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX + 60, startY, { steps: 5 });

      // Wait for swipe direction to update
      await page.waitForTimeout(100);

      // Check right button is now highlighted
      const rightButtonAfter = await page.locator('button', { hasText: /PASTE|ENABLE|ACCEPT/i }).first();
      const rightClassAfter = await rightButtonAfter.evaluate(el => el.className);
      console.log('Right button class during swipe:', rightClassAfter);
      // When active, the class should have standalone "bg-cyan-500"
      const hasActiveCyanAfter = /\sbg-cyan-500\s/.test(rightClassAfter + ' ');
      expect(hasActiveCyanAfter).toBe(true);
      expect(rightClassAfter).toContain('border-cyan-500');
      expect(rightClassAfter).toContain('text-black');

      // Release
      await page.mouse.up();
      await page.waitForTimeout(600);
    }
  });

  test('left button highlights when swiping left', async ({ page }) => {
    // Navigate to game
    await page.goto('/');
    await page.click('button:has-text("Boot system")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("V.E.R.A")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Development")');
    await page.waitForTimeout(2000);

    const card = await page.locator('div[style*="z-index: 10"]').first();
    const box = await card.boundingBox();

    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;

      // Check initial button state
      const leftButtonBefore = await page.locator('button', { hasText: /DEBUG|DISABLE|REJECT/i }).first();
      const leftClassBefore = await leftButtonBefore.evaluate(el => el.className);
      console.log('Left button class before swipe:', leftClassBefore);
      // Check that it doesn't have the active bg-cyan-500 (standalone, not hover: or active:)
      const hasActiveCyanBefore = /\sbg-cyan-500\s/.test(leftClassBefore + ' ');
      expect(hasActiveCyanBefore).toBe(false);

      // Start drag to the left
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX - 60, startY, { steps: 5 });

      // Wait for swipe direction to update
      await page.waitForTimeout(100);

      // Check left button is now highlighted
      const leftButtonAfter = await page.locator('button', { hasText: /DEBUG|DISABLE|REJECT/i }).first();
      const leftClassAfter = await leftButtonAfter.evaluate(el => el.className);
      console.log('Left button class during swipe:', leftClassAfter);
      // When active, the class should have standalone "bg-cyan-500"
      const hasActiveCyanAfter = /\sbg-cyan-500\s/.test(leftClassAfter + ' ');
      expect(hasActiveCyanAfter).toBe(true);
      expect(leftClassAfter).toContain('border-cyan-500');
      expect(leftClassAfter).toContain('text-black');

      // Release
      await page.mouse.up();
      await page.waitForTimeout(600);
    }
  });
});
