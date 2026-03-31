import { expect, type Page } from "@playwright/test";
import { gotoWithKmDebugState } from "./km-debug-state";

/** Debrief page 1 (quarter survived) — includes `ImageWithFallback` for victory art. */
export async function gotoDebriefVictoryScreen(page: Page): Promise<void> {
	await gotoWithKmDebugState(page, {
		stage: "DEBRIEF_PAGE_1",
		deathType: null,
		deathReason: null,
		hype: 75,
		heat: 50,
		budget: 1_500_000,
		unlockedEndings: [],
		history: [],
		currentCardIndex: 10,
	});
}

/** Parent of the victory `<img>` — `aspect-video` container with glitch layer. */
export function victoryImageContainer(page: Page) {
	return page.getByRole("img", { name: "Victory celebration" }).locator("..");
}

/** `loading="lazy"` victory art — scroll into view so the browser fetches and decodes. */
export async function ensureVictoryImageLoaded(page: Page): Promise<void> {
	const img = page.getByRole("img", { name: "Victory celebration" });
	await img.scrollIntoViewIfNeeded();
	await page.waitForFunction(
		() => {
			const el = document.querySelector(
				'img[alt="Victory celebration"]',
			) as HTMLImageElement | null;
			return Boolean(el?.complete && el.naturalWidth > 0);
		},
		{ timeout: 20000 },
	);
	await expect(img).toHaveCSS("opacity", "1", { timeout: 15000 });
}
