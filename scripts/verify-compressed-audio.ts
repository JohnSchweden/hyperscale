import { promises as fs } from "node:fs";
import path from "node:path";
import { countFiles, formatBytes, getDirectorySize } from "./fsUtils";

const VOICES_DIR = path.join(process.cwd(), "public", "audio", "voices");

async function verifyCompressedAudio(): Promise<void> {
	console.log("🔍 Verifying Compressed Audio Files\n");

	const wavCount = await countFiles(VOICES_DIR, ".wav");
	const opusCount = await countFiles(VOICES_DIR, ".opus");
	const mp3Count = await countFiles(VOICES_DIR, ".mp3");

	console.log("File counts:");
	console.log(`  WAV files:  ${wavCount}`);
	console.log(`  Opus files: ${opusCount}`);
	console.log(`  MP3 files:  ${mp3Count}\n`);

	// Check for missing compressed versions
	const issues: string[] = [];

	async function checkDirectory(dirPath: string): Promise<void> {
		const entries = await fs.readdir(dirPath, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(dirPath, entry.name);

			if (entry.isDirectory()) {
				await checkDirectory(fullPath);
			} else if (entry.name.endsWith(".wav")) {
				const basePath = fullPath.replace(".wav", "");
				const opusPath = `${basePath}.opus`;
				const mp3Path = `${basePath}.mp3`;

				try {
					await fs.access(opusPath);
				} catch {
					issues.push(`Missing Opus: ${opusPath}`);
				}

				try {
					await fs.access(mp3Path);
				} catch {
					issues.push(`Missing MP3: ${mp3Path}`);
				}
			}
		}
	}

	await checkDirectory(VOICES_DIR);

	if (issues.length > 0) {
		console.error(`❌ Found ${issues.length} issues:\n`);
		for (const issue of issues) {
			console.error(`  ${issue}`);
		}
		console.error('\nRun "bun compress:existing" to fix.');
		process.exit(1);
	}

	console.log("✅ All WAV files have compressed versions!\n");

	// Report sizes
	const totalSize = await getDirectorySize(VOICES_DIR);
	console.log(`Total audio directory size: ${formatBytes(totalSize)}`);
	console.log("\nPer-format estimates:");
	const wavOnlyMB = wavCount * 0.32;
	const opusOnlyMB = wavCount * 0.054;
	const mp3OnlyMB = wavCount * 0.106;
	console.log(`  WAV only:  ${wavOnlyMB.toFixed(2)} MB (assuming 320KB avg)`);
	console.log(`  Opus only: ${opusOnlyMB.toFixed(2)} MB (~17% of WAV)`);
	console.log(`  MP3 only:  ${mp3OnlyMB.toFixed(2)} MB (~33% of WAV)`);

	// Report bandwidth savings
	const wavSize = wavCount * 0.32; // ~320KB avg per file
	const opusSize = wavCount * 0.054;
	const mp3Size = wavCount * 0.106;
	const avgUserSize = opusSize * 0.92 + mp3Size * 0.08; // 92% get Opus, 8% get MP3
	const savings = ((wavSize - avgUserSize) / wavSize) * 100;

	console.log("\n📊 Bandwidth savings:");
	console.log(`  Original (WAV): ${wavSize.toFixed(2)} MB`);
	console.log(`  Average user:   ${avgUserSize.toFixed(2)} MB`);
	console.log(`  Savings:        ${savings.toFixed(1)}%`);
}

verifyCompressedAudio()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error("Error:", err);
		process.exit(1);
	});
