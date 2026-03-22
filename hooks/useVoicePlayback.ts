import { useEffect } from "react";
import { loadVoice, playVoice, stopVoice } from "../services/voicePlayback";
import { GameStage, PersonalityType } from "../types";

interface UseVoicePlaybackOptions {
	stage: GameStage;
	personality: PersonalityType | null;
	feedbackCardId?: string | null;
	feedbackChoice?: "LEFT" | "RIGHT" | null;
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

export function useVoicePlayback({
	stage,
	personality,
	feedbackCardId,
	feedbackChoice,
}: UseVoicePlaybackOptions) {
	useEffect(() => {
		return () => {
			stopVoice();
		};
	}, []);

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
}
