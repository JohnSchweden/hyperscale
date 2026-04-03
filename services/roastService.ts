import { PersonalityType } from "../types";
import { connectToLiveSession } from "./geminiLive";
import { getRoast, speak } from "./geminiService";
import { createRadioSession } from "./radioEffect";

const TTS_FALLBACK_ENABLED =
	import.meta.env.VITE_TTS_FALLBACK_ENABLED === "true";
const LIVE_API_ENABLED = import.meta.env.VITE_ENABLE_LIVE_API === "true";

/**
 * Voice mapping for TTS fallback when Live API is unavailable
 * Maps personality types to ElevenLabs voice names for consistent character representation
 * @constant {Record<PersonalityType, string>}
 */
const VOICE_MAP: Record<PersonalityType, string> = {
	[PersonalityType.ROASTER]: "Kore",
	[PersonalityType.ZEN_MASTER]: "Puck",
	[PersonalityType.LOVEBOMBER]: "Enceladus",
};

/**
 * Error message patterns that trigger automatic fallback to standard TTS
 * Covers authentication failures, rate limits, network issues, and API unavailability
 * @constant {string[]}
 */
const FALLBACK_ERROR_CODES = [
	"WebSocket connection error",
	"401",
	"403",
	"429",
	"rate limit",
	"timeout",
	"network error",
	"fetch failed",
	"token",
	"authentication",
	"not authenticated",
	"api key",
	"ephemeral",
	"live api not enabled",
	"live api unavailable",
];

/**
 * Determines if an error warrants falling back to TTS instead of Live API
 * Checks error message against known patterns that indicate API unavailability
 *
 * @param {unknown} error - The error object or message to evaluate
 * @returns {boolean} True if fallback should be triggered, false otherwise
 *
 * @example
 * ```typescript
 * try {
 *   await connectToLiveAPI();
 * } catch (error) {
 *   if (shouldFallback(error)) {
 *     await useTTSFallback();
 *   }
 * }
 * ```
 */
function shouldFallback(error: unknown): boolean {
	const errorMessage = error instanceof Error ? error.message : String(error);
	const lowerMessage = errorMessage.toLowerCase();

	return FALLBACK_ERROR_CODES.some((code) =>
		lowerMessage.includes(code.toLowerCase()),
	);
}

/** Delay before radio effect intro when using Live API (seconds) */
const LIVE_API_RADIO_DELAY_S = 1.5;

/**
 * Streams roast text and audio simultaneously from Gemini Live API
 * Creates radio effect with noise, processes real-time audio chunks, and handles transcription
 * Automatically manages AudioContext lifecycle and radio session cleanup
 *
 * @async
 * @param {string} workflow - User workflow text to roast
 * @param {PersonalityType} personality - AI personality for response style
 * @param {(text: string) => void} onTextChunk - Callback for each text chunk as it's transcribed
 * @returns {Promise<string>} Complete roast text when streaming finishes
 * @throws {Error} If Live API is disabled, connection fails, or audio context issues occur
 *
 * @example
 * ```typescript
 * const fullText = await streamFromLiveAPI(
 *   "User entered wrong password 3 times",
 *   PersonalityType.ROASTER,
 *   (chunk) => console.log("Received:", chunk)
 * );
 * ```
 */
