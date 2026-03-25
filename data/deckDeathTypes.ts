import { DeathType } from "../types";

/**
 * Legacy deck-to-death-type mapping.
 * Used as fallback when death vectors don't provide a clear signal.
 */
export const DECK_DEATH_TYPES: Record<string, DeathType> = {
	FINANCE: DeathType.PRISON,
	MARKETING: DeathType.CONGRESS,
	MANAGEMENT: DeathType.AUDIT_FAILURE,
	DEVELOPMENT: DeathType.REPLACED_BY_SCRIPT,
};
