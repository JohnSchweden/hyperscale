import React from "react";
import { formatBudget } from "../../lib/formatting";

const INITIAL_BUDGET = 10000000;
const BUDGET_WARNING = 3_000_000;
const BUDGET_CRITICAL = 2_000_000;
const HEAT_HIGH = 70;
const HEAT_CRITICAL = 85;

/**
 * Props for the GameHUD component.
 */
interface GameHUDProps {
	/** Current budget amount */
	budget: number;
	/** Current heat/risk level percentage */
	heat: number;
	/** Current hype level percentage */
	hype: number;
	/** Optional countdown value when escalation is active */
	countdownValue?: number;
	/** Starting budget for progress bar calculation */
	startingBudget?: number;
}

function getBudgetColorClass(
	budgetCritical: boolean,
	budgetWarning: boolean,
): string {
	if (budgetCritical) return "text-red-500";
	if (budgetWarning) return "text-amber-400";
	return "text-green-400";
}

function getHeatColorClass(heatCritical: boolean, heatHigh: boolean): string {
	if (heatCritical) return "text-red-400";
	if (heatHigh) return "text-yellow-400";
	return "text-orange-500";
}

/**
 * GameHUD component displays the game's heads-up display with budget, risk, and hype meters.
 * Shows progress bars with color-coded thresholds for critical/warning states.
 * Includes pressure styling when under critical conditions.
 * @param props - The component props
 * @returns The rendered HUD component
 */
export const GameHUD = React.memo(function GameHUD({
	budget,
	heat,
	hype,
	countdownValue,
	startingBudget = INITIAL_BUDGET,
}: GameHUDProps) {
	const budgetCritical = budget < BUDGET_CRITICAL;
	const budgetWarning = budget < BUDGET_WARNING && !budgetCritical;
	const heatCritical = heat >= HEAT_CRITICAL;
	const heatHigh = heat >= HEAT_HIGH && !heatCritical;
	const underPressure =
		budgetCritical ||
		heatCritical ||
		(countdownValue != null && countdownValue > 0);

	return (
		<div
			className={`absolute top-2 md:top-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-3 md:px-4 pb-2 md:pb-0 flex flex-row items-center gap-2 md:gap-6 md:items-stretch z-10 transition-colors duration-300 ${underPressure ? "pressure-hud-intense" : ""}`}
			data-pressure={underPressure ? "true" : undefined}
		>
			<div className="flex-1 min-w-0 flex flex-row md:flex-col items-center md:items-stretch gap-1 md:space-y-1 md:gap-0">
				<div className="flex w-full min-w-0 flex-row flex-wrap items-center justify-start gap-x-1.5 gap-y-0 text-[10px] font-black tracking-wide md:mb-1">
					<span
						className={`${getBudgetColorClass(budgetCritical, budgetWarning)} ${budgetCritical ? "animate-pulse" : ""} inline-flex shrink-0 items-center gap-1`}
					>
						<i className="fa-solid fa-coins text-[10px]" aria-hidden></i>Budget
						{budgetCritical && (
							<span className="hidden md:inline text-red-400 text-[9px] uppercase tracking-wider ml-0.5">
								Critical
							</span>
						)}
					</span>
					<span
						data-hud="budget-value"
						className={`${getBudgetColorClass(budgetCritical, budgetWarning)} shrink-0 tabular-nums`}
					>
						{formatBudget(budget)}
					</span>
				</div>
				<div
					className={`hidden md:block h-2 bg-slate-900 rounded border overflow-hidden bg-stripes p-[1px] transition-colors ${budgetCritical ? "border-red-500/50" : budgetWarning ? "border-amber-500/30" : "border-white/10"}`}
				>
					<div
						className={`h-full progress-bar ${budgetCritical ? "bg-red-500" : budgetWarning ? "bg-amber-500" : "bg-green-500"}`}
						style={{
							width: `${Math.min(100, (budget / startingBudget) * 100)}%`,
						}}
					/>
				</div>
			</div>
			<div className="flex shrink-0 flex-row gap-2 md:gap-6 md:w-auto">
				<div className="flex min-w-0 flex-row md:w-28 md:flex-col items-center md:items-stretch gap-1 md:space-y-1 md:gap-0">
					<div className="flex w-full min-w-0 flex-row items-center justify-between gap-1.5 text-[10px] font-black tracking-wide md:mb-1">
						<span
							className={`${getHeatColorClass(heatCritical, heatHigh)} ${heatCritical ? "animate-pulse" : ""} inline-flex shrink-0 items-center gap-1`}
						>
							<i className="fa-solid fa-fire text-[10px]" aria-hidden></i>Risk
							{heatCritical && (
								<span className="hidden md:inline text-red-400 text-[9px] uppercase tracking-wider ml-0.5">
									Critical
								</span>
							)}
						</span>
						<span
							className={`${getHeatColorClass(heatCritical, heatHigh)} tabular-nums`}
						>
							{heat}%
						</span>
					</div>
					<div
						className={`hidden md:block h-2 bg-slate-900 rounded border overflow-hidden bg-stripes p-[1px] transition-colors ${heatCritical ? "border-red-500/50" : heatHigh ? "border-yellow-500/30" : "border-white/10"}`}
					>
						<div
							className={`h-full progress-bar ${heatCritical ? "bg-red-500" : heatHigh ? "bg-yellow-400" : "bg-orange-600"}`}
							style={{ width: `${heat}%` }}
						/>
					</div>
				</div>
				<div className="flex min-w-0 flex-row md:w-28 md:flex-col items-center md:items-stretch gap-1 md:space-y-1 md:gap-0">
					<div className="flex w-full min-w-0 flex-row items-center justify-between gap-1.5 text-[10px] font-black tracking-wide md:mb-1">
						<span
							className={`${hype < 20 ? "text-red-500 animate-pulse" : "text-cyan-400"} inline-flex shrink-0 items-center gap-1`}
						>
							<i className="fa-solid fa-rocket text-[10px]" aria-hidden></i>
							Hype
						</span>
						<span className="text-cyan-400 tabular-nums">{hype}%</span>
					</div>
					<div className="hidden md:block h-2 bg-slate-900 rounded border border-white/10 overflow-hidden bg-stripes p-[1px]">
						<div
							className={`h-full progress-bar ${hype < 20 ? "bg-red-500" : "bg-cyan-500"}`}
							style={{ width: `${hype}%` }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
});
