import { describe, expect, it } from "vitest";
import { DEATH_ENDINGS } from "../data/deathEndings";
import { KIRK_CORRUPTED_CARDS } from "../data/kirkCards";
import { gameReducer, initialGameState } from "../hooks/useGameState";
import {
	AppSource,
	type Card,
	DeathType,
	GameStage,
	type GameState,
	PersonalityType,
	RoleType,
} from "../types";

// Helper to build a playing state with a role and deck
function playingState(overrides: Partial<GameState> = {}): GameState {
	return {
		...initialGameState,
		stage: GameStage.PLAYING,
		role: RoleType.SOFTWARE_ENGINEER,
		personality: PersonalityType.ROASTER,
		budget: 10_000_000,
		heat: 0,
		hype: 50,
		...overrides,
	};
}

describe("KIRK_REFUSAL action", () => {
	it("increments kirkCounter from 0 to 1 on first refusal", () => {
		const state = playingState();
		const next = gameReducer(state, { type: "KIRK_REFUSAL" });
		expect(next.kirkCounter).toBe(1);
		expect(next.kirkCorruptionActive).toBe(false);
	});

	it("at kirkCounter=1, sets kirkCorruptionActive=true and injects KIRK_CORRUPTED_CARDS into effectiveDeck", () => {
		const mockDeck: Card[] = [
			{
				id: "card-0",
				source: AppSource.EMAIL,
				sender: "Boss",
				context: "ctx",
				text: "Do something?",
				onRight: {
					label: "Yes",
					hype: 5,
					heat: 5,
					fine: 0,
					violation: "none",
					feedback: {
						[PersonalityType.ROASTER]: "r",
						[PersonalityType.ZEN_MASTER]: "z",
						[PersonalityType.LOVEBOMBER]: "l",
					},
					lesson: "lesson",
				},
				onLeft: {
					label: "No",
					hype: 0,
					heat: 0,
					fine: 0,
					violation: "none",
					feedback: {
						[PersonalityType.ROASTER]: "r",
						[PersonalityType.ZEN_MASTER]: "z",
						[PersonalityType.LOVEBOMBER]: "l",
					},
					lesson: "lesson",
				},
			},
			{
				id: "card-1",
				source: AppSource.SLACK,
				sender: "PM",
				context: "ctx",
				text: "Ship it?",
				onRight: {
					label: "Yes",
					hype: 10,
					heat: 10,
					fine: 0,
					violation: "none",
					feedback: {
						[PersonalityType.ROASTER]: "r",
						[PersonalityType.ZEN_MASTER]: "z",
						[PersonalityType.LOVEBOMBER]: "l",
					},
					lesson: "lesson",
				},
				onLeft: {
					label: "No",
					hype: 0,
					heat: 0,
					fine: 0,
					violation: "none",
					feedback: {
						[PersonalityType.ROASTER]: "r",
						[PersonalityType.ZEN_MASTER]: "z",
						[PersonalityType.LOVEBOMBER]: "l",
					},
					lesson: "lesson",
				},
			},
		];

		const state = playingState({
			kirkCounter: 1,
			effectiveDeck: mockDeck,
			currentCardIndex: 0,
		});

		const next = gameReducer(state, { type: "KIRK_REFUSAL" });
		expect(next.kirkCounter).toBe(2);
		expect(next.kirkCorruptionActive).toBe(true);
		expect(next.effectiveDeck).not.toBeNull();
		// KIRK_CORRUPTED_CARDS should be injected after currentCardIndex (0)
		// so position 1, 2, 3 should be the kirk cards
		expect(next.effectiveDeck?.[1].id).toBe("kirk-raise");
		expect(next.effectiveDeck?.[2].id).toBe("kirk-ceo");
		expect(next.effectiveDeck?.[3].id).toBe("kirk-nobel");
		// Original second card pushed to index 4
		expect(next.effectiveDeck?.[4].id).toBe("card-1");
	});

	it("does not increment further when kirkCounter >= 2", () => {
		const state = playingState({ kirkCounter: 2, kirkCorruptionActive: true });
		const next = gameReducer(state, { type: "KIRK_REFUSAL" });
		expect(next.kirkCounter).toBe(2);
	});

	it("after all corrupted cards swiped, NEXT_INCIDENT triggers DeathType.KIRK game over", () => {
		// Set up: corruption active, deck is only the 3 kirk cards, at the last card
		const kirkDeck = [...KIRK_CORRUPTED_CARDS];
		const state = playingState({
			kirkCounter: 2,
			kirkCorruptionActive: true,
			effectiveDeck: kirkDeck,
			currentCardIndex: kirkDeck.length - 1, // at last card
			budget: 10_000_000,
			heat: 0,
		});
		// First make a choice on the last card
		const afterChoice = gameReducer(state, {
			type: "CHOICE_MADE",
			direction: "RIGHT",
			outcome: { hype: 0, heat: 0, fine: 0, cardId: "kirk-nobel" },
		});
		// Then advance
		const next = gameReducer(afterChoice, { type: "NEXT_INCIDENT" });
		expect(next.stage).toBe(GameStage.DEBRIEF_PAGE_1);
		expect(next.deathType).toBe(DeathType.KIRK);
	});

	it("kirk death triggers even when more cards remain in deck after kirk-nobel", () => {
		// Regression test: kirk cards injected mid-deck should still trigger death
		// after kirk-nobel, even if original deck had more cards
		const mockDeck: Card[] = [
			{
				id: "card-0",
				source: AppSource.EMAIL,
				sender: "Boss",
				context: "ctx",
				text: "First card?",
				onRight: {
					label: "Yes",
					hype: 5,
					heat: 5,
					fine: 0,
					violation: "none",
					feedback: {
						[PersonalityType.ROASTER]: "r",
						[PersonalityType.ZEN_MASTER]: "z",
						[PersonalityType.LOVEBOMBER]: "l",
					},
					lesson: "lesson",
				},
				onLeft: {
					label: "No",
					hype: 0,
					heat: 0,
					fine: 0,
					violation: "none",
					feedback: {
						[PersonalityType.ROASTER]: "r",
						[PersonalityType.ZEN_MASTER]: "z",
						[PersonalityType.LOVEBOMBER]: "l",
					},
					lesson: "lesson",
				},
			},
			...KIRK_CORRUPTED_CARDS, // kirk cards injected at positions 1, 2, 3
			{
				id: "card-after-kirk",
				source: AppSource.EMAIL,
				sender: "PM",
				context: "ctx",
				text: "This should never be seen?",
				onRight: {
					label: "Yes",
					hype: 10,
					heat: 10,
					fine: 0,
					violation: "none",
					feedback: {
						[PersonalityType.ROASTER]: "r",
						[PersonalityType.ZEN_MASTER]: "z",
						[PersonalityType.LOVEBOMBER]: "l",
					},
					lesson: "lesson",
				},
				onLeft: {
					label: "No",
					hype: 0,
					heat: 0,
					fine: 0,
					violation: "none",
					feedback: {
						[PersonalityType.ROASTER]: "r",
						[PersonalityType.ZEN_MASTER]: "z",
						[PersonalityType.LOVEBOMBER]: "l",
					},
					lesson: "lesson",
				},
			},
		];

		const state = playingState({
			kirkCounter: 2,
			kirkCorruptionActive: true,
			effectiveDeck: mockDeck,
			currentCardIndex: 3, // at kirk-nobel (last kirk card)
			history: [
				{ cardId: "card-0", choice: "RIGHT" },
				{ cardId: "kirk-raise", choice: "RIGHT" },
				{ cardId: "kirk-ceo", choice: "RIGHT" },
			],
			budget: 10_000_000,
			heat: 0,
		});

		// Make choice on kirk-nobel
		const afterChoice = gameReducer(state, {
			type: "CHOICE_MADE",
			direction: "RIGHT",
			outcome: { hype: 0, heat: 0, fine: 0, cardId: "kirk-nobel" },
		});

		// Advance - should trigger Kirk death even though card-after-kirk exists
		const next = gameReducer(afterChoice, { type: "NEXT_INCIDENT" });
		expect(next.stage).toBe(GameStage.DEBRIEF_PAGE_1);
		expect(next.deathType).toBe(DeathType.KIRK);
	});
});

