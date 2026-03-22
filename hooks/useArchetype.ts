import { useMemo } from "react";
import { calculateArchetype } from "../data/archetypes";
import { type Archetype, DeathType, type RoleType } from "../types";

interface UseArchetypeResult {
	archetype: Archetype | null;
	resilience: number;
}

/** Phase 07: Kirk Easter Egg archetype — returned when deathType is KIRK */
const KIRK_ARCHETYPE: Archetype = {
	id: "KIRK",
	name: "Thinking Outside the Box",
	description:
		"You refused to play by the rules. The simulation wasn't designed for someone who questions the test itself.",
	icon: "shield-halved",
	color: "#00ffff",
	traits: ["Unconventional", "System Breaker", "Creative Thinker"],
};

/**
 * Hook to calculate and memoize archetype and resilience score.
 * Calculates once when entering debrief, not repeatedly on renders.
 *
 * @param history - Decision history from game state
 * @param finalBudget - Final budget at game end
 * @param finalHeat - Final heat at game end
 * @param finalHype - Final hype at game end
 * @param role - Selected role type (null if not selected)
 * @param deathType - Optional death type; KIRK overrides normal archetype calculation
 * @returns Object containing calculated archetype and resilience score (0-100)
 */
export function useArchetype(
	history: { cardId: string; choice: "LEFT" | "RIGHT" }[],
	finalBudget: number,
	finalHeat: number,
	finalHype: number,
	role: RoleType | null,
	deathType?: string | null,
): UseArchetypeResult {
	return useMemo(() => {
		if (deathType === DeathType.KIRK) {
			return { archetype: KIRK_ARCHETYPE, resilience: 0 };
		}
		return calculateArchetype(history, finalBudget, finalHeat, finalHype, role);
	}, [history, finalBudget, finalHeat, finalHype, role, deathType]);
}
