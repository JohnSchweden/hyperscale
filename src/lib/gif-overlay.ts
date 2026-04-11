import templates from "../data/templates/gif-templates.json";

/**
 * GIF/Meme Overlay Service
 *
 * Provides functionality to overlay text on meme templates using the text-on-gif package.
 * Supports both local file processing and URL-based templates.
 *
 * Usage:
 *   import { addTextToGif, getTemplateById, getTemplatesByPattern } from './lib/gif-overlay';
 *
 *   // Add text to a template
 *   const buffer = await addTextToGif({
 *     templateId: 'surprised-pikachu',
 *     text: 'When the model ignores obvious warnings',
 *     position: 'bottom'
 *   });
 */

import * as fs from "node:fs";
import * as https from "node:https";
import * as path from "node:path";

/**
 * Template interface from template database
 */
export interface TemplateEntry {
	id: string;
	name: string;
	text_zones: number;
	best_for: string[];
	imgflip_id?: string;
}

/**
 * Overlay configuration options
 */
export interface OverlayOptions {
	/** Template ID from the database */
	templateId: string;
	/** Text to overlay */
	text: string;
	/** Font size (default: 24px) */
	fontSize?: string;
	/** Font color (default: white) */
	fontColor?: string;
	/** Text stroke/outline color (default: black) */
	strokeColor?: string;
	/** Stroke width (default: 2) */
	strokeWidth?: number;
	/** Vertical position: top, middle, bottom (default: bottom) */
	position?: "top" | "middle" | "bottom";
	/** Horizontal alignment: left, center, right (default: center) */
	alignment?: "left" | "center" | "right";
	/** Return as buffer (true) or write to file (false) */
	getAsBuffer?: boolean;
	/** Output file path (if getAsBuffer is false) */
	outputPath?: string;
	/** Custom font style (default: calibri) */
	fontStyle?: string;
}

/**
 * Template lookup result
 */
export interface TemplateInfo {
	id: string;
	name: string;
	textZones: number;
	bestFor: string[];
	category: string;
	imgflipId?: string;
}

/**
 * Pattern matching result
 */
export interface PatternMatch {
	id: string;
	name: string;
	category: string;
}

/**
 * Get all templates from a specific category
 */
export function getTemplatesByCategory(category: string): TemplateInfo[] {
	const categoryTemplates = (
		templates.templates as Record<string, TemplateEntry[]>
	)[category];
	if (!categoryTemplates) return [];

	return categoryTemplates.map((t) => ({
		id: t.id,
		name: t.name,
		textZones: t.text_zones,
		bestFor: t.best_for,
		category,
		imgflipId: t.imgflip_id,
	}));
}

/**
 * Find a template by ID across all categories
 */
export function getTemplateById(id: string): TemplateInfo | undefined {
	for (const [category, categoryTemplates] of Object.entries(
		templates.templates,
	)) {
		const found = (categoryTemplates as TemplateEntry[]).find(
			(t) => t.id === id,
		);
		if (found) {
			return {
				id: found.id,
				name: found.name,
				textZones: found.text_zones,
				bestFor: found.best_for,
				category,
				imgflipId: found.imgflip_id,
			};
		}
	}
	return undefined;
}

/**
 * Get templates by incident pattern
 */
export function getTemplatesByPattern(pattern: string): PatternMatch[] {
	const mapping = templates.incident_mapping as Record<string, string[]>;
	const templateIds = mapping[pattern] || [];

	return templateIds.map((id) => {
		const template = getTemplateById(id);
		return {
			id,
			name: template?.name || id,
			category: template?.category || "unknown",
		};
	});
}

/**
 * Get all available template IDs
 */
export function getAllTemplateIds(): string[] {
	// Use Set for O(1) lookups (js-set-map-lookups)
	const idSet = new Set<string>();
	for (const category of Object.values(templates.templates)) {
		for (const t of category as TemplateEntry[]) {
			idSet.add(t.id);
		}
	}
	return Array.from(idSet);
}

/**
 * Get template count
 */
export function getTemplateCount(): number {
	return getAllTemplateIds().length;
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
	return Object.keys(templates.templates);
}

/**
 * Get Imgflip image URL for a template
 * Uses Imgflip's template ID system
 */
export function getTemplateImageUrl(templateId: string): string {
	const template = getTemplateById(templateId);
	if (template?.imgflipId) {
		return `https://i.imgflip.com/${template.imgflipId}.jpg`;
	}
	// Fallback: common placeholder
	return `https://i.imgflip.com/1bij.jpg`;
}

/**
 * Download an image from URL
 */
async function downloadImage(url: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		https
			.get(url, (res) => {
				const chunks: Buffer[] = [];
				res.on("data", (chunk) => chunks.push(chunk));
				res.on("end", () => resolve(Buffer.concat(chunks)));
				res.on("error", reject);
			})
			.on("error", reject);
	});
}

