/**
 * Migration script: Replace hardcoded strings in card files with centralized constants.
 *
 * Replaces:
 * 1. incident/date/outcome positional args in makeCard() (args 7, 8, 9) →
 *    - RealWorld.KeyName  (if matched in incidents.ts)
 *    - { incident: "...", date: "...", outcome: "..." }  (if not in incidents.ts)
 * 2. label: "..." values → ChoiceLabel.keyName
 * 3. violation: "..." values → Violation.keyName
 *
 * Also updates makeCard() in types.ts to accept RealWorldReference as one arg.
 * Adds necessary imports for any constants used.
 *
 * Usage: bun run scripts/migrate-card-constants.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// 1. Load constant definitions
// ---------------------------------------------------------------------------

const incidentsPath = join(import.meta.dir, "../data/incidents.ts");
const choiceLabelsPath = join(import.meta.dir, "../data/choiceLabels.ts");
const violationsPath = join(import.meta.dir, "../data/violations.ts");

function extractStringMap(
	src: string,
	objectName: string,
): Map<string, string> {
	const map = new Map<string, string>();
	const keyValueRe = /(\w+):\s*"((?:[^"\\]|\\.)*)"/g;
	let m: RegExpExecArray | null;
	const startIdx = src.indexOf(`export const ${objectName}`);
	if (startIdx === -1)
		throw new Error(`Could not find 'export const ${objectName}' in source`);
	const relevant = src.slice(startIdx);
	for (;;) {
		m = keyValueRe.exec(relevant);
		if (m === null) break;
		const key = m[1];
		const value = m[2];
		if (["incident", "date", "outcome"].includes(key)) continue;
		map.set(value, key);
	}
	return map;
}

function extractIncidentMap(src: string): Map<string, string> {
	const map = new Map<string, string>();
	const blockRe = /(\w+):\s*\{[^}]*incident:\s*"((?:[^"\\]|\\.)*)"/gs;
	let m: RegExpExecArray | null;
	for (;;) {
		m = blockRe.exec(src);
		if (m === null) break;
		map.set(m[2], m[1]);
	}
	return map;
}

const incidentsSrc = readFileSync(incidentsPath, "utf-8");
const choiceLabelsSrc = readFileSync(choiceLabelsPath, "utf-8");
const violationsSrc = readFileSync(violationsPath, "utf-8");

const incidentToKey = extractIncidentMap(incidentsSrc);
const labelToKey = extractStringMap(choiceLabelsSrc, "ChoiceLabel");
const violationToKey = extractStringMap(violationsSrc, "Violation");

console.log(`Loaded ${incidentToKey.size} incident entries`);
console.log(`Loaded ${labelToKey.size} choice label entries`);
console.log(`Loaded ${violationToKey.size} violation entries`);

// ---------------------------------------------------------------------------
// 2. Update makeCard() in types.ts to accept RealWorldReference as one arg
// ---------------------------------------------------------------------------

const typesPath = join(import.meta.dir, "../types.ts");
let typesSrc = readFileSync(typesPath, "utf-8");
const originalTypes = typesSrc;

typesSrc = typesSrc.replace(
	/export function makeCard\(\s*id: string,\s*source: AppSource,\s*sender: string,\s*context: string,\s*storyContext: string,\s*text: string,\s*incident: string,\s*date: string,\s*outcome: string,\s*onLeft: OutcomeInput,\s*onRight: OutcomeInput,\s*\): Card \{[\s\S]*?return \{[\s\S]*?realWorldReference: \{ incident, date, outcome \},[\s\S]*?\};\s*\}/,
	`export function makeCard(
	id: string,
	source: AppSource,
	sender: string,
	context: string,
	storyContext: string,
	text: string,
	realWorldRef: RealWorldReference,
	onLeft: OutcomeInput,
	onRight: OutcomeInput,
): Card {
	return {
		id,
		source,
		sender,
		context,
		storyContext,
		text,
		realWorldReference: realWorldRef,
		onLeft: makeOutcome(onLeft),
		onRight: makeOutcome(onRight),
	};
}`,
);

if (typesSrc !== originalTypes) {
	writeFileSync(typesPath, typesSrc, "utf-8");
	console.log("\ntypes.ts: updated makeCard() to accept RealWorldReference");
} else {
	console.log("\ntypes.ts: no changes needed");
}

// ---------------------------------------------------------------------------
// 3. Process each card file
// ---------------------------------------------------------------------------

const cardDir = join(import.meta.dir, "../data/cards");
const cardFiles = [
	"agentic-engineer.ts",
	"chief-something-officer.ts",
	"data-scientist.ts",
	"head-of-something.ts",
	"software-architect.ts",
	"software-engineer.ts",
	"something-manager.ts",
	"tech-ai-consultant.ts",
	"vibe-coder.ts",
	"vibe-engineer.ts",
];

type Stats = {
	incidentsMatched: number;
	incidentsInlined: number;
	labels: number;
	violations: number;
};

for (const fileName of cardFiles) {
	const filePath = join(cardDir, fileName);
	let src = readFileSync(filePath, "utf-8");
	const original = src;

	const stats: Stats = {
		incidentsMatched: 0,
		incidentsInlined: 0,
		labels: 0,
		violations: 0,
	};

	let usesRealWorld = false;
	let usesChoiceLabel = false;
	let usesViolation = false;

	// -------------------------------------------------------------------------
	// 3a. Replace incident/date/outcome (args 7,8,9 of makeCard) with constant/object
	//
	// makeCard signature:
	//   arg 0: id           (string)
	//   arg 1: source       (AppSource.X)
	//   arg 2: sender       (string)
	//   arg 3: context      (string)
	//   arg 4: storyContext (string)
	//   arg 5: text         (string)
	//   arg 6: incident     (string)  ← replace these 3
	//   arg 7: date         (string)  ← with RealWorld.Key or { incident, date, outcome }
	//   arg 8: outcome      (string)  ←
	//   arg 9: onLeft       (object)
	//   arg 10: onRight     (object)
	//
	// We use a character-level parser to find each makeCard() invocation,
	// then locate args 6/7/8 precisely.
	// -------------------------------------------------------------------------

	src = processMakeCardCalls(src, incidentToKey, stats, () => {
		usesRealWorld = true;
	});

	// -------------------------------------------------------------------------
	// 3b. Replace label: "value" → label: ChoiceLabel.key
	// -------------------------------------------------------------------------
	for (const [labelStr, key] of labelToKey) {
		const escaped = escapeRegex(labelStr);
		const pattern = new RegExp(`label:\\s*"${escaped}"`, "g");
		src = src.replace(pattern, () => {
			stats.labels++;
			usesChoiceLabel = true;
			return `label: ChoiceLabel.${key}`;
		});
	}

	// -------------------------------------------------------------------------
	// 3c. Replace violation: "value" → violation: Violation.key
	// -------------------------------------------------------------------------
	for (const [violationStr, key] of violationToKey) {
		const escaped = escapeRegex(violationStr);
		const pattern = new RegExp(`violation:\\s*"${escaped}"`, "g");
		src = src.replace(pattern, () => {
			stats.violations++;
			usesViolation = true;
			return `violation: Violation.${key}`;
		});
	}

	// -------------------------------------------------------------------------
	// 3d. Add imports
	// -------------------------------------------------------------------------
	if (usesRealWorld || usesChoiceLabel || usesViolation) {
		const newImports: string[] = [];
		if (usesRealWorld)
			newImports.push(`import { RealWorld } from "../incidents"`);
		if (usesChoiceLabel)
			newImports.push(`import { ChoiceLabel } from "../choiceLabels"`);
		if (usesViolation)
			newImports.push(`import { Violation } from "../violations"`);

		const importBlockEnd = findImportBlockEnd(src);
		src =
			src.slice(0, importBlockEnd) +
			"\n" +
			newImports.join("\n") +
			src.slice(importBlockEnd);
	}

	if (src !== original) {
		writeFileSync(filePath, src, "utf-8");
		console.log(
			`\n${fileName}:`,
			`${stats.incidentsMatched} matched (RealWorld),`,
			`${stats.incidentsInlined} inlined (object),`,
			`${stats.labels} labels,`,
			`${stats.violations} violations`,
		);
	} else {
		console.log(`\n${fileName}: no changes`);
	}
}

console.log("\nDone.");

// ---------------------------------------------------------------------------
// Core parser: find makeCard() calls and replace args 6/7/8
// ---------------------------------------------------------------------------

/**
 * Parse `src` character by character, find each `makeCard(` invocation,
 * identify the 7th, 8th, and 9th arguments (0-indexed: 6, 7, 8) which are
 * the incident string, date string, and outcome string.
 *
 * Replace those three args with either:
 *   - `RealWorld.KeyName` if the incident string matches a known constant
 *   - `{ incident: "...", date: "...", outcome: "..." }` otherwise
 */
