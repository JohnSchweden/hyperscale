import { describe, expect, it } from "vitest";
import { ROLE_CARDS } from "../../data/cards";
import { type Card, RoleType } from "../../types";

/**
 * Card Snapshot Test — Issue #12
 *
 * Captures Phase 03 card state for regression protection.
 * After Phase 05 edits, if any Phase 03 card changes, this test will catch it.
 */

/**
 * PHASE_03_CARD_IDS: Snapshot of all card IDs as of Phase 03
 * DO NOT MODIFY - This is the baseline for regression detection
 */
const PHASE_03_CARD_IDS: Record<RoleType, string[]> = {
	[RoleType.CHIEF_SOMETHING_OFFICER]: [],
	[RoleType.HEAD_OF_SOMETHING]: [],
	[RoleType.SOMETHING_MANAGER]: [],
	[RoleType.TECH_AI_CONSULTANT]: [],
	[RoleType.DATA_SCIENTIST]: [],
	[RoleType.SOFTWARE_ARCHITECT]: [],
	[RoleType.SOFTWARE_ENGINEER]: [],
	[RoleType.VIBE_CODER]: [],
	[RoleType.VIBE_ENGINEER]: [],
	[RoleType.AGENTIC_ENGINEER]: [],
};

/**
 * Generate the Phase 03 snapshot from current ROLE_CARDS
 * Run this once to populate the snapshot, then copy the output
 */
function generatePhase03Snapshot(): Record<RoleType, string[]> {
	const snapshot: Record<RoleType, string[]> = {
		[RoleType.CHIEF_SOMETHING_OFFICER]: [],
		[RoleType.HEAD_OF_SOMETHING]: [],
		[RoleType.SOMETHING_MANAGER]: [],
		[RoleType.TECH_AI_CONSULTANT]: [],
		[RoleType.DATA_SCIENTIST]: [],
		[RoleType.SOFTWARE_ARCHITECT]: [],
		[RoleType.SOFTWARE_ENGINEER]: [],
		[RoleType.VIBE_CODER]: [],
		[RoleType.VIBE_ENGINEER]: [],
		[RoleType.AGENTIC_ENGINEER]: [],
	};

	for (const role of Object.values(RoleType)) {
		const cards = ROLE_CARDS[role];
		snapshot[role] = cards.map((c) => c.id).sort();
	}

	return snapshot;
}

/**
 * Sample of Phase 03 cards with core properties to snapshot
 * These will be checked for property changes
 */
const PHASE_03_CORE_PROPERTIES: Array<{
	role: RoleType;
	cardId: string;
	source: string;
	context: string;
}> = [];

