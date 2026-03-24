import { expect, test } from "@playwright/test";

test.use({ baseURL: "https://localhost:3000" });

test.describe("LayoutShell behavior @area:layout", () => {
	test("desktop centers content (justify-center, items-center) at ≥1024px", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto("/");
		const layoutRoot = page.locator('[data-testid="layout-shell"]').first();
		await layoutRoot.waitFor({ state: "attached", timeout: 5000 });

		// Check Tailwind classes directly — avoids oklch/rem computed style issues with Tailwind v4
		await expect(layoutRoot).toHaveClass(/lg:items-center/);
		await expect(layoutRoot).toHaveClass(/lg:justify-center/);
		await expect(layoutRoot).toHaveClass(
			/lg:pt-\[calc\(6rem\+env\(safe-area-inset-top,0px\)\)\]/,
		);
	});

	test("mobile top-aligns content (items-start) and has top inset calc at <1024px", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 393, height: 851 });
		await page.goto("/");
		const layoutRoot = page.locator('[data-testid="layout-shell"]').first();
		await layoutRoot.waitFor({ state: "attached", timeout: 5000 });

		// Check Tailwind classes directly — avoids oklch/rem computed style issues with Tailwind v4
		await expect(layoutRoot).toHaveClass(/items-start/);
		await expect(layoutRoot).toHaveClass(
			/pt-\[calc\(4rem\+env\(safe-area-inset-top,0px\)\)\]/,
		);
	});
});
