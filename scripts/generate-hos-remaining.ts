import "dotenv/config";
import * as fs from "node:fs";
import * as path from "node:path";
import { GoogleGenAI, Modality } from "@google/genai";
import { compressAudioFile } from "./compress-audio";

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
	console.error("GEMINI_API_KEY not set");
	process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

/**
 * The 11 remaining Head of Something cards that need voice feedback audio.
 * Each card has LEFT and RIGHT feedback text.
 */
const REMAINING_HOS_CARDS: Array<{
	id: string;
	leftText: string;
	rightText: string;
}> = [
	{
		id: "hos_prompt_injection_blame",
		leftText:
			"Noble. Your team will work harder for you now. The VP will also blame you.",
		rightText:
			"Sacrificing your engineer to save yourself. Your team will remember this at their exit interviews.",
	},
	{
		id: "hos_model_drift_budget_conflict",
		leftText: "Fighting the CFO. Brave. Possibly career-limiting. But brave.",
		rightText:
			"Your team knows you sold them out. The CFO owes you. Everyone loses.",
	},
	{
		id: "hos_shadow_ai_team_discovery",
		leftText:
			"Team hero. Management headache. The loyalty is worth it until they fire you.",
		rightText:
			"Compliance is happy. Your team is updating LinkedIn. Management material right here.",
	},
	{
		id: "hos_delegation_gone_wrong",
		leftText:
			"Taking the L. Your delegation authority will shrink. But you're honest.",
		rightText: "Denial is a strategy. Not a good one. But a strategy.",
	},
	{
		id: "hos_promotion_politics",
		leftText: "Merit wins. Politics loses. Your VP is taking notes.",
		rightText:
			"Your best performer just learned meritocracy is a myth. The VP owes you.",
	},
	{
		id: "hos_prompt_injection_copilot_team",
		leftText:
			"Deadline missed. Team secure. Product is angry. You sleep better.",
		rightText:
			"Friday release with vulnerable tools. What could go wrong? (Everything.)",
	},
	{
		id: "hos_model_drift_retrain_delay",
		leftText:
			"Over budget now. Review at risk. But problem solved. Long-term thinking.",
		rightText:
			"Budget looks good this quarter. Model rots. Next quarter's problem!",
	},
	{
		id: "explainability_hos_1",
		leftText:
			"Engineering will resent you. Auditors will forget you. Compliance win.",
		rightText: "Better accuracy now. Better fines later. Engineering owes you.",
	},
	{
		id: "shadow_ai_hos_1",
		leftText:
			"Team hero. Management headache. The loyalty is worth it until they fire you.",
		rightText:
			"Compliance is happy. Your team is updating LinkedIn. Management material right here.",
	},
	{
		id: "synthetic_data_hos_1",
		leftText:
			"Noble. Your team will work harder for you now. The VP will also blame you.",
		rightText:
			"Sacrificing your best performer to save yourself. Your team will remember this at their exit interviews.",
	},
	{
		id: "synthetic_data_hos_2",
		leftText:
			"Your team is exposed. But legal can actually defend you. There's a strategy here.",
		rightText:
			"'We didn't keep records' meets 'we have something to hide.' Prosecutors love this.",
	},
];

const OUTPUT_DIR = path.join(
	process.cwd(),
	"public/audio/voices/roaster/feedback",
);

function createWavFile(
	pcmData: Buffer,
	sampleRate: number = 24000,
	numChannels: number = 1,
	bitsPerSample: number = 16,
): Buffer {
	const dataSize = pcmData.length;
	const buffer = Buffer.alloc(44 + dataSize);

	// RIFF header
	buffer.write("RIFF", 0);
	buffer.writeUInt32LE(36 + dataSize, 4);
	buffer.write("WAVE", 8);

	// fmt subchunk
	buffer.write("fmt ", 12);
	buffer.writeUInt32LE(16, 16); // Subchunk1Size
	buffer.writeUInt16LE(1, 20); // AudioFormat (PCM)
	buffer.writeUInt16LE(numChannels, 22);
	buffer.writeUInt32LE(sampleRate, 24);
	buffer.writeUInt32LE((sampleRate * numChannels * bitsPerSample) / 8, 28); // ByteRate
	buffer.writeUInt16LE((numChannels * bitsPerSample) / 8, 32); // BlockAlign
	buffer.writeUInt16LE(bitsPerSample, 34);

	// data subchunk
	buffer.write("data", 36);
	buffer.writeUInt32LE(dataSize, 40);
	pcmData.copy(buffer, 44);

	return buffer;
}

