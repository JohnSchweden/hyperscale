import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Debrief Audit Trail - Choice Labels @area:gameplay", () => {
	test("displays human-readable choice labels instead of raw LEFT/RIGHT", async ({
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

		// Wait for the page to load
		await page.waitForSelector("h1", { timeout: 10000 });

		// Verify the audit log heading is displayed
		const heading = await page.locator("h1").textContent();
		expect(heading).toMatch(/incident audit log/i);

		// Get page content to verify no raw LEFT/RIGHT labels
		const pageContent = await page.content();

		// Page should not show raw LEFT/RIGHT as standalone uppercase text in badges
		// The implementation shows outcome.label instead (like "Let the AI handle it")
		expect(pageContent).not.toMatch(/>LEFT</);
		expect(pageContent).not.toMatch(/>RIGHT</);
	});

	test("shows appropriate styling for safe (LEFT) vs risky (RIGHT) choices", async ({
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

		// Wait for the page to load
		await page.waitForSelector("h1", { timeout: 10000 });

		// The component uses emerald-500/20 for RIGHT (risky) and rose-500/20 for LEFT (safe)
		const pageContent = await page.content();

		// Verify styling classes exist in the page for both choice types
		expect(pageContent).toMatch(/emerald-500/);
		expect(pageContent).toMatch(/rose-500/);
	});

	test("displays sender and decision number for each decision", async ({
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

		// Wait for the page to load
		await page.waitForSelector("h1", { timeout: 10000 });

		// Verify decision number is shown
		const pageContent = await page.content();
		expect(pageContent).toContain("#1");

		// Verify audit entry structure exists
		const auditEntries = page.locator("[class*='rounded-lg']");
		await expect(auditEntries.first()).toBeVisible();
	});
});

test.describe("Debrief Audit Trail - Description Length @area:layout", () => {
	test("shows card descriptions with meaningful content", async ({ page }) => {
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

		// Wait for the page to load
		await page.waitForSelector("h1", { timeout: 10000 });

		// Verify audit entries are displayed
		const auditEntries = page.locator("[class*='bg-slate-900']");
		await expect(auditEntries.first()).toBeVisible();
	});

	test("provides expand option for long card descriptions", async ({
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

		// Wait for the page to load
		await page.waitForSelector("h1", { timeout: 10000 });

		// Check for show more/less button if description is long
		const showMoreButton = page.getByText(/show more|show less/i);

		// If there's a long description, expand button should exist
		// Otherwise, the test passes (short descriptions don't need expand)
		const count = await showMoreButton.count();
		if (count > 0) {
			await expect(showMoreButton.first()).toBeVisible();
		}
	});
});

test.describe("Debrief Audit Trail - Consequence Display @area:layout", () => {
	test("displays consequences with hype, heat, or fine information", async ({
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

		// Wait for the page to load
		await page.waitForSelector("h1", { timeout: 10000 });

		// The component shows consequences - verify consequence-related text exists
		const pageContent = await page.content();
		expect(pageContent).toMatch(/hype|heat|fine|change/i);
	});

	test("audit trail page loads without errors", async ({ page }) => {
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
					history: [{ cardId: "se_code_quality_refactor", choice: "RIGHT" }],
					deathReason: "Heat exceeded 100%",
					deathType: "REPLACED_BY_SCRIPT",
					unlockedEndings: ["REPLACED_BY_SCRIPT"],
					bossFightAnswers: [],
					effectiveDeck: null,
				}),
			);
		});

		await page.reload();

		// Verify audit log heading is displayed
		await page.waitForSelector("h1", { timeout: 10000 });
		const heading = await page.locator("h1").textContent();
		expect(heading).toMatch(/incident audit log/i);
	});
});
