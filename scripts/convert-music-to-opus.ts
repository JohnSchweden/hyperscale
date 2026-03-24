import { promises as fs } from "node:fs";
import path from "node:path";
import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";

// Set FFmpeg binary path
ffmpeg.setFfmpegPath(ffmpegStatic || "ffmpeg");

/**
 * Convert an MP3 file to Opus format
 */
export async function mp3ToOpus(inputPath: string): Promise<string> {
	const outputPath = inputPath.replace(".mp3", ".opus");

	await new Promise<void>((resolve, reject) => {
		ffmpeg(inputPath)
			.audioCodec("libopus")
			.audioBitrate(128) // Higher bitrate for music (vs 96 for voice)
			.format("opus")
			.on("start", () => {
				console.log(`Converting: ${path.basename(inputPath)}`);
			})
			.on("end", () => {
				console.log(`✓ Created Opus: ${path.basename(outputPath)}`);
				resolve();
			})
			.on("error", (err) => {
				reject(new Error(`FFmpeg error: ${err.message}`));
			})
			.save(outputPath);
	});

	return outputPath;
}

/**
 * Convert all MP3 files in a directory to Opus
 */
export async function convertDirectoryMp3ToOpus(
	dirPath: string,
): Promise<{ processed: number; errors: string[] }> {
	const errors: string[] = [];
	let processed = 0;

	async function processDirectory(currentPath: string): Promise<void> {
		const entries = await fs.readdir(currentPath, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(currentPath, entry.name);

			if (entry.isDirectory()) {
				await processDirectory(fullPath);
			} else if (entry.isFile() && entry.name.endsWith(".mp3")) {
				// Skip if Opus already exists
				const opusPath = fullPath.replace(".mp3", ".opus");
				try {
					await fs.access(opusPath);
					console.log(`Skipping ${entry.name} (Opus already exists)`);
					continue;
				} catch {
					// Opus doesn't exist, proceed with conversion
				}

				try {
					await mp3ToOpus(fullPath);
					processed++;
				} catch (error) {
					const errorMsg = `Failed to convert ${fullPath}: ${error}`;
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
		mp3ToOpus(args[1])
			.then((outputPath) => {
				console.log(`Output: ${outputPath}`);
				process.exit(0);
			})
			.catch((err) => {
				console.error(err);
				process.exit(1);
			});
	} else if (command === "directory" && args[1]) {
		convertDirectoryMp3ToOpus(args[1])
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
		console.log(
			'  bun scripts/convert-music-to-opus.ts file "path/to/music.mp3"',
		);
		console.log(
			'  bun scripts/convert-music-to-opus.ts directory "path/to/directory"',
		);
		process.exit(1);
	}
}