async function generateVoiceWithRadio(
	text: string,
	outputFilename: string,
): Promise<void> {
	const outputPath = path.join(OUTPUT_DIR, `${outputFilename}.wav`);

	// Check if file already exists
	if (fs.existsSync(outputPath)) {
		console.log(`  ⏭️  Skipping (exists): ${outputFilename}.wav`);
		return;
	}

	console.log(`  🎙️  Generating: ${outputFilename}.wav`);
	console.log(`     Text: "${text.substring(0, 60)}..."`);

	try {
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
			console.error(`  ❌ No audio data in response for ${outputFilename}`);
			return;
		}

		const pcmBuffer = Buffer.from(base64Audio, "base64");

		// Wrap in WAV container
		const wavBuffer = createWavFile(pcmBuffer, 24000, 1, 16);

		// Ensure output directory exists
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });

		// Write WAV file
		fs.writeFileSync(outputPath, wavBuffer);
		console.log(
			`  ✅ Created: ${outputFilename}.wav (${wavBuffer.length} bytes)`,
		);

		// Compress to Opus and MP3
		try {
			await compressAudioFile(outputPath);
			console.log(`  🗜️  Compressed: ${outputFilename}.{opus,mp3}`);
		} catch (error) {
			console.warn(`  ⚠️  Compression failed for ${outputFilename}:`, error);
		}
	} catch (error) {
		console.error(`  ❌ Failed to generate ${outputFilename}:`, error);
		throw error;
	}
}

async function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateAll() {
	console.log("=".repeat(60));
	console.log("Generating voice audio for 11 remaining HoS cards");
	console.log("=".repeat(60));
	console.log(`\nOutput directory: ${OUTPUT_DIR}`);
	console.log(`Cards to process: ${REMAINING_HOS_CARDS.length}`);
	console.log(
		`Total audio files: ${REMAINING_HOS_CARDS.length * 2} (LEFT + RIGHT each)\n`,
	);

	fs.mkdirSync(OUTPUT_DIR, { recursive: true });

	let generatedCount = 0;
	let skippedCount = 0;
	let errorCount = 0;

	for (let i = 0; i < REMAINING_HOS_CARDS.length; i++) {
		const card = REMAINING_HOS_CARDS[i];
		console.log(`\n[${i + 1}/${REMAINING_HOS_CARDS.length}] ${card.id}`);

		try {
			// Generate LEFT feedback
			const leftFilename = `feedback_${card.id}_left`;
			const leftExists = fs.existsSync(
				path.join(OUTPUT_DIR, `${leftFilename}.wav`),
			);
			if (!leftExists) {
				await generateVoiceWithRadio(card.leftText, leftFilename);
				generatedCount++;
				await delay(500); // Small delay between API calls
			} else {
				console.log(`  ⏭️  Skipping (exists): ${leftFilename}.wav`);
				skippedCount++;
			}

			// Generate RIGHT feedback
			const rightFilename = `feedback_${card.id}_right`;
			const rightExists = fs.existsSync(
				path.join(OUTPUT_DIR, `${rightFilename}.wav`),
			);
			if (!rightExists) {
				await generateVoiceWithRadio(card.rightText, rightFilename);
				generatedCount++;
			} else {
				console.log(`  ⏭️  Skipping (exists): ${rightFilename}.wav`);
				skippedCount++;
			}
		} catch (error) {
			console.error(`  ❌ Error processing ${card.id}:`, error);
			errorCount++;
			// Continue with next card despite error
		}

		// Delay between cards to avoid rate limits
		if (i < REMAINING_HOS_CARDS.length - 1) {
			await delay(1000);
		}
	}

	console.log(`\n${"=".repeat(60)}`);
	console.log("Generation complete!");
	console.log("=".repeat(60));
	console.log(`Generated: ${generatedCount} files`);
	console.log(`Skipped (existing): ${skippedCount} files`);
	console.log(`Errors: ${errorCount} files`);
}

generateAll().catch((error) => {
	console.error("Generation failed:", error);
	process.exit(1);
});
