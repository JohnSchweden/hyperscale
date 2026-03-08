#!/usr/bin/env bun

/**
 * Benchmark Playwright tests: collect per-test durations, bucket by time,
 * save baseline, and compare against previous baselines.
 */

import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

const BUCKETS = [
	{ key: "<5s", maxMs: 5000 },
	{ key: "5-10s", maxMs: 10_000 },
	{ key: "10-15s", maxMs: 15_000 },
	{ key: "15-20s", maxMs: 20_000 },
	{ key: "20-30s", maxMs: 30_000 },
	{ key: ">30s", maxMs: Number.POSITIVE_INFINITY },
] as const;

type BucketKey = (typeof BUCKETS)[number]["key"];

interface ExtractedTest {
	file: string;
	title: string;
	fullTitle: string;
	duration: number;
	status: string;
	project: string;
}

interface Baseline {
	timestamp: string;
	totalDuration: number;
	tests: ExtractedTest[];
	summary: {
		buckets: Record<BucketKey, number>;
		median: number;
		p95: number;
		total: number;
	};
}

// Playwright JSON report types (minimal for parsing)
interface JSONReportSuite {
	title: string;
	file?: string;
	specs?: JSONReportSpec[];
	suites?: JSONReportSuite[];
}

interface JSONReportSpec {
	title: string;
	file?: string;
	tests?: {
		projectName: string;
		results: { duration: number; status?: string }[];
	}[];
}

function extractTestsFromSuite(
	suite: JSONReportSuite,
	parentTitle: string,
	parentFile: string,
	acc: ExtractedTest[],
): void {
	const title = parentTitle ? `${parentTitle} > ${suite.title}` : suite.title;
	const file = suite.file ?? parentFile;

	for (const spec of suite.specs ?? []) {
		for (const test of spec.tests ?? []) {
			const results = test.results ?? [];
			const lastResult = results[results.length - 1];
			if (!lastResult) continue;

			const duration = lastResult.duration ?? 0;
			const specFile = spec.file ?? file;
			const fullTitle = `${title} > ${spec.title}`.replace(/^ > /, "");

			acc.push({
				file: typeof specFile === "string" ? specFile : "unknown",
				title: spec.title,
				fullTitle,
				duration,
				status: String(lastResult.status ?? "unknown"),
				project: test.projectName ?? "unknown",
			});
		}
	}

	for (const child of suite.suites ?? []) {
		extractTestsFromSuite(child, title, file, acc);
	}
}

function extractTests(suites: JSONReportSuite[]): ExtractedTest[] {
	const acc: ExtractedTest[] = [];
	for (const suite of suites) {
		extractTestsFromSuite(suite, "", "unknown", acc);
	}
	return acc;
}

function bucketKey(durationMs: number): BucketKey {
	for (const b of BUCKETS) {
		if (durationMs <= b.maxMs) return b.key;
	}
	return ">30s";
}

function computeSummary(tests: ExtractedTest[]): Baseline["summary"] {
	const buckets: Record<BucketKey, number> = {
		"<5s": 0,
		"5-10s": 0,
		"10-15s": 0,
		"15-20s": 0,
		"20-30s": 0,
		">30s": 0,
	};

	const durations = tests.map((t) => t.duration).filter((d) => d >= 0);
	for (const d of durations) {
		buckets[bucketKey(d)]++;
	}

	const total = durations.reduce((a, b) => a + b, 0);
	const sorted = [...durations].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	const median = sorted.length > 0 ? (sorted[mid] ?? 0) : 0;
	const p95Index = Math.floor(sorted.length * 0.95);
	const last = sorted[sorted.length - 1];
	const p95 = sorted.length > 0 ? (sorted[p95Index] ?? last ?? 0) : 0;

	return {
		buckets,
		median,
		p95,
		total,
	};
}

function formatMs(ms: number): string {
	if (ms < 1000) return `${ms}ms`;
	return `${(ms / 1000).toFixed(1)}s`;
}

function printSummary(baseline: Baseline): void {
	console.log("\nTest Performance Benchmark");
	console.log("==========================\n");

	console.log("Category     | Count | Sample tests");
	console.log("-------------|-------|----------------------------------------");

	for (const b of BUCKETS) {
		const count = baseline.summary.buckets[b.key];
		const samples = baseline.tests
			.filter((t) => bucketKey(t.duration) === b.key)
			.slice(0, 3)
			.map((t) => t.fullTitle.slice(0, 40))
			.join(", ");
		const suffix = samples.length >= 40 ? "…" : "";
		const sampleStr = samples ? ` ${samples}${suffix}` : "";
		console.log(
			`${b.key.padEnd(12)} | ${String(count).padStart(5)} |${sampleStr}`,
		);
	}

	console.log("");
	console.log(
		`Total: ${baseline.tests.length} tests | Median: ${formatMs(baseline.summary.median)} | P95: ${formatMs(baseline.summary.p95)} | Total time: ${formatMs(baseline.summary.total)}`,
	);
}

