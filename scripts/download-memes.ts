#!/usr/bin/env bun
/**
 * Download memes from Imgflip
 *
 * Usage:
 *   bun run scripts/download-memes.ts --deaths     Download all death memes
 *   bun run scripts/download-memes.ts --archetypes Download all archetype memes
 *   bun run scripts/download-memes.ts --all      Download everything
 *   bun run scripts/download-memes.ts --gif      Download escalation GIFs
 */

import * as fs from "node:fs";
import * as path from "node:path";
import {
	type Archetype,
	type DeathType,
	downloadMeme,
	getArchetypeTemplate,
	getDeathTemplate,
} from "../lib/meme-downloader";

// Parse args
const args = process.argv.slice(2);
const flags = {
	deaths: args.includes("--deaths"),
	archetypes: args.includes("--archetypes"),
	all: args.includes("--all"),
	gif: args.includes("--gif"),
};

const OUTPUT_DIR = path.join(process.cwd(), "public/images");

// =============================================================================
// DOWNLOAD FUNCTIONS
// =============================================================================

/**
 * Download all death memes
 */
async function downloadAllDeaths() {
	const deathTypes: DeathType[] = [
		"BANKRUPT",
		"REPLACED_BY_SCRIPT",
		"CONGRESS",
		"FLED_COUNTRY",
		"PRISON",
		"AUDIT_FAILURE",
		"KIRK",
	];

	console.log("Downloading DEATH memes...\n");

	const outputSubDir = path.join(OUTPUT_DIR, "deaths");
	fs.mkdirSync(outputSubDir, { recursive: true });

	let success = 0;
	let failed = 0;

	for (const deathType of deathTypes) {
		const template = getDeathTemplate(deathType);

		if (!template) {
			console.log(`⚠ ${deathType}: No template found`);
			failed++;
			continue;
		}

		try {
			const localPath = await downloadMeme(template.id, template.url);

			// Copy to output directory
			const ext = template.url.split(".").pop()?.split("?")[0] || "jpg";
			const outputPath = path.join(
				outputSubDir,
				`${deathType.toLowerCase()}.${ext}`,
			);
			fs.copyFileSync(localPath, outputPath);

			console.log(`✓ ${deathType}: ${template.name}`);
			success++;
		} catch (error) {
			console.log(`✗ ${deathType}: ${error}`);
			failed++;
		}
	}

	console.log(`\n=== Death Memes ===`);
	console.log(`Downloaded: ${success}`);
	console.log(`Failed: ${failed}`);
}

/**
 * Download all archetype memes
 */
async function downloadAllArchetypes() {
	const archetypes: Archetype[] = [
		"PRAGMATIST",
		"SHADOW_ARCHITECT",
		"DISRUPTOR",
		"CONSERVATIVE",
		"BALANCED",
		"CHAOS_AGENT",
		"KIRK",
	];

	console.log("Downloading ARCHETYPE memes...\n");

	const outputSubDir = path.join(OUTPUT_DIR, "archetypes");
	fs.mkdirSync(outputSubDir, { recursive: true });

	let success = 0;
	let failed = 0;

	for (const archetype of archetypes) {
		const template = getArchetypeTemplate(archetype);

		if (!template) {
			console.log(`⚠ ${archetype}: No template found`);
			failed++;
			continue;
		}

		try {
			const localPath = await downloadMeme(template.id, template.url);

			// Copy to output directory
			const ext = template.url.split(".").pop()?.split("?")[0] || "jpg";
			const outputPath = path.join(
				outputSubDir,
				`${archetype.toLowerCase()}.${ext}`,
			);
			fs.copyFileSync(localPath, outputPath);

			console.log(`✓ ${archetype}: ${template.name}`);
			success++;
		} catch (error) {
			console.log(`✗ ${archetype}: ${error}`);
			failed++;
		}
	}

	console.log(`\n=== Archetype Memes ===`);
	console.log(`Downloaded: ${success}`);
	console.log(`Failed: ${failed}`);
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
	if (flags.all) {
		console.log("=== Downloading ALL memes ===\n");
		await downloadAllDeaths();
		console.log("");
		await downloadAllArchetypes();
	} else if (flags.deaths) {
		await downloadAllDeaths();
	} else if (flags.archetypes) {
		await downloadAllArchetypes();
	} else {
		console.log(`
Download memes from Imgflip

Usage:
  bun run scripts/download-memes.ts --deaths      Download all death memes
  bun run scripts/download-memes.ts --archetypes  Download all archetype memes  
  bun run scripts/download-memes.ts --all         Download everything
`);
	}
}

main();
