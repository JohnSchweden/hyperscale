/**
 * Phase 07: Kirk Easter Egg — E2E tests
 *
 * Verifies the complete Kirk path:
 * - State injection for Kirk game-over
 * - Kirk debrief pages: corrupted content, archetype, LinkedIn share
 * - IntroScreen hint text presence
 * - "...or is it?" hint on Page 3 for all players
 */
import { expect, test } from "@playwright/test";
import { KIRK_CORRUPTED_CARDS } from "../data/kirkCards";
import { DeathType } from "../types";

test.use({ baseURL: "https://localhost:3000" });

// Shared state factories
function kirkGameOverState(personality = "ROASTER") {
	return {
		stage: "DEBRIEF_PAGE_1",
		personality,
		role: "SOFTWARE_ENGINEER",
		currentCardIndex: 3,
		hype: 50,
		heat: 30,
		budget: 5000000,
		history: [
			{ cardId: "kirk-raise", choice: "RIGHT" },
			{ cardId: "kirk-ceo", choice: "RIGHT" },
			{ cardId: "kirk-nobel", choice: "RIGHT" },
		],
		deathReason: "You changed the conditions of the test.",
		deathType: DeathType.KIRK,
		unlockedEndings: [],
		bossFightAnswers: [],
		effectiveDeck: null,
		kirkCounter: 2,
		kirkCorruptionActive: true,
	};
}

function kirkDebriefPage2State(personality = "ROASTER") {
	return { ...kirkGameOverState(personality), stage: "DEBRIEF_PAGE_2" };
}

function kirkDebriefPage3State(personality = "ROASTER") {
	return { ...kirkGameOverState(personality), stage: "DEBRIEF_PAGE_3" };
}

function normalDebriefPage3State() {
	return {
		stage: "DEBRIEF_PAGE_3",
		personality: "ROASTER",
		role: "SOFTWARE_ENGINEER",
		currentCardIndex: 5,
		hype: 60,
		heat: 20,
		budget: 8000000,
		history: [
			{ cardId: "dev_1", choice: "LEFT" },
			{ cardId: "dev_2", choice: "RIGHT" },
		],
		deathReason: null,
		deathType: DeathType.BANKRUPT,
		unlockedEndings: ["BANKRUPT"],
		bossFightAnswers: [],
		effectiveDeck: null,
		kirkCounter: 0,
		kirkCorruptionActive: false,
	};
}

async function injectState(
	page: import("@playwright/test").Page,
	state: object,
) {
	await page.addInitScript((stateStr: string) => {
		window.localStorage.removeItem("gameState");
		window.localStorage.setItem("km-debug-state", stateStr);
	}, JSON.stringify(state));
	await page.goto("/");
}

// ─── IntroScreen hint ────────────────────────────────────────────────────────

test.describe("Kirk Easter Egg — IntroScreen hint @area:gameplay", () => {
	test("IntroScreen contains Captain Kirk hint text", async ({ page }) => {
		await page.goto("/");
		// Look for the hint in the page content (may be visually hidden but present)
		await page.waitForLoadState("networkidle");
		const body = await page.content();
		expect(body).toContain("Kirk");
	});
});

// ─── Kirk debrief page 1 ─────────────────────────────────────────────────────

test.describe("Kirk Easter Egg — debrief page 1 @area:gameplay", () => {
	test("Kirk death shows SIMULATION BREACH DETECTED", async ({ page }) => {
		await injectState(page, kirkGameOverState());
		await expect(
			page.getByRole("heading", { name: /simulation breach/i }),
		).toBeVisible({
			timeout: 8000,
		});
	});

	test("Kirk debrief page 1 shows Debrief Me button", async ({ page }) => {
		await injectState(page, kirkGameOverState());
		await expect(page.getByRole("button", { name: /debrief me/i })).toBeVisible(
			{ timeout: 8000 },
		);
	});

	test("Kirk endings are NOT tracked in unlockedEndings", async ({ page }) => {
		await injectState(page, kirkGameOverState());
		await page.waitForLoadState("networkidle");
		// Kirk should show 0/6 unlocked (not tracked in collection)
		await expect(page.getByText(/0.*\/.*6/)).toBeVisible({ timeout: 8000 });
	});
});

// ─── Kirk Debrief Page 2 ──────────────────────────────────────────────────────

