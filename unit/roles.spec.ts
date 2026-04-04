import { describe, expect, it } from "vitest";
import {
	getRoleDeck,
	ROLE_DECK_ALIASES,
	ROLE_DESCRIPTIONS,
	ROLE_ICONS,
	ROLE_LABELS,
} from "../src/data";
import { RoleType } from "../src/types";

describe("roles data", () => {
	describe("getRoleDeck", () => {
		it("should return correct deck alias for each role", () => {
			expect(getRoleDeck(RoleType.CHIEF_SOMETHING_OFFICER)).toBe("MANAGEMENT");
			expect(getRoleDeck(RoleType.HEAD_OF_SOMETHING)).toBe("MANAGEMENT");
			expect(getRoleDeck(RoleType.SOMETHING_MANAGER)).toBe("FINANCE");
			expect(getRoleDeck(RoleType.TECH_AI_CONSULTANT)).toBe("MARKETING");
			expect(getRoleDeck(RoleType.DATA_SCIENTIST)).toBe("HR");
			expect(getRoleDeck(RoleType.SOFTWARE_ARCHITECT)).toBe("DEVELOPMENT");
			expect(getRoleDeck(RoleType.SOFTWARE_ENGINEER)).toBe("DEVELOPMENT");
			expect(getRoleDeck(RoleType.VIBE_CODER)).toBe("DEVELOPMENT");
			expect(getRoleDeck(RoleType.VIBE_ENGINEER)).toBe("DEVELOPMENT");
			expect(getRoleDeck(RoleType.AGENTIC_ENGINEER)).toBe("DEVELOPMENT");
		});
	});

	describe("ROLE_DESCRIPTIONS", () => {
		it("should have descriptions for all roles", () => {
			const roles = Object.values(RoleType);
			roles.forEach((role) => {
				expect(ROLE_DESCRIPTIONS[role]).toBeDefined();
				expect(typeof ROLE_DESCRIPTIONS[role]).toBe("string");
				expect(ROLE_DESCRIPTIONS[role].length).toBeGreaterThan(0);
			});
		});
	});

	describe("ROLE_LABELS", () => {
		it("should have display labels for all roles", () => {
			const roles = Object.values(RoleType);
			roles.forEach((role) => {
				expect(ROLE_LABELS[role]).toBeDefined();
				expect(typeof ROLE_LABELS[role]).toBe("string");
				expect(ROLE_LABELS[role].length).toBeGreaterThan(0);
			});
		});

		it("should have proper title case labels", () => {
			expect(ROLE_LABELS[RoleType.SOFTWARE_ENGINEER]).toBe("Software Engineer");
			expect(ROLE_LABELS[RoleType.DATA_SCIENTIST]).toBe("Data Scientist");
			expect(ROLE_LABELS[RoleType.CHIEF_SOMETHING_OFFICER]).toBe(
				"Chief Something Officer",
			);
		});
	});

	describe("ROLE_ICONS", () => {
		it("should have Font Awesome icon classes for all roles", () => {
			const roles = Object.values(RoleType);
			roles.forEach((role) => {
				expect(ROLE_ICONS[role]).toBeDefined();
				expect(ROLE_ICONS[role]).toMatch(/^fa-/);
			});
		});
	});

	describe("ROLE_DECK_ALIASES", () => {
		it("should map all roles to valid deck names", () => {
			const roles = Object.values(RoleType);
			const validDecks = [
				"MANAGEMENT",
				"FINANCE",
				"MARKETING",
				"HR",
				"DEVELOPMENT",
			];
			roles.forEach((role) => {
				expect(validDecks).toContain(ROLE_DECK_ALIASES[role]);
			});
		});
	});
});
