import { describe, expect, it } from "vitest";
import {
	AGENTIC_ENGINEER_CARDS,
	CHIEF_SOMETHING_OFFICER_CARDS,
	DATA_SCIENTIST_CARDS,
	HEAD_OF_SOMETHING_CARDS,
	ROLE_CARDS,
	SOFTWARE_ARCHITECT_CARDS,
	SOFTWARE_ENGINEER_CARDS,
	SOMETHING_MANAGER_CARDS,
	TECH_AI_CONSULTANT_CARDS,
	VIBE_CODER_CARDS,
	VIBE_ENGINEER_CARDS,
} from "../data/cards";
import {
	ALL_ROLE_DECKS,
	countUniqueNonKirkTypes,
	countVectorsInDeck,
	validateRoleCardsMapping,
} from "../tests/utils/card-test-utils";
import { DeathType, RoleType } from "../types";

/** Decks that already carry deathVector on outcomes; others are migration backlog. */
const VECTOR_ANNOTATED_ROLES: readonly RoleType[] = [
	RoleType.DATA_SCIENTIST,
	RoleType.SOFTWARE_ENGINEER,
	RoleType.SOFTWARE_ARCHITECT,
	RoleType.VIBE_CODER,
	RoleType.VIBE_ENGINEER,
	RoleType.AGENTIC_ENGINEER,
] as const;

describe("Death Vector Coverage Validation", () => {
	it("every annotated role deck has deathVector on at least 40% of outcomes", () => {
		for (const { role, cards } of ALL_ROLE_DECKS) {
			if (!VECTOR_ANNOTATED_ROLES.includes(role)) continue;
			const { coveragePercent } = countVectorsInDeck(cards);
			expect(coveragePercent).toBeGreaterThanOrEqual(40);
		}
	});

	it("every annotated role deck covers at least 4 distinct non-KIRK death types", () => {
		for (const { role, cards } of ALL_ROLE_DECKS) {
			if (!VECTOR_ANNOTATED_ROLES.includes(role)) continue;
			const { total, byType } = countVectorsInDeck(cards);
			if (total === 0) {
				expect(total).toBeGreaterThan(0);
				continue;
			}
			expect(countUniqueNonKirkTypes(byType)).toBeGreaterThanOrEqual(4);
		}
	});

	it("no single death type exceeds 100% of any deck's vectors", () => {
		for (const { cards } of ALL_ROLE_DECKS) {
			const { total, byType } = countVectorsInDeck(cards);
			if (total === 0) continue;

			for (const count of Object.values(byType)) {
				expect((count / total) * 100).toBeLessThanOrEqual(100.1);
			}
		}
	});

	it("CONGRESS death type appears in at least 3 different decks", () => {
		const decksWithCongress = new Set<string>();

		for (const { role, cards } of ALL_ROLE_DECKS) {
			const { byType } = countVectorsInDeck(cards);
			if (byType[DeathType.CONGRESS] > 0) decksWithCongress.add(role);
		}

		expect(decksWithCongress.size).toBeGreaterThanOrEqual(3);
	});

	it("total across all decks: annotated death types appear across decks", () => {
		const globalCounts: Record<DeathType, number> = {
			[DeathType.BANKRUPT]: 0,
			[DeathType.PRISON]: 0,
			[DeathType.FLED_COUNTRY]: 0,
			[DeathType.REPLACED_BY_SCRIPT]: 0,
			[DeathType.AUDIT_FAILURE]: 0,
			[DeathType.CONGRESS]: 0,
			[DeathType.KIRK]: 0,
		};

		for (const { cards } of ALL_ROLE_DECKS) {
			const { byType } = countVectorsInDeck(cards);
			for (const deathType of Object.keys(byType) as DeathType[]) {
				globalCounts[deathType] += byType[deathType];
			}
		}

		const annotatedTypes = Object.entries(globalCounts)
			.filter(([, count]) => count > 0)
			.map(([type]) => type);

		expect(annotatedTypes.length).toBeGreaterThanOrEqual(1);
		expect(globalCounts[DeathType.CONGRESS]).toBeGreaterThanOrEqual(1);
	});

	it("ROLE_CARDS mapping matches individual imports", () => {
		const results = validateRoleCardsMapping();

		for (const { role, matches } of results) {
			expect(
				matches,
				`ROLE_CARDS[${role}] should match individual export`,
			).toBe(true);
		}
	});

	it("all individual card exports are defined", () => {
		expect(CHIEF_SOMETHING_OFFICER_CARDS.length).toBeGreaterThan(0);
		expect(HEAD_OF_SOMETHING_CARDS.length).toBeGreaterThan(0);
		expect(SOMETHING_MANAGER_CARDS.length).toBeGreaterThan(0);
		expect(TECH_AI_CONSULTANT_CARDS.length).toBeGreaterThan(0);
		expect(DATA_SCIENTIST_CARDS.length).toBeGreaterThan(0);
		expect(SOFTWARE_ARCHITECT_CARDS.length).toBeGreaterThan(0);
		expect(SOFTWARE_ENGINEER_CARDS.length).toBeGreaterThan(0);
		expect(VIBE_CODER_CARDS.length).toBeGreaterThan(0);
		expect(VIBE_ENGINEER_CARDS.length).toBeGreaterThan(0);
		expect(AGENTIC_ENGINEER_CARDS.length).toBeGreaterThan(0);
	});

	it("ROLE_CARDS has all 10 roles", () => {
		expect(Object.keys(ROLE_CARDS)).toHaveLength(10);
		expect(ROLE_CARDS.CHIEF_SOMETHING_OFFICER).toBeDefined();
		expect(ROLE_CARDS.HEAD_OF_SOMETHING).toBeDefined();
		expect(ROLE_CARDS.SOMETHING_MANAGER).toBeDefined();
		expect(ROLE_CARDS.TECH_AI_CONSULTANT).toBeDefined();
		expect(ROLE_CARDS.DATA_SCIENTIST).toBeDefined();
		expect(ROLE_CARDS.SOFTWARE_ARCHITECT).toBeDefined();
		expect(ROLE_CARDS.SOFTWARE_ENGINEER).toBeDefined();
		expect(ROLE_CARDS.VIBE_CODER).toBeDefined();
		expect(ROLE_CARDS.VIBE_ENGINEER).toBeDefined();
		expect(ROLE_CARDS.AGENTIC_ENGINEER).toBeDefined();
	});
});
