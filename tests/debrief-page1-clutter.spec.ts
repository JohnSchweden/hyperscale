import { expect, test } from "@playwright/test";
import { navigateToGameOverFast } from "./helpers/navigation";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Debrief page 1 clutter removal @area:gameplay", () => {
	test("Unlocked Endings header has exactly one trophy icon", async ({
		page,
	}) => {
		await navigateToGameOverFast(page);
		await page
			.getByText("Liquidated")
			.waitFor({ state: "visible", timeout: 8000 });

		const endingsBox = page.locator('[data-testid="debrief-endings-box"]');
		await endingsBox.waitFor({ state: "visible", timeout: 5000 });

		const trophyIcons = endingsBox.locator(".fa-trophy");
		await expect(trophyIcons).toHaveCount(1);
	});

	test("progressText paragraph is absent", async ({ page }) => {
		await navigateToGameOverFast(page);
		await page
			.getByText("Liquidated")
			.waitFor({ state: "visible", timeout: 8000 });

		const progressText = page.locator('[data-testid="endings-progress-text"]');
		await expect(progressText).toHaveCount(0);
	});

	test("replay line paragraph is absent", async ({ page }) => {
		await navigateToGameOverFast(page);
		await page
			.getByText("Liquidated")
			.waitFor({ state: "visible", timeout: 8000 });

		const replayLine = page.locator('[data-testid="endings-replay-line"]');
		await expect(replayLine).toHaveCount(0);
	});
});
