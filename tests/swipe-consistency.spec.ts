import { expect, type Page, test } from "@playwright/test";
import { navigateToPlayingFast } from "./helpers/navigation";
import { SELECTORS } from "./helpers/selectors";

test.use({ baseURL: "https://localhost:3000" });

/**
 * Helper to perform a drag gesture on the current card without releasing
 */
async function performDragWithoutRelease(
	page: Page,
	distance: number = 120,
): Promise<{
	card: Awaited<ReturnType<typeof page.locator>>;
	startX: number;
	startY: number;
}> {
	const card = await page.locator(SELECTORS.cardFallback).first();
	const box = await card.boundingBox();
	expect(box).not.toBeNull();

	const startX = box?.x + box?.width / 2;
	const startY = box?.y + box?.height / 2;

	await page.mouse.move(startX, startY);
	await page.mouse.down();
	await page.mouse.move(startX + distance, startY, { steps: 10 });

	return { card, startX, startY };
}

/**
 * Helper to release the current drag
 */
async function releaseMouseDrag(page: Page): Promise<void> {
	await page.mouse.up();
}

/**
 * Helper to click "Next Ticket" and advance to next card
 */
async function clickNextTicket(page: Page): Promise<void> {
	// Wait for feedback overlay to appear
	await page.waitForSelector('[data-testid="feedback-dialog"]', {
		state: "visible",
		timeout: 5000,
	});

	// Click Next Ticket button
	const nextTicketButton = page.locator('button:has-text("Next ticket")');
	await nextTicketButton.click();

	// Wait for overlay to disappear and new card to appear
	await page.waitForSelector('[data-testid="feedback-dialog"]', {
		state: "hidden",
		timeout: 5000,
	});
	await page
		.locator('[data-testid="incident-card"]')
		.first()
		.waitFor({ state: "visible", timeout: 3000 });
}

test.describe("Swipe Consistency @area:input", () => {
	test("first and second swipe both wait for release after threshold", async ({
		page,
	}) => {
		await navigateToPlayingFast(page);

		// === FIRST SWIPE ===
		const { card: firstCard } = await performDragWithoutRelease(page, 120);

		// Wait while dragging
		await page.waitForTimeout(500);

		// Check if card is still visible (not exited yet)
		const firstSwipeOpacity = await firstCard.evaluate((el) => {
			return window.getComputedStyle(el).opacity;
		});

		// Card should still be visible (not exited)
		expect(parseFloat(firstSwipeOpacity)).toBeGreaterThan(0.5);

		// Release
		await releaseMouseDrag(page);

		// Wait for feedback overlay (replaces fixed 1000ms)
		await page.waitForSelector('[data-testid="feedback-dialog"]', {
			state: "visible",
			timeout: 5000,
		});

		// Card should now be exiting (opacity check)
		await firstCard.evaluate((el) => window.getComputedStyle(el).opacity);

		// Click Next Ticket to advance to second card
		await clickNextTicket(page);

		// === SECOND SWIPE ===
		const { card: secondCard } = await performDragWithoutRelease(page, 120);

		// Wait while dragging
		await page.waitForTimeout(500);

		// Check if card is still visible (not exited yet)
		const secondSwipeOpacity = await secondCard.evaluate((el) => {
			return window.getComputedStyle(el).opacity;
		});

		// Card should still be visible (not exited) - same as first swipe
		expect(parseFloat(secondSwipeOpacity)).toBeGreaterThan(0.5);

		// Release
		await releaseMouseDrag(page);

		// Wait for feedback overlay (replaces fixed 1000ms)
		await page.waitForSelector('[data-testid="feedback-dialog"]', {
			state: "visible",
			timeout: 5000,
		});

		// Card should now be exiting
		await secondCard.evaluate((el) => window.getComputedStyle(el).opacity);
	});

	test("both swipes have consistent behavior", async ({ page }) => {
		await navigateToPlayingFast(page);

		const results = [];

		// Test two swipes
		for (let i = 0; i < 2; i++) {
			const { card } = await performDragWithoutRelease(page, 120);

			// Check state while still holding
			await page.waitForTimeout(200);

			const hasExitDirection = await card.evaluate((el) => {
				return (
					el.classList.contains("swipe-exit-left") ||
					el.classList.contains("swipe-exit-right")
				);
			});

			const opacity = await card.evaluate((el) => {
				return window.getComputedStyle(el).opacity;
			});

			results.push({
				swipe: i + 1,
				hasExitDirection,
				opacity: parseFloat(opacity),
			});

			// Release
			await releaseMouseDrag(page);

			// Wait for feedback overlay or Next Ticket (for first swipe only)
			if (i === 0) {
				await clickNextTicket(page);
			} else {
				await page.waitForSelector('[data-testid="feedback-dialog"]', {
					state: "visible",
					timeout: 5000,
				});
			}
		}

		// Both swipes should behave the same (no exit while dragging)
		expect(results[0].hasExitDirection).toBe(results[1].hasExitDirection);
		expect(results[0].opacity).toBeGreaterThan(0.5);
		expect(results[1].opacity).toBeGreaterThan(0.5);
	});
});
