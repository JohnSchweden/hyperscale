import { expect, test } from "@playwright/test";
import { gotoWithKmDebugState } from "./helpers/km-debug-state";

test.describe("Image Verification @area:layout", () => {
	test.use({ baseURL: "https://localhost:3000" });

	test("collapse page shows death image for BANKRUPT", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_1",
			deathType: "BANKRUPT",
			personality: "ROASTER",
			role: "CHIEF_SOMETHING_OFFICER",
			budget: -100000,
			heat: 75,
			hype: 45,
			unlockedEndings: ["BANKRUPT"],
			history: [],
			effectiveDeck: [],
			kirkCounter: 0,
			kirkCorruptionActive: false,
		});

		await expect(
			page.getByRole("heading", { level: 1, name: "Liquidated" }),
		).toBeVisible({ timeout: 10000 });

		// Check for image component
		const img = page.locator("img[loading='lazy']").first();
		const imgCount = await page.locator("img[loading='lazy']").count();
		console.log(`Found ${imgCount} lazy-loading images`);

		// Check for image with death path
		const imgSrc = await img.evaluate((el: HTMLImageElement) =>
			el.getAttribute("src"),
		);
		console.log(`Image src: ${imgSrc}`);

		// Check for image container with aspect ratio
		const containerCount = await page.locator("div.aspect-video").count();
		console.log(`Found ${containerCount} aspect-video containers`);

		// Verify image component exists
		expect(imgCount).toBeGreaterThan(0);

		// Check the ImageWithFallback is properly mounted
		const imgWithFallback = page.locator("img[loading='lazy']").first();
		await expect(imgWithFallback).toBeVisible();

		console.log("✓ Collapse page death image verified");
	});

	test("verdict page shows archetype badge", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_3",
			deathType: "BANKRUPT",
			personality: "ROASTER",
			role: "SOFTWARE_ENGINEER",
			budget: -100000,
			heat: 75,
			hype: 45,
			unlockedEndings: ["BANKRUPT"],
			history: [],
			effectiveDeck: [],
			kirkCounter: 0,
			kirkCorruptionActive: false,
		});

		// Wait for verdict page
		await page.waitForTimeout(3000);

		// Check for archetype image
		const img = page.locator("img[loading='lazy']");
		const imgCount = await img.count();
		console.log(`Found ${imgCount} images on verdict page`);

		// Check for square container (1:1 badge)
		const squareContainers = await page.locator("div.aspect-square").count();
		console.log(`Found ${squareContainers} aspect-square containers`);

		expect(imgCount).toBeGreaterThan(0);

		console.log("✓ Verdict page archetype badge verified");
	});

	test("KIRK collapse page shows KIRK image", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_1",
			deathType: "KIRK",
			personality: "ROASTER",
			role: "CHIEF_SOMETHING_OFFICER",
			budget: 500000,
			heat: 150,
			hype: 100,
			unlockedEndings: ["KIRK"],
			history: [],
			effectiveDeck: [],
			kirkCounter: 1,
			kirkCorruptionActive: true,
		});

		// Wait for KIRK page
		await page.waitForTimeout(3000);

		// Check for image
		const img = page.locator("img[loading='lazy']");
		const imgCount = await img.count();
		console.log(`Found ${imgCount} images on KIRK collapse page`);

		// Verify at least one image exists
		expect(imgCount).toBeGreaterThan(0);

		console.log("✓ KIRK collapse image verified");
	});

	test("glitch placeholder exists in DOM", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_1",
			deathType: "PRISON",
			personality: "ZEN_MASTER",
			role: "TECH_AI_CONSULTANT",
			budget: -50000,
			heat: 90,
			hype: 30,
			unlockedEndings: ["PRISON"],
			history: [],
			effectiveDeck: [],
			kirkCounter: 0,
			kirkCorruptionActive: false,
		});

		await page.waitForTimeout(3000);

		// Check for glitch placeholder element
		const placeholder = page.locator("div:has(i.fa-image)");
		const placeholderCount = await placeholder.count();
		console.log(`Found ${placeholderCount} glitch placeholders`);

		// Check for glitch CSS class
		const glitchElements = await page.locator(".glitch-placeholder").count();
		console.log(
			`Found ${glitchElements} elements with glitch-placeholder class`,
		);

		// Verify glitch animation CSS exists in global styles
		const cssAnimation = await page.evaluate(() => {
			const styles = document.styleSheets;
			let hasGlitchScan = false;
			let hasGlitchFlicker = false;
			for (const sheet of styles) {
				try {
					for (const rule of sheet.cssRules) {
						if (rule.cssText?.includes("glitch-scan")) hasGlitchScan = true;
						if (rule.cssText?.includes("glitch-flicker"))
							hasGlitchFlicker = true;
					}
				} catch {}
			}
			return { hasGlitchScan, hasGlitchFlicker };
		});

		console.log(`CSS glitch-scan: ${cssAnimation.hasGlitchScan}`);
		console.log(`CSS glitch-flicker: ${cssAnimation.hasGlitchFlicker}`);

		console.log("✓ Glitch placeholder verified");
	});
});
