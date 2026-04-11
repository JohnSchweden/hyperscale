import { getAudioExtension } from "./audioUtils";
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
 * Notify all voice-activity listeners from external audio paths (e.g. roast TTS)
 * that don't go through loadVoice. Allows BGM ducking to apply to all voice audio.
 */
export function notifyVoiceActivity(active: boolean): void {
	emitVoiceActivity(active);
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

/** BGM should refresh output after mic capture ends (iOS / mobile AEC, no voice-duck toggle). */
const bgmAfterMicReleaseListeners = new Set<() => void>();

/**
 * Subscribe to mic-release events so BGM can resume AudioContext and re-apply gain.
 * Fires before notifyVoiceActivity(false) so BGM AudioContext / element recover on iOS.
 */
export function subscribeBgmAfterMicRelease(listener: () => void): () => void {
	bgmAfterMicReleaseListeners.add(listener);
	return () => bgmAfterMicReleaseListeners.delete(listener);
}

export function notifyBgmAfterMicRelease(): void {
	for (const fn of bgmAfterMicReleaseListeners) {
		try {
			fn();
		} catch (e) {
			console.error("[Voice] bgm after mic release listener:", e);
		}
	}
}

// Hoisted regex for personality key normalization (js-hoist-regexp)
const PERSONALITY_KEY_REGEX = /_/g;

let audioContext: AudioContext | null = null;
// AudioBufferSourceNode — replaces HTMLAudioElement so we can schedule via the
// AudioContext timeline without needing a gesture per-play (iOS blocks HTMLMediaElement.play()
// when called from setTimeout, outside the original gesture window).
let currentSource: AudioBufferSourceNode | null = null;
let currentRadio: ReturnType<typeof createRadioSession> | null = null;

const VOLUME = 0.4; // 40%

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
 * Decodes audio data with fallback for older iOS Safari that only supports
 * the callback-based form of decodeAudioData (not the Promise-returning form).
 */
function decodeAudioDataCompat(
	ctx: AudioContext,
	buffer: ArrayBuffer,
): Promise<AudioBuffer> {
	return new Promise((resolve, reject) => {
		ctx.decodeAudioData(buffer, resolve, reject);
	});
}

/**
 * Ensures the AudioContext is in "running" state, waiting up to 600ms after resume.
 * iOS may keep the context suspended even after ctx.resume() resolves when called
 * outside a direct user-gesture handler.
 */
async function ensureContextRunning(ctx: AudioContext): Promise<void> {
	if (ctx.state === "running") return;
	if (ctx.state === "suspended") {
		try {
			await ctx.resume();
		} catch {
			/* ignore — we'll check state below */
		}
	}
	if ((ctx.state as AudioContextState) !== "running") {
		await new Promise<void>((resolve) => {
			const POLL_MS = 50;
			const TIMEOUT_MS = 600;
			const start = Date.now();
			const poll = setInterval(() => {
				if (ctx.state === "running" || Date.now() - start >= TIMEOUT_MS) {
					clearInterval(poll);
					resolve();
				}
			}, POLL_MS);
		});
	}
}

/**
 * Eagerly resumes the voice AudioContext from a synchronous user-gesture handler.
 * Call this on touchstart/click at the document level to ensure the context is
 * running before the async loadVoice chain fires (iOS requires gesture-context).
 */
export function resumeVoiceContext(): void {
	try {
		const ctx = getOrCreateContext();
		if (ctx.state === "suspended") {
			void ctx.resume();
		}
	} catch {
		// AudioContext not yet created or not supported — no-op
	}
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
	if (triggerName.startsWith("feedback_")) {
		if (
			triggerName.startsWith("feedback_hos_") ||
			triggerName.startsWith("feedback_explainability_hos_") ||
			triggerName.startsWith("feedback_shadow_ai_hos_") ||
			triggerName.startsWith("feedback_synthetic_data_hos_")
		)
			return "feedback/hos";
		if (triggerName.startsWith("feedback_ae_")) return "feedback/ae";
		if (triggerName.startsWith("feedback_cso_")) return "feedback/cso";
		if (triggerName.startsWith("feedback_se_")) return "feedback/se";
		if (triggerName.startsWith("feedback_tac_")) return "feedback/tac";
		if (triggerName.startsWith("feedback_vc_")) return "feedback/vc";
		if (triggerName.startsWith("feedback_ve_")) return "feedback/ve";
		if (triggerName.startsWith("feedback_ds_")) return "feedback/ds";
		if (triggerName.startsWith("feedback_sm_")) return "feedback/sm";
		if (triggerName.startsWith("feedback_consultant_"))
			return "feedback/consultant";
		if (triggerName.startsWith("feedback_kirk")) return "feedback/kirk";
		return "feedback"; // generic: debug, ignore, install, paste
	}
	if (
		triggerName === "onboarding" ||
		/^onboarding_[1-9]\d*$/.test(triggerName) ||
		["victory", "failure"].includes(triggerName)
	)
		return "core";
	return ""; // Fallback to root (for backwards compatibility)
}

/**
 * Loads and plays a voice audio file with radio effects.
 * Uses AudioBufferSourceNode (decoded via decodeAudioData) instead of HTMLAudioElement,
 * so playback is scheduled through the AudioContext timeline — no per-play gesture needed
 * on iOS once the context is running (primed by resumeVoiceContext on touchstart).
 *
 * @async
 * @param {string} personality - Personality name (e.g., "roaster", "zenmaster", "lovebomber")
 * @param {string} trigger - Audio trigger name (e.g., "onboarding", "victory", "archetype_weak")
 * @throws {Error} If audio file not found, network fails, or audio context issues occur
 */
export async function loadVoice(
	personality: string,
	trigger: string,
): Promise<void> {
	const basePath = "/audio/voices";
	// Cache personality key computation (js-cache-function-results)
	const personalityKey = personality
		.toLowerCase()
		.replace(PERSONALITY_KEY_REGEX, "");
	const personalityDir = `${basePath}/${personalityKey}`;

	const subfolder = getSubfolder(trigger);
	const filePath = getAudioFilePath(personalityDir, subfolder, trigger);

	console.log(`[Voice] Loading: ${filePath}`);

	try {
		const response = await fetch(filePath);
		console.log(`[Voice] Response status: ${response.status}`);

		if (!response.ok) {
			throw new Error(
				`HTTP ${response.status}: ${ERROR_MESSAGES[personalityKey] || "Voice module error"}`,
			);
		}

		const arrayBuffer = await response.arrayBuffer();
		console.log("[Voice] Buffer size:", arrayBuffer.byteLength);

		// Stop any previous playback
		if (currentSource) {
			try {
				currentSource.stop();
			} catch {
				/* already stopped */
			}
			currentSource = null;
			emitVoiceActivity(false);
		}
		if (currentRadio) {
			currentRadio.stop();
			currentRadio = null;
		}

		const ctx = getOrCreateContext();
		await ensureContextRunning(ctx);

		try {
			const audioBuffer = await decodeAudioDataCompat(ctx, arrayBuffer);

			const radio = createRadioSession(ctx, { delaySeconds: 0 });
			const voiceStartTime = radio.start();
			currentRadio = radio;

			const source = ctx.createBufferSource();
			source.buffer = audioBuffer;

			const gainNode = ctx.createGain();
			gainNode.gain.value = VOLUME;
			source.connect(gainNode);
			gainNode.connect(radio.voiceInput);

			source.start(voiceStartTime);
			currentSource = source;

			emitVoiceActivity(true);

			// Capture local refs so onended/fallback only clean up THIS session.
			// If a new loadVoice call preempts this one, currentSource will no longer
			// match capturedSource, and stale cleanup is safely skipped.
			const capturedSource = source;
			const capturedRadio = radio;

			// iOS sometimes never fires onended — duration-based fallback.
			// Voice starts after QUINDAR_DURATION_S (0.25s) intro, so add 0.25s +
			// 500ms grace to ensure the fallback fires AFTER actual audio ends.
			const fallbackMs = (audioBuffer.duration + 0.75) * 1000;
			let endedFired = false;

			const doCleanup = () => {
				void capturedRadio.end();
				if (currentRadio === capturedRadio) currentRadio = null;
				if (currentSource === capturedSource) currentSource = null;
				emitVoiceActivity(false);
			};

			const endedTimeout = setTimeout(() => {
				if (endedFired || currentSource !== capturedSource) return;
				endedFired = true;
				doCleanup();
			}, fallbackMs);

			source.onended = () => {
				if (endedFired || currentSource !== capturedSource) return;
				endedFired = true;
				clearTimeout(endedTimeout);
				doCleanup();
			};

			return;
		} catch (decodeError) {
			currentRadio?.stop();
			currentRadio = null;
			emitVoiceActivity(false);
			throw decodeError;
		}
	} catch (error) {
		console.error("[Voice Error]", error);
		// Use cached personalityKey instead of recomputing (js-cache-function-results)
		throw new Error(ERROR_MESSAGES[personalityKey] || "Voice module error");
	}
}

/**
 * No-op kept for API compatibility — playback is fully scheduled inside loadVoice.
 */
export async function playVoice(): Promise<void> {
	// Playback is scheduled during loadVoice via AudioBufferSourceNode.start().
	// This function is intentionally empty; callers in runVoiceCue still call it.
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
	if (currentSource) {
		try {
			currentSource.stop();
		} catch {
			/* already stopped */
		}
		currentSource = null;
	}
	emitVoiceActivity(false);
}

/**
 * Checks if voice audio is currently playing
 * Returns false if stopped or no audio loaded
 *
 * @returns {boolean} True if voice is actively playing, false otherwise
 */
export function isPlaying(): boolean {
	return currentSource !== null;
}
