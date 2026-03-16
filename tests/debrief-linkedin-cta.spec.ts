import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("LinkedIn CTA Section @area:debrief", () => {
	test("LinkedIn CTA section visible on debrief page 3", async ({ page }) => {
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

		// LinkedIn CTA link should be visible
		const linkedinLink = page.locator(
			'a[href="https://www.linkedin.com/in/schwedeny/"]',
		);
		await expect(linkedinLink).toBeVisible();
	});

	test("LinkedIn icon is visible", async ({ page }) => {
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

		// LinkedIn icon should be visible with cyan color in the CTA section
		const ctaSection = page
			.locator("div")
			.filter({ hasText: /Get early access to V2/ })
			.first();
		const linkedinIcon = ctaSection.locator(
			".fa-brands.fa-linkedin.text-cyan-400",
		);
		await expect(linkedinIcon).toBeVisible();
	});

	test("Get early access to V2 header text visible", async ({ page }) => {
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

		// Header text should be visible
		await expect(page.getByText(/get early access to v2/i)).toBeVisible();
	});

	test("LinkedIn profile link visible with correct href", async ({ page }) => {
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

		// LinkedIn link should be visible and have correct href
		const linkedinLink = page.locator(
			'a[href="https://www.linkedin.com/in/schwedeny/"]',
		);
		await expect(linkedinLink).toBeVisible();
	});

	test("Link text is Yevgen Schweden", async ({ page }) => {
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

		// Link text should display name
		const linkedinLink = page.getByText(/connect with yevgen schweden/i);
		await expect(linkedinLink).toBeVisible();
	});

	test("CTA visible when role is null (edge case)", async ({ page }) => {
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
					role: null,
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

		// LinkedIn CTA should still be visible even without role
		const linkedinLink = page.locator(
			'a[href="https://www.linkedin.com/in/schwedeny/"]',
		);
		await expect(linkedinLink).toBeVisible();

		// Text should be visible
		await expect(page.getByText(/connect with yevgen schweden/i)).toBeVisible();
	});

	test("Description text mentions LinkedIn and adaptive version", async ({
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

		// Description should mention LinkedIn and adaptive version
		await expect(
			page.getByText(/connect with me on linkedin.*adaptive.*version/i),
		).toBeVisible();
	});
});
