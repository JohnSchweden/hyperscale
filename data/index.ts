export {
	ARCHETYPES,
	calculateArchetype,
	calculateResilienceScore,
	mapOutcomeToTraits,
} from "./archetypes";
export {
	BGM_SOURCE_STEMS,
	BGM_TRACKS,
	type BgmTrack,
	bgmDisplayTitleFromStem,
	getBgmUrl,
} from "./bgmPlaylist";
export { BOSS_FIGHT_QUESTIONS } from "./bossQuestions";
export {
	BRANCH_INJECTIONS,
	CLEANING_CARDS,
	DEVELOPMENT_CARDS,
	FINANCE_CARDS,
	HR_CARDS,
	MANAGEMENT_CARDS,
	MARKETING_CARDS,
	ROLE_CARDS,
} from "./cards";
export { DEATH_ENDINGS } from "./deathEndings";
export {
	ARCHETYPE_DEATH_AFFINITY,
	accumulateDeathVectors,
	determineDeathTypeFromVectors,
} from "./deathVectors";
export { DECK_DEATH_TYPES } from "./deckDeathTypes";
export {
	FAILURE_LESSONS,
	type FailureLesson,
	generateDeathExplanation,
	getRetryPrompt,
} from "./failureLessons";
export { PERSONALITIES } from "./personalities";
export { PRESSURE_SCENARIOS } from "./pressureScenarios";
export {
	getRoleDeck,
	ROLE_DECK_ALIASES,
	ROLE_DESCRIPTIONS,
	ROLE_ICONS,
	ROLE_LABELS,
} from "./roles";
export { VOICE_COVERAGE_HINT } from "./voiceUiCopy";
