import { expect } from "vitest";
import { determineDeathTypeFromVectors } from "../data/deathVectors";
import type { ArchetypeId, Card } from "../types";
import { AppSource, DeathType, RoleType } from "../types";

/** Standard test constants for game state values */
export const TEST_DEFAULTS = {
	BUDGET: 50_000_000,
	HEAT: 50,
	HYPE: 50,
	ROLE: RoleType.TECH_AI_CONSULTANT,
} as const;

/** All death types except KIRK (for tests that need non-secret endings) */
export const NON_KIRK_DEATH_TYPES = Object.values(DeathType).filter(
	(t) => t !== DeathType.KIRK,
);

/** Validates a failure lesson has all required fields */
export function assertValidLesson(lesson: {
	title: string;
	explanation: string;
	realWorldExample: string;
}): void {
	expect(typeof lesson.title).toBe("string");
	expect(typeof lesson.explanation).toBe("string");
	expect(typeof lesson.realWorldExample).toBe("string");
	expect(lesson.title.length).toBeGreaterThan(0);
	expect(lesson.explanation.length).toBeGreaterThan(0);
	expect(lesson.realWorldExample.length).toBeGreaterThan(0);
}

/** Arguments for determineDeathType helper */
export interface TestDetermineArgs {
	vectorMap: Record<string, number>;
	budget?: number;
	heat?: number;
	hype?: number;
	role?: RoleType;
	archetype?: ArchetypeId;
}

/** Helper to call determineDeathTypeFromVectors with test defaults */
export function determineDeathType(args: TestDetermineArgs) {
	return determineDeathTypeFromVectors(
		args.vectorMap,
		args.budget ?? TEST_DEFAULTS.BUDGET,
		args.heat ?? TEST_DEFAULTS.HEAT,
		args.hype ?? TEST_DEFAULTS.HYPE,
		args.role ?? TEST_DEFAULTS.ROLE,
		args.archetype,
	);
}

/** Base outcome template for mock cards */
export const BASE_MOCK_OUTCOME: Card["onLeft"] = {
	label: "Option",
	hype: 5,
	heat: 10,
	fine: 1000,
	violation: "V1",
	feedback: {
		ROASTER: "Feedback",
		ZEN_MASTER: "Feedback",
		LOVEBOMBER: "Feedback",
	},
	lesson: "Lesson",
};

/** Creates a mock outcome with optional overrides */
export function createMockOutcome(
	overrides: Partial<Card["onLeft"]> = {},
): Card["onLeft"] {
	return { ...BASE_MOCK_OUTCOME, ...overrides };
}

/** Creates a complete mock card with optional outcome overrides */
export function createMockCard(
	id: string,
	leftOverrides: Partial<Card["onLeft"]> = {},
	rightOverrides: Partial<Card["onRight"]> = {},
): Card {
	return {
		id,
		source: AppSource.SLACK,
		sender: "Boss",
		context: "Test context",
		text: "Test card",
		onLeft: createMockOutcome(leftOverrides),
		onRight: createMockOutcome(rightOverrides),
	};
}
