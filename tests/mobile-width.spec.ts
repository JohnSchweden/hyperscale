import { test, expect } from '@playwright/test';
import { navigateToPlaying, getCard } from './helpers/navigation';
import { SELECTORS } from './helpers/selectors';

test.use({ baseURL: 'http://localhost:3000' });

test.describe('Mobile Card Width', () => {
  // Reset viewport size after each test to avoid affecting other tests
  test.afterEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 }); // Reset to default
  });

  test('card fills viewport width on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    // Navigate to playing stage using shared helper
    await navigateToPlaying(page);
    
    // Find card container
    const cardContainer = page.getByTestId('incident-card-container');
    const containerBox = await cardContainer.boundingBox();
    
    // Find actual card using shared selector
    const card = await getCard(page);
    const cardBox = await card.boundingBox();
    
    console.log('Container width:', containerBox?.width);
    console.log('Card width:', cardBox?.width);
    console.log('Viewport width: 375');
    
    // Card should be close to container width (allowing for small differences)
    expect(cardBox?.width).toBeGreaterThan(300); // Should be reasonably wide on mobile
    expect(cardBox?.width).toBeLessThanOrEqual(375); // But not wider than viewport
    
    // Card should fill most of the container (allowing for small pixel differences)
    expect(containerBox).not.toBeNull();
    expect(cardBox).not.toBeNull();
    if (containerBox && cardBox) {
      expect(cardBox.width).toBeGreaterThanOrEqual(Math.floor(containerBox.width * 0.94));
    }
  });
  
  test('card is properly sized on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to playing stage using shared helper
    await navigateToPlaying(page);
    
    // Find card using shared selector
    const card = await getCard(page);
    const cardBox = await card.boundingBox();
    
    console.log('Card width on tablet:', cardBox?.width);
    
    // On tablet, card should have max-width constraint
    expect(cardBox?.width).toBeGreaterThan(400);
  });
});
