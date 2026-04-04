import { describe, expect, it } from "vitest";
import {
	getRoleDeck,
	LEGACY_ROLE_TYPES,
	ROLE_DECK_ALIASES,
	ROLE_DESCRIPTIONS,
	ROLE_ICONS,
	ROLE_LABELS,
} from "../src/data/roles";
import { RoleType } from "../src/types";

describe("ROLE_DESCRIPTIONS", () => {
	it("should have descriptions for all 10 roles", () => {
		expect(Object.keys(ROLE_DESCRIPTIONS)).toHaveLength(10);
	});

	it("should have non-empty descriptions", () => {
		for (const [, desc] of Object.entries(ROLE_DESCRIPTIONS)) {
			expect(desc.length).toBeGreaterThan(0);
			expect(typeof desc).toBe("string");
		}
	});

	it("should cover all RoleType values", () => {
		const roleTypes = Object.values(RoleType);
		for (const role of roleTypes) {
			expect(ROLE_DESCRIPTIONS).toHaveProperty(role);
		}
	});
});

describe("ROLE_LABELS", () => {
	it("should have labels for all 10 roles", () => {
		expect(Object.keys(ROLE_LABELS)).toHaveLength(10);
	});

	it("should have non-empty labels", () => {
		for (const [, label] of Object.entries(ROLE_LABELS)) {
			expect(label.length).toBeGreaterThan(0);
			expect(typeof label).toBe("string");
		}
	});

	it("should cover all RoleType values", () => {
		const roleTypes = Object.values(RoleType);
		for (const role of roleTypes) {
			expect(ROLE_LABELS).toHaveProperty(role);
		}
	});

	it("should have human-readable labels", () => {
		expect(ROLE_LABELS[RoleType.CHIEF_SOMETHING_OFFICER]).toBe(
			"Chief Something Officer",
		);
		expect(ROLE_LABELS[RoleType.SOFTWARE_ENGINEER]).toBe("Software Engineer");
		expect(ROLE_LABELS[RoleType.VIBE_CODER]).toBe("Vibe Coder");
	});
});

describe("ROLE_ICONS", () => {
	it("should have icons for all 10 roles", () => {
		expect(Object.keys(ROLE_ICONS)).toHaveLength(10);
	});

	it("should have valid Font Awesome class names", () => {
		for (const [, icon] of Object.entries(ROLE_ICONS)) {
			expect(icon).toMatch(/^fa-/);
		}
	});

	it("should cover all RoleType values", () => {
		const roleTypes = Object.values(RoleType);
		for (const role of roleTypes) {
			expect(ROLE_ICONS).toHaveProperty(role);
		}
	});

	it("should have unique icons for most roles", () => {
		const iconValues = Object.values(ROLE_ICONS);
		const uniqueIcons = new Set(iconValues);
		expect(uniqueIcons.size).toBeGreaterThan(5);
	});
});

describe("ROLE_DECK_ALIASES", () => {
	it("should have aliases for all 10 roles", () => {
		expect(Object.keys(ROLE_DECK_ALIASES)).toHaveLength(10);
	});

	it("should have non-empty alias strings", () => {
		for (const [, alias] of Object.entries(ROLE_DECK_ALIASES)) {
			expect(alias.length).toBeGreaterThan(0);
			expect(typeof alias).toBe("string");
		}
	});

	it("should cover all RoleType values", () => {
		const roleTypes = Object.values(RoleType);
		for (const role of roleTypes) {
			expect(ROLE_DECK_ALIASES).toHaveProperty(role);
		}
	});

	it("should map to known deck names", () => {
		const validDecks = new Set([
			"MANAGEMENT",
			"FINANCE",
			"MARKETING",
			"HR",
			"DEVELOPMENT",
		]);
		for (const alias of Object.values(ROLE_DECK_ALIASES)) {
			expect(validDecks).toContain(alias);
		}
	});

	it("should map executive roles to MANAGEMENT", () => {
		expect(ROLE_DECK_ALIASES[RoleType.CHIEF_SOMETHING_OFFICER]).toBe(
			"MANAGEMENT",
		);
		expect(ROLE_DECK_ALIASES[RoleType.HEAD_OF_SOMETHING]).toBe("MANAGEMENT");
	});

	it("should map engineering roles to DEVELOPMENT", () => {
		expect(ROLE_DECK_ALIASES[RoleType.SOFTWARE_ENGINEER]).toBe("DEVELOPMENT");
		expect(ROLE_DECK_ALIASES[RoleType.SOFTWARE_ARCHITECT]).toBe("DEVELOPMENT");
		expect(ROLE_DECK_ALIASES[RoleType.VIBE_CODER]).toBe("DEVELOPMENT");
		expect(ROLE_DECK_ALIASES[RoleType.VIBE_ENGINEER]).toBe("DEVELOPMENT");
		expect(ROLE_DECK_ALIASES[RoleType.AGENTIC_ENGINEER]).toBe("DEVELOPMENT");
	});
});

describe("getRoleDeck", () => {
	it("should return the correct deck for each role", () => {
		for (const role of Object.values(RoleType)) {
			const deck = getRoleDeck(role);
			expect(typeof deck).toBe("string");
			expect(deck.length).toBeGreaterThan(0);
		}
	});

	it("should be equivalent to direct alias lookup", () => {
		for (const role of Object.values(RoleType)) {
			expect(getRoleDeck(role)).toBe(ROLE_DECK_ALIASES[role]);
		}
	});
});

describe("LEGACY_ROLE_TYPES", () => {
	it("should have 6 legacy role types", () => {
		expect(Object.keys(LEGACY_ROLE_TYPES)).toHaveLength(6);
	});

	it("should have self-mapping values", () => {
		for (const [key, value] of Object.entries(LEGACY_ROLE_TYPES)) {
			expect(key).toBe(value);
		}
	});

	it("should include expected legacy roles", () => {
		expect(LEGACY_ROLE_TYPES.DEVELOPMENT).toBe("DEVELOPMENT");
		expect(LEGACY_ROLE_TYPES.MARKETING).toBe("MARKETING");
		expect(LEGACY_ROLE_TYPES.MANAGEMENT).toBe("MANAGEMENT");
		expect(LEGACY_ROLE_TYPES.HR).toBe("HR");
		expect(LEGACY_ROLE_TYPES.FINANCE).toBe("FINANCE");
		expect(LEGACY_ROLE_TYPES.CLEANING).toBe("CLEANING");
	});
});
