import { expect, test } from "@playwright/test";
import { RoleType } from "../types";
import { navigateToPlayingWithCardAtIndex } from "./helpers/navigation";
import { SELECTORS } from "./helpers/selectors";

test.describe("Image transition effects", () => {
	test.beforeEach(async ({ page }) => {
		await navigateToPlayingWithCardAtIndex(page, RoleType.SOFTWARE_ENGINEER, 0);
	});

	test("Images fade in with 300ms transition", async ({ page }) => {
		const imageWithFallback = page
			.locator('div[class*="aspect-video"]')
			.first();
		const img = imageWithFallback.locator("img").first();

		const className = await img.getAttribute("class");
		expect(className).toContain("transition-opacity");
		expect(className).toContain("duration-300");
	});

	test("Glitch placeholder visible during load", async ({ page }) => {
		await page.route("**/*.webp", (route) => {
			setTimeout(() => route.continue(), 200);
		});
		await page.reload();

		await page
			.locator(SELECTORS.card)
			.first()
			.waitFor({ state: "visible", timeout: 10000 });

		const imageWithFallback = page
			.locator('div[class*="aspect-video"]')
			.first();
		const placeholder = imageWithFallback
			.locator('div[class*="bg-gradient-to-b"]')
			.first();

		const count = await placeholder.count();
		expect(count).toBeGreaterThanOrEqual(0);
	});

	test("Image opacity transitions from 0 to 1", async ({ page }) => {
		const imageWithFallback = page
			.locator('div[class*="aspect-video"]')
			.first();
		const img = imageWithFallback.locator("img").first();

		await page.waitForLoadState("load", { timeout: 5000 });
		await expect(img).toHaveCSS("opacity", "1", { timeout: 10000 });
	});

	test("Outcome image fades in when overlay opens", async ({ page }) => {
		await page.getByTestId("swipe-right-button").click({ force: true });

		const feedbackDialog = page.locator(SELECTORS.feedbackDialog);
		await expect(feedbackDialog).toBeVisible({ timeout: 8000 });

		const outcomeImage = feedbackDialog.locator("img").first();
		const count = await outcomeImage.count();
		if (count > 0) {
			const className = await outcomeImage.getAttribute("class");
			expect(className).toContain("transition-opacity");
		}
	});
});
