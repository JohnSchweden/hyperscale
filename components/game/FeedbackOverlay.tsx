import type React from "react";
import { useEffect } from "react";
import { PERSONALITIES } from "../../data";
import type { PersonalityType } from "../../types";

const BUDGET_CRITICAL = 2_000_000;
const HEAT_CRITICAL = 85;
const HEAT_HIGH = 70;

interface FeedbackOverlayProps {
	personality: PersonalityType | null;
	text: string;
	lesson: string;
	choice: "LEFT" | "RIGHT";
	fine: number;
	violation: string;
	/** Optional team-impact copy (morale, resignations, etc.) from pressure metadata. */
	teamImpact?: string | null;
	/** Optional budget/heat for escalation banner when critical (same thresholds as GameHUD). */
	budget?: number;
	heat?: number;
	/** Real-world incident reference for history section */
	realWorldReference?: {
		incident: string;
		date: string;
		outcome: string;
	} | null;
	onNext: () => void;
}

function formatBudget(amount: number): string {
	if (amount >= 1000000) {
		return `$${(amount / 1000000).toFixed(1)}M`;
	}
	return `$${amount.toLocaleString()}`;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
	personality,
	text,
	lesson,
	choice,
	fine,
	violation,
	teamImpact,
	budget,
	heat,
	realWorldReference,
	onNext,
}) => {
	const budgetCritical = budget != null && budget < BUDGET_CRITICAL;
	const heatCritical = heat != null && heat >= HEAT_CRITICAL;
	const heatHigh = heat != null && heat >= HEAT_HIGH && !heatCritical;
	const showEscalation = budgetCritical || heatCritical;
	// Keyboard navigation for overlay
	useEffect(() => {
		const handleOverlayKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				onNext();
			} else if (e.key === " " || e.key === "Enter") {
				e.preventDefault();
				onNext();
			}
		};
		window.addEventListener("keydown", handleOverlayKey);
		return () => window.removeEventListener("keydown", handleOverlayKey);
	}, [onNext]);

	const personalityName = personality ? PERSONALITIES[personality].name : "";

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/70 backdrop-blur-sm modal-overlay"
			data-testid="feedback-dialog"
			data-choice={choice}
			role="dialog"
			aria-modal="true"
			aria-labelledby="feedback-overlay-title"
			aria-describedby="feedback-overlay-desc"
		>
			<div className="w-full max-w-lg bg-slate-900 border border-slate-700 p-6 md:p-10 rounded-2xl text-center shadow-2xl max-h-[90vh] overflow-y-auto modal-content antialiased">
				{showEscalation && (
					<div className="mb-4 p-2 rounded-lg border flex flex-wrap gap-x-4 gap-y-1 justify-center items-center bg-black/30">
						{budgetCritical && (
							<span className="text-[10px] font-black tracking-wide text-red-500 inline-flex items-center gap-1.5">
								<i className="fa-solid fa-coins text-[10px]" aria-hidden></i>
								Budget Critical — {formatBudget(budget ?? 0)}
							</span>
						)}
						{heatCritical && (
							<span className="text-[10px] font-black tracking-wide text-red-400 inline-flex items-center gap-1.5">
								<i className="fa-solid fa-fire text-[10px]" aria-hidden></i>
								Risk Critical — {heat}%
							</span>
						)}
						{heatHigh && !heatCritical && (
							<span className="text-[10px] font-black tracking-wide text-amber-400 inline-flex items-center gap-1.5">
								<i className="fa-solid fa-fire text-[10px]" aria-hidden></i>
								Risk High — {heat}%
							</span>
						)}
					</div>
				)}
				<h2 id="feedback-overlay-title" className="sr-only">
					Governance feedback
				</h2>
				<div
					className={`text-4xl md:text-6xl mb-4 md:mb-6 ${fine > 0 ? "text-red-500" : "text-green-500"}`}
				>
					<i
						className={`fa-solid ${fine > 0 ? "fa-triangle-exclamation" : "fa-circle-check"}`}
						aria-hidden
					></i>
				</div>

				{fine > 0 && (
					<div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
						<div className="text-red-400 text-xs md:text-sm font-bold tracking-wide mb-1 leading-relaxed">
							Violation fine
						</div>
						<div className="text-2xl md:text-3xl font-black text-red-500">
							-{formatBudget(fine)}
						</div>
						<div className="text-red-400/80 text-xs md:text-sm mt-1 leading-relaxed">
							{violation}
						</div>
					</div>
				)}

				<div className="text-cyan-400 mono text-xs md:text-sm mb-3 md:mb-4 font-bold tracking-wide">
					{personalityName}'s review
				</div>
				<p className="text-lg md:text-2xl mb-4 md:mb-8 text-slate-100 font-light leading-relaxed">
					"{text}"
				</p>

				<div
					id="feedback-overlay-desc"
					className="bg-black/50 border border-white/5 p-4 md:p-6 rounded-xl text-left mb-4 md:mb-8 min-h-[4.5rem]"
				>
					<div className="text-xs md:text-sm font-bold text-slate-300 tracking-wide mb-3 border-b border-white/5 pb-2">
						Governance alert
					</div>
					<p className="text-sm md:text-base text-slate-300 leading-relaxed font-light">
						{lesson}
					</p>
					{teamImpact && (
						<div className="mt-3 pt-3 border-t border-white/5">
							<div className="text-xs font-bold text-amber-400/90 tracking-wide mb-1">
								Team impact
							</div>
							<p className="text-sm text-slate-400 leading-relaxed font-light">
								{teamImpact}
							</p>
						</div>
					)}
					{realWorldReference && (
						<div className="mt-3 pt-3 border-t border-white/5">
							<div className="text-xs font-bold text-cyan-400/90 tracking-wide mb-2">
								<i className="fa-solid fa-book-open mr-1.5" aria-hidden></i>
								Real Case: {realWorldReference.incident} (
								{realWorldReference.date})
							</div>
							<p className="text-sm text-slate-400 leading-relaxed font-light">
								{realWorldReference.outcome}
							</p>
						</div>
					)}
					<p className="mt-3 text-xs text-slate-500 font-medium">
						Decision logged — no undo. Proceed when ready.
					</p>
				</div>

				<button
					type="button"
					onClick={onNext}
					className="w-auto px-8 py-2.5 text-sm md:text-base bg-white text-black font-black tracking-wide hover:bg-cyan-500 transition-all shadow-xl transform active:scale-95"
				>
					Next ticket
				</button>
			</div>
		</div>
	);
};
