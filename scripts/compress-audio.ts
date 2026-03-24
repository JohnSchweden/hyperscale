import { promises as fs } from "node:fs";
import path from "node:path";
import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";

// Set FFmpeg binary path
ffmpeg.setFfmpegPath(ffmpegStatic || "ffmpeg");

export interface CompressionOptions {
	bitrate?: number;
	codec?: "libopus" | "libmp3lame";
	deleteWav?: boolean; // default: true (opt-out)
	archiveDir?: string; // default: "audio-archive"
}

/**
 * Archive a WAV file to the archive directory maintaining subfolder structure
 */
async function archiveWavFile(
	inputPath: string,
	archiveDir: string,
): Promise<string> {
	// Extract relative path from public/audio/voices/
	const voicesMatch = inputPath.match(/public\/audio\/voices\/(.*)/);
	if (!voicesMatch) {
		throw new Error(`Cannot determine archive path for: ${inputPath}`);
	}

	const relativePath = voicesMatch[1];
	const archivePath = path.join(archiveDir, relativePath);

	// Ensure archive directory exists
	await fs.mkdir(path.dirname(archivePath), { recursive: true });

	// Copy file to archive
	await fs.copyFile(inputPath, archivePath);

	return archivePath;
}

/**
 * Compress a single WAV file to Opus and MP3
 * By default, archives the WAV file and deletes the original (opt-out via deleteWav: false)
 */
export async function compressAudioFile(
	inputPath: string,
	options: {
		opus?: boolean;
		mp3?: boolean;
		deleteWav?: boolean;
		archiveDir?: string;
	} = { opus: true, mp3: true, deleteWav: true, archiveDir: "audio-archive" },
): Promise<{ opus?: string; mp3?: string; archived?: string }> {
	const results: { opus?: string; mp3?: string; archived?: string } = {};
	const basePath = inputPath.replace(".wav", "");
	const deleteWav = options.deleteWav !== false; // default true
	const archiveDir = options.archiveDir || "audio-archive";

	// Archive WAV file before compression
	if (deleteWav) {
		const archivedPath = await archiveWavFile(inputPath, archiveDir);
		results.archived = archivedPath;
		console.log(`  📦 Archived: ${path.relative(archiveDir, archivedPath)}`);
	}

	if (options.opus !== false) {
		const opusPath = `${basePath}.opus`;
		await new Promise<void>((resolve, reject) => {
			ffmpeg(inputPath)
				.audioCodec("libopus")
				.audioBitrate(96)
				.format("opus")
				.on("end", () => {
					console.log(`✓ Created Opus: ${path.basename(opusPath)}`);
					resolve();
				})
				.on("error", reject)
				.save(opusPath);
		});
		results.opus = opusPath;
	}

	if (options.mp3 !== false) {
		const mp3Path = `${basePath}.mp3`;
		await new Promise<void>((resolve, reject) => {
			ffmpeg(inputPath)
				.audioCodec("libmp3lame")
				.audioBitrate(192)
				.format("mp3")
				.on("end", () => {
					console.log(`✓ Created MP3: ${path.basename(mp3Path)}`);
					resolve();
				})
				.on("error", reject)
				.save(mp3Path);
		});
		results.mp3 = mp3Path;
	}

	// Delete original WAV file after successful compression (if enabled)
	if (deleteWav && (results.opus || results.mp3)) {
		await fs.unlink(inputPath);
		console.log(`  🗑️  Deleted: ${path.basename(inputPath)}`);
	}

	return results;
}

/**
 * Compress all WAV files in a directory (recursive)
 */
export async function compressDirectory(
	dirPath: string,
	options: {
		opus?: boolean;
		mp3?: boolean;
		deleteWav?: boolean;
		archiveDir?: string;
	} = { opus: true, mp3: true, deleteWav: true, archiveDir: "audio-archive" },
): Promise<{ processed: number; errors: string[] }> {
	const errors: string[] = [];
	let processed = 0;

	async function processDirectory(currentPath: string): Promise<void> {
		const entries = await fs.readdir(currentPath, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(currentPath, entry.name);

			if (entry.isDirectory()) {
				await processDirectory(fullPath);
			} else if (entry.isFile() && entry.name.endsWith(".wav")) {
				try {
					await compressAudioFile(fullPath, options);
					processed++;
				} catch (error) {
					const errorMsg = `Failed to compress ${fullPath}: ${error}`;
					console.error(errorMsg);
					errors.push(errorMsg);
				}
			}
		}
	}

	await processDirectory(dirPath);
	return { processed, errors };
}

// CLI usage
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
	const args = process.argv.slice(2);
	const command = args[0];

	if (command === "file" && args[1]) {
		compressAudioFile(args[1])
			.then(() => process.exit(0))
			.catch((err) => {
				console.error(err);
				process.exit(1);
			});
	} else if (command === "directory" && args[1]) {
		compressDirectory(args[1])
			.then(({ processed, errors }) => {
				console.log(`\nProcessed ${processed} files`);
				if (errors.length > 0) {
					console.error(`\nErrors (${errors.length}):`);
					for (const e of errors) {
						console.error(e);
					}
				}
				process.exit(errors.length > 0 ? 1 : 0);
			})
			.catch((err) => {
				console.error(err);
				process.exit(1);
			});
	} else {
		console.log("Usage:");
		console.log("  bun run compress:file <path/to/audio.wav>");
		console.log("  bun run compress:dir <path/to/directory>");
		process.exit(1);
	}
}
