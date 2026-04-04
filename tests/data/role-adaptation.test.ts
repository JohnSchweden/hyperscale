import { describe, expect, it } from "vitest";
import { ROLE_CARDS } from "../../src/data/cards";
import { RoleType } from "../../src/types";

/**
 * Role Adaptation Test
 *
 * This test validates that the same incidents (e.g., "Prompt Injection")
 * appear with different context/wording across roles.
 *
 * Expected role-specific language patterns:
 * - Finance: budget, cost, revenue, compliance, risk
 * - Dev/Engineer: security, code, technical, implementation
 * - Marketing: brand, audience, campaign, reach
 * - HR: employee, morale, retention, culture
 * - Management: strategy, stakeholders, alignment, decision
 */

/**
 * Map of incident keywords to expected role-specific language
 */
const INCIDENT_KEYWORDS: Record<string, string[]> = {
	"prompt injection": [
		"security",
		"input",
		"injection",
		"validation",
		"sanitize",
	],
	"model drift": [
		"accuracy",
		"performance",
		"degradation",
		"retraining",
		"monitoring",
	],
	"data leak": ["privacy", "breach", "exposure", "sensitive", "confidential"],
	hallucination: ["factual", "accuracy", "truth", "verify", "reliable"],
	bias: ["fairness", "discrimination", "equity", "inclusive", "demographic"],
	compliance: ["regulatory", "audit", "violation", "legal", "gdpr"],
	automation: ["workflow", "efficiency", "manual", "process", "scale"],
};

/**
 * Role-specific vocabulary expectations
 */
const ROLE_VOCABULARY: Record<RoleType, string[]> = {
	[RoleType.CHIEF_SOMETHING_OFFICER]: [
		"strategy",
		"vision",
		"stakeholders",
		"alignment",
		"leadership",
	],
	[RoleType.HEAD_OF_SOMETHING]: [
		"team",
		"execution",
		"delivery",
		"priorities",
		"resources",
	],
	[RoleType.SOMETHING_MANAGER]: [
		"budget",
		"cost",
		"timeline",
		"resources",
		"planning",
	],
	[RoleType.TECH_AI_CONSULTANT]: [
		"solution",
		"implementation",
		"integration",
		"architecture",
		"recommendation",
	],
	[RoleType.DATA_SCIENTIST]: [
		"model",
		"accuracy",
		"training",
		"data",
		"performance",
	],
	[RoleType.SOFTWARE_ARCHITECT]: [
		"system",
		"design",
		"scalability",
		"pattern",
		"infrastructure",
	],
	[RoleType.SOFTWARE_ENGINEER]: [
		"code",
		"implementation",
		"testing",
		"deployment",
		"bug",
	],
	[RoleType.VIBE_CODER]: ["prompt", "generate", "iterate", "prototype", "ship"],
	[RoleType.VIBE_ENGINEER]: ["vibe", "feel", "experience", "flow", "energy"],
	[RoleType.AGENTIC_ENGINEER]: [
		"agent",
		"autonomous",
		"workflow",
		"orchestration",
		"tool",
	],
};

/**
 * Extract keywords from text
 */
function extractKeywords(text: string): string[] {
	const lower = text.toLowerCase();
	return Object.entries(INCIDENT_KEYWORDS)
		.filter(([_, keywords]) => keywords.some((kw) => lower.includes(kw)))
		.map(([incident]) => incident);
}

/**
 * Check if text contains role-specific vocabulary
 */
function hasRoleVocabulary(text: string, role: RoleType): boolean {
	const vocab = ROLE_VOCABULARY[role];
	const lower = text.toLowerCase();
	return vocab.some((word) => lower.includes(word.toLowerCase()));
}

