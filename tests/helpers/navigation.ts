import { Page } from '@playwright/test';
import { SELECTORS } from './selectors';

/**
 * Navigate from intro to the playing stage
 * Waits for all stages to load properly before returning
 */
export async function navigateToPlaying(page: Page): Promise<void> {
  // Go to home
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Click Boot System
  const bootButton = page.locator(SELECTORS.bootButton).or(page.locator(SELECTORS.bootButtonFallback));
  await bootButton.click();
  await page.waitForTimeout(300);

  // Click personality (V.E.R.A)
  const personalityButton = page.locator('button:has-text("V.E.R.A")');
  await personalityButton.waitFor({ state: 'visible' });
  await personalityButton.click();
  await page.waitForTimeout(300);

  // Click role (Development)
  const roleButton = page.locator('button:has-text("Development")');
  await roleButton.waitFor({ state: 'visible' });
  await roleButton.click();

  // Wait for countdown to complete and game screen to load
  await page.locator('button:has-text("Debug")').waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForLoadState('networkidle');
}

/**
 * Get the card element, with fallback selector
 */
export async function getCard(page: Page) {
  const cardSelector = page.locator(SELECTORS.card);
  const cardCount = await cardSelector.count();

  if (cardCount > 0) {
    return cardSelector.first();
  }
  // Fallback to z-index selector
  return page.locator(SELECTORS.cardFallback).first();
}

/**
 * Get left swipe button, with fallback selector
 */
export async function getLeftButton(page: Page) {
  const leftSelector = page.locator(SELECTORS.leftButton);
  const leftCount = await leftSelector.count();

  if (leftCount > 0) {
    return leftSelector.first();
  }
  // Fallback to text selector
  return page.locator(SELECTORS.leftButtonFallback).first();
}

/**
 * Get right swipe button, with fallback selector
 */
export async function getRightButton(page: Page) {
  const rightSelector = page.locator(SELECTORS.rightButton);
  const rightCount = await rightSelector.count();

  if (rightCount > 0) {
    return rightSelector.first();
  }
  // Fallback to text selector
  return page.locator(SELECTORS.rightButtonFallback).first();
}