function runBenchmark(): Baseline {
	const benchmarksDir = join(SCRIPT_DIR, "..", "benchmarks");
	mkdirSync(benchmarksDir, { recursive: true });
	const outputFile = join(benchmarksDir, "benchmark-results.json");

	// Run Playwright with JSON reporter; use temp file to avoid stdout mixing
	execSync(
		`bunx playwright test --config=playwright.benchmark.config.ts --reporter=json --reporter=list --timeout=60000`,
		{
			stdio: "inherit",
			env: {
				...process.env,
				PLAYWRIGHT_JSON_OUTPUT_FILE: outputFile,
			},
		},
	);

	const raw = readFileSync(outputFile, "utf-8");
	const report = JSON.parse(raw) as { suites?: JSONReportSuite[] };

	// Normalize: Playwright may nest project suites -> file suites
	const suites = report.suites ?? [];
	const tests = extractTests(suites);

	const totalDuration = tests.reduce((a, t) => a + t.duration, 0);
	const summary = computeSummary(tests);

	const baseline: Baseline = {
		timestamp: new Date().toISOString(),
		totalDuration,
		tests,
		summary,
	};

	// Clean up temp results
	try {
		unlinkSync(outputFile);
	} catch {
		// ignore
	}

	return baseline;
}

function saveBaseline(baseline: Baseline): string {
	const benchmarksDir = join(SCRIPT_DIR, "..", "benchmarks");
	mkdirSync(benchmarksDir, { recursive: true });

	const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
	const filename = `baseline-${ts}.json`;
	const path = join(benchmarksDir, filename);
	writeFileSync(path, JSON.stringify(baseline, null, 2), "utf-8");
	return path;
}

function loadBaseline(path: string): Baseline {
	const raw = readFileSync(path, "utf-8");
	return JSON.parse(raw) as Baseline;
}

function compareBaselines(current: Baseline, previous: Baseline): void {
	const prevMap = new Map(
		previous.tests.map((t) => [`${t.file}::${t.fullTitle}::${t.project}`, t]),
	);

	const faster: { test: ExtractedTest; prev: ExtractedTest; pct: number }[] =
		[];
	const slower: { test: ExtractedTest; prev: ExtractedTest; pct: number }[] =
		[];
	let same = 0;

	for (const curr of current.tests) {
		const key = `${curr.file}::${curr.fullTitle}::${curr.project}`;
		const prev = prevMap.get(key);
		if (!prev) continue;

		const delta = curr.duration - prev.duration;
		const pct = prev.duration > 0 ? (delta / prev.duration) * 100 : 0;

		if (pct <= -10) faster.push({ test: curr, prev, pct });
		else if (pct >= 10) slower.push({ test: curr, prev, pct });
		else same++;
	}

	console.log("\nComparison vs previous baseline");
	console.log("==============================\n");

	if (faster.length > 0) {
		console.log("FASTER:");
		for (const { test, prev, pct } of faster.slice(0, 10)) {
			console.log(
				`  ${test.fullTitle}: ${formatMs(prev.duration)} -> ${formatMs(test.duration)} (${pct.toFixed(0)}%)`,
			);
		}
		if (faster.length > 10) console.log(`  ... and ${faster.length - 10} more`);
		console.log("");
	}

	if (slower.length > 0) {
		console.log("SLOWER:");
		for (const { test, prev, pct } of slower.slice(0, 10)) {
			console.log(
				`  ${test.fullTitle}: ${formatMs(prev.duration)} -> ${formatMs(test.duration)} (+${pct.toFixed(0)}%)`,
			);
		}
		if (slower.length > 10) console.log(`  ... and ${slower.length - 10} more`);
		console.log("");
	}

	console.log(`SAME (within ±10%): ${same} tests`);
	console.log(
		`\nTotal: ${formatMs(previous.summary.total)} -> ${formatMs(current.summary.total)}`,
	);
}

async function main(): Promise<void> {
	const args = process.argv.slice(2);
	const compareIdx = args.indexOf("--compare");
	const compareFile =
		compareIdx >= 0 ? (args[compareIdx + 1] ?? "latest") : undefined;

	// If --compare with "latest", find most recent baseline
	let previousBaseline: Baseline | undefined;
	if (compareFile) {
		const benchmarksDir = join(SCRIPT_DIR, "..", "benchmarks");
		let baselinePath: string;
		if (compareFile === "latest") {
			const { readdirSync } = await import("node:fs");
			const files = readdirSync(benchmarksDir)
				.filter((f) => f.startsWith("baseline-") && f.endsWith(".json"))
				.sort()
				.reverse();
			const latest = files[0];
			if (!latest) {
				console.error("No baseline files found in benchmarks/");
				process.exit(1);
			}
			baselinePath = join(benchmarksDir, latest);
		} else {
			baselinePath = compareFile.startsWith("/")
				? compareFile
				: join(process.cwd(), compareFile);
		}
		previousBaseline = loadBaseline(baselinePath);
	}

	const baseline = runBenchmark();
	printSummary(baseline);

	const savedPath = saveBaseline(baseline);
	console.log(`\nBaseline saved to ${savedPath}`);

	if (previousBaseline) {
		compareBaselines(baseline, previousBaseline);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
