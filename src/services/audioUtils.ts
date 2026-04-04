/**
 * Shared audio utilities for format detection
 */

let _supportsOpus: boolean | null = null;

/**
 * Check if browser supports Opus codec
 * Tests multiple container formats for cross-browser compatibility
 */
export function supportsOpus(): boolean {
	if (_supportsOpus !== null) return _supportsOpus;
	if (typeof window === "undefined") {
		_supportsOpus = false;
		return false;
	}

	const audio = new Audio();
	// Check Ogg Opus (most common - Chrome, Firefox, Edge)
	const oggSupport = audio.canPlayType('audio/ogg; codecs="opus"');
	// Check WebM Opus (alternative)
	const webmSupport = audio.canPlayType('audio/webm; codecs="opus"');
	// Safari uses CAF container for Opus
	const cafSupport = audio.canPlayType("audio/x-caf");

	_supportsOpus =
		oggSupport === "probably" ||
		webmSupport === "probably" ||
		cafSupport === "probably" ||
		oggSupport === "maybe" ||
		webmSupport === "maybe";
	return _supportsOpus;
}

/**
 * Get the appropriate audio extension based on browser support
 * @returns ".opus" or ".mp3"
 */
export function getAudioExtension(): ".opus" | ".mp3" {
	return supportsOpus() ? ".opus" : ".mp3";
}

export function getAudioMimeType(): "audio/opus" | "audio/mpeg" {
	return supportsOpus() ? "audio/opus" : "audio/mpeg";
}

/**
 * Convert a base audio path to the appropriate format
 * Replaces any existing extension with the browser-supported one
 * @param basePath - Path without extension or with any audio extension
 * @returns Path with correct extension for current browser
 */
export function getAudioPath(basePath: string): string {
	// Remove any existing audio extension
	const pathWithoutExt = basePath.replace(
		/\.(mp3|opus|ogg|wav|m4a|flac)$/i,
		"",
	);
	return `${pathWithoutExt}${getAudioExtension()}`;
}
