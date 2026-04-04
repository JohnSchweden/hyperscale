import { useEffect, useRef } from "react";
import type { PresentationChoiceSlot } from "../lib/feedbackAudioChoice";
import { loadVoice, playVoice, stopVoice } from "../services/voicePlayback";
import {
	type ArchetypeId,
	type DeathType,
	GameStage,
	PersonalityType,
} from "../types";

/**
 * Options for the useVoicePlayback hook.
 */
interface UseVoicePlaybackOptions {
	stage: GameStage;
	personality: PersonalityType | null;
	feedbackCardId?: string | null;
	/** Authoring label slug for card feedback clips (not raw screen slot). */
	feedbackAuthoringStem?: string | null;
	/** Raw presentation slot for non-critical card fallback clips. */
	feedbackSelectedSlot?: PresentationChoiceSlot | null;
	deathType?: DeathType | null;
	archetypeId?: ArchetypeId | null;
}

function voiceKey(personality: PersonalityType): string {
	return personality.toLowerCase().replace(/_/g, "");
}

function stageTrigger(
	stage: GameStage,
	deathType: DeathType | null | undefined,
): string | null {
	switch (stage) {
		case GameStage.ROLE_SELECT:
			return "onboarding";
		case GameStage.DEBRIEF_PAGE_1:
			return deathType ? null : "victory";
		default:
			return null;
	}
}

function runVoiceCue(
	personalityKey: string,
	trigger: string,
	errorLabel: string,
	logLoadDetail: boolean,
): void {
	loadVoice(personalityKey, trigger)
		.then(() => {
			playVoice().catch(() => {
				console.error(`Voice playback failed for ${errorLabel}`);
			});
		})
		.catch((e) => {
			if (logLoadDetail) {
				console.error(
					"Voice loading failed for feedback:",
					(e as Error).message,
				);
			} else {
				console.error(`Voice loading failed for ${errorLabel}`);
			}
		});
}

const FEEDBACK_INSTALL_ON_RIGHT = new Set([
	"se_code_quality_refactor",
	"mkt_psych_profiling",
	"mkt_deepfake_swift",
	"man_attention_track",
	"man_negotiator",
	"cln_sticky_note",
]);

/**
 * Head of Something cards with dedicated per-choice Roaster feedback audio.
 */
const CRITICAL_HOS_CARDS = new Set([
	// Original 8 critical cards
	"hos_managing_up_down",
	"explainability_hos_2",
	"hos_copyright_team_blame",
	"hos_team_burnout_deadline",
	"shadow_ai_hos_2",
	"hos_model_drift_team_blame",
	"hos_explainability_politics",
	"hos_prompt_injection_review_escape",
	// Additional 11 HoS cards (Phase 15-06)
	"hos_prompt_injection_blame",
	"hos_model_drift_budget_conflict",
	"hos_delegation_gone_wrong",
	"hos_promotion_politics",
	"hos_prompt_injection_copilot_team",
	"hos_model_drift_retrain_delay",
	"explainability_hos_1",
	"shadow_ai_hos_1",
	"synthetic_data_hos_1",
	"synthetic_data_hos_2",
	// Phase 17 gap closure - remaining 8 HoS cards
	"hos_explainability_documentation",
	"hos_shadow_ai_retention",
	"hos_copyright_sourcing",
	"hos_copyright_documentation",
	"hos_congressional_hearing_demand",
	"hos_whistleblower_pressure",
	"hos_ai_management_elimination",
	"hos_process_automation_takeover",
]);

function feedbackVoiceTrigger(
	cardId: string,
	authoringStem: string,
	selectedSlot: PresentationChoiceSlot,
): string {
	// Check for critical Head of Something cards first — uses label slug
	if (CRITICAL_HOS_CARDS.has(cardId)) {
		return `feedback_${cardId}_${authoringStem}`;
	}

	// Software Engineer specific cards (arms match original onRight/onLeft semantics)
	if (cardId === "se_security_patch_timeline") {
		return selectedSlot === "RIGHT" ? "feedback_paste" : "feedback_debug";
	}

	// Generic install/ignore feedback for other cards
	if (FEEDBACK_INSTALL_ON_RIGHT.has(cardId)) {
		return selectedSlot === "RIGHT" ? "feedback_install" : "feedback_ignore";
	}

	return "feedback_ignore";
}

