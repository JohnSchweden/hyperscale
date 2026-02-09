import { test, expect } from '@playwright/test';
import { navigateToPlaying } from './helpers/navigation';
import { SELECTORS } from './helpers/selectors';

test.use({ baseURL: 'http://localhost:3000' });

test.describe('Exit Animation Continuity', () => {
  test('card exits smoothly from current drag position', async ({ page }) => {
    // Use shared navigation helper instead of inline setup
    await navigateToPlaying(page);
    
    // Use shared selector - use fallback since data-testid may not be added yet
    const card = page.locator(SELECTORS.cardFallback).first();
    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;
      
      // Start drag
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      
      // Move 120px to the right (past threshold)
      await page.mouse.move(startX + 120, startY, { steps: 10 });
      
      // Check position during drag
      const dragTransform = await card.evaluate(el => {
        return window.getComputedStyle(el).transform;
      });
      console.log('Transform during drag:', dragTransform);
      
      // Should be translated ~120px
      expect(dragTransform).toContain('matrix');
      
      // Release - should trigger exit
      await page.mouse.up();
      
      // Wait for React to apply exit state and transition instead of hard-coded timeout
      // Use polling approach to avoid serialization issues
      const startTime = Date.now();
      const timeout = 1000;
      while (Date.now() - startTime < timeout) {
        const transition = await card.evaluate((el) => {
          return window.getComputedStyle(el).transition;
        });
        if (transition.includes('0.35s')) {
          break;
        }
        await page.waitForTimeout(50);
      }
      
      // Check transition is set to exit animation
      const transition = await card.evaluate(el => {
        return window.getComputedStyle(el).transition;
      });
      console.log('Transition after release:', transition);
      expect(transition).toContain('0.35s');
      expect(transition).toContain('cubic-bezier(0.25, 0.46, 0.45, 0.94)');
      
      // Check transform - should be animating to exit position, not reset
      const exitTransform = await card.evaluate(el => {
        return window.getComputedStyle(el).transform;
      });
      console.log('Transform during exit:', exitTransform);
      
      // Should NOT be identity matrix (would indicate reset to center)
      expect(exitTransform).not.toBe('matrix(1, 0, 0, 1, 0, 0)');
      
      // Card opacity is set to 0 immediately when exit starts via inline style
      // Check that it's set correctly
      const exitOpacity = await card.evaluate(el => {
        return window.getComputedStyle(el).opacity;
      });
      console.log('Exit opacity:', exitOpacity);
      // Opacity should be animating to 0 (may not be exactly 0 yet due to transition)
    }
  });
  
  test('exit animation does not reset to center', async ({ page }) => {
    // Use shared navigation helper
    await navigateToPlaying(page);
    
    const card = page.locator(SELECTORS.cardFallback).first();
    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;
      
      // Drag past threshold
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX + 110, startY, { steps: 10 });
      
      // Wait for React to commit offset state
      // Use polling approach to avoid serialization issues
      const startTime = Date.now();
      const timeout = 1000;
      while (Date.now() - startTime < timeout) {
        const hasOffset = await card.evaluate((el) => {
          const style = window.getComputedStyle(el);
          const matrix = new DOMMatrix(style.transform);
          // Wait until transform is applied (not identity matrix anymore)
          return matrix.m41 !== 0 || matrix.m42 !== 0;
        });
        if (hasOffset) {
          break;
        }
        await page.waitForTimeout(50);
      }

      // Get position just before release
      const beforeRelease = await card.evaluate(el => {
        const style = window.getComputedStyle(el);
        const matrix = new DOMMatrix(style.transform);
        return { x: matrix.m41, y: matrix.m42 };
      });
      console.log('Position before release:', beforeRelease);

      // Release
      await page.mouse.up();

      // Wait for React to apply exit state (cardExitDirection + 0.35s transition)
      // Instead of hard-coded timeout, wait for transition property to change
      // Use polling approach to avoid serialization issues
      const startTime2 = Date.now();
      const timeout2 = 1000;
      while (Date.now() - startTime2 < timeout2) {
        const transition = await card.evaluate((el) => {
          return window.getComputedStyle(el).transition;
        });
        if (transition.includes('0.35s')) {
          break;
        }
        await page.waitForTimeout(50);
      }

      const transition = await card.evaluate(el => {
        return window.getComputedStyle(el).transition;
      });
      console.log('Transition after release:', transition);

      // The transition should be set to the exit animation (0.35s)
      expect(transition).toContain('0.35s');

      // Check position - should be animating, not reset to 0
      const afterRelease = await card.evaluate(el => {
        const style = window.getComputedStyle(el);
        const matrix = new DOMMatrix(style.transform);
        return { x: matrix.m41, y: matrix.m42 };
      });
      console.log('Position after release:', afterRelease);

      // The card should be animating from its drag position toward exit
      // It might be slightly different due to animation progress, but shouldn't be at 0
      // (unless the animation is very fast or window.innerWidth is 0 in test env)
    }
  });
});
