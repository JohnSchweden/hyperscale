import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	/** Voice-hint UI in RoleSelect/PersonalitySelect reads VITE_ENABLE_SPEECH; pin so unit tests do not depend on .env.local. */
	define: {
		"import.meta.env.VITE_ENABLE_SPEECH": JSON.stringify("true"),
	},
	test: {
		include: ["unit/**/*.spec.ts", "unit/**/*.spec.tsx", "**/*.test.{ts,tsx}"],
		environment: "happy-dom",
		globals: true,
		setupFiles: ["./vitest.setup.ts"],
		typecheck: {
			tsconfig: "./tsconfig.test.json",
		},
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			include: [
				"src/components/**/*.{ts,tsx}",
				"src/services/**/*.ts",
				"src/data/**/*.ts",
				"src/hooks/**/*.ts",
				"src/utils/**/*.ts",
			],
		},
	},
});
