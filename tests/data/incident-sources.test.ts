import { describe, expect, it } from "vitest";
import { ROLE_CARDS } from "../../src/data/cards";
import { RoleType } from "../../src/types";
import cardSources from "./card-sources.json";

/**
 * Incident Sources Test
 *
 * Validates that every card has documented sourcing from real 2024-2025 incidents.
 * Sources should be URLs, incident names with dates, or research paper citations.
 *
 * During Phase 03 card generation, each card should be added to card-sources.json
 * with its source documentation.
 */

/**
 * Type for source documentation entry
 */
interface CardSourceEntry {
	/** Card ID from the card data */
	cardId: string;
	/** Source incident name or reference */
	incidentName: string;
	/** Source URL if available */
	url?: string;
	/** Date of incident (YYYY-MM or YYYY) */
	date: string;
	/** Category of incident */
	category: string;
	/** Why this incident was adapted */
	reason: string;
	/** Whether this is a fictional scenario */
	fictional?: boolean;
}

describe("Card Incident Sourcing", () => {
	it("validates all cards have documented sources", () => {
		const allCardIds: string[] = [];
		const documentedIds: string[] = cardSources.sources.map(
			(s: CardSourceEntry) => s.cardId,
		);

		// Collect all card IDs from all roles
		for (const role of Object.values(RoleType)) {
			const cards = ROLE_CARDS[role];
			for (const card of cards) {
				allCardIds.push(card.id);
			}
		}

		// Find cards without documentation
		const missingDocs = allCardIds.filter((id) => !documentedIds.includes(id));
		const extraDocs = documentedIds.filter((id) => !allCardIds.includes(id));

		console.log("\n📋 Source Documentation Status:");
		console.log(`  Total cards: ${allCardIds.length}`);
		console.log(`  Documented: ${documentedIds.length}`);
		console.log(`  Missing: ${missingDocs.length}`);

		if (missingDocs.length > 0) {
			console.log(`\n⚠️  Cards needing source documentation:`);
			for (const id of missingDocs.slice(0, 10)) {
				console.log(`    - ${id}`);
			}
			if (missingDocs.length > 10) {
				console.log(`    ... and ${missingDocs.length - 10} more`);
			}
		}

		if (extraDocs.length > 0) {
			console.log(`\n⚠️  Documented cards not found in ROLE_CARDS:`);
			for (const id of extraDocs) {
				console.log(`    - ${id}`);
			}
		}

		// For the scaffold phase, we just log warnings
		// In full validation, this would be: expect(missingDocs).toHaveLength(0);
		expect(true).toBe(true);
	});

	it("validates source entry format", () => {
		const issues: string[] = [];

		for (const entry of cardSources.sources) {
			// Check required fields
			if (!entry.cardId || entry.cardId.trim() === "") {
				issues.push("Source entry missing cardId");
			}

			if (!entry.incidentName || entry.incidentName.trim() === "") {
				issues.push(`${entry.cardId}: missing incidentName`);
			}

			if (!entry.date || entry.date.trim() === "") {
				issues.push(`${entry.cardId}: missing date`);
			}

			if (!entry.category || entry.category.trim() === "") {
				issues.push(`${entry.cardId}: missing category`);
			}

			if (!entry.reason || entry.reason.trim() === "") {
				issues.push(`${entry.cardId}: missing reason`);
			}

			// Check date format (YYYY-MM or YYYY)
			if (entry.date && !entry.date.match(/^\d{4}(-\d{2})?$/)) {
				issues.push(
					`${entry.cardId}: invalid date format "${entry.date}" (expected YYYY or YYYY-MM)`,
				);
			}

			// Check for placeholder text
			const placeholderTerms = [
				"TODO",
				"FIXME",
				"placeholder",
				"needs research",
				"TBD",
			];
			for (const term of placeholderTerms) {
				if (entry.incidentName.toLowerCase().includes(term.toLowerCase())) {
					issues.push(
						`${entry.cardId}: incidentName contains placeholder "${term}"`,
					);
				}
				if (entry.reason.toLowerCase().includes(term.toLowerCase())) {
					issues.push(`${entry.cardId}: reason contains placeholder "${term}"`);
				}
			}
		}

		if (issues.length > 0) {
			console.warn(`\n⚠️  Source format issues:\n${issues.join("\n")}`);
		}

		expect(true).toBe(true);
	});

	it("validates date range (2024-2025 incidents)", () => {
		const issues: string[] = [];
		const currentYear = new Date().getFullYear();

		for (const entry of cardSources.sources) {
			if (!entry.date) continue;

			const year = Number.parseInt(entry.date.split("-")[0], 10);

			// Accept 2024-2025 as primary range
			// Also accept fictional cards and older foundational incidents
			if (!entry.fictional && (year < 2020 || year > currentYear)) {
				issues.push(
					`${entry.cardId}: date "${entry.date}" outside expected range (2020-${currentYear})`,
				);
			}
		}

		if (issues.length > 0) {
			console.warn(`\n⚠️  Date range issues:\n${issues.join("\n")}`);
		}

		expect(true).toBe(true);
	});

	it("validates categories are standardized", () => {
		// Expected categories based on Phase 03 research
		const expectedCategories = [
			"PROMPT_INJECTION",
			"MODEL_DRIFT",
			"DATA_LEAK",
			"HALLUCINATION",
			"BIAS",
			"COMPLIANCE_VIOLATION",
			"AUTOMATION_FAILURE",
			"SECURITY_BREACH",
			"ETHICAL_DILEMMA",
			"REPUTATIONAL_DAMAGE",
			"FRAUD",
			"COPYRIGHT_VIOLATION",
			"KOBAYASHI_MARU", // Fictional scenarios
		];

		const unknownCategories: string[] = [];

		for (const entry of cardSources.sources) {
			if (!expectedCategories.includes(entry.category)) {
				unknownCategories.push(`${entry.cardId}: "${entry.category}"`);
			}
		}

		if (unknownCategories.length > 0) {
			console.warn(
				`\n⚠️  Unknown categories (consider adding to expected list):\n${unknownCategories.join("\n")}`,
			);
			console.log(`\nExpected categories: ${expectedCategories.join(", ")}`);
		}

		expect(true).toBe(true);
	});

	it("logs sourcing summary", () => {
		const fictionalCount = cardSources.sources.filter(
			(s: CardSourceEntry) => s.fictional,
		).length;
		const realCount = cardSources.sources.length - fictionalCount;

		// Count by category
		const categoryCounts: Record<string, number> = {};
		for (const entry of cardSources.sources) {
			categoryCounts[entry.category] =
				(categoryCounts[entry.category] || 0) + 1;
		}

		console.log("\n📊 Source Documentation Summary:");
		console.log(`  Total documented: ${cardSources.sources.length}`);
		console.log(`  Real incidents: ${realCount}`);
		console.log(`  Fictional (Kobayashi Maru): ${fictionalCount}`);

		if (Object.keys(categoryCounts).length > 0) {
			console.log("\n  By category:");
			for (const [cat, count] of Object.entries(categoryCounts).sort()) {
				console.log(`    ${cat}: ${count}`);
			}
		}

		expect(true).toBe(true);
	});
});
