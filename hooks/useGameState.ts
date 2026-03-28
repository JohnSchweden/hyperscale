import type { Dispatch } from "react";
import { useEffect, useMemo, useReducer } from "react";
import { BRANCH_INJECTIONS, DEATH_ENDINGS, ROLE_CARDS } from "../data";
import { calculateArchetype } from "../data/archetypes.js";
import {
	accumulateDeathVectors,
	determineDeathTypeFromVectors,
} from "../data/deathVectors.js";
import { DECK_DEATH_TYPES } from "../data/deckDeathTypes.js";
import { KIRK_CORRUPTED_CARDS } from "../data/kirkCards.js";
import { resolveDeckWithBranching } from "../lib/deck.js";
import {
	isValidEnumValue,
	safeArray,
	safeNumber,
	safeParseJson,
	safeString,
} from "../lib/safeCoercion.js";
import {
	type Card,
	DeathType,
	type DeathVectorMap,
	GameStage,
	type GameState,
	PersonalityType,
	ROLE_FINE_TIERS,
	RoleType,
} from "../types.js";

const INITIAL_BUDGET = 10000000;

function getInitialBudgetForRole(role: RoleType | null): number {
	if (!role) return INITIAL_BUDGET;
	return ROLE_FINE_TIERS[role]?.budget ?? INITIAL_BUDGET;
}

export const initialGameState: GameState = {
	hype: 50,
	heat: 0,
	budget: INITIAL_BUDGET,
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
};

export type GameAction =
	| {
			type: "STAGE_CHANGE";
			stage: GameStage;
			personality?: PersonalityType | null;
			role?: RoleType | null;
			currentCardIndex?: number;
			shuffledDeck?: Card[] | null;
	  }
	| {
			type: "CHOICE_MADE";
			direction: "LEFT" | "RIGHT";
			outcome: { hype: number; heat: number; fine: number; cardId: string };
	  }
	| { type: "NEXT_INCIDENT" }
	| { type: "BOSS_ANSWER"; isCorrect: boolean }
	| { type: "BOSS_COMPLETE"; success: boolean }
	| { type: "RESET" }
	| { type: "KIRK_REFUSAL" };

