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
	const onCriticalChangeRef = useRef(options?.onCriticalChange);
	onCriticalChangeRef.current = options?.onCriticalChange;

	// Use card ID (primitive) instead of card object for dependency
	const currentCardId = currentCard?.id ?? null;

	// Calculate the current isCritical value
	const isCritical = useMemo(() => {
		if (!currentCardId) return false;

		const scenario = PRESSURE_SCENARIOS[currentCardId] ?? null;
		const criticalFromScenario = scenario?.criticalForHaptics ?? false;
		const heatHigh = state.heat >= 70;
		return criticalFromScenario || heatHigh;
	}, [currentCardId, state.heat]);

	// Detect transition into critical and call onCriticalChange
	useEffect(() => {
		const onCriticalChange = onCriticalChangeRef.current;
		if (!onCriticalChange) return;

		if (isCritical && !previousIsCritical.current) {
			onCriticalChange(true);
		}
		previousIsCritical.current = isCritical;
	}, [isCritical]);
	return useMemo(() => {
		if (!currentCardId) {
			return {
				activeScenario: null,
				isUrgent: false,
				countdownSec: 0,
				timeoutResolvesTo: null,
				isCritical: false,
				getTeamImpact: () => null,
			};
		}

		const scenario = PRESSURE_SCENARIOS[currentCardId] ?? null;
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
		// Use primitive dependencies (cardId instead of card object)
	}, [currentCardId, state.heat, isChoiceResolving]);
}
