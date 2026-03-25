import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline/promises";
import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { ARCHETYPES } from "../data/archetypes";
import { ROLE_CARDS } from "../data/cards";
import { HEAD_OF_SOMETHING_CARDS } from "../data/cards/head-of-something";
import { DEATH_ENDINGS } from "../data/deathEndings";
import { slugifyIncident, slugifyLabel } from "../data/imageMap";
import type { ArchetypeId, DeathType } from "../types";

const apiKey = process.env.GEMINI_API_KEY;

// Parse CLI arguments
interface Args {
	scope?: string; // "cso" | "hos" | "incidents" | "outcomes" | "archetypes" | "deaths"
	dryRun: boolean;
	force: boolean;
	model: string;
	slug?: string;
	exportPrompts: boolean;
	incidentsOnly: boolean; // --incidents: only generate incident images
	outcomesOnly: boolean; // --outcomes: only generate outcome images
	replace?: string; // --replace <slug>: regenerate specific image, asks for approval
}

function parseArgs(): Args {
	const args: Args = {
		dryRun: false,
		force: false,
		model: "gemini-2.5-flash-image",
		exportPrompts: false,
		incidentsOnly: false,
		outcomesOnly: false,
	};

	for (let i = 2; i < process.argv.length; i++) {
		const arg = process.argv[i];
		if (arg === "--dry-run") args.dryRun = true;
		if (arg === "--force") args.force = true;
		if (arg === "--export-prompts") args.exportPrompts = true;
		if (arg === "--incidents") args.incidentsOnly = true;
		if (arg === "--outcomes") args.outcomesOnly = true;
		if (arg.startsWith("--scope")) {
			args.scope = process.argv[++i];
		}
		if (arg.startsWith("--model")) {
			args.model = process.argv[++i];
		}
		if (arg.startsWith("--slug")) {
			args.slug = process.argv[++i];
		}
		if (arg.startsWith("--replace")) {
			args.replace = process.argv[++i];
		}
	}

	return args;
}

interface IncidentEntry {
	incident: string;
	date: string;
	outcome: string;
	roles: string[];
}

/** CLI --scope role shorthands → ROLE_CARDS keys */
const ROLE_SCOPE_ALIASES: Record<string, string> = {
	cso: "CHIEF_SOMETHING_OFFICER",
	hos: "HEAD_OF_SOMETHING",
};

function resolveScopedRoleName(roleFilter?: string): string | undefined {
	if (!roleFilter) return undefined;
	return ROLE_SCOPE_ALIASES[roleFilter] ?? roleFilter;
}

/**
 * Extract unique incidents from card data across all (or specified) roles
 */
function extractIncidents(roleFilter?: string): Map<string, IncidentEntry> {
	const incidents = new Map<string, IncidentEntry>();
	const roleToMatch = resolveScopedRoleName(roleFilter);

	for (const [roleName, cards] of Object.entries(ROLE_CARDS)) {
		if (roleToMatch && roleName !== roleToMatch) {
			continue;
		}

		for (const card of cards) {
			if (!card.realWorldReference) continue;

			const { incident, date, outcome } = card.realWorldReference;
			const slug = slugifyIncident(incident);

			if (!incidents.has(slug)) {
				incidents.set(slug, {
					incident,
					date,
					outcome,
					roles: [],
				});
			}

			const entry = incidents.get(slug);
			if (!entry) continue;
			if (!entry.roles.includes(roleName)) {
				entry.roles.push(roleName);
			}
		}
	}

	return incidents;
}

/**
 * Get all archetype entries keyed by ArchetypeId
 */
function getArchetypes(): Array<{ id: ArchetypeId; entry: IncidentEntry }> {
	return Object.entries(ARCHETYPES).map(([id, arch]) => ({
		id: id as ArchetypeId,
		entry: {
			incident: arch.name,
			date: "",
			outcome: arch.description || "",
			roles: ["all"],
		},
	}));
}

/**
 * Get all death entries keyed by DeathType
 */
