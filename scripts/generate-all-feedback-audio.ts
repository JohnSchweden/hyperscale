/**
 * Generate missing feedback audio files from missing-audio.json
 * Run: bun scripts/generate-all-feedback-audio.ts
 *
 * Supports --kirk flag to generate only Kirk roaster feedback audio files
 * (6 files for kirk-raise, kirk-ceo, kirk-nobel cards)
 *
 * Uses Gemini TTS to generate .wav files, then converts to .mp3 with ffmpeg
 */

import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
	console.error("GEMINI_API_KEY not set");
	process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// Parse --kirk flag
const args = process.argv.slice(2);
const kirkMode = args.includes("--kirk");

const OUTPUT_DIR = path.join(
	process.cwd(),
	"public/audio/voices/roaster/feedback",
);
const MISSING_JSON = path.join(
	process.cwd(),
	".planning/quick/5-add-for-kirk-feedback-outcomes-audio-fil/missing-audio.json",
);

// Kirk items for --kirk mode
const KIRK_ITEMS: MissingAudio[] = [
	{
		cardId: "kirk-raise",
		label: "Accept",
		stem: "kirk-raise_accept",
		roaster:
			"Cool, I'll cash the check and mind the fact that my keyboard is spelling 'RUN'. Classic Tuesday.",
		filename: "feedback_kirk-raise_accept.mp3",
	},
	{
		cardId: "kirk-raise",
		label: "Reject",
		stem: "kirk-raise_reject",
		roaster:
			"Two hundred percent? From THIS budget? The simulation is literally weeping nickels and you're the cause.",
		filename: "feedback_kirk-raise_reject.mp3",
	},
	{
		cardId: "kirk-ceo",
		label: "Accept",
		stem: "kirk-ceo_accept",
		roaster:
			"Board vote was unanimous because the placeholders signed themselves. Democracy is thriving.",
		filename: "feedback_kirk-ceo_accept.mp3",
	},
	{
		cardId: "kirk-ceo",
		label: "Reject",
		stem: "kirk-ceo_reject",
		roaster:
			"CEO? Sure. I'll just command the bucket of bits that pretends to be the board. Very Fortune 5600.",
		filename: "feedback_kirk-ceo_reject.mp3",
	},
	{
		cardId: "kirk-nobel",
		label: "Accept",
		stem: "kirk-nobel_accept",
		roaster:
			"I'll wear the trophy on my Zoom tile. The committee will love the bokeh of my despair.",
		filename: "feedback_kirk-nobel_accept.mp3",
	},
	{
		cardId: "kirk-nobel",
		label: "Reject",
		stem: "kirk-nobel_reject",
		roaster:
			"Nobel in AI Governance? What's next, a Pulitzer for rebooting the router? I'm honored to quit.",
		filename: "feedback_kirk-nobel_reject.mp3",
	},
];

interface MissingAudio {
	cardId: string;
	label: string;
	roaster: string;
	stem: string;
	filename: string;
}

function createWavFile(
	pcmData: Buffer,
	sampleRate: number = 24000,
	numChannels: number = 1,
	bitsPerSample: number = 16,
): Buffer {
	const dataSize = pcmData.length;
	const buffer = Buffer.alloc(44 + dataSize);

	buffer.write("RIFF", 0);
	buffer.writeUInt32LE(36 + dataSize, 4);
	buffer.write("WAVE", 8);

	buffer.write("fmt ", 12);
	buffer.writeUInt32LE(16, 16);
	buffer.writeUInt16LE(1, 20);
	buffer.writeUInt16LE(numChannels, 22);
	buffer.writeUInt32LE(sampleRate, 24);
	buffer.writeUInt32LE((sampleRate * numChannels * bitsPerSample) / 8, 28);
	buffer.writeUInt16LE((numChannels * bitsPerSample) / 8, 32);
	buffer.writeUInt16LE(bitsPerSample, 34);

	buffer.write("data", 36);
	buffer.writeUInt32LE(dataSize, 40);
	pcmData.copy(buffer, 44);

	return buffer;
}

function convertWavToMp3(wavPath: string): void {
	const mp3Path = wavPath.replace(/\.wav$/, ".mp3");
	const cmd = `ffmpeg -y -i "${wavPath}" -codec:a libmp3lame -b:a 128k "${mp3Path}" 2>/dev/null`;
	try {
		execSync(cmd, { stdio: "pipe" });
		// Remove wav file after conversion
		fs.unlinkSync(wavPath);
		console.log(`  Converted to MP3: ${path.basename(mp3Path)}`);
	} catch (error) {
		console.error(`  FFmpeg error: ${error}`);
	}
}

function convertWavToOpus(wavPath: string): void {
	const opusPath = wavPath.replace(/\.wav$/, ".opus");
	const cmd = `ffmpeg -y -i "${wavPath}" -codec:a libopus -b:a 96k "${opusPath}" 2>/dev/null`;
	try {
		execSync(cmd, { stdio: "pipe" });
		// Remove wav file after conversion
		fs.unlinkSync(wavPath);
		console.log(`  Converted to Opus: ${path.basename(opusPath)}`);
	} catch (error) {
		console.error(`  FFmpeg error: ${error}`);
	}
}

