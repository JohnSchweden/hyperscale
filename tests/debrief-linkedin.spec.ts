import { expect, test } from "@playwright/test";
import { gotoWithKmDebugState } from "./helpers/km-debug-state";

test.use({ baseURL: "https://localhost:3000" });

test.describe("LinkedIn Share Button @area:gameplay", () => {
	test("share button is visible on debrief page 3", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_3",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		// Find LinkedIn share button
		const shareButton = page.getByRole("button", {
			name: /share on linkedin/i,
		});
		await expect(shareButton).toBeVisible();
	});

	test("share button is enabled and clickable", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_3",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		const shareButton = page.getByRole("button", {
			name: /share on linkedin/i,
		});
		await expect(shareButton).toBeVisible();
		await expect(shareButton).toBeEnabled();
	});

	test("share button has LinkedIn icon", async ({ page }) => {
		await gotoWithKmDebugState(page, { stage: "DEBRIEF_PAGE_3" });

		// Verify LinkedIn icon is present within the share button
		const shareButton = page.getByRole("button", {
			name: /share on linkedin/i,
		});
		await expect(shareButton).toBeVisible();
		const linkedinIcon = shareButton.locator("i");
		await expect(linkedinIcon).toBeVisible();
	});

	test("share button has correct styling", async ({ page }) => {
		await gotoWithKmDebugState(page, { stage: "DEBRIEF_PAGE_3" });

		// Verify button styling
		const shareButton = page.getByRole("button", {
			name: /share on linkedin/i,
		});
		await expect(shareButton).toBeVisible();
		await expect(shareButton).toHaveClass(/flex|items-center|justify-center/);
	});

	test("share button responds to hover interaction", async ({ page }) => {
		await gotoWithKmDebugState(page, { stage: "DEBRIEF_PAGE_3" });

		const shareButton = page.getByRole("button", {
			name: /share on linkedin/i,
		});
		await expect(shareButton).toBeVisible();

		// Hover over button
		await shareButton.hover();
		await expect(shareButton).toBeVisible();
	});

	test("share button is visible with all personality types", async ({
		page,
	}) => {
		const personalities = ["ROASTER", "ZEN_MASTER", "LOVEBOMBER"] as const;

		for (const personality of personalities) {
			await gotoWithKmDebugState(page, {
				stage: "DEBRIEF_PAGE_3",
				personality,
			});

			const shareButton = page.getByRole("button", {
				name: /share on linkedin/i,
			});
			await expect(shareButton).toBeVisible();
		}
	});
});
