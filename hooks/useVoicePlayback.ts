import { useEffect } from 'react';
import { GameStage, PersonalityType, RoleType } from '../types';
import { loadVoice, playVoice, stopVoice } from '../services/voicePlayback';

interface UseVoicePlaybackOptions {
  stage: GameStage;
  personality: PersonalityType | null;
  role: RoleType | null;
  feedbackCardId?: string | null;
  feedbackChoice?: 'LEFT' | 'RIGHT' | null;
}

export function useVoicePlayback({ stage, personality, role, feedbackCardId, feedbackChoice }: UseVoicePlaybackOptions) {
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVoice();
    };
  }, []);

  // Voice logic for stage transitions - only for Development role
  useEffect(() => {
    if (!personality || role !== RoleType.DEVELOPMENT) return;

    const personalityLower = personality.toLowerCase().replace(/_/g, '');
    let trigger: string | null = null;

    if (stage === GameStage.ROLE_SELECT) {
      trigger = 'onboarding';
    } else if (stage === GameStage.GAME_OVER) {
      trigger = 'failure';
    } else if (stage === GameStage.SUMMARY) {
      trigger = 'victory';
    }

    if (trigger) {
      loadVoice(personalityLower, trigger).then(() => {
        playVoice().catch(() => {
          console.error(`Voice playback failed for ${trigger}`);
        });
      }).catch(() => {
        console.error(`Voice loading failed for ${trigger}`);
      });
    }
  }, [stage, personality, role]);

  // Voice logic for feedback overlay - only for Development role and Roaster personality
  // (only roaster has feedback audio files)
  useEffect(() => {
    if (!feedbackCardId || !feedbackChoice || !personality || role !== RoleType.DEVELOPMENT) return;
    if (personality !== PersonalityType.ROASTER) return;

    const personalityLower = personality.toLowerCase().replace(/_/g, '');
    let trigger = 'feedback_ignore';

    // Map based on card ID and choice to determine correct feedback voice
    // Development role cards
    if (feedbackCardId === 'dev_1') {
      trigger = feedbackChoice === 'RIGHT' ? 'feedback_paste' : 'feedback_debug';
    } else if (feedbackCardId === 'dev_icarus_unverified') {
      trigger = feedbackChoice === 'RIGHT' ? 'feedback_install' : 'feedback_ignore';
    }
    // Marketing role cards
    else if (feedbackCardId === 'mkt_psych_profiling' || feedbackCardId === 'mkt_deepfake_swift') {
      trigger = feedbackChoice === 'RIGHT' ? 'feedback_install' : 'feedback_ignore';
    }
    // Management role cards
    else if (feedbackCardId === 'man_attention_track' || feedbackCardId === 'man_negotiator') {
      trigger = feedbackChoice === 'RIGHT' ? 'feedback_install' : 'feedback_ignore';
    }
    // HR role cards
    else if (feedbackCardId === 'hr_union_predict' || feedbackCardId === 'hr_lacrosse_bias') {
      trigger = 'feedback_ignore';
    }
    // Finance role cards
    else if (feedbackCardId === 'fin_insider_bot' || feedbackCardId === 'fin_fraud_hallucination') {
      trigger = 'feedback_ignore';
    }
    // Cleaning role
    else if (feedbackCardId === 'cln_sticky_note') {
      trigger = feedbackChoice === 'RIGHT' ? 'feedback_install' : 'feedback_ignore';
    }

    console.log('[Feedback] Playing voice:', trigger, 'for card:', feedbackCardId, 'choice:', feedbackChoice);

    loadVoice(personalityLower, trigger).then(() => {
      playVoice().catch(() => {
        console.error("Voice playback failed for feedback");
      });
    }).catch((e) => {
      console.error("Voice loading failed for feedback:", (e as Error).message);
    });
  }, [feedbackCardId, feedbackChoice, personality, role]);
}
