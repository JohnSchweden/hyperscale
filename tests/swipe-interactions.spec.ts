import { test, expect } from '@playwright/test';
import { navigateToPlaying, getCard } from './helpers/navigation';
import { SELECTORS } from './helpers/selectors';

test.use({ baseURL: 'http://localhost:3000' });

test.describe('Phase 2 Swipe Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToPlaying(page);
  });

  test('spring physics CSS class exists', async ({ page }) => {
    // Check if spring-snap-back class is defined
    const hasSpringClass = await page.evaluate(() => {
      const styles = document.styleSheets;
      for (let sheet of styles) {
        try {
          const rules = sheet.cssRules;
          for (let rule of rules) {
            if (rule.cssText && rule.cssText.includes('.spring-snap-back')) {
              return rule.cssText.includes('cubic-bezier(0.34, 1.56, 0.64, 1)');
            }
          }
        } catch (e) {
          // Cross-origin stylesheets might throw
        }
      }
      return false;
    });
    
    expect(hasSpringClass).toBe(true);
  });

  test('exit animation keyframes exist', async ({ page }) => {
    // Check if exit animations are properly defined
    const hasExitAnimations = await page.evaluate(() => {
      const styles = document.styleSheets;
      let foundLeft = false;
      let foundRight = false;
      
      for (let sheet of styles) {
        try {
          const rules = sheet.cssRules;
          for (let rule of rules) {
            if (rule.cssText) {
              if (rule.cssText.includes('swipeExitLeft')) {
                foundLeft = rule.cssText.includes('-120%') && rule.cssText.includes('-25deg');
              }
              if (rule.cssText.includes('swipeExitRight')) {
                foundRight = rule.cssText.includes('120%') && rule.cssText.includes('25deg');
              }
            }
          }
        } catch (e) {
          // Cross-origin stylesheets might throw
        }
      }
      
      return { left: foundLeft, right: foundRight };
    });
    
    expect(hasExitAnimations.left).toBe(true);
    expect(hasExitAnimations.right).toBe(true);
  });

  test('card stack renders next card', async ({ page }) => {
    // Check if next card element exists with correct styles
    const cardStackInfo = await page.evaluate(() => {
      const cardContainer = document.querySelector('[data-testid="incident-card-container"]');
      if (!cardContainer) return null;
      
      // Check for next card (should be first child with absolute positioning)
      const children = cardContainer.children;
      if (children.length < 2) return null;
      
      const nextCard = children[0] as HTMLElement;
      const currentCard = children[1] as HTMLElement;
      
      const nextCardStyle = window.getComputedStyle(nextCard);
      
      return {
        hasNextCard: nextCard.style.position === 'absolute' || nextCardStyle.position === 'absolute',
        nextCardOpacity: nextCardStyle.opacity,
        nextCardTransform: nextCardStyle.transform,
      };
    });
    
    expect(cardStackInfo).not.toBeNull();
    expect(cardStackInfo?.hasNextCard).toBe(true);
    expect(cardStackInfo?.nextCardOpacity).toBe('0.6');
    expect(cardStackInfo?.nextCardTransform).toContain('0.95');
  });

  test('keyboard navigation works with arrow keys', async ({ page }) => {
    const card = await getCard(page);
    await expect(card).toBeVisible();

    await page.keyboard.press('ArrowRight');

    // ArrowRight triggers swipe; feedback dialog appears on swipe
    const feedbackDialog = page.locator(SELECTORS.feedbackDialog).or(page.locator(SELECTORS.feedbackDialogFallback));
    await expect(feedbackDialog).toBeVisible({ timeout: 3000 });
  });

  test('swipe preview text appears on drag', async ({ page }) => {
    const card = await getCard(page);
    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 60, startY, { steps: 10 });

    // Drag preview is the absolute-positioned label (e.g. PASTE) inside the card, not the static "Swipe left/right"
    const previewLabel = card.locator('div.absolute.font-black.tracking-tighter');
    await expect(previewLabel).toBeVisible({ timeout: 500 });

    const previewText = await previewLabel.textContent();
    expect(previewText).not.toBeNull();
    expect(previewText!.length).toBeGreaterThan(0);

    await page.mouse.up();
    await expect(previewLabel).toBeHidden({ timeout: 1000 });
  });

  test('card exit animation plays on threshold cross', async ({ page }) => {
    const card = await getCard(page);
    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 110, startY, { steps: 10 });
    await page.mouse.up();

    const feedbackDialog = page.locator(SELECTORS.feedbackDialog).or(page.locator(SELECTORS.feedbackDialogFallback));
    await expect(feedbackDialog).toBeVisible({ timeout: 2000 });
  });

  test('will-change property is set on animated elements', async ({ page }) => {
    const hasWillChange = await page.evaluate(() => {
      const styles = document.styleSheets;
      for (let sheet of styles) {
        try {
          const rules = sheet.cssRules;
          for (let rule of rules) {
            if (rule.cssText && rule.cssText.includes('will-change')) {
              if (rule.cssText.includes('transform') && rule.cssText.includes('opacity')) {
                return true;
              }
            }
          }
        } catch (e) {
          // Cross-origin stylesheets might throw
        }
      }
      return false;
    });
    
    expect(hasWillChange).toBe(true);
  });
});