function getDeaths(): Array<{ id: DeathType; entry: IncidentEntry }> {
	return Object.entries(DEATH_ENDINGS).map(([id, death]) => ({
		id: id as DeathType,
		entry: {
			incident: death.title,
			date: "",
			outcome: death.description || "",
			roles: ["all"],
		},
	}));
}

// Meme-world aesthetic: deadpan disaster narration with meme references
const INCIDENT_MEME_FORMATS = [
	'Matrix "there is no spoon" but budget',
	'"I am once again asking" format but for governance',
	"Surprised Pikachu but for AI failures",
	'Woman pointing at screen "they did surgery on a grape" but corporate',
	"Drake Hotline Bling meme format but tech disasters",
	'"This is Fine" dog but in corporate server room',
	'"Task Failed Successfully" Windows dialog energy',
	"Loss.jpg crude stick figures but make it tech incident",
	"Philosoraptor questioning AI ethics",
	'"And then I took an arrow to the knee" but for tech debt',
	"Jurassic Park raptors in kitchen but data breach",
	"Matrix code rain but corporate emails",
	"Inception dream collapse but quarterly targets",
	'"You shall not pass" but for security audit',
];

function getRandomMemeFormat(formats: readonly string[]): string {
	return formats[Math.floor(Math.random() * formats.length)];
}

/**
 * Generate a prompt for an incident image
 */
function generateIncidentPrompt(entry: IncidentEntry): {
	prompt: string;
	source: PromptSource;
} {
	const memeFormat = getRandomMemeFormat(INCIDENT_MEME_FORMATS);
	const prompt =
		`Meme-world incident illustration. ` +
		`Real-world event: "${entry.incident}" (${entry.date}). ` +
		`Outcome: ${entry.outcome}. ` +
		`Meme format reference: ${memeFormat}. ` +
		`Style: Loss.jpg energy meets corporate slide deck meets internet meme. ` +
		`Tone: Serious presentation of absurd corporate reality. ` +
		`Deadpan narration of disaster. Roast energy. Like a LinkedIn post about failure. ` +
		`Absurd, memorable, shareable. No corporate photography language.`;
	return {
		prompt,
		source: {
			templateName: "Meme-world incident illustration",
			slots: {
				incident: entry.incident,
				date: entry.date,
				outcome: entry.outcome,
				roles: entry.roles.join(", "),
				memeFormat,
			},
		},
	};
}

/**
 * Extract outcomes for a specific incident from HOS cards using actual labels
 * Returns array of { label, labelSlug, lesson } for each choice
 * Deduplicates by labelSlug (same incident may appear in multiple cards)
 */
function extractOutcomesForIncident(
	incidentSlug: string,
): Array<{ label: string; labelSlug: string; lesson: string }> {
	const outcomes = new Map<
		string,
		{ label: string; labelSlug: string; lesson: string }
	>();

	for (const card of HEAD_OF_SOMETHING_CARDS) {
		if (!card.realWorldReference?.incident) continue;

		const cardIncidentSlug = slugifyIncident(card.realWorldReference.incident);
		if (cardIncidentSlug !== incidentSlug) continue;

		// onLeft choice
		const leftLabelSlug = slugifyLabel(card.onLeft.label);
		if (!outcomes.has(leftLabelSlug)) {
			outcomes.set(leftLabelSlug, {
				label: card.onLeft.label,
				labelSlug: leftLabelSlug,
				lesson: card.onLeft.lesson,
			});
		}

		// onRight choice
		const rightLabelSlug = slugifyLabel(card.onRight.label);
		if (!outcomes.has(rightLabelSlug)) {
			outcomes.set(rightLabelSlug, {
				label: card.onRight.label,
				labelSlug: rightLabelSlug,
				lesson: card.onRight.lesson,
			});
		}
	}

	return Array.from(outcomes.values());
}

/**
 * Extract HOS outcomes by label (not direction)
 * Returns a map of ${incidentSlug}-${labelSlug} → { incident, label, labelSlug, lesson }
 */
function extractHosOutcomesByLabel(): Map<
	string,
	{ incident: string; label: string; labelSlug: string; lesson: string }
