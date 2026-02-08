import { test, expect } from '@playwright/test';
import { navigateToPlaying } from './helpers/navigation';
import { SELECTORS } from './helpers/selectors';

test.use({ baseURL: 'http://localhost:3004' });

test.describe('Card Drag Tracking', () => {
  test('card follows drag gesture', async ({ page }) => {
    // Navigate to playing stage using shared helper
    await navigateToPlaying(page);

    // Find the current card (front card with z-index: 10)
    const card = await page.locator(SELECTORS.cardFallback).first();
    const box = await card.boundingBox();
    expect(box).toBeTruthy();

    const startX = box!.x + box!.width / 2;
    const startY = box!.y + box!.height / 2;

    // Get initial transform
    const initialTransform = await card.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    console.log('Initial transform:', initialTransform);

    // Start drag
    await page.mouse.move(startX, startY);
    await page.mouse.down();

    // Move 50px to the right
    await page.mouse.move(startX + 50, startY, { steps: 5 });

    // Check transform during drag
    const midDragTransform = await card.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    console.log('Mid-drag transform:', midDragTransform);

    // The transform should have changed from initial (should include translateX)
    expect(midDragTransform).not.toBe(initialTransform);
    expect(midDragTransform).not.toBe('none');
    expect(midDragTransform).toContain('matrix');

    // Release
    await page.mouse.up();

    // Wait for spring back animation to complete
    // Use polling approach to avoid serialization issues
    const startTime = Date.now();
    const timeout = 1000;
    while (Date.now() - startTime < timeout) {
      const currentTransform = await card.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      if (currentTransform === 'none' || currentTransform === initialTransform) {
        break;
      }
      await page.waitForTimeout(50);
    }
  });

  test('card tracks drag position smoothly', async ({ page }) => {
    // Navigate to playing stage using shared helper
    await navigateToPlaying(page);

    const card = await page.locator(SELECTORS.cardFallback).first();
    const box = await card.boundingBox();
    expect(box).toBeTruthy();

    const startX = box!.x + box!.width / 2;
    const startY = box!.y + box!.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();

    // Drag in steps and check transform updates
    const transforms = [];
    for (let i = 0; i <= 5; i++) {
      await page.mouse.move(startX + i * 10, startY);
      // Use small delay instead of hard-coded timeout
      await page.waitForTimeout(50);
      const transform = await card.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      transforms.push(transform);
    }

    await page.mouse.up();

    // All transforms should be different (card is moving)
    const uniqueTransforms = new Set(transforms);
    console.log('Unique transforms during drag:', uniqueTransforms.size);
    expect(uniqueTransforms.size).toBeGreaterThan(1);

    // Wait for spring back animation
    // Use polling approach to avoid serialization issues
    const startTime = Date.now();
    const timeout = 1000;
    while (Date.now() - startTime < timeout) {
      const currentTransform = await card.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      if (currentTransform === 'none') {
        break;
      }
      await page.waitForTimeout(50);
    }
  });
});
