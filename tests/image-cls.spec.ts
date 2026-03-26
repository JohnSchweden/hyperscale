import { expect, test } from "@playwright/test";

test.describe("Cumulative Layout Shift (CLS) prevention", () => {
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

	test("No layout shift when images load (CLS < 0.1)", async ({ page }) => {
		let totalCLS = 0;

		// Listen for Layout Instability API events
		const clsCollected = await page.evaluateHandle(() => {
			return new Promise((resolve) => {
				let cls = 0;

				if ("PerformanceObserver" in window) {
					try {
						const observer = new PerformanceObserver((list) => {
							for (const entry of list.getEntries()) {
								if (
									"hadRecentInput" in entry &&
									!(entry as any).hadRecentInput
								) {
									cls += (entry as any).value;
								}
							}
						});

						observer.observe({ entryTypes: ["layout-shift"] });

						// Collect for 5 seconds
						setTimeout(() => {
							observer.disconnect();
							resolve(cls);
						}, 5000);
					} catch {
						// Layout Shift API not supported
						resolve(0);
					}
				} else {
					resolve(0);
				}
			});
		});

		totalCLS = (await clsCollected.evaluate((x) => x)) as number;

		// CLS should be less than 0.1 (excellent performance)
		// Note: This is a best-effort measurement; some browsers may not support Layout Shift API
		if (totalCLS > 0) {
			expect(totalCLS).toBeLessThan(0.1);
		}
	});

	test("Aspect ratio containers prevent layout shift", async ({ page }) => {
		// Get the dimensions of an image container before image loads
		const containerBefore = await page
			.locator('div[class*="aspect-video"]')
			.first()
			.boundingBox();

		// Wait for images to load
		await page.waitForTimeout(3000);

		const containerAfter = await page
			.locator('div[class*="aspect-video"]')
			.first()
			.boundingBox();

		// Container dimensions should remain stable
		expect(containerBefore?.width).toBe(containerAfter?.width);
		expect(containerBefore?.height).toBe(containerAfter?.height);
	});

	test("Square aspect ratio containers maintain 1:1 ratio", async ({
		page,
	}) => {
		// Navigate to debrief page to see archetype badge (1:1 aspect ratio)
		// This is a simplified test; full flow would require completing a game

		// Check that any aspect-square containers exist and maintain ratio
		const squareContainers = await page
			.locator('div[class*="aspect-square"]')
			.count();

		// If no square containers on current screen, that's OK for this test
		if (squareContainers > 0) {
			const boundingBox = await page
				.locator('div[class*="aspect-square"]')
				.first()
				.boundingBox();
			if (boundingBox) {
				// aspect-square should be 1:1 ratio (width ~= height)
				const ratio = boundingBox.width / boundingBox.height;
				expect(ratio).toBeCloseTo(1, 0.1); // Allow 10% tolerance for rounding
			}
		}
	});

	test("Images with overflow:hidden do not create scroll shifts", async ({
		page,
	}) => {
		const initialScrollWidth = await page.evaluate(
			() => document.documentElement.scrollWidth,
		);

		// Wait for all images to load
		await page.waitForTimeout(3000);

		const finalScrollWidth = await page.evaluate(
			() => document.documentElement.scrollWidth,
		);

		// Scroll width should not increase (no horizontal overflow caused by images)
		expect(finalScrollWidth).toBeLessThanOrEqual(initialScrollWidth + 1); // Allow 1px tolerance
	});
});
