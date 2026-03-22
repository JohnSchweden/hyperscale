#!/usr/bin/env bun
/**
 * Cursor hook: Biome-format a single file after an agent edit.
 *
 * stdin shapes:
 * - afterFileEdit: { file_path: string }
 * - postToolUse / Claude PostToolUse: { tool_name: "Write"|"Edit", tool_input: { file_path } }
 *
 * stdout: always `{}` (Cursor parses hook output as JSON; Biome human output must not leak).
 */
const stdin = await Bun.stdin.text();
let payload: unknown;
try {
	payload = JSON.parse(stdin);
} catch {
	console.log("{}");
	process.exit(0);
}

let filePath: string | undefined;
if (typeof payload === "object" && payload !== null) {
	const p = payload as Record<string, unknown>;
	if (typeof p.file_path === "string") {
		filePath = p.file_path;
	} else if (
		(p.tool_name === "Write" || p.tool_name === "Edit") &&
		typeof p.tool_input === "object" &&
		p.tool_input !== null
	) {
		const ti = p.tool_input as Record<string, unknown>;
		if (typeof ti.file_path === "string") {
			filePath = ti.file_path;
		}
	}
}

if (!filePath) {
	console.log("{}");
	process.exit(0);
}

const proc = Bun.spawn(["bunx", "biome", "format", "--write", filePath], {
	stdin: "ignore",
	stdout: "ignore",
	stderr: "pipe",
	cwd: process.cwd(),
});

const status = await proc.exited;
if (status !== 0) {
	const stderr = await new Response(proc.stderr).text();
	if (stderr) process.stderr.write(stderr);
}
console.log("{}");
process.exit(status);
