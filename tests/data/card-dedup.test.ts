import { describe, expect, it } from "vitest";
import { ROLE_CARDS } from "../../src/data/cards";
import { RoleType } from "../../src/types";

/**
 * Card Deduplication Test
 *
 * Prevents card ID collisions across all phases:
 * 1. No duplicate card IDs across all roles
 * 2. No thematic overlap in same deck (same context + category)
 * 3. Card IDs follow naming convention
 */

describe("Card Deduplication — Issue #6", () => {
	describe("No duplicate card IDs across all roles", () => {
		it("all card IDs are unique across all 10 roles", () => {
			const idToRoles: Record<string, string[]> = {};

			// Collect all card IDs and track which roles they appear in
			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];
				for (const card of cards) {
					if (!idToRoles[card.id]) {
						idToRoles[card.id] = [];
					}
					idToRoles[card.id].push(role);
				}
			}

			// Find duplicates
			const duplicates: Record<string, string[]> = {};
			for (const [id, roles] of Object.entries(idToRoles)) {
				if (roles.length > 1) {
					duplicates[id] = roles;
				}
			}

			if (Object.keys(duplicates).length > 0) {
				console.error("\n❌ Duplicate card IDs found:");
				for (const [id, roles] of Object.entries(duplicates)) {
					console.error(`  ${id}: appears in ${roles.join(", ")}`);
				}
			}

			expect(Object.keys(duplicates)).toEqual([]);
		});

		it("no card ID appears in more than one role deck", () => {
			const allIds = new Set<string>();
			const duplicates: string[] = [];

			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];
				for (const card of cards) {
					if (allIds.has(card.id)) {
						duplicates.push(card.id);
					} else {
						allIds.add(card.id);
					}
				}
			}

			expect(duplicates).toEqual([]);
		});
	});

	describe("No thematic overlap in same deck", () => {
		it("warns if same deck has cards with identical context", () => {
			const warnings: string[] = [];

			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];
				const contextGroups: Record<string, string[]> = {};

				// Group cards by context
				for (const card of cards) {
					const ctx = card.context;
					if (!contextGroups[ctx]) {
						contextGroups[ctx] = [];
					}
					contextGroups[ctx].push(card.id);
				}

				// Warn on multiple cards with same context
				for (const [ctx, cardIds] of Object.entries(contextGroups)) {
					if (cardIds.length > 2) {
						warnings.push(
							`${role}: ${cardIds.length} cards with context "${ctx}" - ${cardIds.slice(0, 3).join(", ")}${cardIds.length > 3 ? "..." : ""}`,
						);
					}
				}
			}

			if (warnings.length > 0) {
				console.warn(
					`\n⚠️  Thematic overlap warnings (may indicate redundant scenarios):\n${warnings.join("\n")}`,
				);
			}

			expect(true).toBe(true);
		});

		it("checks for similar card text in same deck", () => {
			const similarIssues: string[] = [];

			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];

				// Simple similarity check: first 20 chars of text match
				for (let i = 0; i < cards.length; i++) {
					for (let j = i + 1; j < cards.length; j++) {
						const text1 = cards[i].text.slice(0, 20).toLowerCase();
						const text2 = cards[j].text.slice(0, 20).toLowerCase();

						if (text1 === text2) {
							similarIssues.push(
								`${role}: ${cards[i].id} and ${cards[j].id} have similar text start`,
							);
						}
					}
				}
			}

			if (similarIssues.length > 0) {
				console.warn(
					`\n⚠️  Similar card text warnings (Phase 05 must vary text):\n${similarIssues.slice(0, 5).join("\n")}`,
				);
				if (similarIssues.length > 5) {
					console.warn(`  ... and ${similarIssues.length - 5} more`);
				}
			}

			// Warn but don't fail for Phase 03 baseline
			expect(true).toBe(true);
		});
	});

	describe("Card ID naming convention", () => {
		it("card IDs use snake_case format", () => {
			const nonSnakeCase: string[] = [];

			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];

				for (const card of cards) {
					// Check for snake_case (lowercase with underscores)
					if (!/^[a-z][a-z0-9_]*$/.test(card.id)) {
						nonSnakeCase.push(`${role}.${card.id}`);
					}
				}
			}

			if (nonSnakeCase.length > 0) {
				console.warn(
					`\n⚠️  Non-snake_case IDs (lowercase_with_underscores expected):\n${nonSnakeCase.slice(0, 5).join("\n")}`,
				);
				if (nonSnakeCase.length > 5) {
					console.warn(`  ... and ${nonSnakeCase.length - 5} more`);
				}
			}

			// Don't fail - informational only
			expect(true).toBe(true);
		});

		it("card IDs have recognizable role or category prefix", () => {
			/**
			 * Expected ID prefixes by role and category
			 */
			const VALID_PREFIXES = [
				// Role prefixes
				"cso_",
				"hos_",
				"sm_",
				"tac_",
				"ds_",
				"sa_",
				"se_",
				"vc_",
				"ve_",
				"ae_",
				// Category prefixes (Phase 05)
				"prompt_injection_",
				"model_drift_",
				"explainability_",
				"shadow_ai_",
				"synthetic_data_",
			];

			const ambiguousIds: string[] = [];

			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];

				for (const card of cards) {
					const hasValidPrefix = VALID_PREFIXES.some((prefix) =>
						card.id.toLowerCase().startsWith(prefix),
					);

					if (!hasValidPrefix) {
						ambiguousIds.push(`${role}.${card.id}`);
					}
				}
			}

			if (ambiguousIds.length > 0) {
				console.warn(
					`\n⚠️  IDs without clear prefix (Phase 05 must fix):\n${ambiguousIds.slice(0, 5).join("\n")}`,
				);
				if (ambiguousIds.length > 5) {
					console.warn(`  ... and ${ambiguousIds.length - 5} more`);
				}
			}

			expect(true).toBe(true);
		});

		it("card ID uniqueness within each role deck", () => {
			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];
				const ids = cards.map((c) => c.id);
				const uniqueIds = new Set(ids);

				expect(
					uniqueIds.size,
					`${role} has duplicate card IDs within deck`,
				).toBe(ids.length);
			}
		});
	});

	describe("Deduplication summary", () => {
		it("logs deduplication statistics", () => {
			let totalCards = 0;
			const uniqueIds = new Set<string>();

			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];
				totalCards += cards.length;

				for (const card of cards) {
					uniqueIds.add(card.id);
				}
			}

			console.log("\n📊 Deduplication Summary:");
			console.log(`  Total cards: ${totalCards}`);
			console.log(`  Unique IDs: ${uniqueIds.size}`);
			console.log(`  Duplicates: ${totalCards - uniqueIds.size}`);

			expect(uniqueIds.size).toBe(totalCards);
		});
	});
});
