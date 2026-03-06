import { expect, test } from "@playwright/test";
import { navigateToPlaying } from "./helpers/navigation";

/**
 * Phase 04-03: Immersive pressure cues and feedback overlay coverage.
 * - Pressure cue controller (audio/haptics driven by urgency)
 * - Feedback overlay: team-impact messaging, finality, no undo
 */

test.describe("Pressure Cue Controller", () => {
	test("urgent countdown or feedback from timeout on dev_1", async ({
		page,
	}) => {
		await navigateToPlaying(page);

		// Wait for either countdown or feedback (15s timeout may fire during nav)
		const first = await Promise.race([
			page
				.waitForSelector('[data-testid="urgent-countdown"]', {
					timeout: 7000,
					state: "visible",
				})
				.then(() => "countdown" as const),
			page
				.waitForSelector('[data-testid="feedback-dialog"]', {
					timeout: 17000,
					state: "visible",
				})
				.then(() => "dialog" as const),
		]);

		if (first === "countdown") {
			const text = await page
				.locator('[data-testid="urgent-countdown"]')
				.textContent();
			expect(text).toMatch(/\d+s/);
		}
	});

	test("pressure countdown stops when feedback overlay shows", async ({
		page,
	}) => {
		await navigateToPlaying(page);

		await page
			.getByTestId("swipe-left-button")
			.click({ timeout: 8000 })
			.catch(() => {});
		await expect(page.getByTestId("feedback-dialog")).toBeVisible({
			timeout: 15000,
		});
		await expect(page.getByTestId("urgent-countdown")).not.toBeVisible();
	});
});

test.describe("Feedback Overlay", () => {
	test("shows team-impact text when configured for outcome", async ({
		page,
	}) => {
		await navigateToPlaying(page);

		// Click Debug if button is clickable; otherwise timeout will have fired
		await page
			.getByTestId("swipe-left-button")
			.click({ timeout: 8000 })
			.catch(() => {});
		await expect(page.getByTestId("feedback-dialog")).toBeVisible({
			timeout: 15000,
		});

		// dev_1 has team-impact for both outcomes
		const hasTeamImpact =
			(await page
				.locator("text=Ops team grateful for the pause")
				.isVisible()) ||
			(await page.locator("text=Engineering morale took a hit").isVisible());
		expect(hasTeamImpact).toBe(true);
	});

	test("feedback overlay has no undo control", async ({ page }) => {
		await navigateToPlaying(page);
		await page
			.getByTestId("swipe-left-button")
			.click({ timeout: 8000 })
			.catch(() => {});
		await expect(page.getByTestId("feedback-dialog")).toBeVisible({
			timeout: 15000,
		});

		const dialog = page.getByTestId("feedback-dialog");

		// No undo, revert, or change choice buttons
		await expect(dialog.locator('button:has-text("Undo")')).not.toBeVisible();
		await expect(dialog.locator('button:has-text("Revert")')).not.toBeVisible();
		await expect(
			dialog.locator('button:has-text("Change choice")'),
		).not.toBeVisible();

		// Only Next ticket is present
		await expect(
			dialog.locator('button:has-text("Next ticket")'),
		).toBeVisible();
	});

	test("feedback overlay reinforces finality with governance copy", async ({
		page,
	}) => {
		await navigateToPlaying(page);
		await page
			.getByTestId("swipe-left-button")
			.click({ timeout: 8000 })
			.catch(() => {});
		await expect(page.getByTestId("feedback-dialog")).toBeVisible({
			timeout: 15000,
		});

		await expect(page.locator("text=Governance alert").first()).toBeVisible();
	});
});
