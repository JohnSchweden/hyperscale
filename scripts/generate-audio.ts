#!/usr/bin/env bun
/**
 * Unified audio generation script for all feedback and death audio.
 * Replaces individual generate-hos-*.ts and generate-death-*.ts scripts.
 *
 * Usage:
 *   bun scripts/generate-audio.ts --type=feedback --deck=hos
 *   bun scripts/generate-audio.ts --type=death
 *   bun scripts/generate-audio.ts --type=core
 *   bun scripts/generate-audio.ts --dry-run --type=feedback --deck=hos
 */

import * as fs from "node:fs";
import * as path from "node:path";
import type { Card, PersonalityType } from "../src/types";
import { PersonalityType as PersonalityTypeEnum } from "../src/types";
import {
	type DeathAudioSpec,
	deriveDeathSpecs,
	deriveFeedbackSpecs,
	type FeedbackAudioSpec,
	getVoiceForPersonality,
} from "./lib/audio-spec";
import { delay, generateVoiceFile, initializeClient } from "./tts-utils";

interface CliArgs {
	type: "feedback" | "death" | "core";
	deck?: string;
	personality?: "roaster" | "zen" | "lovebomber" | "all";
	ids?: string;
	format?: "wav" | "mp3+opus";
	dryRun?: boolean;
}

/**
 * Parse command-line arguments
 */
function parseArgs(): CliArgs {
	const args: CliArgs = {
		type: "feedback",
	};

	for (const arg of process.argv.slice(2)) {
		if (arg.startsWith("--type=")) {
			args.type = arg.split("=")[1] as CliArgs["type"];
		} else if (arg.startsWith("--deck=")) {
			args.deck = arg.split("=")[1];
		} else if (arg.startsWith("--personality=")) {
			args.personality = arg.split("=")[1] as CliArgs["personality"];
		} else if (arg.startsWith("--ids=")) {
			args.ids = arg.split("=")[1];
		} else if (arg.startsWith("--format=")) {
			args.format = arg.split("=")[1] as CliArgs["format"];
		} else if (arg === "--dry-run") {
			args.dryRun = true;
		}
	}

	return args;
}

/**
 * Validate arguments
 */
function validateArgs(args: CliArgs): void {
	if (!["feedback", "death", "core"].includes(args.type)) {
		throw new Error(`Invalid type: ${args.type}`);
	}

	if (args.type === "feedback" && !args.deck) {
		throw new Error("--deck is required when --type=feedback");
	}

	if (
		args.personality &&
		!["roaster", "zen", "lovebomber", "all"].includes(args.personality)
	) {
		throw new Error(`Invalid personality: ${args.personality}`);
	}

	if (args.format && !["wav", "mp3+opus"].includes(args.format)) {
		throw new Error(`Invalid format: ${args.format}`);
	}
}

/**
 * Map CLI personality names to enum values
 */
function personalityToCLIName(
	personality: PersonalityType,
): "roaster" | "zen" | "lovebomber" {
	switch (personality) {
		case PersonalityTypeEnum.ROASTER:
			return "roaster";
		case PersonalityTypeEnum.ZEN_MASTER:
			return "zen";
		case PersonalityTypeEnum.LOVEBOMBER:
			return "lovebomber";
		default:
			throw new Error(`Unknown personality: ${personality}`);
	}
}

/**
 * Map CLI personality names to enum values
 */
function cliNameToPersonality(name: string): PersonalityType {
	switch (name) {
		case "roaster":
			return PersonalityTypeEnum.ROASTER;
		case "zen":
			return PersonalityTypeEnum.ZEN_MASTER;
		case "lovebomber":
			return PersonalityTypeEnum.LOVEBOMBER;
		default:
			throw new Error(`Unknown personality: ${name}`);
	}
}

/**
 * Get personalities to process
 */
function getPersonalitiesForGeneration(requested?: string): PersonalityType[] {
	if (!requested || requested === "all") {
		return [
			PersonalityTypeEnum.ROASTER,
			PersonalityTypeEnum.ZEN_MASTER,
			PersonalityTypeEnum.LOVEBOMBER,
		];
	}
	return [cliNameToPersonality(requested)];
}

/**
 * Load all card decks
 */
function loadCardDecks(): Record<string, Card[]> {
	const cardsDir = path.join(process.cwd(), "src/data/cards");
	const decks: Record<string, Card[]> = {};

	const cardFiles = fs
		.readdirSync(cardsDir)
		.filter((f) => f.endsWith(".ts") && !f.includes("index"));

	for (const file of cardFiles) {
		const deckName = file.replace(".ts", "");
		try {
			const module = require(path.join(cardsDir, file));
			// Look for common export patterns
			const cardsExport =
				module.HEAD_OF_SOMETHING_CARDS ||
				module.CARDS ||
				module.default?.CARDS ||
				Object.values(module).find(
					(v: any) => Array.isArray(v) && v.length > 0,
				);

			if (cardsExport && Array.isArray(cardsExport)) {
				decks[deckName] = cardsExport;
			}
		} catch (error) {
			console.warn(`Warning: Could not load deck ${deckName}:`, error);
		}
	}

	return decks;
}