function resolveDeathType(state: GameState): {
	deathType: DeathType;
	vectorMap: DeathVectorMap;
} {
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

const VALID_PERSONALITIES = new Set<string>(Object.values(PersonalityType));
const VALID_ROLES = new Set<string>(Object.values(RoleType));
const VALID_STAGES = new Set<string>(Object.values(GameStage));

interface HydratedStateData {
	state?: string;
	personality?: string;
	role?: string;
}

function getSavedState(): HydratedStateData | null {
	const raw = window.localStorage.getItem("gameState");
	return raw ? safeParseJson<HydratedStateData>(raw) : null;
}

function getRoleSelectState(saved: HydratedStateData): GameState | null {
	if (
		saved.state !== "role_select" ||
		!isValidEnumValue(saved.personality, VALID_PERSONALITIES)
	) {
		return null;
	}
	return {
		...initialGameState,
		stage: GameStage.ROLE_SELECT,
		personality: saved.personality as PersonalityType,
		role: null,
	};
}

function getPlayingState(saved: HydratedStateData): GameState | null {
	if (
		saved.state !== "playing" ||
		!isValidEnumValue(saved.personality, VALID_PERSONALITIES) ||
		!isValidEnumValue(saved.role, VALID_ROLES)
	) {
		return null;
	}
	return {
		...initialGameState,
		stage: GameStage.PLAYING,
		personality: saved.personality as PersonalityType,
		role: saved.role as RoleType,
	};
}

function getDebugState(): GameState | null {
	const raw = window.localStorage.getItem("km-debug-state");
	if (!raw) return null;

	const parsed = safeParseJson<Record<string, unknown>>(raw);
	if (!parsed || !isValidEnumValue(parsed.stage, VALID_STAGES)) return null;

	return {
		...initialGameState,
		stage: parsed.stage as GameStage,
		hype: safeNumber(parsed.hype, initialGameState.hype),
		heat: safeNumber(parsed.heat, initialGameState.heat),
		budget: safeNumber(parsed.budget, initialGameState.budget),
		personality: isValidEnumValue(parsed.personality, VALID_PERSONALITIES)
			? (parsed.personality as PersonalityType)
			: null,
		role: isValidEnumValue(parsed.role, VALID_ROLES)
			? (parsed.role as RoleType)
			: null,
		currentCardIndex: safeNumber(parsed.currentCardIndex, 0),
		history: safeArray(parsed.history),
		deathReason: safeString(parsed.deathReason),
		deathType: safeString(parsed.deathType) as DeathType | null,
		unlockedEndings: safeArray(parsed.unlockedEndings),
		bossFightAnswers: safeArray(parsed.bossFightAnswers),
		effectiveDeck: Array.isArray(parsed.effectiveDeck)
			? (parsed.effectiveDeck as Card[])
			: null,
	};
}

function getHydratedState(): GameState {
	if (typeof window === "undefined") return initialGameState;

	const debugState = getDebugState();
	if (debugState) return debugState;

	const saved = getSavedState();
	if (!saved) return initialGameState;

	return (
		getRoleSelectState(saved) ?? getPlayingState(saved) ?? initialGameState
	);
}

function getUnlockedEndings(
	state: GameState,
	deathType: DeathType,
): DeathType[] {
	if (deathType === DeathType.KIRK) return state.unlockedEndings;
	if (state.unlockedEndings.includes(deathType)) return state.unlockedEndings;
	return [...state.unlockedEndings, deathType];
}

function createGameOverState(
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

const VALID_TRANSITIONS: Record<GameStage, GameStage[]> = {
	[GameStage.INTRO]: [GameStage.PERSONALITY_SELECT],
	[GameStage.PERSONALITY_SELECT]: [GameStage.ROLE_SELECT],
	[GameStage.ROLE_SELECT]: [GameStage.INITIALIZING],
	[GameStage.INITIALIZING]: [GameStage.PLAYING],
	[GameStage.PLAYING]: [GameStage.BOSS_FIGHT, GameStage.GAME_OVER],
	[GameStage.BOSS_FIGHT]: [GameStage.SUMMARY, GameStage.GAME_OVER],
	[GameStage.GAME_OVER]: [GameStage.DEBRIEF_PAGE_2],
	[GameStage.DEBRIEF_PAGE_1]: [],
	[GameStage.DEBRIEF_PAGE_2]: [GameStage.DEBRIEF_PAGE_3],
	[GameStage.DEBRIEF_PAGE_3]: [GameStage.INTRO],
	[GameStage.SUMMARY]: [GameStage.DEBRIEF_PAGE_2, GameStage.INTRO],
};

function isValidStageTransition(from: GameStage, to: GameStage): boolean {
	return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

function logInvalidTransition(from: GameStage, to: GameStage): void {
	if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
		console.error(`Invalid stage transition: ${from} → ${to}`);
	}
}

function buildStageUpdate(
	action: Extract<GameAction, { type: "STAGE_CHANGE" }>,
): Partial<GameState> {
	const update: Partial<GameState> = { stage: action.stage };

	if (action.personality !== undefined) {
		update.personality = action.personality;
	}
	if (action.role !== undefined) {
		update.role = action.role;
		update.budget = getInitialBudgetForRole(action.role);
	}
	if (action.currentCardIndex !== undefined) {
		update.currentCardIndex = action.currentCardIndex;
	}
	if (action.shuffledDeck !== undefined) {
		update.effectiveDeck = action.shuffledDeck;
	}

	return update;
}

function handleStageChange(
	state: GameState,
	action: Extract<GameAction, { type: "STAGE_CHANGE" }>,
): GameState {
	if (!isValidStageTransition(state.stage, action.stage)) {
		logInvalidTransition(state.stage, action.stage);
		return state;
	}

	return { ...state, ...buildStageUpdate(action) };
}

function handleChoiceMade(
	state: GameState,
	action: Extract<GameAction, { type: "CHOICE_MADE" }>,
): GameState {
	return {
		...state,
		hype: Math.max(0, state.hype + action.outcome.hype),
		heat: Math.min(100, state.heat + action.outcome.heat),
		budget: state.budget - action.outcome.fine,
		history: [
			...state.history,
			{ cardId: action.outcome.cardId, choice: action.direction },
		],
	};
}

function handleBossAnswer(
	state: GameState,
	action: Extract<GameAction, { type: "BOSS_ANSWER" }>,
): GameState {
	return {
		...state,
		budget: action.isCorrect ? state.budget : state.budget - 1_000_000,
		bossFightAnswers: [...state.bossFightAnswers, action.isCorrect],
	};
}

function handleBossComplete(
	state: GameState,
	action: Extract<GameAction, { type: "BOSS_COMPLETE" }>,
): GameState {
	if (action.success) {
		return { ...state, stage: GameStage.SUMMARY };
	}
	const { deathType, vectorMap } = resolveDeathType(state);
	return createGameOverState(state, deathType, vectorMap);
}

function getRoleDeck(role: RoleType | null): Card[] {
	return role ? ROLE_CARDS[role] : [];
}

function handleKirkRefusal(state: GameState): GameState {
	if (state.kirkCounter >= 2) return state;

	const newCount = state.kirkCounter + 1;
	if (newCount !== 2) {
		return { ...state, kirkCounter: newCount };
	}

	const currentDeck = state.effectiveDeck ?? getRoleDeck(state.role);
	const deckWithKirk = [...currentDeck];
	deckWithKirk.splice(state.currentCardIndex + 1, 0, ...KIRK_CORRUPTED_CARDS);

	return {
		...state,
		kirkCounter: newCount,
		kirkCorruptionActive: true,
		effectiveDeck: deckWithKirk,
	};
}

function handleNextIncident(state: GameState): GameState {
	if (state.budget <= 0) {
		const deathType = state.kirkCorruptionActive
			? DeathType.KIRK
			: DeathType.BANKRUPT;
		return createGameOverState(state, deathType);
	}
	if (state.heat >= 100) {
		const deathType = state.kirkCorruptionActive
			? DeathType.KIRK
			: resolveDeathType(state).deathType;
		return createGameOverState(state, deathType);
	}
	if (!state.role) return state;

	const cards = resolveDeckWithBranching(
		state.effectiveDeck ?? getRoleDeck(state.role),
		state.history,
		state.currentCardIndex,
		BRANCH_INJECTIONS,
	);

	if (state.kirkCorruptionActive) {
		const lastPlayed = state.history[state.history.length - 1];
		if (lastPlayed?.cardId === "kirk-nobel") {
			return createGameOverState(state, DeathType.KIRK);
		}
	}

	if (state.currentCardIndex + 1 >= cards.length) {
		return { ...state, stage: GameStage.BOSS_FIGHT, effectiveDeck: cards };
	}

	return {
		...state,
		currentCardIndex: state.currentCardIndex + 1,
		effectiveDeck: cards,
	};
}

export function gameReducer(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case "STAGE_CHANGE":
			return handleStageChange(state, action);
		case "CHOICE_MADE":
			return handleChoiceMade(state, action);
		case "NEXT_INCIDENT":
			return handleNextIncident(state);
		case "BOSS_ANSWER":
			return handleBossAnswer(state, action);
		case "BOSS_COMPLETE":
			return handleBossComplete(state, action);
		case "KIRK_REFUSAL":
			return handleKirkRefusal(state);
		case "RESET":
			return { ...initialGameState, unlockedEndings: state.unlockedEndings };
		default:
			return state;
	}
}

export interface UseGameStateResult {
	state: GameState;
	dispatch: Dispatch<GameAction>;
	startGame: () => void;
	selectPersonality: (personality: PersonalityType) => void;
	selectRole: (role: RoleType) => void;
	makeChoice: (
		direction: "LEFT" | "RIGHT",
		outcome: { hype: number; heat: number; fine: number; cardId: string },
	) => void;
	nextIncident: () => void;
	answerBossQuestion: (isCorrect: boolean) => void;
	completeBossFight: (success: boolean) => void;
	resetGame: () => void;
}

function createActionDispatchers(dispatch: Dispatch<GameAction>) {
	return {
		startGame: () =>
			dispatch({ type: "STAGE_CHANGE", stage: GameStage.PERSONALITY_SELECT }),

		selectPersonality: (personality: PersonalityType) =>
			dispatch({
				type: "STAGE_CHANGE",
				stage: GameStage.ROLE_SELECT,
				personality,
			}),

		selectRole: (role: RoleType) =>
			dispatch({
				type: "STAGE_CHANGE",
				stage: GameStage.INITIALIZING,
				role,
				currentCardIndex: 0,
			}),

		makeChoice: (
			direction: "LEFT" | "RIGHT",
			outcome: { hype: number; heat: number; fine: number; cardId: string },
		) => dispatch({ type: "CHOICE_MADE", direction, outcome }),

		nextIncident: () => dispatch({ type: "NEXT_INCIDENT" }),

		answerBossQuestion: (isCorrect: boolean) =>
			dispatch({ type: "BOSS_ANSWER", isCorrect }),

		completeBossFight: (success: boolean) =>
			dispatch({ type: "BOSS_COMPLETE", success }),

		resetGame: () => dispatch({ type: "RESET" }),
	};
}

function useDebugStateSync(state: GameState) {
	useEffect(() => {
		if (typeof window === "undefined") return;
		if (window.localStorage.getItem("km-debug-state")) {
			window.localStorage.setItem("km-debug-state", JSON.stringify(state));
		}
	}, [state]);
}

export function useGameState(): UseGameStateResult {
	const [state, dispatch] = useReducer(gameReducer, null, getHydratedState);
	useDebugStateSync(state);

	const actionDispatchers = useMemo(
		() => createActionDispatchers(dispatch),
		[],
	);

	return { state, dispatch, ...actionDispatchers };
}
