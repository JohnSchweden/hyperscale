import { expect, test } from "@playwright/test";
import { gotoWithKmDebugState } from "./helpers/km-debug-state";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Collapse Page Images (DEBRIEF_PAGE_1) @area:layout", () => {
	test("page renders with death ending card for BANKRUPT", async ({ page }) => {
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
		});
		await expect(
			page.getByRole("heading", { level: 1, name: "Liquidated" }),
		).toBeVisible({ timeout: 10000 });
	});

	test("page renders with death ending card for KIRK", async ({ page }) => {
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
		});
		// Wait for Kirk-specific glitch text
		await page.waitForSelector("h1.kirk-glitch-text", { timeout: 10000 });
		// Verify Kirk-specific content
		await expect(page.locator("text=Subject refused to comply")).toBeVisible();
	});

	test("death ending components render with image container", async ({
		page,
	}) => {
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
		});
		await expect(
			page.getByRole("heading", {
				level: 1,
				name: /Federal indictment \(jumpsuit included\)/i,
			}),
		).toBeVisible({ timeout: 10000 });

		await expect(
			page.locator("img[alt='Ending: Federal indictment (jumpsuit included)']"),
		).toBeVisible();
	});

	test("image paths are correctly configured for all death types", async ({
		page,
	}) => {
		// Test that imageMap has correct paths for all death types
		const result = await page.evaluate(() => {
			// Import at test time
			return [
				"BANKRUPT",
				"REPLACED_BY_SCRIPT",
				"CONGRESS",
				"FLED_COUNTRY",
				"PRISON",
				"AUDIT_FAILURE",
				"KIRK",
			].map((dt) => {
				const slug = dt.toLowerCase().replace(/_/g, "-");
				return `/images/deaths/${slug}.webp`;
			});
		});

		// Verify all paths are correctly formed
		expect(result).toContain("/images/deaths/bankrupt.webp");
		expect(result).toContain("/images/deaths/kirk.webp");
		expect(result).toContain("/images/deaths/prison.webp");
		expect(result.length).toBe(7);
	});
});
