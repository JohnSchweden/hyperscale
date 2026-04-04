import { describe, expect, it } from "vitest";
import { ROLE_CARDS } from "../src/data/cards";
import { gameReducer, initialGameState } from "../src/hooks/useGameState";
import { DeathType, GameStage, PersonalityType, RoleType } from "../src/types";
import { createMockCard } from "./testHelpers";

describe("gameReducer", () => {
	it("STAGE_CHANGE: updates stage and optional personality/role", () => {
		const s = gameReducer(initialGameState, {
			type: "STAGE_CHANGE",
			stage: GameStage.PERSONALITY_SELECT,
		});
		expect(s.stage).toBe(GameStage.PERSONALITY_SELECT);

		const s2 = gameReducer(s, {
			type: "STAGE_CHANGE",
			stage: GameStage.ROLE_SELECT,
			personality: PersonalityType.ROASTER,
		});
		expect(s2.stage).toBe(GameStage.ROLE_SELECT);
		expect(s2.personality).toBe(PersonalityType.ROASTER);
	});

	it("STAGE_CHANGE: rejects invalid transition", () => {
		const s = { ...initialGameState, stage: GameStage.INTRO };
		const next = gameReducer(s, {
			type: "STAGE_CHANGE",
			stage: GameStage.PLAYING,
		});
		expect(next.stage).toBe(GameStage.INTRO);
	});

	it("CHOICE_MADE: applies hype/heat/budget and appends history", () => {
		const s = {
			...initialGameState,
			stage: GameStage.PLAYING,
			hype: 50,
			heat: 10,
			budget: 10_000_000,
		};
		const next = gameReducer(s, {
			type: "CHOICE_MADE",
			direction: "RIGHT",
			outcome: { hype: 15, heat: 45, fine: 2_500_000, cardId: "dev_1" },
		});
		expect(next.hype).toBe(65);
		expect(next.heat).toBe(55);
		expect(next.budget).toBe(7_500_000);
		expect(next.history).toHaveLength(1);
		expect(next.history[0]).toEqual({ cardId: "dev_1", choice: "RIGHT" });
	});

	it("CHOICE_MADE: clamps hype to >= 0 and heat to <= 100", () => {
		const s = { ...initialGameState, hype: 5, heat: 95, budget: 10_000_000 };
		const next = gameReducer(s, {
			type: "CHOICE_MADE",
			direction: "LEFT",
			outcome: { hype: -20, heat: 10, fine: 0, cardId: "x" },
		});
		expect(next.hype).toBe(0);
		expect(next.heat).toBe(100);
	});

	it("NEXT_INCIDENT: triggers DEBRIEF_PAGE_1 with BANKRUPT when budget <= 0", () => {
		const s = {
			...initialGameState,
			stage: GameStage.PLAYING,
			budget: 0,
			heat: 50,
			role: RoleType.SOFTWARE_ENGINEER,
		};
		const next = gameReducer(s, { type: "NEXT_INCIDENT" });
		expect(next.stage).toBe(GameStage.DEBRIEF_PAGE_1);
		expect(next.deathType).toBe(DeathType.BANKRUPT);
		expect(next.deathReason).toBeTruthy();
		expect(next.unlockedEndings).toContain(DeathType.BANKRUPT);
	});

	it("NEXT_INCIDENT: triggers death debrief with heat >= 100, role determines death type", () => {
		const base = {
			...initialGameState,
			stage: GameStage.PLAYING,
			budget: 1_000_000,
			heat: 100,
			hype: 50,
		};

		const testCases = [
			{ role: RoleType.SOMETHING_MANAGER, expected: DeathType.PRISON },
			{ role: RoleType.TECH_AI_CONSULTANT, expected: DeathType.CONGRESS },
			{
				role: RoleType.CHIEF_SOMETHING_OFFICER,
				expected: DeathType.AUDIT_FAILURE,
			},
			{
				role: RoleType.SOFTWARE_ENGINEER,
				expected: DeathType.REPLACED_BY_SCRIPT,
			},
		];

		for (const { role, expected } of testCases) {
			const result = gameReducer({ ...base, role }, { type: "NEXT_INCIDENT" });
			expect(result.deathType).toBe(expected);
		}

		// Test REPLACED_BY_SCRIPT condition (low hype)
		const replaced = gameReducer(
			{ ...base, role: RoleType.SOFTWARE_ENGINEER, hype: 5 },
			{ type: "NEXT_INCIDENT" },
		);
		expect(replaced.deathType).toBe(DeathType.REPLACED_BY_SCRIPT);
	});

	it("NEXT_INCIDENT: advances card index and transitions to BOSS_FIGHT at deck end", () => {
		const s = {
			...initialGameState,
			stage: GameStage.PLAYING,
			role: RoleType.SOFTWARE_ENGINEER,
			currentCardIndex: 0,
			budget: 10_000_000,
			heat: 0,
		};
		const next = gameReducer(s, { type: "NEXT_INCIDENT" });
		expect(next.currentCardIndex).toBe(1);
		expect(next.stage).toBe(GameStage.PLAYING);

		const deckLength = ROLE_CARDS[RoleType.SOFTWARE_ENGINEER].length;
		const atEnd = { ...s, currentCardIndex: deckLength - 1 };
		const toBoss = gameReducer(atEnd, { type: "NEXT_INCIDENT" });
		expect(toBoss.stage).toBe(GameStage.BOSS_FIGHT);
	});

	it("BOSS_ANSWER: appends answer and deducts budget on wrong", () => {
		const s = {
			...initialGameState,
			budget: 5_000_000,
			bossFightAnswers: [true, false],
		};
		const next = gameReducer(s, { type: "BOSS_ANSWER", isCorrect: false });
		expect(next.bossFightAnswers).toEqual([true, false, false]);
		expect(next.budget).toBe(4_000_000);
	});

	it("BOSS_ANSWER: does not deduct budget on correct", () => {
		const s = {
			...initialGameState,
			budget: 5_000_000,
			bossFightAnswers: [],
		};
		const next = gameReducer(s, { type: "BOSS_ANSWER", isCorrect: true });
		expect(next.budget).toBe(5_000_000);
		expect(next.bossFightAnswers).toEqual([true]);
	});

	it("BOSS_COMPLETE: success goes to DEBRIEF_PAGE_1", () => {
		const s = { ...initialGameState, stage: GameStage.BOSS_FIGHT };
		const next = gameReducer(s, { type: "BOSS_COMPLETE", success: true });
		expect(next.stage).toBe(GameStage.DEBRIEF_PAGE_1);
	});

	it("BOSS_COMPLETE: fail goes to DEBRIEF_PAGE_1 with AUDIT_FAILURE when vectors empty and role maps to MANAGEMENT", () => {
		const s = {
			...initialGameState,
			stage: GameStage.BOSS_FIGHT,
			role: RoleType.CHIEF_SOMETHING_OFFICER,
		};
		const next = gameReducer(s, { type: "BOSS_COMPLETE", success: false });
		expect(next.stage).toBe(GameStage.DEBRIEF_PAGE_1);
		expect(next.deathType).toBe(DeathType.AUDIT_FAILURE);
		expect(next.unlockedEndings).toContain(DeathType.AUDIT_FAILURE);
	});

	it("RESET: restores initial state but keeps unlockedEndings", () => {
		const s = {
			...initialGameState,
			stage: GameStage.DEBRIEF_PAGE_1,
			unlockedEndings: [DeathType.BANKRUPT],
		};
		const next = gameReducer(s, { type: "RESET" });
		expect(next.stage).toBe(GameStage.INTRO);
		expect(next.unlockedEndings).toEqual([DeathType.BANKRUPT]);
	});
});

