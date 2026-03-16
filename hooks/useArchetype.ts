import { useMemo } from "react";
import { calculateArchetype } from "../data/archetypes";
import type { Archetype, RoleType } from "../types";

interface UseArchetypeResult {
	archetype: Archetype | null;
	resilience: number;
}

/**
 * Hook to calculate and memoize archetype and resilience score.
 * Calculates once when entering debrief, not repeatedly on renders.
 *
 * @param history - Decision history from game state
 * @param finalBudget - Final budget at game end
 * @param finalHeat - Final heat at game end
 * @param finalHype - Final hype at game end
 * @param role - Selected role type (null if not selected)
 * @returns Object containing calculated archetype and resilience score (0-100)
 */
export function useArchetype(
	history: { cardId: string; choice: "LEFT" | "RIGHT" }[],
	finalBudget: number,
	finalHeat: number,
	finalHype: number,
	role: RoleType | null,
): UseArchetypeResult {
	return useMemo(() => {
		return calculateArchetype(history, finalBudget, finalHeat, finalHype, role);
	}, [history, finalBudget, finalHeat, finalHype, role]);
}
