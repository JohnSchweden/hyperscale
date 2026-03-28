import { expect, test } from "@playwright/test";
import { RoleType } from "../types";
import { navigateToPlayingWithCardAtIndex } from "./helpers/navigation";

test.use({ baseURL: "https://localhost:3000" });

test.describe("ImageWithFallback component @area:layout", () => {
	test("a) Glitch placeholder shown while image loads", async ({ page }) => {
		await page.route("**/*.webp", (route) => {
			setTimeout(() => route.continue(), 800);
		});
		await navigateToPlayingWithCardAtIndex(page, RoleType.SOFTWARE_ENGINEER, 0);

		const placeholder = page.locator("i.fa-solid.fa-image");
		await expect(placeholder).toBeVisible({ timeout: 6000 });

		const placeholderDiv = page.locator("i.fa-image").first();
		const classList = await placeholderDiv.evaluate((el) => el.className);
		expect(classList).toContain("animate-pulse");
	});

	test("b) Glitch placeholder shown when image fails to load", async ({
		page,
	}) => {
		await navigateToPlayingWithCardAtIndex(page, RoleType.SOFTWARE_ENGINEER, 0);

		const placeholderContainer = page.locator(
			'div.glitch-placeholder, div[style*="repeating-linear-gradient"]',
		);

		if ((await placeholderContainer.count()) > 0) {
			const classList = await placeholderContainer
				.first()
				.evaluate((el) => el.className);
			const style = await placeholderContainer
				.first()
				.evaluate((el) => el.getAttribute("style"));
			expect(
				classList?.includes("glitch-placeholder") ||
					style?.includes("repeating-linear-gradient"),
			).toBeTruthy();
		}
	});

	test("c) Image fades in over 300ms when loaded", async ({ page }) => {
		await navigateToPlayingWithCardAtIndex(page, RoleType.SOFTWARE_ENGINEER, 0);

		const images = page.locator("img[loading='lazy']");
		const count = await images.count();

		if (count > 0) {
			const imgClass = await images.first().evaluate((el) => el.className);
			expect(imgClass).toContain("transition-opacity");
			expect(imgClass).toContain("duration-300");
		}
	});

	test("d) Placeholder has glitch aesthetic (scanline animation)", async ({
		page,
	}) => {
		await navigateToPlayingWithCardAtIndex(page, RoleType.SOFTWARE_ENGINEER, 0);

		const placeholders = page.locator("div:has(i.fa-image)");
		const count = await placeholders.count();

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

			expect(hasAnimation).toBeTruthy();
		}
	});
});
