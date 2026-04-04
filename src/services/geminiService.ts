import type { PersonalityType } from "../types";
import { createRadioSession } from "./radioEffect";

function decode(base64: string) {
	const binaryString = atob(base64);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes;
}

async function decodeAudioData(
	data: Uint8Array,
	ctx: AudioContext,
	sampleRate: number,
	numChannels: number,
): Promise<AudioBuffer> {
	const dataInt16 = new Int16Array(data.buffer);
	const frameCount = dataInt16.length / numChannels;
	const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

	for (let channel = 0; channel < numChannels; channel++) {
		const channelData = buffer.getChannelData(channel);
		for (let i = 0; i < frameCount; i++) {
			channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
		}
	}
	return buffer;
}

let audioContext: AudioContext | null = null;
let activeSources: AudioBufferSourceNode[] = [];

/**
 * Speaks the given text using the Gemini TTS API.
 * @param text - The text to speak
 * @param voiceName - The voice to use (default: "Kore")
 */
export const speak = async (text: string, voiceName: string = "Kore") => {
	if (import.meta.env.VITE_ENABLE_SPEECH === "false") return;
	try {
		const response = await fetch("/api/speak", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ text, voiceName }),
		});

		const data = await response.json();

		if (data.error) {
			console.error("TTS Error:", data.error);
			return;
		}

		if (data.audio) {
			if (!audioContext) {
				const Ctx =
					window.AudioContext ??
					(window as Window & { webkitAudioContext?: typeof AudioContext })
						.webkitAudioContext;
				if (!Ctx) throw new Error("AudioContext not supported");
				audioContext = new Ctx({ sampleRate: 24000 });
			}

			if (audioContext.state === "suspended") {
				await audioContext.resume();
			}

			const audioBuffer = await decodeAudioData(
				decode(data.audio),
				audioContext,
				24000,
				1,
			);

			const radio = createRadioSession(audioContext, { delaySeconds: 0 });
			radio.start();

			const source = audioContext.createBufferSource();
			source.buffer = audioBuffer;
			source.connect(radio.voiceInput);

			const startTime = radio.scheduleChunk(audioBuffer.duration);
			source.start(startTime);

			activeSources.push(source);
			source.onended = () => {
				const index = activeSources.indexOf(source);
				if (index > -1) {
					activeSources.splice(index, 1);
				}
				radio.end();
			};
		}
	} catch (error) {
		console.error("TTS Error:", error);
	}
};

/**
 * Cleans up audio resources and closes the audio context.
 */
export const cleanupAudio = () => {
	activeSources.forEach((source) => {
		try {
			source.stop();
		} catch {}
	});
	activeSources = [];

	if (audioContext && audioContext.state !== "closed") {
		audioContext.close().catch(console.error);
		audioContext = null;
	}
};

/**
 * Gets a roast response for the given workflow and personality.
 * @param workflow - The workflow text to roast
 * @param personality - The AI personality type
 * @returns Promise resolving to the roast text
 */
export const getRoast = async (
	workflow: string,
	personality: PersonalityType,
): Promise<string> => {
	try {
		const response = await fetch("/api/roast", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ workflow, personality }),
		});

		const text = await response.text();
		const contentType = response.headers.get("content-type") ?? "";
		if (!contentType.includes("application/json")) {
			console.error("Roast Error:", response.status, text.slice(0, 200));
			return "Roast disabled: Server error.";
		}

		const data = JSON.parse(text) as { error?: string; text?: string };

		if (data.error) {
			console.error("Roast Error:", data.error);
			return "Roast disabled: Server configuration error.";
		}

		return data.text || "Even for you, this is remarkably insecure.";
	} catch (error) {
		console.error("Roast Error:", error);
		return "Roast disabled: Could not connect to server.";
	}
};
