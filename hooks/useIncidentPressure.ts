import { useMemo } from "react";
import { PRESSURE_SCENARIOS } from "../data";
import type { Card, GameState, PressureScenarioMetadata } from "../types";

export interface IncidentPressureState {
	/** Metadata for the current card; null if no scenario configured. */
	activeScenario: PressureScenarioMetadata | null;
	/** Whether this incident has an active countdown. */
	isUrgent: boolean;
	/** Countdown length in seconds when urgent. */
	countdownSec: number;
	/** Which choice to apply when countdown expires. */
	timeoutResolvesTo: "LEFT" | "RIGHT" | null;
	/** Whether to escalate haptics/audio (critical moment). */
	isCritical: boolean;
	/** Team-impact text for the given choice direction, if configured. */
	getTeamImpact: (direction: "LEFT" | "RIGHT") => string | null;
}

export function useIncidentPressure(
	state: GameState,
	currentCard: Card | null,
	isChoiceResolving: boolean,
): IncidentPressureState {
	return useMemo(() => {
		if (!currentCard) {
			return {
				activeScenario: null,
				isUrgent: false,
				countdownSec: 0,
				timeoutResolvesTo: null,
				isCritical: false,
				getTeamImpact: () => null,
			};
		}

		const scenario = PRESSURE_SCENARIOS[currentCard.id] ?? null;
		const isUrgent = (scenario?.urgent ?? false) && !isChoiceResolving;
		const countdownSec = scenario?.countdownSec ?? 0;
		const timeoutResolvesTo = scenario?.timeoutResolvesTo ?? null;
		const criticalFromScenario = scenario?.criticalForHaptics ?? false;
		const heatHigh = state.heat >= 70;
		const isCritical = criticalFromScenario || heatHigh;

		const getTeamImpact = (direction: "LEFT" | "RIGHT"): string | null => {
			const outcome = scenario?.outcomes?.[direction];
			return outcome?.teamImpact ?? null;
		};

		return {
			activeScenario: scenario,
			isUrgent,
			countdownSec,
			timeoutResolvesTo,
			isCritical,
			getTeamImpact,
		};
	}, [currentCard, state.heat, isChoiceResolving]);
}
