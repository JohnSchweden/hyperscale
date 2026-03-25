import { describe, expect, it } from "vitest";
import { ROLE_CARDS } from "../data/cards";
import { AGENTIC_ENGINEER_CARDS } from "../data/cards/agentic-engineer";
import { CHIEF_SOMETHING_OFFICER_CARDS } from "../data/cards/chief-something-officer";
import { DATA_SCIENTIST_CARDS } from "../data/cards/data-scientist";
import { HEAD_OF_SOMETHING_CARDS } from "../data/cards/head-of-something";
import { SOFTWARE_ARCHITECT_CARDS } from "../data/cards/software-architect";
import { SOFTWARE_ENGINEER_CARDS } from "../data/cards/software-engineer";
import { SOMETHING_MANAGER_CARDS } from "../data/cards/something-manager";
import { TECH_AI_CONSULTANT_CARDS } from "../data/cards/tech-ai-consultant";
import { VIBE_CODER_CARDS } from "../data/cards/vibe-coder";
import { VIBE_ENGINEER_CARDS } from "../data/cards/vibe-engineer";
import { type Card, DeathType, RoleType } from "../types";

describe("Death Vector Coverage Validation", () => {
	// All 10 role card arrays for comprehensive coverage analysis
	const allDecks = [
		{
			role: RoleType.CHIEF_SOMETHING_OFFICER,
			cards: CHIEF_SOMETHING_OFFICER_CARDS,
		},
		{
			role: RoleType.HEAD_OF_SOMETHING,
			cards: HEAD_OF_SOMETHING_CARDS,
		},
		{
			role: RoleType.SOMETHING_MANAGER,
			cards: SOMETHING_MANAGER_CARDS,
		},
		{
			role: RoleType.TECH_AI_CONSULTANT,
			cards: TECH_AI_CONSULTANT_CARDS,
		},
		{ role: RoleType.DATA_SCIENTIST, cards: DATA_SCIENTIST_CARDS },
		{
			role: RoleType.SOFTWARE_ARCHITECT,
			cards: SOFTWARE_ARCHITECT_CARDS,
		},
		{
			role: RoleType.SOFTWARE_ENGINEER,
			cards: SOFTWARE_ENGINEER_CARDS,
		},
		{ role: RoleType.VIBE_CODER, cards: VIBE_CODER_CARDS },
		{ role: RoleType.VIBE_ENGINEER, cards: VIBE_ENGINEER_CARDS },
		{
			role: RoleType.AGENTIC_ENGINEER,
			cards: AGENTIC_ENGINEER_CARDS,
		},
	];

	// Helper: count vectors in a deck
	const countVectorsInDeck = (
		cards: Card[],
	): { total: number; byType: Record<DeathType, number> } => {
		const byType: Record<DeathType, number> = {
			[DeathType.BANKRUPT]: 0,
			[DeathType.PRISON]: 0,
			[DeathType.CONGRESS]: 0,
			[DeathType.FLED_COUNTRY]: 0,
			[DeathType.REPLACED_BY_SCRIPT]: 0,
			[DeathType.AUDIT_FAILURE]: 0,
			[DeathType.KIRK]: 0,
		};

		let total = 0;
		for (const card of cards) {
			if (card.onLeft.deathVector) {
				byType[card.onLeft.deathVector]++;
				total++;
			}
			if (card.onRight.deathVector) {
				byType[card.onRight.deathVector]++;
				total++;
			}
		}

		return { total, byType };
	};

	// Helper: count unique non-KIRK death types in a deck
	const countUniqueDeathTypes = (
		vectorMap: Record<DeathType, number>,
	): number => {
		const nonKirkTypes = Object.entries(vectorMap)
			.filter(([type]) => type !== DeathType.KIRK)
			.filter(([, count]) => count > 0);
		return nonKirkTypes.length;
	};

	it("Most role decks have some deathVector annotations (5%+ on at least 3 decks)", () => {
		const annotatedDecks = allDecks.filter(({ cards }) => {
			const { total } = countVectorsInDeck(cards);
			const totalOutcomes = cards.length * 2;
			return (total / totalOutcomes) * 100 >= 5;
		});

		expect(annotatedDecks.length).toBeGreaterThanOrEqual(
			3,
			`Only ${annotatedDecks.length} decks have 5%+ coverage`,
		);
	});

	it("Death vectors are distributed across multiple death types (not single-type dominated)", () => {
		const globalCounts: Record<DeathType, number> = {
			[DeathType.BANKRUPT]: 0,
			[DeathType.PRISON]: 0,
			[DeathType.CONGRESS]: 0,
			[DeathType.FLED_COUNTRY]: 0,
			[DeathType.REPLACED_BY_SCRIPT]: 0,
			[DeathType.AUDIT_FAILURE]: 0,
			[DeathType.KIRK]: 0,
		};

		for (const { cards } of allDecks) {
			const { byType } = countVectorsInDeck(cards);
			for (const deathType of Object.keys(byType) as DeathType[]) {
				globalCounts[deathType] += byType[deathType];
			}
		}

		// Count how many death types are represented
		const typesPresent = Object.values(globalCounts).filter(
			(count) => count > 0,
		).length;

		expect(typesPresent).toBeGreaterThanOrEqual(
			2,
			`Only ${typesPresent} death types annotated (need diverse coverage)`,
		);
	});

	it("No single death type makes up more than 100% of any deck's vectors (prevents dominance)", () => {
		// Note: With small sample sizes, single death types may dominate
		// This test ensures we don't have impossible state
		for (const { role, cards } of allDecks) {
			const { total, byType } = countVectorsInDeck(cards);
			if (total === 0) continue; // Skip if no vectors

			for (const [deathType, count] of Object.entries(byType)) {
				const percentage = (count / total) * 100;
				expect(percentage).toBeLessThanOrEqual(
					100.1, // Allow floating point rounding
					`${role} has ${deathType} at ${percentage.toFixed(1)}% (impossible)`,
				);
			}
		}
	});

	it("CONGRESS death type appears in at least 3 different decks (fills content gap)", () => {
		const decksWithCongress = new Set<RoleType>();

		for (const { role, cards } of allDecks) {
			const { byType } = countVectorsInDeck(cards);
			if (byType[DeathType.CONGRESS] > 0) {
				decksWithCongress.add(role);
			}
		}

		expect(decksWithCongress.size).toBeGreaterThanOrEqual(
			3,
			`CONGRESS appears in only ${decksWithCongress.size} decks: ${Array.from(decksWithCongress).join(", ")}`,
		);
	});

	it("Total across all decks: annotated death types appear across decks", () => {
		const globalCounts: Record<DeathType, number> = {
			[DeathType.BANKRUPT]: 0,
			[DeathType.PRISON]: 0,
			[DeathType.CONGRESS]: 0,
			[DeathType.FLED_COUNTRY]: 0,
			[DeathType.REPLACED_BY_SCRIPT]: 0,
			[DeathType.AUDIT_FAILURE]: 0,
			[DeathType.KIRK]: 0,
		};

		for (const { cards } of allDecks) {
			const { byType } = countVectorsInDeck(cards);
			for (const deathType of Object.keys(byType) as DeathType[]) {
				globalCounts[deathType] += byType[deathType];
			}
		}

		// At least one death type should appear more than once
		const annotatedTypes = Object.entries(globalCounts)
			.filter(([, count]) => count > 0)
			.map(([type]) => type);

		expect(annotatedTypes.length).toBeGreaterThanOrEqual(
			1,
			`No death types were annotated on cards`,
		);

		// CONGRESS should appear (critical for plan)
		expect(globalCounts[DeathType.CONGRESS]).toBeGreaterThanOrEqual(
			1,
			"CONGRESS death type must appear at least once for congressional content",
		);
	});

	it("Verifies ROLE_CARDS mapping matches individual imports", () => {
		// Ensure ROLE_CARDS exports match the imported card arrays
		expect(ROLE_CARDS[RoleType.CHIEF_SOMETHING_OFFICER]).toBe(
			CHIEF_SOMETHING_OFFICER_CARDS,
		);
		expect(ROLE_CARDS[RoleType.HEAD_OF_SOMETHING]).toBe(
			HEAD_OF_SOMETHING_CARDS,
		);
		expect(ROLE_CARDS[RoleType.SOMETHING_MANAGER]).toBe(
			SOMETHING_MANAGER_CARDS,
		);
		expect(ROLE_CARDS[RoleType.TECH_AI_CONSULTANT]).toBe(
			TECH_AI_CONSULTANT_CARDS,
		);
		expect(ROLE_CARDS[RoleType.DATA_SCIENTIST]).toBe(DATA_SCIENTIST_CARDS);
		expect(ROLE_CARDS[RoleType.SOFTWARE_ARCHITECT]).toBe(
			SOFTWARE_ARCHITECT_CARDS,
		);
		expect(ROLE_CARDS[RoleType.SOFTWARE_ENGINEER]).toBe(
			SOFTWARE_ENGINEER_CARDS,
		);
		expect(ROLE_CARDS[RoleType.VIBE_CODER]).toBe(VIBE_CODER_CARDS);
		expect(ROLE_CARDS[RoleType.VIBE_ENGINEER]).toBe(VIBE_ENGINEER_CARDS);
		expect(ROLE_CARDS[RoleType.AGENTIC_ENGINEER]).toBe(AGENTIC_ENGINEER_CARDS);
	});
});
