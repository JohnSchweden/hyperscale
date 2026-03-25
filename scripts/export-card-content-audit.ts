/**
 * One-shot content audit: every incident card × swipe direction → stats, feedback copy,
 * and Roaster TTS file (must stay aligned with hooks/useVoicePlayback.ts).
 *
 * Run: bun scripts/export-card-content-audit.ts [basePath]
 * Default: exports/card-incident-audio-audit.{csv,xlsx}
 * If basePath ends with .csv, writes that file plus sibling .xlsx.
 *
 * Note: shuffleDeck() may swap onLeft/onRight per run; this export reflects SOURCE DATA only.
 */
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ExcelJS from "exceljs";
import { BRANCH_CARDS } from "../data/cards/branches";
import { ROLE_CARDS } from "../data/cards/index";
import { KIRK_CORRUPTED_CARDS } from "../data/kirkCards";
import { ROLE_LABELS } from "../data/roles";
import { type Card, PersonalityType, RoleType } from "../types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

// --- Keep in sync with hooks/useVoicePlayback.ts (feedbackVoiceTrigger) ---
const FEEDBACK_INSTALL_ON_RIGHT = new Set([
	"se_code_quality_refactor",
	"mkt_psych_profiling",
	"mkt_deepfake_swift",
	"man_attention_track",
	"man_negotiator",
	"cln_sticky_note",
]);

const CRITICAL_HOS_CARDS = new Set([
	"hos_managing_up_down",
	"explainability_hos_2",
	"hos_copyright_team_blame",
	"hos_team_burnout_deadline",
	"shadow_ai_hos_2",
	"hos_model_drift_team_blame",
	"hos_explainability_politics",
	"hos_prompt_injection_review_escape",
	"hos_prompt_injection_blame",
	"hos_model_drift_budget_conflict",
	"hos_shadow_ai_team_discovery",
	"hos_delegation_gone_wrong",
	"hos_promotion_politics",
	"hos_prompt_injection_copilot_team",
	"hos_model_drift_retrain_delay",
	"explainability_hos_1",
	"shadow_ai_hos_1",
	"synthetic_data_hos_1",
	"synthetic_data_hos_2",
]);

function feedbackVoiceTrigger(
	cardId: string,
	choice: "LEFT" | "RIGHT",
): string {
	if (CRITICAL_HOS_CARDS.has(cardId)) {
		return `feedback_${cardId}_${choice.toLowerCase()}`;
	}
	if (cardId === "se_security_patch_timeline") {
		return choice === "RIGHT" ? "feedback_paste" : "feedback_debug";
	}
	if (FEEDBACK_INSTALL_ON_RIGHT.has(cardId)) {
		return choice === "RIGHT" ? "feedback_install" : "feedback_ignore";
	}
	return "feedback_ignore";
}

