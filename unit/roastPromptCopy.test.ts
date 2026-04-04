import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

describe("roast prompt copy", () => {
	it("geminiLive drops rigid 1–3 sentence cadence for varied rhythm", () => {
		const path = join(repoRoot, "src/services/geminiLive.ts");
		const src = readFileSync(path, "utf8");
		expect(src).not.toContain("1-3 sentences");
		expect(src.toLowerCase()).toMatch(/rhythm/);
	});

	it("api/roast avoids fixed 50-word cap wording while keeping variety guidance", () => {
		const path = join(repoRoot, "api/roast.ts");
		const src = readFileSync(path, "utf8");
		expect(src).not.toContain("Keep it under 50 words");
		expect(src.toLowerCase()).toMatch(/vary|pacing/);
	});
});
