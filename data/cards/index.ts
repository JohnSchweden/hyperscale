import { type Card, RoleType } from "../../types";
import { AGENTIC_ENGINEER_CARDS } from "./agentic-engineer";
import { BRANCH_CARDS } from "./branches";
import { CHIEF_SOMETHING_OFFICER_CARDS } from "./chief-something-officer";
import { DATA_SCIENTIST_CARDS } from "./data-scientist";
import { HEAD_OF_SOMETHING_CARDS } from "./head-of-something";
import { SOFTWARE_ARCHITECT_CARDS } from "./software-architect";
import { SOFTWARE_ENGINEER_CARDS } from "./software-engineer";
import { SOMETHING_MANAGER_CARDS } from "./something-manager";
import { TECH_AI_CONSULTANT_CARDS } from "./tech-ai-consultant";
import { VIBE_CODER_CARDS } from "./vibe-coder";
import { VIBE_ENGINEER_CARDS } from "./vibe-engineer";

// Legacy card exports (preserved for backward compatibility)
export { CLEANING_CARDS } from "./_archive/cleaning";
export { DEVELOPMENT_CARDS } from "./_archive/development";
export { FINANCE_CARDS } from "./_archive/finance";
export { HR_CARDS } from "./_archive/hr";
export { MANAGEMENT_CARDS } from "./_archive/management";
export { MARKETING_CARDS } from "./_archive/marketing";
// Re-export all role card arrays for tests and utilities
export { AGENTIC_ENGINEER_CARDS } from "./agentic-engineer";
export { CHIEF_SOMETHING_OFFICER_CARDS } from "./chief-something-officer";
export { DATA_SCIENTIST_CARDS } from "./data-scientist";
export { HEAD_OF_SOMETHING_CARDS } from "./head-of-something";
// Reusable no-win dilemmas (supplementary to role-specific cards)
export { NOWIN_DILEMMAS } from "./nowin-dilemmas";
export { SOFTWARE_ARCHITECT_CARDS } from "./software-architect";
export { SOFTWARE_ENGINEER_CARDS } from "./software-engineer";
export { SOMETHING_MANAGER_CARDS } from "./something-manager";
export { TECH_AI_CONSULTANT_CARDS } from "./tech-ai-consultant";
export { VIBE_CODER_CARDS } from "./vibe-coder";
export { VIBE_ENGINEER_CARDS } from "./vibe-engineer";

/**
 * ROLE_CARDS: Direct mapping from 10 new impact-zone roles to their card arrays
 *
 * Each role has 8-10+ unique cards reflecting their specific concerns:
 * - Chief Something Officer: C-suite governance, liability, board pressure
 * - Head of Something: Middle management, team politics, blame shielding
 * - Something Manager: Budget spreadsheets, ROI, resource allocation
 * - Tech AI Consultant: Client contracts, vendor lock-in, deliverables
 * - Data Scientist: Model quality, bias, explainability, training data
 * - Software Architect: System design, technical debt, scalability
 * - Software Engineer: Implementation, security, code quality
 * - Vibe Coder: AI-assisted coding, prompts, LLM hallucinations
 * - Vibe Engineer: Performance, latency, optimization, caching
 * - Agentic Engineer: Autonomous agents, emergent behavior, governance
 */
export const ROLE_CARDS: Record<RoleType, Card[]> = {
	[RoleType.CHIEF_SOMETHING_OFFICER]: CHIEF_SOMETHING_OFFICER_CARDS,
	[RoleType.HEAD_OF_SOMETHING]: HEAD_OF_SOMETHING_CARDS,
	[RoleType.SOMETHING_MANAGER]: SOMETHING_MANAGER_CARDS,
	[RoleType.TECH_AI_CONSULTANT]: TECH_AI_CONSULTANT_CARDS,
	[RoleType.DATA_SCIENTIST]: DATA_SCIENTIST_CARDS,
	[RoleType.SOFTWARE_ARCHITECT]: SOFTWARE_ARCHITECT_CARDS,
	[RoleType.SOFTWARE_ENGINEER]: SOFTWARE_ENGINEER_CARDS,
	[RoleType.VIBE_CODER]: VIBE_CODER_CARDS,
	[RoleType.VIBE_ENGINEER]: VIBE_ENGINEER_CARDS,
	[RoleType.AGENTIC_ENGINEER]: AGENTIC_ENGINEER_CARDS,
};

// Total: 180+ cards across 10 roles

/**
 * Branch injections: conditional cards that appear after specific choices
 * Key format: `${cardId}:${choice}` (e.g., "dev_1:RIGHT")
 * Value: array of cards to inject after the matching card
 */
function findBranchCard(id: string): Card | undefined {
	return BRANCH_CARDS.find((c) => c.id === id);
}

export const BRANCH_INJECTIONS: Record<string, Card[]> = {
	"dev_1:RIGHT": (() => {
		const card = findBranchCard("dev_branch_aftermath");
		return card ? [card] : [];
	})(),
};
