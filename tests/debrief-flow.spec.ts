import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Debrief Flow - Replay and Progress @area:gameplay", () => {
	test("unlocked endings persist across game sessions", async ({ page }) => {
		await page.goto("/");

		// Set initial state with one unlocked ending
		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_1",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Verify 1/6 is displayed
		await expect(page.getByText(/1\s*\/\s*6/)).toBeVisible();

		// Navigate to Page 3 (where reboot button should be)
		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_3",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Check that a reboot/play again button exists
		const rebootButton = page.locator("button", {
			hasText: /reboot|play again|start over/i,
		});
		await expect(rebootButton).toBeVisible();
	});

	test("progress increments when new ending is unlocked", async ({ page }) => {
		await page.goto("/");

		// First playthrough - 1 ending unlocked
		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_1",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [],
					deathReason: "Budget depleted",
					deathType: "BANKRUPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT", "BANKRUPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Verify 2/6 is displayed
		await expect(page.getByText(/2\s*\/\s*6/)).toBeVisible();
	});

	test("all endings unlocked shows special celebration", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_1",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "LOVEBOMBER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [],
					deathReason: "Various",
					deathType: "AUDIT_FAILURE",
					unlockedEndings: [
						"BANKRUPT",
						"REPLACED_BY_SCRIPT",
						"CONGRESS",
						"FLED_COUNTRY",
						"PRISON",
						"AUDIT_FAILURE",
					],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Verify 6/6 is displayed with celebration
		await expect(page.getByText(/6\s*\/\s*6/)).toBeVisible();
		await expect(
			page.getByText(/full kobayashi maru|impressive|all.*unlocked/i),
		).toBeVisible();
	});

	test("personality tone is consistent on both debrief pages", async ({
		page,
	}) => {
		await page.goto("/");

		// Test V.E.R.A. (ROASTER) personality
		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_1",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Check Page 1 has cynical tone
		await expect(page.getByText(/fail differently this time/i)).toBeVisible();

		// Navigate to Page 2
		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_2",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [{ cardId: "dev_1", choice: "LEFT" }],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Check Page 2 has cynical closing
		await expect(
			page.getByText(/try not to disappoint it again/i),
		).toBeVisible();
	});

	test("ZEN_MASTER personality uses calm, philosophical language", async ({
		page,
	}) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_1",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ZEN_MASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Check for zen-like language
		await expect(page.getByText(/wisdom lies in repetition/i)).toBeVisible();
	});

	test("LOVEBOMBER personality uses enthusiastic language", async ({
		page,
	}) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_1",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "LOVEBOMBER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Check for enthusiastic language
		await expect(
			page.getByText(/i believe in you.*see what you learn/i),
		).toBeVisible();
	});
});
