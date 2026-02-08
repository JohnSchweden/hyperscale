import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:3004' });

test.describe('Swipe Consistency', () => {
  test('first and second swipe both wait for release after threshold', async ({ page }) => {
    // Navigate to game
    await page.goto('/');
    await page.click('button:has-text("Boot system")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("V.E.R.A")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Development")');
    await page.waitForTimeout(2000);
    
    // === FIRST SWIPE ===
    console.log('=== Testing First Swipe ===');
    
    let card = await page.locator('div[style*="z-index: 10"]').first();
    let box = await card.boundingBox();
    expect(box).not.toBeNull();
    
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;
      
      // Start drag
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      
      // Drag past threshold but DON'T release
      await page.mouse.move(startX + 120, startY, { steps: 10 });
      
      // Wait a bit
      await page.waitForTimeout(500);
      
      // Check if card is still visible (not exited yet)
      const firstSwipeOpacity = await card.evaluate(el => {
        return window.getComputedStyle(el).opacity;
      });
      console.log('First swipe - opacity after 500ms (still dragging):', firstSwipeOpacity);
      
      // Card should still be visible (not exited)
      expect(parseFloat(firstSwipeOpacity)).toBeGreaterThan(0.5);
      
      // Now release
      await page.mouse.up();
      
      // Wait for exit to start
      await page.waitForTimeout(100);
      
      // Card should now be exiting
      const firstSwipeExitOpacity = await card.evaluate(el => {
        return window.getComputedStyle(el).opacity;
      });
      console.log('First swipe - opacity after release:', firstSwipeExitOpacity);
      
      // Wait for first swipe to complete
      await page.waitForTimeout(1000);
    }
    
    // === SECOND SWIPE ===
    console.log('=== Testing Second Swipe ===');
    
    card = await page.locator('div[style*="z-index: 10"]').first();
    box = await card.boundingBox();
    
    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;
      
      // Start drag
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      
      // Drag past threshold but DON'T release
      await page.mouse.move(startX + 120, startY, { steps: 10 });
      
      // Wait a bit
      await page.waitForTimeout(500);
      
      // Check if card is still visible (not exited yet)
      const secondSwipeOpacity = await card.evaluate(el => {
        return window.getComputedStyle(el).opacity;
      });
      console.log('Second swipe - opacity after 500ms (still dragging):', secondSwipeOpacity);
      
      // Card should still be visible (not exited) - same as first swipe
      expect(parseFloat(secondSwipeOpacity)).toBeGreaterThan(0.5);
      
      // Now release
      await page.mouse.up();
      
      // Wait for exit to start
      await page.waitForTimeout(100);
      
      // Card should now be exiting
      const secondSwipeExitOpacity = await card.evaluate(el => {
        return window.getComputedStyle(el).opacity;
      });
      console.log('Second swipe - opacity after release:', secondSwipeExitOpacity);
    }
  });
  
  test('both swipes have consistent behavior', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Boot system")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("V.E.R.A")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Development")');
    await page.waitForTimeout(2000);
    
    const results = [];
    
    // Test two swipes
    for (let i = 0; i < 2; i++) {
      console.log(`=== Swipe ${i + 1} ===`);
      
      const card = await page.locator('div[style*="z-index: 10"]').first();
      const box = await card.boundingBox();
      
      if (box) {
        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;
        
        // Start drag
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        
        // Drag past threshold
        await page.mouse.move(startX + 120, startY, { steps: 10 });
        
        // Check state while still holding
        await page.waitForTimeout(200);
        
        const hasExitDirection = await card.evaluate(el => {
          return el.classList.contains('swipe-exit-left') || el.classList.contains('swipe-exit-right');
        });
        
        const opacity = await card.evaluate(el => {
          return window.getComputedStyle(el).opacity;
        });
        
        console.log(`Swipe ${i + 1} - Has exit class while dragging:`, hasExitDirection);
        console.log(`Swipe ${i + 1} - Opacity while dragging:`, opacity);
        
        results.push({
          swipe: i + 1,
          hasExitDirection,
          opacity: parseFloat(opacity)
        });
        
        // Release
        await page.mouse.up();
        
        // Wait for completion
        await page.waitForTimeout(1000);
      }
    }
    
    // Both swipes should behave the same (no exit while dragging)
    expect(results[0].hasExitDirection).toBe(results[1].hasExitDirection);
    expect(results[0].opacity).toBeGreaterThan(0.5);
    expect(results[1].opacity).toBeGreaterThan(0.5);
  });
});
