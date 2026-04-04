import { describe, expect, it } from "vitest";
import {
	authoringFeedbackStem,
	type PresentationChoiceSlot,
	slugify,
} from "../src/lib/feedbackAudioChoice";
import type { Card } from "../src/types";

/** Minimal card shape for stem mapping with labels */
function card(
	swapped: boolean | undefined,
	leftLabel = "Left Option",
	rightLabel = "Right Option",
): Pick<Card, "choiceSidesSwapped" | "onLeft" | "onRight"> {
	return {
		...(swapped !== undefined ? { choiceSidesSwapped: swapped } : {}),
		onLeft: { label: leftLabel } as Card["onLeft"],
		onRight: { label: rightLabel } as Card["onRight"],
	};
}

describe("slugify", () => {
	it("takes 'Take the blame' → 'take-the-blame'", () => {
		expect(slugify("Take the blame")).toBe("take-the-blame");
	});

	it("takes 'Promise the impossible' → 'promise-the-impossible'", () => {
		expect(slugify("Promise the impossible")).toBe("promise-the-impossible");
	});

	it("takes 'Side with auditors' → 'side-with-auditors'", () => {
		expect(slugify("Side with auditors")).toBe("side-with-auditors");
	});
});

describe("authoringFeedbackStem", () => {
	// Real fixture: shadow_ai_hos_1 card
	const SHIELD = "Shield the team";
	const GIVE_NAMES = "Give names to compliance";

	// (choiceSidesSwapped, selectedPresentationSlot) -> expected slug
	const cases: Array<{
		swapped: boolean | undefined;
		slot: PresentationChoiceSlot;
		expected: string;
		note: string;
	}> = [
		{
			swapped: undefined,
			slot: "LEFT",
			expected: "shield-the-team",
			note: "undefined: visible left = authoring left label slug",
		},
		{
			swapped: undefined,
			slot: "RIGHT",
			expected: "give-names-to-compliance",
			note: "undefined: visible right = authoring right label slug",
		},
		{
			swapped: false,
			slot: "LEFT",
			expected: "shield-the-team",
			note: "not swapped: LEFT → authoring left label slug",
		},
		{
			swapped: false,
			slot: "RIGHT",
			expected: "give-names-to-compliance",
			note: "not swapped: RIGHT → authoring right label slug",
		},
		{
			swapped: true,
			slot: "LEFT",
			expected: "give-names-to-compliance",
			note: "swapped: LEFT slot shows authoring-right label slug",
		},
		{
			swapped: true,
			slot: "RIGHT",
			expected: "shield-the-team",
			note: "swapped: RIGHT slot shows authoring-left label slug",
		},
	];

	it.each(cases)("$note", ({ swapped, slot, expected }) => {
		expect(authoringFeedbackStem(card(swapped, SHIELD, GIVE_NAMES), slot)).toBe(
			expected,
		);
	});
});
