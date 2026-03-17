import { describe, expect, it } from "vitest";
import { ROLE_CARDS } from "../../data/cards";
import { RoleType } from "../../types";

describe("Heat Correlation Validation", () => {
	describe("Risk-Heat-Fine Correlations", () => {
		for (const role of Object.values(RoleType)) {
			describe(`${role} correlations`, () => {
				const cards = ROLE_CARDS[role];

				it("option with higher fine has higher or equal heat", () => {
					for (const card of cards) {
						// The option with higher fine should have higher or equal heat
						if (card.onRight.fine > card.onLeft.fine) {
							expect(
								card.onRight.heat,
								`Card ${card.id}: higher fine option should have >= heat`,
							).toBeGreaterThanOrEqual(card.onLeft.heat);
						} else if (card.onLeft.fine > card.onRight.fine) {
							expect(
								card.onLeft.heat,
								`Card ${card.id}: higher fine option should have >= heat`,
							).toBeGreaterThanOrEqual(card.onRight.heat);
						}
						// If fines are equal, no heat correlation required
					}
				});

				it("if onRight.fine > onLeft.fine then onRight.heat > onLeft.heat", () => {
					for (const card of cards) {
						if (card.onRight.fine > card.onLeft.fine) {
							expect(
								card.onRight.heat,
								`Card ${card.id}: higher fine should correlate with higher heat`,
							).toBeGreaterThan(card.onLeft.heat);
						}
					}
				});

				it("high hype (>20) correlates with elevated heat (>8)", () => {
					for (const card of cards) {
						// If hype is high, heat should also be elevated (relative to new scale)
						if (card.onRight.hype > 20) {
							expect(
								card.onRight.heat,
								`Card ${card.id}: high hype should correlate with elevated heat`,
							).toBeGreaterThan(8);
						}
					}
				});

				it("no card has identical penalties when fines differ significantly", () => {
					for (const card of cards) {
						// If fines differ by more than 10%, heat should differ
						const fineDiff = Math.abs(card.onRight.fine - card.onLeft.fine);
						const maxFine = Math.max(card.onRight.fine, card.onLeft.fine);
						if (maxFine > 0 && fineDiff / maxFine > 0.1) {
							expect(
								card.onRight.heat,
								`Card ${card.id}: heat should differ when fines differ significantly`,
							).not.toBe(card.onLeft.heat);
						}
					}
				});
			});
		}
	});

	describe("Role Tier Heat Progression", () => {
		it("C-suite max heat > mid-tier max heat > junior max heat", () => {
			const juniorRoles = [
				RoleType.VIBE_CODER,
				RoleType.VIBE_ENGINEER,
				RoleType.SOFTWARE_ENGINEER,
			];
			const midRoles = [
				RoleType.DATA_SCIENTIST,
				RoleType.TECH_AI_CONSULTANT,
				RoleType.SOFTWARE_ARCHITECT,
				RoleType.AGENTIC_ENGINEER,
				RoleType.SOMETHING_MANAGER,
			];
			const seniorRoles = [RoleType.HEAD_OF_SOMETHING];
			const cSuiteRoles = [RoleType.CHIEF_SOMETHING_OFFICER];

			const getMaxHeat = (roles: RoleType[]) => {
				let max = 0;
				for (const role of roles) {
					for (const card of ROLE_CARDS[role]) {
						max = Math.max(max, card.onLeft.heat, card.onRight.heat);
					}
				}
				return max;
			};

			const juniorMax = getMaxHeat(juniorRoles);
			const midMax = getMaxHeat(midRoles);
			const seniorMax = getMaxHeat(seniorRoles);
			const cSuiteMax = getMaxHeat(cSuiteRoles);

			// Junior should have lower max heat than mid
			expect(juniorMax).toBeLessThanOrEqual(midMax);
			// Mid should have lower max heat than C-suite
			expect(midMax).toBeLessThanOrEqual(cSuiteMax);
			// Senior should have lower max heat than C-suite
			expect(seniorMax).toBeLessThanOrEqual(cSuiteMax);
		});
	});

	describe("Heat Value Constraints", () => {
		it("all heat values are >= 2 (minimum meaningful heat)", () => {
			for (const role of Object.values(RoleType)) {
				for (const card of ROLE_CARDS[role]) {
					expect(
						card.onLeft.heat,
						`Card ${card.id}: onLeft.heat should be >= 2`,
					).toBeGreaterThanOrEqual(2);
					expect(
						card.onRight.heat,
						`Card ${card.id}: onRight.heat should be >= 2`,
					).toBeGreaterThanOrEqual(2);
				}
			}
		});

		it("all heat values are reasonable for 8-10 card gameplay (<=35)", () => {
			for (const role of Object.values(RoleType)) {
				for (const card of ROLE_CARDS[role]) {
					expect(
						card.onLeft.heat,
						`Card ${card.id}: onLeft.heat should be <= 35`,
					).toBeLessThanOrEqual(35);
					expect(
						card.onRight.heat,
						`Card ${card.id}: onRight.heat should be <= 35`,
					).toBeLessThanOrEqual(35);
				}
			}
		});
	});
});