/**
 * Check if text-on-gif is available and working
 * Falls back to simple canvas-based overlay if not
 */
async function getTextOnGif() {
	try {
		// Dynamic import to handle potential missing dependency
		// @ts-expect-error - optional package without types
		const module = await import("text-on-gif");
		return module.default || module;
	} catch {
		return null;
	}
}

/**
 * Simple fallback overlay using canvas (if text-on-gif unavailable)
 */
async function simpleTextOverlay(
	imageBuffer: Buffer,
	options: OverlayOptions,
): Promise<Buffer> {
	try {
		// @ts-expect-error - optional package without types
		const { createCanvas, loadImage } = await import("canvas");
		const canvas = createCanvas(800, 600);
		const ctx = canvas.getContext("2d");

		// Load the image
		const img = await loadImage(imageBuffer);
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

		// Add text
		const fontSize = parseInt(options.fontSize || "24px", 10);
		ctx.font = `${fontSize}px ${options.fontStyle || "Calibri"}`;
		ctx.fillStyle = options.fontColor || "white";
		ctx.strokeStyle = options.strokeColor || "black";
		ctx.lineWidth = options.strokeWidth || 2;

		// Calculate position
		let y = canvas.height - 20;
		if (options.position === "top") y = fontSize + 20;
		if (options.position === "middle") y = canvas.height / 2;

		let x = canvas.width / 2;
		if (options.alignment === "left") x = 50;
		if (options.alignment === "right") x = canvas.width - 50;

		// Draw text with stroke
		ctx.strokeText(options.text, x, y);
		ctx.fillText(options.text, x, y);

		return canvas.toBuffer("image/png");
	} catch {
		// If canvas fails, return original
		console.warn("Canvas overlay failed, returning original image");
		return imageBuffer;
	}
}

/**
 * Add text to a GIF/meme template
 *
 * @param options - Overlay configuration
 * @returns Processed image buffer or null on failure
 */
export async function addTextToGif(
	options: OverlayOptions,
): Promise<Buffer | null> {
	const {
		templateId,
		text,
		fontSize = "24px",
		fontColor = "white",
		strokeColor = "black",
		strokeWidth = 2,
		position = "bottom",
		alignment = "center",
		getAsBuffer = true,
		outputPath,
		fontStyle = "calibri",
	} = options;

	try {
		// Get template image URL
		const imageUrl = getTemplateImageUrl(templateId);

		// Download the template image
		const imageBuffer = await downloadImage(imageUrl);

		// Try text-on-gif first, fallback to simple overlay
		const TextOnGif = await getTextOnGif();

		if (TextOnGif) {
			const gif = new TextOnGif({
				file_path: imageBuffer,
				font_size: fontSize,
				font_color: fontColor,
				stroke_color: strokeColor,
				stroke_width: strokeWidth,
				font_style: fontStyle,
			});

			const result = await gif.textOnGif({
				text,
				alignment_x: alignment,
				alignment_y: position,
				get_as_buffer: getAsBuffer,
			});

			if (result) {
				if (outputPath) {
					fs.mkdirSync(path.dirname(outputPath), { recursive: true });
					fs.writeFileSync(outputPath, result);
				}
				return result;
			}
		}

		// Fallback to simple overlay
		const result = await simpleTextOverlay(imageBuffer, {
			...options,
			position,
			fontSize,
			fontColor,
			strokeColor,
			strokeWidth,
		});

		if (outputPath) {
			fs.mkdirSync(path.dirname(outputPath), { recursive: true });
			fs.writeFileSync(outputPath, result);
		}

		return result;
	} catch (error) {
		console.error(`Error adding text to template ${templateId}:`, error);
		return null;
	}
}

/**
 * Batch process multiple templates
 */
export async function batchOverlay(
	tasks: Array<{
		templateId: string;
		text: string;
		outputPath?: string;
		position?: "top" | "middle" | "bottom";
	}>,
): Promise<
	Array<{
		templateId: string;
		success: boolean;
		message: string;
		buffer?: Buffer;
	}>
> {
	const results = [];

	for (const task of tasks) {
		const buffer = await addTextToGif({
			templateId: task.templateId,
			text: task.text,
			position: task.position || "bottom",
		});

		if (buffer) {
			if (task.outputPath) {
				const dir = path.dirname(task.outputPath);
				fs.mkdirSync(dir, { recursive: true });
				fs.writeFileSync(task.outputPath, buffer);
			}

			results.push({
				templateId: task.templateId,
				success: true,
				message: task.outputPath
					? `Saved to ${task.outputPath}`
					: `Generated buffer (${buffer.length} bytes)`,
				buffer,
			});
		} else {
			results.push({
				templateId: task.templateId,
				success: false,
				message: `Failed to generate: ${task.templateId}`,
			});
		}
	}

	return results;
}

/**
 * Generate a meme for an incident with auto-pattern matching
 */
