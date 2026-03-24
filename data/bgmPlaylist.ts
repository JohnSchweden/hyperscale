import { getAudioPath } from "../services/audioUtils";

export type BgmTrack = {
	title: string;
	url: string;
};

/** Base filenames under `public/audio/music/` without extensions (order = play order). */
export const BGM_SOURCE_STEMS = [
	"Chromed Rainfall Cover",
	"Quiet Apogee - AI Music",
] as const;

/** First two words of the stem (e.g. "Chromed Rainfall", "Quiet Apogee"). */
export function bgmDisplayTitleFromStem(stem: string): string {
	const parts = stem.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return stem;
	if (parts.length <= 2) return parts.join(" ");
	return `${parts[0]} ${parts[1]}`;
}

export function getBgmUrl(stem: string): string {
	return getAudioPath(`/audio/music/${encodeURIComponent(stem)}`);
}

/** Ordered playlist: first file, then second, then loops. URLs encode spaces for the browser. */
export const BGM_TRACKS: readonly BgmTrack[] = BGM_SOURCE_STEMS.map((stem) => ({
	title: bgmDisplayTitleFromStem(stem),
	url: getBgmUrl(stem),
}));
