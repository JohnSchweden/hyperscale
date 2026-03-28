import { slugify } from "../lib/slugify";
import type { ArchetypeId, DeathType } from "../types";
import { ROLE_CARDS } from "./cards";
import { HEAD_OF_SOMETHING_CARDS } from "./cards/head-of-something";

export { slugify };

/**
 * Image Map Configuration
 *
 * Centralized mapping of game entities to image assets.
 * All paths follow the /images/{category}/{slug}.webp convention.
 * No public/ prefix needed — Vite serves public/ at root.
 *
 * INCIDENT_IMAGES is auto-generated from realWorldReference.incident values
 * across all card decks to ensure cards sharing the same incident use the same image.
 */

/**
 * Type alias for incident slugs (incident names converted to kebab-case)
 * Used as keys in INCIDENT_IMAGES Record
 */
export type IncidentSlug = string;

/**
 * Type alias for outcome image keys
 * Keys follow pattern: ${incidentSlug}-${labelSlug}
 */
export type OutcomeImageKey = string;

/**
 * Extract unique incidents from all role card decks
 * Used by both imageMap.ts and generate-images.ts
 */
export function extractIncidentSlugs(): Map<
	string,
	{ incident: string; slug: string }
> {
	const incidents = new Map<string, { incident: string; slug: string }>();

	for (const cards of Object.values(ROLE_CARDS)) {
		for (const card of cards) {
			if (card.realWorldReference?.incident) {
				const incident = card.realWorldReference.incident;
				const slug = slugify(incident);

				if (!incidents.has(slug)) {
					incidents.set(slug, { incident, slug });
				}
			}
		}
	}

	return incidents;
}

/**
 * Auto-generate INCIDENT_IMAGES by extracting unique incidents from all card decks
 * This ensures cards sharing the same incident automatically resolve to the same image.
 *
 * Returns ~118 entries keyed by slugified incident name.
 */
function buildIncidentImages(): Record<IncidentSlug, string> {
	const incidents = extractIncidentSlugs();

	// Map slugified incidents to paths
	return Object.fromEntries(
		Array.from(incidents).map(([slug, { incident }]) => {
			return [slug, `/images/incidents/${slug}.webp`];
		}),
	);
}

/**
 * INCIDENT_IMAGES: Record<string, string>
 * Maps incident slugs to image paths
 * Example: "samsung-chatgpt-code-leak" → "/images/incidents/samsung-chatgpt-code-leak.webp"
 *
 * Auto-generated from card data — ~118 unique entries
 */
export const INCIDENT_IMAGES: Record<IncidentSlug, string> =
	buildIncidentImages();

/**
 * Extract unique HOS incident+label combinations
 * Used by both imageMap.ts and generate-images.ts
 */
export function extractHosOutcomePairs(): Map<
	string,
	{ incident: string; label: string; key: string }
> {
	const outcomes = new Map<
		string,
		{ incident: string; label: string; key: string }
	>();

	for (const card of HEAD_OF_SOMETHING_CARDS) {
		if (!card.realWorldReference?.incident) continue;

		const incident = card.realWorldReference.incident;
		const incidentSlug = slugify(incident);

		// Process onLeft label
		const leftLabelSlug = slugify(card.onLeft.label);
		const leftKey = `${incidentSlug}-${leftLabelSlug}`;
		if (!outcomes.has(leftKey)) {
			outcomes.set(leftKey, {
				incident,
				label: card.onLeft.label,
				key: leftKey,
			});
		}

		// Process onRight label
		const rightLabelSlug = slugify(card.onRight.label);
		const rightKey = `${incidentSlug}-${rightLabelSlug}`;
		if (!outcomes.has(rightKey)) {
			outcomes.set(rightKey, {
				incident,
				label: card.onRight.label,
				key: rightKey,
			});
		}
	}

	return outcomes;
}

/**
 * Auto-generate OUTCOME_IMAGES by extracting unique HOS incidents and their labels
 * Each incident+label combination gets one entry: ${incidentSlug}-${labelSlug}
 * Returns ~30 entries for HOS pilot (varies by unique incident+label combinations)
 */
function buildOutcomeImages(): Record<OutcomeImageKey, string> {
	const outcomes = extractHosOutcomePairs();

	return Object.fromEntries(
		Array.from(outcomes).map(([key, _]) => {
			return [key, `/images/outcomes/${key}.webp`];
		}),
	);
}

/**
 * OUTCOME_IMAGES: Record<string, string>
 * Maps incident-based outcome keys to image paths
 * Keys follow pattern: ${incidentSlug}-left and ${incidentSlug}-right
 * Pilot scope: ~36 entries for HOS incidents (2 per unique incident)
 */
export const OUTCOME_IMAGES: Record<OutcomeImageKey, string> =
	buildOutcomeImages();

/**
 * ARCHETYPE_IMAGES: Record<ArchetypeId, string>
 * Maps archetype IDs to image paths
 * 7 entries (including KIRK)
 */
export const ARCHETYPE_IMAGES: Record<ArchetypeId, string> = {
	PRAGMATIST: "/images/archetypes/pragmatist.webp",
	SHADOW_ARCHITECT: "/images/archetypes/shadow-architect.webp",
	DISRUPTOR: "/images/archetypes/disruptor.webp",
	CONSERVATIVE: "/images/archetypes/conservative.webp",
	BALANCED: "/images/archetypes/balanced.webp",
	CHAOS_AGENT: "/images/archetypes/chaos-agent.webp",
	KIRK: "/images/archetypes/kirk.webp",
};

/**
 * DEATH_IMAGES: Record<DeathType, string>
 * Maps death types to image paths
 * 7 entries (including KIRK)
 */
export const DEATH_IMAGES: Record<DeathType, string> = {
	BANKRUPT: "/images/deaths/bankrupt.webp",
	REPLACED_BY_SCRIPT: "/images/deaths/replaced-by-script.webp",
	CONGRESS: "/images/deaths/congress.webp",
	FLED_COUNTRY: "/images/deaths/fled-country.webp",
	PRISON: "/images/deaths/prison.webp",
	AUDIT_FAILURE: "/images/deaths/audit-failure.webp",
	KIRK: "/images/deaths/kirk.webp",
};

/**
 * Get incident image path, with fallback for missing entries
 */
export function getIncidentImagePath(incidentSlug: IncidentSlug): string {
	return INCIDENT_IMAGES[incidentSlug] ?? "/images/incidents/fallback.webp";
}

/**
 * Get outcome image path for a specific incident and label slug
 * Returns undefined if no asset exists (non-pilot role, missing row, or placeholder era)
 */
export function getOutcomeImagePath(
	incidentSlug: string,
	labelSlug: string,
): string | undefined {
	const key = `${incidentSlug}-${labelSlug}`;
	return OUTCOME_IMAGES[key];
}

/**
 * Get archetype image path
 * Returns undefined if archetypeId not found
 */
export function getArchetypeImagePath(
	archetypeId: ArchetypeId,
): string | undefined {
	return ARCHETYPE_IMAGES[archetypeId];
}

/**
 * Get death image path
 * Returns undefined if deathType not found
 */
export function getDeathImagePath(deathType: DeathType): string | undefined {
	return DEATH_IMAGES[deathType];
}
