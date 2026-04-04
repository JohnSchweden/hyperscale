import { describe, expect, it } from "vitest";
import { slugify } from "../src/lib/slugify";

describe("slugify", () => {
	it("should convert simple text to kebab-case", () => {
		expect(slugify("Hello World")).toBe("hello-world");
		expect(slugify("Shield the team")).toBe("shield-the-team");
	});

	it("should handle already lowercase text", () => {
		expect(slugify("hello world")).toBe("hello-world");
	});

	it("should handle uppercase text", () => {
		expect(slugify("HELLO WORLD")).toBe("hello-world");
	});

	it("should handle mixed case text", () => {
		expect(slugify("HeLLo WoRLd")).toBe("hello-world");
	});

	it("should replace multiple consecutive non-alphanumeric chars with single dash", () => {
		expect(slugify("hello   world")).toBe("hello-world");
		expect(slugify("hello---world")).toBe("hello-world");
		expect(slugify("hello!@#world")).toBe("hello-world");
	});

	it("should strip leading dashes", () => {
		expect(slugify("-hello")).toBe("hello");
		expect(slugify("--hello")).toBe("hello");
		expect(slugify("!hello")).toBe("hello");
	});

	it("should strip trailing dashes", () => {
		expect(slugify("hello-")).toBe("hello");
		expect(slugify("hello--")).toBe("hello");
		expect(slugify("hello!")).toBe("hello");
	});

	it("should strip both leading and trailing dashes", () => {
		expect(slugify("-hello-")).toBe("hello");
		expect(slugify("!hello world!")).toBe("hello-world");
	});

	it("should preserve numbers", () => {
		expect(slugify("Phase 07")).toBe("phase-07");
		expect(slugify("test123")).toBe("test123");
		expect(slugify("item 1 of 10")).toBe("item-1-of-10");
	});

	it("should handle strings with only special characters", () => {
		expect(slugify("!!!")).toBe("");
		expect(slugify("---")).toBe("");
		expect(slugify("   ")).toBe("");
	});

	it("should handle empty string", () => {
		expect(slugify("")).toBe("");
	});

	it("should handle single character", () => {
		expect(slugify("a")).toBe("a");
		expect(slugify("A")).toBe("a");
		expect(slugify("1")).toBe("1");
		expect(slugify("!")).toBe("");
	});

	it("should handle URLs", () => {
		expect(slugify("https://example.com/path")).toBe("https-example-com-path");
	});

	it("should handle underscores as separators", () => {
		expect(slugify("hello_world")).toBe("hello-world");
		expect(slugify("snake_case_example")).toBe("snake-case-example");
	});

	it("should handle camelCase", () => {
		expect(slugify("camelCaseText")).toBe("camelcasetext");
	});
});
