import type { Dispatch } from "react";
import { useCallback, useReducer } from "react";
import {
	BRANCH_INJECTIONS,
	DEATH_ENDINGS,
	getRoleDeck,
	ROLE_CARDS,
} from "../data";
import { resolveDeckWithBranching } from "../lib/deck";
import {
	type Card,
	DeathType,
	GameStage,
	type GameState,
	PersonalityType,
	RoleType,
} from "../types";

const INITIAL_BUDGET = 10000000;

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
	| { type: "RESET" };

export function determineDeathType(
	budget: number,
	heat: number,
	hype: number,
	role: RoleType | null,
): DeathType {
	if (budget <= 0) return DeathType.BANKRUPT;
	if (heat >= 100) {
		if (hype <= 10) return DeathType.REPLACED_BY_SCRIPT;
		if (role) {
			const deck = getRoleDeck(role);
			if (deck === "FINANCE") return DeathType.PRISON;
			if (deck === "MARKETING") return DeathType.CONGRESS;
			if (deck === "MANAGEMENT") return DeathType.AUDIT_FAILURE;
		}
		return DeathType.FLED_COUNTRY;
	}
	return DeathType.AUDIT_FAILURE;
}

const VALID_PERSONALITIES = new Set(
	Object.values(PersonalityType) as unknown as string[],
);
const VALID_ROLES = new Set(Object.values(RoleType) as unknown as string[]);

interface HydratedStateData {
	state?: string;
	personality?: string;
	role?: string;
}

function parseGameState(raw: string): HydratedStateData | null {
	try {
		return JSON.parse(raw) as HydratedStateData;
	} catch {
		return null;
	}
}

function getRoleSelectState(parsed: HydratedStateData): GameState | null {
	if (
		parsed.state === "role_select" &&
		parsed.personality &&
		VALID_PERSONALITIES.has(parsed.personality)
	) {
		return {
			...initialGameState,
			stage: GameStage.ROLE_SELECT,
			personality: parsed.personality as PersonalityType,
			role: null,
		};
	}
	return null;
}

function getPlayingState(parsed: HydratedStateData): GameState | null {
	if (
		parsed.state === "playing" &&
		parsed.personality &&
		parsed.role &&
		VALID_PERSONALITIES.has(parsed.personality) &&
		VALID_ROLES.has(parsed.role)
	) {
		return {
			...initialGameState,
			stage: GameStage.PLAYING,
			personality: parsed.personality as PersonalityType,
			role: parsed.role as RoleType,
		};
	}
	return null;
}

function getHydratedState(): GameState {
	if (typeof window === "undefined") return initialGameState;

	const raw = window.localStorage.getItem("gameState");
	if (!raw) return initialGameState;

	const parsed = parseGameState(raw);
	if (!parsed) return initialGameState;

	const roleSelectState = getRoleSelectState(parsed);
	if (roleSelectState) return roleSelectState;

	const playingState = getPlayingState(parsed);
	if (playingState) return playingState;

	return initialGameState;
}

function addUnlockedEndingIfMissing(
	endings: DeathType[],
	deathType: DeathType,
): DeathType[] {
	return endings.includes(deathType) ? endings : [...endings, deathType];
}

function createGameOverState(
	state: GameState,
	deathType: DeathType,
): GameState {
	return {
		...state,
		stage: GameStage.GAME_OVER,
		deathType,
		deathReason: DEATH_ENDINGS[deathType].description,
		unlockedEndings: addUnlockedEndingIfMissing(
			state.unlockedEndings,
			deathType,
		),
	};
}

const STAGE_TRANSITIONS: Record<GameStage, GameStage[]> = {
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
	[GameStage.SUMMARY]: [GameStage.INTRO],
};