function csvCell(value: string): string {
	if (/[",\n\r]/.test(value)) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

function row(cells: string[]): string {
	return cells.map(csvCell).join(",");
}

type DeckBucket = {
	kind: string;
	roleKey: string;
	roleLabel: string;
	cards: Card[];
};

function collectBuckets(): DeckBucket[] {
	const buckets: DeckBucket[] = [];
	for (const r of Object.values(RoleType)) {
		buckets.push({
			kind: "role_deck",
			roleKey: r,
			roleLabel: ROLE_LABELS[r],
			cards: ROLE_CARDS[r],
		});
	}
	buckets.push({
		kind: "kirk_easter_egg",
		roleKey: "KIRK_CORRUPTED",
		roleLabel: "Kirk easter egg (injected deck)",
		cards: KIRK_CORRUPTED_CARDS,
	});
	buckets.push({
		kind: "legacy_branch",
		roleKey: "BRANCH_INJECTION",
		roleLabel: "Legacy branch (e.g. dev_1:RIGHT → dev_branch_aftermath)",
		cards: BRANCH_CARDS,
	});
	return buckets;
}

function audioPaths(trigger: string): { opus: string; mp3: string } {
	const base = join(REPO_ROOT, "public/audio/voices/roaster/feedback", trigger);
	return { opus: `${base}.opus`, mp3: `${base}.mp3` };
}

function resolveOutputPaths(arg: string | undefined): {
	csvPath: string;
	xlsxPath: string;
} {
	const fallback = join(REPO_ROOT, "exports/card-incident-audio-audit.csv");
	if (!arg) {
		return {
			csvPath: fallback,
			xlsxPath: fallback.replace(/\.csv$/i, ".xlsx"),
		};
	}
	const joined = join(REPO_ROOT, arg);
	if (joined.toLowerCase().endsWith(".csv")) {
		return {
			csvPath: joined,
			xlsxPath: joined.replace(/\.csv$/i, ".xlsx"),
		};
	}
	if (joined.toLowerCase().endsWith(".xlsx")) {
		return {
			csvPath: joined.replace(/\.xlsx$/i, ".csv"),
			xlsxPath: joined,
		};
	}
	const base = joined.endsWith("/")
		? `${joined}card-incident-audio-audit`
		: joined;
	return {
		csvPath: `${base}.csv`,
		xlsxPath: `${base}.xlsx`,
	};
}

const WIDE_COLUMNS = new Set([
	"story_context",
	"incident_text",
	"rw_outcome",
	"lesson",
	"feedback_roaster",
	"feedback_zen_master",
	"feedback_lovebomber",
	"roaster_only_tts_note",
	"generic_audio_warning",
	"shuffle_swap_note",
]);

async function writeXlsx(
	xlsxPath: string,
	headers: string[],
	dataRows: string[][],
): Promise<void> {
	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet("Incidents", {
		views: [{ state: "frozen", ySplit: 1 }],
	});

	sheet.addRow(headers);
	const headerRow = sheet.getRow(1);
	headerRow.font = { bold: true };
	for (const cells of dataRows) {
		sheet.addRow(cells);
	}

	headers.forEach((h, i) => {
		const col = sheet.getColumn(i + 1);
		col.width = WIDE_COLUMNS.has(h) ? 48 : 16;
	});

	const lastCol = headers.length;
	for (let r = 1; r <= dataRows.length + 1; r++) {
		for (let c = 1; c <= lastCol; c++) {
			sheet.getCell(r, c).alignment = {
				vertical: "top",
				wrapText: true,
			};
		}
	}

	await mkdir(dirname(xlsxPath), { recursive: true });
	await workbook.xlsx.writeFile(xlsxPath);
}

async function main() {
	const { csvPath, xlsxPath } = resolveOutputPaths(process.argv[2]);

	const headers = [
		"deck_kind",
		"role_key",
		"role_label",
		"card_id",
		"source",
		"sender",
		"context",
		"story_context",
		"incident_text",
		"rw_incident",
		"rw_date",
		"rw_outcome",
		"rw_source_url",
		"swipe_direction_ui",
		"option_label",
		"hype_delta",
		"heat_delta",
		"fine",
		"violation",
		"lesson",
		"feedback_roaster",
		"feedback_zen_master",
		"feedback_lovebomber",
		"roaster_only_tts_note",
		"audio_trigger_roaster",
		"audio_file_opus_repo_relative",
		"audio_file_mp3_repo_relative",
		"opus_exists",
		"mp3_exists",
		"generic_audio_warning",
		"shuffle_swap_note",
	];

	const dataRows: string[][] = [];

	const shuffleNote =
		"Each run shuffleDeck() may swap onLeft/onRight on the card; UI LEFT/RIGHT maps to whatever option is on that side after shuffle.";

	for (const bucket of collectBuckets()) {
		for (const card of bucket.cards) {
			for (const direction of ["LEFT", "RIGHT"] as const) {
				const side = direction === "RIGHT" ? card.onRight : card.onLeft;
				const rw = card.realWorldReference;
				const trigger = feedbackVoiceTrigger(card.id, direction);
				const { opus, mp3 } = audioPaths(trigger);
				const opusRel = opus.replace(`${REPO_ROOT}/`, "");
				const mp3Rel = mp3.replace(`${REPO_ROOT}/`, "");

				const genericWarn =
					trigger === "feedback_ignore" || trigger === "feedback_install"
						? "YES: shared clip — may not match this card’s written feedback"
						: "";

				dataRows.push([
					bucket.kind,
					bucket.roleKey,
					bucket.roleLabel,
					card.id,
					card.source,
					card.sender,
					card.context,
					card.storyContext ?? "",
					card.text,
					rw?.incident ?? "",
					rw?.date ?? "",
					rw?.outcome ?? "",
					rw?.sourceUrl ?? "",
					direction,
					side.label,
					String(side.hype),
					String(side.heat),
					String(side.fine),
					side.violation,
					side.lesson,
					side.feedback[PersonalityType.ROASTER],
					side.feedback[PersonalityType.ZEN_MASTER],
					side.feedback[PersonalityType.LOVEBOMBER],
					"In-game: TTS feedback audio only when personality is Roaster (see useVoicePlayback).",
					trigger,
					opusRel,
					mp3Rel,
					existsSync(opus) ? "Y" : "N",
					existsSync(mp3) ? "Y" : "N",
					genericWarn,
					shuffleNote,
				]);
			}
		}
	}

	const csvLines = [row(headers), ...dataRows.map(row)];
	const body = csvLines.join("\n");
	const bom = "\uFEFF";
	await mkdir(dirname(csvPath), { recursive: true });
	await writeFile(csvPath, bom + body, "utf8");
	await writeXlsx(xlsxPath, headers, dataRows);

	console.log(
		`Wrote ${dataRows.length} data rows (+ header) → ${csvPath} and ${xlsxPath}`,
	);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
