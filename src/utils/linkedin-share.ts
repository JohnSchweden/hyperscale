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

	return `I just finished K-Maru as a ${roleTitle} — the AI no-win swipe game (Kobayashi energy, corporate liability).
Resilience: ${clampedResilience}% (${archetypeName}). Beat my score?
${url}
[NOTICE: Made for people who hate f*cking boring training]`;
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
 * Opens a LinkedIn share dialog, preferring the native app on mobile.
 * On mobile: tries the linkedin:// app scheme first; falls back to the web URL
 * after 1500ms if the app is not installed.
 * On desktop: opens the web URL in a new tab.
 */
export function openLinkedInShare(webUrl: string): void {
	const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
	if (!isMobile) {
		window.open(webUrl, "_blank", "noopener,noreferrer");
		return;
	}

	// Build linkedin:// deep-link from the share-offsite web URL
	try {
		const parsed = new URL(webUrl);
		const params = new URLSearchParams({
			mini: "true",
			url: parsed.searchParams.get("url") ?? "",
			title: parsed.searchParams.get("title") ?? "",
			summary: parsed.searchParams.get("summary") ?? "",
		});
		const appUrl = `linkedin://shareArticle?${params.toString()}`;
		window.location.href = appUrl;
	} catch {
		// If URL parsing fails just fall through to web fallback immediately
	}

	// Fallback: open web URL if the app didn't launch within 1.5s
	setTimeout(() => {
		if (!document.hidden) {
			window.open(webUrl, "_blank", "noopener,noreferrer");
		}
	}, 1500);
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
	const title = `K-Maru — ${archetype.name}`;
	return encodeLinkedInShareUrl(url, shareText, title);
}
