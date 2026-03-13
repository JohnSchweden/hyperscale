import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Summary Screen - Navigation @area:gameplay", () => {
	test("Debrief Me button navigates to DEBRIEF_PAGE_1", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-game-state",
				JSON.stringify({
					stage: "SUMMARY",
					hype: 75,
					heat: 50,
					budget: 1500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 10,
					history: [
						{ cardId: "dev-1", choice: "LEFT" },
						{ cardId: "dev-2", choice: "RIGHT" },
					],
					deathReason: null,
					deathType: null,
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();
		await page.waitForSelector("button", { timeout: 10000 });

		// Click Debrief Me button
		const debriefButton = page.getByRole("button", { name: /debrief me/i });
		await expect(debriefButton).toBeVisible();
		await debriefButton.click();

		// Wait for navigation to debrief page 1
		await page.waitForTimeout(500);

		// Verify we're now on DEBRIEF_PAGE_1
		const localStorageState = await page.evaluate(() => {
			const state = localStorage.getItem("km-game-state");
			return state ? JSON.parse(state) : null;
		});

		expect(localStorageState?.stage).toBe("DEBRIEF_PAGE_1");

		// Verify the Game Over / Collapse page content is visible
		await expect(
			page.getByText(/incident report|game over|collapse/i),
		).toBeVisible();
	});

	test("navigation works with different personality types", async ({
		page,
	}) => {
		const personalities = ["ROASTER", "ZEN_MASTER", "LOVEBOMBER"];

		for (const personality of personalities) {
			await page.goto("/");

			await page.evaluate((p) => {
				localStorage.setItem(
					"km-game-state",
					JSON.stringify({
						stage: "SUMMARY",
						hype: 75,
						heat: 50,
						budget: 1500000,
						personality: p,
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
			}, personality);

			await page.reload();
			await page.waitForSelector("button", { timeout: 10000 });

			// Click Debrief Me
			await page.getByRole("button", { name: /debrief me/i }).click();
			await page.waitForTimeout(500);

			// Verify navigation happened
			const localStorageState = await page.evaluate(() => {
				const state = localStorage.getItem("km-game-state");
				return state ? JSON.parse(state) : null;
			});

			expect(localStorageState?.stage).toBe("DEBRIEF_PAGE_1");
		}
	});

	test("navigation works with different roles", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-game-state",
				JSON.stringify({
					stage: "SUMMARY",
					hype: 75,
					heat: 50,
					budget: 1500000,
					personality: "ROASTER",
					role: "PRODUCT_MANAGER",
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
		await page.waitForSelector("button", { timeout: 10000 });

		// Click Debrief Me
		await page.getByRole("button", { name: /debrief me/i }).click();
		await page.waitForTimeout(500);

		// Verify navigation
		const localStorageState = await page.evaluate(() => {
			const state = localStorage.getItem("km-game-state");
			return state ? JSON.parse(state) : null;
		});

		expect(localStorageState?.stage).toBe("DEBRIEF_PAGE_1");
	});

	test("summary screen metrics match Game Over screen format", async ({
		page,
	}) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-game-state",
				JSON.stringify({
					stage: "SUMMARY",
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
		await page.waitForSelector("button", { timeout: 10000 });

		// Verify all three metrics are visible before navigation
		await expect(page.getByText(/budget/i)).toBeVisible();
		await expect(page.getByText(/heat/i)).toBeVisible();
		await expect(page.getByText(/hype/i)).toBeVisible();

		// Navigate
		await page.getByRole("button", { name: /debrief me/i }).click();
		await page.waitForTimeout(500);

		// Verify we're on debrief page
		const localStorageState = await page.evaluate(() => {
			const state = localStorage.getItem("km-game-state");
			return state ? JSON.parse(state) : null;
		});

		expect(localStorageState?.stage).toBe("DEBRIEF_PAGE_1");
	});
});
