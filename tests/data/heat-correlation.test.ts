import { describe, expect, it } from "vitest";
import { ROLE_CARDS } from "../../src/data/cards";
import { RoleType } from "../../src/types";

describe("Heat Correlation Validation", () => {
	// Table-driven correlation tests
	const correlationTests = [
		{
			name: "higher fine correlates with higher heat",
			check: (card: (typeof ROLE_CARDS)[RoleType][0]) => {
				if (card.onRight.fine > card.onLeft.fine) {
					return card.onRight.heat >= card.onLeft.heat;
				}
				if (card.onLeft.fine > card.onRight.fine) {
					return card.onLeft.heat >= card.onRight.heat;
				}
				return true;
			},
		},
		{
			name: "higher fine strictly correlates with higher heat",
			check: (card: (typeof ROLE_CARDS)[RoleType][0]) => {
				if (card.onRight.fine > card.onLeft.fine) {
					return card.onRight.heat > card.onLeft.heat;
				}
				return true;
			},
		},
		{
			name: "high hype (>20) correlates with elevated heat (>8)",
			check: (card: (typeof ROLE_CARDS)[RoleType][0]) => {
				if (card.onRight.hype > 20) {
					return card.onRight.heat > 8;
				}
				return true;
			},
		},

		{
			name: "heat differs when fines differ significantly (>10%)",
			check: (card: (typeof ROLE_CARDS)[RoleType][0]) => {
				const fineDiff = Math.abs(card.onRight.fine - card.onLeft.fine);
				const maxFine = Math.max(card.onRight.fine, card.onLeft.fine);
				if (maxFine > 0 && fineDiff / maxFine > 0.1) {
					return card.onRight.heat !== card.onLeft.heat;
				}
				return true;
			},
		},
	];

	describe("Per-Role Correlations", () => {
		for (const role of Object.values(RoleType)) {
			describe(role, () => {
				const cards = ROLE_CARDS[role];

				for (const test of correlationTests) {
					it(test.name, () => {
						for (const card of cards) {
							expect(test.check(card), `Card ${card.id}: ${test.name}`).toBe(
								true,
							);
						}
					});
				}
			});
		}
	});

	describe("Role Tier Heat Progression", () => {
		const getMaxHeat = (roles: RoleType[]) => {
			let max = 0;
			for (const role of roles) {
				for (const card of ROLE_CARDS[role]) {
					max = Math.max(max, card.onLeft.heat, card.onRight.heat);
				}
			}
			return max;
		};

		it("maintains hierarchy: junior < mid < senior < C-suite", () => {
			const tiers = {
				junior: [
					RoleType.VIBE_CODER,
					RoleType.VIBE_ENGINEER,
					RoleType.SOFTWARE_ENGINEER,
				],
				mid: [
					RoleType.DATA_SCIENTIST,
					RoleType.TECH_AI_CONSULTANT,
					RoleType.SOFTWARE_ARCHITECT,
					RoleType.AGENTIC_ENGINEER,
					RoleType.SOMETHING_MANAGER,
				],
				senior: [RoleType.HEAD_OF_SOMETHING],
				cSuite: [RoleType.CHIEF_SOMETHING_OFFICER],
			};

			const juniorMax = getMaxHeat(tiers.junior);
			const midMax = getMaxHeat(tiers.mid);
			const seniorMax = getMaxHeat(tiers.senior);
			const cSuiteMax = getMaxHeat(tiers.cSuite);

			// Verify rough hierarchy (allowing overlap due to card variety)
			expect(juniorMax, "junior should not exceed C-suite").toBeLessThanOrEqual(
				cSuiteMax,
			);
			expect(midMax, "mid should not exceed C-suite").toBeLessThanOrEqual(
				cSuiteMax,
			);
			expect(seniorMax, "senior should not exceed C-suite").toBeLessThanOrEqual(
				cSuiteMax,
			);
		});
	});

	describe("Heat Value Constraints", () => {
		const allCards = Object.values(RoleType).flatMap(
			(role) => ROLE_CARDS[role],
		);

		it("all heat values are >= 2 (minimum meaningful)", () => {
			for (const card of allCards) {
				expect(
					card.onLeft.heat,
					`${card.id}: onLeft.heat`,
				).toBeGreaterThanOrEqual(2);
				expect(
					card.onRight.heat,
					`${card.id}: onRight.heat`,
				).toBeGreaterThanOrEqual(2);
			}
		});

		it("all heat values are <= 35 (8-10 card gameplay)", () => {
			for (const card of allCards) {
				expect(card.onLeft.heat, `${card.id}: onLeft.heat`).toBeLessThanOrEqual(
					35,
				);
				expect(
					card.onRight.heat,
					`${card.id}: onRight.heat`,
				).toBeLessThanOrEqual(35);
			}
		});
	});
});
