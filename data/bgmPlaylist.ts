export type BgmTrack = {
	title: string;
	url: string;
};

/** Filenames under `public/audio/music/` (order = play order). */
export const BGM_SOURCE_FILENAMES = [
	"Chromed Rainfall Cover.mp3",
	"Quiet Apogee - AI Music.mp3",
] as const;

function stemFromFilename(filename: string): string {
	return filename.replace(/\.(mp3|m4a|ogg|wav|flac)$/i, "");
}

/** First two words of the filename stem (e.g. "Chromed Rainfall", "Quiet Apogee"). */
export function bgmDisplayTitleFromFilename(filename: string): string {
	const stem = stemFromFilename(filename).trim();
	const parts = stem.split(/\s+/).filter(Boolean);
	if (parts.length === 0) return stem;
	if (parts.length <= 2) return parts.join(" ");
	return `${parts[0]} ${parts[1]}`;
}

/** Ordered playlist: first file, then second, then loops. URLs encode spaces for the browser. */
export const BGM_TRACKS: readonly BgmTrack[] = BGM_SOURCE_FILENAMES.map(
	(file) => ({
		title: bgmDisplayTitleFromFilename(file),
		url: `/audio/music/${encodeURIComponent(file)}`,
	}),
);
