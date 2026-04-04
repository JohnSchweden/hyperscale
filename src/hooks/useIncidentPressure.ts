import { useEffect, useMemo, useRef } from "react";
import { PRESSURE_SCENARIOS } from "../data";
import type { Card, GameState, PressureScenarioMetadata } from "../types";

/**
 * State returned by the useIncidentPressure hook.
 */
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

/**
 * Options for the useIncidentPressure hook.
 */
export interface UseIncidentPressureOptions {
	/** Callback fired when transitioning into critical state (heat >= 70). */
	onCriticalChange?: (isCritical: boolean) => void;
}

export function useIncidentPressure(
	state: GameState,
	currentCard: Card | null,
	isChoiceResolving: boolean,
	options?: UseIncidentPressureOptions,
): IncidentPressureState {
	const previousIsCritical = useRef(false);

	// Calculate the current isCritical value
	const isCritical = useMemo(() => {
		if (!currentCard) return false;

		const scenario = PRESSURE_SCENARIOS[currentCard.id] ?? null;
		const criticalFromScenario = scenario?.criticalForHaptics ?? false;
		const heatHigh = state.heat >= 70;
		return criticalFromScenario || heatHigh;
	}, [currentCard, state.heat]);

	// Detect transition into critical and call onCriticalChange
	useEffect(() => {
		if (!options?.onCriticalChange) return;

		if (isCritical && !previousIsCritical.current) {
			options.onCriticalChange(true);
		}
		previousIsCritical.current = isCritical;
	}, [isCritical, options]);
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
