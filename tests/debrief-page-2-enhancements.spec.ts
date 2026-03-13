import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Debrief Page 2 - UI Enhancements @area:layout", () => {
	test("displays 'Your Choice' label above decision badges", async ({
		page,
	}) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-game-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_2",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [{ cardId: "dev-1", choice: "LEFT" }],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();
		await page.waitForSelector("h1", { timeout: 10000 });

		// Verify "Your Choice" label is visible above decision badge
		const yourChoiceLabel = page.getByText("Your Choice", { exact: true });
		await expect(yourChoiceLabel).toBeVisible();

		// Verify it appears before the choice badge
		const choiceBadge = page
			.locator(".bg-rose-500\\/20, .bg-emerald-500\\/20")
			.first();
		await expect(choiceBadge).toBeVisible();

		// Check that label is positioned above (comes before in DOM)
		const labelBox = await yourChoiceLabel.boundingBox();
		const badgeBox = await choiceBadge.boundingBox();
		expect(labelBox?.y).toBeLessThan(badgeBox?.y ?? 0);
	});

	test("'Your Choice' label appears for each decision in history", async ({
		page,
	}) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-game-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_2",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [
						{ cardId: "dev-1", choice: "LEFT" },
						{ cardId: "dev-2", choice: "RIGHT" },
					],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();
		await page.waitForSelector("h1", { timeout: 10000 });

		// Should have one "Your Choice" label per decision
		const yourChoiceLabels = page.getByText("Your Choice", { exact: true });
		await expect(yourChoiceLabels).toHaveCount(2);
	});

	test("'Path You Didn't Take' title is center-aligned", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-game-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_2",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [{ cardId: "dev-1", choice: "LEFT" }],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();
		await page.waitForSelector("h1", { timeout: 10000 });

		// Verify the title is visible
		const pathTitle = page.getByText("Path You Didn't Take");
		await expect(pathTitle).toBeVisible();

		// Check that it's centered (using flex justify-center)
		const parentElement = pathTitle.locator("..");
		await expect(parentElement).toHaveClass(/justify-center/);
	});

	test("card descriptions expand with 'show more' button", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-game-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_2",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [{ cardId: "dev-1", choice: "LEFT" }],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();
		await page.waitForSelector("h1", { timeout: 10000 });

		// Look for show more button
		const showMoreButton = page.getByText("show more");

		// If there's a long description, the button should exist
		const count = await showMoreButton.count();
		if (count > 0) {
			await expect(showMoreButton.first()).toBeVisible();

			// Click to expand
			await showMoreButton.first().click();

			// Should now show "show less"
			const showLessButton = page.getByText("show less");
			await expect(showLessButton.first()).toBeVisible();

			// Click to collapse
			await showLessButton.first().click();

			// Should show "show more" again
			await expect(showMoreButton.first()).toBeVisible();
		}
	});
});

test.describe("Debrief Page 2 - Reflection Hints for Both Choices @area:gameplay", () => {
	test("shows hints for safe (LEFT) decisions with emoji", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-game-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_2",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [{ cardId: "dev-1", choice: "LEFT" }],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();
		await page.waitForSelector("h1", { timeout: 10000 });

		// Should show hint with lightbulb emoji for LEFT choice
		const hint = page.getByText(/played it safe/i);
		await expect(hint).toBeVisible();

		// Should have emerald (green) styling for safe hints
		const hintContainer = hint.locator("xpath=../..");
		await expect(hintContainer).toHaveClass(/border-emerald-500/);
	});

	test("shows hints for risky (RIGHT) decisions with shield emoji", async ({
		page,
	}) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-game-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_2",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [{ cardId: "dev-1", choice: "RIGHT" }],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();
		await page.waitForSelector("h1", { timeout: 10000 });

		// Should show hint with shield emoji for RIGHT choice
		const hint = page.getByText(/took a risk/i);
		await expect(hint).toBeVisible();

		// Should suggest trying safer option
		await expect(
			page.getByText(/try.*to see if you can avoid the heat/i),
		).toBeVisible();

		// Should have rose (red) styling for risky hints
		const hintContainer = hint.locator("xpath=../..");
		await expect(hintContainer).toHaveClass(/border-rose-500/);
	});

	test("shows hints for mixed LEFT and RIGHT decisions", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-game-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_2",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "ROASTER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [
						{ cardId: "dev-1", choice: "LEFT" },
						{ cardId: "dev-2", choice: "RIGHT" },
					],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();
		await page.waitForSelector("h1", { timeout: 10000 });

		// Should show both types of hints
		await expect(page.getByText(/played it safe/i)).toBeVisible();
		await expect(page.getByText(/took a risk/i)).toBeVisible();

		// Should show "Decision 1" and "Decision 2"
		await expect(page.getByText("Decision 1:")).toBeVisible();
		await expect(page.getByText("Decision 2:")).toBeVisible();
	});
});
