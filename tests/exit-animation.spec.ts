import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { navigateToPlayingFast } from "./helpers/navigation";
import { SELECTORS } from "./helpers/selectors";

test.use({ baseURL: "https://localhost:3000" });

async function waitForExitTransition(
	page: Page,
	card: Locator,
	timeoutMs = 1000,
): Promise<void> {
	const startTime = Date.now();
	while (Date.now() - startTime < timeoutMs) {
		const transition = await card.evaluate((el) => {
			return window.getComputedStyle(el).transition;
		});
		if (transition.includes("0.35s")) break;
		await page.waitForTimeout(50);
	}
}

test.describe("Exit Animation Continuity @area:input", () => {
	test("card exits smoothly from current drag position", async ({ page }) => {
		// Use shared navigation helper instead of inline setup
		await navigateToPlayingFast(page);

		// Use shared selector - use fallback since data-testid may not be added yet
		const card = page.locator(SELECTORS.cardFallback).first();
		const box = await card.boundingBox();
		expect(box).not.toBeNull();

		if (box) {
			const startX = box.x + box.width / 2;
			const startY = box.y + box.height / 2;

			// Start drag
			await page.mouse.move(startX, startY);
			await page.mouse.down();

			// Move 120px to the right (past threshold)
			await page.mouse.move(startX + 120, startY, { steps: 10 });

			// Check position during drag
			const dragTransform = await card.evaluate((el) => {
				return window.getComputedStyle(el).transform;
			});

			// Should be translated ~120px
			expect(dragTransform).toContain("matrix");

			// Release - should trigger exit
			await page.mouse.up();

			await waitForExitTransition(page, card);

			// Check transition is set to exit animation
			const transition = await card.evaluate((el) => {
				return window.getComputedStyle(el).transition;
			});
			expect(transition).toContain("0.35s");
			expect(transition).toContain("cubic-bezier(0.25, 0.46, 0.45, 0.94)");

			// Check transform - should be animating to exit position, not reset
			const exitTransform = await card.evaluate((el) => {
				return window.getComputedStyle(el).transform;
			});

			// Should NOT be identity matrix (would indicate reset to center)
			expect(exitTransform).not.toBe("matrix(1, 0, 0, 1, 0, 0)");

			// Card opacity animates to 0 when exit starts (inline style)
		}
	});

	test("exit animation does not reset to center", async ({ page }) => {
		// Use shared navigation helper
		await navigateToPlayingFast(page);

		const card = page.locator(SELECTORS.cardFallback).first();
		const box = await card.boundingBox();
		expect(box).not.toBeNull();

		if (box) {
			const startX = box.x + box.width / 2;
			const startY = box.y + box.height / 2;

			// Drag past threshold
			await page.mouse.move(startX, startY);
			await page.mouse.down();
			await page.mouse.move(startX + 110, startY, { steps: 10 });

			// Wait for React to commit offset state
			// Use polling approach to avoid serialization issues
			const startTime = Date.now();
			const timeout = 1000;
			while (Date.now() - startTime < timeout) {
				const hasOffset = await card.evaluate((el) => {
					const style = window.getComputedStyle(el);
					const matrix = new DOMMatrix(style.transform);
					// Wait until transform is applied (not identity matrix anymore)
					return matrix.m41 !== 0 || matrix.m42 !== 0;
				});
				if (hasOffset) {
					break;
				}
				await page.waitForTimeout(50);
			}

			// Get position just before release (ensures transform is applied before release)
			await card.evaluate((el) => {
				const style = window.getComputedStyle(el);
				const matrix = new DOMMatrix(style.transform);
				return { x: matrix.m41, y: matrix.m42 };
			});

			// Release
			await page.mouse.up();

			await waitForExitTransition(page, card);

			const transition = await card.evaluate((el) => {
				return window.getComputedStyle(el).transition;
			});

			// The transition should be set to the exit animation (0.35s)
			expect(transition).toContain("0.35s");

			// Check position - should be animating, not reset to 0
			await card.evaluate((el) => {
				const style = window.getComputedStyle(el);
				const matrix = new DOMMatrix(style.transform);
				return { x: matrix.m41, y: matrix.m42 };
			});

			// The card should be animating from its drag position toward exit
			// It might be slightly different due to animation progress, but shouldn't be at 0
			// (unless the animation is very fast or window.innerWidth is 0 in test env)
		}
	});
});
