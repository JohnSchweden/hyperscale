import { describe, expect, it } from "vitest";
import {
	isValidEnumValue,
	safeArray,
	safeNumber,
	safeParseJson,
	safeString,
} from "../src/lib/safeCoercion";

describe("safeParseJson", () => {
	it("should parse valid JSON strings", () => {
		expect(safeParseJson('{"key":"value"}')).toEqual({ key: "value" });
		expect(safeParseJson("[1,2,3]")).toEqual([1, 2, 3]);
		expect(safeParseJson('"hello"')).toBe("hello");
		expect(safeParseJson("42")).toBe(42);
		expect(safeParseJson("true")).toBe(true);
		expect(safeParseJson("null")).toBe(null);
	});

	it("should return null for invalid JSON", () => {
		expect(safeParseJson("{bad json}")).toBeNull();
		expect(safeParseJson("undefined")).toBeNull();
		expect(safeParseJson("")).toBeNull();
		expect(safeParseJson("not json at all")).toBeNull();
	});

	it("should return null for non-string inputs that cause errors", () => {
		expect(safeParseJson("")).toBeNull();
	});

	it("should correctly type the return value", () => {
		interface User {
			name: string;
			age: number;
		}
		const result = safeParseJson<User>('{"name":"Alice","age":30}');
		expect(result).not.toBeNull();
		expect(result?.name).toBe("Alice");
		expect(result?.age).toBe(30);
	});
});

describe("isValidEnumValue", () => {
	it("should return true for valid enum values", () => {
		const validSet = new Set(["FOO", "BAR", "BAZ"]);
		expect(isValidEnumValue("FOO", validSet)).toBe(true);
		expect(isValidEnumValue("BAR", validSet)).toBe(true);
		expect(isValidEnumValue("BAZ", validSet)).toBe(true);
	});

	it("should return false for values not in the set", () => {
		const validSet = new Set(["FOO", "BAR"]);
		expect(isValidEnumValue("QUX", validSet)).toBe(false);
		expect(isValidEnumValue("foo", validSet)).toBe(false);
	});

	it("should return false for non-string values", () => {
		const validSet = new Set(["FOO", "BAR"]);
		expect(isValidEnumValue(42, validSet)).toBe(false);
		expect(isValidEnumValue(null, validSet)).toBe(false);
		expect(isValidEnumValue(undefined, validSet)).toBe(false);
		expect(isValidEnumValue({}, validSet)).toBe(false);
		expect(isValidEnumValue([], validSet)).toBe(false);
		expect(isValidEnumValue(true, validSet)).toBe(false);
	});

	it("should return false for empty set", () => {
		const emptySet = new Set<string>();
		expect(isValidEnumValue("anything", emptySet)).toBe(false);
	});

	it("should narrow type correctly", () => {
		const validSet = new Set(["FOO", "BAR"]);
		const value: unknown = "FOO";
		if (isValidEnumValue(value, validSet)) {
			expect(typeof value).toBe("string");
		}
	});
});

describe("safeNumber", () => {
	it("should return the value when it is a number", () => {
		expect(safeNumber(42, 0)).toBe(42);
		expect(safeNumber(0, 10)).toBe(0);
		expect(safeNumber(-5, 0)).toBe(-5);
		expect(safeNumber(3.14, 0)).toBe(3.14);
	});

	it("should return fallback for non-number values", () => {
		expect(safeNumber("42", 0)).toBe(0);
		expect(safeNumber(null, 10)).toBe(10);
		expect(safeNumber(undefined, 5)).toBe(5);
		expect(safeNumber({}, 7)).toBe(7);
		expect(safeNumber([], 3)).toBe(3);
		expect(safeNumber(true, 1)).toBe(1);
	});

	it("should treat NaN as a number (typeof NaN === 'number')", () => {
		expect(safeNumber(NaN, 0)).toBe(NaN);
	});

	it("should distinguish between 0 and falsy values", () => {
		expect(safeNumber(0, 99)).toBe(0);
		expect(safeNumber("", 99)).toBe(99);
		expect(safeNumber(false, 99)).toBe(99);
	});
});

describe("safeString", () => {
	it("should return the value when it is a string", () => {
		expect(safeString("hello")).toBe("hello");
		expect(safeString("")).toBe("");
		expect(safeString("   ")).toBe("   ");
	});

	it("should return null for non-string values", () => {
		expect(safeString(42)).toBeNull();
		expect(safeString(null)).toBeNull();
		expect(safeString(undefined)).toBeNull();
		expect(safeString({})).toBeNull();
		expect(safeString([])).toBeNull();
		expect(safeString(true)).toBeNull();
	});

	it("should distinguish between empty string and null", () => {
		expect(safeString("")).toBe("");
		expect(safeString(0)).toBeNull();
	});
});

describe("safeArray", () => {
	it("should return the value when it is an array", () => {
		expect(safeArray([1, 2, 3])).toEqual([1, 2, 3]);
		expect(safeArray([])).toEqual([]);
		expect(safeArray(["a", "b"])).toEqual(["a", "b"]);
	});

	it("should return empty array for non-array values", () => {
		expect(safeArray("not an array")).toEqual([]);
		expect(safeArray(null)).toEqual([]);
		expect(safeArray(undefined)).toEqual([]);
		expect(safeArray(42)).toEqual([]);
		expect(safeArray({})).toEqual([]);
		expect(safeArray(true)).toEqual([]);
	});

	it("should preserve typed arrays", () => {
		const items = [{ id: 1 }, { id: 2 }];
		const result = safeArray<{ id: number }>(items);
		expect(result).toHaveLength(2);
		expect(result[0].id).toBe(1);
	});
});
