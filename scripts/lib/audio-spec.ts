import * as path from "node:path";
import { DEATH_ENDINGS } from "../../src/data/deathEndings";
import { slugify } from "../../src/lib/slugify";
import type { Card, PersonalityType } from "../../src/types";
import {
	type DeathType,
	PersonalityType as PersonalityTypeEnum,
} from "../../src/types";

export interface FeedbackAudioSpec {
	cardId: string;
	side: "left" | "right";
	label: string;
	slug: string;
	personality: PersonalityType;
	text: string;
	outputPath: string;
	filename: string;
}

export interface DeathAudioSpec {
	deathType: string;
	personality: PersonalityType;
	text: string;
	outputPath: string;
	filename: string;
}

/**
 * Derive feedback audio generation specs from card objects.
 * No hardcoded strings — all data comes from card sources.
 *
 * @param cards Array of Card objects to process
 * @param personalities Personalities to generate for (default: all three)
 * @param cardIds Optional allowlist of card IDs to process
 * @returns Array of FeedbackAudioSpec objects
 */
export function deriveFeedbackSpecs(
	cards: Card[],
	personalities: PersonalityType[] = [
		PersonalityTypeEnum.ROASTER,
		PersonalityTypeEnum.ZEN_MASTER,
		PersonalityTypeEnum.LOVEBOMBER,
	],
	cardIds?: string[],
): FeedbackAudioSpec[] {
	const specs: FeedbackAudioSpec[] = [];
	const allowlist = cardIds ? new Set(cardIds) : null;

	for (const card of cards) {
		// Skip if allowlist provided and card not in it
		if (allowlist && !allowlist.has(card.id)) continue;

		// Process left side
		const leftSlug = slugify(card.onLeft.label);
		const leftFilename = `feedback_${card.id}_${leftSlug}`;

		for (const personality of personalities) {
			const text = card.onLeft.feedback[personality];
			if (!text) {
				console.warn(
					`Warning: No feedback text for card ${card.id} left side, personality ${personality}`,
				);
				continue;
			}

			specs.push({
				cardId: card.id,
				side: "left",
				label: card.onLeft.label,
				slug: leftSlug,
				personality,
				text,
				filename: leftFilename,
				outputPath: path.join(
					process.cwd(),
					"public/audio/voices",
					getFolderForPersonality(personality),
					"feedback",
					getFeedbackSubfolder(card.id),
					leftFilename,
				),
			});
		}

		// Process right side
		const rightSlug = slugify(card.onRight.label);
		const rightFilename = `feedback_${card.id}_${rightSlug}`;

		for (const personality of personalities) {
			const text = card.onRight.feedback[personality];
			if (!text) {
				console.warn(
					`Warning: No feedback text for card ${card.id} right side, personality ${personality}`,
				);
				continue;
			}

			specs.push({
				cardId: card.id,
				side: "right",
				label: card.onRight.label,
				slug: rightSlug,
				personality,
				text,
				filename: rightFilename,
				outputPath: path.join(
					process.cwd(),
					"public/audio/voices",
					getFolderForPersonality(personality),
					"feedback",
					getFeedbackSubfolder(card.id),
					rightFilename,
				),
			});
		}
	}

	return specs;
}

/**
 * Derive death ending audio generation specs.
 *
 * @param personalities Personalities to generate for (default: all three)
 * @returns Array of DeathAudioSpec objects
 */
export function deriveDeathSpecs(
	personalities: PersonalityType[] = [
		PersonalityTypeEnum.ROASTER,
		PersonalityTypeEnum.ZEN_MASTER,
		PersonalityTypeEnum.LOVEBOMBER,
	],
): DeathAudioSpec[] {
	const specs: DeathAudioSpec[] = [];

	for (const [deathTypeKey, ending] of Object.entries(DEATH_ENDINGS)) {
		const deathType = deathTypeKey as DeathType;

		for (const personality of personalities) {
			const text = ending.voiceText[personality];
			if (!text) {
				console.warn(
					`Warning: No voice text for death type ${deathType}, personality ${personality}`,
				);
				continue;
			}

			const slug = deathType.toLowerCase().replace(/_/g, "_");
			const filename = `death_${slug}`;

			specs.push({
				deathType,
				personality,
				text,
				filename,
				outputPath: path.join(
					process.cwd(),
					"public/audio/voices",
					getFolderForPersonality(personality),
					"death",
					filename,
				),
			});
		}
	}

	return specs;
}

/**
 * Helper to map PersonalityType to audio folder name.
 */
function getFolderForPersonality(personality: PersonalityType): string {
	switch (personality) {
		case PersonalityTypeEnum.ROASTER:
			return "roaster";
		case PersonalityTypeEnum.ZEN_MASTER:
			return "zenmaster";
		case PersonalityTypeEnum.LOVEBOMBER:
			return "lovebomber";
		default:
			throw new Error(`Unknown personality: ${personality}`);
	}
}

/**
 * Helper to determine subfolder for feedback audio based on card ID.
 * HoS cards and related cards go to hos/ subfolder.
 * Other decks may follow similar patterns.
 */
function getFeedbackSubfolder(cardId: string): string {
	// HoS-related cards: hos_*, explainability_hos_*, shadow_ai_hos_*
	if (
		cardId.startsWith("hos_") ||
		cardId.includes("_hos_") ||
		cardId.startsWith("explainability_") ||
		cardId.startsWith("shadow_ai_")
	) {
		return "hos";
	}
	// Default: card type prefix (e.g., ae_*, cso_*, ds_*) becomes subfolder
	const prefix = cardId.split("_")[0];
	return prefix;
}

/**
 * Helper to get Gemini voice name for a personality.
 */
export function getVoiceForPersonality(personality: PersonalityType): string {
	switch (personality) {
		case PersonalityTypeEnum.ROASTER:
			return "Kore";
		case PersonalityTypeEnum.ZEN_MASTER:
			return "Puck";
		case PersonalityTypeEnum.LOVEBOMBER:
			return "Enceladus";
		default:
			throw new Error(`Unknown personality: ${personality}`);
	}
}
