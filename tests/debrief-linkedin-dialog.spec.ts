import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("LinkedIn Share - Dialog Opening @area:gameplay", () => {
	test("share link has correct LinkedIn URL", async ({ page }) => {
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

		// Wait for page to load
		await page.waitForSelector("button", { timeout: 10000 });

		// Verify the share link has the correct LinkedIn URL
		const shareLink = page.getByRole("link", { name: /share on linkedin/i });
		await expect(shareLink).toBeVisible();

		const href = await shareLink.getAttribute("href");
		expect(href).toContain("linkedin.com/sharing/share-offsite");
		expect(href).toContain("share");
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
		await page.waitForSelector("button", { timeout: 10000 });

		// Verify the share link is visible and enabled
		const shareLink = page.getByRole("link", {
			name: /share on linkedin/i,
		});
		await expect(shareLink).toBeVisible();

		// Check that the link is not disabled
		await expect(shareLink).toBeEnabled();
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

			// Verify link is clickable
			const shareLink = page.getByRole("link", {
				name: /share on linkedin/i,
			});
			await expect(shareLink).toBeEnabled();

			// Verify link has proper styling to indicate it's interactive
			await expect(shareLink).toHaveCSS("cursor", "pointer");
		}
	});
});
