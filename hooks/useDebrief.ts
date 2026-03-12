import type React from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { calculateArchetype } from "../data/archetypes";
import { type Archetype, GameStage, type GameState } from "../types";

interface DebriefResult {
	archetype: Archetype | null;
	resilienceScore: number;
	nextPage: () => void;
	restart: () => void;
}

interface UseDebriefOptions {
	state: GameState;
	dispatch: React.Dispatch<
		| { type: "STAGE_CHANGE"; stage: GameStage; archetypeId?: string | null }
		| { type: "RESET" }
	>;
}

/**
 * Hook for managing debrief page navigation and archetype calculation.
 * Automatically calculates archetype when entering any debrief page (memoized, runs once).
 */
export function useDebrief(options: UseDebriefOptions): DebriefResult {
	const { state, dispatch } = options;
	const hasCalculatedArchetype = useRef(false);

	// Calculate archetype when entering any debrief page or GAME_OVER (only once)
	const calculation = useMemo(() => {
		const isDebriefStage =
			state.stage === GameStage.GAME_OVER ||
			state.stage === GameStage.DEBRIEF_PAGE_1 ||
			state.stage === GameStage.DEBRIEF_PAGE_2 ||
			state.stage === GameStage.DEBRIEF_PAGE_3;

		if (isDebriefStage && !hasCalculatedArchetype.current) {
			hasCalculatedArchetype.current = true;
			return calculateArchetype(
				state.history,
				state.budget,
				state.heat,
				state.hype,
				state.role,
			);
		}
		return null;
	}, [
		state.stage,
		state.history,
		state.budget,
		state.heat,
		state.hype,
		state.role,
	]);

	// Store calculation result
	const archetypeResult = useMemo(() => {
		if (calculation) {
			return calculation;
		}
		// Return stored values if already calculated
		return {
			archetype: null as Archetype | null,
			resilience: 0,
		};
	}, [calculation]);

	// Reset the calculation flag when leaving debrief stages
	useEffect(() => {
		if (!state.stage.startsWith("DEBRIEF")) {
			hasCalculatedArchetype.current = false;
		}
	}, [state.stage]);

	/**
	 * Advance to the next debrief page.
	 * Enforces valid progression: Page 1 → Page 2 → Page 3
	 */
	const nextPage = useCallback(() => {
		const transitions: Record<GameStage, GameStage | null> = {
			[GameStage.GAME_OVER]: GameStage.DEBRIEF_PAGE_2,
			[GameStage.DEBRIEF_PAGE_2]: GameStage.DEBRIEF_PAGE_3,
			[GameStage.DEBRIEF_PAGE_3]: null,
			[GameStage.INTRO]: null,
			[GameStage.PERSONALITY_SELECT]: null,
			[GameStage.ROLE_SELECT]: null,
			[GameStage.INITIALIZING]: null,
			[GameStage.PLAYING]: null,
			[GameStage.BOSS_FIGHT]: null,
			[GameStage.DEBRIEF_PAGE_1]: null,
			[GameStage.SUMMARY]: GameStage.DEBRIEF_PAGE_1,
		};

		const nextStage = transitions[state.stage];
		if (nextStage) {
			dispatch({ type: "STAGE_CHANGE", stage: nextStage });
		}
	}, [state.stage, dispatch]);

	/**
	 * Restart the game from the beginning.
	 * Goes back to INTRO stage.
	 */
	const restart = useCallback(() => {
		dispatch({ type: "RESET" });
	}, [dispatch]);

	return {
		archetype: archetypeResult.archetype,
		resilienceScore: archetypeResult.resilience,
		nextPage,
		restart,
	};
}