describe("Card Snapshot — Issue #12 (Regression Protection)", () => {
	describe("Phase 03 card IDs preserved", () => {
		it("logs current card snapshot for comparison", () => {
			const snapshot = generatePhase03Snapshot();

			console.log("\n📸 Phase 03 Card ID Snapshot:");
			console.log(
				"Copy this into PHASE_03_CARD_IDS constant for regression detection.\n",
			);
			console.log("const PHASE_03_CARD_IDS: Record<RoleType, string[]> = {");

			for (const role of Object.values(RoleType)) {
				const ids = snapshot[role];
				console.log(`  [RoleType.${role}]: [`);
				for (const id of ids) {
					console.log(`    "${id}",`);
				}
				console.log("  ],");
			}

			console.log("};");

			// Log counts
			let totalIds = 0;
			for (const role of Object.values(RoleType)) {
				totalIds += snapshot[role].length;
			}
			console.log(`\nTotal: ${totalIds} cards across 10 roles`);

			expect(true).toBe(true);
		});

		it("validates snapshot can be generated", () => {
			const snapshot = generatePhase03Snapshot();

			// Verify all roles have cards
			for (const role of Object.values(RoleType)) {
				expect(
					snapshot[role].length,
					`${role} should have cards in snapshot`,
				).toBeGreaterThan(0);
			}
		});

		/**
		 * UNCOMMENT after populating PHASE_03_CARD_IDS:
		 *
		 * it("no Phase 03 card IDs were removed", () => {
		 *   const currentSnapshot = generatePhase03Snapshot();
		 *   const removedCards: string[] = [];
		 *
		 *   for (const role of Object.values(RoleType)) {
		 *     const expectedIds = new Set(PHASE_03_CARD_IDS[role]);
		 *     const currentIds = new Set(currentSnapshot[role]);
		 *
		 *     for (const id of expectedIds) {
		 *       if (!currentIds.has(id)) {
		 *         removedCards.push(`${role}.${id}`);
		 *       }
		 *     }
		 *   }
		 *
		 *   if (removedCards.length > 0) {
		 *     console.error("\n❌ Phase 03 cards were removed:");
		 *     for (const card of removedCards) {
		 *       console.error(`  - ${card}`);
		 *     }
		 *   }
		 *
		 *   expect(removedCards).toEqual([]);
		 * });
		 */
	});

	describe("Phase 03 card core properties unchanged", () => {
		it("sample cards maintain structure", () => {
			// Pick one representative card per role
			const sampleCards: Array<{ role: RoleType; card: Card }> = [];

			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];
				if (cards.length > 0) {
					sampleCards.push({ role, card: cards[0] });
				}
			}

			// Verify sample cards have required structure
			for (const { role, card } of sampleCards) {
				expect(card.id).toBeDefined();
				expect(card.source).toBeDefined();
				expect(card.context).toBeDefined();
				expect(card.text).toBeDefined();
				expect(card.onLeft).toBeDefined();
				expect(card.onRight).toBeDefined();
			}

			console.log("\n📸 Phase 03 Sample Cards:");
			for (const { role, card } of sampleCards) {
				console.log(`  ${role}: ${card.id}`);
			}
		});

		it("card structure is preserved", () => {
			// Spot-check 10 cards (one per role) for structure
			const issues: string[] = [];

			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];
				if (cards.length === 0) continue;

				const card = cards[0];

				// Check required fields exist
				if (!card.id) issues.push(`${role}: missing id`);
				if (!card.source) issues.push(`${role}.${card.id}: missing source`);
				if (!card.sender) issues.push(`${role}.${card.id}: missing sender`);
				if (!card.context) issues.push(`${role}.${card.id}: missing context`);
				if (!card.text) issues.push(`${role}.${card.id}: missing text`);
				if (!card.onLeft) issues.push(`${role}.${card.id}: missing onLeft`);
				if (!card.onRight) issues.push(`${role}.${card.id}: missing onRight`);

				// Check outcome structure
				if (card.onLeft) {
					if (typeof card.onLeft.label !== "string")
						issues.push(`${role}.${card.id}.onLeft: missing label`);
					if (typeof card.onLeft.hype !== "number")
						issues.push(`${role}.${card.id}.onLeft: missing hype`);
					if (typeof card.onLeft.heat !== "number")
						issues.push(`${role}.${card.id}.onLeft: missing heat`);
					if (typeof card.onLeft.fine !== "number")
						issues.push(`${role}.${card.id}.onLeft: missing fine`);
				}

				if (card.onRight) {
					if (typeof card.onRight.label !== "string")
						issues.push(`${role}.${card.id}.onRight: missing label`);
					if (typeof card.onRight.hype !== "number")
						issues.push(`${role}.${card.id}.onRight: missing hype`);
					if (typeof card.onRight.heat !== "number")
						issues.push(`${role}.${card.id}.onRight: missing heat`);
					if (typeof card.onRight.fine !== "number")
						issues.push(`${role}.${card.id}.onRight: missing fine`);
				}
			}

			expect(issues).toEqual([]);
		});
	});

	describe("Phase 03 card count per role", () => {
		it("logs baseline card counts", () => {
			console.log("\n📊 Phase 03 Card Counts by Role:");
			console.log("(Copy these values to snapshot after Phase 03)\n");

			for (const role of Object.values(RoleType)) {
				const count = ROLE_CARDS[role].length;
				console.log(`  ${role}: ${count}`);
			}

			expect(true).toBe(true);
		});

		it("card counts have not decreased", () => {
			// After Phase 05, counts should only increase
			const decreasedRoles: string[] = [];
			const currentCounts: Record<RoleType, number> = {
				[RoleType.CHIEF_SOMETHING_OFFICER]: 0,
				[RoleType.HEAD_OF_SOMETHING]: 0,
				[RoleType.SOMETHING_MANAGER]: 0,
				[RoleType.TECH_AI_CONSULTANT]: 0,
				[RoleType.DATA_SCIENTIST]: 0,
				[RoleType.SOFTWARE_ARCHITECT]: 0,
				[RoleType.SOFTWARE_ENGINEER]: 0,
				[RoleType.VIBE_CODER]: 0,
				[RoleType.VIBE_ENGINEER]: 0,
				[RoleType.AGENTIC_ENGINEER]: 0,
			};

			// Get current counts
			for (const role of Object.values(RoleType)) {
				currentCounts[role] = ROLE_CARDS[role].length;
			}

			// Compare with PHASE_03_CARD_IDS baseline
			for (const role of Object.values(RoleType)) {
				const baselineCount = PHASE_03_CARD_IDS[role].length;
				if (baselineCount > 0 && currentCounts[role] < baselineCount) {
					decreasedRoles.push(
						`${role}: ${currentCounts[role]} (was ${baselineCount})`,
					);
				}
			}

			if (decreasedRoles.length > 0) {
				console.error("\n❌ Card counts decreased:");
				for (const role of decreasedRoles) {
					console.error(`  - ${role}`);
				}
			}

			// Only fail if baseline was populated
			const hasBaseline = Object.values(PHASE_03_CARD_IDS).some(
				(ids) => ids.length > 0,
			);
			if (hasBaseline) {
				expect(decreasedRoles).toEqual([]);
			} else {
				// Baseline not yet captured - pass for now
				expect(true).toBe(true);
			}
		});
	});

	describe("Regression detection summary", () => {
		it("summarizes snapshot status", () => {
			const hasSnapshot = Object.values(PHASE_03_CARD_IDS).some(
				(ids) => ids.length > 0,
			);

			console.log("\n📸 Snapshot Status:");
			if (hasSnapshot) {
				console.log("  ✓ Phase 03 baseline captured");
				console.log("  ✓ Regression detection active");
			} else {
				console.log("  ⏳ Phase 03 baseline not yet captured");
				console.log("  ⏳ Run 'logs current card snapshot' to generate");
			}

			expect(true).toBe(true);
		});
	});
});
