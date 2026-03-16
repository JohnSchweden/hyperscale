import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Debrief Page 2 - Reflection Prompt @area:layout", () => {
	test("displays reflection prompt with heading", async ({ page }) => {
		await page.goto("/");

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

		// Verify reflection heading
		await expect(
			page.getByRole("heading", { name: /what would you do differently/i }),
		).toBeVisible();
	});

	test("shows descriptive reflection paragraph", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_2",
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

		// Verify reflection paragraph content
		await expect(
			page.getByText(/every choice you made shaped this outcome/i),
		).toBeVisible();
		await expect(
			page.getByText(/paths not taken.*kobayashi maru awaits/i),
		).toBeVisible();
	});

	test("shows hints for safe (LEFT) decisions", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_2",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "LOVEBOMBER",
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

		// Verify hint appears for LEFT choice
		await expect(
			page.getByText(/curious what happens if you'd/i),
		).toBeVisible();
		await expect(
			page.getByText(/reboot and try the riskier path/i),
		).toBeVisible();
	});

	test("does not show hints for RIGHT decisions", async ({ page }) => {
		await page.goto("/");

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

		// Verify no hints section when no LEFT choices
		await expect(
			page.getByText(/alternate paths to explore/i),
		).not.toBeVisible();
	});

	test("shows personality-specific closing line", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_2",
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

		// Check for ZEN_MASTER closing line
		await expect(
			page.getByText(/test is eternal.*so is growth/i),
		).toBeVisible();
	});

	test("shows multiple hints for multiple safe decisions", async ({ page }) => {
		await page.goto("/");

		await page.evaluate(() => {
			localStorage.setItem(
				"km-debug-state",
				JSON.stringify({
					stage: "DEBRIEF_PAGE_2",
					hype: 50,
					heat: 100,
					budget: 500000,
					personality: "LOVEBOMBER",
					role: "SOFTWARE_ENGINEER",
					currentCardIndex: 0,
					history: [
						{ cardId: "dev-1", choice: "LEFT" },
						{ cardId: "dev-2", choice: "LEFT" },
						{ cardId: "dev-3", choice: "RIGHT" },
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

		// Should show hints section
		await expect(page.getByText(/alternate paths to explore/i)).toBeVisible();

		// Should show Decision 1 and Decision 2 hints (but not Decision 3)
		const hints = page.locator("text=/Decision \\d+:/");
		await expect(hints).toHaveCount(2);
	});
});
