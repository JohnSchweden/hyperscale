import { test, expect } from '@playwright/test';
import { navigateToPlaying } from './helpers/navigation';
import { SELECTORS } from './helpers/selectors';

test.use({ baseURL: 'http://localhost:3000' });

test.describe('Spring Snap-Back', () => {
  test('card snaps back smoothly when released under threshold', async ({ page }) => {
    await navigateToPlaying(page);
    
    // Find the current card
    const card = page.locator(SELECTORS.cardFallback).first();
    expect(card).toBeTruthy();
    
    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    
    if (!box) return;
    
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    
    // Get initial transform
    const initialTransform = await card.evaluate(el => {
      return window.getComputedStyle(el).transform;
    });
    console.log('Initial transform:', initialTransform);
    
    // Start drag
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    
    // Move 60px to the right (under threshold)
    await page.mouse.move(startX + 60, startY, { steps: 5 });
    
    // Check transform during drag
    const dragTransform = await card.evaluate(el => {
      return window.getComputedStyle(el).transform;
    });
    console.log('During drag transform:', dragTransform);
    
    // Card should be translated
    expect(dragTransform).not.toBe(initialTransform);
    expect(dragTransform).toContain('matrix');
    
    // Release - should trigger spring snap-back
    await page.mouse.up();
    
    // Check transition property immediately after release
    const transition = await card.evaluate(el => {
      return window.getComputedStyle(el).transition;
    });
    console.log('Transition after release:', transition);
    
    // Should have the spring physics transition (0.55s cubic-bezier)
    expect(transition).toContain('0.55s');
    expect(transition).toContain('cubic-bezier(0.34, 1.56, 0.64, 1)');
    
    // Wait for spring animation to complete (0.55s + buffer)
    // Poll the card's transform to detect when animation completes
    await page.waitForFunction(
      () => {
        const el = document.querySelector('div[style*="z-index: 10"]') as HTMLElement;
        if (!el) return false;
        const transform = window.getComputedStyle(el).transform;
        // Check if transform is back to identity or near it
        return /matrix\(1,\s*0,\s*0,\s*1,\s*0,\s*0\)/.test(transform) ||
               /matrix\(1\s+0\s+0\s+1\s+0\s+0\)/.test(transform);
      },
      { timeout: 1000 }
    );
    
    // Card should be back to center
    const finalTransform = await card.evaluate(el => {
      return window.getComputedStyle(el).transform;
    });
    console.log('Final transform:', finalTransform);
    
    // Should be back to identity or near it (matrix(1, 0, 0, 1, 0, 0))
    expect(finalTransform).toContain('matrix');
  });
  
  test('ticket-transition is not applied after drag', async ({ page }) => {
    await navigateToPlaying(page);
    
    const card = page.locator(SELECTORS.cardFallback).first();
    expect(card).toBeTruthy();
    
    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    
    if (!box) return;
    
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    
    // Drag and release under threshold
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 50, startY, { steps: 5 });
    await page.mouse.up();
    
    // Wait briefly for any state updates
    await page.waitForTimeout(50);
    
    // ticket-transition should NOT be applied
    const hasTicketTransition = await card.evaluate(el => {
      return el.classList.contains('ticket-transition');
    });
    console.log('Has ticket-transition class:', hasTicketTransition);
    expect(hasTicketTransition).toBe(false);
    
    // Wait for spring animation to complete (0.55s + buffer)
    // Poll the card's transform to detect when animation completes
    await page.waitForFunction(
      () => {
        const el = document.querySelector('div[style*="z-index: 10"]') as HTMLElement;
        if (!el) return false;
        const transform = window.getComputedStyle(el).transform;
        // Check if transform is back to identity or near it
        return /matrix\(1,\s*0,\s*0,\s*1,\s*0,\s*0\)/.test(transform) ||
               /matrix\(1\s+0\s+0\s+1\s+0\s+0\)/.test(transform);
      },
      { timeout: 1000 }
    );
    
    // Still should not have ticket-transition
    const hasTicketTransitionAfter = await card.evaluate(el => {
      return el.classList.contains('ticket-transition');
    });
    expect(hasTicketTransitionAfter).toBe(false);
  });
});
