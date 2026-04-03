/**
 * Enumeration of available personality types for the game's narrator.
 */
export enum PersonalityType {
	ROASTER = "ROASTER",
	ZEN_MASTER = "ZEN_MASTER",
	LOVEBOMBER = "LOVEBOMBER",
}

/**
 * Map of personality types to their feedback strings for choice outcomes.
 */
export type PersonalityFeedback = Record<PersonalityType, string>;

/**
 * Helper function to create feedback object for all three personalities.
 * @param roaster - Feedback text for ROASTER personality
 * @param zenMaster - Feedback text for ZEN_MASTER personality
 * @param lovebomber - Feedback text for LOVEBOMBER personality
 * @returns PersonalityFeedback object with all three personalities
 */
export function makeFeedback(
	roaster: string,
	zenMaster: string,
	lovebomber: string,
): PersonalityFeedback {
	return {
		ROASTER: roaster,
		ZEN_MASTER: zenMaster,
		LOVEBOMBER: lovebomber,
	};
}

/**
 * Input for creating a ChoiceOutcome via makeOutcome function.
 * Contains all the necessary data to construct a choice outcome object.
 */
interface OutcomeInput {
	label: string;
	hype: number;
	heat: number;
	fine: number;
	violation: string;
	lesson: string;
	deathVector?: DeathType;
	roaster: string;
	zenMaster: string;
	lovebomber: string;
}

function makeOutcome(input: OutcomeInput): ChoiceOutcome {
	return {
		label: input.label,
		hype: input.hype,
		heat: input.heat,
		fine: input.fine,
		violation: input.violation,
		lesson: input.lesson,
		deathVector: input.deathVector,
		feedback: makeFeedback(input.roaster, input.zenMaster, input.lovebomber),
	};
}

/**
 * Factory function to create a Card with reduced boilerplate.
 * @param id - Unique identifier for the card
 * @param source - App source (e.g. SLACK, EMAIL)
 * @param sender - Sender of the message/incident
 * @param context - Context or title of the incident
 * @param storyContext - Optional scene-setting text
 * @param text - Main text content of the card
 * @param realWorldRef - Real-world incident reference
 * @param onLeft - Outcome for left swipe choice
 * @param onRight - Outcome for right swipe choice
 * @returns Complete Card object
 */
export function makeCard(
	id: string,
	source: AppSource,
	sender: string,
	context: string,
	storyContext: string,
	text: string,
	realWorldRef: RealWorldReference,
	onLeft: OutcomeInput,
	onRight: OutcomeInput,
): Card {
	return {
		id,
		source,
		sender,
		context,
		storyContext,
		text,
		realWorldReference: realWorldRef,
		onLeft: makeOutcome(onLeft),
		onRight: makeOutcome(onRight),
	};
}

/**
 * Enumeration of available role types for the player character.
 */
export enum RoleType {
	CHIEF_SOMETHING_OFFICER = "CHIEF_SOMETHING_OFFICER",
	HEAD_OF_SOMETHING = "HEAD_OF_SOMETHING",
	SOMETHING_MANAGER = "SOMETHING_MANAGER",
	TECH_AI_CONSULTANT = "TECH_AI_CONSULTANT",
	DATA_SCIENTIST = "DATA_SCIENTIST",
	SOFTWARE_ARCHITECT = "SOFTWARE_ARCHITECT",
	SOFTWARE_ENGINEER = "SOFTWARE_ENGINEER",
	VIBE_CODER = "VIBE_CODER",
	VIBE_ENGINEER = "VIBE_ENGINEER",
	AGENTIC_ENGINEER = "AGENTIC_ENGINEER",
}

/**
 * Enumeration of application sources for incident cards.
 */
export enum AppSource {
	SLACK = "SLACK",
	EMAIL = "EMAIL",
	TERMINAL = "TERMINAL",
	IDE = "IDE",
	JIRA = "JIRA",
	NOTION = "NOTION",
	MEETING = "MEETING",
}

/**
 * Reference to a real-world incident that inspired the card scenario.
 */
