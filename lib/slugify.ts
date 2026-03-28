/**
 * Convert any text to a URL-safe slug (kebab-case).
 * e.g., "Shield the team" → "shield-the-team"
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}
