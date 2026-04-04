import type { Page } from "@playwright/test";
import { ROLE_CARDS } from "../../src/data";
import { ROLE_LABELS } from "../../src/data/roles";
import { RoleType } from "../../src/types";
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
		window.localStorage.removeItem("km-debug-state");
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
 * @param personality - Personality string for km-debug-state (default: ROASTER)
 */
export async function navigateToPlayingWithCardAtIndex(
	page: Page,
	role: RoleType = RoleType.SOFTWARE_ENGINEER,
	cardIndex: number = 0,
	personality: string = "ROASTER",
): Promise<void> {
	// Use the debug state mechanism to set a complete game state
	// This bypasses the shuffling that happens in App.tsx during INITIALIZING → PLAYING transition
	const effectiveDeck = [...ROLE_CARDS[role]]; // Copy without shuffling
	await page.addInitScript(
		(stateStr: string) => {
			window.localStorage.removeItem("gameState");
			window.localStorage.setItem("km-debug-state", stateStr);
		},
		JSON.stringify({
			stage: "PLAYING",
			personality,
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

/** Visible swipe labels must match one card in the role's deck (handles shuffle + deck changes). */
export async function assertSwipeLabelsBelongToRoleDeck(
	page: Page,
	role: RoleType,
): Promise<void> {
	await page
		.locator(SELECTORS.leftButton)
		.first()
		.waitFor({ state: "visible", timeout: 10000 });
	const leftText = (
		await page.locator(SELECTORS.leftButton).first().innerText()
	).trim();
	const rightText = (
		await page.locator(SELECTORS.rightButton).first().innerText()
	).trim();
	const deck = ROLE_CARDS[role];
	const ok = deck.some(
		(c) =>
			(c.onLeft.label === leftText && c.onRight.label === rightText) ||
			(c.onRight.label === leftText && c.onLeft.label === rightText),
	);
	if (!ok) {
		throw new Error(
			`Swipe labels [${leftText} | ${rightText}] should match a ${role} deck card`,
		);
	}
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
	await page
		.locator(SELECTORS.card)
		.first()
		.waitFor({ state: "visible", timeout: 10000 });
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
		window.localStorage.removeItem("km-debug-state");
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
 * From playing stage, swipe through current deck to reach boss fight.
 * NOTE: This assumes a short deck and is legacy-only; most tests should prefer
 * km-debug-state based helpers instead.
 */
async function navigateToBossFightFromPlaying(page: Page): Promise<void> {
	const maxSteps = 50;
	for (let i = 0; i < maxSteps; i++) {
		// If boss fight already visible, stop
		const bossVisible = await page
			.getByText("Boss fight")
			.isVisible()
			.catch(() => false);
		if (bossVisible) return;

		// If Next ticket is visible, click it
		const nextBtn = page.locator(SELECTORS.nextTicketButton);
		if (await nextBtn.isVisible().catch(() => false)) {
			await nextBtn.click({ force: true });
			await page.waitForTimeout(400);
			continue;
		}

		// Otherwise swipe right to advance the deck
		const rightBtn = await getRightButton(page);
		if (await rightBtn.isVisible().catch(() => false)) {
			await rightBtn.click({ force: true });
			await page.waitForTimeout(600);
		}
	}
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
	// Use km-debug-state to jump directly into boss fight
	await page.addInitScript(() => {
		window.localStorage.setItem(
			"km-debug-state",
			JSON.stringify({
				stage: "BOSS_FIGHT",
				hype: 60,
				heat: 40,
				budget: 7500000,
				personality: "ROASTER",
				role: "CHIEF_SOMETHING_OFFICER",
				currentCardIndex: 0,
				history: [],
				deathReason: null,
				deathType: null,
				unlockedEndings: [],
				bossFightAnswers: [],
				effectiveDeck: null,
			}),
		);
	});
	await page.goto("/");
	await page
		.getByText("Boss fight")
		.waitFor({ state: "visible", timeout: 5000 });
}

/**
 * Navigate to death debrief (DEBRIEF_PAGE_1) via Tech/AI Consultant → Launch → bankrupt.
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
 * Navigate directly to bankrupt death debrief via fast path.
 * Uses Tech/AI Consultant + Launch to exhaust budget.
 */
export async function navigateToGameOverFast(page: Page): Promise<void> {
	// Jump directly into a near-bankrupt state and trigger a costly choice
	await page.addInitScript(() => {
		window.localStorage.setItem(
			"km-debug-state",
			JSON.stringify({
				stage: "PLAYING",
				hype: 40,
				heat: 80,
				budget: 100000, // very low
				personality: "ROASTER",
				role: "TECH_AI_CONSULTANT",
				currentCardIndex: 0,
				history: [],
				deathReason: null,
				deathType: null,
				unlockedEndings: [],
				bossFightAnswers: [],
				effectiveDeck: null,
			}),
		);
	});

	await page.goto("/");
	await page
		.locator(SELECTORS.card)
		.first()
		.waitFor({ state: "visible", timeout: 5000 });

	// Click the risky/right choice until we hit death debrief (Liquidated)
	const maxSwipes = 10;
	for (let i = 0; i < maxSwipes; i++) {
		const gameOverVisible = await page
			.getByText("Liquidated")
			.isVisible()
			.catch(() => false);
		if (gameOverVisible) return;

		const rightBtn = await getRightButton(page);
		if (await rightBtn.isVisible().catch(() => false)) {
			await rightBtn.click({ force: true });
		}
		const nextBtn = page.locator(SELECTORS.nextTicketButton);
		if (await nextBtn.isVisible().catch(() => false)) {
			await nextBtn.click({ force: true });
		}
		await page.waitForTimeout(500);
	}
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