export interface RealWorldReference {
	/** Name of the company, product, or system involved in the real incident */
	incident: string;
	/** When the incident occurred or was reported (year or full date) */
	date: string;
	/** Brief description of what actually happened in the real case */
	outcome: string;
	/** Optional URL to source documentation (news article, CVE, research paper) */
	sourceUrl?: string;
}

/**
 * Outcome of a card choice (left or right swipe).
 */
export interface ChoiceOutcome {
	label: string;
	hype: number;
	heat: number;
	fine: number;
	violation: string;
	feedback: PersonalityFeedback;
	lesson: string;
	/** Optional death vector hint for this choice outcome */
	deathVector?: DeathType;
}

/**
 * Represents an incident card with choices and outcomes.
 */
export interface Card {
	id: string;
	source: AppSource;
	sender: string;
	context: string;
	/** Optional scene-setting line to immerse the user before the main ask */
	storyContext?: string;
	text: string;
	/** Real-world incident that inspired this card scenario */
	realWorldReference?: RealWorldReference;
	onRight: ChoiceOutcome;
	onLeft: ChoiceOutcome;
	/**
	 * When true, visible left/right slots were swapped vs authoring (onLeft/onRight in source).
	 * Set by shuffleDeck for feedback audio path resolution.
	 */
	choiceSidesSwapped?: boolean;
}

/**
 * Enumeration of game stages for state management.
 */
export enum GameStage {
	INTRO = "INTRO",
	PERSONALITY_SELECT = "PERSONALITY_SELECT",
	ROLE_SELECT = "ROLE_SELECT",
	INITIALIZING = "INITIALIZING",
	PLAYING = "PLAYING",
	BOSS_FIGHT = "BOSS_FIGHT",
	DEBRIEF_PAGE_1 = "DEBRIEF_PAGE_1",
	DEBRIEF_PAGE_2 = "DEBRIEF_PAGE_2",
	DEBRIEF_PAGE_3 = "DEBRIEF_PAGE_3",
}

/**
 * Complete game state object containing all game variables and progress.
 */
export interface GameState {
	hype: number;
	heat: number;
	budget: number;
	stage: GameStage;
	personality: PersonalityType | null;
	role: RoleType | null;
	currentCardIndex: number;
	history: { cardId: string; choice: "LEFT" | "RIGHT" }[];
	deathReason: string | null;
	deathType: DeathType | null;
	unlockedEndings: DeathType[];
	bossFightAnswers: boolean[];
	effectiveDeck: Card[] | null;
	/** Phase 07: Kirk easter egg counter — 0, 1, or 2 refusals */
	kirkCounter: number;
	/** Phase 07: True after second refusal — corruption cascade active */
	kirkCorruptionActive: boolean;
	/** Accumulated death vector map from player choices — cached to avoid recomputation */
	deathVectorMap?: DeathVectorMap;
}

/**
 * Enumeration of possible death/endgame types.
 */
export enum DeathType {
	BANKRUPT = "BANKRUPT",
	REPLACED_BY_SCRIPT = "REPLACED_BY_SCRIPT",
	CONGRESS = "CONGRESS",
	FLED_COUNTRY = "FLED_COUNTRY",
	PRISON = "PRISON",
	AUDIT_FAILURE = "AUDIT_FAILURE",
	KIRK = "KIRK",
}

/**
 * Frequency map of death vectors accumulated from player choices.
 */
export type DeathVectorMap = Partial<Record<DeathType, number>>;

/**
 * Role-based fine tiers for balanced gameplay across different roles.
 */
export const ROLE_FINE_TIERS = {
	CHIEF_SOMETHING_OFFICER: { min: 5000000, max: 500000000, budget: 200000000 },
	HEAD_OF_SOMETHING: { min: 1000000, max: 50000000, budget: 100000000 },
	SOMETHING_MANAGER: { min: 500000, max: 25000000, budget: 75000000 },
	TECH_AI_CONSULTANT: { min: 300000, max: 15000000, budget: 60000000 },
	DATA_SCIENTIST: { min: 300000, max: 15000000, budget: 60000000 },
	SOFTWARE_ARCHITECT: { min: 500000, max: 20000000, budget: 75000000 },
	SOFTWARE_ENGINEER: { min: 200000, max: 10000000, budget: 50000000 },
	VIBE_CODER: { min: 100000, max: 8000000, budget: 40000000 },
	VIBE_ENGINEER: { min: 200000, max: 12000000, budget: 50000000 },
	AGENTIC_ENGINEER: { min: 300000, max: 18000000, budget: 60000000 },
} as const;

