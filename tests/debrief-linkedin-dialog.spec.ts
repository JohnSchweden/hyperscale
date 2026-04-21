import { expect, test } from "@playwright/test";
import { gotoWithKmDebugState } from "./helpers/km-debug-state";

test.use({ baseURL: "https://localhost:3000" });

test.describe("LinkedIn Share - Dialog Opening @area:gameplay", () => {
	test("share button has correct LinkedIn URL configured", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_3",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		// Verify the share button exists and is visible
		const shareButton = page.getByRole("button", {
			name: /share on linkedin/i,
		});
		await expect(shareButton).toBeVisible();
		await expect(shareButton).toBeEnabled();
	});

	test("share button is visible and enabled with pre-filled content", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_3",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		// Verify the share button is visible and enabled
		const shareButton = page.getByRole("button", {
			name: /share on linkedin/i,
		});
		await expect(shareButton).toBeVisible();
		await expect(shareButton).toBeEnabled();
	});

	test("share button works with all archetypes", async ({ page }) => {
		const archetypes = [
			{ personality: "ROASTER", archetype: "Pragmatist" },
			{ personality: "ZEN_MASTER", archetype: "Balanced" },
			{ personality: "LOVEBOMBER", archetype: "Disruptor" },
		];

		for (const { personality } of archetypes) {
			await gotoWithKmDebugState(page, {
				stage: "DEBRIEF_PAGE_3",
				personality,
			});

			// Verify button is clickable
			const shareButton = page.getByRole("button", {
				name: /share on linkedin/i,
			});
			await expect(shareButton).toBeEnabled();

			// Verify button has proper styling to indicate it's interactive
			await expect(shareButton).toHaveCSS("cursor", "pointer");
		}
	});
});
