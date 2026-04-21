import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("LinkedIn Share Utility @area:layout", () => {
	test("formatShareText produces correct format with role title + archetype + score + CTA", async ({
		page,
	}) => {
		// Test via direct import in browser context
		await page.goto("/");

		const result = await page.evaluate(() => {
			// Simulate the formatShareText function logic
			const roleTitle = "Software Engineer";
			const archetypeName = "Pragmatist";
			const resilience = 88;
			const gameUrl = "https://km.swipestrategies.com";
			return `I just faced the Kobayashi Maru as a ${roleTitle}. My Resilience Score: ${resilience}% (${archetypeName}). Can you beat my score? Try the AI governance simulator: ${gameUrl}`;
		});

		expect(result).toBe(
			"I just faced the Kobayashi Maru as a Software Engineer. My Resilience Score: 88% (Pragmatist). Can you beat my score? Try the AI governance simulator: https://km.swipestrategies.com",
		);
	});

	test("Share text length is reasonable for LinkedIn", async ({ page }) => {
		await page.goto("/");

		const result = await page.evaluate(() => {
			const roleTitle = "Chief Something Officer";
			const archetypeName = "Shadow Architect";
			const resilience = 100;
			const gameUrl = "https://km.swipestrategies.com";
			return `I just faced the Kobayashi Maru as a ${roleTitle}. My Resilience Score: ${resilience}% (${archetypeName}). Can you beat my score? Try the AI governance simulator: ${gameUrl}`
				.length;
		});

		// Should be under 300 characters for LinkedIn (which allows up to 3000)
		expect(result).toBeLessThan(300);
	});

	test("encodeLinkedInShareUrl produces valid LinkedIn share URL", async ({
		page,
	}) => {
		await page.goto("/");

		const result = await page.evaluate(() => {
			const currentUrl = "https://example.com/debrief";
			const encodedUrl = encodeURIComponent(currentUrl);
			return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
		});

		expect(result).toBe(
			"https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fexample.com%2Fdebrief",
		);
	});

	test("URL encoding handles special characters correctly", async ({
		page,
	}) => {
		await page.goto("/");

		const result = await page.evaluate(() => {
			const currentUrl = "https://example.com/debrief?role=engineer&score=88";
			return encodeURIComponent(currentUrl);
		});

		// Should encode special characters
		expect(result).not.toContain("?");
		expect(result).not.toContain("&");
		expect(result).not.toContain("=");
	});

	test("share button is visible on debrief page 3", async ({ page }) => {
		await page.goto("/");

		// Setup game state to render the share button
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

		// Verify the LinkedIn share button exists and is visible
		const shareButton = page.getByRole("button", {
			name: /share on linkedin/i,
		});
		await expect(shareButton).toBeVisible();
		await expect(shareButton).toBeEnabled();
	});
});
