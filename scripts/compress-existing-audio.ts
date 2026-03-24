import path from "node:path";
import { compressDirectory } from "./compress-audio";
import { countFiles, formatBytes, getDirectorySize } from "./fsUtils";

const VOICES_DIR = path.join(process.cwd(), "public", "audio", "voices");

export async function compressAllExistingAudio(): Promise<void> {
	console.log("🎵 Audio Compression Batch Process\n");

	// Count existing files
	const wavCount = await countFiles(VOICES_DIR, ".wav");
	const opusCount = await countFiles(VOICES_DIR, ".opus");
	const mp3Count = await countFiles(VOICES_DIR, ".mp3");

	console.log(`Current state:`);
	console.log(`  WAV files: ${wavCount}`);
	console.log(`  Opus files: ${opusCount}`);
	console.log(`  MP3 files: ${mp3Count}\n`);

	if (wavCount === 0) {
		console.log("No WAV files found to compress.");
		return;
	}

	if (opusCount === wavCount && mp3Count === wavCount) {
		console.log("All files already compressed! Nothing to do.");
		return;
	}

	// Get current size
	const currentSize = await getDirectorySize(VOICES_DIR);
	console.log(`Current total size: ${formatBytes(currentSize)}\n`);

	// Compress all files
	console.log("Starting compression...\n");
	const { processed, errors } = await compressDirectory(VOICES_DIR);

	// Report results
	const newSize = await getDirectorySize(VOICES_DIR);

	console.log("\n✅ Compression complete!");
	console.log(`\nResults:`);
	console.log(`  Files processed: ${processed}`);
	console.log(`  Errors: ${errors.length}`);
	console.log(`  New total size: ${formatBytes(newSize)}`);
	console.log(`  Size change: ${formatBytes(newSize - currentSize)}`);

	if (errors.length > 0) {
		console.error("\n❌ Errors encountered:");
		for (const e of errors) {
			console.error(`  ${e}`);
		}
	}

	// Estimate savings
	const avgWavSize = currentSize / wavCount;
	const estimatedOpusSize = avgWavSize * 0.17; // ~17% of original (6x compression)
	const estimatedMp3Size = avgWavSize * 0.33; // ~33% of original (3x compression)
	const estimatedTotal = wavCount * (estimatedOpusSize + estimatedMp3Size);

	console.log("\n📊 Projected bandwidth savings:");
	console.log(`  Original (WAV only): ${formatBytes(currentSize)}`);
	console.log(`  With compression: ${formatBytes(estimatedTotal)}`);
	console.log(
		`  Savings: ${((1 - estimatedTotal / currentSize) * 100).toFixed(1)}%`,
	);
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
	compressAllExistingAudio()
		.then(() => process.exit(0))
		.catch((err) => {
			console.error("Fatal error:", err);
			process.exit(1);
		});
}
