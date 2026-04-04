import { afterEach, describe, expect, it, vi } from "vitest";
import { corruptText } from "../src/utils/kirkText";

const COMBINING_START = 0x0300;
const COMBINING_END = 0x030d;

describe("corruptText", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("with intensity = 1 (always corrupt)", () => {
		it("should corrupt every non-space character", () => {
			vi.spyOn(Math, "random").mockReturnValue(0);

			const result = corruptText("abc", 1);

			expect(result).not.toBe("abc");
			expect(result.length).toBeGreaterThan(3);
			const chars = [...result];
			const baseChars = chars.filter(
				(c) => (c.codePointAt(0) ?? 0) < COMBINING_START,
			);
			expect(baseChars).toEqual(["a", "b", "c"]);
		});

		it("should preserve spaces", () => {
			vi.spyOn(Math, "random").mockReturnValue(0);

			const result = corruptText("a b", 1);

			expect(result).toContain(" ");
		});

		it("should append combining characters after each base char", () => {
			vi.spyOn(Math, "random").mockReturnValue(0);

			const result = corruptText("a", 1);

			expect(result[0]).toBe("a");
			expect(result.length).toBeGreaterThan(1);
		});

		it("should append 1-3 combining characters per character", () => {
			vi.spyOn(Math, "random").mockReturnValue(0);

			const result = corruptText("a", 1);

			const combiningCount = [...result].filter(
				(c) =>
					(c.codePointAt(0) ?? 0) >= COMBINING_START &&
					(c.codePointAt(0) ?? 0) <= COMBINING_END,
			).length;

			expect(combiningCount).toBeGreaterThanOrEqual(1);
			expect(combiningCount).toBeLessThanOrEqual(3);
		});

		it("should produce longer strings for multi-char input", () => {
			vi.spyOn(Math, "random").mockReturnValue(0);

			const result = corruptText("abcd", 1);
			expect(result.length).toBeGreaterThan(4);
		});
	});

	describe("with intensity = 0 (never corrupt)", () => {
		it("should return original text unchanged", () => {
			const result = corruptText("Hello World", 0);
			expect(result).toBe("Hello World");
		});

		it("should not add any combining characters", () => {
			const result = corruptText("test", 0);
			expect(result).toBe("test");
		});
	});

	describe("with default intensity (0.3)", () => {
		it("should sometimes corrupt characters", () => {
			let corruptedCount = 0;
			for (let i = 0; i < 100; i++) {
				const result = corruptText("aaaaa", 0.3);
				if (result !== "aaaaa") {
					corruptedCount++;
				}
			}
			expect(corruptedCount).toBeGreaterThan(0);
		});
	});

	describe("edge cases", () => {
		it("should handle empty string", () => {
			expect(corruptText("", 0.5)).toBe("");
		});

		it("should handle string with only spaces", () => {
			vi.spyOn(Math, "random").mockReturnValue(0);

			const result = corruptText("   ", 1);
			expect(result).toBe("   ");
		});

		it("should handle single character", () => {
			vi.spyOn(Math, "random").mockReturnValue(0);

			const result = corruptText("x", 1);
			expect(result[0]).toBe("x");
			expect(result.length).toBeGreaterThan(1);
		});

		it("should handle unicode/emoji characters", () => {
			vi.spyOn(Math, "random").mockReturnValue(0);

			const result = corruptText("🚀", 1);
			expect(result).not.toBe("🚀");
			expect(result.startsWith("🚀")).toBe(true);
		});

		it("should handle special characters", () => {
			vi.spyOn(Math, "random").mockReturnValue(0);

			const result = corruptText("!@#$%", 1);
			expect(result.length).toBeGreaterThan(5);
		});

		it("should handle newlines and tabs", () => {
			vi.spyOn(Math, "random").mockReturnValue(0);

			const result = corruptText("a\nb\tc", 1);
			expect(result).toContain("\n");
			expect(result).toContain("\t");
		});
	});

	describe("randomness", () => {
		it("should produce different results on different calls with real randomness", () => {
			const results = new Set<string>();
			for (let i = 0; i < 20; i++) {
				results.add(corruptText("test", 0.5));
			}
			expect(results.size).toBeGreaterThan(1);
		});
	});
});
