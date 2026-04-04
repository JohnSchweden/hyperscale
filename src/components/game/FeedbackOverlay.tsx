import type React from "react";
import { useEffect } from "react";
import { getOutcomeImagePath, slugify } from "../../data/imageMap";
import { BTN_PRIMARY_CTA } from "../../lib/buttonStyles";
import { formatBudget } from "../../lib/formatting";
import {
	BUDGET_CRITICAL,
	HEAT_CRITICAL,
	HEAT_HIGH,
	HYPE_CRITICAL,
	HYPE_HIGH,
} from "../../lib/thresholds";
import { ImageWithFallback } from "../ImageWithFallback";
import { GLASS_CARD_MODAL } from "./selectionStageStyles";

interface EscalationBadgeProps {
	label: string;
	level: number;
	levelSuffix?: string;
	isCritical: boolean;
	icon: string;
}

function EscalationBadge({
	label,
	level,
	levelSuffix = "%",
	isCritical,
	icon,
}: EscalationBadgeProps) {
	const textColor = isCritical ? "text-red-500" : "text-amber-400";
	return (
		<span
			className={`text-[10px] font-black tracking-wide ${textColor} inline-flex items-center gap-1.5`}
		>
			<i className={`fa-solid ${icon} text-[10px] ${textColor}`} aria-hidden />
			{label} — {level}
			{levelSuffix}
		</span>
	);
}

interface StatDeltaProps {
	icon: string;
	label: string;
	delta: number;
	colorFn: (delta: number) => string;
}

function StatDelta({ icon, label, delta, colorFn }: StatDeltaProps) {
	const color = colorFn(delta);
	const sign = delta > 0 ? "+" : "";
	return (
		<span
			className={`text-[11px] font-bold tracking-wide inline-flex items-center gap-1.5 ${color}`}
		>
			<i className={`fa-solid ${icon} text-[10px] ${color}`} aria-hidden />
			{label}: {sign}
			{delta}
		</span>
	);
}

function ViolationRowDot() {
	return (
		<span
			className="inline-block size-1.5 shrink-0 rounded-full bg-slate-500/70"
			aria-hidden
		/>
	);
}

function splitViolationLabel(violation: string): {
	left: string;
	right?: string;
} {
	const sep = " - ";
	const i = violation.indexOf(sep);
	if (i === -1) return { left: violation };
	return {
		left: violation.slice(0, i).trim(),
		right: violation.slice(i + sep.length).trim(),
	};
}

/**
 * Props for the FeedbackOverlay component.
 */
