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
	type FeedbackOutcome,
	getArchetypeGifTemplate,
	getArchetypeTemplate,
	getDeathGifTemplate,
	getDeathTemplate,
	getFeedbackOutcomeTemplate,
} from "../lib/meme-downloader";

// Parse args
const args = process.argv.slice(2);
const flags = {
	deaths: args.includes("--deaths"),
	archetypes: args.includes("--archetypes"),
	all: args.includes("--all"),
	gif: args.includes("--gif"),
	outcomes: args.includes("--outcomes"),
	skipExisting: args.includes("--skip-existing"),
};

const OUTPUT_DIR = path.join(process.cwd(), "public/images");

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if file exists, optionally skip if --skip-existing flag is set
 */
function shouldDownload(outputPath: string): boolean {
	if (!fs.existsSync(outputPath)) {
		return true;
	}
	if (flags.skipExisting) {
		console.log(`⏭ ${path.basename(outputPath)}: Already exists, skipping`);
		return false;
	}
	return true;
}

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
	let skipped = 0;
	let failed = 0;

	for (const deathType of deathTypes) {
		const template = getDeathTemplate(deathType);

		if (!template) {
			console.log(`⚠ ${deathType}: No template found`);
			failed++;
			continue;
		}

		const ext = template.url.split(".").pop()?.split("?")[0] || "jpg";
		const outputPath = path.join(
			outputSubDir,
			`${deathType.toLowerCase()}.${ext}`,
		);

		if (!shouldDownload(outputPath)) {
			skipped++;
			continue;
		}

		try {
			const localPath = await downloadMeme(template.id, template.url);
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
	console.log(`Skipped: ${skipped}`);
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
	let skipped = 0;
	let failed = 0;

	for (const archetype of archetypes) {
		const template = getArchetypeTemplate(archetype);

		if (!template) {
			console.log(`⚠ ${archetype}: No template found`);
			failed++;
			continue;
		}

		const ext = template.url.split(".").pop()?.split("?")[0] || "jpg";
		const outputPath = path.join(
			outputSubDir,
			`${archetype.toLowerCase()}.${ext}`,
		);

		if (!shouldDownload(outputPath)) {
			skipped++;
			continue;
		}

		try {
			const localPath = await downloadMeme(template.id, template.url);
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
	console.log(`Skipped: ${skipped}`);
	console.log(`Failed: ${failed}`);
}

/**
 * Download all death GIFs
 */
async function downloadAllDeathGifs() {
	const deathTypes: DeathType[] = [
		"BANKRUPT",
		"REPLACED_BY_SCRIPT",
		"CONGRESS",
		"FLED_COUNTRY",
		"PRISON",
		"AUDIT_FAILURE",
		"KIRK",
	];

	console.log("Downloading DEATH GIFs...\n");

	const outputSubDir = path.join(OUTPUT_DIR, "deaths-gif");
	fs.mkdirSync(outputSubDir, { recursive: true });

	let success = 0;
	let skipped = 0;
	let failed = 0;

	for (const deathType of deathTypes) {
		const template = getDeathGifTemplate(deathType);

		if (!template) {
			console.log(`⚠ ${deathType}: No GIF template found`);
			failed++;
			continue;
		}

		const ext = template.url.split(".").pop()?.split("?")[0] || "gif";
		const outputPath = path.join(
			outputSubDir,
			`${deathType.toLowerCase()}.${ext}`,
		);

		if (!shouldDownload(outputPath)) {
			skipped++;
			continue;
		}

		try {
			const localPath = await downloadMeme(template.id, template.url);
			fs.copyFileSync(localPath, outputPath);

			console.log(`✓ ${deathType}: ${template.name}`);
			success++;
		} catch (error) {
			console.log(`✗ ${deathType}: ${error}`);
			failed++;
		}
	}

	console.log(`\n=== Death GIFs ===`);
	console.log(`Downloaded: ${success}`);
	console.log(`Skipped: ${skipped}`);
	console.log(`Failed: ${failed}`);
}

/**
 * Download all archetype GIFs
 */
async function downloadAllArchetypeGifs() {
	const archetypes: Archetype[] = [
		"PRAGMATIST",
		"SHADOW_ARCHITECT",
		"DISRUPTOR",
		"CONSERVATIVE",
		"BALANCED",
		"CHAOS_AGENT",
		"KIRK",
	];

	console.log("Downloading ARCHETYPE GIFs...\n");

	const outputSubDir = path.join(OUTPUT_DIR, "archetypes-gif");
	fs.mkdirSync(outputSubDir, { recursive: true });

	let success = 0;
	let skipped = 0;
	let failed = 0;

	for (const archetype of archetypes) {
		const template = getArchetypeGifTemplate(archetype);

		if (!template) {
			console.log(`⚠ ${archetype}: No GIF template found`);
			failed++;
			continue;
		}

		const ext = template.url.split(".").pop()?.split("?")[0] || "gif";
		const outputPath = path.join(
			outputSubDir,
			`${archetype.toLowerCase()}.${ext}`,
		);

		if (!shouldDownload(outputPath)) {
			skipped++;
			continue;
		}

		try {
			const localPath = await downloadMeme(template.id, template.url);
			fs.copyFileSync(localPath, outputPath);

			console.log(`✓ ${archetype}: ${template.name}`);
			success++;
		} catch (error) {
			console.log(`✗ ${archetype}: ${error}`);
			failed++;
		}
	}

	console.log(`\n=== Archetype GIFs ===`);
	console.log(`Downloaded: ${success}`);
	console.log(`Skipped: ${skipped}`);
	console.log(`Failed: ${failed}`);
}

/**
 * Download all feedback outcome memes
 */
async function downloadAllFeedbackOutcomes() {
	const outcomes: FeedbackOutcome[] = [
		"shield-the-team",
		"give-names-to-compliance",
		"push-back-on-deadline",
		"push-team-harder",
		"side-with-engineering",
		"side-with-auditors",
		"protect-the-team",
		"cooperate-with-investigation",
		"defend-delegation",
		"admit-oversight-failure",
		"tell-leadership-no",
		"promise-the-impossible",
		"promote-best-performer",
		"promote-politically-connected",
		"pull-for-patching",
		"continue-development",
		"force-security-fix",
		"let-it-slide",
		"defend-and-take-heat",
		"blame-data-scientist",
		"start-immediately",
		"delay-until-next-quarter",
		"delay-and-comply",
		"refuse-and-fight",
		"allow-claude-use",
		"force-compliance",
		"testify-honestly",
		"minimize-risks-under-oath",
		"address-issues-immediately",
		"encourage-silence",
		"volunteer-for-the-pilot",
		"fight-through-hr",
		"document-honestly",
		"inflate-the-metrics",
		"take-the-blame",
		"name-the-data-scientist",
		"name-the-engineer",
		"provide-full-documentation",
		"claim-poor-record-keeping",
		"fight-for-budget",
		"ship-without-retraining",
	];

	console.log("Downloading FEEDBACK OUTCOME memes...\n");

	const outputSubDir = path.join(OUTPUT_DIR, "outcomes");
	fs.mkdirSync(outputSubDir, { recursive: true });

	let success = 0;
	let skipped = 0;
	let failed = 0;

	for (const outcome of outcomes) {
		const template = getFeedbackOutcomeTemplate(outcome);

		if (!template) {
			console.log(`⚠ ${outcome}: No template found`);
			failed++;
			continue;
		}

		const ext = template.url.split(".").pop()?.split("?")[0] || "jpg";
		const outputPath = path.join(outputSubDir, `${outcome}.${ext}`);

		if (!shouldDownload(outputPath)) {
			skipped++;
			continue;
		}

		try {
			const localPath = await downloadMeme(template.id, template.url);
			fs.copyFileSync(localPath, outputPath);

			console.log(`✓ ${outcome}: ${template.name}`);
			success++;
		} catch (error) {
			console.log(`✗ ${outcome}: ${error}`);
			failed++;
		}
	}

	console.log(`\n=== Feedback Outcomes ===`);
	console.log(`Downloaded: ${success}`);
	console.log(`Skipped: ${skipped}`);
	console.log(`Failed: ${failed}`);
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
	if (flags.all) {
		console.log("=== Downloading ALL memes (static + GIF + outcomes) ===\n");
		await downloadAllDeaths();
		console.log("");
		await downloadAllArchetypes();
		console.log("");
		await downloadAllDeathGifs();
		console.log("");
		await downloadAllArchetypeGifs();
		console.log("");
		await downloadAllFeedbackOutcomes();
	} else if (flags.outcomes) {
		await downloadAllFeedbackOutcomes();
	} else if (flags.deaths) {
		await downloadAllDeaths();
	} else if (flags.archetypes) {
		await downloadAllArchetypes();
	} else if (flags.gif) {
		console.log("=== Downloading GIFs ===\n");
		await downloadAllDeathGifs();
		console.log("");
		await downloadAllArchetypeGifs();
	} else {
		console.log(`
Download memes from Imgflip

Usage:
  bun run scripts/download-memes.ts --deaths         Download all death memes
  bun run scripts/download-memes.ts --archetypes    Download all archetype memes  
  bun run scripts/download-memes.ts --gif           Download all GIFs
  bun run scripts/download-memes.ts --outcomes      Download feedback outcome memes
  bun run scripts/download-memes.ts --all           Download everything
  bun run scripts/download-memes.ts --skip-existing  Skip already downloaded files
`);
	}
}

main();
