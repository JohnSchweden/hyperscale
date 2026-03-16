import type { DeathType } from "../types";

export interface UnlockProgress {
	unlockedCount: number;
	totalCount: number;
	progressText: string;
}

/**
 * Calculate unlock progress and generate personality-agnostic encouragement text
 */
export function getUnlockProgress(
	unlockedEndings: DeathType[],
): UnlockProgress {
	const unlockedCount = unlockedEndings.length;
	const totalCount = 6;

	let progressText: string;

	if (unlockedCount === 0) {
		// First playthrough - they've just unlocked their first
		progressText =
			"You've unlocked your first ending (1/6). Try again to discover more outcomes.";
	} else if (unlockedCount === 1) {
		progressText =
			"You've unlocked 1/6 endings. Try again to see what else happens.";
	} else if (unlockedCount >= 2 && unlockedCount <= 4) {
		progressText = `You've unlocked ${unlockedCount}/6 endings. Try again to see what else happens.`;
	} else if (unlockedCount === 5) {
		progressText = "You've unlocked 5/6 endings. Just one more to discover!";
	} else {
		// All 6 unlocked
		progressText =
			"You've unlocked all 6/6 endings! You've experienced the full Kobayashi Maru.";
	}

	return {
		unlockedCount,
		totalCount,
		progressText,
	};
}

/**
 * Hook to calculate unlock progress from GameState
 * Can be extended to include personality-specific text variations
 */
export function useUnlockedEndings(
	unlockedEndings: DeathType[],
): UnlockProgress {
	return getUnlockProgress(unlockedEndings);
}
