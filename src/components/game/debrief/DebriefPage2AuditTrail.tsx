import type React from "react";
import { useMemo } from "react";
import { PERSONALITIES, ROLE_CARDS } from "../../../data";
import { BTN_DEBRIEF_NAV } from "../../../lib/buttonStyles";
import { formatBudget } from "../../../lib/formatting";
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

function getPersonalityComment(
	personality: PersonalityType | null,
	isKirk: boolean,
): string {
	if (!personality) {
		return isKirk
			? "...system integrity compromised."
			: "Your decisions have been logged.";
	}

	if (isKirk) {
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

function formatConsequence(fine: number, heat: number, hype: number): string {
	// Order: Fine → Heat → Hype (matches FeedbackOverlay)
	return `${formatBudget(fine)} fine • ${heat > 0 ? "+" : ""}${heat}% heat • ${hype > 0 ? "+" : ""}${hype}% hype`;
}

interface ForkSegmentProps {
	label: string;
	hype: number;
	heat: number;
	fine: number;
	violation: string | null;
	isChosen: boolean;
	direction: "left" | "right";
}

function ForkSegment({
	label,
	hype,
	heat,
	fine,
	violation,
	isChosen,
	direction,
}: ForkSegmentProps): React.ReactElement {
	const directionLabel = direction === "left" ? "Swipe left" : "Swipe right";

	const badgeClass = isChosen
		? fine > 0
			? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
			: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
		: "bg-black/30 text-slate-400 border border-white/[0.08]";

	return (
		<div className="relative z-10 flex flex-1 flex-col gap-2 p-3 md:p-4">
			<p className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">
				{directionLabel}
			</p>
			<div
				className={`rounded px-3 py-2 text-xs font-bold leading-snug ${badgeClass}`}
			>
				{label}
			</div>
			<p className="text-[11px] text-slate-400">
				<span className="font-medium text-slate-500">Consequence:</span>{" "}
				{formatConsequence(fine, heat, hype)}
			</p>
			{violation && (
				<p className="break-words text-[11px] leading-relaxed text-red-400/85">
					Violation: {violation}
				</p>
			)}
		</div>
	);
}

interface AuditEntryProps {
	key?: string;
	entry: GameState["history"][number];
	index: number;
	card: (typeof ROLE_CARDS)[keyof typeof ROLE_CARDS][number];
}

function AuditEntry({
	entry,
	index,
	card,
}: AuditEntryProps): React.ReactElement {
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
					<div className="space-y-3 text-left text-sm leading-relaxed text-slate-300">
						{card.storyContext && (
							<p className="text-slate-400 leading-relaxed">
								{card.storyContext}
							</p>
						)}
						<p>
							<span className="text-slate-500">"</span>
							{card.text}
							<span className="text-slate-500">"</span>
						</p>
					</div>
				</div>
			</div>
			<div className="relative mt-4 flex flex-col md:flex-row">
				{/* Desktop: T-junction — top bar + center stem; no full box */}
				<div
					className="pointer-events-none absolute inset-0 z-0 hidden md:block"
					aria-hidden
				>
					<div className="absolute top-0 right-0 left-0 h-px bg-white/[0.12]" />
					<div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-white/[0.12]" />
				</div>
				<ForkSegment
					label={card.onLeft.label}
					hype={card.onLeft.hype}
					heat={card.onLeft.heat}
					fine={card.onLeft.fine}
					violation={card.onLeft.violation || null}
					isChosen={entry.choice === "LEFT"}
					direction="left"
				/>
				<div className="border-t border-white/[0.12] md:hidden" />
				<ForkSegment
					label={card.onRight.label}
					hype={card.onRight.hype}
					heat={card.onRight.heat}
					fine={card.onRight.fine}
					violation={card.onRight.violation || null}
					isChosen={entry.choice === "RIGHT"}
					direction="right"
				/>
			</div>
		</div>
	);
}

/**
 * DebriefPage2AuditTrail component displays the second page of the game debrief.
 * Shows the complete audit trail with full storyContext (if any) and card prompt text.
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
	const cards = state.effectiveDeck ?? (role ? ROLE_CARDS[role] : []);

	const cardMap = useMemo(() => {
		const map = new Map<
			string,
			(typeof ROLE_CARDS)[keyof typeof ROLE_CARDS][number]
		>();
		for (const card of cards) {
			map.set(card.id, card);
		}
		return map;
	}, [cards]);

	const personalityComment = getPersonalityComment(personality, isKirk);
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
					<p className="mt-2 text-xs md:text-sm text-[#B8962E]/70">
						Consider how different choices might have changed the outcome
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
								const card = cardMap.get(entry.cardId);
								if (!card) return null;
								return (
									<AuditEntry
										key={`audit-entry-${entry.cardId}-${entry.choice}`}
										entry={entry}
										index={index}
										card={card}
									/>
								);
							})}
						</div>
					)}
					{/* Phase 07: Kirk footer note */}
					{isKirk && (
						<div
							className={`mt-4 p-3 rounded-lg border border-cyan-500/30 text-xs text-cyan-400/80 text-left ${GLASS_FILL_STRONG}`}
						>
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

				{/* Generate psych evaluation — same primary CTA as debrief page 1 */}
				<div className="flex w-full justify-center">
					<button type="button" onClick={onNext} className={BTN_DEBRIEF_NAV}>
						Generate psych evaluation
					</button>
				</div>
			</div>
		</LayoutShell>
	);
};
