import { describe, expect, it } from "vitest";
import { resolveDeckWithBranching } from "../src/lib/deck";
import { AppSource, type Card, PersonalityType } from "../src/types";

function createTestCard(id: string): Card {
	return {
		id,
		source: AppSource.SLACK,
		context: "Test Context",
		sender: "Test Sender",
		text: "Test text",
		onLeft: {
			label: "Left",
			hype: 0,
			heat: 0,
			fine: 0,
			violation: "",
			lesson: "",
			feedback: {
				[PersonalityType.ROASTER]: "roaster",
				[PersonalityType.ZEN_MASTER]: "zen",
				[PersonalityType.LOVEBOMBER]: "love",
			},
		},
		onRight: {
			label: "Right",
			hype: 0,
			heat: 0,
			fine: 0,
			violation: "",
			lesson: "",
			feedback: {
				[PersonalityType.ROASTER]: "roaster",
				[PersonalityType.ZEN_MASTER]: "zen",
				[PersonalityType.LOVEBOMBER]: "love",
			},
		},
	};
}

describe("resolveDeckWithBranching", () => {
	it("should return original deck when history is empty", () => {
		const deck = [createTestCard("card1"), createTestCard("card2")];
		const result = resolveDeckWithBranching(deck, [], 0, {});

		expect(result).toEqual(deck);
		expect(result).toBe(deck);
	});

	it("should return original deck when no branch matches", () => {
		const deck = [createTestCard("card1"), createTestCard("card2")];
		const history = [{ cardId: "card1", choice: "LEFT" as const }];
		const branches = {
			"card2:RIGHT": [createTestCard("branch1")],
		};

		const result = resolveDeckWithBranching(deck, history, 0, branches);

		expect(result).toEqual(deck);
	});

	it("should inject branch cards at the correct position", () => {
		const deck = [
			createTestCard("card1"),
			createTestCard("card2"),
			createTestCard("card3"),
		];
		const history = [{ cardId: "card1", choice: "LEFT" as const }];
		const branchCard = createTestCard("branch-card");
		const branches = {
			"card1:LEFT": [branchCard],
		};

		const result = resolveDeckWithBranching(deck, history, 0, branches);

		expect(result).toHaveLength(4);
		expect(result[0].id).toBe("card1");
		expect(result[1].id).toBe("branch-card");
		expect(result[2].id).toBe("card2");
		expect(result[3].id).toBe("card3");
	});

	it("should inject multiple branch cards", () => {
		const deck = [createTestCard("card1"), createTestCard("card2")];
		const history = [{ cardId: "card1", choice: "LEFT" as const }];
		const branches = {
			"card1:LEFT": [createTestCard("branch1"), createTestCard("branch2")],
		};

		const result = resolveDeckWithBranching(deck, history, 0, branches);

		expect(result).toHaveLength(4);
		expect(result[0].id).toBe("card1");
		expect(result[1].id).toBe("branch1");
		expect(result[2].id).toBe("branch2");
		expect(result[3].id).toBe("card2");
	});

	it("should inject at currentCardIndex + 1", () => {
		const deck = [
			createTestCard("card1"),
			createTestCard("card2"),
			createTestCard("card3"),
		];
		const history = [{ cardId: "card1", choice: "LEFT" as const }];
		const branches = {
			"card1:LEFT": [createTestCard("branch")],
		};

		const result = resolveDeckWithBranching(deck, history, 1, branches);

		expect(result).toHaveLength(4);
		expect(result[0].id).toBe("card1");
		expect(result[1].id).toBe("card2");
		expect(result[2].id).toBe("branch");
		expect(result[3].id).toBe("card3");
	});

	it("should use the last history entry for branch key", () => {
		const deck = [createTestCard("card1"), createTestCard("card2")];
		const history = [
			{ cardId: "card1", choice: "LEFT" as const },
			{ cardId: "card2", choice: "RIGHT" as const },
		];
		const branches = {
			"card1:LEFT": [createTestCard("wrong-branch")],
			"card2:RIGHT": [createTestCard("correct-branch")],
		};

		const result = resolveDeckWithBranching(deck, history, 0, branches);

		expect(result).toHaveLength(3);
		expect(result[1].id).toBe("correct-branch");
	});

	it("should handle RIGHT choice", () => {
		const deck = [createTestCard("card1"), createTestCard("card2")];
		const history = [{ cardId: "card1", choice: "RIGHT" as const }];
		const branches = {
			"card1:RIGHT": [createTestCard("branch")],
		};

		const result = resolveDeckWithBranching(deck, history, 0, branches);

		expect(result).toHaveLength(3);
		expect(result[1].id).toBe("branch");
	});

	it("should not mutate the original deck", () => {
		const deck = [createTestCard("card1"), createTestCard("card2")];
		const originalLength = deck.length;
		const history = [{ cardId: "card1", choice: "LEFT" as const }];
		const branches = {
			"card1:LEFT": [createTestCard("branch")],
		};

		resolveDeckWithBranching(deck, history, 0, branches);

		expect(deck).toHaveLength(originalLength);
	});

	it("should return original deck when branch injection array is empty", () => {
		const deck = [createTestCard("card1")];
		const history = [{ cardId: "card1", choice: "LEFT" as const }];
		const branches = {
			"card1:LEFT": [],
		};

		const result = resolveDeckWithBranching(deck, history, 0, branches);

		expect(result).toEqual(deck);
	});

	it("should handle branch injection at end of deck", () => {
		const deck = [createTestCard("card1"), createTestCard("card2")];
		const history = [{ cardId: "card2", choice: "LEFT" as const }];
		const branches = {
			"card2:LEFT": [createTestCard("branch")],
		};

		const result = resolveDeckWithBranching(deck, history, 1, branches);

		expect(result).toHaveLength(3);
		expect(result[2].id).toBe("branch");
	});
});
