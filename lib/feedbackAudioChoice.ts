import type { Card } from "../types";
import { slugify } from "./slugify";

export { slugify };

/** Which visible choice slot the player selected (matches game history `choice`). */
export type PresentationChoiceSlot = "LEFT" | "RIGHT";

/**
 * Authoring slug for pre-baked feedback audio (`feedback_<cardId>_<slug>`).
 * Maps the presentation slot the player chose to the authoring branch label slug
 * (source onLeft vs onRight), accounting for per-shuffle side swaps.
 */
export function authoringFeedbackStem(
	card: Pick<Card, "choiceSidesSwapped" | "onLeft" | "onRight">,
	selectedPresentationSlot: PresentationChoiceSlot,
): string {
	// When choiceSidesSwapped: card.onLeft=original onRight, card.onRight=original onLeft
	// Player viewing LEFT sees card.onLeft; player swiping LEFT is choosing card.onLeft
	// Audio must match what's displayed (card.onLeft.label), not the swapped authoring branch
	if (card.choiceSidesSwapped === true) {
		return selectedPresentationSlot === "LEFT"
			? slugify(card.onRight.label)
			: slugify(card.onLeft.label);
	}
	return selectedPresentationSlot === "LEFT"
		? slugify(card.onLeft.label)
		: slugify(card.onRight.label);
}