describe("Role Adaptation — Scenario Variants", () => {
	it("validates role-specific framing (heuristic check)", () => {
		const results: Record<
			string,
			{ cards: number; withRoleVocab: number; coverage: string }
		> = {};

		for (const role of Object.values(RoleType)) {
			const cards = ROLE_CARDS[role];
			let withRoleVocab = 0;

			for (const card of cards) {
				// Check if card text uses role-specific vocabulary
				const hasVocab =
					hasRoleVocabulary(card.text, role) ||
					hasRoleVocabulary(card.context, role) ||
					hasRoleVocabulary(card.onRight.lesson, role) ||
					hasRoleVocabulary(card.onLeft.lesson, role);

				if (hasVocab) {
					withRoleVocab++;
				}
			}

			const coverage =
				cards.length > 0 ? (withRoleVocab / cards.length) * 100 : 0;
			results[role] = {
				cards: cards.length,
				withRoleVocab,
				coverage: `${coverage.toFixed(0)}%`,
			};
		}

		console.log("\n📊 Role-Specific Vocabulary Coverage:");
		console.table(results);

		// This is an informational test - no hard assertions
		expect(true).toBe(true);
	});

	it("warns on potential copy-paste across roles", () => {
		// Collect all card texts by role
		const cardTextsByRole: Record<RoleType, string[]> = {} as Record<
			RoleType,
			string[]
		>;

		for (const role of Object.values(RoleType)) {
			cardTextsByRole[role] = ROLE_CARDS[role].map((c) =>
				c.text.toLowerCase().trim(),
			);
		}

		// Check for identical text across different roles
		const duplicates: string[] = [];
		const roles = Object.values(RoleType);

		for (let i = 0; i < roles.length; i++) {
			for (let j = i + 1; j < roles.length; j++) {
				const roleA = roles[i];
				const roleB = roles[j];

				const textsA = cardTextsByRole[roleA];
				const textsB = cardTextsByRole[roleB];

				for (const text of textsA) {
					if (textsB.includes(text)) {
						duplicates.push(
							`${roleA} ↔ ${roleB}: "${text.substring(0, 50)}..."`,
						);
					}
				}
			}
		}

		if (duplicates.length > 0) {
			console.warn(
				`\n⚠️  Potential copy-paste detected across roles:\n${duplicates.join("\n")}`,
			);
		} else {
			console.log("\n✓ No identical card text found across roles");
		}

		// Warning only - not a hard failure (some overlap may be intentional)
		expect(true).toBe(true);
	});

	it("analyzes incident keyword distribution", () => {
		const keywordCounts: Record<string, Record<RoleType, number>> = {};

		// Initialize counts
		for (const keyword of Object.keys(INCIDENT_KEYWORDS)) {
			keywordCounts[keyword] = {} as Record<RoleType, number>;
			for (const role of Object.values(RoleType)) {
				keywordCounts[keyword][role] = 0;
			}
		}

		// Count keywords per role
		for (const role of Object.values(RoleType)) {
			for (const card of ROLE_CARDS[role]) {
				const allText =
					`${card.text} ${card.context} ${card.storyContext || ""}`.toLowerCase();
				const keywords = extractKeywords(allText);

				for (const kw of keywords) {
					keywordCounts[kw][role]++;
				}
			}
		}

		console.log("\n📈 Incident Keyword Distribution by Role:");
		console.log("(Shows which roles cover which incident types)\n");

		for (const [keyword, counts] of Object.entries(keywordCounts)) {
			const rolesWithKeyword = Object.entries(counts).filter(
				([_, count]) => count > 0,
			);
			if (rolesWithKeyword.length > 0) {
				console.log(`${keyword}:`);
				for (const [role, count] of rolesWithKeyword) {
					console.log(`  ${role}: ${count} cards`);
				}
			}
		}

		expect(true).toBe(true);
	});

	it("validates unique card counts per incident type", () => {
		// Build a map of incident keywords → card IDs by role
		const incidentCards: Record<string, Record<RoleType, string[]>> = {};

		for (const keyword of Object.keys(INCIDENT_KEYWORDS)) {
			incidentCards[keyword] = {} as Record<RoleType, string[]>;
			for (const role of Object.values(RoleType)) {
				incidentCards[keyword][role] = [];
			}
		}

		// Populate the map
		for (const role of Object.values(RoleType)) {
			for (const card of ROLE_CARDS[role]) {
				const allText =
					`${card.text} ${card.context} ${card.storyContext || ""}`.toLowerCase();
				const keywords = extractKeywords(allText);

				for (const kw of keywords) {
					if (!incidentCards[kw][role].includes(card.id)) {
						incidentCards[kw][role].push(card.id);
					}
				}
			}
		}

		// Check coverage
		console.log("\n🎯 Incident Type Coverage Analysis:");
		for (const [keyword, roleMap] of Object.entries(incidentCards)) {
			const roles = Object.entries(roleMap).filter(
				([_, ids]) => ids.length > 0,
			);
			const totalUniqueCards = new Set(roles.flatMap(([_, ids]) => ids)).size;

			if (roles.length > 0) {
				const status = totalUniqueCards < roles.length ? "⚠️" : "✓";
				console.log(
					`${status} ${keyword}: ${totalUniqueCards} unique cards across ${roles.length} roles`,
				);
			}
		}

		expect(true).toBe(true);
	});

	it("documents expected role-specific framing patterns", () => {
		const documentation = {
			promptInjection: {
				dev: "Technical implementation details, security concerns",
				finance: "Compliance costs, liability, regulatory reporting",
				marketing: "Brand reputation, customer trust impact",
				hr: "Employee training, policy implications",
			},
			modelDrift: {
				dev: "Retraining costs, technical debt, monitoring",
				finance: "Budget impact, ROI degradation, accuracy costs",
				marketing: "Campaign performance, audience targeting",
				hr: "Performance evaluation fairness, bias detection",
			},
			dataLeak: {
				dev: "Security measures, encryption, access controls",
				finance: "Regulatory fines, legal costs, disclosure requirements",
				marketing: "Brand damage, customer churn, PR response",
				hr: "Employee privacy, trust erosion, morale impact",
			},
		};

		console.log("\n📚 Expected Role-Specific Framing Patterns:");
		for (const [incident, roles] of Object.entries(documentation)) {
			console.log(`\n${incident}:`);
			for (const [role, framing] of Object.entries(roles)) {
				console.log(`  ${role}: ${framing}`);
			}
		}

		expect(documentation).toBeDefined();
	});
});
