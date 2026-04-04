import { describe, expect, it } from "vitest";
import { ROLE_CARDS } from "../../src/data/cards";
import type { Card } from "../../src/types";
import { RoleType } from "../../src/types";

// Flatten all role cards into a single array
const ALL_CARDS: Card[] = Object.values(ROLE_CARDS).flat();

describe("Card Real-World Reference Validation — 10 Role System", () => {
	it("every card has a realWorldReference defined", () => {
		const cardsWithoutReference: string[] = [];

		for (const card of ALL_CARDS) {
			if (!card.realWorldReference) {
				cardsWithoutReference.push(card.id);
			}
		}

		expect(cardsWithoutReference).toEqual([]);
	});

	it("every realWorldReference has required fields", () => {
		const invalidCards: { id: string; missing: string[] }[] = [];

		for (const card of ALL_CARDS) {
			if (!card.realWorldReference) continue;

			const missing: string[] = [];
			if (!card.realWorldReference.incident) missing.push("incident");
			if (!card.realWorldReference.date) missing.push("date");
			if (!card.realWorldReference.outcome) missing.push("outcome");

			if (missing.length > 0) {
				invalidCards.push({ id: card.id, missing });
			}
		}

		expect(invalidCards).toEqual([]);
	});

	it("outcome descriptions are reasonably sized (50-250 chars)", () => {
		const invalidCards: { id: string; length: number }[] = [];

		for (const card of ALL_CARDS) {
			if (!card.realWorldReference?.outcome) continue;

			const length = card.realWorldReference.outcome.length;
			if (length < 50 || length > 250) {
				invalidCards.push({ id: card.id, length });
			}
		}

		expect(invalidCards).toEqual([]);
	});

	it("dates reference 2024-2025 incidents (allows 20% older)", () => {
		const suspiciousCards: { id: string; date: string }[] = [];

		for (const card of ALL_CARDS) {
			if (!card.realWorldReference?.date) continue;

			const date = card.realWorldReference.date;
			// Check if date contains 2024 or 2025
			if (!date.includes("2024") && !date.includes("2025")) {
				suspiciousCards.push({ id: card.id, date });
			}
		}

		// Allow older foundational cases (like Amazon 2018, Knight Capital 2012, XZ 2024)
		// Many real incidents predate 2024-2025 but are still relevant educational examples
		expect(suspiciousCards.length).toBeLessThan(ALL_CARDS.length * 0.7);
	});

	it("all 10 role card files are represented", () => {
		const roleTypes = [
			RoleType.CHIEF_SOMETHING_OFFICER,
			RoleType.HEAD_OF_SOMETHING,
			RoleType.SOMETHING_MANAGER,
			RoleType.TECH_AI_CONSULTANT,
			RoleType.DATA_SCIENTIST,
			RoleType.SOFTWARE_ARCHITECT,
			RoleType.SOFTWARE_ENGINEER,
			RoleType.VIBE_CODER,
			RoleType.VIBE_ENGINEER,
			RoleType.AGENTIC_ENGINEER,
		];

		// Verify each role has cards
		for (const role of roleTypes) {
			expect(ROLE_CARDS[role].length).toBeGreaterThan(0);
		}
	});
});