async function streamFromLiveAPI(
	workflow: string,
	personality: PersonalityType,
	onTextChunk: (text: string) => void,
): Promise<string> {
	if (!LIVE_API_ENABLED) {
		throw new Error("Live API not enabled - forcing TTS fallback");
	}

	console.log(
		`[roastService] streamFromLiveAPI called with personality: ${personality}`,
	);
	const audioContext = new AudioContext({ sampleRate: 24000 });
	const radio = createRadioSession(audioContext, {
		delaySeconds: LIVE_API_RADIO_DELAY_S,
	});
	radio.start();

	const stream = await connectToLiveSession(workflow, personality);
	const reader = stream.getReader();

	let playedAnyChunk = false;

	const playAudioChunk = async (buffer: ArrayBuffer) => {
		if (buffer.byteLength === 0) return;

		const int16Array = new Int16Array(buffer);
		const float32Array = new Float32Array(int16Array.length);
		for (let i = 0; i < int16Array.length; i++) {
			float32Array[i] = int16Array[i] / 32768.0;
		}

		const audioBuffer = audioContext.createBuffer(
			1,
			float32Array.length,
			24000,
		);
		audioBuffer.getChannelData(0).set(float32Array);

		const source = audioContext.createBufferSource();
		source.buffer = audioBuffer;
		source.connect(radio.voiceInput);

		const startTime = radio.scheduleChunk(audioBuffer.duration);
		source.start(startTime);
		playedAnyChunk = true;
	};

	let fullText = "";

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			if (value && "text" in value && value.text) {
				fullText += value.text;
				onTextChunk(value.text);
			}

			if (value && "data" in value && value.data.byteLength > 0) {
				await playAudioChunk(value.data);
			}
		}
	} finally {
		if (playedAnyChunk) {
			await radio.end();
		}
		await audioContext.close();
	}

	return fullText;
}

/**
 * High-level function for getting roast with streaming audio and text
 * Direct wrapper around Live API streaming functionality
 * Provides clean interface for components that need real-time feedback
 *
 * @async
 * @param {string} workflow - User workflow text to roast
 * @param {PersonalityType} personality - AI personality type
 * @param {(text: string) => void} onTextChunk - Callback for incremental text updates
 * @returns {Promise<string>} Complete roast text
 * @throws {Error} If Live API connection fails or is unavailable
 *
 * @example
 * ```typescript
 * const roast = await getRoastWithStreaming(
 *   workflow,
 *   personality,
 *   (chunk) => updateUI(chunk)
 * );
 * ```
 */
export async function getRoastWithStreaming(
	workflow: string,
	personality: PersonalityType,
	onTextChunk: (text: string) => void,
): Promise<string> {
	return streamFromLiveAPI(workflow, personality, onTextChunk);
}

/**
 * Gets roast with automatic fallback from Live API to standard TTS
 * First attempts Live API streaming, falls back to TTS on authentication/network errors
 * Handles error detection and personality-to-voice mapping automatically
 *
 * @async
 * @param {string} workflow - User workflow text to roast
 * @param {PersonalityType} personality - AI personality type
 * @param {(text: string) => void} onTextChunk - Callback for text chunks (immediate for TTS, streaming for Live API)
 * @returns {Promise<string>} Complete roast text
 * @throws {Error} Only if both Live API and TTS fallback fail
 *
 * @example
 * ```typescript
 * try {
 *   const roast = await getRoastWithFallback(workflow, personality, updateUI);
 *   // Works whether Live API or TTS is used
 * } catch (error) {
 *   console.error("Both streaming and TTS failed:", error);
 * }
 * ```
 */
export async function getRoastWithFallback(
	workflow: string,
	personality: PersonalityType,
	onTextChunk: (text: string) => void,
): Promise<string> {
	try {
		return await streamFromLiveAPI(workflow, personality, onTextChunk);
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : String(error);
		const errStack = error instanceof Error ? error.stack : "";
		console.warn(
			"[roastService] Live API unavailable, falling back to TTS. Error:",
			errMsg,
			errStack ? `\n${errStack}` : "",
		);

		if (TTS_FALLBACK_ENABLED && shouldFallback(error)) {
			const roastText = await getRoast(workflow, personality);
			onTextChunk(roastText);
			const voiceName = VOICE_MAP[personality];
			await speak(roastText, voiceName);
			return roastText;
		}
		throw error;
	}
}

/**
 * Gets roast text only without any audio playback
 * Useful when audio is disabled or for text-only interfaces
 * Bypasses all audio processing and goes directly to the roast API
 *
 * @async
 * @param {string} workflow - User workflow text to roast
 * @param {PersonalityType} personality - AI personality type
 * @returns {Promise<string>} Roast text response
 * @throws {Error} If roast API request fails
 *
 * @example
 * ```typescript
 * const textOnly = await getRoastTextOnly(workflow, personality);
 * displayText(textOnly); // No audio, just text
 * ```
 */
export async function getRoastTextOnly(
	workflow: string,
	personality: PersonalityType,
): Promise<string> {
	return getRoast(workflow, personality);
}
