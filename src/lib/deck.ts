import type { Card } from "../types";

/**
 * Fisher-Yates shuffle algorithm
 * Returns a new shuffled array without mutating the input
 * @param cards - Array of cards to shuffle
 * @returns A new shuffled copy of the input array
 */
export function shuffleDeck(cards: Card[]): Card[] {
	const shuffled = [...cards];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	// After Fisher-Yates shuffle, randomly swap left/right choices per card
	// This ensures no directional bias in the no-win simulation
	for (let i = 0; i < shuffled.length; i++) {
		const card = shuffled[i];
		if (Math.random() < 0.5) {
			shuffled[i] = {
				...card,
				onLeft: card.onRight,
				onRight: card.onLeft,
				choiceSidesSwapped: true,
			};
		} else {
			shuffled[i] = { ...card, choiceSidesSwapped: false };
		}
	}

	return shuffled;
}

/**
 * Resolve deck with branching logic
 * Injects branch cards at appropriate positions based on player history
 * @param effectiveDeck - Current deck
 * @param history - Game history of choices
 * @param currentCardIndex - Current position in deck
 * @param branchInjections - Map of branches to inject
 * @returns New deck with branch cards injected
 */
export function resolveDeckWithBranching(
	effectiveDeck: Card[],
	history: { cardId: string; choice: "LEFT" | "RIGHT" }[],
	currentCardIndex: number,
	branchInjections: Record<string, Card[]>,
): Card[] {
	if (history.length === 0) {
		return effectiveDeck;
	}

	const lastEntry = history[history.length - 1];
	const branchKey = `${lastEntry.cardId}:${lastEntry.choice}`;
	const branchCards = branchInjections[branchKey];

	if (!branchCards || branchCards.length === 0) {
		return effectiveDeck;
	}

	// Splice branch cards at currentCardIndex + 1
	const result = [...effectiveDeck];
	result.splice(currentCardIndex + 1, 0, ...branchCards);
	return result;
}
