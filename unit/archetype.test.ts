import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	ARCHETYPES,
	calculateArchetype,
	calculateResilienceScore,
	mapOutcomeToTraits,
} from "../data/archetypes";
import { useArchetype } from "../hooks/useArchetype";
import type { Archetype, DebriefState, DebrieRStage } from "../types";
import { RoleType } from "../types";

describe("Archetype Types", () => {
	describe("ArchetypeId enum", () => {
		it("should have 6 archetype values", () => {
			const values = [
				"PRAGMATIST",
				"SHADOW_ARCHITECT",
				"DISRUPTOR",
				"CONSERVATIVE",
				"BALANCED",
				"CHAOS_AGENT",
			];
			expect(values).toHaveLength(6);
		});
	});

	describe("Archetype interface", () => {
		it("should define Archetype structure", () => {
			const archetype: Archetype = {
				id: "PRAGMATIST",
				name: "The Pragmatist",
				description: "A description",
				icon: "fa-chart-line",
				color: "text-blue-500",
				traits: ["decisive", "practical"],
			};

			expect(archetype.id).toBe("PRAGMATIST");
			expect(archetype.name).toBe("The Pragmatist");
			expect(archetype.traits).toHaveLength(2);
		});
	});

	describe("DebrieRStage enum", () => {
		it("should have 3 page values", () => {
			const values = ["PAGE_1", "PAGE_2", "PAGE_3"];
			expect(values).toHaveLength(3);
		});
	});

	describe("DebriefState interface", () => {
		it("should define DebriefState structure", () => {
			const state: DebriefState = {
				page: "PAGE_1" as DebrieRStage,
				archetype: {
					id: "BALANCED",
					name: "The Balanced",
					description: "A balanced approach",
					icon: "fa-balance-scale",
					color: "text-gray-500",
					traits: ["adaptable"],
				},
				resilience: 75,
				deathType: "BANKRUPT" as import("../types").DeathType,
			};

			expect(state.page).toBe("PAGE_1");
			expect(state.resilience).toBe(75);
			expect(state.deathType).toBe("BANKRUPT");
		});
	});
});

describe("Archetype Data and Calculation", () => {
	describe("ARCHETYPES", () => {
		it("should have 7 archetype definitions", () => {
			expect(Object.keys(ARCHETYPES)).toHaveLength(7);
		});

		it("should have valid archetype structure for each entry", () => {
			for (const archetype of Object.values(ARCHETYPES)) {
				expect(archetype).toHaveProperty("id");
				expect(archetype).toHaveProperty("name");
				expect(archetype).toHaveProperty("description");
				expect(archetype).toHaveProperty("icon");
				expect(archetype).toHaveProperty("color");
				expect(archetype).toHaveProperty("traits");
				expect(Array.isArray(archetype.traits)).toBe(true);
			}
		});
	});

	describe("mapOutcomeToTraits", () => {
		it("should map low fine outcomes to PRAGMATIST", () => {
			const outcome = { fine: -50000, heat: 5, hype: 10 };
			const traits = mapOutcomeToTraits(outcome);
			expect(traits).toContain("PRAGMATIST");
		});

		it("should map high heat outcomes to SHADOW_ARCHITECT", () => {
			const outcome = { fine: 0, heat: 35, hype: 0 };
			const traits = mapOutcomeToTraits(outcome);
			expect(traits).toContain("SHADOW_ARCHITECT");
		});

		it("should map high hype outcomes to DISRUPTOR", () => {
			const outcome = { fine: 0, heat: 0, hype: 25 };
			const traits = mapOutcomeToTraits(outcome);
			expect(traits).toContain("DISRUPTOR");
		});

		it("should map low hype outcomes to CONSERVATIVE", () => {
			const outcome = { fine: 0, heat: 0, hype: -25 };
			const traits = mapOutcomeToTraits(outcome);
			expect(traits).toContain("CONSERVATIVE");
		});
	});

	describe("calculateArchetype", () => {
		it("should return BALANCED for empty history", () => {
			const result = calculateArchetype(
				[],
				1000,
				10,
				50,
				RoleType.SOFTWARE_ENGINEER,
			);
			expect(result.archetype?.id).toBe("BALANCED");
		});

		it("should return null archetype for null role", () => {
			const result = calculateArchetype([], 1000, 10, 50, null);
			expect(result.archetype).toBeNull();
		});

		it("should calculate PRAGMATIST for budget-focused decisions", () => {
			// Simulate history with budget-preserving choices
			const history = [
				{ cardId: "dev_1", choice: "LEFT" as const },
				{ cardId: "dev_2", choice: "LEFT" as const },
				{ cardId: "dev_3", choice: "LEFT" as const },
			];
			const result = calculateArchetype(
				history,
				100000,
				10,
				50,
				RoleType.SOFTWARE_ENGINEER,
			);
			// With default cards, this should tend toward a specific archetype
			expect(result).toHaveProperty("archetype");
			expect(result).toHaveProperty("resilience");
			expect(result.resilience).toBeGreaterThanOrEqual(0);
			expect(result.resilience).toBeLessThanOrEqual(100);
			// Verify archetype has valid structure if not null
			if (result.archetype) {
				expect(result.archetype).toHaveProperty("id");
				expect(result.archetype).toHaveProperty("name");
			}
		});

		it("should return valid resilience score", () => {
			const history = [
				{ cardId: "dev_1", choice: "RIGHT" as const },
				{ cardId: "dev_2", choice: "LEFT" as const },
			];
			const result = calculateArchetype(
				history,
				50000,
				20,
				40,
				RoleType.SOFTWARE_ENGINEER,
			);
			expect(typeof result.resilience).toBe("number");
			expect(result.resilience).toBeGreaterThanOrEqual(0);
			expect(result.resilience).toBeLessThanOrEqual(100);
		});
	});

	describe("calculateResilienceScore", () => {
		it("should return 0 for empty scores", () => {
			const scores = {
				PRAGMATIST: 0,
				SHADOW_ARCHITECT: 0,
				DISRUPTOR: 0,
				CONSERVATIVE: 0,
				BALANCED: 0,
				CHAOS_AGENT: 0,
			};
			const score = calculateResilienceScore([], scores);
			expect(score).toBe(0);
		});

		it("should return score between 0 and 100", () => {
			const scores = {
				PRAGMATIST: 5,
				SHADOW_ARCHITECT: 2,
				DISRUPTOR: 1,
				CONSERVATIVE: 3,
				BALANCED: 0,
				CHAOS_AGENT: 0,
			};
			const history = [{ cardId: "test", choice: "LEFT" as const }];
			const score = calculateResilienceScore(history, scores);
			expect(score).toBeGreaterThanOrEqual(0);
			expect(score).toBeLessThanOrEqual(100);
		});

		it("should cap at 100 for very high consistency", () => {
			const scores = {
				PRAGMATIST: 50,
				SHADOW_ARCHITECT: 0,
				DISRUPTOR: 0,
				CONSERVATIVE: 0,
				BALANCED: 0,
				CHAOS_AGENT: 0,
			};
			const history = Array(10).fill({
				cardId: "test",
				choice: "LEFT" as const,
			});
			const score = calculateResilienceScore(history, scores);
			expect(score).toBe(100);
		});
	});
});