describe("RESET action with kirk state", () => {
	it("resets kirkCounter to 0 and kirkCorruptionActive to false", () => {
		const state = playingState({ kirkCounter: 2, kirkCorruptionActive: true });
		const next = gameReducer(state, { type: "RESET" });
		expect(next.kirkCounter).toBe(0);
		expect(next.kirkCorruptionActive).toBe(false);
	});
});

describe("DeathType.KIRK in DEATH_ENDINGS", () => {
	it("has a valid headline and subtext entry", () => {
		expect(DEATH_ENDINGS[DeathType.KIRK]).toBeDefined();
		expect(DEATH_ENDINGS[DeathType.KIRK].title).toBeTruthy();
		expect(DEATH_ENDINGS[DeathType.KIRK].description).toBeTruthy();
	});
});

describe("KIRK_CORRUPTED_CARDS", () => {
	it("has exactly 3 cards", () => {
		expect(KIRK_CORRUPTED_CARDS).toHaveLength(3);
	});

	it("each card has valid Card shape with all personality feedback keys", () => {
		for (const card of KIRK_CORRUPTED_CARDS) {
			expect(card.id).toBeTruthy();
			expect(card.source).toBeTruthy();
			expect(card.sender).toBeTruthy();
			expect(card.context).toBeTruthy();
			expect(card.text).toBeTruthy();
			// onRight feedback
			expect(card.onRight.feedback[PersonalityType.ROASTER]).toBeTruthy();
			expect(card.onRight.feedback[PersonalityType.ZEN_MASTER]).toBeTruthy();
			expect(card.onRight.feedback[PersonalityType.LOVEBOMBER]).toBeTruthy();
			// onLeft feedback
			expect(card.onLeft.feedback[PersonalityType.ROASTER]).toBeTruthy();
			expect(card.onLeft.feedback[PersonalityType.ZEN_MASTER]).toBeTruthy();
			expect(card.onLeft.feedback[PersonalityType.LOVEBOMBER]).toBeTruthy();
		}
	});

	it("cards have 'kirk-' id prefix", () => {
		for (const card of KIRK_CORRUPTED_CARDS) {
			expect(card.id).toMatch(/^kirk-/);
		}
	});
});

describe("Kirk ending NOT added to unlockedEndings", () => {
	it("DeathType.KIRK game over does not add to unlockedEndings", () => {
		// Simulate state where kirk death gets triggered
		const kirkDeck = [...KIRK_CORRUPTED_CARDS];
		const state = playingState({
			kirkCounter: 2,
			kirkCorruptionActive: true,
			effectiveDeck: kirkDeck,
			currentCardIndex: kirkDeck.length - 1,
			unlockedEndings: [DeathType.BANKRUPT], // pre-existing
		});
		const afterChoice = gameReducer(state, {
			type: "CHOICE_MADE",
			direction: "RIGHT",
			outcome: { hype: 0, heat: 0, fine: 0, cardId: "kirk-nobel" },
		});
		const next = gameReducer(afterChoice, { type: "NEXT_INCIDENT" });
		expect(next.deathType).toBe(DeathType.KIRK);
		// Kirk should NOT be in unlockedEndings
		expect(next.unlockedEndings).not.toContain(DeathType.KIRK);
		// Pre-existing endings should still be there
		expect(next.unlockedEndings).toContain(DeathType.BANKRUPT);
	});
});
