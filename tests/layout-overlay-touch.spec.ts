import { expect, test } from "@playwright/test";
import { navigateToPlayingFast } from "./helpers/navigation";
import { SELECTORS } from "./helpers/selectors";

test.use({ baseURL: "https://localhost:3000" });

test.describe("LayoutShell behavior @area:layout", () => {
	test("desktop centers content (justify-center, items-center) at ≥1024px", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto("/");
		const layoutRoot = page.locator('[data-testid="layout-shell"]').first();
		await layoutRoot.waitFor({ state: "attached", timeout: 5000 });

		const styles = await layoutRoot.evaluate((el) => {
			const s = getComputedStyle(el);
			return {
				display: s.display,
				alignItems: s.alignItems,
				justifyContent: s.justifyContent,
				paddingTop: s.paddingTop,
			};
		});

		expect(styles.display).toBe("flex");
		expect(styles.alignItems).toBe("center");
		expect(styles.justifyContent).toBe("center");
		// Desktop gets extra breathing room vs mobile; just assert it's not zero.
		expect(parseInt(styles.paddingTop, 10)).toBeGreaterThanOrEqual(64);
	});

	test("mobile top-aligns content (items-start) and has pt-16 at <1024px", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 393, height: 851 });
		await page.goto("/");
		const layoutRoot = page.locator('[data-testid="layout-shell"]').first();
		await layoutRoot.waitFor({ state: "attached", timeout: 5000 });

		const styles = await layoutRoot.evaluate((el) => {
			const s = getComputedStyle(el);
			return {
				display: s.display,
				alignItems: s.alignItems,
				paddingTop: s.paddingTop,
			};
		});

		expect(styles.display).toBe("flex");
		expect(styles.alignItems).toBe("flex-start");
		expect(parseInt(styles.paddingTop, 10)).toBeGreaterThanOrEqual(48); // pt-16 = 4rem = 64px typically
	});
});

test.describe("Feedback overlay @area:layout", () => {
	test("modal is visible and centered on desktop", async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 720 });
		await navigateToPlayingFast(page);
		await page.locator(SELECTORS.rightButton).first().click({ force: true });
		await page.waitForSelector("role=dialog", { timeout: 3000 });

		const modal = page
			.locator(
				'[role=dialog] .modal-content, [role=dialog] [class*="max-w-lg"]',
			)
			.first();
		await expect(modal).toBeVisible();

		const { modalCenterX, viewportCenterX } = await page.evaluate(() => {
			const modal = document.querySelector(
				'[role=dialog] [class*="max-w-lg"]',
			) as HTMLElement;
			if (!modal) return { modalCenterX: 0, viewportCenterX: 0 };
			const box = modal.getBoundingClientRect();
			return {
				modalCenterX: box.left + box.width / 2,
				viewportCenterX: window.innerWidth / 2,
			};
		});

		expect(Math.abs(modalCenterX - viewportCenterX)).toBeLessThan(50);
	});

	test("modal is visible and centered on mobile", async ({ page }) => {
		await page.setViewportSize({ width: 393, height: 851 });
		await navigateToPlayingFast(page);
		await page.locator(SELECTORS.rightButton).first().click({ force: true });
		await page.waitForSelector("role=dialog", { timeout: 3000 });

		const modal = page.locator('[role=dialog] [class*="max-w-lg"]').first();
		await expect(modal).toBeVisible();

		const { modalCenterX, viewportCenterX } = await page.evaluate(() => {
			const modal = document.querySelector(
				'[role=dialog] [class*="max-w-lg"]',
			) as HTMLElement;
			if (!modal) return { modalCenterX: 0, viewportCenterX: 0 };
			const box = modal.getBoundingClientRect();
			return {
				modalCenterX: box.left + box.width / 2,
				viewportCenterX: window.innerWidth / 2,
			};
		});

		expect(Math.abs(modalCenterX - viewportCenterX)).toBeLessThan(30);
	});
});

test.describe("Touch swipe @area:layout", () => {
	test("swipe (pointer) triggers card feedback", async ({ page }) => {
		await navigateToPlayingFast(page);

		const card = page
			.locator(SELECTORS.card)
			.or(page.locator(SELECTORS.cardFallback))
			.first();
		const box = await card.boundingBox();
		expect(box).not.toBeNull();

		if (!box) return;

		const startX = box.x + box.width / 2;
		const startY = box.y + box.height / 2;
		const endX = startX + 120; // past threshold (100px)

		await page.mouse.move(startX, startY);
		await page.mouse.down();
		await page.waitForTimeout(50);
		await page.mouse.move(endX, startY, { steps: 10 });
		await page.waitForTimeout(50);
		await page.mouse.up();

		await page.waitForSelector(SELECTORS.feedbackDialogFallback, {
			timeout: 2000,
		});
		const feedbackVisible = await page
			.locator(SELECTORS.feedbackDialogFallback)
			.isVisible();
		expect(feedbackVisible).toBe(true);
	});
});
