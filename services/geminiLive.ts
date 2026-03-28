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

export interface LiveSessionConfig {
	model?: string;
	systemInstruction?: string;
	inputAudioTranscription?: Record<string, unknown>;
	onInputTranscription?: (text: string, isFinal: boolean) => void;
}

interface AudioChunk {
	data: ArrayBuffer;
	isFinal: boolean;
}

interface TextChunk {
	text: string;
	isFinal: boolean;
}

/**
 * Get ephemeral token from Google API
 * This allows direct browser connection without exposing the API key in WebSocket
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
 * Connect to Gemini Live API and return streaming audio
 *
 * @param prompt - The text prompt to send to Gemini
 * @param personality - The personality type for tone/instruction
 * @returns ReadableStream of audio chunks
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
 * Generate personality-specific system instruction
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
 * Simple function to get a quick roast response (non-streaming fallback)
 * Uses standard generateContent for when Live API is unavailable
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
 * Check if the Live API is available
 * Returns true if we can connect, false otherwise
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
