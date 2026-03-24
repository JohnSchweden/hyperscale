import { useEffect, useRef } from "react";
import { loadVoice, playVoice, stopVoice } from "../services/voicePlayback";
import { type DeathType, GameStage, PersonalityType } from "../types";

interface UseVoicePlaybackOptions {
	stage: GameStage;
	personality: PersonalityType | null;
	feedbackCardId?: string | null;
	feedbackChoice?: "LEFT" | "RIGHT" | null;
	deathType?: DeathType | null;
}

function voiceKey(personality: PersonalityType): string {
	return personality.toLowerCase().replace(/_/g, "");
}

function stageTrigger(stage: GameStage): string | null {
	switch (stage) {
		case GameStage.ROLE_SELECT:
			return "onboarding";
		case GameStage.GAME_OVER:
			return "failure";
		case GameStage.SUMMARY:
			return "victory";
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

function feedbackVoiceTrigger(
	cardId: string,
	choice: "LEFT" | "RIGHT",
): string {
	if (cardId === "se_security_patch_timeline") {
		return choice === "RIGHT" ? "feedback_paste" : "feedback_debug";
	}
	if (FEEDBACK_INSTALL_ON_RIGHT.has(cardId)) {
		return choice === "RIGHT" ? "feedback_install" : "feedback_ignore";
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

export function useVoicePlayback({
	stage,
	personality,
	feedbackCardId,
	feedbackChoice,
	deathType,
}: UseVoicePlaybackOptions) {
	// Track if death audio has already played (prevents re-renders from triggering again)
	const hasPlayedDeathAudio = useRef(false);

	useEffect(() => {
		return () => {
			stopVoice();
		};
	}, []);

	// Reset death audio flag when leaving debrief page
	useEffect(() => {
		if (stage !== GameStage.DEBRIEF_PAGE_1) {
			hasPlayedDeathAudio.current = false;
		}
	}, [stage]);

	useEffect(() => {
		if (!personality) return;
		const trigger = stageTrigger(stage);
		if (!trigger) return;
		const key = voiceKey(personality);
		runVoiceCue(key, trigger, trigger, false);
	}, [stage, personality]);

	useEffect(() => {
		if (!feedbackCardId || !feedbackChoice || !personality) return;
		if (personality !== PersonalityType.ROASTER) return;

		const trigger = feedbackVoiceTrigger(feedbackCardId, feedbackChoice);
		const key = voiceKey(personality);

		console.log(
			`[Feedback] Playing voice: ${trigger} for card: ${feedbackCardId} choice: ${feedbackChoice}`,
		);

		runVoiceCue(key, trigger, "feedback", true);
	}, [feedbackCardId, feedbackChoice, personality]);

	// Death ending audio - plays on debrief page 1 when death type is available
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
}
