import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["unit/**/*.spec.ts", "unit/**/*.spec.tsx", "**/*.test.{ts,tsx}"],
		environment: "happy-dom",
		globals: true,
		setupFiles: ["./vitest.setup.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			include: [
				"components/**/*.{ts,tsx}",
				"services/**/*.ts",
				"data/**/*.ts",
				"hooks/**/*.ts",
				"utils/**/*.ts",
			],
		},
	},
});
