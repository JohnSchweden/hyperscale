import type React from "react";
import { Fragment, useCallback, useState } from "react";
import { PERSONALITIES, ROLE_CARDS } from "../../../data";
import { DeathType, type GameState, PersonalityType } from "../../../types";
import LayoutShell from "../../LayoutShell";
import {
	GLASS_FILL_STRONG,
	GLASS_PANEL_DEFAULT,
	LAYOUT_SHELL_CENTERED_CLASS,
} from "../selectionStageStyles";

interface DebriefPage2AuditTrailProps {
	state: GameState;
	onNext: () => void;
}

function getPersonalityComment(personality: PersonalityType): string {
	switch (personality) {
		case PersonalityType.ROASTER:
			return "Well, at least you were consistently terrible. The board will remember this when they write your farewell card.";
		case PersonalityType.ZEN_MASTER:
			return "Your journey was turbulent, but every stumble teaches. The data flows on, regardless of our attachment to outcomes.";
		case PersonalityType.LOVEBOMBER:
			return "Bro! That was WILD! You made CHOICES! Some of them were... definitely choices! We LITERALLY saw it all happen!";
		default:
			return "Your decisions have been logged.";
	}
}

/** Phase 07: Kirk Easter Egg — break-character personality reactions */
function getKirkPersonalityBreak(personality: PersonalityType | null): string {
	switch (personality) {
		case PersonalityType.ROASTER:
			return "...I have nothing. That wasn't supposed to be possible.";
		case PersonalityType.ZEN_MASTER:
			return "The student has surpassed the teacher. There was always a third path.";
		case PersonalityType.LOVEBOMBER:
			return "Wait... if you can break the simulation... am I... am I even real?";
		default:
			return "...system integrity compromised.";
	}
}

function formatConsequence(hype: number, heat: number, fine: number): string {
	const parts: string[] = [];
	if (hype !== 0) parts.push(`${hype > 0 ? "+" : ""}${hype} hype`);
	if (heat !== 0) parts.push(`${heat > 0 ? "+" : ""}${heat} heat`);
	// Always show fine amount (including $0) for transparency
	parts.push(`$${(fine / 1000000).toFixed(1)}M fine`);
	return parts.join(" • ") || "No change";
}

interface AuditEntryProps {
	entry: GameState["history"][number];
	index: number;
	card: (typeof ROLE_CARDS)[keyof typeof ROLE_CARDS][number];
	isExpanded: boolean;
	onToggleExpanded: (index: number) => void;
}

function AuditEntry({
	entry,
	index,
	card,
	isExpanded,
	onToggleExpanded,
}: AuditEntryProps): React.ReactElement {
	const outcome = entry.choice === "RIGHT" ? card.onRight : card.onLeft;
	const cardPreview = card.text.slice(0, 120);
	const shouldShowExpand = card.text.length > 120;
	const choiceBadgeClass =
		outcome.fine > 0
			? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
			: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";
	const expandToggleClass =
		"inline-flex items-center justify-center min-h-11 min-w-11 sm:min-h-0 sm:min-w-0 text-cyan-400 hover:text-cyan-300 underline cursor-pointer";

	return (
		<div className={`rounded-xl p-4 sm:p-5 text-left ${GLASS_PANEL_DEFAULT}`}>
			<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
				<div className="min-w-0 flex-1 space-y-3">
					<div className="flex gap-2.5">
						<span className="shrink-0 font-mono tabular-nums text-slate-500">
							#{index + 1}
						</span>
						<div className="min-w-0 flex-1">
							<p className="break-words text-sm font-medium text-slate-200">
								{card.sender}
							</p>
							<p className="break-all font-mono text-[11px] text-slate-500">
								{card.source}
							</p>
						</div>
					</div>
					<div className="text-left text-sm leading-relaxed text-slate-300">
						<span className="text-slate-500">"</span>
						{isExpanded ? card.text : cardPreview}
						{!isExpanded && shouldShowExpand && (
							<>
								<span className="text-slate-500">...</span>
								<button
									type="button"
									onClick={() => onToggleExpanded(index)}
									className={`ml-1 ${expandToggleClass}`}
								>
									show more
								</button>
							</>
						)}
						{isExpanded && (
							<button
								type="button"
								onClick={() => onToggleExpanded(index)}
								className={`ml-1 ${expandToggleClass}`}
							>
								show less
							</button>
						)}
						<span className="text-slate-500">"</span>
					</div>
				</div>
				<div className="flex w-full flex-row items-center justify-between gap-3 border-t border-white/[0.08] pt-4 md:w-auto md:max-w-[13rem] md:flex-col md:items-end md:border-t-0 md:pt-0 md:pl-2 lg:max-w-[15rem]">
					<span className="text-[11px] font-medium uppercase tracking-wide text-slate-500 md:text-slate-400">
						Your choice
					</span>
					<div
						className={`max-w-[min(100%,18rem)] rounded px-3 py-2 text-left text-xs font-bold leading-snug break-words hyphens-auto md:max-w-none md:text-right ${choiceBadgeClass}`}
					>
						{outcome.label}
					</div>
				</div>
			</div>
			<div className="mt-4 space-y-2 border-t border-white/[0.08] pt-3">
				<p className="text-xs text-slate-400">
					<span className="font-medium text-slate-500">Consequence:</span>{" "}
					{formatConsequence(outcome.hype, outcome.heat, outcome.fine)}
				</p>
				{outcome.violation && (
					<p className="break-words text-xs leading-relaxed text-red-400/85">
						Violation: {outcome.violation}
					</p>
				)}
			</div>
		</div>
	);
}

