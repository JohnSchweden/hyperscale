import { expect, test } from "@playwright/test";
import { gotoWithKmDebugState } from "./helpers/km-debug-state";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Debrief Reflection Hints @area:gameplay", () => {
	test("shows hints for LEFT (safe) choices suggesting riskier alternatives", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		// Should show hint for safe choice
		await expect(page.getByText(/you played it safe/i)).toBeVisible();
		await expect(page.getByText(/next time, try/i)).toBeVisible();
	});

	test("shows hints for RIGHT (risky) choices suggesting safer alternatives", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "RIGHT" }],
		});

		// Should show hint for risky choice
		await expect(page.getByText(/you took a risk/i)).toBeVisible();
		await expect(page.getByText(/avoid the heat and fines/i)).toBeVisible();
	});

	test("shows hints for mixed LEFT and RIGHT choices", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
				{ cardId: "se_code_quality_refactor", choice: "LEFT" },
			],
		});

		// Should show hints section header
		await expect(page.getByText(/path you didn't take/i)).toBeVisible();

		// Should show multiple decision hints
		const decisionHints = page.locator("text=/Decision \\d+:/i");
		await expect(decisionHints).toHaveCount(3);
	});

	test("hints include specific alternative action labels", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
			],
		});

		// Hints should reference specific alternative choices
		// For LEFT choice: should mention trying the RIGHT option
		await expect(page.getByText(/hype you could gain/i)).toBeVisible();

		// For RIGHT choice: should mention trying the LEFT option
		await expect(page.getByText(/avoid the heat/i)).toBeVisible();
	});

	test("reflection section has proper heading", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		// Should have the reflection heading
		await expect(
			page.getByRole("heading", { name: /what would you do differently/i }),
		).toBeVisible();
	});

	test("hints have visual distinction with icons and colors", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
			],
		});

		// Should have emoji icons for hints
		const pageContent = await page.content();
		expect(pageContent).toMatch(/💡|🛡️/);
	});

	test("hints explain trade-offs for each choice type", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
			],
		});

		// LEFT hint should mention gaining hype but attracting heat
		await expect(page.getByText(/hype you could gain/i)).toBeVisible();
		await expect(page.getByText(/heat you might attract/i)).toBeVisible();

		// RIGHT hint should mention avoiding heat and fines
		await expect(page.getByText(/avoid the heat and fines/i)).toBeVisible();
	});

	test("reflection section includes personality-specific closing", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			personality: "ZEN_MASTER",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		// Should have personality-specific closing line
		await expect(page.getByText(/test is eternal.*growth/i)).toBeVisible();
	});
});
