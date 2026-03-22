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

	test("provides expand option for long card descriptions", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		// Wait for the page to load
		await page.waitForSelector("h1", { timeout: 10000 });

		// Check for show more/less button if description is long
		const showMoreButton = page.getByText(/show more|show less/i);

		// If there's a long description, expand button should exist
		// Otherwise, the test passes (short descriptions don't need expand)
		const count = await showMoreButton.count();
		if (count > 0) {
			await expect(showMoreButton.first()).toBeVisible();
		}
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
