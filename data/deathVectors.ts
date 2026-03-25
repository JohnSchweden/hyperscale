import type {
	ArchetypeId,
	Card,
	DeathVectorMap,
	GameState,
	RoleType,
} from "../types";
import { DeathType } from "../types";
import { DECK_DEATH_TYPES } from "./deckDeathTypes";
import { getRoleDeck } from "./roles";

/**
 * Maps archetype IDs to their preferred death types.
 * Used for breaking ties when multiple death vectors have equal frequency.
 */
export const ARCHETYPE_DEATH_AFFINITY: Record<ArchetypeId, DeathType> = {
	SHADOW_ARCHITECT: DeathType.PRISON,
	DISRUPTOR: DeathType.CONGRESS,
	CONSERVATIVE: DeathType.REPLACED_BY_SCRIPT,
	CHAOS_AGENT: DeathType.FLED_COUNTRY,
	PRAGMATIST: DeathType.BANKRUPT,
	BALANCED: DeathType.AUDIT_FAILURE,
	KIRK: DeathType.KIRK,
};

/**
 * Accumulates death vectors from the player's history of choices.
 *
 * For each choice in the history, finds the corresponding card and outcome,
 * and if the outcome has a deathVector field, increments that death type's count.
 *
 * @param history - Game history of card choices
 * @param deck - The effective card deck
 * @returns DeathVectorMap with death type frequencies
 */
export function accumulateDeathVectors(
	history: GameState["history"],
	deck: Card[],
): DeathVectorMap {
	const vectorMap: DeathVectorMap = {};

	for (const entry of history) {
		const card = deck.find((c) => c.id === entry.cardId);
		if (!card) continue;

		const outcome = entry.choice === "LEFT" ? card.onLeft : card.onRight;
		if (!outcome.deathVector) continue;

		vectorMap[outcome.deathVector] = (vectorMap[outcome.deathVector] ?? 0) + 1;
	}

	return vectorMap;
}

/**
 * Fallback death type determination when death vectors don't provide a clear signal.
 * Based on role and remaining stats.
 */
function determineFallbackDeathType(role: RoleType | null): DeathType {
	if (!role) return DeathType.FLED_COUNTRY;
	return DECK_DEATH_TYPES[getRoleDeck(role)] ?? DeathType.FLED_COUNTRY;
}

interface DeathVectorEntry {
	deathType: DeathType;
	count: number;
}

/**
 * Extracts death vectors with count >= 2, excluding KIRK.
 */
function getSignificantVectors(vectorMap: DeathVectorMap): DeathVectorEntry[] {
	return Object.entries(vectorMap)
		.filter(([type, count]) => count >= 2 && type !== DeathType.KIRK)
		.map(([type, count]) => ({ deathType: type as DeathType, count }));
}

/**
 * Gets the highest-count vectors (handles ties).
 */
function getTopVectors(vectors: DeathVectorEntry[]): DeathVectorEntry[] {
	const maxCount = Math.max(...vectors.map((v) => v.count));
	return vectors.filter((v) => v.count === maxCount);
}

/**
 * Resolves ties using archetype affinity, or returns first if no match.
 */
function resolveTie(
	topVectors: DeathVectorEntry[],
	dominantArchetypeId?: ArchetypeId,
): DeathType {
	if (!dominantArchetypeId) return topVectors[0].deathType;

	const preference = ARCHETYPE_DEATH_AFFINITY[dominantArchetypeId];
	if (topVectors.some((v) => v.deathType === preference)) {
		return preference;
	}
	return topVectors[0].deathType;
}

/**
 * Determines death type using death vectors from player choices.
 *
 * Priority:
 * 1. BANKRUPT if budget <= 0 (always wins)
 * 2. REPLACED_BY_SCRIPT if heat >= 100 AND hype <= 10 (always wins)
 * 3. Highest-frequency death vector with count >= 2 (vector-driven)
 * 4. If tied vectors, use dominantArchetypeId to break tie via ARCHETYPE_DEATH_AFFINITY
 * 5. Fallback to role-based death type determination
 */
export function determineDeathTypeFromVectors(
	vectorMap: DeathVectorMap,
	budget: number,
	heat: number,
	hype: number,
	role: RoleType | null,
	dominantArchetypeId?: ArchetypeId,
): DeathType {
	if (budget <= 0) return DeathType.BANKRUPT;
	if (heat >= 100 && hype <= 10) return DeathType.REPLACED_BY_SCRIPT;

	const significantVectors = getSignificantVectors(vectorMap);
	if (significantVectors.length === 0) {
		return determineFallbackDeathType(role);
	}

	const topVectors = getTopVectors(significantVectors);

	if (topVectors.length === 1) {
		return topVectors[0].deathType;
	}

	return resolveTie(topVectors, dominantArchetypeId);
}