export function gameReducer(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case "STAGE_CHANGE": {
			const allowed = STAGE_TRANSITIONS[state.stage];
			if (allowed != null && !allowed.includes(action.stage)) {
				if (
					typeof process !== "undefined" &&
					process.env.NODE_ENV !== "production"
				) {
					console.error(
						`Invalid stage transition: ${state.stage} → ${action.stage}`,
					);
				}
				return state;
			}
			const update: Partial<GameState> = { stage: action.stage };
			if (action.personality !== undefined)
				update.personality = action.personality;
			if (action.role !== undefined) update.role = action.role;
			if (action.currentCardIndex !== undefined)
				update.currentCardIndex = action.currentCardIndex;
			if (action.shuffledDeck !== undefined)
				update.effectiveDeck = action.shuffledDeck;
			return { ...state, ...update };
		}
		case "CHOICE_MADE": {
			const { direction, outcome } = action;
			return {
				...state,
				hype: Math.max(0, state.hype + outcome.hype),
				heat: Math.min(100, state.heat + outcome.heat),
				budget: state.budget - outcome.fine,
				history: [
					...state.history,
					{ cardId: outcome.cardId, choice: direction },
				],
			};
		}
		case "NEXT_INCIDENT": {
			if (state.budget <= 0) {
				return createGameOverState(state, DeathType.BANKRUPT);
			}
			if (state.heat >= 100) {
				const deathType = determineDeathType(
					state.budget,
					state.heat,
					state.hype,
					state.role,
				);
				return createGameOverState(state, deathType);
			}
			if (!state.role) return state;

			const cards = resolveDeckWithBranching(
				state.effectiveDeck ?? ROLE_CARDS[state.role],
				state.history,
				state.currentCardIndex,
				BRANCH_INJECTIONS,
			);

			if (state.currentCardIndex + 1 >= cards.length) {
				return { ...state, stage: GameStage.BOSS_FIGHT, effectiveDeck: cards };
			}
			return {
				...state,
				currentCardIndex: state.currentCardIndex + 1,
				effectiveDeck: cards,
			};
		}
		case "BOSS_ANSWER": {
			const newBudget = action.isCorrect
				? state.budget
				: state.budget - 1000000;
			return {
				...state,
				budget: newBudget,
				bossFightAnswers: [...state.bossFightAnswers, action.isCorrect],
			};
		}
		case "BOSS_COMPLETE": {
			if (action.success) {
				return { ...state, stage: GameStage.SUMMARY };
			}
			return createGameOverState(state, DeathType.AUDIT_FAILURE);
		}
		case "RESET": {
			return {
				...initialGameState,
				unlockedEndings: state.unlockedEndings,
			};
		}
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

export function useGameState(): UseGameStateResult {
	const [state, dispatch] = useReducer(gameReducer, null, () =>
		getHydratedState(),
	);

	const startGame = useCallback(() => {
		dispatch({ type: "STAGE_CHANGE", stage: GameStage.PERSONALITY_SELECT });
	}, []);

	const selectPersonality = useCallback((personality: PersonalityType) => {
		dispatch({
			type: "STAGE_CHANGE",
			stage: GameStage.ROLE_SELECT,
			personality,
		});
	}, []);

	const selectRole = useCallback((role: RoleType) => {
		dispatch({
			type: "STAGE_CHANGE",
			stage: GameStage.INITIALIZING,
			role,
			currentCardIndex: 0,
		});
	}, []);

	const makeChoice = useCallback(
		(
			direction: "LEFT" | "RIGHT",
			outcome: { hype: number; heat: number; fine: number; cardId: string },
		) => {
			dispatch({ type: "CHOICE_MADE", direction, outcome });
		},
		[],
	);

	const nextIncident = useCallback(() => {
		dispatch({ type: "NEXT_INCIDENT" });
	}, []);

	const answerBossQuestion = useCallback((isCorrect: boolean) => {
		dispatch({ type: "BOSS_ANSWER", isCorrect });
	}, []);

	const completeBossFight = useCallback((success: boolean) => {
		dispatch({ type: "BOSS_COMPLETE", success });
	}, []);

	const resetGame = useCallback(() => {
		dispatch({ type: "RESET" });
	}, []);

	return {
		state,
		dispatch,
		startGame,
		selectPersonality,
		selectRole,
		makeChoice,
		nextIncident,
		answerBossQuestion,
		completeBossFight,
		resetGame,
	};
}
