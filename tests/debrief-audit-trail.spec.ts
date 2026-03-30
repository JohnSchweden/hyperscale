import { expect, test } from "@playwright/test";
import { gotoWithKmDebugState } from "./helpers/km-debug-state";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Debrief Audit Trail - Choice Labels @area:gameplay", () => {
	test("displays human-readable choice labels instead of raw LEFT/RIGHT", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
			],
		});

		// Wait for the page to load
		await page.waitForSelector("h1", { timeout: 10000 });

		// Verify the audit log heading is displayed
		const heading = await page.locator("h1").textContent();
		expect(heading).toMatch(/incident audit log/i);

		// Get page content to verify no raw LEFT/RIGHT labels
		const pageContent = await page.content();

		// Page should not show raw LEFT/RIGHT as standalone uppercase text in badges
		// The implementation shows outcome.label instead (like "Let the AI handle it")
		expect(pageContent).not.toMatch(/>LEFT</);
		expect(pageContent).not.toMatch(/>RIGHT</);
	});

	test("shows appropriate styling for safe (LEFT) vs risky (RIGHT) choices", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
			],
		});

		// Wait for the page to load
		await page.waitForSelector("h1", { timeout: 10000 });

		// Choice badges: cyan when fine===0, amber when fine>0 (LEFT vs RIGHT varies by card outcome)
		const pageContent = await page.content();

		// Verify styling classes exist for both badge variants (se_security_patch_timeline: LEFT cyan, refactor RIGHT amber)
		expect(pageContent).toMatch(/cyan-500/);
		expect(pageContent).toMatch(/amber-500/);
	});

	test("displays both LEFT and RIGHT outcome forks for each decision", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		await page.waitForSelector("h1", { timeout: 10000 });

		// Verify fork segments with direction labels
		const pageContent = await page.content();

		// Each audit entry should show both "Swipe left" and "Swipe right" labels
		const leftSwipeMatches = (pageContent.match(/Swipe left/gi) || []).length;
		const rightSwipeMatches = (pageContent.match(/Swipe right/gi) || []).length;

		expect(leftSwipeMatches).toBeGreaterThan(0);
		expect(rightSwipeMatches).toBeGreaterThan(0);
	});

	test("highlights chosen fork branch with cyan/amber badge, mutes unchosen branch", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		await page.waitForSelector("h1", { timeout: 10000 });

		// Verify chosen branch has strong styling, unchosen has muted styling
		const pageContent = await page.content();

		// Both variants should be present (one entry with 2 forks = 2 badges)
		expect(pageContent).toMatch(/cyan-500|amber-500/); // chosen badge
		expect(pageContent).toMatch(/text-slate-400/); // muted text
		expect(pageContent).toMatch(/bg-black\/30/); // muted background
	});

	test("displays consequences for both chosen and unchosen outcomes in fork", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
			],
		});

		await page.waitForSelector("h1", { timeout: 10000 });

		// Multiple entries = multiple consequence blocks
		const pageContent = await page.content();

		// Consequence label should appear in both left and right branches for each entry
		const consequenceMatches = (pageContent.match(/Consequence:/gi) || [])
			.length;

		// 2 entries × 2 forks (left + right) = 4 consequence lines minimum
		expect(consequenceMatches).toBeGreaterThanOrEqual(4);
	});

	test("displays sender and decision number for each decision", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		// Wait for the page to load
		await page.waitForSelector("h1", { timeout: 10000 });

		// Verify decision number is shown
		const pageContent = await page.content();
		expect(pageContent).toContain("#1");

		// Verify audit entry structure exists (glass panels use rounded-xl)
		const auditEntries = page.locator(
			"div.mb-6.text-left div.space-y-4 > div.rounded-xl",
		);
		await expect(auditEntries.first()).toBeVisible();
	});
});

test.describe("Debrief Audit Trail - Description Length @area:layout", () => {
	test("shows card descriptions with meaningful content", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		// Wait for the page to load
		await page.waitForSelector("h1", { timeout: 10000 });

		// Audit rows: glass panels (border-white/10, bg-black/65), not bg-slate-900
		const auditEntries = page.locator(
			"div.mb-6.text-left div.space-y-4 > div.rounded-xl",
		);
		await expect(auditEntries.first()).toBeVisible();
	});

	test("shows full long card descriptions inline", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		await page.waitForSelector("h1", { timeout: 10000 });

		await expect(page.getByText(/show more|show less/i)).toHaveCount(0);
		await expect(page.getByText(/might miss edge cases/)).toBeVisible();
	});
});

test.describe("Debrief Audit Trail - Consequence Display @area:layout", () => {
	test("displays consequences with hype, heat, or fine information", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
			],
		});

		// Wait for the page to load
		await page.waitForSelector("h1", { timeout: 10000 });

		// The component shows consequences - verify consequence-related text exists
		const pageContent = await page.content();
		expect(pageContent).toMatch(/hype|heat|fine|change/i);
	});

	test("audit trail page loads without errors", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_code_quality_refactor", choice: "RIGHT" }],
		});

		// Verify audit log heading is displayed
		await page.waitForSelector("h1", { timeout: 10000 });
		const heading = await page.locator("h1").textContent();
		expect(heading).toMatch(/incident audit log/i);
	});
});
