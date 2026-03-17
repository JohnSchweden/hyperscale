import type { Page } from "@playwright/test";
import { ROLE_CARDS } from "../../data";
import { ROLE_LABELS } from "../../data/roles";
import { RoleType } from "../../types";
import { SELECTORS } from "./selectors";

/**
 * Navigate directly to the playing stage for a specific role using localStorage state injection.
 * Bypasses intro → boot → personality → role for faster test execution.
 *
 * @param page - Playwright Page object
 * @param role - RoleType to bootstrap (determines deck/cards)
 * @returns Promise that resolves when playing stage is visible
 */
export async function navigateToPlayingWithRoleFast(
	page: Page,
	role: RoleType,
): Promise<void> {
	await page.addInitScript((r: string) => {
		window.localStorage.setItem(
			"gameState",
			JSON.stringify({
				state: "playing",
				personality: "ROASTER",
				role: r,
			}),
		);
	}, role as string);

	await page.goto("/");

	try {
		await page
			.locator(SELECTORS.card)
			.first()
			.waitFor({ state: "visible", timeout: 5000 });
	} catch {
		console.warn("Fast navigation failed, falling back to full navigation");
		await navigateToPlaying(page, role);
		return;
	}
}

/**
 * Navigate directly to the playing stage using localStorage state injection.
 * Default role: SOFTWARE_ENGINEER (DEVELOPMENT deck).
 */
export async function navigateToPlayingFast(page: Page): Promise<void> {
	await navigateToPlayingWithRoleFast(page, RoleType.SOFTWARE_ENGINEER);
}

/**
 * Navigate directly to playing with a specific card as the first card (unshuffled deck).
 * Uses km-debug-state to bypass shuffling and ensure deterministic card order.
 * Useful for tests that need to interact with specific card buttons.
 *
 * @param page - Playwright Page object
 * @param role - RoleType to use (default: SOFTWARE_ENGINEER)
 * @param cardIndex - Index of the card to show first (default: 0)
 */
