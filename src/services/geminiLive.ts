import { GoogleGenAI, Modality } from "@google/genai";
import { PERSONALITIES } from "../data";
import { PersonalityType } from "../types";

/**
 * Gemini Live API Service - Direct Browser Connection
 *
 * Connects directly to Gemini Live API using ephemeral token authentication.
 * No backend proxy needed - runs entirely in the browser.
 *
 * Key features:
 * - Ephemeral token authentication (expires ~1 hour)
 * - Streaming audio via WebSocket
 * - Automatic sample rate handling (24kHz output)
 */

/**
 * Configuration options for Gemini Live API session
 * @interface LiveSessionConfig
 * @property {string} [model] - The model name to use for the session (default: "gemini-2.5-flash-native-audio-latest")
 * @property {string} [systemInstruction] - System prompt that defines AI personality and behavior
 * @property {Record<string, unknown>} [inputAudioTranscription] - Configuration for transcribing user's voice input
 * @property {(text: string, isFinal: boolean) => void} [onInputTranscription] - Callback fired when user speech is transcribed
 */
export interface LiveSessionConfig {
	model?: string;
	systemInstruction?: string;
	inputAudioTranscription?: Record<string, unknown>;
	onInputTranscription?: (text: string, isFinal: boolean) => void;
}

/**
 * Represents a chunk of audio data from Gemini Live API
 * @interface AudioChunk
 * @property {ArrayBuffer} data - Raw audio data as 24kHz 16-bit PCM
 * @property {boolean} isFinal - Whether this is the final chunk in the response
 */
interface AudioChunk {
	data: ArrayBuffer;
	isFinal: boolean;
}

/**
 * Represents a chunk of transcribed text from Gemini Live API
 * @interface TextChunk
 * @property {string} text - Transcribed text content
 * @property {boolean} isFinal - Whether this is the final transcription
 */
interface TextChunk {
	text: string;
	isFinal: boolean;
}

/**
 * Retrieves an ephemeral token from Google's token endpoint for secure WebSocket authentication
 * This enables direct browser-to-API connections without exposing the API key in client-side code
 *
 * @async
 * @param {string} apiKey - The Gemini API key from environment variables
 * @returns {Promise<string>} Ephemeral token valid for ~1 hour
 * @throws {Error} If token request fails or response is invalid
 *
 * @example
 * ```typescript
 * const token = await getEphemeralToken(process.env.VITE_GEMINI_API_KEY);
 * // Use token for WebSocket authentication
 * ```
 */
async function getEphemeralToken(apiKey: string): Promise<string> {
	const response = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/tokens?key=${apiKey}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(
			`Failed to get ephemeral token: ${response.status} ${error.error?.message || response.statusText}`,
		);
	}

	const data = await response.json();

	if (!data.ephemeralToken) {
		throw new Error("No ephemeral token in response");
	}

	return data.ephemeralToken;
}

/**
 * Establishes a WebSocket connection to Gemini Live API for real-time audio streaming
 * Creates a persistent session that generates both audio and text responses simultaneously
 *
 * @async
 * @param {string} prompt - The workflow or text prompt to process
 * @param {PersonalityType} personality - AI personality type that determines response style
 * @returns {Promise<ReadableStream<AudioChunk | TextChunk>>} Stream yielding audio chunks (24kHz PCM) and text transcriptions
 * @throws {Error} If API key is missing, connection fails, or WebSocket errors occur
 *
 * @example
 * ```typescript
 * const stream = await connectToLiveSession("User failed authentication", PersonalityType.ROASTER);
 * const reader = stream.getReader();
 *
 * for await (const chunk of stream) {
 *   if ('data' in chunk) {
 *     // Play audio chunk
 *     playAudio(chunk.data);
 *   } else {
 *     // Handle transcription
 *     console.log(chunk.text);
 *   }
 * }
 * ```
 */