> {
	const outcomes = new Map<
		string,
		{ incident: string; label: string; labelSlug: string; lesson: string }
	>();

	for (const card of HEAD_OF_SOMETHING_CARDS) {
		if (!card.realWorldReference?.incident) continue;

		const incident = card.realWorldReference.incident;
		const incidentSlug = slugifyIncident(incident);

		// Process onLeft
		const leftLabel = card.onLeft.label;
		const leftLabelSlug = slugifyLabel(leftLabel);
		const leftKey = `${incidentSlug}-${leftLabelSlug}`;
		if (!outcomes.has(leftKey)) {
			outcomes.set(leftKey, {
				incident,
				label: leftLabel,
				labelSlug: leftLabelSlug,
				lesson: card.onLeft.lesson,
			});
		}

		// Process onRight
		const rightLabel = card.onRight.label;
		const rightLabelSlug = slugifyLabel(rightLabel);
		const rightKey = `${incidentSlug}-${rightLabelSlug}`;
		if (!outcomes.has(rightKey)) {
			outcomes.set(rightKey, {
				incident,
				label: rightLabel,
				labelSlug: rightLabelSlug,
				lesson: card.onRight.lesson,
			});
		}
	}

	return outcomes;
}

// Meme-world outcome formats: absurd visual metaphors for corporate failure
const OUTCOME_MEME_FORMATS = [
	'"This is Fine" fire scene but corporate office',
	"Distracted boyfriend but with AI failures",
	"Drake approving/disapproving but AI disasters",
	"Woman yelling at cat but manager vs AI",
	'Matrix "there is no spoon" but budget',
	"Jurassic Park raptors in kitchen but data breach",
	'"Soon™" corporate meme format',
	"Loss.jpg crude but make it corporate",
	"Philosoraptor questioning life choices",
	'"And then I took an arrow to the knee" but for AI incidents',
	"Expanding brain meme but for compliance decisions",
	"Change my mind meme but for risk assessment",
	"Is this a pigeon? meme but for AI governance",
	"Mocking SpongeBob but for stakeholder meetings",
];

/**
 * Generate a prompt for an outcome image based on card lesson text
 */
function generateOutcomePrompt(
	label: string,
	lesson: string,
	incident: string,
): { prompt: string; source: PromptSource } {
	const memeFormat = getRandomMemeFormat(OUTCOME_MEME_FORMATS);
	const prompt =
		`Satirical illustration in meme format. ` +
		`Scene: "${lesson}" ` +
		`Choice: "${label}". ` +
		`Based on incident: ${incident}. ` +
		`Reference this exact meme format: ${memeFormat}. ` +
		`Tone: Deadpan. Matter-of-fact disaster narration. Like a LinkedIn post about failure. ` +
		`Expected outcome: corporate disaster. Peak corporate energy. ` +
		`No actual humor, just grim acceptance. Loss.jpg energy. ` +
		`Absurd, memorable, actually funny.`;
	return {
		prompt,
		source: {
			templateName: "Meme-world outcome illustration",
			slots: {
				label,
				lesson,
				incident,
				memeFormat,
			},
		},
	};
}

// Meme-world archetype formats: corporate character as meme
const ARCHETYPE_MEME_FORMATS = [
	"Corporate Clash Royale card design",
	"Among Us crewmate but corporate",
	"Pokemon trainer card but for corporate archetypes",
	"JoJo pose but make it board meeting",
	'Simpsons "Excellent" Smithers energy',
	"Family Guy cutaway gag but for this personality",
	"Rick and Morty interdimensional cable aesthetic",
	"Bojack Horseman melancholy corporate portrait",
	"Avatar the Last Airbender character card",
	"Starter pack meme format",
];

/**
 * Generate a prompt for an archetype portrait
 */
function generateArchetypePrompt(
	archetypeName: string,
	description: string,
): { prompt: string; source: PromptSource } {
	const memeFormat = getRandomMemeFormat(ARCHETYPE_MEME_FORMATS);
	const prompt =
		`Character portrait meeting meme energy. ` +
		`Archetype: "${archetypeName}". ` +
		`Personality: "${description}". ` +
		`Meme reference: ${memeFormat}. ` +
		`Tone: Self-important corporate character portrait, completely earnest about their archetype. ` +
		`Style: Satirical character card meets corporate headshot meets internet meme format. ` +
		`Deadpan seriousness about absurd corporate identity.`;
	return {
		prompt,
		source: {
			templateName: "Meme-world archetype portrait",
			slots: {
				archetypeName,
				description,
				memeFormat,
			},
		},
	};
}

