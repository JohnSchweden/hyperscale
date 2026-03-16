export enum PersonalityType {
	ROASTER = "ROASTER",
	ZEN_MASTER = "ZEN_MASTER",
	LOVEBOMBER = "LOVEBOMBER",
}

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

export interface Card {
	id: string;
	source: AppSource;
	sender: string;
	context: string;
	/** Optional scene-setting line to immerse the user before the main ask */
	storyContext?: string;
	text: string;
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
}

export enum DeathType {
	BANKRUPT = "BANKRUPT",
	REPLACED_BY_SCRIPT = "REPLACED_BY_SCRIPT",
	CONGRESS = "CONGRESS",
	FLED_COUNTRY = "FLED_COUNTRY",
	PRISON = "PRISON",
	AUDIT_FAILURE = "AUDIT_FAILURE",
}

/** Phase 06: Archetype types for debrief system */
export type ArchetypeId =
	| "PRAGMATIST"
	| "SHADOW_ARCHITECT"
	| "DISRUPTOR"
	| "CONSERVATIVE"
	| "BALANCED"
	| "CHAOS_AGENT";

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