/**
 * Get deck by name
 */
function getDeck(deckName: string): Card[] {
	const decks = loadCardDecks();

	if (!decks[deckName]) {
		const available = Object.keys(decks).join(", ");
		throw new Error(
			`Deck "${deckName}" not found. Available decks: ${available}`,
		);
	}

	return decks[deckName];
}

/**
 * Print specs without generating
 */
function printDryRun(
	specs: (FeedbackAudioSpec | DeathAudioSpec)[],
	args: CliArgs,
): void {
	console.log(`\n=== DRY RUN: ${specs.length} files would be generated ===\n`);

	for (const spec of specs) {
		if ("cardId" in spec) {
			const feedbackSpec = spec as FeedbackAudioSpec;
			console.log(
				`  feedback: ${feedbackSpec.cardId} [${feedbackSpec.side}] (${feedbackSpec.personality})`,
			);
			console.log(`    Output: ${feedbackSpec.filename}`);
		} else {
			const deathSpec = spec as DeathAudioSpec;
			console.log(`  death: ${deathSpec.deathType} (${deathSpec.personality})`);
			console.log(`    Output: ${deathSpec.filename}`);
		}
	}

	console.log("\nNo files were created (--dry-run mode).");
	console.log(`Remove --dry-run to generate audio files.`);
}

/**
 * Generate audio files
 */
async function generateAudio(
	specs: (FeedbackAudioSpec | DeathAudioSpec)[],
	_args: CliArgs,
): Promise<void> {
	const client = initializeClient();
	let successCount = 0;
	let failureCount = 0;

	console.log(`\n=== Generating ${specs.length} audio files ===\n`);

	for (let i = 0; i < specs.length; i++) {
		const spec = specs[i];

		try {
			if (i > 0) {
				await delay(500); // Rate limit API calls
			}

			const outputDir = path.dirname(spec.outputPath);
			await generateVoiceFile(spec.filename, spec.text, outputDir, client, {
				voiceName: getVoiceForPersonality(spec.personality),
				verbose: true,
			});

			successCount++;
		} catch (error) {
			console.error(
				`❌ Failed to generate ${spec.filename}:`,
				error instanceof Error ? error.message : error,
			);
			failureCount++;
		}
	}

	console.log(`\n=== Generation Complete ===`);
	console.log(`✅ Success: ${successCount}/${specs.length}`);
	if (failureCount > 0) {
		console.log(`❌ Failed: ${failureCount}/${specs.length}`);
		process.exit(1);
	}
}

/**
 * Load and process core personality audio (onboarding, victory, failure)
 */
async function generateCoreAudio(_client: any, _args: CliArgs): Promise<void> {
	console.log("\n=== Generating Core Personality Audio ===\n");
	console.log(
		"Core audio generation not yet implemented. Use generate-all.ts for now.",
	);
	console.log(
		"This will generate onboarding, victory, and failure audio for all personalities.",
	);
}

/**
 * Main execution
 */
async function main(): Promise<void> {
	const args = parseArgs();

	try {
		validateArgs(args);

		console.log(`🎙️ Audio Generation Tool`);
		console.log(`   Type: ${args.type}`);
		if (args.deck) console.log(`   Deck: ${args.deck}`);
		if (args.personality) console.log(`   Personality: ${args.personality}`);
		if (args.ids) console.log(`   Card IDs: ${args.ids.substring(0, 60)}...`);
		if (args.dryRun) console.log(`   Mode: DRY RUN`);

		let specs: (FeedbackAudioSpec | DeathAudioSpec)[] = [];

		if (args.type === "feedback") {
			const deck = getDeck(args.deck!);
			const personalities = getPersonalitiesForGeneration(args.personality);
			const cardIds = args.ids
				? args.ids.split(",").map((id) => id.trim())
				: undefined;

			specs = deriveFeedbackSpecs(deck, personalities, cardIds);
		} else if (args.type === "death") {
			const personalities = getPersonalitiesForGeneration(args.personality);
			specs = deriveDeathSpecs(personalities);
		} else if (args.type === "core") {
			const client = initializeClient();
			await generateCoreAudio(client, args);
			return;
		}

		if (specs.length === 0) {
			console.log("No specs generated. Check arguments.");
			process.exit(1);
		}

		if (args.dryRun) {
			printDryRun(specs, args);
		} else {
			await generateAudio(specs, args);
		}
	} catch (error) {
		console.error(
			"Fatal error:",
			error instanceof Error ? error.message : error,
		);
		process.exit(1);
	}
}

main();