/**
 * Maps DeathType to audio file trigger name.
 * Converts: BANKRUPT → death_bankrupt, REPLACED_BY_SCRIPT → death_replaced_by_script
 */
function deathTrigger(deathType: DeathType): string {
	const suffix = deathType.toLowerCase();
	return `death_${suffix}`;
}

/**
 * Maps ArchetypeId to audio file trigger name.
 * Converts: PRAGMATIST → archetype_pragmatist, SHADOW_ARCHITECT → archetype_shadow_architect
 */
function archetypeTrigger(archetypeId: ArchetypeId): string {
	const suffix = archetypeId.toLowerCase();
	return `archetype_${suffix}`;
}

/**
 * Custom hook for managing voice playback during different game stages.
 * @param options - Configuration options for voice playback
 */
export function useVoicePlayback({
	stage,
	personality,
	feedbackCardId,
	feedbackAuthoringStem,
	feedbackSelectedSlot,
	deathType,
	archetypeId,
}: UseVoicePlaybackOptions) {
	// Track if death audio has already played (prevents re-renders from triggering again)
	const hasPlayedDeathAudio = useRef(false);
	// Track if archetype audio has already played (prevents re-renders from triggering again)
	const hasPlayedArchetypeAudio = useRef(false);

	useEffect(() => {
		return () => {
			stopVoice();
		};
	}, []);

	// Reset audio flags when leaving death/debrief pages
	useEffect(() => {
		if (stage !== GameStage.DEBRIEF_PAGE_1) {
			hasPlayedDeathAudio.current = false;
		}
		if (stage !== GameStage.DEBRIEF_PAGE_3) {
			hasPlayedArchetypeAudio.current = false;
		}
	}, [stage]);

	useEffect(() => {
		if (!personality) return;
		const trigger = stageTrigger(stage, deathType);
		if (!trigger) return;
		const key = voiceKey(personality);
		runVoiceCue(key, trigger, trigger, false);
	}, [stage, personality, deathType]);

	useEffect(() => {
		if (
			!feedbackCardId ||
			!feedbackAuthoringStem ||
			!personality ||
			!feedbackSelectedSlot
		)
			return;
		if (personality !== PersonalityType.ROASTER) return;

		const trigger = feedbackVoiceTrigger(
			feedbackCardId,
			feedbackAuthoringStem,
			feedbackSelectedSlot,
		);
		const key = voiceKey(personality);

		console.log(
			`[Feedback] Playing voice: ${trigger} for card: ${feedbackCardId} authoringStem: ${feedbackAuthoringStem}`,
		);

		runVoiceCue(key, trigger, "feedback", true);
	}, [
		feedbackCardId,
		feedbackAuthoringStem,
		feedbackSelectedSlot,
		personality,
	]);

	// Death ending audio - debrief page 1 when death type is set
	useEffect(() => {
		if (!personality || !deathType) return;
		if (stage !== GameStage.DEBRIEF_PAGE_1) return;
		// Only play once per death ending display
		if (hasPlayedDeathAudio.current) return;

		const trigger = deathTrigger(deathType);
		const key = voiceKey(personality);

		console.log(
			`[Death] Playing voice: ${trigger} for death type: ${deathType}`,
		);

		hasPlayedDeathAudio.current = true;
		runVoiceCue(key, trigger, `death ending: ${deathType}`, false);
	}, [stage, personality, deathType]);

	// Archetype reveal audio - plays on debrief page 3 when archetype is available
	useEffect(() => {
		if (!personality || !archetypeId) return;
		if (stage !== GameStage.DEBRIEF_PAGE_3) return;
		// Only play once per archetype reveal
		if (hasPlayedArchetypeAudio.current) return;

		const trigger = archetypeTrigger(archetypeId);
		const key = voiceKey(personality);

		console.log(
			`[Archetype] Playing voice: ${trigger} for archetype: ${archetypeId}`,
		);

		hasPlayedArchetypeAudio.current = true;
		runVoiceCue(key, trigger, `archetype reveal: ${archetypeId}`, false);
	}, [stage, personality, archetypeId]);
}
