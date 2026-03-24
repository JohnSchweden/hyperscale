import { createRadioSession } from "./radioEffect";

type VoiceActivityListener = (active: boolean) => void;
const voiceActivityListeners = new Set<VoiceActivityListener>();

/**
 * Check if browser supports Opus codec
 */
function supportsOpus(): boolean {
	const audio = new Audio();
	// Check Ogg Opus (most common)
	const oggSupport = audio.canPlayType('audio/ogg; codecs="opus"');
	// Check WebM Opus (alternative)
	const webmSupport = audio.canPlayType('audio/webm; codecs="opus"');
	// Safari uses CAF container for Opus
	const cafSupport = audio.canPlayType("audio/x-caf");

	return (
		oggSupport === "probably" ||
		webmSupport === "probably" ||
		cafSupport === "probably" ||
		oggSupport === "maybe" ||
		webmSupport === "maybe"
	);
}

/**
 * Get the appropriate audio file path based on browser support
 */
function getAudioFilePath(
	personalityDir: string,
	subfolder: string,
	trigger: string,
): string {
	const basePath = subfolder
		? `${personalityDir}/${subfolder}/${trigger}`
		: `${personalityDir}/${trigger}`;

	// Check for Opus support
	if (supportsOpus()) {
		return `${basePath}.opus`;
	}

	// Fallback to MP3
	return `${basePath}.mp3`;
}

/** BGM ducking: subscribe to voice playback start/end (not pause glitches during teardown). */
export function subscribeVoiceActivity(
	listener: VoiceActivityListener,
): () => void {
	voiceActivityListeners.add(listener);
	return () => voiceActivityListeners.delete(listener);
}

function emitVoiceActivity(active: boolean) {
	for (const fn of voiceActivityListeners) {
		try {
			fn(active);
		} catch (e) {
			console.error("[Voice] voice activity listener:", e);
		}
	}
}

let audioContext: AudioContext | null = null;
let currentAudio: HTMLAudioElement | null = null;
let currentRadio: ReturnType<typeof createRadioSession> | null = null;
let currentBlobUrl: string | null = null;

const VOLUME = 0.4; // 40%
const QUINDAR_INTRO_MS = 250;

const ERROR_MESSAGES: Record<string, string> = {
	roaster: "V.E.R.A. voice module malfunctioned",
	zenmaster: "The silence of the spreadsheets is deafening",
	lovebomber: "OMG the audio broke!! But we still love you!!",
};

function getOrCreateContext(): AudioContext {
	if (!audioContext) {
		const Ctx =
			window.AudioContext ??
			(window as Window & { webkitAudioContext?: typeof AudioContext })
				.webkitAudioContext;
		if (!Ctx) throw new Error("AudioContext not supported");
		audioContext = new Ctx();
	}
	return audioContext;
}

export async function loadVoice(
	personality: string,
	trigger: string,
): Promise<void> {
	const basePath = "/audio/voices";
	const personalityDir = `${basePath}/${personality.toLowerCase().replace(/_/g, "")}`;

	// Determine subfolder based on trigger prefix
	function getSubfolder(triggerName: string): string {
		if (triggerName.startsWith("archetype_")) return "archetype";
		if (triggerName.startsWith("death_")) return "death";
		if (triggerName.startsWith("feedback_")) return "feedback";
		// Core triggers: onboarding, victory, failure
		if (["onboarding", "victory", "failure"].includes(triggerName))
			return "core";
		return ""; // Fallback to root (for backwards compatibility)
	}

	const subfolder = getSubfolder(trigger);
	const filePath = getAudioFilePath(personalityDir, subfolder, trigger);
	const format = filePath.endsWith(".opus") ? "opus" : "mp3";

	console.log(`[Voice] Loading: ${filePath} (${format})`);

	try {
		const response = await fetch(filePath);
		console.log(`[Voice] Response status: ${response.status}`);

		if (!response.ok) {
			const personalityKey = personality.toLowerCase().replace(/_/g, "");
			throw new Error(
				`HTTP ${response.status}: ${ERROR_MESSAGES[personalityKey] || "Voice module error"}`,
			);
		}

		const arrayBuffer = await response.arrayBuffer();
		console.log("[Voice] Buffer size:", arrayBuffer.byteLength);

		if (currentBlobUrl) {
			URL.revokeObjectURL(currentBlobUrl);
			currentBlobUrl = null;
		}
		if (currentAudio) {
			currentAudio.pause();
			currentAudio = null;
			emitVoiceActivity(false);
		}
		if (currentRadio) {
			currentRadio.stop();
			currentRadio = null;
		}

		const audioData = new Uint8Array(arrayBuffer);
		// Use appropriate MIME type based on file extension
		const mimeType = filePath.endsWith(".opus") ? "audio/opus" : "audio/mpeg";
		const audioBlob = new Blob([audioData], { type: mimeType });
		const audioUrl = URL.createObjectURL(audioBlob);
		currentBlobUrl = audioUrl;

		const ctx = getOrCreateContext();
		if (ctx.state === "suspended") {
			await ctx.resume();
		}

		const radio = createRadioSession(ctx, { delaySeconds: 0 });
		radio.start();
		currentRadio = radio;

		const audio = new Audio(audioUrl);
		audio.volume = VOLUME;
		currentAudio = audio;

		const mediaSource = ctx.createMediaElementSource(audio);
		mediaSource.connect(radio.voiceInput);

		audio.oncanplaythrough = () => {
			console.log("[Voice] Audio can play through");
		};
		audio.onerror = (e) => {
			console.error("[Voice] Audio error:", e);
		};
		audio.onended = () => {
			currentRadio?.end();
			currentRadio = null;
			emitVoiceActivity(false);
		};

		setTimeout(() => {
			audio
				.play()
				.then(() => {
					console.log("[Voice] Play started at volume:", VOLUME);
					emitVoiceActivity(true);
				})
				.catch(() => {
					emitVoiceActivity(false);
				});
		}, QUINDAR_INTRO_MS);

		return;
	} catch (error) {
		console.error("[Voice Error]", error);
		throw new Error(
			ERROR_MESSAGES[personality.toLowerCase().replace(/_/g, "")] ||
				"Voice module error",
		);
	}
}

export async function playVoice(): Promise<void> {
	if (!currentAudio) {
		console.log("[Voice] No source to play");
		return;
	}

	try {
		await currentAudio.play();
		console.log("[Voice] Play resumed");
		emitVoiceActivity(true);
	} catch (e) {
		console.error("[Voice] Play error:", e);
		emitVoiceActivity(false);
	}
}

export function stopVoice(): void {
	if (currentRadio) {
		currentRadio.stop();
		currentRadio = null;
	}
	if (currentAudio) {
		try {
			currentAudio.pause();
			currentAudio.currentTime = 0;
		} catch (e) {
			console.error("Error stopping voice:", e);
		}
		currentAudio = null;
	}
	if (currentBlobUrl) {
		URL.revokeObjectURL(currentBlobUrl);
		currentBlobUrl = null;
	}
	emitVoiceActivity(false);
}

export function isPlaying(): boolean {
	return currentAudio !== null && !currentAudio.paused;
}
