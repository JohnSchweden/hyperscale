import { expect, test } from "@playwright/test";
import { gotoWithKmDebugState } from "./helpers/km-debug-state";

test.use({ baseURL: "https://localhost:3000" });

test.describe("LinkedIn Share Button @area:gameplay", () => {
	test("share link is visible on debrief page 3", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_3",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		// Find LinkedIn share anchor
		const shareLink = page.locator(
			"a[href*='linkedin.com/sharing/share-offsite']",
		);
		await expect(shareLink).toBeVisible();
	});

	test("share link has correct href with LinkedIn format", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_3",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		const shareLink = page.locator(
			"a[href*='linkedin.com/sharing/share-offsite']",
		);
		await expect(shareLink).toBeVisible();

		const href = await shareLink.getAttribute("href");
		expect(href).toContain("linkedin.com/sharing/share-offsite");
		expect(href).toContain("url=");
		expect(href).toContain("summary=");
	});

	test("share link has LinkedIn icon", async ({ page }) => {
		await gotoWithKmDebugState(page, { stage: "DEBRIEF_PAGE_3" });

		// Verify LinkedIn icon is present within the share link
		const shareLink = page.getByRole("link", { name: /share on linkedin/i });
		await expect(shareLink).toBeVisible();
		const linkedinIcon = shareLink.locator("i");
		await expect(linkedinIcon).toBeVisible();
	});

	test("share link has correct styling", async ({ page }) => {
		await gotoWithKmDebugState(page, { stage: "DEBRIEF_PAGE_3" });

		// Verify link styling
		const shareLink = page.locator(
			"a[href*='linkedin.com/sharing/share-offsite']",
		);
		await expect(shareLink).toHaveClass(/bg-white|bg-cyan/);
	});

	test("share link responds to hover interaction", async ({ page }) => {
		await gotoWithKmDebugState(page, { stage: "DEBRIEF_PAGE_3" });

		const shareLink = page.locator(
			"a[href*='linkedin.com/sharing/share-offsite']",
		);
		await expect(shareLink).toBeVisible();

		// Hover over link
		await shareLink.hover();
		await expect(shareLink).toBeVisible();
	});

	test("share link is visible with all personality types", async ({ page }) => {
		const personalities = ["ROASTER", "ZEN_MASTER", "LOVEBOMBER"] as const;

		for (const personality of personalities) {
			await gotoWithKmDebugState(page, {
				stage: "DEBRIEF_PAGE_3",
				personality,
			});

			const shareLink = page.locator(
				"a[href*='linkedin.com/sharing/share-offsite']",
			);
			await expect(shareLink).toBeVisible();
		}
	});
});