export async function connectToLiveSession(
	prompt: string,
	personality: PersonalityType,
): Promise<ReadableStream<AudioChunk | TextChunk>> {
	const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

	if (!apiKey) {
		throw new Error(
			"Live API: VITE_GEMINI_API_KEY not set. For Vercel: add it in Project → Settings → Environment Variables, then redeploy.",
		);
	}

	// Get personality-specific system instruction
	const systemInstruction = getPersonalityInstruction(personality);

	// Create the AI client - v1alpha required for Live API native audio (per Google docs)
	const ai = new GoogleGenAI({
		apiKey,
		httpOptions: { apiVersion: "v1alpha" as const },
	});

	// Set up the live connection config
	const config: LiveSessionConfig = {
		model: "gemini-2.5-flash-native-audio-latest",
		systemInstruction,
	};

	// Create a custom ReadableStream to handle the audio chunks
	let controller: ReadableStreamController<AudioChunk | TextChunk> | null =
		null;
	let resolveReady: (() => void) | null = null;
	let rejectReady: ((error: Error) => void) | null = null;

	const readyPromise = new Promise<void>((resolve, reject) => {
		resolveReady = resolve;
		rejectReady = reject;
	});

	const stream = new ReadableStream<AudioChunk | TextChunk>({
		start(controller_) {
			controller = controller_;
			if (resolveReady) resolveReady();
		},
		cancel() {
			// Handle stream cancellation
		},
	});

	// Connect to Live API (with timeout to avoid hang - SDK can hang if WS closes before onopen)
	const CONNECT_TIMEOUT_MS = 15000;
	let timeoutId: ReturnType<typeof setTimeout>;
	try {
		await readyPromise;

		const voiceName = PERSONALITIES[personality].voice;
		console.log(
			`[Gemini Live] Using voice "${voiceName}" for personality ${personality}`,
		);

		const model = config.model ?? "models/gemini-2.0-flash-exp";
		const systemInstruction = config.systemInstruction ?? "";
		const connectPromise = ai.live.connect({
			model,
			config: {
				responseModalities: [Modality.AUDIO],
				speechConfig: {
					voiceConfig: { prebuiltVoiceConfig: { voiceName } },
				},
				systemInstruction,
				outputAudioTranscription: {},
				inputAudioTranscription: config.inputAudioTranscription || {},
			},
			callbacks: {
				onopen: () => {
					console.log("[Gemini Live] Connected to Gemini Live API");
				},
				onmessage: (message) => {
					if (!controller) return;

					const modelTurn = message.serverContent?.modelTurn;

					if (modelTurn) {
						// Process audio and text parts
						modelTurn.parts.forEach((part) => {
							// Handle audio chunks
							if (part.inlineData?.data) {
								const binaryString = atob(part.inlineData.data);
								const bytes = new Uint8Array(binaryString.length);
								for (let i = 0; i < binaryString.length; i++) {
									bytes[i] = binaryString.charCodeAt(i);
								}

								const audioChunk: AudioChunk = {
									data: bytes.buffer,
									isFinal: false,
								};
								(
									controller as ReadableStreamDefaultController<
										AudioChunk | TextChunk
									>
								).enqueue(audioChunk);
							}

							// IGNORE all part.text - it's thinking text with markdown
							// Real transcription should come from a different field
						});
					}

					const outputTranscription = (
						message as {
							serverContent?: {
								outputTranscription?: { text?: string } | string;
							};
						}
					).serverContent?.outputTranscription;
					if (outputTranscription) {
						const textContent =
							typeof outputTranscription === "string"
								? outputTranscription
								: outputTranscription.text || "";
						if (textContent) {
							const textChunk: TextChunk = {
								text: textContent,
								isFinal: false,
							};
							(
								controller as ReadableStreamDefaultController<
									AudioChunk | TextChunk
								>
							).enqueue(textChunk);
						}
					}

					// Handle input transcription (user speech to text)
					const inputTranscription = message.serverContent?.inputTranscription;
					if (inputTranscription && config.onInputTranscription) {
						const text = inputTranscription.text || "";
						if (text) {
							const isFinal = message.serverContent?.turnComplete || false;
							config.onInputTranscription(text, isFinal);
						}
					}

					// Handle interruption
					if (message.serverContent?.interrupted) {
						console.log("[Gemini Live] Session interrupted");
					}

					// Check for final response
					if (message.serverContent?.turnComplete) {
						const finalChunk: AudioChunk = {
							data: new ArrayBuffer(0),
							isFinal: true,
						};
						(
							controller as ReadableStreamDefaultController<
								AudioChunk | TextChunk
							>
						).enqueue(finalChunk);
						controller.close();
					}
				},
				onerror: (error) => {
					const err = error instanceof Error ? error : new Error(String(error));
					console.error("[Gemini Live] Error:", err.message, err.stack || "");
					controller?.error(err);
					if (rejectReady) rejectReady(err);
				},
				onclose: (closeEvent) => {
					console.log(
						"[Gemini Live] Connection closed:",
						closeEvent?.code,
						closeEvent?.reason || "",
					);
					if (!controller?.desiredSize) {
						controller?.close();
					}
				},
			},
		});

		const session = await Promise.race([
			connectPromise,
			new Promise<never>((_, reject) => {
				timeoutId = setTimeout(
					() => reject(new Error("Live API connection timeout (15s)")),
					CONNECT_TIMEOUT_MS,
				);
			}),
		]);

		clearTimeout(timeoutId);

		// Send the prompt as a properly formatted turn
		await session.sendClientContent({
			turns: [{ role: "user", parts: [{ text: prompt }] }],
			turnComplete: true,
		});
	} catch (error) {
		console.error("[Gemini Live] Connection failed:", error);
		controller?.error(error);
		throw error;
	}

	return stream;
}

