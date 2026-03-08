import { expect, test } from "@playwright/test";
import { getCard, getRightButton } from "./helpers/navigation";
import { SELECTORS } from "./helpers/selectors";

test.use({ baseURL: "https://localhost:3000" });

// First development card (dev_1) RIGHT = Paste; feedback strings from data/cards/development.ts
const DEV_1_RIGHT_ROASTER = "open-sourced our trade secrets";
const DEV_1_RIGHT_ZEN = "The code is now one with the world";

async function navigateToPlayingWithPersonality(
	page: import("@playwright/test").Page,
	personality: "ROASTER" | "ZEN_MASTER",
) {
	await page.addInitScript(
		({ state, personality: p, role }) => {
			window.localStorage.setItem(
				"gameState",
				JSON.stringify({ state, personality: p, role }),
			);
		},
		{
			state: "playing",
			personality,
			role: "SOFTWARE_ENGINEER",
		},
	);
	await page.goto("/");
	await page
		.locator('button:has-text("Debug")')
		.waitFor({ state: "visible", timeout: 5000 });
	await page
		.locator(SELECTORS.card)
		.first()
		.waitFor({ state: "visible", timeout: 3000 });
	await page.waitForTimeout(500); // Allow animations to settle
}

test.describe("Personality feedback overlay @area:gameplay", () => {
	test("V.E.R.A (Roaster): swipe RIGHT on first card shows Roaster feedback", async ({
		page,
	}) => {
		await navigateToPlayingWithPersonality(page, "ROASTER");
		const card = await getCard(page);
		await expect(card).toBeVisible();
		const rightBtn = await getRightButton(page);
		await rightBtn.click({ force: true });
		const feedbackDialog = page
			.locator(SELECTORS.feedbackDialog)
			.or(page.locator(SELECTORS.feedbackDialogFallback));
		await expect(feedbackDialog).toBeVisible({ timeout: 3000 });
		await expect(feedbackDialog).toContainText(DEV_1_RIGHT_ROASTER);
	});

	test("BAMBOO (Zen Master): same choice shows different feedback text", async ({
		page,
	}) => {
		await navigateToPlayingWithPersonality(page, "ZEN_MASTER");
		const rightBtn = await getRightButton(page);
		await rightBtn.click({ force: true });
		const feedbackDialog = page
			.locator(SELECTORS.feedbackDialog)
			.or(page.locator(SELECTORS.feedbackDialogFallback));
		await expect(feedbackDialog).toBeVisible({ timeout: 3000 });
		await expect(feedbackDialog).toContainText(DEV_1_RIGHT_ZEN);
	});
});