export async function navigateToPlayingWithCardAtIndex(
	page: Page,
	role: RoleType = RoleType.SOFTWARE_ENGINEER,
	cardIndex: number = 0,
): Promise<void> {
	// Use the debug state mechanism to set a complete game state
	// This bypasses the shuffling that happens in App.tsx during INITIALIZING → PLAYING transition
	const effectiveDeck = [...ROLE_CARDS[role]]; // Copy without shuffling
	await page.addInitScript(
		(stateStr: string) => {
			window.localStorage.setItem("km-debug-state", stateStr);
		},
		JSON.stringify({
			stage: "PLAYING",
			personality: "ROASTER",
			role: role,
			currentCardIndex: cardIndex,
			hype: 50,
			heat: 0,
			budget: 10000000,
			history: [],
			deathReason: null,
			deathType: null,
			unlockedEndings: [],
			bossFightAnswers: [],
			effectiveDeck: effectiveDeck,
		}),
	);

	await page.goto("/");

	await page
		.locator(SELECTORS.card)
		.first()
		.waitFor({ state: "visible", timeout: 5000 });
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
 * @param role - RoleType to select (default: SOFTWARE_ENGINEER)
 */
export async function navigateToPlaying(
	page: Page,
	role: RoleType = RoleType.SOFTWARE_ENGINEER,
): Promise<void> {
	// Go to home
	await page.goto("/");
	await page
		.locator(SELECTORS.bootButton)
		.or(page.locator(SELECTORS.bootButtonFallback))
		.first()
		.waitFor({ state: "visible", timeout: 5000 });

	// Click Boot System
	const bootButton = page
		.locator(SELECTORS.bootButton)
		.or(page.locator(SELECTORS.bootButtonFallback));
	await bootButton.click();

	// Click personality (V.E.R.A)
	const personalityButton = page.locator('button:has-text("V.E.R.A")');
	await personalityButton.waitFor({ state: "visible" });
	await personalityButton.click();

	// Click role
	const roleLabel = ROLE_LABELS[role];
	const roleButton = page.locator(`button:has-text("${roleLabel}")`);
	await roleButton.waitFor({ state: "visible" });
	await roleButton.click();

	// Wait for countdown to complete and game screen to load
	// DEVELOPMENT deck has 2 cards with different buttons due to shuffling
	await page
		.locator('button:has-text("Debug")')
		.or(page.locator('button:has-text("Ignore")'))
		.waitFor({ state: "visible", timeout: 10000 });
	await page
		.locator(SELECTORS.card)
		.first()
		.waitFor({ state: "visible", timeout: 5000 });
}

/**
 * Navigate to personality select stage (Boot clicked, personality buttons visible)
 */
export async function navigateToPersonalitySelect(page: Page): Promise<void> {
	await page.goto("/");
	const bootButton = page
		.locator(SELECTORS.bootButton)
		.or(page.locator(SELECTORS.bootButtonFallback));
	await bootButton.click();
	await page
		.locator('button:has-text("V.E.R.A")')
		.waitFor({ state: "visible" });
}

/**
 * Navigate to role select stage (Boot + personality clicked, role buttons visible)
 */
export async function navigateToRoleSelect(page: Page): Promise<void> {
	await page.goto("/");
	const bootButton = page
		.locator(SELECTORS.bootButton)
		.or(page.locator(SELECTORS.bootButtonFallback));
	await bootButton.click();
	const personalityButton = page.locator('button:has-text("V.E.R.A")');
	await personalityButton.waitFor({ state: "visible" });
	await personalityButton.click();
	const roleButton = page.locator('button:has-text("Software Engineer")');
	await roleButton.waitFor({ state: "visible" });
}

/**
 * Navigate directly to role select using localStorage state injection.
 * Bypasses intro and personality selection for faster tests.
 */
export async function navigateToRoleSelectFast(page: Page): Promise<void> {
	await page.addInitScript(() => {
		window.localStorage.setItem(
			"gameState",
			JSON.stringify({
				state: "role_select",
				personality: "ROASTER",
			}),
		);
	});
	await page.goto("/");
	await page
		.locator('button:has-text("Software Engineer")')
		.first()
		.waitFor({ state: "visible", timeout: 5000 });
}

/**
 * From playing stage, swipe through DEVELOPMENT deck (2 cards) to reach boss fight.
 */
async function navigateToBossFightFromPlaying(page: Page): Promise<void> {
	await page.locator(SELECTORS.debugButton).click({ force: true });
	await page
		.locator(SELECTORS.nextTicketButton)
		.waitFor({ state: "visible", timeout: 5000 });
	await page.locator(SELECTORS.nextTicketButton).click({ force: true });
	await page.locator('button:has-text("Ignore")').click({ force: true });
	await page
		.locator(SELECTORS.nextTicketButton)
		.waitFor({ state: "visible", timeout: 5000 });
	await page.locator(SELECTORS.nextTicketButton).click({ force: true });
	await page.waitForSelector("text=Boss fight", { timeout: 8000 });
}

/**
 * Navigate to boss fight stage. Uses full navigation flow.
 */
export async function navigateToBossFight(page: Page): Promise<void> {
	await navigateToPlaying(page);
	await navigateToBossFightFromPlaying(page);
}

/**
 * Navigate to boss fight from already-loaded playing stage (uses fast path).
 */
export async function navigateToBossFightFast(page: Page): Promise<void> {
	await navigateToPlayingFast(page);
	await navigateToBossFightFromPlaying(page);
}

/**
 * Navigate to GAME_OVER via Tech/AI Consultant → Launch → bankrupt.
 */
export async function navigateToGameOver(page: Page): Promise<void> {
	await page.goto("/");
	const bootButton = page
		.locator(SELECTORS.bootButton)
		.or(page.locator(SELECTORS.bootButtonFallback));
	await bootButton.click();
	const personalityButton = page.locator('button:has-text("V.E.R.A")');
	await personalityButton.waitFor({ state: "visible" });
	await personalityButton.click();
	const roleButton = page.locator('button:has-text("Tech/AI Consultant")');
	await roleButton.waitFor({ state: "visible" });
	await roleButton.click();
	await page
		.locator('button:has-text("Launch")')
		.waitFor({ state: "visible", timeout: 6000 });
	await page.locator('button:has-text("Launch")').click({ force: true });
	await page
		.locator(SELECTORS.nextTicketButton)
		.waitFor({ state: "visible", timeout: 5000 });
	await page.locator(SELECTORS.nextTicketButton).click({ force: true });
	await page.waitForSelector("text=Liquidated", { timeout: 5000 });
}

/**
 * Navigate directly to GAME_OVER (BANKRUPT) via fast path.
 * Uses Tech/AI Consultant + Launch to exhaust budget.
 */
export async function navigateToGameOverFast(page: Page): Promise<void> {
	await navigateToPlayingWithRoleFast(page, RoleType.TECH_AI_CONSULTANT);
	await page
		.locator('button:has-text("Launch")')
		.waitFor({ state: "visible", timeout: 6000 });
	await page.locator('button:has-text("Launch")').click({ force: true });
	await page
		.locator(SELECTORS.nextTicketButton)
		.waitFor({ state: "visible", timeout: 5000 });
	await page.locator(SELECTORS.nextTicketButton).click({ force: true });
	await page.waitForSelector("text=Liquidated", { timeout: 5000 });
}

async function getWithFallback(
	page: Page,
	primary: string,
	fallback: string,
): Promise<ReturnType<Page["locator"]>> {
	const primaryLoc = page.locator(primary);
	return (await primaryLoc.count()) > 0
		? primaryLoc.first()
		: page.locator(fallback).first();
}

/** Get the card element, with fallback selector. */
export async function getCard(
	page: Page,
): Promise<ReturnType<Page["locator"]>> {
	return getWithFallback(page, SELECTORS.card, SELECTORS.cardFallback);
}

/** Get left swipe button, with fallback selector. */
export async function getLeftButton(
	page: Page,
): Promise<ReturnType<Page["locator"]>> {
	return getWithFallback(
		page,
		SELECTORS.leftButton,
		SELECTORS.leftButtonFallback,
	);
}

/** Get right swipe button, with fallback selector. */
export async function getRightButton(
	page: Page,
): Promise<ReturnType<Page["locator"]>> {
	return getWithFallback(
		page,
		SELECTORS.rightButton,
		SELECTORS.rightButtonFallback,
	);
}
