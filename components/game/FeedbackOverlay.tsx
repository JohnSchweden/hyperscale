import type React from "react";
import { useEffect } from "react";
import { getOutcomeImagePath, slugify } from "../../data/imageMap";
import { formatBudget } from "../../lib/formatting";
import type { PersonalityType } from "../../types";
import { ImageWithFallback } from "../ImageWithFallback";

const BUDGET_CRITICAL = 2_000_000;
const HEAT_CRITICAL = 85;
const HEAT_HIGH = 70;
const HYPE_CRITICAL = 85;
const HYPE_HIGH = 70;

/**
 * Props for the FeedbackOverlay component.
 */
interface FeedbackOverlayProps {
	/** The personality type providing the feedback */
	personality: PersonalityType | null;
	/** The feedback text from the personality */
	text: string;
	/** The governance lesson or alert message */
	lesson: string;
	/** The choice made (left or right swipe) */
	choice: "LEFT" | "RIGHT";
	/** Fine amount for violation (0 if no violation) */
	fine: number;
	/** Description of the violation if any */
	violation: string;
	/** Optional team impact description */
	teamImpact?: string | null;
	/** Optional budget amount for escalation display */
	budget?: number;
	/** Optional heat level for escalation display */
	heat?: number;
	/** Real-world incident reference for context */
	realWorldReference?: {
		incident: string;
		date: string;
		outcome: string;
	} | null;
	/** Label of the chosen outcome for image display */
	outcomeLabel?: string;
	/** Callback to proceed to next card */
	onNext: () => void;
}

/**
 * FeedbackOverlay component displays governance feedback after a card choice.
 * Shows fine information, lessons, and escalation warnings.
 * Includes keyboard navigation and modal accessibility features.
 * @param props - The component props
 * @returns The rendered feedback overlay modal
 */
export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
	text,
	lesson,
	choice,
	fine,
	violation,
	teamImpact,
	budget,
	heat,
	realWorldReference,
	outcomeLabel,
	onNext,
}) => {
	const budgetCritical = budget != null && budget < BUDGET_CRITICAL;
	const heatCritical = heat != null && heat >= HEAT_CRITICAL;
	const heatHigh = heat != null && heat >= HEAT_HIGH && !heatCritical;
	const showEscalation = budgetCritical || heatCritical;
	// Keyboard navigation for overlay
	useEffect(() => {
		const handleOverlayKey = (e: KeyboardEvent) => {
			if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
				e.preventDefault();
				onNext();
			}
		};
		window.addEventListener("keydown", handleOverlayKey);
		return () => window.removeEventListener("keydown", handleOverlayKey);
	}, [onNext]);

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/50 modal-overlay"
			data-testid="feedback-dialog"
			data-choice={choice}
			role="dialog"
			aria-modal="true"
			aria-labelledby="feedback-overlay-title"
			aria-describedby="feedback-overlay-desc"
		>
			<div className="w-full max-w-full lg:max-w-[43rem] bg-slate-900 border border-slate-700 p-6 md:p-10 rounded-2xl text-center shadow-2xl max-h-[90vh] overflow-y-auto modal-content antialiased">
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

				{/* Outcome image */}
				{realWorldReference?.incident &&
					outcomeLabel &&
					(() => {
						const incidentSlug = slugify(realWorldReference.incident);
						const labelSlug = slugify(outcomeLabel);
						const imagePath = getOutcomeImagePath(incidentSlug, labelSlug);
						return imagePath ? (
							<div className="mb-4 md:mb-6 shrink-0 mx-auto">
								<ImageWithFallback
									src={imagePath}
									alt={`Outcome: ${outcomeLabel}`}
									aspectRatio="video"
									containerClassName="max-h-[200px] md:max-h-[220px]"
								/>
							</div>
						) : null;
					})()}

				<h2 id="feedback-overlay-title" className="sr-only">
					Governance feedback
				</h2>
				<div
					className={`text-4xl md:text-6xl mb-4 md:mb-6 ${fine > 0 ? "text-amber-400" : "text-cyan-400"}`}
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

				<p className="text-lg md:text-2xl mb-4 md:mb-8 text-slate-100 font-light leading-relaxed">
					"{text}"
				</p>

				<div
					id="feedback-overlay-desc"
					className="bg-black/50 border border-white/5 p-4 md:p-6 rounded-xl text-left mb-4 md:mb-8 min-h-[4.5rem]"
				>
					<p className="text-[10px] font-bold tracking-wide text-slate-400/70 mb-1">
						Learning moment
					</p>
					<p className="text-sm md:text-base text-slate-300 leading-relaxed font-light">
						{lesson}
					</p>
					{teamImpact && (
						<div className="mt-3 pt-3 border-t border-white/5">
							<p className="text-[10px] font-bold tracking-wide text-amber-400/70 mb-1">
								Team impact
							</p>
							<p className="text-sm text-slate-400 leading-relaxed font-light">
								{teamImpact}
							</p>
						</div>
					)}
					{realWorldReference && (
						<div className="mt-3 pt-3 border-t border-white/5">
							<p className="text-[10px] font-bold tracking-wide text-cyan-400/70 mb-1">
								Real Case: {realWorldReference.incident} (
								{realWorldReference.date})
							</p>
							<p className="text-sm text-slate-400 leading-relaxed font-light">
								{realWorldReference.outcome}
							</p>
						</div>
					)}
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
