import { expect, test } from "@playwright/test";
import { gotoWithKmDebugState } from "./helpers/km-debug-state";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Debrief Page 2 - Reflection Prompt @area:layout", () => {
	test("displays reflection prompt with heading", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
			],
		});

		// Verify reflection heading
		await expect(
			page.getByRole("heading", { name: /what would you do differently/i }),
		).toBeVisible();
	});

	test("shows descriptive reflection paragraph", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			personality: "ZEN_MASTER",
		});

		// Verify reflection paragraph content
		await expect(
			page.getByText(/every choice you made shaped this outcome/i),
		).toBeVisible();
		await expect(page.getByText(/paths not taken/i)).toBeVisible();
		await expect(page.getByText(/test is eternal/i)).toBeVisible();
	});

	test("shows hints for safe (LEFT) decisions", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			personality: "LOVEBOMBER",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		// Verify hint appears for LEFT choice (LOVEBOMBER personality)
		await expect(page.getByText(/played it safe/i)).toBeVisible();
		await expect(
			page.getByText(/next time, try .+ to see how much hype/i),
		).toBeVisible();
	});

	test("does not show hints for RIGHT decisions", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "RIGHT" }],
		});

		// Verify no hints section when no LEFT choices
		await expect(
			page.getByText(/alternate paths to explore/i),
		).not.toBeVisible();
	});

	test("shows personality-specific closing line", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			personality: "ZEN_MASTER",
		});

		// Check for ZEN_MASTER closing line
		await expect(
			page.getByText(/test is eternal.*so is growth/i),
		).toBeVisible();
	});

	test("shows multiple hints for multiple safe decisions", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			personality: "LOVEBOMBER",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
			],
		});

		// Should show hints section
		await expect(page.getByText(/path you didn't take/i)).toBeVisible();

		// Should show hints for all 3 decisions
		const hints = page.locator("text=/Decision \\d+:/");
		await expect(hints).toHaveCount(3);
	});
});
