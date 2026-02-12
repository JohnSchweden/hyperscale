import { test, expect } from '@playwright/test';
import { navigateToPlaying, getCard, getRightButton, getLeftButton } from './helpers/navigation';

test.use({ baseURL: 'http://localhost:3000' });

test.describe('Button Highlight on Swipe', () => {
  test('right button highlights when swiping right', async ({ page }) => {
    await navigateToPlaying(page);

    // Find the card
    const card = await getCard(page);
    const box = await card.boundingBox();
    expect(box).toBeTruthy();

    const startX = box!.x + box!.width / 2;
    const startY = box!.y + box!.height / 2;

    // Check initial button state - use computed styles to avoid hover class false positives
    const rightButtonBefore = await getRightButton(page);
    const rightStylesBefore = await rightButtonBefore.evaluate(el => {
      const s = getComputedStyle(el);
      return { backgroundColor: s.backgroundColor, borderColor: s.borderColor, color: s.color };
    });
    console.log('Right button styles before swipe:', rightStylesBefore);
    expect(rightStylesBefore.backgroundColor).not.toMatch(/rgba?\(6,\s*182,\s*212/); // cyan-500

    // Start drag to the right
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 60, startY, { steps: 5 });

    // Wait for RAF to complete and swipe direction to update (allow multiple frames)
    await page.waitForTimeout(200);

    // Check right button is now highlighted - use computed styles
    const rightButtonAfter = await getRightButton(page);
    const rightStylesAfter = await rightButtonAfter.evaluate(el => {
      const s = getComputedStyle(el);
      return { backgroundColor: s.backgroundColor, borderColor: s.borderColor, color: s.color };
    });
    console.log('Right button styles during swipe:', rightStylesAfter);
    expect(rightStylesAfter.backgroundColor).toMatch(/rgba?\(6,\s*182,\s*212/); // cyan-500 (rgb or rgba)
    expect(rightStylesAfter.color).toContain('rgb(0, 0, 0)'); // text-black

    // Release
    await page.mouse.up();
    await page.waitForTimeout(600);
  });

  test('left button highlights when swiping left', async ({ page }) => {
    await navigateToPlaying(page);

    // Find the card
    const card = await getCard(page);
    const box = await card.boundingBox();
    expect(box).toBeTruthy();

    const startX = box!.x + box!.width / 2;
    const startY = box!.y + box!.height / 2;

    // Check initial button state - use computed styles to avoid hover class false positives
    const leftButtonBefore = await getLeftButton(page);
    const leftStylesBefore = await leftButtonBefore.evaluate(el => {
      const s = getComputedStyle(el);
      return { backgroundColor: s.backgroundColor, borderColor: s.borderColor, color: s.color };
    });
    console.log('Left button styles before swipe:', leftStylesBefore);
    expect(leftStylesBefore.backgroundColor).not.toMatch(/rgba?\(6,\s*182,\s*212/); // cyan-500

    // Start drag to the left
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX - 60, startY, { steps: 5 });

    // Wait for RAF to complete and swipe direction to update (allow multiple frames)
    await page.waitForTimeout(200);

    // Check left button is now highlighted - use computed styles
    const leftButtonAfter = await getLeftButton(page);
    const leftStylesAfter = await leftButtonAfter.evaluate(el => {
      const s = getComputedStyle(el);
      return { backgroundColor: s.backgroundColor, borderColor: s.borderColor, color: s.color };
    });
    console.log('Left button styles during swipe:', leftStylesAfter);
    expect(leftStylesAfter.backgroundColor).toMatch(/rgba?\(6,\s*182,\s*212/); // cyan-500 (rgb or rgba)
    expect(leftStylesAfter.color).toContain('rgb(0, 0, 0)'); // text-black

    // Release
    await page.mouse.up();
    await page.waitForTimeout(600);
  });
});