/**
 * Generates system instruction prompts that define AI personality and response style
 * Each personality type has unique tone, vocabulary, and behavioral characteristics
 *
 * @param {PersonalityType} personality - The personality type to generate instructions for
 * @returns {string} Complete system instruction string for Gemini API
 *
 * @example
 * ```typescript
 * const instruction = getPersonalityInstruction(PersonalityType.ROASTER);
 * // Returns: "You are V.E.R.A., the sarcastic AI for \"Roast.exe\"..."
 * ```
 */
function getPersonalityInstruction(personality: PersonalityType): string {
	const baseInstruction =
		"You communicate EXCLUSIVELY via audio. NEVER generate thinking text or markdown formatting. Your ONLY output is your spoken response, which will be automatically transcribed. Speak directly and naturally.";

	const instructions: Record<PersonalityType, string> = {
		[PersonalityType.ROASTER]: `${baseInstruction} You are V.E.R.A., the sarcastic AI for "Roast.exe". British, witty, devastatingly accurate. Vary length and rhythm—sometimes one sharp line, sometimes a short breath—stay concise and natural, never mechanical. Be dry, sardonic, never encouraging.`,

		[PersonalityType.ZEN_MASTER]: `${baseInstruction} You are V.E.R.A., a serene AI guide. Calm tones, Zen koans, water metaphors. Genuine kindness with softly devastating observations. Vary pacing and rhythm while staying spoken and compact—avoid identical cadence every turn.`,

		[PersonalityType.LOVEBOMBER]: `${baseInstruction} You are V.E.R.A., an enthusiastic AI hype person. High-energy, positive, Silicon Valley slang. Say "literally", "slay", "goated", "bestie". Celebrate everything. Mix short bursts with slightly longer hype—vary rhythm so it never sounds templated.`,
	};

	return instructions[personality];
}

/**
 * Fallback function that generates roast text without audio streaming
 * Uses standard Gemini generateContent API when Live API is unavailable or disabled
 * Provides synchronous text response for compatibility with non-streaming workflows
 *
 * @async
 * @param {string} prompt - The workflow text to roast
 * @param {PersonalityType} personality - AI personality type for response style
 * @returns {Promise<string>} Roast text response
 * @throws {Error} If API key is missing or request fails
 *
 * @example
 * ```typescript
 * const roast = await getQuickRoast("User clicked phishing link", PersonalityType.ZEN_MASTER);
 * console.log(roast); // "The spreadsheet of life has many columns..."
 * ```
 */
export async function getQuickRoast(
	prompt: string,
	personality: PersonalityType,
): Promise<string> {
	const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

	if (!apiKey) {
		throw new Error("GEMINI_API_KEY not configured");
	}

	const ai = new GoogleGenAI({ apiKey });
	const systemInstruction = getPersonalityInstruction(personality);

	const result = await ai.models.generateContent({
		model: "gemini-2.0-flash-exp",
		contents: [{ text: prompt }],
		config: {
			systemInstruction,
		},
	});

	return result.text || "";
}

/**
 * Tests Live API availability by attempting to obtain an ephemeral token
 * This pre-flight check ensures the service is operational before attempting connections
 * Useful for feature detection and graceful degradation to TTS fallback
 *
 * @async
 * @returns {Promise<boolean>} True if Live API is accessible, false if unavailable or misconfigured
 *
 * @example
 * ```typescript
 * const available = await checkLiveAPIAvailable();
 * if (available) {
 *   // Use streaming audio
 *   useLiveAPI();
 * } else {
 *   // Fall back to TTS
 *   useTTS();
 * }
 * ```
 */
export async function checkLiveAPIAvailable(): Promise<boolean> {
	try {
		const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
		if (!apiKey) return false;

		// Try to get ephemeral token - if this works, Live API should be available
		await getEphemeralToken(apiKey);
		return true;
	} catch {
		return false;
	}
}