// Meme-world death formats: catastrophic failure as meme
const DEATH_MEME_FORMATS = [
	'"This is Fine" dog watching office burn',
	"Succession Kendall death stare but for budget",
	"Thanos snap but corporate budget",
	'"You shall not pass" but for audit failure',
	"Kamehameha but it vaporizes the project budget",
	"Game Over screen but pixel art corporate",
	"Wasted GTA-style but for career",
	"Dark Souls YOU DIED but for quarterly targets",
	"Press F to pay respects but for the project",
	"Coffin dance meme but with stakeholders",
];

/**
 * Generate a prompt for a death/collapse image
 */
function generateDeathPrompt(
	deathTitle: string,
	description: string,
): { prompt: string; source: PromptSource } {
	const memeFormat = getRandomMemeFormat(DEATH_MEME_FORMATS);
	const prompt =
		`Catastrophic failure illustration. ` +
		`Death type: "${deathTitle}". ` +
		`Description: "${description}". ` +
		`Meme format: ${memeFormat}. ` +
		`Tone: Maximum dramatic irony. Peak "and then the budget died" energy. ` +
		`Deadpan presentation of absolute disaster. Loss.jpg energy. ` +
		`Absurd corporate apocalypse vibes.`;
	return {
		prompt,
		source: {
			templateName: "Meme-world death illustration",
			slots: {
				deathTitle,
				description,
				memeFormat,
			},
		},
	};
}

const CATEGORY_DIR: Record<string, string> = {
	incident: "public/images/incidents",
	outcome: "public/images/outcomes",
	archetype: "public/images/archetypes",
	death: "public/images/deaths",
};

interface PromptSource {
	templateName: string;
	slots: Record<string, string>;
}

interface ImageGenTask {
	category: "incident" | "outcome" | "archetype" | "death";
	slug: string;
	prompt: string;
	source: PromptSource;
}

/**
 * Export all tasks as annotated markdown files under scripts/prompts/
 * One file per category: incidents.md, outcomes.md, archetypes.md, deaths.md
 */
function exportPromptsToMarkdown(tasks: ImageGenTask[], scope: string): void {
	const outDir = path.join(process.cwd(), "scripts/prompts");
	fs.mkdirSync(outDir, { recursive: true });

	const byCategory = new Map<string, ImageGenTask[]>();
	for (const task of tasks) {
		const list = byCategory.get(task.category) ?? [];
		list.push(task);
		byCategory.set(task.category, list);
	}

	const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

	for (const [category, categoryTasks] of byCategory) {
		const lines: string[] = [
			`# Image Prompts — ${category}s`,
			``,
			`**Generated:** ${timestamp}  `,
			`**Scope:** ${scope}  `,
			`**Count:** ${categoryTasks.length} prompts  `,
			`**Model:** gemini-2.5-flash-image  `,
			``,
			`---`,
			``,
		];

		for (const task of categoryTasks) {
			lines.push(`## \`${task.slug}\``);
			lines.push(``);
			lines.push(`**Template:** ${task.source.templateName}  `);
			for (const [key, value] of Object.entries(task.source.slots)) {
				lines.push(`**${key}:** ${value || "_(empty)_"}  `);
			}
			lines.push(``);
			lines.push(`**Full prompt:**`);
			lines.push(``);
			lines.push(`> ${task.prompt}`);
			lines.push(``);
			lines.push(`---`);
			lines.push(``);
		}

		const outPath = path.join(outDir, `${category}s.md`);
		fs.writeFileSync(outPath, lines.join("\n"));
		console.log(
			`Saved: scripts/prompts/${category}s.md (${categoryTasks.length} entries)`,
		);
	}

	// Write index
	const indexLines = [
		`# Prompt Preview Index`,
		``,
		`Generated: ${timestamp} | Scope: ${scope}`,
		``,
		`| File | Count |`,
		`|------|-------|`,
	];
	for (const [category, categoryTasks] of byCategory) {
		indexLines.push(
			`| [${category}s.md](./${category}s.md) | ${categoryTasks.length} |`,
		);
	}
	indexLines.push(
		``,
		`Run \`bun scripts/generate-images.ts --export-prompts\` to regenerate.`,
	);
	fs.writeFileSync(path.join(outDir, "INDEX.md"), indexLines.join("\n"));
	console.log(`Saved: scripts/prompts/INDEX.md`);
}