function processMakeCardCalls(
	src: string,
	incidentToKey: Map<string, string>,
	stats: Stats,
	onMatchedKey: (key: string) => void,
): string {
	const MARKER = "makeCard(";
	let result = "";
	let pos = 0;

	while (pos < src.length) {
		const idx = src.indexOf(MARKER, pos);
		if (idx === -1) {
			result += src.slice(pos);
			break;
		}

		// Copy everything up to makeCard(
		result += src.slice(pos, idx + MARKER.length);
		pos = idx + MARKER.length;

		// Now parse the arguments of this makeCard() call
		// We need to find args 6, 7, 8 (0-indexed), which are string literals.
		// Parse argument by argument.

		const argsResult = extractAndReplaceArgs6to8(
			src,
			pos,
			incidentToKey,
			stats,
			onMatchedKey,
		);
		if (argsResult === null) {
			// Failed to parse — just continue normally
			continue;
		}

		result += argsResult.replacement;
		pos = argsResult.endPos;
	}

	return result;
}

interface ArgReplaceResult {
	/** The transformed argument list text (from after the `(` to the closing `)`) */
	replacement: string;
	/** Position in `src` after the closing `)` of makeCard */
	endPos: number;
}

/**
 * Starting at `pos` (just after `makeCard(`), parse the argument list,
 * find args 6/7/8, and replace them.
 *
 * Returns null if parsing fails (e.g. unexpected structure).
 */