async function generateVoice(text: string): Promise<Buffer> {
	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash-preview-tts",
		contents: [{ parts: [{ text }] }],
		config: {
			responseModalities: [Modality.AUDIO],
			speechConfig: {
				voiceConfig: {
					prebuiltVoiceConfig: { voiceName: "Kore" },
				},
			},
		},
	});

	const base64Audio =
		response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
	if (!base64Audio) {
		throw new Error("No audio data in response");
	}

	return Buffer.from(base64Audio, "base64");
}

async function main() {
	// Handle --kirk mode
	if (kirkMode) {
		console.log("🚀 Starting Kirk audio generation...\n");

		// Ensure kirk subfolder exists
		const kirkDir = path.join(OUTPUT_DIR, "kirk");
		if (!fs.existsSync(kirkDir)) {
			fs.mkdirSync(kirkDir, { recursive: true });
		}

		console.log(`📋 Generating ${KIRK_ITEMS.length} Kirk audio files\n`);

		let generated = 0;
		let failed = 0;

		// Strip Unicode combining characters from text
		const stripDiacritics = (text: string) =>
			text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

		for (const item of KIRK_ITEMS) {
			try {
				console.log(`  Generating: ${item.filename}...`);
				const cleanedText = stripDiacritics(item.roaster);
				const pcm = await generateVoice(cleanedText);
				const wav = createWavFile(pcm);

				// Generate MP3
				const mp3Path = path.join(kirkDir, item.filename);
				const wavPathMP3 = mp3Path.replace(".mp3", ".wav");
				fs.writeFileSync(wavPathMP3, wav);
				convertWavToMp3(wavPathMP3);

				// Generate Opus
				const opusPath = mp3Path.replace(".mp3", ".opus");
				const wavPathOpus = opusPath.replace(".opus", ".wav");
				fs.writeFileSync(wavPathOpus, wav);
				convertWavToOpus(wavPathOpus);

				generated++;
			} catch (error) {
				console.error(`  ❌ Failed: ${item.filename} - ${error}`);
				failed++;
			}

			// Rate limit delay between requests
			await new Promise((resolve) => setTimeout(resolve, 1500));
		}

		console.log(`\n✅ Kirk generation complete!`);
		console.log(`   Generated: ${generated}`);
		console.log(`   Failed: ${failed}`);
		return;
	}

	console.log("🚀 Starting feedback audio generation...\n");

	// Read missing audio list
	const missingData: MissingAudio[] = JSON.parse(
		fs.readFileSync(MISSING_JSON, "utf-8"),
	);
	console.log(`📋 Total missing audio files: ${missingData.length}`);

	// Check existing files
	const existingFiles = fs
		.readdirSync(OUTPUT_DIR)
		.filter((f) => f.endsWith(".mp3"));
	const existingStems = new Set(
		existingFiles.map((f) => f.replace(/^feedback_(.+)\.mp3$/, "$1")),
	);

	// Filter to only truly missing
	const toGenerate = missingData.filter((m) => !existingStems.has(m.stem));
	console.log(`✨ Files to generate: ${toGenerate.length}\n`);

	if (toGenerate.length === 0) {
		console.log("✅ All files already exist!");
		return;
	}

	// Generate in batches to avoid API rate limits
	const BATCH_SIZE = 10;
	let generated = 0;
	let failed = 0;

	for (let i = 0; i < toGenerate.length; i += BATCH_SIZE) {
		const batch = toGenerate.slice(i, i + BATCH_SIZE);
		console.log(
			`\n📦 Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(toGenerate.length / BATCH_SIZE)}`,
		);

		const promises = batch.map(async (item) => {
			try {
				console.log(`  Generating: ${item.filename}...`);
				const pcm = await generateVoice(item.roaster);
				const wav = createWavFile(pcm);
				const wavPath = path.join(
					OUTPUT_DIR,
					item.filename.replace(".mp3", ".wav"),
				);
				fs.writeFileSync(wavPath, wav);

				// Convert to MP3
				convertWavToMp3(wavPath);

				return { success: true, item };
			} catch (error) {
				console.error(`  ❌ Failed: ${item.filename} - ${error}`);
				return { success: false, item };
			}
		});

		const results = await Promise.all(promises);
		generated += results.filter((r) => r.success).length;
		failed += results.filter((r) => !r.success).length;

		// Rate limit delay between batches
		if (i + BATCH_SIZE < toGenerate.length) {
			console.log("  😴 Rate limiting...");
			await new Promise((resolve) => setTimeout(resolve, 2000));
		}
	}

	console.log(`\n✅ Generation complete!`);
	console.log(`   Generated: ${generated}`);
	console.log(`   Failed: ${failed}`);
}

main().catch(console.error);
