import { defineConfig, devices } from "@playwright/test";

// Env-driven lane selection: PLAYWRIGHT_GREP, PLAYWRIGHT_GREP_INVERT
// Default exclusions: @live-api always; @slow in CI.
function getGrepInvert(): RegExp {
	const envValue = process.env.PLAYWRIGHT_GREP_INVERT;
	if (envValue) return new RegExp(envValue);
	return process.env.CI ? /@live-api|@api-live|@slow/ : /@live-api|@api-live/;
}

export default defineConfig({
	testDir: "./tests",
	testIgnore: ["**/data/**"],
	fullyParallel: true,
	webServer: {
		command: "bun run dev",
		url: "https://localhost:3000",
		reuseExistingServer: !process.env.CI,
		ignoreHTTPSErrors: true,
	},
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "list",
	grep: process.env.PLAYWRIGHT_GREP
		? new RegExp(process.env.PLAYWRIGHT_GREP)
		: undefined,
	grepInvert: getGrepInvert(),
	use: {
		baseURL: "https://localhost:3000",
		ignoreHTTPSErrors: true,
		trace: "on-first-retry",
		contextOptions: {
			// Reuse browser context across tests for faster execution
			// when running with multiple workers
		},
	},
	projects: [
		{
			name: "chromium-desktop",
			use: {
				...devices["Desktop Chrome"],
				viewport: { width: 1280, height: 720 },
			},
		},
		{
			name: "chromium-mobile",
			use: {
				...devices["Pixel 5"],
				viewport: { width: 393, height: 851 },
			},
			// Only run layout-specific specs on mobile; rest run desktop-only
			testMatch: /mobile-width|layout-overlay-touch/,
		},
	],
});