function extractAndReplaceArgs6to8(
	src: string,
	pos: number,
	incidentToKey: Map<string, string>,
	stats: Stats,
	onMatchedKey: (key: string) => void,
): ArgReplaceResult | null {
	// We'll collect the positions of top-level commas to identify argument boundaries.
	// Track depth for (, [, {
	let depth = 0; // 0 = inside the makeCard() argument list at top level
	let i = pos;
	let argStart = pos;
	const argRanges: Array<{ start: number; end: number }> = [];
	let inString = false;
	let stringChar = "";

	// We need the ENTIRE makeCard(...) content, then process args 6/7/8.
	// Walk to find the matching closing ) at depth 0.
	while (i < src.length) {
		const ch = src[i];

		if (inString) {
			if (ch === "\\" && stringChar !== "`") {
				i += 2; // skip escaped char
				continue;
			}
			if (ch === stringChar) {
				inString = false;
			}
			i++;
			continue;
		}

		if (ch === '"' || ch === "'" || ch === "`") {
			inString = true;
			stringChar = ch;
			i++;
			continue;
		}

		if (ch === "(" || ch === "[" || ch === "{") {
			depth++;
			i++;
			continue;
		}

		if (ch === ")" || ch === "]" || ch === "}") {
			if (depth === 0) {
				// This is the closing ) of makeCard()
				// Record last arg
				argRanges.push({ start: argStart, end: i });
				// Done
				break;
			}
			depth--;
			i++;
			continue;
		}

		if (ch === "," && depth === 0) {
			// Top-level comma = argument separator
			argRanges.push({ start: argStart, end: i });
			argStart = i + 1;
		}

		i++;
	}

	if (i >= src.length) return null; // unclosed call

	const endPos = i + 1; // after the closing )

	// We need args 6, 7, 8 (0-indexed)
	if (argRanges.length < 9) return null; // not enough args

	// Raw (untrimmed) arg6 content — includes leading whitespace (\n\t\t)
	const arg6Raw = src.slice(argRanges[6].start, argRanges[6].end);
	const arg6 = arg6Raw.trim();
	const arg7 = src.slice(argRanges[7].start, argRanges[7].end).trim();
	const arg8 = src.slice(argRanges[8].start, argRanges[8].end).trim();

	// Args 6/7/8 should be quoted strings
	if (!isQuotedString(arg6) || !isQuotedString(arg7) || !isQuotedString(arg8)) {
		// Already replaced (e.g. RealWorld.X or an object) — no change needed
		return { replacement: src.slice(pos, endPos), endPos };
	}

	const incident = unquote(arg6);
	const date = unquote(arg7);
	const outcome = unquote(arg8);

	// Preserve the leading whitespace from arg6 (e.g. "\n\t\t")
	const leadingWhitespace = arg6Raw.slice(
		0,
		arg6Raw.length - arg6Raw.trimStart().length,
	);

	// Determine indentation from the arg6 line (for multi-line object formatting)
	const indentMatch = leadingWhitespace.match(/^[\s\S]*\n(\t*)$/);
	const indent = indentMatch ? indentMatch[1] : "\t\t";

	// Build replacement for args 6/7/8
	let replacement6to8: string;
	const matchKey = incidentToKey.get(incident);
	if (matchKey) {
		replacement6to8 = `${leadingWhitespace}RealWorld.${matchKey}`;
		stats.incidentsMatched++;
		onMatchedKey(matchKey);
	} else {
		// Build inline object. Choose single-line or multi-line based on length.
		const singleLine = `{ incident: "${incident}", date: "${date}", outcome: "${outcome}" }`;
		const multiLine = `{\n${indent}\tincident: "${incident}",\n${indent}\tdate: "${date}",\n${indent}\toutcome: "${outcome}",\n${indent}}`;
		replacement6to8 =
			leadingWhitespace + (singleLine.length <= 100 ? singleLine : multiLine);
		stats.incidentsInlined++;
	}

	// Reconstruct: everything up to (but not including) arg6's leading whitespace,
	// then the replacement, then everything from arg8's end to the closing ).
	const newContent =
		src.slice(pos, argRanges[6].start) + // args 0..5 (after makeCard( and before arg6 whitespace)
		replacement6to8 + // \n\t\t + new ref
		src.slice(argRanges[8].end, i) + // comma + \n\t\t + args 9..10
		")"; // closing paren

	return { replacement: newContent, endPos };
}

function isQuotedString(s: string): boolean {
	return (
		(s.startsWith('"') && s.endsWith('"')) ||
		(s.startsWith("'") && s.endsWith("'"))
	);
}

function unquote(s: string): string {
	return s.slice(1, -1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeRegex(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findImportBlockEnd(src: string): number {
	const lines = src.split("\n");
	let lastImportLine = -1;
	for (let i = 0; i < lines.length; i++) {
		const trimmed = lines[i].trimStart();
		if (trimmed.startsWith("import ")) {
			lastImportLine = i;
		} else if (
			lastImportLine >= 0 &&
			trimmed !== "" &&
			!trimmed.startsWith("//") &&
			!trimmed.startsWith("*")
		) {
			break;
		}
	}
	if (lastImportLine === -1) return 0;
	let offset = 0;
	for (let i = 0; i <= lastImportLine; i++) {
		offset += lines[i].length + 1;
	}
	return offset;
}
