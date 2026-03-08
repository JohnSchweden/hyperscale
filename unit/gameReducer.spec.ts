import { describe, expect, it } from "vitest";
import {
	determineDeathType,
	gameReducer,
	initialGameState,
} from "../hooks/useGameState";
import { DeathType, GameStage, RoleType } from "../types";

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
			personality: "ROASTER" as import("../types").PersonalityType,
		});
		expect(s2.stage).toBe(GameStage.ROLE_SELECT);
		expect(s2.personality).toBe("ROASTER");
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

	it("NEXT_INCIDENT: triggers GAME_OVER with BANKRUPT when budget <= 0", () => {
		const s = {
			...initialGameState,
			stage: GameStage.PLAYING,
			budget: 0,
			heat: 50,
			role: RoleType.SOFTWARE_ENGINEER,
		};
		const next = gameReducer(s, { type: "NEXT_INCIDENT" });
		expect(next.stage).toBe(GameStage.GAME_OVER);
		expect(next.deathType).toBe(DeathType.BANKRUPT);
		expect(next.deathReason).toBeTruthy();
		expect(next.unlockedEndings).toContain(DeathType.BANKRUPT);
	});

	it("NEXT_INCIDENT: triggers GAME_OVER with heat >= 100, role determines death type", () => {
		const base = {
			...initialGameState,
			stage: GameStage.PLAYING,
			budget: 1_000_000,
			heat: 100,
			hype: 50,
		};

		const prison = gameReducer(
			{ ...base, role: RoleType.SOMETHING_MANAGER },
			{ type: "NEXT_INCIDENT" },
		);
		expect(prison.deathType).toBe(DeathType.PRISON);

		const congress = gameReducer(
			{ ...base, role: RoleType.TECH_AI_CONSULTANT },
			{ type: "NEXT_INCIDENT" },
		);
		expect(congress.deathType).toBe(DeathType.CONGRESS);

		const audit = gameReducer(
			{ ...base, role: RoleType.CHIEF_SOMETHING_OFFICER },
			{ type: "NEXT_INCIDENT" },
		);
		expect(audit.deathType).toBe(DeathType.AUDIT_FAILURE);

		const fled = gameReducer(
			{ ...base, role: RoleType.SOFTWARE_ENGINEER },
			{ type: "NEXT_INCIDENT" },
		);
		expect(fled.deathType).toBe(DeathType.FLED_COUNTRY);

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

		const atEnd = { ...s, currentCardIndex: 1 };
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

	it("BOSS_COMPLETE: success goes to SUMMARY", () => {
		const s = { ...initialGameState, stage: GameStage.BOSS_FIGHT };
		const next = gameReducer(s, { type: "BOSS_COMPLETE", success: true });
		expect(next.stage).toBe(GameStage.SUMMARY);
	});

	it("BOSS_COMPLETE: fail goes to GAME_OVER with AUDIT_FAILURE", () => {
		const s = { ...initialGameState, stage: GameStage.BOSS_FIGHT };
		const next = gameReducer(s, { type: "BOSS_COMPLETE", success: false });
		expect(next.stage).toBe(GameStage.GAME_OVER);
		expect(next.deathType).toBe(DeathType.AUDIT_FAILURE);
		expect(next.unlockedEndings).toContain(DeathType.AUDIT_FAILURE);
	});

	it("RESET: restores initial state but keeps unlockedEndings", () => {
		const s = {
			...initialGameState,
			stage: GameStage.GAME_OVER,
			unlockedEndings: [DeathType.BANKRUPT],
		};
		const next = gameReducer(s, { type: "RESET" });
		expect(next.stage).toBe(GameStage.INTRO);
		expect(next.unlockedEndings).toEqual([DeathType.BANKRUPT]);
	});
});

describe("determineDeathType", () => {
	it("returns BANKRUPT when budget <= 0", () => {
		expect(determineDeathType(0, 50, 50, RoleType.SOFTWARE_ENGINEER)).toBe(
			DeathType.BANKRUPT,
		);
	});

	it("returns REPLACED_BY_SCRIPT when heat >= 100 and hype <= 10", () => {
		expect(determineDeathType(1e6, 100, 10, RoleType.SOFTWARE_ENGINEER)).toBe(
			DeathType.REPLACED_BY_SCRIPT,
		);
	});

	it("returns PRISON for FINANCE deck role when heat >= 100", () => {
		expect(determineDeathType(1e6, 100, 50, RoleType.SOMETHING_MANAGER)).toBe(
			DeathType.PRISON,
		);
	});

	it("returns CONGRESS for MARKETING deck role when heat >= 100", () => {
		expect(determineDeathType(1e6, 100, 50, RoleType.TECH_AI_CONSULTANT)).toBe(
			DeathType.CONGRESS,
		);
	});

	it("returns AUDIT_FAILURE for MANAGEMENT deck role when heat >= 100", () => {
		expect(
			determineDeathType(1e6, 100, 50, RoleType.CHIEF_SOMETHING_OFFICER),
		).toBe(DeathType.AUDIT_FAILURE);
	});

	it("returns FLED_COUNTRY for DEVELOPMENT role when heat >= 100 and hype > 10", () => {
		expect(determineDeathType(1e6, 100, 50, RoleType.SOFTWARE_ENGINEER)).toBe(
			DeathType.FLED_COUNTRY,
		);
	});

	it("returns AUDIT_FAILURE when heat < 100", () => {
		expect(determineDeathType(1e6, 50, 50, null)).toBe(DeathType.AUDIT_FAILURE);
	});
});