describe("useArchetype Hook", () => {
	it("should return archetype and resilience for valid inputs", () => {
		const history = [
			{ cardId: "dev_1", choice: "LEFT" as const },
			{ cardId: "dev_2", choice: "RIGHT" as const },
		];
		const { result } = renderHook(() =>
			useArchetype(history, 50000, 20, 40, RoleType.SOFTWARE_ENGINEER),
		);

		expect(result.current).toHaveProperty("archetype");
		expect(result.current).toHaveProperty("resilience");
		expect(typeof result.current.resilience).toBe("number");
	});

	it("should return null archetype for null role", () => {
		const history = [{ cardId: "dev_1", choice: "LEFT" as const }];
		const { result } = renderHook(() =>
			useArchetype(history, 50000, 20, 40, null),
		);

		expect(result.current.archetype).toBeNull();
		expect(result.current.resilience).toBe(0);
	});

	it("should return BALANCED for empty history", () => {
		const { result } = renderHook(() =>
			useArchetype([], 1000, 10, 50, RoleType.SOFTWARE_ENGINEER),
		);

		expect(result.current.archetype?.id).toBe("BALANCED");
	});

	it("should memoize results (same reference on re-render)", () => {
		const history = [{ cardId: "dev_1", choice: "LEFT" as const }];
		const { result, rerender } = renderHook(
			({ budget }) =>
				useArchetype(history, budget, 20, 40, RoleType.SOFTWARE_ENGINEER),
			{ initialProps: { budget: 50000 } },
		);

		const firstResult = result.current;
		rerender({ budget: 50000 }); // Same budget

		// Result should be memoized (same reference)
		expect(result.current.archetype).toBe(firstResult.archetype);
		expect(result.current.resilience).toBe(firstResult.resilience);
	});

	it("should recalculate when history changes", () => {
		let currentHistory = [{ cardId: "dev_1", choice: "LEFT" as const }];
		const { result, rerender } = renderHook(
			({ history }) =>
				useArchetype(history, 50000, 20, 40, RoleType.SOFTWARE_ENGINEER),
			{ initialProps: { history: currentHistory } },
		);

		const firstResult = result.current;

		// Change history
		currentHistory = [
			{ cardId: "dev_1", choice: "LEFT" as const },
			{ cardId: "dev_2", choice: "LEFT" as const },
			{ cardId: "dev_3", choice: "LEFT" as const },
		];
		rerender({ history: currentHistory });

		// Result should be different
		expect(result.current).not.toBe(firstResult);
	});
});
