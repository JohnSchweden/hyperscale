import { ROLE_LABELS } from "../data/roles";
import type { Archetype, RoleType } from "../types";

/**
 * Formats share text for LinkedIn post.
 * Returns formatted text with role, archetype, resilience score, and URL
 */
export function formatShareText(
	role: RoleType,
	archetypeName: string,
	resilience: number,
	gameUrl?: string,
): string {
	const roleTitle = ROLE_LABELS[role];
	const clampedResilience = Math.max(0, Math.min(100, Math.round(resilience)));
	const url = gameUrl ?? "https://k-maru-seven.vercel.app/";

	return `I just faced the AI Kobayashi Maru as a ${roleTitle}.

My Resilience Score: ${clampedResilience}% (${archetypeName}). Can you beat my score?

Try the No-Win Simulation and swipe your way through the AI Singularity.

It's not about passing; it's about discovering who you are when the system collapses.

[NOTICE: Made for people who hate f*cking boring training]

${url}`;
}

/**
 * Encodes the current URL for LinkedIn's native share endpoint.
 * Note: LinkedIn share-offsite only uses og:title and og:description meta tags,
 * URL parameters are ignored. For dynamic content, we generate a shareable URL
 * that includes the archetype info as a query parameter (for tracking/analytics).
 */
export function encodeLinkedInShareUrl(
	currentUrl: string,
	summary?: string,
	title?: string,
): string {
	const encodedUrl = encodeURIComponent(currentUrl);

	// LinkedIn share-offsite endpoint - only the URL parameter is actually used
	// The endpoint will fetch og: meta tags from the page
	let url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

	// Add tracking parameters (not displayed by LinkedIn but useful for analytics)
	// These won't affect the share dialog display but help track shares
	if (title) {
		url += `&title=${encodeURIComponent(title)}`;
	}
	if (summary) {
		url += `&summary=${encodeURIComponent(summary)}`;
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
