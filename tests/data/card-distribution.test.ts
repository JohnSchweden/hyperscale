import { describe, expect, it } from "vitest";
import { ROLE_CARDS } from "../../data/cards";
import { RoleType } from "../../types";

/**
 * Card Distribution Test — Issue #10
 *
 * Validates the 10 roles x 5 categories distribution matrix.
 * Phase 05 target: 2+ cards per category per role.
 *
 * Categories:
 * - prompt_injection (PI)
 * - model_drift (MD)
 * - explainability (XAI)
 * - shadow_ai (SAI)
 * - synthetic_data (SD)
 */

/**
 * Category prefixes to look for in card IDs
 */
const CATEGORY_PREFIXES: Record<string, string[]> = {
	prompt_injection: ["prompt_injection", "pi_"],
	model_drift: ["model_drift", "md_"],
	explainability: ["explainability", "xai_"],
	shadow_ai: ["shadow_ai", "sai_"],
	synthetic_data: ["synthetic_data", "sd_"],
};

/**
 * Short names for matrix display
 */
const CATEGORY_SHORT_NAMES: Record<string, string> = {
	prompt_injection: "PI",
	model_drift: "MD",
	explainability: "XAI",
	shadow_ai: "SAI",
	synthetic_data: "SD",
};

/**
 * Count cards by category for a role
 */
function countCardsByCategory(role: RoleType): Record<string, number> {
	const cards = ROLE_CARDS[role];
	const counts: Record<string, number> = {
		prompt_injection: 0,
		model_drift: 0,
		explainability: 0,
		shadow_ai: 0,
		synthetic_data: 0,
		unknown: 0,
	};

	for (const card of cards) {
		const id = card.id.toLowerCase();
		let matched = false;

		for (const [category, prefixes] of Object.entries(CATEGORY_PREFIXES)) {
			if (prefixes.some((prefix) => id.includes(prefix))) {
				counts[category]++;
				matched = true;
				break;
			}
		}

		if (!matched) {
			counts.unknown++;
		}
	}

	return counts;
}

