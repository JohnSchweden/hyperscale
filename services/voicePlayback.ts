import { createRadioSession } from "./radioEffect";

type VoiceActivityListener = (active: boolean) => void;
const voiceActivityListeners = new Set<VoiceActivityListener>();

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
	const filename = `${trigger}.wav`;
	const filePath = `${personalityDir}/${filename}`;

	console.log("[Voice] Loading:", filePath);

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
		const audioBlob = new Blob([audioData], { type: "audio/wav" });
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
