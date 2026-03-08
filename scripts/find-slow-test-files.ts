#!/usr/bin/env bun

/**
 * Run each Playwright spec file individually and report which exceed 20s or 30s.
 */

import { execSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const TESTS_DIR = join(SCRIPT_DIR, "..", "tests");
const LIMIT_20S = 20_000;
const LIMIT_30S = 30_000;

function findSpecFiles(): string[] {
	return readdirSync(TESTS_DIR)
		.filter((f) => f.endsWith(".spec.ts"))
		.sort()
		.map((f) => join("tests", f));
}

function runFile(file: string): { durationMs: number } {
	const start = Date.now();
	try {
		execSync(`bunx playwright test "${file}"`, {
			stdio: "pipe",
			encoding: "utf-8",
		});
	} catch {
		// execSync throws on non-zero exit; we still record duration
	}
	return { durationMs: Date.now() - start };
}

function main(): void {
	const files = findSpecFiles();
	console.log(`Running ${files.length} test files individually...\n`);

	const results: { file: string; durationMs: number }[] = [];

	for (const file of files) {
		process.stdout.write(`  ${file} ... `);
		const { durationMs } = runFile(file);
		results.push({ file, durationMs });
		const s = (durationMs / 1000).toFixed(1);
		let tag = "";
		if (durationMs >= LIMIT_30S) tag = " [>30s]";
		else if (durationMs >= LIMIT_20S) tag = " [>20s]";
		console.log(`${s}s${tag}`);
	}

	const over30 = results.filter((r) => r.durationMs >= LIMIT_30S);
	const over20 = results.filter(
		(r) => r.durationMs >= LIMIT_20S && r.durationMs < LIMIT_30S,
	);

	console.log("\n--- Summary ---");
	console.log(`\nTest files > 30s (${over30.length}):`);
	for (const r of over30) {
		console.log(`  ${r.file} (${(r.durationMs / 1000).toFixed(1)}s)`);
	}

	console.log(`\nTest files 20-30s (${over20.length}):`);
	for (const r of over20) {
		console.log(`  ${r.file} (${(r.durationMs / 1000).toFixed(1)}s)`);
	}

	console.log(
		`\nTotal: ${results.length} files, ${(results.reduce((a, r) => a + r.durationMs, 0) / 1000).toFixed(1)}s`,
	);
}

main();