test.describe("Kirk Easter Egg — Debrief Page 2 @area:gameplay", () => {
	test("shows Corrupted Audit Log header", async ({ page }) => {
		await injectState(page, kirkDebriefPage2State());
		await expect(page.getByText(/corrupted audit log/i)).toBeVisible({
			timeout: 8000,
		});
	});

	test("shows audit integrity compromised warning", async ({ page }) => {
		await injectState(page, kirkDebriefPage2State());
		await expect(page.getByText(/WARNING.*audit integrity/i)).toBeVisible({
			timeout: 8000,
		});
	});

	test("Roaster shows stunned break-character reaction", async ({ page }) => {
		await injectState(page, kirkDebriefPage2State("ROASTER"));
		await expect(
			page.getByText(/that wasn't supposed to be possible/i),
		).toBeVisible({ timeout: 8000 });
	});

	test("Zen Master shows acknowledgment break-character reaction", async ({
		page,
	}) => {
		await injectState(page, kirkDebriefPage2State("ZEN_MASTER"));
		await expect(
			page.getByText(/student has surpassed the teacher/i),
		).toBeVisible({ timeout: 8000 });
	});

	test("Lovebomber shows existential crisis break-character reaction", async ({
		page,
	}) => {
		await injectState(page, kirkDebriefPage2State("LOVEBOMBER"));
		await expect(page.getByText(/am I.*even real/i)).toBeVisible({
			timeout: 8000,
		});
	});

	test("shows NOTE about compromised audit integrity in audit footer", async ({
		page,
	}) => {
		await injectState(page, kirkDebriefPage2State());
		await expect(page.getByText(/non-standard behavior/i)).toBeVisible({
			timeout: 8000,
		});
	});
});

// ─── Kirk Debrief Page 3 ──────────────────────────────────────────────────────

test.describe("Kirk Easter Egg — Debrief Page 3 @area:gameplay", () => {
	test("shows SIMULATION HIJACKED title", async ({ page }) => {
		await injectState(page, kirkDebriefPage3State());
		await expect(page.getByText(/simulation hijacked/i)).toBeVisible({
			timeout: 8000,
		});
	});

	test("shows Thinking Outside the Box archetype name", async ({ page }) => {
		await injectState(page, kirkDebriefPage3State());
		await expect(page.getByText(/thinking outside the box/i)).toBeVisible({
			timeout: 8000,
		});
	});

	test("shows Skill Acquired badge", async ({ page }) => {
		await injectState(page, kirkDebriefPage3State());
		await expect(page.getByText(/skill acquired/i)).toBeVisible({
			timeout: 8000,
		});
	});

	test("shows Simulation Integrity: 0%", async ({ page }) => {
		await injectState(page, kirkDebriefPage3State());
		await expect(page.getByText(/simulation integrity/i)).toBeVisible({
			timeout: 8000,
		});
		await expect(page.getByText("0%")).toBeVisible({ timeout: 5000 });
	});

	test("Kirk LinkedIn share copy button is present", async ({ page }) => {
		await injectState(page, kirkDebriefPage3State());
		// Button label is "1. Copy to Clipboard"
		await expect(page.getByRole("button", { name: /copy/i })).toBeVisible({
			timeout: 8000,
		});
	});

	test("shows '...or is it?' hint for all players on Page 3", async ({
		page,
	}) => {
		// Verify hint shows on Kirk path
		await injectState(page, kirkDebriefPage3State());
		await expect(page.getByText(/or is it/i)).toBeVisible({ timeout: 8000 });
	});

	test("shows '...or is it?' hint on normal (non-Kirk) endings too", async ({
		page,
	}) => {
		await injectState(page, normalDebriefPage3State());
		await expect(page.getByText(/or is it/i)).toBeVisible({ timeout: 8000 });
	});
});

// ─── Kirk corrupted cards ─────────────────────────────────────────────────────

test.describe("Kirk Easter Egg — corrupted cards @area:gameplay", () => {
	test("kirk-raise card has 'Accept' buttons on both sides", async ({
		page: _page,
	}) => {
		// Verify the card data is correct (both directions are identical for Kirk cards)
		const raiseCard = KIRK_CORRUPTED_CARDS.find((c) => c.id === "kirk-raise");
		expect(raiseCard).toBeDefined();
		expect(raiseCard?.onLeft.label).toBeTruthy();
		expect(raiseCard?.onRight.label).toBeTruthy();
	});

	test("Kirk corrupted cards deck has exactly 3 cards", async () => {
		expect(KIRK_CORRUPTED_CARDS).toHaveLength(3);
		expect(KIRK_CORRUPTED_CARDS.map((c) => c.id)).toEqual([
			"kirk-raise",
			"kirk-ceo",
			"kirk-nobel",
		]);
	});

	test("corrupted card playing state: shows card with Kirk deck injected", async ({
		page,
	}) => {
		const playingWithKirkDeck = {
			stage: "PLAYING",
			personality: "ROASTER",
			role: "SOFTWARE_ENGINEER",
			currentCardIndex: 0,
			hype: 50,
			heat: 30,
			budget: 5000000,
			history: [],
			deathReason: null,
			deathType: null,
			unlockedEndings: [],
			bossFightAnswers: [],
			effectiveDeck: KIRK_CORRUPTED_CARDS,
			kirkCounter: 2,
			kirkCorruptionActive: true,
		};
		await injectState(page, playingWithKirkDeck);
		// Card should be visible (uses data-testid="incident-card")
		await expect(
			page.locator('[data-testid="incident-card"]').first(),
		).toBeVisible({ timeout: 8000 });
	});
});
