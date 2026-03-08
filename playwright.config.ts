import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	webServer: {
		command: "bun run dev",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
	},
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "list",
	grepInvert: /@live-api/,
	use: {
		baseURL: "http://localhost:3000",
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
		},
	],
});
