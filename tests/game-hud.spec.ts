import { expect, test } from "@playwright/test";
import { getRightButton, navigateToPlayingFast } from "./helpers/navigation";
import { SELECTORS } from "./helpers/selectors";

test.use({ baseURL: "http://localhost:3000" });

// GameHUD has no data-testid; use stable structure: Budget/Risk/Hype rows with second span = value
function budgetValue(page: import("@playwright/test").Page) {
	return page
		.locator("div.flex.justify-between")
		.filter({ hasText: "Budget" })
		.locator("span")
		.nth(1);
}
function riskValue(page: import("@playwright/test").Page) {
	return page
		.locator("div.flex.justify-between")
		.filter({ hasText: "Risk" })
		.locator("span")
		.nth(1);
}
function hypeValue(page: import("@playwright/test").Page) {
	return page
		.locator("div.flex.justify-between")
		.filter({ hasText: "Hype" })
		.locator("span")
		.nth(1);
}

test.describe("GameHUD", () => {
	test.beforeEach(async ({ page }) => {
		await navigateToPlayingFast(page);
	});

	test("on reaching PLAYING, HUD is visible and budget shows $10.0M (initial 10M)", async ({
		page,
	}) => {
		const hud = page
			.locator("div")
			.filter({ hasText: "Budget" })
			.filter({ hasText: "Risk" })
			.filter({ hasText: "Hype" })
			.first();
		await expect(hud).toBeVisible();

		const budgetSpan = budgetValue(page);
		await expect(budgetSpan).toBeVisible();
		await expect(budgetSpan).toHaveText("$10.0M");
	});

	test("after one swipe that costs money (RIGHT on first dev card = 2.5M fine), budget updates to $7.5M", async ({
		page,
	}) => {
		const rightBtn = await getRightButton(page);
		await rightBtn.click();

		const feedbackDialog = page
			.locator(SELECTORS.feedbackDialog)
			.or(page.locator(SELECTORS.feedbackDialogFallback));
		await expect(feedbackDialog).toBeVisible({ timeout: 3000 });

		await page.locator(SELECTORS.nextTicketButton).click();
		await expect(feedbackDialog).toBeHidden({ timeout: 3000 });
		await page.waitForTimeout(300);

		const budgetSpan = budgetValue(page);
		await expect(budgetSpan).toHaveText("$7.5M");
	});

	test("heat and hype values are visible and numeric (e.g. 0%, 50% initially)", async ({
		page,
	}) => {
		const riskSpan = riskValue(page);
		const hypeSpan = hypeValue(page);
		await expect(riskSpan).toBeVisible();
		await expect(hypeSpan).toBeVisible();

		const riskText = await riskSpan.textContent();
		const hypeText = await hypeSpan.textContent();
		expect(riskText).toMatch(/^\d+%$/);
		expect(hypeText).toMatch(/^\d+%$/);
	});
});
