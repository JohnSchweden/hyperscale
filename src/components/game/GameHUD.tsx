import React from "react";
import { formatBudget } from "../../lib/formatting";
import {
	BUDGET_CRITICAL,
	HEAT_CRITICAL,
	HEAT_HIGH,
} from "../../lib/thresholds";

export const INITIAL_BUDGET = 10000000;
const BUDGET_WARNING = 3_000_000;

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
	const budgetWarning = budget < BUDGET_WARNING;
	const heatCritical = heat >= HEAT_CRITICAL;
	const heatHigh = heat >= HEAT_HIGH && !heatCritical;
	const hypeCritical = hype < 20;
	const underPressure =
		budgetCritical ||
		heatCritical ||
		(countdownValue != null && countdownValue > 0);

	const budgetProgress = Math.min(100, (budget / startingBudget) * 100);
	const budgetColorFn = ({
		critical,
		warning,
	}: {
		critical: boolean;
		warning?: boolean;
	}) => {
		if (critical) return "text-red-500";
		if (warning) return "text-amber-400";
		return "text-green-400";
	};
	const budgetProgressColor = budgetCritical
		? "bg-red-500"
		: budgetWarning
			? "bg-amber-500"
			: "bg-green-500";
	const budgetBorderColor = budgetCritical
		? "border-red-500/50"
		: budgetWarning
			? "border-amber-500/30"
			: "border-white/10";

	const heatColorFn = ({
		critical,
		high,
	}: {
		critical: boolean;
		high?: boolean;
	}) => {
		if (critical) return "text-red-400";
		if (high) return "text-yellow-400";
		return "text-orange-500";
	};
	const heatProgressColor = heatCritical
		? "bg-red-500"
		: heatHigh
			? "bg-yellow-400"
			: "bg-orange-600";
	const heatBorderColor = heatCritical
		? "border-red-500/50"
		: heatHigh
			? "border-yellow-500/30"
			: "border-white/10";

	const hypeColorFn = ({ critical }: { critical: boolean }) => {
		if (critical) return "text-red-500";
		return "text-cyan-400";
	};
	const hypeProgressColor = hypeCritical ? "bg-red-500" : "bg-cyan-500";

	return (
		<div
			className={`absolute top-2 md:top-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-3 md:px-4 pb-2 md:pb-0 flex flex-row items-center justify-between md:justify-start gap-2 md:gap-6 md:items-stretch z-10 transition-colors duration-300 ${underPressure ? "pressure-hud-intense" : ""}`}
			data-pressure={underPressure ? "true" : undefined}
		>
			<div className="min-w-0 flex flex-1 flex-col space-y-1">
				<div className="flex w-full min-w-0 flex-row flex-wrap items-center justify-start md:justify-between gap-x-1.5 gap-y-0 text-[10px] lg:text-[11.5px] font-black tracking-wide">
					<span
						className={`${budgetColorFn({ critical: budgetCritical, warning: budgetWarning })} ${budgetCritical ? "animate-pulse" : ""} inline-flex shrink-0 items-center gap-1`}
					>
						<i
							className={`fa-solid fa-coins text-[10px] lg:text-[11.5px]`}
							aria-hidden
						></i>
						Budget
						{budgetCritical && (
							<span className="hidden md:inline text-red-400 text-[9px] lg:text-[10.5px] uppercase tracking-wider ml-0.5">
								Critical
							</span>
						)}
					</span>
					<span
						className={`${budgetColorFn({ critical: budgetCritical, warning: budgetWarning })} shrink-0 tabular-nums`}
						data-hud="budget-value"
					>
						{formatBudget(budget)}
					</span>
				</div>
				<div
					className={`hidden md:block h-2 lg:h-[11px] w-full min-w-0 bg-slate-900 rounded border overflow-hidden bg-stripes p-[1px] transition-colors ${budgetBorderColor}`}
				>
					<div
						className={`h-full progress-bar ${budgetProgressColor}`}
						style={{ width: `${Math.min(100, budgetProgress)}%` }}
					/>
				</div>
			</div>
			<div className="flex shrink-0 flex-row items-center gap-2 md:contents">
				<div className="flex min-w-0 shrink-0 flex-col space-y-1 md:w-28 md:flex-none lg:w-36">
					<div className="flex w-full min-w-0 flex-row flex-wrap items-center justify-start md:justify-between gap-x-1.5 gap-y-0 text-[10px] lg:text-[11.5px] font-black tracking-wide">
						<span
							className={`${heatColorFn({ critical: heatCritical, high: heatHigh })} ${heatCritical ? "animate-pulse" : ""} inline-flex shrink-0 items-center gap-1`}
						>
							<i
								className={`fa-solid fa-fire text-[10px] lg:text-[11.5px]`}
								aria-hidden
							></i>
							Risk
							{heatCritical && (
								<span className="hidden md:inline text-red-400 text-[9px] lg:text-[10.5px] uppercase tracking-wider ml-0.5">
									Critical
								</span>
							)}
						</span>
						<span
							className={`${heatColorFn({ critical: heatCritical, high: heatHigh })} shrink-0 tabular-nums`}
							data-hud="risk-value"
						>
							{heat}%
						</span>
					</div>
					<div
						className={`hidden md:block h-2 lg:h-[11px] w-full min-w-0 bg-slate-900 rounded border overflow-hidden bg-stripes p-[1px] transition-colors ${heatBorderColor}`}
					>
						<div
							className={`h-full progress-bar ${heatProgressColor}`}
							style={{ width: `${Math.min(100, heat)}%` }}
						/>
					</div>
				</div>
				<div className="flex min-w-0 shrink-0 flex-col space-y-1 md:w-28 md:flex-none lg:w-36">
					<div className="flex w-full min-w-0 flex-row flex-wrap items-center justify-start md:justify-between gap-x-1.5 gap-y-0 text-[10px] lg:text-[11.5px] font-black tracking-wide">
						<span
							className={`${hypeColorFn({ critical: hypeCritical })} ${hypeCritical ? "animate-pulse" : ""} inline-flex shrink-0 items-center gap-1`}
						>
							<i
								className={`fa-solid fa-rocket text-[10px] lg:text-[11.5px]`}
								aria-hidden
							></i>
							Hype
						</span>
						<span
							className={`${hypeColorFn({ critical: hypeCritical })} shrink-0 tabular-nums`}
							data-hud="hype-value"
						>
							{hype}%
						</span>
					</div>
					<div
						className={`hidden md:block h-2 lg:h-[11px] w-full min-w-0 bg-slate-900 rounded border overflow-hidden bg-stripes p-[1px] transition-colors border-white/10`}
					>
						<div
							className={`h-full progress-bar ${hypeProgressColor}`}
							style={{ width: `${Math.min(100, hype)}%` }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
});
