import { getAudioExtension, getAudioMimeType } from "./audioUtils";
import { createRadioSession } from "./radioEffect";

/**
 * Callback type for voice activity state changes
 * @callback VoiceActivityListener
 * @param {boolean} active - True when voice starts playing, false when it stops
 */
type VoiceActivityListener = (active: boolean) => void;

/** Internal set of listeners for voice activity events */
const voiceActivityListeners = new Set<VoiceActivityListener>();

/**
 * Constructs audio file path with appropriate extension based on browser codec support
 * Handles folder structure for different trigger types (archetype, death, feedback, core)
 *
 * @param {string} personalityDir - Base personality directory path (e.g., "/audio/voices/roaster")
 * @param {string} subfolder - Subfolder name or empty string for root level
 * @param {string} trigger - Audio trigger name without extension
 * @returns {string} Complete file path with browser-appropriate extension
 *
 * @example
 * ```typescript
 * const path = getAudioFilePath("/audio/voices/roaster", "archetype", "onboarding");
 * // Returns: "/audio/voices/roaster/archetype/onboarding.opus" (or .mp3)
 * ```
 */
function getAudioFilePath(
	personalityDir: string,
	subfolder: string,
	trigger: string,
): string {
	const basePath = subfolder
		? `${personalityDir}/${subfolder}/${trigger}`
		: `${personalityDir}/${trigger}`;

	return `${basePath}${getAudioExtension()}`;
}

/**
 * Subscribes to voice activity state changes for BGM ducking and UI feedback
 * Allows components to react to voice playback start/stop events
 * Useful for muting background music or showing visual indicators
 *
 * @param {VoiceActivityListener} listener - Callback function for activity changes
 * @returns {() => void} Unsubscribe function to remove the listener
 *
 * @example
 * ```typescript
 * const unsubscribe = subscribeVoiceActivity((active) => {
 *   if (active) {
 *     bgm.setVolume(0.3); // Duck background music
 *   } else {
 *     bgm.setVolume(1.0); // Restore volume
 *   }
 * });
 *
 * // Later: unsubscribe();
 * ```
 */
export function subscribeVoiceActivity(
	listener: VoiceActivityListener,
): () => void {
	voiceActivityListeners.add(listener);
	return () => voiceActivityListeners.delete(listener);
}

/**
 * Internal function to notify all listeners of voice activity state changes
 * @param {boolean} active - New activity state
 */
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

/**
 * Gets or creates the shared AudioContext for voice playback
 * Handles browser compatibility (webkitAudioContext fallback)
 * @returns {AudioContext} The audio context instance
 * @throws {Error} If AudioContext is not supported in the browser
 */
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

/**
 * Determines the appropriate subfolder for a trigger based on naming patterns
 * Organizes audio files into logical categories for better file management
 *
 * @param {string} triggerName - The audio trigger name
 * @returns {string} Subfolder name or empty string for root level
 */
function getSubfolder(triggerName: string): string {
	if (triggerName.startsWith("archetype_")) return "archetype";
	if (triggerName.startsWith("death_")) return "death";
	if (triggerName.startsWith("feedback_")) return "feedback";
	if (["onboarding", "victory", "failure"].includes(triggerName)) return "core";
	return ""; // Fallback to root (for backwards compatibility)
}

/**
 * Loads and prepares a voice audio file for playback with radio effects
 * Fetches audio from server, creates radio session, and sets up audio routing
 * Handles browser codec detection and AudioContext management
 *
 * @async
 * @param {string} personality - Personality name (e.g., "roaster", "zenmaster", "lovebomber")
 * @param {string} trigger - Audio trigger name (e.g., "onboarding", "victory", "archetype_weak")
 * @throws {Error} If audio file not found, network fails, or audio context issues occur
 *
 * @example
 * ```typescript
 * await loadVoice("roaster", "onboarding");
 * await playVoice(); // Plays with radio effect
 * ```
 */
export async function loadVoice(
	personality: string,
	trigger: string,
): Promise<void> {
	const basePath = "/audio/voices";
	const personalityDir = `${basePath}/${personality.toLowerCase().replace(/_/g, "")}`;

	const subfolder = getSubfolder(trigger);
	const filePath = getAudioFilePath(personalityDir, subfolder, trigger);

	console.log(`[Voice] Loading: ${filePath}`);

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
		const audioBlob = new Blob([audioData], { type: getAudioMimeType() });
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

/**
 * Starts playback of the currently loaded voice audio
 * Resumes AudioContext if suspended and emits voice activity events
 * Safe to call multiple times - handles already-playing state gracefully
 *
 * @async
 * @throws {Error} If no audio is loaded or playback fails
 *
 * @example
 * ```typescript
 * await loadVoice("roaster", "victory");
 * await playVoice(); // Starts playback with radio effects
 * ```
 */
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

/**
 * Immediately stops voice playback and cleans up resources
 * Stops radio effects, releases audio resources, and emits activity end event
 * Safe to call even when no voice is playing
 *
 * @example
 * ```typescript
 * stopVoice(); // Stops playback and cleans up
 * ```
 */
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

/**
 * Checks if voice audio is currently playing
 * Returns false if paused, stopped, or no audio loaded
 *
 * @returns {boolean} True if voice is actively playing, false otherwise
 *
 * @example
 * ```typescript
 * if (isPlaying()) {
 *   console.log("Voice is currently speaking");
 * }
 * ```
 */
export function isPlaying(): boolean {
	return currentAudio !== null && !currentAudio.paused;
}
