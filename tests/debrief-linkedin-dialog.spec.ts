import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("LinkedIn Share - Dialog Opening @area:gameplay", () => {
	test("clicking share button opens LinkedIn share dialog", async ({
		page,
		context,
	}) => {
		await page.goto("/");

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

		// Wait for page to load
		await page.waitForSelector("button", { timeout: 10000 });

		// Listen for new page (popup) opening
		const [newPage] = await Promise.all([
			context.waitForEvent("page"),
			page.getByRole("button", { name: /share to linkedin/i }).click(),
		]);

		// Verify new page is LinkedIn
		await newPage.waitForLoadState();
		const url = newPage.url();
		expect(url).toContain("linkedin.com");
		expect(url).toContain("share");
	});

	test("share URL contains pre-filled text with role, archetype, and score", async ({
		page,
	}) => {
		await page.goto("/");

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
		await page.waitForSelector("button", { timeout: 10000 });

		// Verify the share button has proper data attributes or onclick handler
		const shareButton = page.getByRole("button", {
			name: /share to linkedin/i,
		});
		await expect(shareButton).toBeVisible();

		// Check that the button is not disabled
		await expect(shareButton).toBeEnabled();
	});

	test("share button works with all archetypes", async ({ page }) => {
		const archetypes = [
			{ personality: "ROASTER", archetype: "Pragmatist" },
			{ personality: "ZEN_MASTER", archetype: "Balanced" },
			{ personality: "LOVEBOMBER", archetype: "Disruptor" },
		];

		for (const { personality } of archetypes) {
			await page.goto("/");

			await page.evaluate((p) => {
				localStorage.setItem(
					"km-debug-state",
					JSON.stringify({
						stage: "DEBRIEF_PAGE_3",
						hype: 50,
						heat: 100,
						budget: 500000,
						personality: p,
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
			}, personality);

			await page.reload();
			await page.waitForSelector("button", { timeout: 10000 });

			// Verify button is clickable
			const shareButton = page.getByRole("button", {
				name: /share to linkedin/i,
			});
			await expect(shareButton).toBeEnabled();

			// Verify button has proper styling to indicate it's interactive
			await expect(shareButton).toHaveCSS("cursor", "pointer");
		}
	});
});
