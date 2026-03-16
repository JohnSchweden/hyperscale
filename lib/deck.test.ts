import { describe, expect, it } from "vitest";
import type { Card } from "../types";
import { AppSource } from "../types";
import { resolveDeckWithBranching, shuffleDeck } from "./deck";

function createOutcome(
	label: string,
	hype: number,
	heat: number,
	fine: number,
) {
	return {
		label,
		hype,
		heat,
		fine,
		violation: "test_violation",
		feedback: {
			ROASTER: "Feedback",
			ZEN_MASTER: "Feedback",
			LOVEBOMBER: "Feedback",
		},
		lesson: "Test lesson",
	};
}

function createCard(id: string): Card {
	return {
		id,
		source: AppSource.IDE,
		sender: "Test Sender",
		context: "Test Context",
		text: "Test text",
		onRight: createOutcome("Right", 10, 5, 0),
		onLeft: createOutcome("Left", -10, 10, 100),
	};
}

describe("shuffleDeck", () => {
	it("should return an array with the same length as input", () => {
		const cards = [createCard("1"), createCard("2"), createCard("3")];
		const shuffled = shuffleDeck(cards);
		expect(shuffled).toHaveLength(cards.length);
	});

	it("should contain all original elements", () => {
		const cards = [createCard("a"), createCard("b"), createCard("c")];
		const shuffled = shuffleDeck(cards);
		expect(shuffled.map((c) => c.id).sort()).toEqual(
			cards.map((c) => c.id).sort(),
		);
	});

	it("should not mutate the input array", () => {
		const cards = [createCard("1"), createCard("2"), createCard("3")];
		const cardsBefore = cards.map((c) => c.id);
		shuffleDeck(cards);
		const cardsAfter = cards.map((c) => c.id);
		expect(cardsAfter).toEqual(cardsBefore);
	});

	it("should produce different order on repeated calls (probabilistic test)", () => {
		const cards = [
			createCard("1"),
			createCard("2"),
			createCard("3"),
			createCard("4"),
		];
		const results: string[][] = [];

		// Run shuffle multiple times
		for (let i = 0; i < 20; i++) {
			const shuffled = shuffleDeck(cards);
			results.push(shuffled.map((c) => c.id));
		}

		// Check if at least one permutation differs from the original
		const originalOrder = cards.map((c) => c.id).join(",");
		const hasVariation = results.some((r) => r.join(",") !== originalOrder);
		expect(hasVariation).toBe(true);
	});

	it("should handle empty array", () => {
		const cards: Card[] = [];
		const shuffled = shuffleDeck(cards);
		expect(shuffled).toEqual([]);
	});

	it("should handle single element", () => {
		const cards = [createCard("1")];
		const shuffled = shuffleDeck(cards);
		expect(shuffled).toEqual(cards);
	});
});

describe("resolveDeckWithBranching", () => {
	it("should return unchanged deck when history is empty", () => {
		const deck = [createCard("1"), createCard("2"), createCard("3")];
		const result = resolveDeckWithBranching(deck, [], 0, {});
		expect(result.map((c) => c.id)).toEqual(["1", "2", "3"]);
	});

	it("should inject branch cards when matching history entry exists", () => {
		const deck = [createCard("1"), createCard("2"), createCard("3")];
		const branchCard = createCard("branch_1");
		const branchInjections = {
			"1:RIGHT": [branchCard],
		};

		const history = [{ cardId: "1", choice: "RIGHT" as const }];
		const result = resolveDeckWithBranching(deck, history, 0, branchInjections);

		// Branch card should be inserted at position 1 (after currentCardIndex)
		expect(result.map((c) => c.id)).toEqual(["1", "branch_1", "2", "3"]);
	});

	it("should inject multiple branch cards in order", () => {
		const deck = [createCard("1"), createCard("2")];
		const branchCards = [createCard("branch_a"), createCard("branch_b")];
		const branchInjections = {
			"1:LEFT": branchCards,
		};

		const history = [{ cardId: "1", choice: "LEFT" as const }];
		const result = resolveDeckWithBranching(deck, history, 0, branchInjections);

		expect(result.map((c) => c.id)).toEqual(["1", "branch_a", "branch_b", "2"]);
	});

	it("should not inject if branch key does not match", () => {
		const deck = [createCard("1"), createCard("2"), createCard("3")];
		const branchInjections = {
			"1:RIGHT": [createCard("branch_1")],
		};

		const history = [{ cardId: "1", choice: "LEFT" as const }];
		const result = resolveDeckWithBranching(deck, history, 0, branchInjections);

		// No injection because history has LEFT but injection is for RIGHT
		expect(result.map((c) => c.id)).toEqual(["1", "2", "3"]);
	});

	it("should only use the last history entry", () => {
		const deck = [
			createCard("1"),
			createCard("2"),
			createCard("3"),
			createCard("4"),
		];
		const branchInjections = {
			"2:RIGHT": [createCard("branch_2")],
			"3:LEFT": [createCard("branch_3")],
		};

		// History has two entries, only the last matters
		const history = [
			{ cardId: "2", choice: "RIGHT" as const },
			{ cardId: "3", choice: "LEFT" as const },
		];
		const result = resolveDeckWithBranching(deck, history, 2, branchInjections);

		// Should inject branch_3 at position 3 (currentCardIndex + 1)
		expect(result.map((c) => c.id)).toEqual(["1", "2", "3", "branch_3", "4"]);
	});

	it("should handle insertion at different positions in deck", () => {
		const deck = [createCard("1"), createCard("2"), createCard("3")];
		const branchCard = createCard("branch_mid");
		const branchInjections = {
			"2:RIGHT": [branchCard],
		};

		// Current card is at index 1
		const history = [{ cardId: "2", choice: "RIGHT" as const }];
		const result = resolveDeckWithBranching(deck, history, 1, branchInjections);

		// Branch should be inserted at position 2 (currentCardIndex 1 + 1)
		expect(result.map((c) => c.id)).toEqual(["1", "2", "branch_mid", "3"]);
	});

	it("should not mutate input deck", () => {
		const deck = [createCard("1"), createCard("2")];
		const originalIds = deck.map((c) => c.id);
		const branchInjections = {
			"1:RIGHT": [createCard("branch_1")],
		};

		const history = [{ cardId: "1", choice: "RIGHT" as const }];
		resolveDeckWithBranching(deck, history, 0, branchInjections);

		expect(deck.map((c) => c.id)).toEqual(originalIds);
	});

	it("should handle empty branch card list", () => {
		const deck = [createCard("1"), createCard("2")];
		const branchInjections = {
			"1:RIGHT": [],
		};

		const history = [{ cardId: "1", choice: "RIGHT" as const }];
		const result = resolveDeckWithBranching(deck, history, 0, branchInjections);

		expect(result.map((c) => c.id)).toEqual(["1", "2"]);
	});
});
