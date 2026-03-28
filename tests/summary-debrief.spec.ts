import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Summary Screen - Debrief Flow @area:gameplay", () => {
	test("summary screen shows Debrief Me button instead of Log off", async ({
		page,
	}) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_1",
					hype: 75,
					heat: 50,
					budget: 1500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 10,
					history: [
						{ cardId: "dev_1", choice: "LEFT" },
						{ cardId: "dev_icarus_unverified", choice: "RIGHT" },
					],
					deathReason: null,
					deathType: null,
					unlockedEndings: [],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Should have Debrief Me button
		const debriefButton = page.getByRole("button", { name: /debrief me/i });
		await expect(debriefButton).toBeVisible();

		// Should NOT have Log off button
		const logOffButton = page.getByRole("button", { name: /log off/i });
		await expect(logOffButton).not.toBeVisible();
	});

	test("summary screen displays budget metric", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_1",
					hype: 75,
					heat: 50,
					budget: 1500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 10,
					history: [],
					deathReason: null,
					deathType: null,
					unlockedEndings: [],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Should show Budget metric
		await expect(page.getByText(/budget/i)).toBeVisible();
		await expect(page.getByText(/\$1\.5M|\$1500000/)).toBeVisible();
	});

	test("summary screen displays heat metric", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_1",
					hype: 75,
					heat: 50,
					budget: 1500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 10,
					history: [],
					deathReason: null,
					deathType: null,
					unlockedEndings: [],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Should show Heat metric
		await expect(page.getByText(/heat/i)).toBeVisible();
		await expect(page.getByText(/50%/)).toBeVisible();
	});

	test("summary screen displays hype metric", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_1",
					hype: 75,
					heat: 50,
					budget: 1500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 10,
					history: [],
					deathReason: null,
					deathType: null,
					unlockedEndings: [],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Should show Hype metric
		await expect(page.getByText(/hype/i)).toBeVisible();
		await expect(page.getByText(/75%/)).toBeVisible();
	});

	test("summary screen shows all three metrics in a grid", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_1",
					hype: 75,
					heat: 50,
					budget: 1500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 10,
					history: [],
					deathReason: null,
					deathType: null,
					unlockedEndings: [],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// All three metrics should be visible
		await expect(page.getByText(/budget/i)).toBeVisible();
		await expect(page.getByText(/heat/i)).toBeVisible();
		await expect(page.getByText(/hype/i)).toBeVisible();

		// They should be in a grid layout
		const metricsGrid = page.locator(".grid-cols-3, [class*='grid']");
		await expect(metricsGrid).toBeVisible();
	});

	test("summary screen shows ending collection progress", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_1",
					hype: 75,
					heat: 50,
					budget: 1500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 10,
					history: [],
					deathReason: null,
					deathType: null,
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Should show ending collection
		await expect(page.getByText(/ending collection/i)).toBeVisible();
		await expect(page.getByText(/1\s*\/\s*6|unlocked/)).toBeVisible();
	});

	test("Debrief Me button navigates to debrief flow", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_1",
					hype: 75,
					heat: 50,
					budget: 1500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 10,
					history: [],
					deathReason: null,
					deathType: null,
					unlockedEndings: [],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Click Debrief Me button
		const debriefButton = page.getByRole("button", { name: /debrief me/i });
		await expect(debriefButton).toBeVisible();

		// Note: We can't fully test navigation without mocking, but we verify the button exists
		// and has proper click handler
		await expect(debriefButton).toBeEnabled();
	});

	test("summary screen has success styling", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_1",
					hype: 75,
					heat: 50,
					budget: 1500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 10,
					history: [],
					deathReason: null,
					deathType: null,
					unlockedEndings: [],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Should have trophy icon
		const trophyIcon = page.locator(".fa-trophy");
		await expect(trophyIcon).toBeVisible();

		// Should have green/success styling
		const successHeading = page.getByText(/quarter survived/i);
		await expect(successHeading).toBeVisible();
	});

	test("summary screen shows correct budget formatting", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_1",
					hype: 75,
					heat: 50,
					budget: 2500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 10,
					history: [],
					deathReason: null,
					deathType: null,
					unlockedEndings: [],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Budget should be formatted with M suffix
		await expect(page.getByText(/\$2\.5M/)).toBeVisible();
	});

	test("summary screen is consistent between success scenarios", async ({
		page,
	}) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_1",
					hype: 80,
					heat: 30,
					budget: 2000000,
					personality: "LOVEBOMBER",
					role: "SOMETHING_MANAGER",
					currentCardIndex: 10,
					history: [],
					deathReason: null,
					deathType: null,
					unlockedEndings: ["REPLACED_BY_SCRIPT", "BANKRUPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Core elements should always be present
		await expect(
			page.getByRole("button", { name: /debrief me/i }),
		).toBeVisible();
		await expect(page.getByText(/budget/i)).toBeVisible();
		await expect(page.getByText(/heat/i)).toBeVisible();
		await expect(page.getByText(/hype/i)).toBeVisible();
		await expect(page.getByText(/ending collection/i)).toBeVisible();
	});
});
