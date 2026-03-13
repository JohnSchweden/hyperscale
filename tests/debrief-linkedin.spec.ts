import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("LinkedIn Share Button @area:gameplay", () => {
	test("share button is always enabled on debrief page 3", async ({ page }) => {
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

		// Find LinkedIn share button
		const shareButton = page.getByRole("button", {
			name: /share to linkedin/i,
		});
		await expect(shareButton).toBeVisible();

		// Button should be enabled (not disabled)
		await expect(shareButton).toBeEnabled();
	});

	test("share button is clickable when archetype is null", async ({ page }) => {
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

		// Verify button exists and is clickable
		const shareButton = page.getByRole("button", {
			name: /share to linkedin/i,
		});
		await expect(shareButton).toBeVisible();
		await expect(shareButton).not.toHaveAttribute("disabled");
	});

	test("share button has LinkedIn icon", async ({ page }) => {
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

	test("share button has correct styling", async ({ page }) => {
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

		// Verify button styling
		const shareButton = page.getByRole("button", {
			name: /share to linkedin/i,
		});
		await expect(shareButton).toHaveClass(/bg-white|bg-cyan/);
	});

	test("button responds to hover interaction", async ({ page }) => {
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

		const shareButton = page.getByRole("button", {
			name: /share to linkedin/i,
		});
		await expect(shareButton).toBeVisible();

		// Hover over button - should not change disabled state
		await shareButton.hover();
		await expect(shareButton).toBeEnabled();
	});

	test("share button is visible with all personality types", async ({
		page,
	}) => {
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

			const shareButton = page.getByRole("button", {
				name: /share to linkedin/i,
			});
			await expect(shareButton).toBeVisible();
			await expect(shareButton).toBeEnabled();
		}
	});
});
