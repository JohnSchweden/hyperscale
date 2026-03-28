import { DEATH_ENDINGS, ROLE_CARDS } from "../../data";
import { calculateArchetype } from "../../data/archetypes.js";
import {
	accumulateDeathVectors,
	determineDeathTypeFromVectors,
} from "../../data/deathVectors.js";
import {
	type Card,
	DeathType,
	type DeathVectorMap,
	GameStage,
	type GameState,
	type RoleType,
} from "../../types.js";

export interface DeathResolution {
	deathType: DeathType;
	vectorMap: DeathVectorMap;
}

/**
 * Resolve death type based on accumulated death vectors from player choices
 */
export function resolveDeathType(state: GameState): DeathResolution {
	const deck =
		state.effectiveDeck ?? (state.role ? ROLE_CARDS[state.role] : []);
	const vectorMap = accumulateDeathVectors(state.history, deck);
	const archetypeResult = calculateArchetype(
		state.history,
		state.budget,
		state.heat,
		state.hype,
		state.role,
	);

	const deathType = determineDeathTypeFromVectors(
		vectorMap,
		state.budget,
		state.heat,
		state.hype,
		state.role,
		archetypeResult.archetype?.id,
	);

	return { deathType, vectorMap };
}

/**
 * Get card array for a given role
 */
export function getRoleDeck(role: RoleType | null): Card[] {
	return role ? ROLE_CARDS[role] : [];
}

/**
 * Get unlocked endings for a death type
 */
export function getUnlockedEndings(
	state: GameState,
	deathType: DeathType,
): DeathType[] {
	if (deathType === DeathType.KIRK) return state.unlockedEndings;
	if (state.unlockedEndings.includes(deathType)) return state.unlockedEndings;
	return [...state.unlockedEndings, deathType];
}

/**
 * Create game over state with death type and vector map
 */
export function createGameOverState(
	state: GameState,
	deathType: DeathType,
	vectorMap?: DeathVectorMap,
): GameState {
	return {
		...state,
		stage: GameStage.GAME_OVER,
		deathType,
		deathReason: DEATH_ENDINGS[deathType].description,
		unlockedEndings: getUnlockedEndings(state, deathType),
		deathVectorMap: vectorMap,
	};
}
