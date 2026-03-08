import { expect, test } from "@playwright/test";
import { navigateToPlayingFast } from "./helpers/navigation";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Immersive pressure visuals @area:gameplay", () => {
	test("urgent card shows stress visuals (shake/flicker/pulse classes)", async ({
		page,
	}) => {
		await navigateToPlayingFast(page);
		// dev_1 is urgent — card container gets pressure-shake, card gets pressure-flicker/pulse
		const stressContainer = page.locator("[data-pressure-stress=true]");
		await expect(stressContainer.first()).toBeVisible({ timeout: 12000 });
		// Verify stress classes are applied
		const container = page.locator('[data-testid="incident-card-container"]');
		await expect(container).toHaveClass(/pressure-shake/);
		const card = page.locator('[data-testid="incident-card"]');
		await expect(card).toHaveClass(/pressure-flicker|pressure-pulse/);
	});

	test("pressure UI present when on urgent card", async ({ page }) => {
		await navigateToPlayingFast(page);
		const countdown = page.locator("[data-testid=urgent-countdown]");
		const pressureArea = page.locator("[data-pressure-countdown]");
		const feedbackOverlay = page.locator("[data-testid=feedback-dialog]");
		const hasCountdown =
			(await countdown.count()) > 0 || (await pressureArea.count()) > 0;
		const hasFeedback = (await feedbackOverlay.count()) > 0;
		expect(hasCountdown || hasFeedback).toBeTruthy();
	});
});
