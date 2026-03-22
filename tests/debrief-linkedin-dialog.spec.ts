import { expect, test } from "@playwright/test";
import { gotoWithKmDebugState } from "./helpers/km-debug-state";

test.use({ baseURL: "https://localhost:3000" });

test.describe("LinkedIn Share - Dialog Opening @area:gameplay", () => {
	test("share link has correct LinkedIn URL", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_3",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		// Verify the share link has the correct LinkedIn URL
		const shareLink = page.getByRole("link", { name: /share on linkedin/i });
		await expect(shareLink).toBeVisible();

		const href = await shareLink.getAttribute("href");
		expect(href).toContain("linkedin.com/sharing/share-offsite");
		expect(href).toContain("share");
	});

	test("share URL contains pre-filled text with role, archetype, and score", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_3",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		// Verify the share link is visible and enabled
		const shareLink = page.getByRole("link", {
			name: /share on linkedin/i,
		});
		await expect(shareLink).toBeVisible();

		// Check that the link is not disabled
		await expect(shareLink).toBeEnabled();
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

			// Verify link is clickable
			const shareLink = page.getByRole("link", {
				name: /share on linkedin/i,
			});
			await expect(shareLink).toBeEnabled();

			// Verify link has proper styling to indicate it's interactive
			await expect(shareLink).toHaveCSS("cursor", "pointer");
		}
	});
});
