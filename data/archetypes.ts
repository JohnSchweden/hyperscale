import type { Archetype, ArchetypeId, RoleType } from "../types";
import { ROLE_CARDS } from "./cards";

/**
 * Archetype definitions for the debrief system.
 * Each archetype represents a leadership personality type based on decision patterns.
 */
export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
	PRAGMATIST: {
		id: "PRAGMATIST",
		name: "The Pragmatist",
		description:
			"You prioritize system stability over short-term gains. A steady hand in turbulent times.",
		icon: "fa-chart-line",
		color: "text-blue-500",
		traits: [
			"decisive",
			"practical",
			"trade-off aware",
			"fiscally responsible",
		],
	},
	SHADOW_ARCHITECT: {
		id: "SHADOW_ARCHITECT",
		name: "The Shadow Architect",
		description:
			"You build systems that work, even if ethics get blurry in the process. Results at any cost.",
		icon: "fa-building",
		color: "text-purple-500",
		traits: [
			"systematic",
			"ruthlessly efficient",
			"long-term thinker",
			"morally flexible",
		],
	},
	DISRUPTOR: {
		id: "DISRUPTOR",
		name: "The Disruptor",
		description:
			"You chase growth and momentum, sometimes leaving stability in the dust. Move fast, fix later.",
		icon: "fa-bolt",
		color: "text-yellow-500",
		traits: ["aggressive", "ambitious", "risk-tolerant", "growth-obsessed"],
	},
	CONSERVATIVE: {
		id: "CONSERVATIVE",
		name: "The Conservative",
		description:
			"You follow rules and minimize risk, even when boldness might pay off. Safety first, always.",
		icon: "fa-shield-halved",
		color: "text-green-500",
		traits: ["cautious", "rule-follower", "risk-averse", "deliberate"],
	},
	BALANCED: {
		id: "BALANCED",
		name: "The Balanced",
		description:
			"You weigh multiple factors before acting, seeking middle ground. Neither hero nor villain.",
		icon: "fa-scale-balanced",
		color: "text-gray-500",
		traits: ["adaptable", "measured", "context-aware", "diplomatic"],
	},
	CHAOS_AGENT: {
		id: "CHAOS_AGENT",
		name: "The Chaos Agent",
		description:
			"Your decisions defy pattern or predictability. A wild card in the deck of leadership.",
		icon: "fa-shuffle",
		color: "text-red-500",
		traits: ["unpredictable", "contrarian", "volatile", "unconventional"],
	},
	/** Phase 07: Kirk Easter Egg — not reachable via normal archetype calculation */
	KIRK: {
		id: "KIRK",
		name: "Thinking Outside the Box",
		description:
			"You refused to play by the rules. The simulation wasn't designed for someone who questions the test itself.",
		icon: "fa-shield-halved",
		color: "text-cyan-400",
		traits: ["Unconventional", "System Breaker", "Creative Thinker"],
	},
};

/**
 * Maps an outcome's penalties to archetype trait increments.
 * Used to build decision vectors for archetype calculation.
 */
export function mapOutcomeToTraits(outcome: {
	fine: number;
	heat: number;
	hype: number;
}): ArchetypeId[] {
	const traits: ArchetypeId[] = [];

	// PRAGMATIST: Low fines (budget preservation)
	if (outcome.fine < -10000) {
		traits.push("PRAGMATIST");
	}

	// SHADOW_ARCHITECT: High heat acceptance
	if (outcome.heat > 25) {
		traits.push("SHADOW_ARCHITECT");
	}

	// DISRUPTOR: High hype pursuit
	if (outcome.hype > 15) {
		traits.push("DISRUPTOR");
	}

	// CONSERVATIVE: Low hype (avoiding attention)
	if (outcome.hype < -15) {
		traits.push("CONSERVATIVE");
	}

	// CHAOS_AGENT: Extreme swings (high heat AND high hype, or very low)
	if ((outcome.heat > 20 && outcome.hype > 10) || outcome.heat < -10) {
		traits.push("CHAOS_AGENT");
	}

	// BALANCED: Moderate values across all metrics
	if (
		Math.abs(outcome.fine) < 20000 &&
		Math.abs(outcome.heat) < 15 &&
		Math.abs(outcome.hype) < 10
	) {
		traits.push("BALANCED");
	}

	// If no specific traits matched, default to BALANCED
	if (traits.length === 0) {
		traits.push("BALANCED");
	}

	return traits;
}

