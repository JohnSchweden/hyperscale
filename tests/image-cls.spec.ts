import { expect, test } from "@playwright/test";
import {
	ensureVictoryImageLoaded,
	gotoDebriefVictoryScreen,
} from "./helpers/victory-image-screen";

test.describe("Cumulative Layout Shift (CLS) prevention", () => {
	test.beforeEach(async ({ page }) => {
		await gotoDebriefVictoryScreen(page);
	});

	test("No layout shift when images load (CLS < 0.1)", async ({ page }) => {
		test.setTimeout(20000);

		const totalCLS = await page.evaluate(
			() =>
				new Promise<number>((resolve) => {
					let cls = 0;

					if (!("PerformanceObserver" in window)) {
						resolve(0);
						return;
					}

					try {
						const observer = new PerformanceObserver((list) => {
							for (const entry of list.getEntries()) {
								if (entry.entryType === "layout-shift") {
									const ls = entry as PerformanceEntry & {
										hadRecentInput: boolean;
										value: number;
									};
									if (!ls.hadRecentInput) cls += ls.value;
								}
							}
						});

						observer.observe({ entryTypes: ["layout-shift"] });

						setTimeout(() => {
							observer.disconnect();
							resolve(cls);
						}, 5000);
					} catch {
						resolve(0);
					}
				}),
		);

		if (totalCLS > 0) {
			expect(totalCLS).toBeLessThan(0.1);
		}
	});

	test("Aspect ratio containers prevent layout shift", async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 1600 });
		await gotoDebriefVictoryScreen(page);

		const aspectBox = page
			.getByRole("img", { name: "Victory celebration" })
			.locator("xpath=..");

		await ensureVictoryImageLoaded(page);

		const containerBefore = await aspectBox.boundingBox();
		await page.waitForTimeout(2000);
		const containerAfter = await aspectBox.boundingBox();
		expect(containerBefore).not.toBeNull();
		expect(containerAfter).not.toBeNull();
		if (!containerBefore || !containerAfter) return;

		const aspect = (b: { width: number; height: number }) => b.width / b.height;
		const r0 = aspect(containerBefore);
		const r1 = aspect(containerAfter);
		expect(r0).toBeCloseTo(r1, 1);
		expect(r0).toBeCloseTo(16 / 9, 1);
	});

	test("Square aspect ratio containers maintain 1:1 ratio", async ({
		page,
	}) => {
		const squareContainers = await page
			.locator('div[class*="aspect-square"]')
			.count();

		if (squareContainers > 0) {
			const boundingBox = await page
				.locator('div[class*="aspect-square"]')
				.first()
				.boundingBox();
			if (boundingBox) {
				const ratio = boundingBox.width / boundingBox.height;
				expect(ratio).toBeCloseTo(1, 0.1);
			}
		}
	});

	test("Images with overflow:hidden do not create scroll shifts", async ({
		page,
	}) => {
		const initialScrollWidth = await page.evaluate(
			() => document.documentElement.scrollWidth,
		);

		await page.waitForTimeout(3000);

		const finalScrollWidth = await page.evaluate(
			() => document.documentElement.scrollWidth,
		);

		expect(finalScrollWidth).toBeLessThanOrEqual(initialScrollWidth + 1);
	});
});
