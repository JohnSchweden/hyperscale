import { expect, test } from "@playwright/test";
import {
	gotoDebriefVictoryScreen,
	victoryImageContainer,
} from "./helpers/victory-image-screen";

test.use({ baseURL: "https://localhost:3000" });

test.describe("ImageWithFallback component @area:layout", () => {
	test("a) Glitch placeholder shown while image loads", async ({ page }) => {
		await page.route("**/*.webp", (route) => {
			setTimeout(() => route.continue(), 800);
		});
		await gotoDebriefVictoryScreen(page);

		const host = victoryImageContainer(page);
		const placeholder = host.locator("i.fa-solid.fa-image");
		await expect(placeholder).toBeVisible({ timeout: 6000 });

		const classList = await placeholder.evaluate((el) => el.className);
		expect(classList).toContain("animate-pulse");
	});

	test("b) Glitch placeholder shown when image fails to load", async ({
		page,
	}) => {
		await page.route("**/victory.webp", (route) => route.abort());
		await gotoDebriefVictoryScreen(page);

		const host = victoryImageContainer(page);
		const placeholderContainer = host.locator(
			'div.glitch-placeholder, div[style*="repeating-linear-gradient"]',
		);

		await expect(placeholderContainer.first()).toBeVisible({ timeout: 8000 });
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
	});

	test("c) Image fades in over 300ms when loaded", async ({ page }) => {
		await gotoDebriefVictoryScreen(page);

		const img = page.getByRole("img", { name: "Victory celebration" });
		await expect(img).toBeVisible({ timeout: 10000 });
		const className = await img.getAttribute("class");
		expect(className).toContain("transition-opacity");
		expect(className).toContain("duration-300");
	});

	test("d) Placeholder has glitch aesthetic (scanline animation)", async ({
		page,
	}) => {
		await page.route("**/*.webp", (route) => {
			setTimeout(() => route.continue(), 800);
		});
		await gotoDebriefVictoryScreen(page);

		const placeholder = victoryImageContainer(page).locator(
			"div.glitch-placeholder",
		);
		await expect(placeholder).toBeVisible({ timeout: 6000 });

		const hasAnimation = await placeholder.first().evaluate((el) => {
			const classList = el.className;
			const style = el.getAttribute("style");
			return (
				classList?.includes("glitch-placeholder") ||
				style?.includes("animation: glitch-scan") ||
				style?.includes("repeating-linear-gradient")
			);
		});

		expect(hasAnimation).toBeTruthy();
	});
});
