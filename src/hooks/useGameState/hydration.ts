import {
	isValidEnumValue,
	safeArray,
	safeNumber,
	safeParseJson,
	safeString,
} from "../../lib/safeCoercion.js";
import {
	type Card,
	GameStage,
	type GameState,
	PersonalityType,
	RoleType,
} from "../../types.js";

const VALID_PERSONALITIES = new Set<string>(Object.values(PersonalityType));
const VALID_ROLES = new Set<string>(Object.values(RoleType));
const VALID_STAGES = new Set<string>(Object.values(GameStage));

// Default values matching initialGameState in useGameState.ts
const DEFAULT_HYPE = 50;
const DEFAULT_HEAT = 0;
const DEFAULT_BUDGET = 10000000;

const defaultState: GameState = {
	hype: DEFAULT_HYPE,
	heat: DEFAULT_HEAT,
	budget: DEFAULT_BUDGET,
	stage: GameStage.INTRO,
	personality: null,
	role: null,
	currentCardIndex: 0,
	history: [],
	deathReason: null,
	deathType: null,
	unlockedEndings: [],
	bossFightAnswers: [],
	effectiveDeck: null,
	kirkCounter: 0,
	kirkCorruptionActive: false,
	deathVectorMap: undefined,
};

export interface HydratedStateData {
	state?: string;
	personality?: string;
	role?: string;
}

/**
 * Retrieve saved game state from localStorage
 */
export function getSavedState(): HydratedStateData | null {
	const raw = window.localStorage.getItem("gameState");
	return raw ? safeParseJson<HydratedStateData>(raw) : null;
}

/**
 * Restore game state for role selection stage
 */
export function getRoleSelectState(saved: HydratedStateData): GameState | null {
	if (
		saved.state !== "role_select" ||
		!isValidEnumValue(saved.personality, VALID_PERSONALITIES)
	) {
		return null;
	}
	return {
		...defaultState,
		stage: GameStage.ROLE_SELECT,
		personality: saved.personality as PersonalityType,
		role: null,
	};
}

/**
 * Restore game state for playing stage
 */
export function getPlayingState(saved: HydratedStateData): GameState | null {
	if (
		saved.state !== "playing" ||
		!isValidEnumValue(saved.personality, VALID_PERSONALITIES) ||
		!isValidEnumValue(saved.role, VALID_ROLES)
	) {
		return null;
	}
	return {
		...defaultState,
		stage: GameStage.PLAYING,
		personality: saved.personality as PersonalityType,
		role: saved.role as RoleType,
	};
}

/**
 * Restore game state from debug state (km-debug-state localStorage key)
 */
export function getDebugState(): GameState | null {
	const raw = window.localStorage.getItem("km-debug-state");
	if (!raw) return null;

	const parsed = safeParseJson<Record<string, unknown>>(raw);
	if (!parsed || !isValidEnumValue(parsed.stage, VALID_STAGES)) return null;

	return {
		...defaultState,
		stage: parsed.stage as GameStage,
		hype: safeNumber(parsed.hype, DEFAULT_HYPE),
		heat: safeNumber(parsed.heat, DEFAULT_HEAT),
		budget: safeNumber(parsed.budget, DEFAULT_BUDGET),
		personality: isValidEnumValue(parsed.personality, VALID_PERSONALITIES)
			? (parsed.personality as PersonalityType)
			: null,
		role: isValidEnumValue(parsed.role, VALID_ROLES)
			? (parsed.role as RoleType)
			: null,
		currentCardIndex: safeNumber(parsed.currentCardIndex, 0),
		history: safeArray(parsed.history),
		deathReason: safeString(parsed.deathReason),
		deathType: safeString(parsed.deathType) as GameState["deathType"],
		unlockedEndings: safeArray(parsed.unlockedEndings),
		bossFightAnswers: safeArray(parsed.bossFightAnswers),
		effectiveDeck: Array.isArray(parsed.effectiveDeck)
			? (parsed.effectiveDeck as Card[])
			: null,
	};
}

/**
 * Hydrate initial game state from localStorage or return default
 * Priority: debug state > saved state > default
 */
export function getHydratedState(): GameState {
	if (typeof window === "undefined") return defaultState;

	const debugState = getDebugState();
	if (debugState) return debugState;

	const saved = getSavedState();
	if (!saved) return defaultState;

	return getRoleSelectState(saved) ?? getPlayingState(saved) ?? defaultState;
}
