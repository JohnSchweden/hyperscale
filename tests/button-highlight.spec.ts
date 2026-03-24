import { expect, test } from "@playwright/test";
import {
	getCard,
	getLeftButton,
	getRightButton,
	navigateToPlayingFast,
} from "./helpers/navigation";

test.use({ baseURL: "https://localhost:3000" });

/** Returns true if element has standalone `bg-cyan-500` class (not `hover:bg-cyan-500`). */
async function isHighlighted(
	el: Awaited<ReturnType<typeof getRightButton>>,
): Promise<boolean> {
	return el.evaluate((node) => node.classList.contains("bg-cyan-500"));
}

test.describe("Button Highlight on Swipe @area:input", () => {
	test("right button highlights when swiping right", async ({ page }) => {
		await navigateToPlayingFast(page);

		const card = await getCard(page);
		const box = await card.boundingBox();
		expect(box).toBeTruthy();

		const startX = box?.x + box?.width / 2;
		const startY = box?.y + box?.height / 2;

		// Not highlighted before swipe
		const rightButton = await getRightButton(page);
		expect(await isHighlighted(rightButton)).toBe(false);

		// Drag right
		await page.mouse.move(startX, startY);
		await page.mouse.down();
		await page.mouse.move(startX + 60, startY, { steps: 5 });
		await page.waitForTimeout(200);

		// Now highlighted (classList.contains checks exact token, not hover: variant)
		expect(await isHighlighted(rightButton)).toBe(true);

		await page.mouse.up();
	});

	test("left button highlights when swiping left", async ({ page }) => {
		await navigateToPlayingFast(page);

		const card = await getCard(page);
		const box = await card.boundingBox();
		expect(box).toBeTruthy();

		const startX = box?.x + box?.width / 2;
		const startY = box?.y + box?.height / 2;

		// Not highlighted before swipe
		const leftButton = await getLeftButton(page);
		expect(await isHighlighted(leftButton)).toBe(false);

		// Drag left
		await page.mouse.move(startX, startY);
		await page.mouse.down();
		await page.mouse.move(startX - 60, startY, { steps: 5 });
		await page.waitForTimeout(200);

		// Now highlighted
		expect(await isHighlighted(leftButton)).toBe(true);

		await page.mouse.up();
	});
});
