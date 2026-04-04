import { getAudioPath } from "../services/audioUtils";

/**
 * Represents a background music track with title and URL.
 */
export type BgmTrack = {
	title: string;
	url: string;
};

/**
 * Base filenames for BGM tracks under `public/audio/music/` without extensions.
 * Order determines play order in the playlist.
 */
export const BGM_SOURCE_STEMS = [
	"Chromed Rainfall Cover",
	"Quiet Apogee - AI Music",
] as const;

/**
 * Extracts the display title from a BGM stem by taking the first two words.
 * @param stem - The BGM filename stem
 * @returns The display title (first two words or full stem if fewer)
 * @example
 * bgmDisplayTitleFromStem("Chromed Rainfall Cover") // "Chromed Rainfall"
 */
export function bgmDisplayTitleFromStem(stem: string): string {
	const parts = stem.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return stem;
	if (parts.length <= 2) return parts.join(" ");
	return `${parts[0]} ${parts[1]}`;
}

/**
 * Generates the URL for a BGM track from its stem filename.
 * @param stem - The BGM filename stem
 * @returns The full URL to the audio file
 */
export function getBgmUrl(stem: string): string {
	return getAudioPath(`/audio/music/${encodeURIComponent(stem)}`);
}

/**
 * Ordered playlist of BGM tracks. Plays in sequence and loops.
 * URLs are properly encoded for browser compatibility.
 */
export const BGM_TRACKS: readonly BgmTrack[] = BGM_SOURCE_STEMS.map((stem) => ({
	title: bgmDisplayTitleFromStem(stem),
	url: getBgmUrl(stem),
}));
