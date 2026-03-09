import { describe, expect, it } from "vitest";
import type {
	Archetype,
	ArchetypeId,
	DebriefState,
	DebrieRStage,
} from "../types";

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
				deathType: "BANKRUPT",
			};

			expect(state.page).toBe("PAGE_1");
			expect(state.resilience).toBe(75);
			expect(state.deathType).toBe("BANKRUPT");
		});
	});
});
