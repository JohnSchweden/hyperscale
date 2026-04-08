/**
 * Audit script: Find all cards with roaster text that are missing feedback audio files.
 * Run: bun scripts/audit-missing-feedback-audio.ts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { slugify } from "../src/lib/feedbackAudioChoice";

const FEEDBACK_DIR = "public/audio/voices/roaster/feedback";

interface MissingAudio {
	cardId: string;
	label: string;
	roaster: string;
	stem: string;
	filename: string;
}

function getExistingAudioFiles(): Set<string> {
	const files = fs.readdirSync(FEEDBACK_DIR).filter((f) => f.endsWith(".mp3"));
	const stemSet = new Set<string>();
	for (const file of files) {
		const match = file.match(/^feedback_(.+)\.mp3$/);
		if (match) {
			stemSet.add(match[1]);
		}
	}
	return stemSet;
}

function parseCardsWithRoaster(): MissingAudio[] {
	const cardsDir = path.join(process.cwd(), "src/data/cards");
	const files = fs.readdirSync(cardsDir).filter((f) => f.endsWith(".ts"));

	const results: MissingAudio[] = [];

	for (const file of files) {
		const content = fs.readFileSync(path.join(cardsDir, file), "utf-8");
		// Split by makeCard( to get each card
		const cardBlocks = content.split(/makeCard\s*\(/g);

		for (let i = 1; i < cardBlocks.length; i++) {
			const block = cardBlocks[i];

			// Extract card ID from first parameter
			const idMatch = block.match(/^\s*"([^"]+)"/);
			if (!idMatch) continue;
			const cardId = idMatch[1];

			// Find all occurrences of label: "..." and roaster: "..." pairs in this card block
			const outcomePattern = /label:\s*"([^"]+)"[^}]*?roaster:\s*"([^"]+)"/g;
			for (const match of block.matchAll(outcomePattern)) {
				const label = match[1];
				const roaster = match[2];
				const slug = slugify(label);
				const stem = `${cardId}_${slug}`;
				results.push({
					cardId,
					label,
					roaster,
					stem,
					filename: `feedback_${stem}.mp3`,
				});
			}
		}
	}

	return results;
}

function main() {
	console.log("🔍 Auditing missing feedback audio files...\n");

	const existingFiles = getExistingAudioFiles();
	console.log(`📁 Existing audio files: ${existingFiles.size}`);

	const cardsWithRoaster = parseCardsWithRoaster();
	console.log(`📋 Outcomes with roaster text: ${cardsWithRoaster.length}\n`);

	const missing = cardsWithRoaster.filter(
		(card) => !existingFiles.has(card.stem),
	);

	console.log(`❌ Missing audio files: ${missing.length}\n`);

	if (missing.length > 0) {
		console.log("Missing files (sorted by card ID):\n");
		missing.sort((a, b) => a.cardId.localeCompare(b.cardId));

		const byCard: Record<string, MissingAudio[]> = {};
		for (const m of missing) {
			if (!byCard[m.cardId]) byCard[m.cardId] = [];
			byCard[m.cardId].push(m);
		}

		for (const [cardId, outcomes] of Object.entries(byCard)) {
			console.log(`\n### ${cardId}`);
			for (const m of outcomes) {
				console.log(`  - ${m.filename}`);
				console.log(`    Label: "${m.label}"`);
				console.log(`    Roaster: "${m.roaster}"`);
			}
		}

		const outputPath = path.join(
			process.cwd(),
			".planning/quick/5-add-for-kirk-feedback-outcomes-audio-fil/missing-audio.json",
		);
		fs.writeFileSync(outputPath, JSON.stringify(missing, null, 2));
		console.log(`\n💾 Saved missing file list to: ${outputPath}`);
	}

	console.log("\n✅ Audit complete!");
}

main();
