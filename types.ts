export enum PersonalityType {
	ROASTER = "ROASTER",
	ZEN_MASTER = "ZEN_MASTER",
	LOVEBOMBER = "LOVEBOMBER",
}

/** Helper to create feedback for all three personalities */
export const makeFeedback = (
	roaster: string,
	zenMaster: string,
	lovebomber: string,
): Record<PersonalityType, string> => ({
	[PersonalityType.ROASTER]: roaster,
	[PersonalityType.ZEN_MASTER]: zenMaster,
	[PersonalityType.LOVEBOMBER]: lovebomber,
});

export enum RoleType {
	// Legacy roles preserved for Phase 05 recovery
	// DEVELOPMENT = "DEVELOPMENT",
	// MARKETING = "MARKETING",
	// MANAGEMENT = "MANAGEMENT",
	// HR = "HR",
	// FINANCE = "FINANCE",
	// CLEANING = "CLEANING",

	// New impact-zone roles
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

export enum AppSource {
	SLACK = "SLACK",
	EMAIL = "EMAIL",
	TERMINAL = "TERMINAL",
	IDE = "IDE",
	JIRA = "JIRA",
	NOTION = "NOTION",
	MEETING = "MEETING",
}

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
	onRight: {
		label: string;
		hype: number;
		heat: number;
		fine: number;
		violation: string;
		feedback: {
			[key in PersonalityType]: string;
		};
		lesson: string;
	};
	onLeft: {
		label: string;
		hype: number;
		heat: number;
		fine: number;
		violation: string;
		feedback: {
			[key in PersonalityType]: string;
		};
		lesson: string;
	};
}

export enum GameStage {
	INTRO = "INTRO",
	PERSONALITY_SELECT = "PERSONALITY_SELECT",
	ROLE_SELECT = "ROLE_SELECT",
	INITIALIZING = "INITIALIZING",
	PLAYING = "PLAYING",
	BOSS_FIGHT = "BOSS_FIGHT",
	GAME_OVER = "GAME_OVER",
	SUMMARY = "SUMMARY",
	DEBRIEF_PAGE_1 = "DEBRIEF_PAGE_1",
	DEBRIEF_PAGE_2 = "DEBRIEF_PAGE_2",
	DEBRIEF_PAGE_3 = "DEBRIEF_PAGE_3",
}

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
}

export enum DeathType {
	BANKRUPT = "BANKRUPT",
	REPLACED_BY_SCRIPT = "REPLACED_BY_SCRIPT",
	CONGRESS = "CONGRESS",
	FLED_COUNTRY = "FLED_COUNTRY",
	PRISON = "PRISON",
	AUDIT_FAILURE = "AUDIT_FAILURE",
	KIRK = "KIRK",
}

/** Phase 03-06: Role-based fine tiers for balanced gameplay */
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

export type RoleFineTier = keyof typeof ROLE_FINE_TIERS;

/**
 * Role-based heat scaling for 8-10 card gameplay.
 * Target: ~10-12 average heat per card (was 20-25)
 * Formula: newHeat = Math.round(oldHeat * 0.45)
 *
 * Actual ranges achieved:
 * - Vibe Coder: 4-18 (was 8-40), scale 0.45
 * - Software Engineer: 4-16 (was 8-35), scale 0.45
 * - Data Scientist: 4-19 (was 8-42), scale 0.5
 * - C-suite: 9-31 (was 20-68), scale 0.75
 *
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

export type RoleHeatScale = keyof typeof ROLE_HEAT_SCALES;

/** Phase 06: Archetype types for debrief system */
export type ArchetypeId =
	| "PRAGMATIST"
	| "SHADOW_ARCHITECT"
	| "DISRUPTOR"
	| "CONSERVATIVE"
	| "BALANCED"
	| "CHAOS_AGENT"
	/** Phase 07: Kirk Easter Egg archetype */
	| "KIRK";

export interface Archetype {
	id: ArchetypeId;
	name: string;
	description: string;
	icon: string;
	color: string;
	traits: string[];
}

export enum DebrieRStage {
	PAGE_1 = "PAGE_1",
	PAGE_2 = "PAGE_2",
	PAGE_3 = "PAGE_3",
}

export interface DebriefState {
	page: DebrieRStage;
	archetype: Archetype | null;
	resilience: number;
	deathType: DeathType | null;
}

export interface BossQuestion {
	id: string;
	question: string;
	correctAnswer: string;
	wrongAnswers: string[];
	explanation: string;
}

/** Phase 06-04: V2 Waitlist payload for email capture */
export interface V2WaitlistPayload {
	email: string;
	role: string;
	archetype: string;
	resilience: number;
	timestamp: number;
}

/** Phase 04: Pressure metadata for immersive effects. Keyed by card ID, referenced at runtime. */
export interface PressureOutcomeMetadata {
	/** Optional team-impact copy shown in feedback overlay (e.g. morale, resignations). */
	teamImpact?: string;
}

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
