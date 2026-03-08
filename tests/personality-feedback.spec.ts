import { expect, test } from "@playwright/test";
import { getCard, getRightButton } from "./helpers/navigation";
import { SELECTORS } from "./helpers/selectors";

test.use({ baseURL: "http://localhost:3000" });

// First development card (dev_1) RIGHT = Paste; feedback strings from data/cards/development.ts
const DEV_1_RIGHT_ROASTER = "open-sourced our trade secrets";
const DEV_1_RIGHT_ZEN = "The code is now one with the world";

async function navigateToPlayingRoaster(page: import("@playwright/test").Page) {
	await page.goto("/");
	await page.waitForLoadState("networkidle");
	const bootButton = page
		.locator(SELECTORS.bootButton)
		.or(page.locator(SELECTORS.bootButtonFallback));
	await bootButton.click();
	await page.waitForTimeout(300);
	await page.locator('button:has-text("V.E.R.A")').click();
	await page.waitForTimeout(300);
	const roleButton = page
		.locator('button:has-text("Software Engineer")')
		.or(page.locator('[data-testid="role-software_engineer"]'));
	await roleButton.waitFor({ state: "visible" });
	await roleButton.click();
	await page
		.locator('button:has-text("Debug")')
		.waitFor({ state: "visible", timeout: 10000 });
	await page.waitForLoadState("networkidle");
}

test.describe("Personality feedback overlay", () => {
	test("V.E.R.A (Roaster): swipe RIGHT on first card shows Roaster feedback", async ({
		page,
	}) => {
		await navigateToPlayingRoaster(page);
		const card = await getCard(page);
		await expect(card).toBeVisible();
		const rightBtn = await getRightButton(page);
		await rightBtn.click();
		const feedbackDialog = page
			.locator(SELECTORS.feedbackDialog)
			.or(page.locator(SELECTORS.feedbackDialogFallback));
		await expect(feedbackDialog).toBeVisible({ timeout: 3000 });
		await expect(feedbackDialog).toContainText(DEV_1_RIGHT_ROASTER);
	});

	test("BAMBOO (Zen Master): same choice shows different feedback text", async ({
		page,
	}) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		const bootButton = page
			.locator(SELECTORS.bootButton)
			.or(page.locator(SELECTORS.bootButtonFallback));
		await bootButton.click();
		await page.waitForTimeout(300);
		await page.locator('[data-testid="personality-zen_master"]').click();
		await page.waitForTimeout(300);
		await page.locator('button:has-text("Software Engineer")').click();
		await page
			.locator('button:has-text("Debug")')
			.waitFor({ state: "visible", timeout: 10000 });
		await page.waitForLoadState("networkidle");
		const rightBtn = await getRightButton(page);
		await rightBtn.click();
		const feedbackDialog = page
			.locator(SELECTORS.feedbackDialog)
			.or(page.locator(SELECTORS.feedbackDialogFallback));
		await expect(feedbackDialog).toBeVisible({ timeout: 3000 });
		await expect(feedbackDialog).toContainText(DEV_1_RIGHT_ZEN);
	});
});
