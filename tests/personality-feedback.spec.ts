import { expect, test } from "@playwright/test";
import { PersonalityType, RoleType } from "../src/types";
import {
	getCard,
	getRightButton,
	navigateToPlayingWithCardAtIndex,
} from "./helpers/navigation";
import { SELECTORS } from "./helpers/selectors";

test.use({ baseURL: "https://localhost:3000" });

// First SOFTWARE_ENGINEER card (se_security_patch_timeline) RIGHT = Quick fix; onRight.feedback
const DEV_1_RIGHT_ROASTER =
	"Band-aid on a gunshot wound. Vulnerability still there. You just moved it.";
const DEV_1_RIGHT_ZEN = "A wound bandaged poorly bleeds still.";

async function navigateToPlayingWithPersonality(
	page: import("@playwright/test").Page,
	personality: PersonalityType.ROASTER | PersonalityType.ZEN_MASTER,
) {
	await navigateToPlayingWithCardAtIndex(
		page,
		RoleType.SOFTWARE_ENGINEER,
		0,
		personality,
	);
	await page.waitForTimeout(500); // Allow animations to settle
}

test.describe("Personality feedback overlay @area:gameplay", () => {
	test("V.E.R.A (Roaster): swipe RIGHT on first card shows Roaster feedback", async ({
		page,
	}) => {
		await navigateToPlayingWithPersonality(page, PersonalityType.ROASTER);
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
		await navigateToPlayingWithPersonality(page, PersonalityType.ZEN_MASTER);
		const rightBtn = await getRightButton(page);
		await rightBtn.click({ force: true });
		const feedbackDialog = page
			.locator(SELECTORS.feedbackDialog)
			.or(page.locator(SELECTORS.feedbackDialogFallback));
		await expect(feedbackDialog).toBeVisible({ timeout: 3000 });
		await expect(feedbackDialog).toContainText(DEV_1_RIGHT_ZEN);
	});
});
