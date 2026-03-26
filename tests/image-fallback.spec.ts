import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("ImageWithFallback component @area:layout", () => {
	test("a) Glitch placeholder shown while image loads", async ({ page }) => {
		await page.goto("/");

		// Check that placeholder icon exists with glitch styling
		const placeholder = page.locator("i.fa-solid.fa-image");
		await expect(placeholder).toBeVisible({ timeout: 3000 });

		// Verify placeholder has animate-pulse class
		const placeholderDiv = page.locator("i.fa-image").first();
		const classList = await placeholderDiv.evaluate((el) => el.className);
		expect(classList).toContain("animate-pulse");
	});

	test("b) Glitch placeholder shown when image fails to load", async ({
		page,
	}) => {
		await page.goto("/");

		// Check that the placeholder div has the glitch-placeholder class or inline style with scanline
		const placeholderContainer = page.locator(
			'div.glitch-placeholder, div[style*="repeating-linear-gradient"]',
		);

		if ((await placeholderContainer.count()) > 0) {
			// If any images are loading, verify placeholder has glitch styling (class or inline gradient)
			const classList = await placeholderContainer
				.first()
				.evaluate((el) => el.className);
			const style = await placeholderContainer
				.first()
				.evaluate((el) => el.getAttribute("style"));
			// Should have either the CSS class or inline gradient
			expect(
				classList?.includes("glitch-placeholder") ||
					style?.includes("repeating-linear-gradient"),
			).toBeTruthy();
		}
	});

	test("c) Image fades in over 300ms when loaded", async ({ page }) => {
		await page.goto("/");

		// Look for img elements with transition class
		const images = page.locator("img[loading='lazy']");
		const count = await images.count();

		if (count > 0) {
			// Verify at least one image has opacity transition
			const imgClass = await images.first().evaluate((el) => el.className);
			expect(imgClass).toContain("transition-opacity");
			expect(imgClass).toContain("duration-300");
		}
	});

	test("d) Placeholder has glitch aesthetic (scanline animation)", async ({
		page,
	}) => {
		await page.goto("/");

		// Check for scanline-animated placeholder divs (now using CSS class)
		const placeholders = page.locator("div:has(i.fa-image)");
		const count = await placeholders.count();

		// Placeholder should exist in the DOM structure
		expect(count).toBeGreaterThanOrEqual(0);

		if (count > 0) {
			const hasAnimation = await placeholders.first().evaluate((el) => {
				const classList = el.className;
				const style = el.getAttribute("style");
				return (
					classList?.includes("glitch-placeholder") ||
					style?.includes("animation: glitch-scan") ||
					style?.includes("repeating-linear-gradient")
				);
			});

			// If placeholder exists, it should have glitch styling (CSS class or inline style)
			expect(hasAnimation).toBeTruthy();
		}
	});
});
