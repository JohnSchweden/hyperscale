import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Plugin } from "@opencode-ai/plugin";

// Mirrors Claude Code lesson-capture hooks for OpenCode sessions.
// Events:
//   session.created              → SessionStart equivalent: inject lessons as context
//   experimental.session.compacting → PreCompact equivalent: prompt to save lessons before compaction

const REAL_LESSON_PATTERN = /^- \[.+\]/m;

function readLessons(filePath: string): string | null {
	if (!existsSync(filePath)) return null;
	const content = readFileSync(filePath, "utf8");
	return REAL_LESSON_PATTERN.test(content) ? content.trim() : null;
}

export const LessonCapturePlugin: Plugin = async ({ project }) => {
	const projectLessonsPath = join(project.path, "tasks", "lessons.md");
	const globalLessonsPath = join(homedir(), ".claude", "lessons.md");

	return {
		// SessionStart equivalent: inject captured lessons at session start
		"session.created": async (_input, output) => {
			const parts: string[] = [];

			const globalLessons = readLessons(globalLessonsPath);
			if (globalLessons) {
				parts.push(
					`GLOBAL LESSONS (applies to all projects):\n\n${globalLessons}`,
				);
			}

			const projectLessons = readLessons(projectLessonsPath);
			if (projectLessons) {
				parts.push(
					`PROJECT LESSONS (swiperisk-specific):\n\n${projectLessons}`,
				);
			}

			if (parts.length === 0) return output;

			return {
				...output,
				instructions:
					(output.instructions ?? "") +
					"\n\n---\n" +
					parts.join("\n\n---\n") +
					"\n\nApply these rules throughout this session without being reminded.",
			};
		},

		// PreCompact equivalent: prompt to save lessons before compaction
		"experimental.session.compacting": async (_input, output) => {
			return {
				...output,
				instructions:
					(output.instructions ?? "") +
					"\n\nBEFORE COMPACTING — capture lessons that would be lost:\n" +
					"A) LESSONS (rules to prevent mistakes):\n" +
					"   - Project-specific → tasks/lessons.md\n" +
					"   - Cross-project → ~/.claude/lessons.md\n" +
					"   Format: `- [RULE] — Why`\n" +
					"   Skip if already in AGENTS.md\n\n" +
					"B) MEMORY (facts, decisions, context not in code) → memory write tools\n" +
					"   Skip if derivable from code, git history, or already in AGENTS.md\n\n" +
					"Then proceed with compaction.",
			};
		},
	};
};
