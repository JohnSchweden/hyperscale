import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Debrief Reflection Hints @area:gameplay", () => {
	test("shows hints for LEFT (safe) choices suggesting riskier alternatives", async ({
		page,
	}) => {
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
					history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Should show hint for safe choice
		await expect(page.getByText(/you played it safe/i)).toBeVisible();
		await expect(page.getByText(/next time, try/i)).toBeVisible();
	});

	test("shows hints for RIGHT (risky) choices suggesting safer alternatives", async ({
		page,
	}) => {
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
					history: [{ cardId: "se_security_patch_timeline", choice: "RIGHT" }],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Should show hint for risky choice
		await expect(page.getByText(/you took a risk/i)).toBeVisible();
		await expect(page.getByText(/avoid the heat and fines/i)).toBeVisible();
	});

	test("shows hints for mixed LEFT and RIGHT choices", async ({ page }) => {
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
						{ cardId: "se_security_patch_timeline", choice: "LEFT" },
						{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
						{ cardId: "se_code_quality_refactor", choice: "LEFT" },
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

		// Should show hints section header
		await expect(page.getByText(/path you didn't take/i)).toBeVisible();

		// Should show multiple decision hints
		const decisionHints = page.locator("text=/Decision \\d+:/i");
		await expect(decisionHints).toHaveCount(3);
	});

	test("hints include specific alternative action labels", async ({ page }) => {
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
						{ cardId: "se_security_patch_timeline", choice: "LEFT" },
						{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
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

		// Hints should reference specific alternative choices
		// For LEFT choice: should mention trying the RIGHT option
		await expect(page.getByText(/hype you could gain/i)).toBeVisible();

		// For RIGHT choice: should mention trying the LEFT option
		await expect(page.getByText(/avoid the heat/i)).toBeVisible();
	});

	test("reflection section has proper heading", async ({ page }) => {
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
					history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Should have the reflection heading
		await expect(
			page.getByRole("heading", { name: /what would you do differently/i }),
		).toBeVisible();
	});

	test("hints have visual distinction with icons and colors", async ({
		page,
	}) => {
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
						{ cardId: "se_security_patch_timeline", choice: "LEFT" },
						{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
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

		// Should have emoji icons for hints
		const pageContent = await page.content();
		expect(pageContent).toMatch(/💡|🛡️/);
	});

	test("hints explain trade-offs for each choice type", async ({ page }) => {
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
						{ cardId: "se_security_patch_timeline", choice: "LEFT" },
						{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
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

		// LEFT hint should mention gaining hype but attracting heat
		await expect(page.getByText(/hype you could gain/i)).toBeVisible();
		await expect(page.getByText(/heat you might attract/i)).toBeVisible();

		// RIGHT hint should mention avoiding heat and fines
		await expect(page.getByText(/avoid the heat and fines/i)).toBeVisible();
	});

	test("reflection section includes personality-specific closing", async ({
		page,
	}) => {
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
					history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Should have personality-specific closing line
		await expect(page.getByText(/test is eternal.*growth/i)).toBeVisible();
	});
});
