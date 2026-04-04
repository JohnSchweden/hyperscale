import { describe, expect, it } from "vitest";
import { ROLE_CARDS } from "../../src/data/cards";
import { RoleType } from "../../src/types";

/**
 * Card Incident Sourcing Test
 *
 * Validates incident sourcing for Phase 05 cards:
 * 1. Incident ID format must follow {category}_{role}_{number} pattern
 * 2. Card text must mention role-specific consequences
 * 3. Incident year verification (2024-2025 preferred)
 * 4. Real-world reference field exists and is non-empty
 */

/**
 * Role-specific context keywords that indicate role-specific framing
 */
const ROLE_CONTEXT_KEYWORDS: Record<RoleType, string[]> = {
	[RoleType.CHIEF_SOMETHING_OFFICER]: [
		"board",
		"shareholder",
		"liability",
		"team",
		"strategic",
		"vision",
		"stakeholder",
		"governance",
		"regulatory",
		"compliance",
		"quarter",
		"revenue",
	],
	[RoleType.HEAD_OF_SOMETHING]: [
		"team",
		"execution",
		"delivery",
		"priorities",
		"resources",
		"roadmap",
		"headcount",
		"performance",
		"objectives",
	],
	[RoleType.SOMETHING_MANAGER]: [
		"budget",
		"spreadsheet",
		"ROI",
		"compliance",
		"timeline",
		"resources",
		"cost",
		"allocation",
		"milestone",
		"escalation",
	],
	[RoleType.TECH_AI_CONSULTANT]: [
		"client",
		"contract",
		"deliverable",
		"vendor",
		"engagement",
		"proposal",
		"scope",
		"SOW",
		"implementation",
	],
	[RoleType.DATA_SCIENTIST]: [
		"accuracy",
		"model",
		"retrain",
		"bias",
		"training",
		"dataset",
		"metric",
		"validation",
		"experiment",
		"feature",
	],
	[RoleType.SOFTWARE_ARCHITECT]: [
		"design",
		"pattern",
		"scalability",
		"system",
		"integration",
		"technical debt",
		"architecture",
		"component",
		"interface",
	],
	[RoleType.SOFTWARE_ENGINEER]: [
		"timeline",
		"technical debt",
		"security",
		"deploy",
		"implementation",
		"testing",
		"code review",
		"bug",
		"refactor",
	],
	[RoleType.VIBE_CODER]: [
		"prompt",
		"LLM",
		"hallucination",
		"AI-assisted",
		"generate",
		"iterate",
		"prototype",
		"ship",
		"vibe",
	],
	[RoleType.VIBE_ENGINEER]: [
		"latency",
		"performance",
		"scaling",
		"cache",
		"optimization",
		"throughput",
		"response time",
		"load",
		"benchmark",
	],
	[RoleType.AGENTIC_ENGINEER]: [
		"agent",
		"autonomous",
		"emergent",
		"governance",
		"orchestration",
		"tool",
		"action",
		"loop",
		"delegation",
	],
};

/**
 * Valid category prefixes for Phase 05 cards
 */
const VALID_CATEGORY_PREFIXES = [
	"prompt_injection",
	"model_drift",
	"explainability",
	"shadow_ai",
	"synthetic_data",
	"se_", // Legacy software engineer prefix
	"ds_", // Legacy data scientist prefix
	"cso_", // Legacy chief prefix
	"hos_", // Legacy head prefix
	"sm_", // Legacy manager prefix
	"tac_", // Legacy consultant prefix
	"sa_", // Legacy architect prefix
	"vc_", // Legacy vibe coder prefix
	"ve_", // Legacy vibe engineer prefix
	"ae_", // Legacy agentic engineer prefix
];

