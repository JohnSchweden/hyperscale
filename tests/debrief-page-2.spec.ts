import { expect, test } from "@playwright/test";
import { gotoWithKmDebugState } from "./helpers/km-debug-state";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Debrief Page 2 - Incident audit log @area:layout", () => {
	test("displays audit log heading and subtitle", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
			],
		});

		await expect(
			page.getByRole("heading", { name: /incident audit log/i }),
		).toBeVisible();
		await expect(
			page.getByText(/complete record of your decisions/i),
		).toBeVisible();
	});

	test("shows full card prompt in audit entry", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			personality: "ZEN_MASTER",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		await expect(page.getByText(/might miss edge cases/i)).toBeVisible();
	});

	test("shows fork labels and cyan badge for safe (LEFT) choice", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			personality: "LOVEBOMBER",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		await expect(page.getByText("Swipe left", { exact: true })).toBeVisible();
		await expect(page.getByText("Swipe right", { exact: true })).toBeVisible();
		await expect(page.getByText("Proper patch", { exact: true })).toBeVisible();
		const chosen = page.locator(".bg-cyan-500\\/20").filter({
			hasText: "Proper patch",
		});
		await expect(chosen).toBeVisible();
	});

	test("shows amber badge when risky branch chosen (fine > 0)", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "RIGHT" }],
		});

		const chosen = page.locator(".bg-amber-500\\/20").filter({
			hasText: "Quick fix",
		});
		await expect(chosen).toBeVisible();
		await expect(page.getByText(/Consequence:/i).first()).toBeVisible();
	});

	test("shows personality sign-off for ZEN_MASTER", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			personality: "ZEN_MASTER",
		});

		await expect(page.getByText(/your journey was turbulent/i)).toBeVisible();
	});

	test("lists multiple decisions with index markers", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			personality: "LOVEBOMBER",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "LEFT" },
			],
		});

		await expect(page.getByText("#1", { exact: true })).toBeVisible();
		await expect(page.getByText("#2", { exact: true })).toBeVisible();
	});
});
