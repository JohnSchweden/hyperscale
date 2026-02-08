import { test, expect, Page } from '@playwright/test';
import { navigateToPlaying } from './helpers/navigation';
import { SELECTORS } from './helpers/selectors';

test.use({ baseURL: 'http://localhost:3004' });

/**
 * Helper to perform a drag gesture on the current card without releasing
 */
async function performDragWithoutRelease(
  page: Page,
  distance: number = 120
): Promise<{ card: Awaited<ReturnType<typeof page.locator>>, startX: number; startY: number }> {
  const card = await page.locator(SELECTORS.cardFallback).first();
  const box = await card.boundingBox();
  expect(box).not.toBeNull();
  
  const startX = box!.x + box!.width / 2;
  const startY = box!.y + box!.height / 2;
  
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + distance, startY, { steps: 10 });
  
  return { card, startX, startY };
}

/**
 * Helper to release the current drag
 */
async function releaseMouseDrag(page: Page): Promise<void> {
  await page.mouse.up();
}

test.describe('Swipe Consistency', () => {
  test('first and second swipe both wait for release after threshold', async ({ page }) => {
    await navigateToPlaying(page);
    
    // === FIRST SWIPE ===
    console.log('=== Testing First Swipe ===');
    
    const { card: firstCard } = await performDragWithoutRelease(page, 120);
    
    // Wait while dragging
    await page.waitForTimeout(500);
    
    // Check if card is still visible (not exited yet)
    const firstSwipeOpacity = await firstCard.evaluate(el => {
      return window.getComputedStyle(el).opacity;
    });
    console.log('First swipe - opacity after 500ms (still dragging):', firstSwipeOpacity);
    
    // Card should still be visible (not exited)
    expect(parseFloat(firstSwipeOpacity)).toBeGreaterThan(0.5);
    
    // Release
    await releaseMouseDrag(page);
    
    // Wait for exit to start
    await page.waitForTimeout(100);
    
    // Card should now be exiting
    const firstSwipeExitOpacity = await firstCard.evaluate(el => {
      return window.getComputedStyle(el).opacity;
    });
    console.log('First swipe - opacity after release:', firstSwipeExitOpacity);
    
    // Wait for first swipe to complete
    await page.waitForTimeout(1000);
    
    // === SECOND SWIPE ===
    console.log('=== Testing Second Swipe ===');
    
    const { card: secondCard } = await performDragWithoutRelease(page, 120);
    
    // Wait while dragging
    await page.waitForTimeout(500);
    
    // Check if card is still visible (not exited yet)
    const secondSwipeOpacity = await secondCard.evaluate(el => {
      return window.getComputedStyle(el).opacity;
    });
    console.log('Second swipe - opacity after 500ms (still dragging):', secondSwipeOpacity);
    
    // Card should still be visible (not exited) - same as first swipe
    expect(parseFloat(secondSwipeOpacity)).toBeGreaterThan(0.5);
    
    // Release
    await releaseMouseDrag(page);
    
    // Wait for exit to start
    await page.waitForTimeout(100);
    
    // Card should now be exiting
    const secondSwipeExitOpacity = await secondCard.evaluate(el => {
      return window.getComputedStyle(el).opacity;
    });
    console.log('Second swipe - opacity after release:', secondSwipeExitOpacity);
  });
  
  test('both swipes have consistent behavior', async ({ page }) => {
    await navigateToPlaying(page);
    
    const results = [];
    
    // Test two swipes
    for (let i = 0; i < 2; i++) {
      console.log(`=== Swipe ${i + 1} ===`);
      
      const { card } = await performDragWithoutRelease(page, 120);
      
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
      await releaseMouseDrag(page);
      
      // Wait for completion
      await page.waitForTimeout(1000);
    }
    
    // Both swipes should behave the same (no exit while dragging)
    expect(results[0].hasExitDirection).toBe(results[1].hasExitDirection);
    expect(results[0].opacity).toBeGreaterThan(0.5);
    expect(results[1].opacity).toBeGreaterThan(0.5);
  });
});
