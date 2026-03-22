import { expect, test } from "@playwright/test";
import { navigateToPlayingFast } from "./helpers/navigation";

test.use({ baseURL: "https://localhost:3000" });

test.describe("StarfieldBackground + taskbar speed (mobile) @smoke @area:layout", () => {
	test.use({ viewport: { width: 393, height: 851 } });

	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			window.localStorage.removeItem("k-maru-starfield-speed-scale");
			window.localStorage.removeItem("k-maru-bgm-volume");
			window.localStorage.removeItem("k-maru-bgm-enabled");
		});
	});

	test("canvas present; taskbar burger opens flyout and persists speed scale", async ({
		page,
	}) => {
		await navigateToPlayingFast(page);

		const canvas = page.getByTestId("starfield-canvas");
		await expect(canvas).toBeAttached();
		await expect(canvas).toBeVisible();

		const burger = page.getByRole("button", {
			name: /open game menu/i,
		});
		await expect(burger).toBeVisible();

		await burger.click();

		const flyout = page.locator("#starfield-speed-flyout");
		await expect(flyout).toBeVisible();

		const slider = page.locator("#starfield-speed-flyout-range");
		await expect(slider).toBeVisible();

		await slider.fill("1.45");

		const stored = await page.evaluate(() =>
			window.localStorage.getItem("k-maru-starfield-speed-scale"),
		);
		expect(stored).toBe("1.45");
	});

	test("flyout exposes background music controls and persists settings", async ({
		page,
	}) => {
		await navigateToPlayingFast(page);

		await page.getByRole("button", { name: /open game menu/i }).click();

		const flyout = page.locator("#starfield-speed-flyout");
		await expect(flyout).toBeVisible();

		const bgmSlider = page.locator("#bgm-volume-flyout-range");
		await expect(bgmSlider).toBeVisible();
		await bgmSlider.fill("0.35");

		const bgmVol = await page.evaluate(() =>
			window.localStorage.getItem("k-maru-bgm-volume"),
		);
		expect(bgmVol).toBe("0.35");

		await expect(
			page.getByRole("button", { name: /skip to next music track/i }),
		).toBeVisible();

		await page
			.getByRole("button", { name: /skip to next music track/i })
			.click();

		await page.getByRole("button", { name: /pause background music/i }).click();
		const enabled = await page.evaluate(() =>
			window.localStorage.getItem("k-maru-bgm-enabled"),
		);
		expect(enabled).toBe("false");

		await page
			.getByRole("button", { name: /resume background music/i })
			.click();
		const enabledAfter = await page.evaluate(() =>
			window.localStorage.getItem("k-maru-bgm-enabled"),
		);
		expect(enabledAfter).toBe("true");
	});
});
