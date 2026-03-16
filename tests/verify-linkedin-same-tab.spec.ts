import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("LinkedIn Buttons - Same Tab Verification", () => {
	test("LinkedIn CTA link opens in same tab (no target='_blank')", async ({
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

		// Find the LinkedIn CTA link
		const linkedinCTALink = page.locator(
			'a[href="https://www.linkedin.com/in/schwedeny/"]',
		);

		// Verify it exists
		await expect(linkedinCTALink).toBeVisible();

		// Verify it does NOT have target="_blank"
		const target = await linkedinCTALink.getAttribute("target");
		expect(target).toBeNull();

		// Verify it does NOT have rel="noopener noreferrer"
		const rel = await linkedinCTALink.getAttribute("rel");
		expect(rel).toBeNull();

		// Verify the link text
		await expect(linkedinCTALink).toContainText("Message Yevgen");
	});

	test("Share to LinkedIn button opens in same tab (no target='_blank')", async ({
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

		// Find the Share to LinkedIn button
		const shareButton = page.locator(
			'a[href*="linkedin.com/sharing/share-offsite"]',
		);

		// Verify it exists
		await expect(shareButton).toBeVisible();

		// Verify it does NOT have target="_blank"
		const target = await shareButton.getAttribute("target");
		expect(target).toBeNull();

		// Verify it does NOT have rel="noopener noreferrer"
		const rel = await shareButton.getAttribute("rel");
		expect(rel).toBeNull();
	});
});
