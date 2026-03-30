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
	/** Fine delta from this choice */
	fine: number;
	/** Heat delta from this choice */
	heatDelta?: number;
	/** Hype delta from this choice */
	hypeDelta?: number;
	/** Description of the violation if any */
	violation: string;
	/** Optional team impact description */
	teamImpact?: string | null;
	/** Optional budget amount for escalation display */
	budget?: number;
	/** Optional heat level for escalation display */
	heat?: number;
	/** Optional hype level for escalation display */
	hype?: number;
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
	heatDelta,
	hypeDelta,
	violation,
	teamImpact,
	budget,
	heat,
	hype,
	realWorldReference,
	outcomeLabel,
	onNext,
}) => {
	const budgetCritical = budget != null && budget < BUDGET_CRITICAL;
	const heatCritical = heat != null && heat >= HEAT_CRITICAL;
	const heatHigh = heat != null && heat >= HEAT_HIGH && !heatCritical;
	const hypeCritical = hype != null && hype >= HYPE_CRITICAL;
	const hypeHigh = hype != null && hype >= HYPE_HIGH && !hypeCritical;
	const showEscalation = budgetCritical || heatCritical || hypeCritical;
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
						{hypeCritical && (
							<span className="text-[10px] font-black tracking-wide text-red-400 inline-flex items-center gap-1.5">
								<i className="fa-solid fa-bullhorn text-[10px]" aria-hidden></i>
								Hype Critical — {hype}%
							</span>
						)}
						{hypeHigh && !hypeCritical && (
							<span className="text-[10px] font-black tracking-wide text-amber-400 inline-flex items-center gap-1.5">
								<i className="fa-solid fa-bullhorn text-[10px]" aria-hidden></i>
								Hype High — {hype}%
							</span>
						)}
					</div>
				)}

				{/* Outcome image (Kirk-corrupted cards use kirk-breach* slugs + glitch placeholder) */}
				{realWorldReference?.incident &&
					outcomeLabel &&
					(() => {
						const incidentSlug = slugify(realWorldReference.incident);
						const labelSlug = slugify(outcomeLabel);
						const imagePath = getOutcomeImagePath(incidentSlug, labelSlug);
						const showKirkPlaceholder =
							!imagePath && incidentSlug.startsWith("kirk-breach");
						if (!imagePath && !showKirkPlaceholder) return null;
						return (
							<div className="mb-4 md:mb-6 shrink-0 mx-auto">
								{imagePath ? (
									<ImageWithFallback
										src={imagePath}
										alt={`Outcome: ${outcomeLabel}`}
										aspectRatio="video"
										containerClassName="max-h-[200px] md:max-h-[220px]"
									/>
								) : (
									<div
										className="relative overflow-hidden rounded-lg border border-slate-700 bg-slate-900 aspect-video max-h-[200px] md:max-h-[220px] w-full max-w-lg mx-auto"
										role="img"
										aria-label="Corrupted outcome image unavailable"
									>
										<div
											className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 glitch-placeholder kirk-glitch-text"
											style={{
												backgroundImage: `
              repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.15) 2px,
                transparent 2px,
                transparent 4px
              )
            `,
											}}
										>
											<i
												className="fa-solid fa-image text-cyan-500/80 text-3xl animate-pulse"
												aria-hidden
											></i>
										</div>
									</div>
								)}
							</div>
						);
					})()}

				<h2 id="feedback-overlay-title" className="sr-only">
					Governance feedback
				</h2>

				{/* Combined violation block with icon, fine, consequences, and violation text */}
				<div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
					<div className="flex items-center justify-center gap-2 mb-2">
						<i
							className={`fa-solid text-xl md:text-2xl ${
								fine > 0
									? "fa-triangle-exclamation text-amber-400"
									: "fa-circle-check text-cyan-400"
							}`}
							aria-hidden
						></i>
						<span
							className={`text-lg md:text-xl font-bold ${
								fine > 0 ? "text-amber-400" : "text-cyan-400"
							}`}
						>
							{fine > 0 ? "Violation" : "Approved"}
						</span>
					</div>

					{/* Consequences: Fine → Heat → Hype with focus on biggest impact */}
					<div className="flex justify-center gap-3 md:gap-4 mb-3 text-sm md:text-base">
						{/* Fine - always show */}
						<span
							className={`inline-flex items-center gap-1 ${
								fine > 0 ? "text-red-400 font-bold" : "text-green-400"
							}`}
						>
							<i className="fa-solid fa-coins text-xs" aria-hidden></i>
							{fine > 0 ? `-${formatBudget(fine)}` : "$0"}
						</span>

						{/* Heat delta */}
						{heatDelta !== undefined && heatDelta !== 0 && (
							<span
								className={`inline-flex items-center gap-1 ${
									heatDelta > 0 ? "text-red-400 font-bold" : "text-green-400"
								}`}
							>
								<i className="fa-solid fa-fire text-xs" aria-hidden></i>
								{heatDelta > 0 ? `+${heatDelta}` : `${heatDelta}`}%
							</span>
						)}

						{/* Hype delta - use rocket icon */}
						{hypeDelta !== undefined && hypeDelta !== 0 && (
							<span
								className={`inline-flex items-center gap-1 ${
									hypeDelta > 0
										? "text-cyan-400 font-bold"
										: "text-red-400 font-bold"
								}`}
							>
								<i className="fa-solid fa-rocket text-xs" aria-hidden></i>
								{hypeDelta > 0 ? `+${hypeDelta}` : `${hypeDelta}`}%
							</span>
						)}
					</div>

					{fine > 0 && (
						<>
							<div className="text-2xl md:text-3xl font-black text-red-500 text-center">
								-{formatBudget(fine)}
							</div>
							<div className="text-red-400/80 text-xs md:text-sm mt-1 leading-relaxed text-center">
								{violation}
							</div>
						</>
					)}
				</div>

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
