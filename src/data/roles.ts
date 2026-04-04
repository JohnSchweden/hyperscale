import { RoleType } from "../types";

/**
 * Descriptions for each role type, providing context and flavor.
 */
export const ROLE_DESCRIPTIONS: Record<RoleType, string> = {
	[RoleType.CHIEF_SOMETHING_OFFICER]:
		"The art of plausible deniability, elevated to C-suite levels.",
	[RoleType.HEAD_OF_SOMETHING]:
		"The middle-management shield. Passes heat up, directives down.",
	[RoleType.SOMETHING_MANAGER]:
		"Where spreadsheet wizardry meets creative compliance.",
	[RoleType.TECH_AI_CONSULTANT]:
		"The powerpoint mercenary — sells AI snake oil with confidence.",
	[RoleType.DATA_SCIENTIST]:
		"The hallucination wrangler. Tames models that occasionally invent facts.",
	[RoleType.SOFTWARE_ARCHITECT]:
		"The technical debt collector. Designs systems that outlive their usefulness.",
	[RoleType.SOFTWARE_ENGINEER]:
		"The bug manufacturer. Ships code that compiles (mostly).",
	[RoleType.VIBE_CODER]:
		"The prompt magician. Convinces AI to do their job, mostly.",
	[RoleType.VIBE_ENGINEER]:
		"The latency alchemist. Turns slow into acceptable.",
	[RoleType.AGENTIC_ENGINEER]:
		"The puppet master of rogue bots. Automation at scale.",
};

/**
 * Display labels for each role type, used in the UI.
 */
export const ROLE_LABELS: Record<RoleType, string> = {
	[RoleType.CHIEF_SOMETHING_OFFICER]: "Chief Something Officer",
	[RoleType.HEAD_OF_SOMETHING]: "Head of Something",
	[RoleType.SOMETHING_MANAGER]: "Something Manager",
	[RoleType.TECH_AI_CONSULTANT]: "Tech/AI Consultant",
	[RoleType.DATA_SCIENTIST]: "Data Scientist",
	[RoleType.SOFTWARE_ARCHITECT]: "Software Architect",
	[RoleType.SOFTWARE_ENGINEER]: "Software Engineer",
	[RoleType.VIBE_CODER]: "Vibe Coder",
	[RoleType.VIBE_ENGINEER]: "Vibe Engineer",
	[RoleType.AGENTIC_ENGINEER]: "Agentic Engineer",
};

/**
 * Font Awesome icon class names for each role type.
 */
export const ROLE_ICONS: Record<RoleType, string> = {
	[RoleType.CHIEF_SOMETHING_OFFICER]: "fa-user-tie",
	[RoleType.HEAD_OF_SOMETHING]: "fa-user-group",
	[RoleType.SOMETHING_MANAGER]: "fa-chart-line",
	[RoleType.TECH_AI_CONSULTANT]: "fa-chalkboard-user",
	[RoleType.DATA_SCIENTIST]: "fa-database",
	[RoleType.SOFTWARE_ARCHITECT]: "fa-sitemap",
	[RoleType.SOFTWARE_ENGINEER]: "fa-code",
	[RoleType.VIBE_CODER]: "fa-wand-magic-sparkles",
	[RoleType.VIBE_ENGINEER]: "fa-bolt",
	[RoleType.AGENTIC_ENGINEER]: "fa-robot",
};

/**
 * Temporary deck aliases mapping role types to existing card decks.
 * Used until role-specific cards are implemented in Phase 05.
 */
export const ROLE_DECK_ALIASES: Record<RoleType, string> = {
	[RoleType.CHIEF_SOMETHING_OFFICER]: "MANAGEMENT",
	[RoleType.HEAD_OF_SOMETHING]: "MANAGEMENT",
	[RoleType.SOMETHING_MANAGER]: "FINANCE",
	[RoleType.TECH_AI_CONSULTANT]: "MARKETING",
	[RoleType.DATA_SCIENTIST]: "HR",
	[RoleType.SOFTWARE_ARCHITECT]: "DEVELOPMENT",
	[RoleType.SOFTWARE_ENGINEER]: "DEVELOPMENT",
	[RoleType.VIBE_CODER]: "DEVELOPMENT",
	[RoleType.VIBE_ENGINEER]: "DEVELOPMENT",
	[RoleType.AGENTIC_ENGINEER]: "DEVELOPMENT",
};

/**
 * Gets the actual deck name to use for a given role (resolves alias).
 * @param role - The role type
 * @returns The deck name string
 */
export function getRoleDeck(role: RoleType): string {
	return ROLE_DECK_ALIASES[role];
}

/**
 * Legacy role type values preserved for Phase 05 recovery.
 * Not used at runtime but kept for reference.
 */
export const LEGACY_ROLE_TYPES = {
	DEVELOPMENT: "DEVELOPMENT",
	MARKETING: "MARKETING",
	MANAGEMENT: "MANAGEMENT",
	HR: "HR",
	FINANCE: "FINANCE",
	CLEANING: "CLEANING",
} as const;