interface FeedbackOverlayProps {
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
	/** Kirk path: scanline veil above modal dim (matches .kirk-corrupted::before) */
	kirkCorruptionActive?: boolean;
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
	kirkCorruptionActive = false,
	onNext,
}) => {
	const violationParts = splitViolationLabel(violation);
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
			className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 modal-overlay${kirkCorruptionActive ? " modal-overlay--kirk-veil" : ""}`}
			data-testid="feedback-dialog"
			data-choice={choice}
			role="dialog"
			aria-modal="true"
			aria-labelledby="feedback-overlay-title"
			aria-describedby="feedback-overlay-desc"
		>
			<div
				className={`w-full max-w-full lg:max-w-[43rem] ${GLASS_CARD_MODAL} p-4 md:p-6 rounded-2xl text-center shadow-2xl max-h-[90vh] overflow-y-auto modal-content antialiased`}
			>
				{showEscalation && (
					<div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 justify-center items-center">
						{budgetCritical && (
							<EscalationBadge
								label={`Budget — ${formatBudget(budget ?? 0)}`}
								level={Math.round((budget ?? 0) / 1000000)}
								isCritical={true}
								icon="fa-exclamation"
							/>
						)}
						{heatCritical && (
							<EscalationBadge
								label="Risk"
								level={heat ?? 0}
								isCritical={true}
								icon="fa-fire"
							/>
						)}
						{heatHigh && (
							<EscalationBadge
								label="Risk"
								level={heat ?? 0}
								isCritical={false}
								icon="fa-fire"
							/>
						)}
						{hypeCritical && (
							<EscalationBadge
								label="Hype"
								level={hype ?? 0}
								isCritical={true}
								icon="fa-bullhorn"
							/>
						)}
						{hypeHigh && (
							<EscalationBadge
								label="Hype"
								level={hype ?? 0}
								isCritical={false}
								icon="fa-bullhorn"
							/>
						)}
					</div>
				)}

				{(() => {
					if (!realWorldReference?.incident || !outcomeLabel) return null;

					const incidentSlug = slugify(realWorldReference.incident);
					const labelSlug = slugify(outcomeLabel);
					const imagePath = getOutcomeImagePath(incidentSlug, labelSlug);
					const showKirkPlaceholder =
						!imagePath && incidentSlug.startsWith("kirk-breach");

					if (!imagePath && !showKirkPlaceholder) return null;

					return (
						<div className="mb-4 md:mb-6 flex w-full shrink-0 flex-col items-center">
							{imagePath ? (
								<ImageWithFallback
									src={imagePath}
									alt={`Outcome: ${outcomeLabel}`}
									aspectRatio="video"
									containerClassName="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px]"
								/>
							) : (
								<div
									className="relative aspect-video w-full max-w-[280px] overflow-hidden rounded-lg border border-slate-700 bg-slate-900 sm:max-w-[340px] md:max-w-[400px]"
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

				<p className="text-base md:text-lg mb-3 md:mb-4 text-slate-100 font-light leading-relaxed">
					"{text}"
				</p>

				{/* Outcome impact: badge → violation copy → divider → inline stats */}
				<div
					className={`mb-3 md:mb-5 rounded-lg border p-3 md:p-4 ${
						fine > 0
							? "border-red-500/20 bg-gradient-to-b from-red-950/50 via-transparent to-transparent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
							: fine < 0
								? "border-cyan-500/20 bg-gradient-to-b from-cyan-950/25 via-transparent to-transparent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
								: "border-emerald-500/15 bg-gradient-to-b from-emerald-950/30 via-transparent to-transparent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
					}`}
				>
					<div className="flex flex-col items-center gap-2 md:gap-3">
						<div className="flex w-full flex-row flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center">
							<div
								className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 ${
									fine > 0
										? "border-red-400/35 bg-red-500/10"
										: fine < 0
											? "border-cyan-400/35 bg-cyan-500/10"
											: "border-emerald-400/30 bg-emerald-500/10"
								}`}
							>
								<i
									className={`fa-solid text-xs ${
										fine > 0
											? "fa-triangle-exclamation text-amber-400"
											: fine < 0
												? "fa-arrow-trend-up text-cyan-400"
												: "fa-circle-check text-emerald-400"
									}`}
									aria-hidden
								></i>
								<span
									className={`text-[10px] font-black uppercase tracking-wider ${
										fine > 0
											? "text-red-200"
											: fine < 0
												? "text-cyan-200"
												: "text-emerald-200"
									}`}
								>
									{fine > 0
										? "Violation fine"
										: fine < 0
											? "Budget credit"
											: "Approved"}
								</span>
							</div>
							{fine > 0 && violationParts.right != null && (
								<>
									<ViolationRowDot />
									<span className="min-w-0 max-w-lg text-sm leading-snug text-slate-200">
										<span className="font-semibold text-slate-300">
											Classification:
										</span>{" "}
										{violationParts.left}
									</span>
									<ViolationRowDot />
									<span className="min-w-0 max-w-lg text-sm leading-snug text-slate-200">
										<span className="font-semibold text-slate-300">Theme:</span>{" "}
										{violationParts.right}
									</span>
								</>
							)}
							{fine > 0 && violationParts.right == null && (
								<>
									<ViolationRowDot />
									<p className="min-w-0 max-w-lg text-sm leading-snug text-slate-200">
										{violation}
									</p>
								</>
							)}
						</div>

						<div className="w-full border-t border-white/10 pt-3">
							<div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-x-5">
								<div className="flex shrink-0 items-center gap-1.5">
									<span className="sr-only">Budget</span>
									<i
										className="fa-solid fa-coins text-xs text-slate-500"
										aria-hidden
									></i>
									<p
										className={`text-base font-black tabular-nums leading-none md:text-lg ${
											fine > 0
												? "text-red-400"
												: fine < 0
													? "text-cyan-400"
													: "text-emerald-400"
										}`}
									>
										{fine > 0
											? `-${formatBudget(fine)}`
											: fine < 0
												? `+${formatBudget(-fine)}`
												: "$0"}
									</p>
								</div>

								{heatDelta !== undefined && heatDelta !== 0 && (
									<StatDelta
										icon="fa-fire"
										label="Risk"
										delta={heatDelta}
										colorFn={(v) =>
											v > 0 ? "text-red-400" : "text-emerald-400"
										}
									/>
								)}

								{hypeDelta !== undefined && hypeDelta !== 0 && (
									<StatDelta
										icon="fa-bullhorn"
										label="Hype"
										delta={hypeDelta}
										colorFn={(v) => (v > 0 ? "text-cyan-400" : "text-red-400")}
									/>
								)}
							</div>
						</div>
					</div>
				</div>

				<div
					id="feedback-overlay-desc"
					className="p-4 md:p-6 text-left mb-4 md:mb-8 min-h-[4.5rem]"
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

				<button type="button" onClick={onNext} className={BTN_PRIMARY_CTA}>
					Next ticket
				</button>
			</div>
		</div>
	);
};
