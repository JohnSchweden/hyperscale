import {
	AGENTIC_ENGINEER_CARDS,
	CHIEF_SOMETHING_OFFICER_CARDS,
	DATA_SCIENTIST_CARDS,
	HEAD_OF_SOMETHING_CARDS,
	ROLE_CARDS,
	SOFTWARE_ARCHITECT_CARDS,
	SOFTWARE_ENGINEER_CARDS,
	SOMETHING_MANAGER_CARDS,
	TECH_AI_CONSULTANT_CARDS,
	VIBE_CODER_CARDS,
	VIBE_ENGINEER_CARDS,
} from "../../data/cards";
import { type Card, DeathType, RoleType } from "../../types";

/**
 * Unified deck collection for tests that need to iterate over all role decks.
 * Use this instead of manually enumerating decks in individual tests.
 */
export const ALL_ROLE_DECKS: Array<{ role: RoleType; cards: Card[] }> = [
	{
		role: RoleType.CHIEF_SOMETHING_OFFICER,
		cards: CHIEF_SOMETHING_OFFICER_CARDS,
	},
	{ role: RoleType.HEAD_OF_SOMETHING, cards: HEAD_OF_SOMETHING_CARDS },
	{ role: RoleType.SOMETHING_MANAGER, cards: SOMETHING_MANAGER_CARDS },
	{ role: RoleType.TECH_AI_CONSULTANT, cards: TECH_AI_CONSULTANT_CARDS },
	{ role: RoleType.DATA_SCIENTIST, cards: DATA_SCIENTIST_CARDS },
	{ role: RoleType.SOFTWARE_ARCHITECT, cards: SOFTWARE_ARCHITECT_CARDS },
	{ role: RoleType.SOFTWARE_ENGINEER, cards: SOFTWARE_ENGINEER_CARDS },
	{ role: RoleType.VIBE_CODER, cards: VIBE_CODER_CARDS },
	{ role: RoleType.VIBE_ENGINEER, cards: VIBE_ENGINEER_CARDS },
	{ role: RoleType.AGENTIC_ENGINEER, cards: AGENTIC_ENGINEER_CARDS },
];

/**
 * Validates that ROLE_CARDS mapping matches individual deck exports.
 * Use this in tests to ensure consistency between exports.
 */
export function validateRoleCardsMapping(): Array<{
	role: RoleType;
	expected: Card[];
	actual: Card[];
	matches: boolean;
}> {
	return ALL_ROLE_DECKS.map(({ role, cards }) => ({
		role,
		expected: cards,
		actual: ROLE_CARDS[role],
		matches: ROLE_CARDS[role] === cards,
	}));
}

/**
 * Counts death vector coverage in a deck.
 */
export interface VectorCount {
	total: number;
	byType: Record<DeathType, number>;
	coveragePercent: number;
}

const ZERO_COUNTS: Record<DeathType, number> = Object.fromEntries(
	Object.values(DeathType).map((t) => [t, 0]),
) as Record<DeathType, number>;

export function countVectorsInDeck(cards: Card[]): VectorCount {
	const byType = { ...ZERO_COUNTS };
	let total = 0;

	for (const card of cards) {
		if (card.onLeft.deathVector) {
			byType[card.onLeft.deathVector]++;
			total++;
		}
		if (card.onRight.deathVector) {
			byType[card.onRight.deathVector]++;
			total++;
		}
	}

	return {
		total,
		byType,
		coveragePercent: (total / (cards.length * 2)) * 100,
	};
}

/**
 * Counts unique non-KIRK death types in a vector map.
 */
export function countUniqueNonKirkTypes(
	vectorMap: Record<DeathType, number>,
): number {
	return Object.entries(vectorMap).filter(
		([type, count]) => type !== DeathType.KIRK && count > 0,
	).length;
}

/**
 * Category prefixes used for card classification.
 */
export const CATEGORY_PREFIXES: Record<string, string[]> = {
	prompt_injection: ["prompt_injection", "pi_"],
	model_drift: ["model_drift", "md_"],
	explainability: ["explainability", "xai_"],
	shadow_ai: ["shadow_ai", "sai_"],
	synthetic_data: ["synthetic_data", "sd_"],
};

/**
 * Counts cards by category for a role.
 */
