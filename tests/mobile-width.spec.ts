import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:3004' });

test.describe('Mobile Card Width', () => {
  test('card fills viewport width on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    // Navigate to game
    await page.goto('/');
    await page.click('button:has-text("Boot system")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("V.E.R.A")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Development")');
    await page.waitForTimeout(2000);
    
    // Find card container
    const cardContainer = await page.locator('.relative.flex-1.w-full').first();
    const containerBox = await cardContainer.boundingBox();
    
    // Find actual card
    const card = await page.locator('[class*="bg-slate-900/90"]').first();
    const cardBox = await card.boundingBox();
    
    console.log('Container width:', containerBox?.width);
    console.log('Card width:', cardBox?.width);
    console.log('Viewport width: 375');
    
    // Card should be close to container width (allowing for small differences)
    expect(cardBox?.width).toBeGreaterThan(300); // Should be reasonably wide on mobile
    expect(cardBox?.width).toBeLessThanOrEqual(375); // But not wider than viewport
    
    // Card should fill most of the container (allowing for small pixel differences)
    if (containerBox && cardBox) {
      expect(cardBox.width).toBeGreaterThanOrEqual(Math.floor(containerBox.width * 0.94));
    }
  });
  
  test('card is properly sized on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    await page.click('button:has-text("Boot system")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("V.E.R.A")');
    await page.waitForTimeout(300);
    await page.click('button:has-text("Development")');
    await page.waitForTimeout(2000);
    
    const card = await page.locator('[class*="bg-slate-900/90"]').first();
    const cardBox = await card.boundingBox();
    
    console.log('Card width on tablet:', cardBox?.width);
    
    // On tablet, card should have max-width constraint
    expect(cardBox?.width).toBeGreaterThan(400);
  });
});