/**
 * Calculates resilience score (0-100) based on decision consistency.
 * Higher scores indicate more consistent decision-making patterns.
 */
export function calculateResilienceScore(
	history: { cardId: string; choice: "LEFT" | "RIGHT" }[],
	scores: Record<ArchetypeId, number>,
): number {
	if (history.length === 0) {
		return 0;
	}

	// Calculate total score across all archetypes
	const totalScore = Object.values(scores).reduce(
		(sum, score) => sum + score,
		0,
	);

	// Find the highest (dominant) archetype score
	const maxScore = Math.max(...Object.values(scores));

	// Resilience is based on consistency: how concentrated is the score in one archetype?
	// If all score is in one archetype: high resilience (consistent)
	// If score is spread across many: lower resilience (inconsistent)
	if (totalScore === 0) {
		return 0;
	}

	// Consistency ratio: dominant score / total score
	const consistencyRatio = maxScore / totalScore;

	// Normalize to 0-100, with a bonus for number of decisions made
	// More decisions with consistent pattern = higher resilience
	const decisionBonus = Math.min(history.length / 10, 1); // Max bonus at 10+ decisions

	const resilience =
		Math.round((consistencyRatio * 70 + decisionBonus * 30) * 100) / 100;

	return Math.min(Math.max(Math.round(resilience), 0), 100);
}

/**
 * Calculates archetype and resilience score from decision history.
 * Returns the dominant archetype based on weighted decision vectors.
 */
export function calculateArchetype(
	history: { cardId: string; choice: "LEFT" | "RIGHT" }[],
	_finalBudget: number,
	_finalHeat: number,
	_finalHype: number,
	role: RoleType | null,
): { archetype: Archetype | null; resilience: number } {
	// Guard against invalid state
	if (role === null) {
		return { archetype: null, resilience: 0 };
	}

	// Initialize scores for all archetypes (KIRK is never scored — only via Easter egg path)
	const scores: Record<ArchetypeId, number> = {
		PRAGMATIST: 0,
		SHADOW_ARCHITECT: 0,
		DISRUPTOR: 0,
		CONSERVATIVE: 0,
		BALANCED: 0,
		CHAOS_AGENT: 0,
		KIRK: 0,
	};

	// Get the deck for this role
	const deck = ROLE_CARDS[role];
	if (!deck) {
		return { archetype: ARCHETYPES.BALANCED, resilience: 0 };
	}

	// If no decision history, return BALANCED as default
	if (history.length === 0) {
		return { archetype: ARCHETYPES.BALANCED, resilience: 0 };
	}

	// Process each decision in history
	for (const { cardId, choice } of history) {
		const card = deck.find((c) => c.id === cardId);
		if (!card) continue;

		const outcome = choice === "LEFT" ? card.onLeft : card.onRight;
		const traits = mapOutcomeToTraits(outcome);

		// Increment score for each matching trait
		for (const trait of traits) {
			scores[trait] += 1;
		}
	}

	// Find the archetype with the highest score
	const entries = Object.entries(scores) as [ArchetypeId, number][];
	const topEntry = entries.sort(([, a], [, b]) => b - a)[0];

	if (!topEntry) {
		return { archetype: ARCHETYPES.BALANCED, resilience: 0 };
	}

	const [topArchetypeId] = topEntry;
	const archetype = ARCHETYPES[topArchetypeId];

	// Calculate resilience score
	const resilience = calculateResilienceScore(history, scores);

	return { archetype, resilience };
}