/**
 * Convert base64 image to WebP via sharp
 */
async function convertToWebP(
	base64ImageData: string,
	outputPath: string,
): Promise<number> {
	// Decode base64 to buffer
	const buffer = Buffer.from(base64ImageData, "base64");

	// Resize and convert to WebP
	const webpBuffer = await sharp(buffer)
		.resize(800, 800, {
			fit: "inside",
			withoutEnlargement: true,
		})
		.webp({ quality: 75 })
		.toBuffer();

	// Ensure directory exists
	const dir = path.dirname(outputPath);
	fs.mkdirSync(dir, { recursive: true });

	// Write file
	fs.writeFileSync(outputPath, webpBuffer);

	return webpBuffer.length;
}

/**
 * Generate all images for a task
 */
async function generateAndSaveImage(
	task: ImageGenTask,
	ai: GoogleGenAI | null,
	args: Args,
): Promise<{
	status: "success" | "skipped" | "failed" | "dry-run";
	message: string;
}> {
	const outputPath = path.join(
		process.cwd(),
		CATEGORY_DIR[task.category],
		`${task.slug}.webp`,
	);

	// Skip if exists (never auto-regenerate, use --replace for that)
	// --replace handles the regeneration explicitly
	if (fs.existsSync(outputPath)) {
		return {
			status: "skipped",
			message: `Skipped (exists): ${task.slug}`,
		};
	}

	// Dry-run: just print prompt
	if (args.dryRun) {
		console.log(`\n[${task.category}] ${task.slug}`);
		console.log(`Prompt: ${task.prompt.substring(0, 120)}...`);
		return {
			status: "dry-run",
			message: `Dry-run: ${task.slug}`,
		};
	}

	// Check API key
	if (!ai) {
		return {
			status: "failed",
			message: `No API key: ${task.slug}`,
		};
	}

	try {
		// Call Gemini API
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		// biome-ignore lint/suspicious/noExplicitAny: External Google AI SDK type inference
		const response = await (ai.models as any).generateContent({
			model: args.model,
			contents: [{ parts: [{ text: task.prompt }] }],
			config: {
				responseModalities: ["IMAGE"],
				imageConfig: { aspectRatio: "16:9" },
				safetySettings: [
					{
						category: "HARM_CATEGORY_HARASSMENT",
						threshold: "BLOCK_ONLY_HIGH",
					},
					{
						category: "HARM_CATEGORY_HATE_SPEECH",
						threshold: "BLOCK_ONLY_HIGH",
					},
					{
						category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
						threshold: "BLOCK_ONLY_HIGH",
					},
					{
						category: "HARM_CATEGORY_DANGEROUS_CONTENT",
						threshold: "BLOCK_ONLY_HIGH",
					},
				],
			},
		});

		// Check finish reason for safety blocks
		const finishReason = response.candidates?.[0]?.finishReason;
		if (finishReason === "SAFETY") {
			return {
				status: "failed",
				message: `Safety filter blocked: ${task.slug}`,
			};
		}

		// Extract base64 image
		const base64Image =
			response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
		if (!base64Image) {
			return {
				status: "failed",
				message: `No image in response: ${task.slug}`,
			};
		}

		// Convert to WebP
		const fileSize = await convertToWebP(base64Image, outputPath);

		return {
			status: "success",
			message: `Generated: ${task.slug} (${fileSize} bytes)`,
		};
	} catch (error) {
		const err = error as Error;
		// Handle rate limit
		if (err.message?.includes("429")) {
			console.warn(`Rate limit hit, waiting 60s...`);
			await new Promise((r) => setTimeout(r, 60000));
			// Retry once
			return generateAndSaveImage(task, ai, args);
		}

		return {
			status: "failed",
			message: `Error: ${task.slug} — ${err.message}`,
		};
	}
}

