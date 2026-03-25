/**
 * Audio utilities for browser environments.
 */

/** Create an AudioContext with vendor prefix fallback */
export function createAudioContext(): AudioContext | null {
	const AudioCtx =
		window.AudioContext ??
		(window as Window & { webkitAudioContext?: typeof AudioContext })
			.webkitAudioContext;
	return AudioCtx ? new AudioCtx() : null;
}
