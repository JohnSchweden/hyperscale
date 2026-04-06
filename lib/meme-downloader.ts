import * as fs from "node:fs";
import http from "node:http";
import https from "node:https";
import * as path from "node:path";
import templates from "../data/templates/meme-templates.json";

const CACHE_DIR = path.join(process.cwd(), "data/templates/cache");

// Types
export interface MemeTemplate {
	id: string;
	name: string;
	url: string;
	primary?: boolean;
}

export type DeathType =
	| "BANKRUPT"
	| "REPLACED_BY_SCRIPT"
	| "CONGRESS"
	| "FLED_COUNTRY"
	| "PRISON"
	| "AUDIT_FAILURE"
	| "KIRK";
export type Archetype =
	| "PRAGMATIST"
	| "SHADOW_ARCHITECT"
	| "DISRUPTOR"
	| "CONSERVATIVE"
	| "BALANCED"
	| "CHAOS_AGENT"
	| "KIRK";

export type FeedbackOutcome =
	| "shield-the-team"
	| "give-names-to-compliance"
	| "push-back-on-deadline"
	| "push-team-harder"
	| "side-with-engineering"
	| "side-with-auditors"
	| "protect-the-team"
	| "cooperate-with-investigation"
	| "defend-delegation"
	| "admit-oversight-failure"
	| "tell-leadership-no"
	| "promise-the-impossible"
	| "promote-best-performer"
	| "promote-politically-connected"
	| "pull-for-patching"
	| "continue-development"
	| "force-security-fix"
	| "let-it-slide"
	| "defend-and-take-heat"
	| "blame-data-scientist"
	| "start-immediately"
	| "delay-until-next-quarter"
	| "delay-and-comply"
	| "refuse-and-fight"
	| "allow-claude-use"
	| "force-compliance"
	| "testify-honestly"
	| "minimize-risks-under-oath"
	| "address-issues-immediately"
	| "encourage-silence"
	| "volunteer-for-pilot"
	| "fight-through-hr"
	| "document-honestly"
	| "inflate-the-metrics"
	| "take-the-blame"
	| "name-the-data-scientist"
	| "provide-full-documentation"
	| "claim-poor-record-keeping";

// =============================================================================
// DOWNLOAD FUNCTIONS
// =============================================================================

/**
 * Download image from URL and return buffer
 */
function downloadImage(url: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const protocol = url.startsWith("https") ? https : http;

		protocol
			.get(url, (res) => {
				// Handle redirect
				if (res.statusCode === 301 || res.statusCode === 302) {
					const redirectUrl = res.headers.location;
					if (redirectUrl) {
						downloadImage(redirectUrl).then(resolve).catch(reject);
						return;
					}
					reject(new Error(`Redirect with no location: ${res.statusCode}`));
					return;
				}

				if (res.statusCode !== 200) {
					reject(new Error(`Failed to fetch: ${res.statusCode}`));
					return;
				}

				const chunks: Buffer[] = [];
				res.on("data", (chunk) => chunks.push(chunk));
				res.on("end", () => resolve(Buffer.concat(chunks)));
				res.on("error", reject);
			})
			.on("error", reject);
	});
}

/**
 * Download and cache a meme - returns local file path
 * Uses the /s/meme/ URL format which returns direct image downloads
 */
export async function downloadMeme(
	templateId: string,
	url: string,
): Promise<string> {
	// Ensure cache dir exists
	fs.mkdirSync(CACHE_DIR, { recursive: true });

	// Determine file extension from URL or default to jpg
	let ext = url.split(".").pop()?.split("?")[0] || "jpg";
	if (!["jpg", "jpeg", "png", "gif", "webp"].includes(ext.toLowerCase())) {
		ext = "jpg";
	}

	// Create sanitized filename from templateId
	const safeId = templateId.toLowerCase().replace(/[^a-z0-9-]/g, "-");
	const cachePath = path.join(CACHE_DIR, `${safeId}.${ext}`);

	// Return cached if exists
	if (fs.existsSync(cachePath)) {
		return cachePath;
	}

	// Convert template URL to direct image URL format
	// Original: https://imgflip.com/memetemplate/Template-Name
	// Working:  https://imgflip.com/s/meme/Template-Name.jpg
	let imageUrl = url;

	// If it's a template URL, convert to direct image format
	if (url.includes("memetemplate") || url.includes("memegenerator")) {
		// Extract template name from URL
		const match = url.match(/(memetemplate|memegenerator)\/([^/?]+)/);
		if (match) {
			const templateName = match[2].split("/")[0]; // Get first part before any subpath
			imageUrl = `https://imgflip.com/s/meme/${templateName}.jpg`;
		}
	}

	// Download and cache
	const buffer = await downloadImage(imageUrl);
	fs.writeFileSync(cachePath, buffer);

	return cachePath;
}

