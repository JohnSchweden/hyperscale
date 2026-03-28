import * as fs from "node:fs";
import * as path from "node:path";
import { GoogleGenAI, Modality } from "@google/genai";
import { compressAudioFile } from "./compress-audio";

/**
 * Creates a WAV file buffer from raw PCM data.
 * Wraps PCM audio in a RIFF/WAVE container with proper headers.
 */
export function createWavFile(
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

/**
 * Delay helper for rate-limiting API calls.
 */
export async function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate voice audio file using Gemini 2.5 Flash TTS.
 * Creates the file with optional skip-existing check and compression.
 */
export async function generateVoiceFile(
	filename: string,
	text: string,
	outputDir: string,
	client?: GoogleGenAI,
	options?: {
		skipExisting?: boolean;
		sampleRate?: number;
		numChannels?: number;
		bitsPerSample?: number;
		voiceName?: string;
		verbose?: boolean;
	},
): Promise<void> {
	const {
		skipExisting = false,
		sampleRate = 24000,
		numChannels = 1,
		bitsPerSample = 16,
		voiceName = "Kore",
		verbose = true,
	} = options || {};

	const outputPath = path.join(outputDir, filename);

	// Check if file exists and skip if requested
	if (skipExisting && fs.existsSync(outputPath)) {
		if (verbose) console.log(`  ⏭️  Skipping (exists): ${filename}`);
		return;
	}

	if (verbose) {
		console.log(`  🎙️  Generating: ${filename}`);
		if (text.length > 60) {
			console.log(`     Text: "${text.substring(0, 60)}..."`);
		} else {
			console.log(`     Text: "${text}"`);
		}
	}

	// Initialize client if not provided
	const ai = client || initializeClient();

	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash-preview-tts",
			contents: [{ parts: [{ text }] }],
			config: {
				responseModalities: [Modality.AUDIO],
				speechConfig: {
					voiceConfig: {
						prebuiltVoiceConfig: { voiceName },
					},
				},
			},
		});

		const base64Audio =
			response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
		if (!base64Audio) {
			throw new Error(`No audio data in response for ${filename}`);
		}

		const pcmBuffer = Buffer.from(base64Audio, "base64");
		const wavBuffer = createWavFile(
			pcmBuffer,
			sampleRate,
			numChannels,
			bitsPerSample,
		);

		// Ensure output directory exists
		fs.mkdirSync(outputDir, { recursive: true });

		// Write WAV file
		fs.writeFileSync(outputPath, wavBuffer);
		if (verbose) {
			console.log(`  ✅ Created: ${filename} (${wavBuffer.length} bytes)`);
		}

		// Compress to Opus and MP3
		try {
			await compressAudioFile(outputPath);
			if (verbose)
				console.log(
					`  🗜️  Compressed: ${filename.replace(/\.wav$/, "")}.{opus,mp3}`,
				);
		} catch (error) {
			console.warn(`  ⚠️  Compression failed for ${filename}:`, error);
		}
	} catch (error) {
		console.error(`  ❌ Failed to generate ${filename}:`, error);
		throw error;
	}
}

/**
 * Initialize and return a GoogleGenAI client.
 * Reads GEMINI_API_KEY or VITE_GEMINI_API_KEY environment variable.
 */
export function initializeClient(): GoogleGenAI {
	const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
	if (!apiKey) {
		console.error("GEMINI_API_KEY not set");
		process.exit(1);
	}
	return new GoogleGenAI({ apiKey });
}
