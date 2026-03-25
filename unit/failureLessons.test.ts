import { describe, expect, it } from "vitest";
import {
	FAILURE_LESSONS,
	generateDeathExplanation,
	getRetryPrompt,
} from "../data/failureLessons";
import { DeathType, PersonalityType } from "../types";
import { assertValidLesson, NON_KIRK_DEATH_TYPES } from "./testHelpers";

function expectExplanationValid(explanation: string, pattern: RegExp): void {
	expect(explanation).toBeDefined();
	expect(explanation.length).toBeGreaterThan(0);
	expect(explanation.toLowerCase()).toMatch(pattern);
}

function expectPromptValid(prompt: string): void {
	expect(prompt).toBeDefined();
	expect(typeof prompt).toBe("string");
	expect(prompt.length).toBeGreaterThan(0);
}

describe("failureLessons", () => {
	describe("FAILURE_LESSONS data structure", () => {
		it("has 3-4 lessons for each non-KIRK death type", () => {
			for (const deathType of NON_KIRK_DEATH_TYPES) {
				const lessons = FAILURE_LESSONS[deathType];
				expect(lessons).toBeDefined();
				expect(lessons.length).toBeGreaterThanOrEqual(3);
				expect(lessons.length).toBeLessThanOrEqual(4);
			}
		});

		it("has title, explanation, and realWorldExample fields for each lesson", () => {
			for (const deathType of Object.keys(FAILURE_LESSONS)) {
				const lessons =
					FAILURE_LESSONS[deathType as keyof typeof FAILURE_LESSONS];
				for (const lesson of lessons) assertValidLesson(lesson);
			}
		});

		it("does not include KIRK in FAILURE_LESSONS", () => {
			expect(FAILURE_LESSONS[DeathType.KIRK]).toBeUndefined();
		});
	});

	describe("generateDeathExplanation", () => {
		it("returns explanation mentioning congressional exposure for CONGRESS with vectors", () => {
			const explanation = generateDeathExplanation(
				DeathType.CONGRESS,
				{ [DeathType.CONGRESS]: 2 },
				5,
			);
			expectExplanationValid(explanation, /congress|exposure|public/i);
		});

		it("mentions financial decisions for BANKRUPT with vectors", () => {
			const explanation = generateDeathExplanation(
				DeathType.BANKRUPT,
				{ [DeathType.BANKRUPT]: 3 },
				6,
			);
			expectExplanationValid(explanation, /bankrupt|budget|financial|money/i);
		});

		it("returns generic explanation when no vectors present", () => {
			const explanation = generateDeathExplanation(
				DeathType.AUDIT_FAILURE,
				{},
				4,
			);
			expectExplanationValid(explanation, /audit/i);
		});

		it("handles prison with vector map", () => {
			const explanation = generateDeathExplanation(
				DeathType.PRISON,
				{ [DeathType.PRISON]: 2 },
				7,
			);
			expectExplanationValid(explanation, /compliance|hiding|federal/i);
		});
	});

	describe("getRetryPrompt", () => {
		it("returns personality-specific retry prompt for ROASTER", () => {
			const prompt = getRetryPrompt(
				DeathType.BANKRUPT,
				PersonalityType.ROASTER,
			);
			expectPromptValid(prompt);
			expect(prompt.toLowerCase()).not.toMatch(/heart|love|care/);
		});

		it("returns philosophical prompt for ZEN_MASTER", () => {
			const prompt = getRetryPrompt(
				DeathType.BANKRUPT,
				PersonalityType.ZEN_MASTER,
			);
			expect(prompt).toMatch(/[Tt]he|[Pp]ath|[Ww]isdom|[Ee]xplore/);
		});

		it("returns encouraging prompt for LOVEBOMBER", () => {
			const prompt = getRetryPrompt(
				DeathType.BANKRUPT,
				PersonalityType.LOVEBOMBER,
			);
			expect(prompt.toLowerCase()).toMatch(/good|great|you|best|amazing/i);
		});

		it("is specific to death type, not generic", () => {
			const bankruptPrompt = getRetryPrompt(
				DeathType.BANKRUPT,
				PersonalityType.ROASTER,
			);
			const congressPrompt = getRetryPrompt(
				DeathType.CONGRESS,
				PersonalityType.ROASTER,
			);
			expect(bankruptPrompt).not.toBe(congressPrompt);
		});

		it("includes strategy hint based on death type", () => {
			const prompt = getRetryPrompt(
				DeathType.BANKRUPT,
				PersonalityType.ROASTER,
			);
			expect(prompt.toLowerCase()).toMatch(
				/burning|budget|money|financial|spend|cost/i,
			);
		});

		it("works for all death types except KIRK", () => {
			for (const deathType of NON_KIRK_DEATH_TYPES) {
				expectPromptValid(getRetryPrompt(deathType, PersonalityType.ROASTER));
			}
		});
	});
});