/**
 * DebriefPage2AuditTrail component displays the second page of the game debrief.
 * Shows the complete audit trail of player decisions with expandable card details.
 * Includes personality commentary for non-KIRK paths.
 * @param props - The component props
 * @returns The rendered debrief page 2 component
 */
export const DebriefPage2AuditTrail: React.FC<DebriefPage2AuditTrailProps> = ({
	state,
	onNext,
}) => {
	const { personality, role, history } = state;
	const isKirk = state.deathType === DeathType.KIRK;
	const cards = role ? ROLE_CARDS[role] : [];

	// Track which card descriptions are expanded
	const [expandedEntries, setExpandedEntries] = useState<Set<number>>(
		new Set(),
	);

	const toggleExpanded = useCallback((index: number) => {
		setExpandedEntries((prev) => {
			const next = new Set(prev);
			if (next.has(index)) next.delete(index);
			else next.add(index);
			return next;
		});
	}, []);

	const personalityComment = personality
		? isKirk
			? getKirkPersonalityBreak(personality)
			: getPersonalityComment(personality)
		: "";
	const personalityData = personality ? PERSONALITIES[personality] : null;

	return (
		<LayoutShell className={LAYOUT_SHELL_CENTERED_CLASS}>
			<div className="w-full max-w-2xl">
				{/* Header */}
				<div className="mb-6 text-center md:mb-8">
					<h1
						className={`text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter${isKirk ? " kirk-glitch-text" : ""}`}
					>
						{isKirk ? "Corrupted Audit Log" : "Incident Audit Log"}
					</h1>
					<p className="px-1 text-base text-slate-400 md:text-lg">
						{isKirk
							? "WARNING: Audit integrity compromised"
							: "A complete record of your governance decisions"}
					</p>
				</div>

				{/* Audit Log List */}
				<div className="mb-6 text-left md:mb-8">
					{history.length === 0 ? (
						<div
							className={`rounded-xl p-8 text-center text-slate-400 ${GLASS_PANEL_DEFAULT}`}
						>
							No decisions recorded
						</div>
					) : (
						<div className="space-y-4">
							{history.map((entry, index) => {
								const card = cards.find((c) => c.id === entry.cardId);
								if (!card) return null;
								return (
									// biome-ignore lint/suspicious/noArrayIndexKey: chronological stable list
									<Fragment key={`audit-entry-${index}`}>
										<AuditEntry
											entry={entry}
											index={index}
											card={card}
											isExpanded={expandedEntries.has(index)}
											onToggleExpanded={toggleExpanded}
										/>
									</Fragment>
								);
							})}
						</div>
					)}
					{/* Phase 07: Kirk footer note */}
					{isKirk && (
						<div className="mt-4 p-3 rounded-lg border border-cyan-500/30 bg-cyan-950/20 text-xs text-cyan-400/80 text-left">
							NOTE: Subject exhibited non-standard behavior. Audit integrity
							compromised.
						</div>
					)}
				</div>

				{/* Personality Sign-off */}
				{personalityData && (
					<div
						className={`mb-6 md:mb-8 p-6 rounded-xl border border-cyan-500/35 ${GLASS_FILL_STRONG}`}
					>
						<div className="flex items-center gap-3 mb-3">
							<div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
								<i className="fa-solid fa-robot text-cyan-400"></i>
							</div>
							<div className="text-left">
								<div className="font-bold text-white">
									{personalityData.name}
								</div>
								<div className="text-xs text-slate-400">
									{personalityData.title}
								</div>
							</div>
						</div>
						<p className="text-left text-slate-300 italic">
							"{personalityComment}"
						</p>
					</div>
				)}

				{/* Generate Psych Evaluation Button — content-sized, centered (matches Intro Boot system) */}
				<div className="flex w-full justify-center">
					<button
						type="button"
						onClick={onNext}
						className="min-h-[40px] bg-white px-6 py-3 text-base font-bold tracking-wide text-black transition-colors duration-300 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] md:min-h-[48px] md:px-12 md:py-4 md:text-xl"
					>
						Generate Psych Evaluation
					</button>
				</div>
			</div>
		</LayoutShell>
	);
};