// =============================================================================
// LOOKUP FUNCTIONS
// =============================================================================

/**
 * Get death meme template
 */
export function getDeathTemplate(
	deathType: DeathType,
): MemeTemplate | undefined {
	const deaths = templates.deaths as Record<
		string,
		{ static: MemeTemplate; gif: MemeTemplate }
	>;
	const options = deaths[deathType];
	if (!options) return undefined;

	const primary = options.static.primary
		? options.static
		: options.gif.primary
			? options.gif
			: undefined;
	return primary || options.static;
}

/**
 * Get archetype meme template
 */
export function getArchetypeTemplate(
	archetype: Archetype,
): MemeTemplate | undefined {
	const archetypes = templates.archetypes as Record<
		string,
		{ static: MemeTemplate; gif: MemeTemplate }
	>;
	const options = archetypes[archetype];
	if (!options) return undefined;

	const primary = options.static.primary
		? options.static
		: options.gif.primary
			? options.gif
			: undefined;
	return primary || options.static;
}

/**
 * Download death meme and return local path
 */
export async function getDeathMemePath(
	deathType: DeathType,
): Promise<string | null> {
	const template = getDeathTemplate(deathType);
	if (!template) return null;

	return downloadMeme(template.id, template.url);
}

/**
 * Download archetype meme and return local path
 */
export async function getArchetypeMemePath(
	archetype: Archetype,
): Promise<string | null> {
	const template = getArchetypeTemplate(archetype);
	if (!template) return null;

	return downloadMeme(template.id, template.url);
}

/**
 * Get death meme template GIF
 */
export function getDeathGifTemplate(
	deathType: DeathType,
): MemeTemplate | undefined {
	const deaths = templates.deaths as Record<
		string,
		{ static: MemeTemplate; gif: MemeTemplate }
	>;
	const options = deaths[deathType];
	if (!options) return undefined;

	return options.gif;
}

/**
 * Get archetype meme template GIF
 */
export function getArchetypeGifTemplate(
	archetype: Archetype,
): MemeTemplate | undefined {
	const archetypes = templates.archetypes as Record<
		string,
		{ static: MemeTemplate; gif: MemeTemplate }
	>;
	const options = archetypes[archetype];
	if (!options) return undefined;

	return options.gif;
}

/**
 * Download death GIF and return local path
 */
export async function getDeathGifPath(
	deathType: DeathType,
): Promise<string | null> {
	const template = getDeathGifTemplate(deathType);
	if (!template) return null;

	return downloadMeme(template.id, template.url);
}

/**
 * Download archetype GIF and return local path
 */
export async function getArchetypeGifPath(
	archetype: Archetype,
): Promise<string | null> {
	const template = getArchetypeGifTemplate(archetype);
	if (!template) return null;

	return downloadMeme(template.id, template.url);
}

// =============================================================================
// FEEDBACK OUTCOME FUNCTIONS
// =============================================================================

/**
 * Get feedback outcome meme template
 */
export function getFeedbackOutcomeTemplate(
	outcome: FeedbackOutcome,
): MemeTemplate | undefined {
	const outcomes = templates.feedbackOutcomes as Record<string, MemeTemplate>;
	return outcomes[outcome];
}

/**
 * Download feedback outcome meme and return local path
 */
export async function getFeedbackOutcomeMemePath(
	outcome: FeedbackOutcome,
): Promise<string | null> {
	const template = getFeedbackOutcomeTemplate(outcome);
	if (!template) return null;

	return downloadMeme(template.id, template.url);
}
