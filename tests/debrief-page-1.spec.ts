import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Debrief Page 1 - Unlock Progress @area:layout", () => {
	test("displays unlock progress X/6 endings on game over", async ({
		page,
	}) => {
		await page.goto("/");

		// Simulate game state with one unlocked ending
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

		// Reload to apply state
		await page.reload();

		// Verify unlock progress is displayed
		await expect(page.getByText(/1\s*\/\s*6/)).toBeVisible();
		await expect(page.getByText(/unlocked endings/i)).toBeVisible();
	});

	test("shows personality-specific replay encouragement", async ({ page }) => {
		await page.goto("/");

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

		// Check for V.E.R.A.'s personality-specific line
		await expect(page.getByText(/fail differently this time/i)).toBeVisible();
	});

	test("shows all 6/6 unlocked celebration message", async ({ page }) => {
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

		// Verify celebration message for all unlocked
		await expect(page.getByText(/6\s*\/\s*6/)).toBeVisible();
		await expect(
			page.getByText(/all.*endings.*full kobayashi maru/i),
		).toBeVisible();
	});

	test("shows trophy icons in unlock progress section", async ({ page }) => {
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

		// Check for trophy icon
		const trophyIcons = page.locator(".fa-trophy");
		await expect(trophyIcons).toHaveCount(2);
	});

	test("encouragement text is encouraging (no negative language)", async ({
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

		// Get the progress section text
		const progressText = await page
			.locator("text=/try again|discover|see what else/i")
			.first()
			.textContent();

		// Verify it's encouraging language
		expect(progressText).toMatch(/try again|discover|see what else/i);
		expect(progressText).not.toMatch(/fail|bad|terrible|awful/i);
	});
});