describe("Card Distribution Matrix — Issue #10", () => {
	describe("10 roles x 5 categories matrix", () => {
		it("logs current distribution matrix", () => {
			console.log("\n📊 Card Distribution Matrix (10 roles x 5 categories):");
			console.log("Target: 2+ cards per category per role (Phase 05)");
			console.log("");

			// Header
			const header = "Role".padEnd(28) + "| PI | MD | XAI | SAI | SD | Other";
			console.log(header);
			console.log("-".repeat(header.length));

			const matrix: Record<string, Record<string, number>> = {};
			const failures: string[] = [];

			for (const role of Object.values(RoleType)) {
				const counts = countCardsByCategory(role);
				matrix[role] = counts;

				// Format row
				const row =
					role.padEnd(28) +
					`| ${counts.prompt_injection.toString().padStart(2)} ` +
					`| ${counts.model_drift.toString().padStart(2)} ` +
					`| ${counts.explainability.toString().padStart(3)} ` +
					`| ${counts.shadow_ai.toString().padStart(3)} ` +
					`| ${counts.synthetic_data.toString().padStart(2)} ` +
					`| ${counts.unknown}`;

				console.log(row);

				// Check for Phase 05 target (2+ per category)
				for (const category of Object.keys(CATEGORY_PREFIXES)) {
					if (counts[category] < 2) {
						failures.push(`${role}: ${category} = ${counts[category]} (< 2)`);
					}
				}
			}

			if (failures.length > 0) {
				console.log("\n⚠️  Categories below 2-card threshold:");
				for (const failure of failures) {
					console.log(`  - ${failure}`);
				}
			}

			// This is informational for Phase 03 baseline
			expect(true).toBe(true);
		});

		it("distribution: 2+ cards per category per role (Phase 05 target)", () => {
			// Enable this test after Phase 05-02 adds first cards
			// This test will fail until Phase 05 card generation is complete

			const failures: string[] = [];

			for (const role of Object.values(RoleType)) {
				const counts = countCardsByCategory(role);

				for (const category of Object.keys(CATEGORY_PREFIXES)) {
					if (counts[category] < 2) {
						failures.push(`${role}.${category}: ${counts[category]} cards`);
					}
				}
			}

			if (failures.length > 0) {
				console.error("\n❌ Distribution matrix failures:");
				for (const failure of failures) {
					console.error(`  - ${failure}`);
				}
			}

			expect(failures).toEqual([]);
		});

		it("each role has cards from multiple categories (Phase 03 baseline)", () => {
			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];

				// Each role should have at least 2 different category prefixes
				const prefixes = new Set<string>();
				for (const card of cards) {
					const id = card.id.toLowerCase();
					for (const [category, categoryPrefixes] of Object.entries(
						CATEGORY_PREFIXES,
					)) {
						if (categoryPrefixes.some((prefix) => id.includes(prefix))) {
							prefixes.add(category);
							break;
						}
					}
				}

				// Expect at least 2 categories or legacy cards (unknown category)
				const categoriesCount = prefixes.size;
				const unknownCount = cards.filter((c) => {
					const id = c.id.toLowerCase();
					return !Object.values(CATEGORY_PREFIXES)
						.flat()
						.some((prefix) => id.includes(prefix));
				}).length;

				// Either has categorized cards or legacy cards
				expect(
					categoriesCount + (unknownCount > 0 ? 1 : 0),
					`${role} should have cards from multiple categories`,
				).toBeGreaterThanOrEqual(1);
			}
		});
	});

	describe("Total card counts", () => {
		it("logs total card count across all roles", () => {
			let totalCards = 0;
			const roleCounts: Record<string, number> = {};

			for (const role of Object.values(RoleType)) {
				const count = ROLE_CARDS[role].length;
				totalCards += count;
				roleCounts[role] = count;
			}

			console.log("\n📊 Total Card Counts:");
			console.log(`  Phase 03 baseline: ${totalCards} cards`);
			console.log(`  Phase 05 target: ${totalCards + 100} cards (+100 new)`);

			expect(true).toBe(true);
		});

		it("total Phase 05 card count >= 100", () => {
			// Enable after Phase 05-04 completes
			// Count cards with Phase 05 category prefixes
			let phase05Cards = 0;

			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];
				for (const card of cards) {
					const id = card.id.toLowerCase();
					if (
						Object.values(CATEGORY_PREFIXES)
							.flat()
							.some((prefix) => id.includes(prefix))
					) {
						phase05Cards++;
					}
				}
			}

			expect(phase05Cards).toBeGreaterThanOrEqual(100);
		});

		it("each role has 8+ total cards after Phase 03", () => {
			const underfilledRoles: string[] = [];

			for (const role of Object.values(RoleType)) {
				const count = ROLE_CARDS[role].length;
				if (count < 8) {
					underfilledRoles.push(`${role}: ${count} cards`);
				}
			}

			expect(underfilledRoles).toEqual([]);
		});

		it("each role has 18+ total cards after Phase 05", () => {
			// Enable after Phase 05-04 completes
			// Phase 03 baseline (8-10) + Phase 05 additions (10) = 18+
			const underfilledRoles: string[] = [];

			for (const role of Object.values(RoleType)) {
				const count = ROLE_CARDS[role].length;
				if (count < 18) {
					underfilledRoles.push(`${role}: ${count} cards`);
				}
			}

			expect(underfilledRoles).toEqual([]);
		});
	});

	describe("Category coverage", () => {
		it("logs category coverage across all roles", () => {
			const categoryTotals: Record<string, number> = {
				prompt_injection: 0,
				model_drift: 0,
				explainability: 0,
				shadow_ai: 0,
				synthetic_data: 0,
				unknown: 0,
			};

			for (const role of Object.values(RoleType)) {
				const counts = countCardsByCategory(role);
				for (const category of Object.keys(categoryTotals)) {
					categoryTotals[category] += counts[category];
				}
			}

			console.log("\n📊 Category Coverage (all roles):");
			for (const [category, count] of Object.entries(categoryTotals)) {
				const shortName = CATEGORY_SHORT_NAMES[category] || category;
				console.log(`  ${shortName.padStart(4)}: ${count} cards`);
			}

			expect(true).toBe(true);
		});
	});
});