/**
 * Main execution
 */
async function main() {
	const args = parseArgs();

	// Check API key (unless dry-run or export-prompts)
	if (!args.dryRun && !args.exportPrompts && !apiKey) {
		console.error(
			"ERROR: GEMINI_API_KEY not set. Set it to enable image generation.",
		);
		process.exit(1);
	}

	const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

	console.log(`Generating images...`);
	console.log(`  Model: ${args.model}`);
	console.log(`  Scope: ${args.scope || "all"}`);
	console.log(
		`  Incidents: ${args.incidentsOnly ? "only" : args.outcomesOnly ? "excluded" : "included"}`,
	);
	console.log(
		`  Outcomes: ${args.outcomesOnly ? "only" : args.incidentsOnly ? "excluded" : "included"}`,
	);
	console.log(`  Force: ${args.force}`);
	console.log(`  Dry-run: ${args.dryRun}`);
	if (args.replace) console.log(`  Replace: ${args.replace}`);

	const tasks: ImageGenTask[] = [];

	// Handle --replace: regenerate specific image with approval
	if (args.replace) {
		const replaceSlug = args.replace;

		// Determine category and prompt based on slug pattern
		const isOutcome =
			replaceSlug.includes("-") &&
			!replaceSlug.startsWith("pragmatist") &&
			!replaceSlug.startsWith("shadow") &&
			!replaceSlug.startsWith("disruptor") &&
			!replaceSlug.startsWith("conservative") &&
			!replaceSlug.startsWith("balanced") &&
			!replaceSlug.startsWith("chaos") &&
			!replaceSlug.startsWith("kirk") &&
			!replaceSlug.startsWith("bankrupt") &&
			!replaceSlug.startsWith("replaced") &&
			!replaceSlug.startsWith("congress") &&
			!replaceSlug.startsWith("fled") &&
			!replaceSlug.startsWith("prison") &&
			!replaceSlug.startsWith("audit");

		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		const answer = await rl.question(
			`\n⚠️  Replace image "${replaceSlug}"? This will regenerate it. (yes/no): `,
		);
		rl.close();

		if (answer.toLowerCase() !== "yes") {
			console.log("Cancelled.");
			process.exit(0);
		}

		// Generate replacement task
		if (isOutcome) {
			// It's an outcome - extract from HOS cards
			const [_incidentSlug, labelSlug] = replaceSlug.split("-").slice(-2);
			const fullIncidentSlug = replaceSlug.replace(`-${labelSlug}`, "");
			const incidents = extractIncidents("hos");
			const incident = incidents.get(fullIncidentSlug);
			if (incident) {
				// Find the card with this label
				for (const card of HEAD_OF_SOMETHING_CARDS) {
					if (!card.realWorldReference?.incident) continue;
					const cardSlug = slugifyIncident(card.realWorldReference.incident);
					if (cardSlug === fullIncidentSlug) {
						const cardLabelSlug = slugifyLabel(card.onLeft.label);
						if (cardLabelSlug === labelSlug) {
							const { prompt, source } = generateOutcomePrompt(
								card.onLeft.label,
								card.onLeft.lesson,
								card.realWorldReference.incident,
							);
							tasks.push({
								category: "outcome",
								slug: replaceSlug,
								prompt,
								source,
							});
							break;
						}
						const cardLabelSlugRight = slugifyLabel(card.onRight.label);
						if (cardLabelSlugRight === labelSlug) {
							const { prompt, source } = generateOutcomePrompt(
								card.onRight.label,
								card.onRight.lesson,
								card.realWorldReference.incident,
							);
							tasks.push({
								category: "outcome",
								slug: replaceSlug,
								prompt,
								source,
							});
							break;
						}
					}
				}
			}
		} else {
			// It's an incident or archetype/death
			const incidents = extractIncidents();
			const incident = incidents.get(replaceSlug);
			if (incident) {
				const { prompt, source } = generateIncidentPrompt(incident);
				tasks.push({ category: "incident", slug: replaceSlug, prompt, source });
			} else if (
				replaceSlug.startsWith("pragmatist") ||
				replaceSlug.startsWith("shadow") ||
				replaceSlug.startsWith("disruptor") ||
				replaceSlug.startsWith("conservative") ||
				replaceSlug.startsWith("balanced") ||
				replaceSlug.startsWith("chaos") ||
				replaceSlug.startsWith("kirk")
			) {
				for (const { id, entry } of getArchetypes()) {
					if (id.toLowerCase().replace("_", "-") === replaceSlug) {
						const { prompt, source } = generateArchetypePrompt(
							entry.incident,
							entry.outcome,
						);
						tasks.push({
							category: "archetype",
							slug: id.toLowerCase().replace("_", "-"),
							prompt,
							source,
						});
						break;
					}
				}
			}
		}

		if (tasks.length === 0) {
			console.error(`Could not find prompt for: ${replaceSlug}`);
			process.exit(1);
		}
	} else if (args.slug) {
		// If scoped to single slug
		const slugifiedSlug = slugifyIncident(args.slug);
		const incidents = extractIncidents();
		const incident = incidents.get(slugifiedSlug);
		if (incident) {
			// Generate incident task (unless --outcomesOnly)
			if (!args.outcomesOnly) {
				const { prompt, source } = generateIncidentPrompt(incident);
				tasks.push({
					category: "incident",
					slug: slugifiedSlug,
					prompt,
					source,
				});
			}

			// Generate outcome tasks for this specific incident (unless --incidentsOnly)
			if (!args.incidentsOnly) {
				const outcomes = extractOutcomesForIncident(slugifiedSlug);
				for (const outcome of outcomes) {
					const { prompt, source } = generateOutcomePrompt(
						outcome.label,
						outcome.lesson,
						incident.incident,
					);
					tasks.push({
						category: "outcome",
						slug: `${slugifiedSlug}-${outcome.labelSlug}`,
						prompt,
						source,
					});
				}
			}
		} else {
			console.error(`Incident not found: ${args.slug}`);
			process.exit(1);
		}
	} else if (
		args.scope === "cso" ||
		args.scope === "hos" ||
		args.scope === "incidents" ||
		args.scope === undefined
	) {
		const roleScope =
			args.scope === "cso" || args.scope === "hos" ? args.scope : undefined;
		const incidents = extractIncidents(roleScope);
		for (const [slug, entry] of incidents) {
			const { prompt, source } = generateIncidentPrompt(entry);
			tasks.push({ category: "incident", slug, prompt, source });
		}
	}

	// Single --slug: only that incident (do not also run full "all" categories)
	// But handle --incidentsOnly and --outcomesOnly for general scope
	if (!args.slug) {
		// Incidents: Generate only incident images (if --incidents or no --outcomes)
		if (
			!args.outcomesOnly &&
			(args.incidentsOnly ||
				args.scope === "incidents" ||
				args.scope === "hos" ||
				args.scope === "cso" ||
				args.scope === undefined)
		) {
			const roleScope =
				args.scope === "cso" || args.scope === "hos" ? args.scope : undefined;
			const incidents = extractIncidents(roleScope);
			for (const [slug, entry] of incidents) {
				const { prompt, source } = generateIncidentPrompt(entry);
				tasks.push({ category: "incident", slug, prompt, source });
			}
		}

		// Outcomes: Generate only outcome images (if --outcomes or no --incidents)
		if (
			!args.incidentsOnly &&
			(args.outcomesOnly || args.scope === "outcomes" || args.scope === "hos")
		) {
			const hosOutcomes = extractHosOutcomesByLabel();
			for (const [key, outcome] of hosOutcomes) {
				const { prompt, source } = generateOutcomePrompt(
					outcome.label,
					outcome.lesson,
					outcome.incident,
				);
				tasks.push({
					category: "outcome",
					slug: key, // This is ${incidentSlug}-${labelSlug}
					prompt,
					source,
				});
			}
		}

		// Archetypes
		if (
			!args.incidentsOnly &&
			!args.outcomesOnly &&
			(!args.scope || args.scope === "archetypes")
		) {
			for (const { id, entry } of getArchetypes()) {
				const { prompt, source } = generateArchetypePrompt(
					entry.incident,
					entry.outcome,
				);
				tasks.push({ category: "archetype", slug: id, prompt, source });
			}
		}

		// Deaths
		if (
			!args.incidentsOnly &&
			!args.outcomesOnly &&
			(!args.scope || args.scope === "deaths")
		) {
			for (const { id, entry } of getDeaths()) {
				const { prompt, source } = generateDeathPrompt(
					entry.incident,
					entry.outcome,
				);
				tasks.push({ category: "death", slug: id, prompt, source });
			}
		}
	}

	// Export prompts to markdown and exit (no image generation)
	if (args.exportPrompts) {
		console.log(`\nExporting ${tasks.length} prompts to scripts/prompts/...`);
		exportPromptsToMarkdown(tasks, args.scope || "all");
		return;
	}

	console.log(`\nGenerating ${tasks.length} images...`);

	const results = {
		success: 0,
		skipped: 0,
		failed: 0,
		dryRun: 0,
	};

	// Human checkpoint flag
	let checkpointShown = false;

	for (let i = 0; i < tasks.length; i++) {
		const task = tasks[i];
		const result = await generateAndSaveImage(task, ai, args);

		if (result.status === "success") {
			results.success++;
			console.log(`[${i + 1}/${tasks.length}] ✓ ${result.message}`);

			// Human checkpoint: only after FIRST INCIDENT generation (not outcomes, not --force, not --replace)
			if (
				!checkpointShown &&
				!args.dryRun &&
				!args.force &&
				!args.replace &&
				task.category === "incident"
			) {
				const outputPath = path.join(
					process.cwd(),
					CATEGORY_DIR[task.category],
					`${task.slug}.webp`,
				);
				const rl = readline.createInterface({
					input: process.stdin,
					output: process.stdout,
				});
				const answer = await rl.question(
					`\n🔍 First image generated: ${outputPath}\n` +
						`Review the image quality and art direction.\n` +
						`Continue with remaining ${tasks.length - i - 1} images? (yes/no): `,
				);
				rl.close();
				if (answer.toLowerCase() !== "yes" && answer.toLowerCase() !== "y") {
					console.log(
						"Aborted. Adjust prompt templates and re-run with --force or --replace",
					);
					process.exit(0);
				}
				checkpointShown = true;
			}
		} else if (result.status === "skipped") {
			results.skipped++;
			console.log(`[${i + 1}/${tasks.length}] ⊘ ${result.message}`);
		} else if (result.status === "dry-run") {
			results.dryRun++;
		} else {
			results.failed++;
			console.warn(`[${i + 1}/${tasks.length}] ✗ ${result.message}`);
		}

		// Rate limiting: 7-second delay between requests
		if (i < tasks.length - 1 && result.status === "success") {
			await new Promise((r) => setTimeout(r, 7000));
		}
	}

	// Summary
	console.log(`\n=== Summary ===`);
	console.log(`Generated: ${results.success}`);
	console.log(`Skipped: ${results.skipped}`);
	console.log(`Failed: ${results.failed}`);
	if (results.dryRun > 0) console.log(`Dry-run: ${results.dryRun}`);

	// Report cross-role sharing
	if (!args.dryRun && !args.slug) {
		const incidents = extractIncidents(
			args.scope === "cso" || args.scope === "hos" ? args.scope : undefined,
		);
		const shared = Array.from(incidents.entries())
			.filter(([_, entry]) => entry.roles.length > 1)
			.sort((a, b) => b[1].roles.length - a[1].roles.length);

		if (shared.length > 0) {
			console.log(`\n=== Shared Incidents ===`);
			for (const [slug, entry] of shared) {
				console.log(`  ${slug}: ${entry.roles.join(", ")}`);
			}
		}
	}
}

main().catch(console.error);
