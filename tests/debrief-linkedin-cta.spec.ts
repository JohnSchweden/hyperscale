import { expect, test } from "@playwright/test";
import { gotoWithKmDebugState } from "./helpers/km-debug-state";

test.use({ baseURL: "https://localhost:3000" });

test.describe("LinkedIn CTA Section @area:debrief", () => {
	test("LinkedIn CTA section visible on debrief page 3", async ({ page }) => {
		await gotoWithKmDebugState(page, {
			stage: "DEBRIEF_PAGE_3",
			history: [{ cardId: "se_security_patch_timeline", choice: "LEFT" }],
		});

		// LinkedIn CTA link should be visible
		const linkedinLink = page.locator(
			'a[href="https://www.linkedin.com/in/schwedeny/"]',
		);
		await expect(linkedinLink).toBeVisible();
	});

	test("LinkedIn icon is visible", async ({ page }) => {
		await gotoWithKmDebugState(page, { stage: "DEBRIEF_PAGE_3" });

		// LinkedIn icon should be visible in the CTA section
		const linkedinLink = page.locator(
			'a[href="https://www.linkedin.com/in/schwedeny/"]',
		);
		await expect(linkedinLink).toBeVisible();
		// Check that the link contains a LinkedIn icon (i element)
		const linkedinIcon = linkedinLink.locator("i");
		await expect(linkedinIcon).toBeVisible();
	});

	test("Get early access to V2 header text visible", async ({ page }) => {
		await gotoWithKmDebugState(page, { stage: "DEBRIEF_PAGE_3" });

		// Header text should be visible
		await expect(page.getByText(/early access to v2/i)).toBeVisible();
	});

	test("LinkedIn profile link visible with correct href", async ({ page }) => {
		await gotoWithKmDebugState(page, { stage: "DEBRIEF_PAGE_3" });

		// LinkedIn link should be visible and have correct href
		const linkedinLink = page.locator(
			'a[href="https://www.linkedin.com/in/schwedeny/"]',
		);
		await expect(linkedinLink).toBeVisible();
	});

	test("Link text is Yevgen Schweden", async ({ page }) => {
		await gotoWithKmDebugState(page, { stage: "DEBRIEF_PAGE_3" });

		// Link text should display name
		const linkedinLink = page.getByText(/message yevgen schweden/i);
		await expect(linkedinLink).toBeVisible();
	});

	test("CTA visible when role is null (edge case)", async ({ page }) => {
		await gotoWithKmDebugState(page, { stage: "DEBRIEF_PAGE_3", role: null });

		// LinkedIn CTA should still be visible even without role
		const linkedinLink = page.locator(
			'a[href="https://www.linkedin.com/in/schwedeny/"]',
		);
		await expect(linkedinLink).toBeVisible();

		// Text should be visible
		await expect(page.getByText(/message yevgen schweden/i)).toBeVisible();
	});

	test("Description text mentions LinkedIn and adaptive version", async ({
		page,
	}) => {
		await gotoWithKmDebugState(page, { stage: "DEBRIEF_PAGE_3" });

		// Description should mention LinkedIn and adaptive version
		await expect(page.getByText(/adaptive version/i)).toBeVisible();
		await expect(page.getByText(/message me on linkedin/i)).toBeVisible();
	});
});
