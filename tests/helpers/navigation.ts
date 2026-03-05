import type { Page } from "@playwright/test";
import { SELECTORS } from "./selectors";

/**
 * Navigate directly to the playing stage using localStorage state injection.
 * This bypasses the 4-step navigation flow (intro → boot → personality → role)
 * for faster test execution.
 *
 * @param page - Playwright Page object
 * @returns Promise that resolves when playing stage is visible
 */
export async function navigateToPlayingFast(page: Page): Promise<void> {
	// Set initial game state in localStorage to bypass intro flow
	await page.addInitScript(() => {
		window.localStorage.setItem(
			"gameState",
			JSON.stringify({
				state: "playing",
				personality: "vera",
				role: "development",
			}),
		);
	});

	// Navigate to home - the app will detect the state and go directly to playing
	await page.goto("/");

	// Wait for playing stage to be visible (Debug button appears)
	try {
		await page
			.locator('button:has-text("Debug")')
			.waitFor({ state: "visible", timeout: 3000 });
	} catch {
		// Fast approach failed, fall back to full navigation
		console.warn("Fast navigation failed, falling back to full navigation");
		await navigateToPlaying(page);
	}

	await page.waitForLoadState("networkidle");
}

/**
 * Returns a configuration marker for tests that should use test.beforeAll pattern.
 *
 * This is a documentation/convention helper. Actual context reuse comes from
 * Playwright config (reuseExistingBrowser: true in projects).
 *
 * Usage:
 * ```typescript
 * test.describe('Static CSS tests', () => {
 *   test.beforeAll(async ({ page }) => {
 *     await navigateToPlayingFast(page);
 *   });
 *
 *   test('CSS class exists', async ({ page }) => { ... });
 * });
 * ```
 */
export function getStatefulPage(page: Page): Page {
	// Just return the page - the marker is for documentation purposes
	// Tests using beforeAll will share browser context via Playwright config
	return page;
}

/**
 * Navigate from intro to the playing stage
 * Waits for all stages to load properly before returning
 */
export async function navigateToPlaying(page: Page): Promise<void> {
	// Go to home
	await page.goto("/");
	await page.waitForLoadState("networkidle");

	// Click Boot System
	const bootButton = page
		.locator(SELECTORS.bootButton)
		.or(page.locator(SELECTORS.bootButtonFallback));
	await bootButton.click();
	await page.waitForTimeout(300);

	// Click personality (V.E.R.A)
	const personalityButton = page.locator('button:has-text("V.E.R.A")');
	await personalityButton.waitFor({ state: "visible" });
	await personalityButton.click();
	await page.waitForTimeout(300);

	// Click role (Development)
	const roleButton = page.locator('button:has-text("Development")');
	await roleButton.waitFor({ state: "visible" });
	await roleButton.click();

	// Wait for countdown to complete and game screen to load
	await page
		.locator('button:has-text("Debug")')
		.waitFor({ state: "visible", timeout: 10000 });
	await page.waitForLoadState("networkidle");
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
