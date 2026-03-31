import { expect, test } from "@playwright/test";
import { ROLE_CARDS } from "../data";
import { formatBudget } from "../lib/formatting";
import { RoleType } from "../types";
import {
	getRightButton,
	navigateToPlayingFast,
	navigateToPlayingWithCardAtIndex,
} from "./helpers/navigation";
import { SELECTORS } from "./helpers/selectors";

test.use({ baseURL: "https://localhost:3000" });

// Risk/Hype: second span in justify-between row = value; budget groups label + amount left (data-hud)
function budgetValue(page: import("@playwright/test").Page) {
	return page.locator('[data-hud="budget-value"]');
}
function riskValue(page: import("@playwright/test").Page) {
	return page.locator('[data-hud="risk-value"]');
}
function hypeValue(page: import("@playwright/test").Page) {
	return page.locator('[data-hud="hype-value"]');
}

test.describe("GameHUD @smoke @area:gameplay", () => {
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

	test("after one right swipe, budget drops by that card's right-choice fine", async ({
		page,
	}) => {
		await navigateToPlayingWithCardAtIndex(page, RoleType.SOFTWARE_ENGINEER, 1);
		const card = ROLE_CARDS[RoleType.SOFTWARE_ENGINEER][1];
		const fine = card.onRight.fine;
		const rightBtn = await getRightButton(page);
		await rightBtn.click({ force: true });

		const feedbackDialog = page
			.locator(SELECTORS.feedbackDialog)
			.or(page.locator(SELECTORS.feedbackDialogFallback));
		await expect(feedbackDialog).toBeVisible({ timeout: 3000 });

		await page.locator(SELECTORS.nextTicketButton).click({ force: true });
		await expect(feedbackDialog).toBeHidden({ timeout: 3000 });
		await page.waitForTimeout(300);

		const budgetSpan = budgetValue(page);
		await expect(budgetSpan).toHaveText(formatBudget(10_000_000 - fine));
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
