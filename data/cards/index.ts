import { type Card, RoleType } from "../../types";
import { ROLE_DECK_ALIASES } from "../roles";
import { BRANCH_CARDS } from "./branches";
import { CLEANING_CARDS } from "./cleaning";
import { DEVELOPMENT_CARDS } from "./development";
import { FINANCE_CARDS } from "./finance";
import { HR_CARDS } from "./hr";
import { MANAGEMENT_CARDS } from "./management";
import { MARKETING_CARDS } from "./marketing";

export { CLEANING_CARDS } from "./cleaning";
export { DEVELOPMENT_CARDS } from "./development";
export { FINANCE_CARDS } from "./finance";
export { HR_CARDS } from "./hr";
export { MANAGEMENT_CARDS } from "./management";
export { MARKETING_CARDS } from "./marketing";

// Legacy deck identifiers (for alias resolution)
// These map to the existing card arrays above
type DeckName =
	| "DEVELOPMENT"
	| "MARKETING"
	| "MANAGEMENT"
	| "HR"
	| "FINANCE"
	| "CLEANING";

// Map legacy deck names to their card arrays
const DECK_CARDS: Record<DeckName, Card[]> = {
	DEVELOPMENT: DEVELOPMENT_CARDS,
	MARKETING: MARKETING_CARDS,
	MANAGEMENT: MANAGEMENT_CARDS,
	HR: HR_CARDS,
	FINANCE: FINANCE_CARDS,
	CLEANING: CLEANING_CARDS,
};

// Temporary deck aliases mapping new impact zones to existing decks
// Until Phase 05 adds role-specific cards, these point to the closest existing deck
// (Previous mapping preserved as comments for reference)
// CHIEF_SOMETHING_OFFICER -> MANAGEMENT
// HEAD_OF_SOMETHING -> MANAGEMENT
// SOMETHING_MANAGER -> FINANCE
// TECH_AI_CONSULTANT -> MARKETING
// DATA_SCIENTIST -> HR
// SOFTWARE_ARCHITECT -> DEVELOPMENT
// SOFTWARE_ENGINEER -> DEVELOPMENT
// VIBE_CODER -> DEVELOPMENT
// VIBE_ENGINEER -> DEVELOPMENT
// AGENTIC_ENGINEER -> DEVELOPMENT

// Helper to get the deck name for a role
function getDeckForRole(role: RoleType): DeckName {
	return ROLE_DECK_ALIASES[role] as DeckName;
}

// ROLE_CARDS now derives from the alias mapping
// Each new role points to the appropriate existing deck
export const ROLE_CARDS: Record<RoleType, Card[]> = {
	[RoleType.CHIEF_SOMETHING_OFFICER]: DECK_CARDS.MANAGEMENT,
	[RoleType.HEAD_OF_SOMETHING]: DECK_CARDS.MANAGEMENT,
	[RoleType.SOMETHING_MANAGER]: DECK_CARDS.FINANCE,
	[RoleType.TECH_AI_CONSULTANT]: DECK_CARDS.MARKETING,
	[RoleType.DATA_SCIENTIST]: DECK_CARDS.HR,
	[RoleType.SOFTWARE_ARCHITECT]: DECK_CARDS.DEVELOPMENT,
	[RoleType.SOFTWARE_ENGINEER]: DECK_CARDS.DEVELOPMENT,
	[RoleType.VIBE_CODER]: DECK_CARDS.DEVELOPMENT,
	[RoleType.VIBE_ENGINEER]: DECK_CARDS.DEVELOPMENT,
	[RoleType.AGENTIC_ENGINEER]: DECK_CARDS.DEVELOPMENT,
};

// Export the deck alias getter for use in runtime logic
export { getDeckForRole };

/**
 * Branch injections: conditional cards that appear after specific choices
 * Key format: `${cardId}:${choice}` (e.g., "dev_1:RIGHT")
 * Value: array of cards to inject after the matching card
 */
export const BRANCH_INJECTIONS: Record<string, Card[]> = {
	// Development: consequence card for pasting code into ChatGPT
	"dev_1:RIGHT": [
		BRANCH_CARDS.find((c) => c.id === "dev_branch_aftermath") || { id: "empty", source: undefined } as Card,
	].filter((c) => c.id !== "empty"),
};