describe("Vector-aware death type resolution in gameReducer", () => {
	it("NEXT_INCIDENT with death vectors uses vector-based death type", () => {
		const mockCards = [
			createMockCard("vector-test-1", { deathVector: DeathType.CONGRESS }),
			createMockCard("vector-test-2", { deathVector: DeathType.CONGRESS }),
		];

		const state = {
			...initialGameState,
			stage: GameStage.PLAYING,
			role: RoleType.CHIEF_SOMETHING_OFFICER,
			budget: 1_000_000,
			heat: 100,
			hype: 50,
			history: [
				{ cardId: "vector-test-1", choice: "LEFT" as const },
				{ cardId: "vector-test-2", choice: "LEFT" as const },
			],
			effectiveDeck: mockCards,
		};

		const next = gameReducer(state, { type: "NEXT_INCIDENT" });
		expect(next.stage).toBe(GameStage.DEBRIEF_PAGE_1);
		expect(next.deathType).toBe(DeathType.CONGRESS);
	});

	it("NEXT_INCIDENT without deathVectors falls back to legacy role-based logic", () => {
		const mockCards = [createMockCard("no-vector-1")];

		const state = {
			...initialGameState,
			stage: GameStage.PLAYING,
			role: RoleType.CHIEF_SOMETHING_OFFICER,
			budget: 1_000_000,
			heat: 100,
			hype: 50,
			history: [{ cardId: "no-vector-1", choice: "LEFT" as const }],
			effectiveDeck: mockCards,
		};

		const next = gameReducer(state, { type: "NEXT_INCIDENT" });
		expect(next.deathType).toBe(DeathType.AUDIT_FAILURE);
	});

	it("BOSS_COMPLETE failure uses vector-based death type", () => {
		const mockCards = [
			createMockCard("boss-vector-1", { deathVector: DeathType.PRISON }),
			createMockCard("boss-vector-2", { deathVector: DeathType.PRISON }),
		];

		const state = {
			...initialGameState,
			stage: GameStage.BOSS_FIGHT,
			role: RoleType.CHIEF_SOMETHING_OFFICER,
			budget: 1_000_000,
			heat: 50,
			hype: 50,
			history: [
				{ cardId: "boss-vector-1", choice: "LEFT" as const },
				{ cardId: "boss-vector-2", choice: "LEFT" as const },
			],
			effectiveDeck: mockCards,
		};

		const next = gameReducer(state, { type: "BOSS_COMPLETE", success: false });
		expect(next.stage).toBe(GameStage.DEBRIEF_PAGE_1);
		expect(next.deathType).toBe(DeathType.PRISON);
	});

	it("BOSS_COMPLETE failure with no vectors uses role-based fallback", () => {
		const mockCards = [createMockCard("no-vec-1")];

		const state = {
			...initialGameState,
			stage: GameStage.BOSS_FIGHT,
			role: RoleType.CHIEF_SOMETHING_OFFICER,
			budget: 1_000_000,
			heat: 50,
			hype: 50,
			history: [{ cardId: "no-vec-1", choice: "LEFT" as const }],
			effectiveDeck: mockCards,
		};

		const next = gameReducer(state, { type: "BOSS_COMPLETE", success: false });
		expect(next.deathType).toBe(DeathType.AUDIT_FAILURE);
	});

	it("BANKRUPT override still works with vectors", () => {
		const mockCards = [
			createMockCard("vec-1", { deathVector: DeathType.CONGRESS }),
			createMockCard("vec-2", { deathVector: DeathType.CONGRESS }),
		];

		const state = {
			...initialGameState,
			stage: GameStage.PLAYING,
			role: RoleType.CHIEF_SOMETHING_OFFICER,
			budget: 0,
			heat: 50,
			hype: 50,
			history: [
				{ cardId: "vec-1", choice: "LEFT" as const },
				{ cardId: "vec-2", choice: "LEFT" as const },
			],
			effectiveDeck: mockCards,
		};

		const next = gameReducer(state, { type: "NEXT_INCIDENT" });
		expect(next.deathType).toBe(DeathType.BANKRUPT);
	});

	it("KIRK corruption override still works with vectors", () => {
		const mockCards = [
			createMockCard("vec-1", { deathVector: DeathType.CONGRESS }),
		];

		const state = {
			...initialGameState,
			stage: GameStage.PLAYING,
			role: RoleType.CHIEF_SOMETHING_OFFICER,
			budget: 0,
			heat: 50,
			hype: 50,
			kirkCorruptionActive: true,
			history: [{ cardId: "vec-1", choice: "LEFT" as const }],
			effectiveDeck: mockCards,
		};

		const next = gameReducer(state, { type: "NEXT_INCIDENT" });
		expect(next.deathType).toBe(DeathType.KIRK);
	});

	it("REPLACED_BY_SCRIPT override still works with vectors", () => {
		const mockCards = [
			createMockCard("vec-1", { deathVector: DeathType.CONGRESS }),
			createMockCard("vec-2", { deathVector: DeathType.CONGRESS }),
		];

		const state = {
			...initialGameState,
			stage: GameStage.PLAYING,
			role: RoleType.CHIEF_SOMETHING_OFFICER,
			budget: 1_000_000,
			heat: 100,
			hype: 5,
			history: [
				{ cardId: "vec-1", choice: "LEFT" as const },
				{ cardId: "vec-2", choice: "LEFT" as const },
			],
			effectiveDeck: mockCards,
		};

		const next = gameReducer(state, { type: "NEXT_INCIDENT" });
		expect(next.deathType).toBe(DeathType.REPLACED_BY_SCRIPT);
	});
});
