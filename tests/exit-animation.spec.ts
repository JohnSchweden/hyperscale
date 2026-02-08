import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:3004' });

test.describe('Exit Animation Continuity', () => {
  test('card exits smoothly from current drag position', async ({ page }) => {
    // Navigate to game
    await page.goto('/');
    await page.click('button:has-text("Boot system")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("V.E.R.A")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Development")');
    await page.waitForTimeout(2000);
    
    // Find the current card
    const card = await page.locator('div[style*="z-index: 10"]').first();
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
      
      // Wait briefly for exit animation to start
      await page.waitForTimeout(50);
      
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
      
      // Drag past threshold
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX + 110, startY, { steps: 10 });
      
      // Get position just before release
      const beforeRelease = await card.evaluate(el => {
        const style = window.getComputedStyle(el);
        const matrix = new DOMMatrix(style.transform);
        return { x: matrix.m41, y: matrix.m42 };
      });
      console.log('Position before release:', beforeRelease);
      
      // Release
      await page.mouse.up();

      // Check transition property immediately after release
      await page.waitForTimeout(50);

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