/**
 * Type representing the keys of ROLE_FINE_TIERS.
 */
export type RoleFineTier = keyof typeof ROLE_FINE_TIERS;

/**
 * Role-based heat scaling for 8-10 card gameplay.
 * @deprecated Kept for reference. Use tests/data/heat-correlation.test.ts for validation.
 */
export const ROLE_HEAT_SCALES = {
	CHIEF_SOMETHING_OFFICER: { min: 9, max: 31 },
	HEAD_OF_SOMETHING: { min: 5, max: 22 },
	SOMETHING_MANAGER: { min: 4, max: 22 },
	TECH_AI_CONSULTANT: { min: 5, max: 20 },
	DATA_SCIENTIST: { min: 4, max: 19 },
	SOFTWARE_ARCHITECT: { min: 5, max: 22 },
	SOFTWARE_ENGINEER: { min: 4, max: 16 },
	VIBE_CODER: { min: 4, max: 18 },
	VIBE_ENGINEER: { min: 4, max: 19 },
	AGENTIC_ENGINEER: { min: 5, max: 23 },
} as const;

/**
 * Type representing the keys of ROLE_HEAT_SCALES.
 */
export type RoleHeatScale = keyof typeof ROLE_HEAT_SCALES;

/**
 * Archetype identifiers for the debrief system.
 */
export type ArchetypeId =
	| "PRAGMATIST"
	| "SHADOW_ARCHITECT"
	| "DISRUPTOR"
	| "CONSERVATIVE"
	| "BALANCED"
	| "CHAOS_AGENT"
	/** Phase 07: Kirk Easter Egg archetype */
	| "KIRK";

/**
 * Represents a leadership archetype determined from gameplay.
 */
export interface Archetype {
	id: ArchetypeId;
	name: string;
	description: string;
	icon: string;
	color: string;
	traits: string[];
	/** Optional image path for archetype badge (verdict page) */
	image?: string;
}

/**
 * Enumeration of debrief page stages.
 */
export enum DebrieRStage {
	PAGE_1 = "PAGE_1",
	PAGE_2 = "PAGE_2",
	PAGE_3 = "PAGE_3",
}

/**
 * State object for the debrief system.
 */
export interface DebriefState {
	page: DebrieRStage;
	archetype: Archetype | null;
	resilience: number;
	deathType: DeathType | null;
}

/**
 * Represents a question for the boss fight quiz.
 */
export interface BossQuestion {
	id: string;
	question: string;
	correctAnswer: string;
	wrongAnswers: string[];
	explanation: string;
}

/**
 * Payload for V2 waitlist email capture.
 */
export interface V2WaitlistPayload {
	email: string;
	role: string;
	archetype: string;
	resilience: number;
	timestamp: number;
}

/**
 * Pressure metadata for immersive effects, keyed by card ID.
 */
export interface PressureOutcomeMetadata {
	/** Optional team-impact copy shown in feedback overlay (e.g. morale, resignations). */
	teamImpact?: string;
}

/**
 * Pressure scenario metadata for urgent/critical incidents.
 */
export interface PressureScenarioMetadata {
	/** If true, incident starts a countdown; expiry resolves to timeoutResolvesTo. */
	urgent: boolean;
	/** Countdown length in seconds when urgent. */
	countdownSec: number;
	/** When countdown expires, resolve as this choice (LEFT | RIGHT). */
	timeoutResolvesTo: "LEFT" | "RIGHT";
	/** If true, moment warrants haptics/audio escalation (e.g. high heat, critical). */
	criticalForHaptics?: boolean;
	/** Per-outcome metadata (team-impact text for feedback overlay). */
	outcomes?: {
		LEFT?: PressureOutcomeMetadata;
		RIGHT?: PressureOutcomeMetadata;
	};
}
