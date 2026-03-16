import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("LinkedIn Share Button @area:gameplay", () => {
	test("share link is visible on debrief page 3", async ({ page }) => {
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

		// Find LinkedIn share anchor
		const shareLink = page.locator(
			"a[href*='linkedin.com/sharing/share-offsite']",
		);
		await expect(shareLink).toBeVisible();
	});

	test("share link has correct href with LinkedIn format", async ({ page }) => {
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

		const shareLink = page.locator(
			"a[href*='linkedin.com/sharing/share-offsite']",
		);
		await expect(shareLink).toBeVisible();

		const href = await shareLink.getAttribute("href");
		expect(href).toContain("linkedin.com/sharing/share-offsite");
		expect(href).toContain("url=");
		expect(href).toContain("summary=");
	});

	test("share link has LinkedIn icon", async ({ page }) => {
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

		// Verify LinkedIn icon is present
		const linkedinIcon = page.locator(".fa-linkedin, [class*='linkedin']");
		await expect(linkedinIcon).toBeVisible();
	});

	test("share link has correct styling", async ({ page }) => {
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

		// Verify link styling
		const shareLink = page.locator(
			"a[href*='linkedin.com/sharing/share-offsite']",
		);
		await expect(shareLink).toHaveClass(/bg-white|bg-cyan/);
	});

	test("share link responds to hover interaction", async ({ page }) => {
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

		const shareLink = page.locator(
			"a[href*='linkedin.com/sharing/share-offsite']",
		);
		await expect(shareLink).toBeVisible();

		// Hover over link
		await shareLink.hover();
		await expect(shareLink).toBeVisible();
	});

	test("share link is visible with all personality types", async ({ page }) => {
		const personalities = ["ROASTER", "ZEN_MASTER", "LOVEBOMBER"] as const;

		for (const personality of personalities) {
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

			const shareLink = page.locator(
				"a[href*='linkedin.com/sharing/share-offsite']",
			);
			await expect(shareLink).toBeVisible();
		}
	});
});