export async function generateIncidentMeme(
	incident: string,
	outcome: string,
	outputDir?: string,
): Promise<{
	success: boolean;
	templateId?: string;
	message: string;
	filePath?: string;
}> {
	// Classify incident pattern
	const pattern = classifyIncidentPattern(incident, outcome);

	// Get matching templates
	const matchingTemplates = getTemplatesByPattern(pattern);

	if (matchingTemplates.length === 0) {
		return {
			success: false,
			message: `No templates found for pattern: ${pattern}`,
		};
	}

	// Pick random template
	const template =
		matchingTemplates[Math.floor(Math.random() * matchingTemplates.length)];

	// Generate punchline (truncate to ~10 words)
	const words = outcome.split(" ").slice(0, 10).join(" ");
	const punchline = words + (outcome.split(" ").length > 10 ? "..." : "");

	// Generate meme
	let outputPath: string | undefined;
	if (outputDir) {
		const slug = incident
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "-")
			.slice(0, 50);
		outputPath = path.join(outputDir, `${slug}-meme.png`);
	}

	const buffer = await addTextToGif({
		templateId: template.id,
		text: punchline,
		position: "bottom",
		fontSize: "20px",
		outputPath,
	});

	if (!buffer) {
		return {
			success: false,
			templateId: template.id,
			message: `Failed to generate meme for ${template.id}`,
		};
	}

	return {
		success: true,
		templateId: template.id,
		message: `Generated meme: ${template.name}`,
		filePath: outputPath,
	};
}

/**
 * Classify incident into pattern for template matching
 */
export function classifyIncidentPattern(
	incident: string,
	outcome: string,
): string {
	const text = `${incident} ${outcome}`.toLowerCase();

	// Warning patterns
	if (
		text.includes("warn") ||
		text.includes("red flag") ||
		text.includes("ignore")
	) {
		return "ignored-warning";
	}

	// Escalating disaster
	if (
		text.includes("drift") ||
		text.includes("cascad") ||
		text.includes("chain") ||
		text.includes("escalat")
	) {
		return "escalating-disaster";
	}

	// Bad decision
	if (
		text.includes("choice") ||
		text.includes("decision") ||
		text.includes("pick") ||
		text.includes("select")
	) {
		return "bad-decision";
	}

	// AI overconfidence
	if (
		text.includes("ai") ||
		text.includes("model") ||
		text.includes("confidence") ||
		text.includes("over")
	) {
		return "ai-overconfidence";
	}

	// Team failure
	if (
		text.includes("team") ||
		text.includes("group") ||
		text.includes("board") ||
		text.includes("committee")
	) {
		return "team-failure";
	}

	// Obvious outcome
	if (
		text.includes("obvious") ||
		text.includes("predict") ||
		text.includes("should-have")
	) {
		return "obvious-outcome";
	}

	// Predictable failure
	if (
		text.includes("inevit") ||
		text.includes("certain") ||
		text.includes("sure")
	) {
		return "predictable-failure";
	}

	// Ignoring evidence
	if (
		text.includes("despite") ||
		text.includes("evidence") ||
		text.includes("data") ||
		text.includes("ignoring")
	) {
		return "ignoring-evidence";
	}

	// Overconfidence
	if (
		text.includes("confiden") ||
		text.includes("sure") ||
		text.includes("certain")
	) {
		return "overconfidence";
	}

	// Denial
	if (
		text.includes("deny") ||
		text.includes("fine") ||
		text.includes("okay") ||
		text.includes("ok")
	) {
		return "denial";
	}

	// Escalation
	if (
		text.includes("wors") ||
		text.includes("increas") ||
		text.includes("grow")
	) {
		return "escalation";
	}

	// Sudden realization
	if (
		text.includes("realiz") ||
		text.includes("sudden") ||
		text.includes("oh")
	) {
		return "sudden-realization";
	}

	// Obvious danger
	if (
		text.includes("danger") ||
		text.includes("risk") ||
		text.includes("threat")
	) {
		return "obvious-danger";
	}

	// Temptation
	if (
		text.includes("tempt") ||
		text.includes("want") ||
		text.includes("desire")
	) {
		return "temptation";
	}

	// Mockery
	if (
		text.includes("mock") ||
		text.includes("ridiculous") ||
		text.includes("absurd")
	) {
		return "mockery";
	}

	// Celebration (positive outcome)
	if (
		text.includes("success") ||
		text.includes("win") ||
		text.includes("great")
	) {
		return "celebration";
	}

	return "obvious-outcome";
}

/**
 * Get statistics about the template database
 */
export function getTemplateStats(): {
	total: number;
	categories: Record<string, number>;
	patterns: number;
} {
	const categories: Record<string, number> = {};

	for (const [category, catTemplates] of Object.entries(templates.templates)) {
		categories[category] = (catTemplates as TemplateEntry[]).length;
	}

	return {
		total: getTemplateCount(),
		categories,
		patterns: Object.keys(templates.incident_mapping).length,
	};
}
