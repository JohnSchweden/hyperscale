import { beforeEach, describe, expect, it } from "vitest";
import { accumulateDeathVectors } from "../data/deathVectors";
import { type Card, DeathType, type GameState, RoleType } from "../types";
import { createMockCard, determineDeathType } from "./testHelpers";

describe("Death Vector System", () => {
	let mockDeck: Card[];

	beforeEach(() => {
		mockDeck = [
			createMockCard(
				"card-1",
				{ deathVector: DeathType.CONGRESS },
				{ deathVector: DeathType.PRISON },
			),
			createMockCard("card-2", {}, { deathVector: DeathType.CONGRESS }),
		];
	});

	describe("accumulateDeathVectors", () => {
		it("returns empty map for empty history", () => {
			const vectors = accumulateDeathVectors([], mockDeck);
			expect(vectors).toEqual({});
		});

		it("counts CONGRESS vectors from history", () => {
			const history: GameState["history"] = [
				{ cardId: "card-1", choice: "LEFT" },
				{ cardId: "card-1", choice: "LEFT" },
				{ cardId: "card-1", choice: "LEFT" },
			];
			const vectors = accumulateDeathVectors(history, mockDeck);
			expect(vectors.CONGRESS).toBe(3);
		});

		it("accumulates mixed vectors correctly", () => {
			const history: GameState["history"] = [
				{ cardId: "card-1", choice: "LEFT" },
				{ cardId: "card-1", choice: "RIGHT" },
				{ cardId: "card-2", choice: "RIGHT" },
			];
			const vectors = accumulateDeathVectors(history, mockDeck);
			expect(vectors.CONGRESS).toBe(2);
			expect(vectors.PRISON).toBe(1);
		});

		it("ignores cards without deathVector fields (backward compatible)", () => {
			const history: GameState["history"] = [
				{ cardId: "card-2", choice: "LEFT" },
				{ cardId: "card-2", choice: "LEFT" },
				{ cardId: "card-1", choice: "LEFT" },
			];
			const vectors = accumulateDeathVectors(history, mockDeck);
			expect(vectors.CONGRESS).toBe(1);
			expect(Object.keys(vectors)).toHaveLength(1);
		});

		it("ignores unmatched card IDs", () => {
			const history: GameState["history"] = [
				{ cardId: "card-1", choice: "LEFT" },
				{ cardId: "nonexistent-card", choice: "LEFT" },
				{ cardId: "card-1", choice: "LEFT" },
			];
			const vectors = accumulateDeathVectors(history, mockDeck);
			expect(vectors.CONGRESS).toBe(2);
		});
	});

	describe("determineDeathTypeFromVectors", () => {
		const ALL_NON_KIRK_TYPES = [
			DeathType.BANKRUPT,
			DeathType.REPLACED_BY_SCRIPT,
			DeathType.CONGRESS,
			DeathType.FLED_COUNTRY,
			DeathType.PRISON,
			DeathType.AUDIT_FAILURE,
		];

		it("returns highest-frequency vector when count >= 2", () => {
			const result = determineDeathType({
				vectorMap: { CONGRESS: 3, PRISON: 1 },
			});
			expect(result).toBe(DeathType.CONGRESS);
		});

		it("breaks ties using archetype affinity", () => {
			const result = determineDeathType({
				vectorMap: { CONGRESS: 2, PRISON: 2 },
				archetype: "SHADOW_ARCHITECT",
			});
			expect(result).toBe(DeathType.PRISON);
		});

		it("breaks ties with DISRUPTOR favoring CONGRESS", () => {
			const result = determineDeathType({
				vectorMap: { CONGRESS: 2, PRISON: 2 },
				archetype: "DISRUPTOR",
			});
			expect(result).toBe(DeathType.CONGRESS);
		});

		it("falls back to legacy logic when no vector has count >= 2", () => {
			const result = determineDeathType({
				vectorMap: { CONGRESS: 1, PRISON: 1 },
				role: RoleType.SOFTWARE_ENGINEER,
			});
			expect(ALL_NON_KIRK_TYPES).toContain(result);
		});

		it("BANKRUPT always wins when budget <= 0", () => {
			const result = determineDeathType({
				vectorMap: { CONGRESS: 10, PRISON: 10 },
				budget: 0,
			});
			expect(result).toBe(DeathType.BANKRUPT);
		});

		it("REPLACED_BY_SCRIPT wins when heat >= 100 and hype <= 10", () => {
			const result = determineDeathType({
				vectorMap: { CONGRESS: 10, PRISON: 10 },
				heat: 100,
				hype: 10,
			});
			expect(result).toBe(DeathType.REPLACED_BY_SCRIPT);
		});

		it("KIRK is never returned from vector logic", () => {
			const result = determineDeathType({ vectorMap: { KIRK: 10 } });
			expect(result).not.toBe(DeathType.KIRK);
		});

		it("handles empty vector map gracefully", () => {
			const result = determineDeathType({
				vectorMap: {},
				role: RoleType.SOFTWARE_ENGINEER,
			});
			expect(ALL_NON_KIRK_TYPES).toContain(result);
		});
	});
});
