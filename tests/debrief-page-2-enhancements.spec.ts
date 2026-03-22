import { expect, test } from "@playwright/test";
import { gotoWithKmDebugState } from "./helpers/km-debug-state";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Debrief Page 2 - UI Enhancements @area:layout", () => {
	test("displays 'Your choice' label above decision badges", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});
		await page.waitForSelector("h1", { timeout: 10000 });

		// Verify "Your choice" label is visible above decision badge
		const yourChoiceLabel = page.getByText("Your choice", { exact: true });
		await expect(yourChoiceLabel).toBeVisible();

		// Verify it appears before the choice badge (fine===0 → cyan; fine>0 → amber)
		const choiceBadge = page
			.locator(".bg-cyan-500\\/20, .bg-amber-500\\/20")
			.first();
		await expect(choiceBadge).toBeVisible();

		// Check that label is positioned above (comes before in DOM)
		const labelBox = await yourChoiceLabel.boundingBox();
		const badgeBox = await choiceBadge.boundingBox();
		expect(labelBox?.y).toBeLessThan(badgeBox?.y ?? 0);
	});

	test("'Your choice' label appears for each decision in history", async ({
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

		// Should have one "Your choice" label per decision
		const yourChoiceLabels = page.getByText("Your choice", { exact: true });
		await expect(yourChoiceLabels).toHaveCount(2);
	});

	test("'Path you didn't take' title is center-aligned", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});
		await page.waitForSelector("h1", { timeout: 10000 });

		// Verify the title is visible
		const pathTitle = page.getByText("Path you didn't take");
		await expect(pathTitle).toBeVisible();

		// Check that the title element itself is centered (using flex justify-center)
		await expect(pathTitle).toHaveClass(/justify-center/);
	});

	test("card descriptions expand with 'show more' button", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});
		await page.waitForSelector("h1", { timeout: 10000 });

		// Look for show more button
		const showMoreButton = page.getByText("show more");

		// If there's a long description, the button should exist
		const count = await showMoreButton.count();
		if (count > 0) {
			await expect(showMoreButton.first()).toBeVisible();

			// Click to expand
			await showMoreButton.first().click();

			// Should now show "show less"
			const showLessButton = page.getByText("show less");
			await expect(showLessButton.first()).toBeVisible();

			// Click to collapse
			await showLessButton.first().click();

			// Should show "show more" again
			await expect(showMoreButton.first()).toBeVisible();
		}
	});
});

test.describe("Debrief Page 2 - Reflection Hints for Both Choices @area:gameplay", () => {
	test("shows hints for safe (LEFT) decisions with emoji", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});
		await page.waitForSelector("h1", { timeout: 10000 });

		// PathHint uses 💡 for safe variant; copy still includes "played it safe"
		const hint = page.getByText(/played it safe/i);
		await expect(hint).toBeVisible();

		// Safe PathHint borders use cyan (not emerald)
		const hintContainer = hint.locator("xpath=../..");
		await expect(hintContainer).toHaveClass(/border-cyan-500/);
	});

	test("shows hints for risky (RIGHT) decisions with shield emoji", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [{ cardId: "se_security_patch_timeline", choice: "RIGHT" }],
		});
		await page.waitForSelector("h1", { timeout: 10000 });

		// Should show hint with shield emoji for RIGHT choice
		const hint = page.getByText(/took a risk/i);
		await expect(hint).toBeVisible();

		// Should suggest trying safer option
		await expect(
			page.getByText(/try.*to see if you can avoid the heat/i),
		).toBeVisible();

		// Risky PathHint borders use amber (not rose)
		const hintContainer = hint.locator("xpath=../..");
		await expect(hintContainer).toHaveClass(/border-amber-500/);
	});

	test("shows hints for mixed LEFT and RIGHT decisions", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_2",
			history: [
				{ cardId: "se_security_patch_timeline", choice: "LEFT" },
				{ cardId: "se_code_quality_refactor", choice: "RIGHT" },
			],
		});
		await page.waitForSelector("h1", { timeout: 10000 });

		// Should show both types of hints
		await expect(page.getByText(/played it safe/i)).toBeVisible();
		await expect(page.getByText(/took a risk/i)).toBeVisible();

		// Should show "Decision 1" and "Decision 2"
		await expect(page.getByText("Decision 1:")).toBeVisible();
		await expect(page.getByText("Decision 2:")).toBeVisible();
	});
});
