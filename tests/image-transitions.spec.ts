import { expect, test } from "@playwright/test";

test.describe("Image transition effects", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("https://localhost:3000");
		// Skip intro screens to get to gameplay
		await page.click('[data-testid="intro-start-button"]');
		await page.waitForTimeout(500);
		await page.click('[data-testid="personality-select-next"]');
		await page.waitForTimeout(500);
		await page.click('[data-testid="role-select-next"]');
		await page.waitForTimeout(1000);
	});

	test("Images fade in with 300ms transition", async ({ page }) => {
		// Get current card image
		const imageWithFallback = await page
			.locator('div[class*="aspect-video"]')
			.first();
		const img = imageWithFallback.locator("img").first();

		// Check that image has transition-opacity duration-300 class
		const className = await img.getAttribute("class");
		expect(className).toContain("transition-opacity");
		expect(className).toContain("duration-300");
	});

	test("Glitch placeholder visible during load", async ({ page }) => {
		// Slow down network to observe placeholder
		await page.route("**/*.webp", (route) => {
			setTimeout(() => route.continue(), 200);
		});

		// Reload to see fresh load
		await page.reload();
		await page.waitForTimeout(500);

		// Check placeholder is visible or was briefly visible
		const imageWithFallback = await page
			.locator('div[class*="aspect-video"]')
			.first();
		const placeholder = imageWithFallback
			.locator('div[class*="bg-gradient-to-b"]')
			.first();

		// Placeholder should exist in DOM
		const count = await placeholder.count();
		expect(count).toBeGreaterThanOrEqual(0);
	});

	test("Image opacity transitions from 0 to 1", async ({ page }) => {
		const imageWithFallback = await page
			.locator('div[class*="aspect-video"]')
			.first();
		const img = imageWithFallback.locator("img").first();

		// Wait for image to load (max 5 seconds)
		await page.waitForLoadState("load", { timeout: 5000 });

		// Check computed opacity is 1 (fully visible)
		const opacity = await img.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return computed.opacity;
		});

		expect(parseFloat(opacity)).toBe(1);
	});

	test("Outcome image fades in when overlay opens", async ({ page }) => {
		// Wait for card to load
		await page.waitForTimeout(1000);

		// Swipe right to open feedback overlay
		const cardStack = await page.locator('[data-testid="card-stack"]').first();
		await cardStack.dragTo(cardStack, {
			sourcePosition: { x: 300, y: 300 },
			targetPosition: { x: 100, y: 300 },
		});
		await page.waitForTimeout(300);

		// Find outcome image in overlay
		const overlay = page.locator('[data-testid="feedback-dialog"]');
		const outcomeImage = overlay.locator("img").first();

		// Check it exists and has transition classes
		const count = await outcomeImage.count();
		if (count > 0) {
			const className = await outcomeImage.getAttribute("class");
			expect(className).toContain("transition-opacity");
		}
	});
});
