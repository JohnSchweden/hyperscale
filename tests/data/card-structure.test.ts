import { describe, expect, it } from "vitest";
import { ROLE_CARDS } from "../../src/data/cards";
import { AppSource, PersonalityType, RoleType } from "../../src/types";

describe("Card Structure", () => {
	// Validate that ROLE_CARDS has entries for all 10 role types
	describe("ROLE_CARDS record completeness", () => {
		it("has a card array for every RoleType", () => {
			const allRoles = Object.values(RoleType);
			expect(allRoles).toHaveLength(10);

			for (const role of allRoles) {
				expect(ROLE_CARDS[role]).toBeDefined();
				expect(Array.isArray(ROLE_CARDS[role])).toBe(true);
			}
		});

		it("has non-empty card arrays for all roles", () => {
			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];
				expect(cards.length).toBeGreaterThan(0);
			}
		});
	});

	// Validate card structure for each role
	for (const role of Object.values(RoleType)) {
		describe(`validates ${role} card structure`, () => {
			const cards = ROLE_CARDS[role];

			it(`${role}: all cards have required fields`, () => {
				for (const card of cards) {
					// Required top-level fields
					expect(card.id, `Card missing id`).toBeDefined();
					expect(typeof card.id, `Card id must be string`).toBe("string");
					expect(card.id.length, `Card id must not be empty`).toBeGreaterThan(
						0,
					);

					expect(card.source, `Card ${card.id} missing source`).toBeDefined();
					expect(card.sender, `Card ${card.id} missing sender`).toBeDefined();
					expect(
						typeof card.sender,
						`Card ${card.id} sender must be string`,
					).toBe("string");
					expect(
						card.sender.length,
						`Card ${card.id} sender must not be empty`,
					).toBeGreaterThan(0);

					expect(card.context, `Card ${card.id} missing context`).toBeDefined();
					expect(
						typeof card.context,
						`Card ${card.id} context must be string`,
					).toBe("string");
					expect(
						card.context.length,
						`Card ${card.id} context must not be empty`,
					).toBeGreaterThan(0);

					expect(card.text, `Card ${card.id} missing text`).toBeDefined();
					expect(typeof card.text, `Card ${card.id} text must be string`).toBe(
						"string",
					);
					expect(
						card.text.length,
						`Card ${card.id} text must not be empty`,
					).toBeGreaterThan(0);
				}
			});

			it(`${role}: source is valid AppSource enum value`, () => {
				const validSources = Object.values(AppSource);
				for (const card of cards) {
					expect(
						validSources,
						`Card ${card.id} has invalid source: ${card.source}`,
					).toContain(card.source);
				}
			});

			it(`${role}: both onRight and onLeft are present`, () => {
				for (const card of cards) {
					expect(card.onRight, `Card ${card.id} missing onRight`).toBeDefined();
					expect(card.onLeft, `Card ${card.id} missing onLeft`).toBeDefined();
					expect(
						card.onRight,
						`Card ${card.id} onRight is null`,
					).not.toBeNull();
					expect(card.onLeft, `Card ${card.id} onLeft is null`).not.toBeNull();
				}
			});

			it(`${role}: onRight has all required outcome fields`, () => {
				for (const card of cards) {
					const outcome = card.onRight;
					expect(
						typeof outcome.label,
						`Card ${card.id} onRight.label must be string`,
					).toBe("string");
					expect(
						outcome.label.length,
						`Card ${card.id} onRight.label must not be empty`,
					).toBeGreaterThan(0);

					expect(
						typeof outcome.hype,
						`Card ${card.id} onRight.hype must be number`,
					).toBe("number");
					expect(
						typeof outcome.heat,
						`Card ${card.id} onRight.heat must be number`,
					).toBe("number");
					expect(
						typeof outcome.fine,
						`Card ${card.id} onRight.fine must be number`,
					).toBe("number");

					expect(
						typeof outcome.violation,
						`Card ${card.id} onRight.violation must be string`,
					).toBe("string");
					expect(
						outcome.violation.length,
						`Card ${card.id} onRight.violation must not be empty`,
					).toBeGreaterThan(0);

					expect(
						outcome.feedback,
						`Card ${card.id} onRight.feedback must be defined`,
					).toBeDefined();
					expect(
						typeof outcome.lesson,
						`Card ${card.id} onRight.lesson must be string`,
					).toBe("string");
					expect(
						outcome.lesson.length,
						`Card ${card.id} onRight.lesson must not be empty`,
					).toBeGreaterThan(0);
				}
			});

			it(`${role}: onLeft has all required outcome fields`, () => {
				for (const card of cards) {
					const outcome = card.onLeft;
					expect(
						typeof outcome.label,
						`Card ${card.id} onLeft.label must be string`,
					).toBe("string");
					expect(
						outcome.label.length,
						`Card ${card.id} onLeft.label must not be empty`,
					).toBeGreaterThan(0);

					expect(
						typeof outcome.hype,
						`Card ${card.id} onLeft.hype must be number`,
					).toBe("number");
					expect(
						typeof outcome.heat,
						`Card ${card.id} onLeft.heat must be number`,
					).toBe("number");
					expect(
						typeof outcome.fine,
						`Card ${card.id} onLeft.fine must be number`,
					).toBe("number");

					expect(
						typeof outcome.violation,
						`Card ${card.id} onLeft.violation must be string`,
					).toBe("string");
					expect(
						outcome.violation.length,
						`Card ${card.id} onLeft.violation must not be empty`,
					).toBeGreaterThan(0);

					expect(
						outcome.feedback,
						`Card ${card.id} onLeft.feedback must be defined`,
					).toBeDefined();
					expect(
						typeof outcome.lesson,
						`Card ${card.id} onLeft.lesson must be string`,
					).toBe("string");
					expect(
						outcome.lesson.length,
						`Card ${card.id} onLeft.lesson must not be empty`,
					).toBeGreaterThan(0);
				}
			});

			it(`${role}: feedback object has all 3 personality keys`, () => {
				const personalityTypes = Object.values(PersonalityType);
				for (const card of cards) {
					// Check onRight feedback
					for (const personality of personalityTypes) {
						expect(
							card.onRight.feedback[personality],
							`Card ${card.id} onRight.feedback missing ${personality}`,
						).toBeDefined();
						expect(
							typeof card.onRight.feedback[personality],
							`Card ${card.id} onRight.feedback[${personality}] must be string`,
						).toBe("string");
					}

					// Check onLeft feedback
					for (const personality of personalityTypes) {
						expect(
							card.onLeft.feedback[personality],
							`Card ${card.id} onLeft.feedback missing ${personality}`,
						).toBeDefined();
						expect(
							typeof card.onLeft.feedback[personality],
							`Card ${card.id} onLeft.feedback[${personality}] must be string`,
						).toBe("string");
					}
				}
			});

			it(`${role}: storyContext is optional but must be non-empty string if present`, () => {
				for (const card of cards) {
					if (card.storyContext !== undefined) {
						expect(
							typeof card.storyContext,
							`Card ${card.id} storyContext must be string`,
						).toBe("string");
						expect(
							card.storyContext.length,
							`Card ${card.id} storyContext must not be empty`,
						).toBeGreaterThan(0);
					}
				}
			});

			it(`${role}: all card IDs are unique within role`, () => {
				const ids = cards.map((c) => c.id);
				const uniqueIds = new Set(ids);
				expect(uniqueIds.size, `${role} has duplicate card IDs`).toBe(
					ids.length,
				);
			});
		});
	}

	// Cross-role validation
	describe("Cross-role validation", () => {
		it("all card IDs are unique across all roles", () => {
			const allIds: string[] = [];
			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];
				for (const card of cards) {
					allIds.push(card.id);
				}
			}
			const uniqueIds = new Set(allIds);
			expect(uniqueIds.size, `Found duplicate card IDs across roles`).toBe(
				allIds.length,
			);
		});
	});
});
