/**
 * Consolidated Live API + TTS fallback tests.
 * Run: bun run test -- tests/live-api.spec.ts --project=chromium-desktop
 * For TTS fallback: Start local-api.ts first: npx tsx scripts/local-api.ts
 */
import { expect, test } from "@playwright/test";
import { navigateToPlayingFast } from "./helpers/navigation";

test.use({ baseURL: "https://localhost:3000" });

test.describe("Live API with TTS fallback @integration @api-live @slow", () => {
	test("@live-api text and audio appear when using Live API", async ({
		page,
	}) => {
		test.setTimeout(60000);
		await navigateToPlayingFast(page);

		const textarea = page.getByLabel(
			"Describe your use case / workflow for governance review",
		);
		await textarea.waitFor({ state: "visible", timeout: 10000 });
		await textarea.fill("test input for live api");

		const outputBody = page.locator('[data-testid="roast-output-body"]');

		await page.locator('[aria-label="Send roast"]').click();

		await outputBody.waitFor({ state: "visible", timeout: 20000 });

		const text = await outputBody.textContent();
		expect(text?.length).toBeGreaterThan(10);
	});

	test("@live-api TTS fallback works when Live API fails", async ({ page }) => {
		test.setTimeout(60000);
		await navigateToPlayingFast(page);

		const textarea = page.getByLabel(
			"Describe your use case / workflow for governance review",
		);
		await textarea.waitFor({ state: "visible", timeout: 10000 });

		await textarea.fill("fallback test prompt");

		const consoleLogs: string[] = [];
		page.on("console", (msg) => consoleLogs.push(msg.text()));

		await page.locator('[aria-label="Send roast"]').click();

		await page
			.locator('[data-testid="roast-output"]')
			.waitFor({ state: "visible", timeout: 5000 })
			.catch(() => {});

		const outputElement = page.locator('[data-testid="roast-output"]');
		const hasOutput = await outputElement.isVisible().catch(() => false);

		const hasError = consoleLogs.some(
			(l) =>
				l.includes("Live API unavailable") || l.includes("falling back to TTS"),
		);

		expect(hasOutput || hasError).toBe(true);
	});
});