export function countCardsByCategory(
	role: RoleType,
): Record<string, number> & { unknown: number } {
	const cards = ROLE_CARDS[role];
	const counts: Record<string, number> & { unknown: number } = {
		prompt_injection: 0,
		model_drift: 0,
		explainability: 0,
		shadow_ai: 0,
		synthetic_data: 0,
		unknown: 0,
	};

	for (const card of cards) {
		const id = card.id.toLowerCase();
		let matched = false;

		for (const [category, prefixes] of Object.entries(CATEGORY_PREFIXES)) {
			if (prefixes.some((prefix) => id.includes(prefix))) {
				counts[category]++;
				matched = true;
				break;
			}
		}

		if (!matched) {
			counts.unknown++;
		}
	}

	return counts;
}

/**
 * Validates card ID format (snake_case).
 */
export function isValidSnakeCase(id: string): boolean {
	return /^[a-z][a-z0-9_]*$/.test(id);
}

/**
 * Gets valid ID prefixes for a role.
 */
export function getValidPrefixesForRole(role: RoleType): string[] {
	const rolePrefixes: Record<RoleType, string[]> = {
		[RoleType.CHIEF_SOMETHING_OFFICER]: ["cso_", "chief"],
		[RoleType.HEAD_OF_SOMETHING]: ["hos_", "head_"],
		[RoleType.SOMETHING_MANAGER]: ["sm_", "manager"],
		[RoleType.TECH_AI_CONSULTANT]: ["tac_", "consultant"],
		[RoleType.DATA_SCIENTIST]: ["ds_", "data", "scientist"],
		[RoleType.SOFTWARE_ARCHITECT]: ["sa_", "architect"],
		[RoleType.SOFTWARE_ENGINEER]: ["se_", "engineer"],
		[RoleType.VIBE_CODER]: ["vc_", "vibe_coder"],
		[RoleType.VIBE_ENGINEER]: ["ve_", "vibe_engineer"],
		[RoleType.AGENTIC_ENGINEER]: ["ae_", "agentic"],
	};

	const categoryPrefixes = Object.values(CATEGORY_PREFIXES).flat();
	return [...rolePrefixes[role], ...categoryPrefixes];
}

/**
 * Checks if a card ID has a valid prefix for its role.
 */
export function hasValidPrefix(id: string, role: RoleType): boolean {
	const prefixes = getValidPrefixesForRole(role);
	return prefixes.some((prefix) => id.toLowerCase().startsWith(prefix));
}

/**
 * Finds duplicate card IDs across all roles.
 */
export function findDuplicateCardIds(): Array<{
	id: string;
	roles: RoleType[];
}> {
	const idToRoles = new Map<string, RoleType[]>();

	for (const { role, cards } of ALL_ROLE_DECKS) {
		for (const card of cards) {
			const existing = idToRoles.get(card.id) ?? [];
			existing.push(role);
			idToRoles.set(card.id, existing);
		}
	}

	return Array.from(idToRoles.entries())
		.filter(([, roles]) => roles.length > 1)
		.map(([id, roles]) => ({ id, roles }));
}

/**
 * Calculates total card statistics across all roles.
 */
export function calculateTotalStats(): {
	totalCards: number;
	uniqueIds: number;
	duplicates: number;
	cardsPerRole: Record<RoleType, number>;
} {
	let totalCards = 0;
	const uniqueIds = new Set<string>();
	const cardsPerRole: Record<RoleType, number> = {
		[RoleType.CHIEF_SOMETHING_OFFICER]: 0,
		[RoleType.HEAD_OF_SOMETHING]: 0,
		[RoleType.SOMETHING_MANAGER]: 0,
		[RoleType.TECH_AI_CONSULTANT]: 0,
		[RoleType.DATA_SCIENTIST]: 0,
		[RoleType.SOFTWARE_ARCHITECT]: 0,
		[RoleType.SOFTWARE_ENGINEER]: 0,
		[RoleType.VIBE_CODER]: 0,
		[RoleType.VIBE_ENGINEER]: 0,
		[RoleType.AGENTIC_ENGINEER]: 0,
	};

	for (const { role, cards } of ALL_ROLE_DECKS) {
		totalCards += cards.length;
		cardsPerRole[role] = cards.length;

		for (const card of cards) {
			uniqueIds.add(card.id);
		}
	}

	return {
		totalCards,
		uniqueIds: uniqueIds.size,
		duplicates: totalCards - uniqueIds.size,
		cardsPerRole,
	};
}
