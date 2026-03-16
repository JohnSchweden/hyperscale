#!/usr/bin/env node
// SessionStart hook: inject tasks/lessons.md content into context at session start.
// This ensures Claude starts each session already aware of captured lessons,
// without needing the user to remind it.

const fs = require("node:fs");
const path = require("node:path");

// Real lessons look like `- [RULE] — ...` bullet points
const REAL_LESSON_PATTERN = /^- \[.+\]/m;

let input = "";
const stdinTimeout = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
	clearTimeout(stdinTimeout);
	try {
		const lessonsPath = path.join(process.cwd(), "tasks", "lessons.md");

		if (!fs.existsSync(lessonsPath)) {
			process.exit(0);
		}

		const content = fs.readFileSync(lessonsPath, "utf8");
		// Only inject if there are real lessons beyond the template
		if (!REAL_LESSON_PATTERN.test(content)) {
			process.exit(0);
		}

		const message =
			"SESSION CONTEXT — lessons captured from previous sessions:\n\n" +
			content.trim() +
			"\n\nApply these rules throughout this session without being reminded.";

		const output = {
			hookSpecificOutput: {
				hookEventName: "SessionStart",
				additionalContext: message,
			},
		};

		process.stdout.write(JSON.stringify(output));
	} catch (_e) {
		process.exit(0);
	}
});
