import { ROLE_LABELS } from "../data/roles";
import type { Archetype, RoleType } from "../types";

/**
 * Formats share text for LinkedIn post.
 * Returns: "I just faced the Kobayashi Maru as a [ROLE_TITLE]. My Resilience Score: [XX]% ([ARCHETYPE]).
 * Can you beat my score? Try the AI governance simulator: [URL]"
 */
export function formatShareText(
	role: RoleType,
	archetypeName: string,
	resilience: number,
	gameUrl?: string,
): string {
	const roleTitle = ROLE_LABELS[role];
	const clampedResilience = Math.max(0, Math.min(100, Math.round(resilience)));
	const baseText = `I just faced the Kobayashi Maru as a ${roleTitle}. My Resilience Score: ${clampedResilience}% (${archetypeName}).`;
	const url = gameUrl ?? "https://km.swipestrategies.com";
	return `${baseText} Can you beat my score? Try the AI governance simulator: ${url}`;
}

/**
 * Encodes the current URL for LinkedIn's native share endpoint.
 * LinkedIn handles the share text via og:description meta tags, not URL params.
 * Optionally includes a summary parameter for pre-filled share text.
 * Also includes title for better LinkedIn preview.
 */
export function encodeLinkedInShareUrl(
	currentUrl: string,
	summary?: string,
	title?: string,
): string {
	const encodedUrl = encodeURIComponent(currentUrl);
	const encodedSummary = summary ? encodeURIComponent(summary) : "";
	const encodedTitle = title ? encodeURIComponent(title) : "";

	let url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
	if (encodedTitle) {
		url += `&title=${encodedTitle}`;
	}
	if (encodedSummary) {
		url += `&summary=${encodedSummary}`;
	}
	return url;
}

/**
 * Combines formatShareText and encodeLinkedInShareUrl for convenience.
 * Returns the complete LinkedIn share URL with encoded parameters.
 */
export function getShareUrl(
	role: RoleType,
	archetype: Pick<Archetype, "name">,
	resilience: number,
	currentUrl?: string,
): string {
	const url =
		currentUrl ?? (typeof window !== "undefined" ? window.location.href : "");
	const shareText = formatShareText(role, archetype.name, resilience, url);
	const title = `Kobayashi Maru - ${archetype.name} Archetype`;
	return encodeLinkedInShareUrl(url, shareText, title);
}