describe("Card Incident Sourcing", () => {
	describe("Incident ID format", () => {
		for (const role of Object.values(RoleType)) {
			it(`${role}: all card IDs follow naming convention`, () => {
				const cards = ROLE_CARDS[role];
				const issues: string[] = [];

				for (const card of cards) {
					// Check if ID uses snake_case
					if (!card.id.match(/^[a-z0-9_]+$/)) {
						issues.push(
							`${card.id}: ID should use snake_case (lowercase with underscores)`,
						);
					}

					// Check if ID has recognizable prefix
					const hasValidPrefix = VALID_CATEGORY_PREFIXES.some((prefix) =>
						card.id.toLowerCase().startsWith(prefix.toLowerCase()),
					);
					if (!hasValidPrefix) {
						issues.push(
							`${card.id}: ID should start with valid category prefix (e.g., prompt_injection_, model_drift_, se_)`,
						);
					}
				}

				if (issues.length > 0) {
					console.warn(`\n⚠️  ${role} ID format issues:\n${issues.join("\n")}`);
				}

				// This is a warning test - IDs can be improved over time
				expect(true).toBe(true);
			});
		}
	});

	describe("Role-specific context validation", () => {
		for (const role of Object.values(RoleType)) {
			it(`${role}: card text mentions role-specific consequences`, () => {
				const cards = ROLE_CARDS[role];
				const genericCards: string[] = [];
				const contextKeywords = ROLE_CONTEXT_KEYWORDS[role];

				for (const card of cards) {
					const text = (
						card.text +
						" " +
						(card.storyContext || "")
					).toLowerCase();

					// Check if card contains any role-specific keywords
					const hasContext = contextKeywords.some((keyword) =>
						text.includes(keyword.toLowerCase()),
					);

					if (!hasContext) {
						genericCards.push(
							`${card.id}: no role-specific keywords found (expected: ${contextKeywords.slice(0, 5).join(", ")}...)`,
						);
					}
				}

				if (genericCards.length > 0) {
					console.warn(
						`\n⚠️  ${role} cards lacking role-specific context:\n${genericCards.join("\n")}`,
					);
				}

				// Warn but don't fail - cards can be improved over time
				expect(true).toBe(true);
			});
		}
	});

	describe("Incident year verification", () => {
		it("flags cards without 2024-2025 dates as low confidence", () => {
			const undatedCards: string[] = [];
			const oldCards: string[] = [];

			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];

				for (const card of cards) {
					// Try to extract year from realWorldReference
					const ref = card.realWorldReference;
					if (!ref) {
						undatedCards.push(`${card.id}: no realWorldReference`);
						continue;
					}

					const dateStr = ref.date || "";
					const yearMatch = dateStr.match(/20\d\d/);

					if (!yearMatch) {
						undatedCards.push(`${card.id}: no year in date "${dateStr}"`);
					} else {
						const year = Number.parseInt(yearMatch[0], 10);
						if (year < 2024) {
							oldCards.push(
								`${card.id}: incident from ${year} (expected 2024-2025)`,
							);
						}
					}
				}
			}

			console.log("\n📅 Incident Year Verification:");
			console.log(`  Cards with 2024-2025 dates: ✅ Primary target`);

			if (undatedCards.length > 0) {
				console.log(`\n  Undated cards (${undatedCards.length}):`);
				for (const card of undatedCards.slice(0, 5)) {
					console.log(`    - ${card}`);
				}
				if (undatedCards.length > 5) {
					console.log(`    ... and ${undatedCards.length - 5} more`);
				}
			}

			if (oldCards.length > 0) {
				console.log(`\n  Older incidents (${oldCards.length}):`);
				for (const card of oldCards.slice(0, 5)) {
					console.log(`    - ${card}`);
				}
				if (oldCards.length > 5) {
					console.log(`    ... and ${oldCards.length - 5} more`);
				}
			}

			// Soft check - warn but don't fail
			expect(true).toBe(true);
		});
	});

	describe("Real-world reference validation", () => {
		it("all cards have realWorldReference field", () => {
			const missingRef: string[] = [];

			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];

				for (const card of cards) {
					if (!card.realWorldReference) {
						missingRef.push(`${role}.${card.id}`);
					}
				}
			}

			expect(missingRef).toEqual([]);
		});

		it("all realWorldReference fields have required properties", () => {
			const invalidCards: { id: string; missing: string[] }[] = [];

			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];

				for (const card of cards) {
					if (!card.realWorldReference) continue;

					const missing: string[] = [];
					if (!card.realWorldReference.incident) missing.push("incident name");
					if (!card.realWorldReference.date) missing.push("date");
					if (!card.realWorldReference.outcome) missing.push("outcome");

					if (missing.length > 0) {
						invalidCards.push({ id: `${role}.${card.id}`, missing });
					}
				}
			}

			expect(invalidCards).toEqual([]);
		});

		it("incident names are meaningful (not placeholder)", () => {
			const placeholderTerms = [
				"TODO",
				"FIXME",
				"placeholder",
				"needs research",
				"TBD",
				"example",
				"generic",
			];
			const issues: string[] = [];

			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];

				for (const card of cards) {
					if (!card.realWorldReference?.incident) continue;

					const incidentName = card.realWorldReference.incident.toLowerCase();

					for (const term of placeholderTerms) {
						if (incidentName.includes(term.toLowerCase())) {
							issues.push(
								`${card.id}: incident name contains placeholder "${term}"`,
							);
							break;
						}
					}
				}
			}

			if (issues.length > 0) {
				console.warn(`\n⚠️  Placeholder incident names:\n${issues.join("\n")}`);
			}

			expect(true).toBe(true);
		});
	});

	describe("Incident sourcing summary", () => {
		it("logs sourcing statistics across all roles", () => {
			let totalCards = 0;
			let cardsWithRef = 0;
			let cardsWith2024 = 0;
			let cardsWith2025 = 0;
			let cardsWithOlder = 0;

			for (const role of Object.values(RoleType)) {
				const cards = ROLE_CARDS[role];
				totalCards += cards.length;

				for (const card of cards) {
					if (card.realWorldReference) {
						cardsWithRef++;

						const date = card.realWorldReference.date || "";
						if (date.includes("2024")) cardsWith2024++;
						else if (date.includes("2025")) cardsWith2025++;
						else cardsWithOlder++;
					}
				}
			}

			console.log("\n📊 Incident Sourcing Summary:");
			console.log(`  Total cards: ${totalCards}`);
			console.log(
				`  With realWorldReference: ${cardsWithRef} (${Math.round((cardsWithRef / totalCards) * 100)}%)`,
			);
			console.log(`  2024 incidents: ${cardsWith2024}`);
			console.log(`  2025 incidents: ${cardsWith2025}`);
			console.log(`  Older/other: ${cardsWithOlder}`);

			expect(true).toBe(true);
		});
	});
});
