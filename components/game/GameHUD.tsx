import React from "react";

const INITIAL_BUDGET = 10000000;

interface GameHUDProps {
	budget: number;
	heat: number;
	hype: number;
}

function formatBudget(amount: number): string {
	if (amount >= 1000000) {
		return `$${(amount / 1000000).toFixed(1)}M`;
	}
	return `$${amount.toLocaleString()}`;
}

export const GameHUD = React.memo(function GameHUD({
	budget,
	heat,
	hype,
}: GameHUDProps) {
	return (
		<div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-3 md:px-4 pb-2 md:pb-0 flex flex-col md:flex-row gap-2 md:gap-6 items-stretch md:items-center z-10">
			<div className="flex-1 space-y-1 min-w-0">
				<div className="flex justify-between text-[10px] font-black tracking-wide mb-1">
					<span
						className={`${budget < 2000000 ? "text-red-500 animate-pulse" : "text-green-400"} inline-flex items-center gap-1.5`}
					>
						<i className="fa-solid fa-coins text-[10px]" aria-hidden></i>Budget
					</span>
					<span
						className={budget < 2000000 ? "text-red-500" : "text-green-400"}
					>
						{formatBudget(budget)}
					</span>
				</div>
				<div className="h-2 bg-slate-900 rounded border border-white/10 overflow-hidden bg-stripes p-[1px]">
					<div
						className={`h-full progress-bar ${budget < 2000000 ? "bg-red-500" : "bg-green-500"}`}
						style={{
							width: `${Math.min(100, (budget / INITIAL_BUDGET) * 100)}%`,
						}}
					/>
				</div>
			</div>
			<div className="flex gap-3 md:gap-6 w-full md:w-auto">
				<div className="flex-1 md:w-28 space-y-1">
					<div className="flex justify-between text-[10px] font-black tracking-wide mb-1">
						<span
							className={`${heat > 80 ? "text-yellow-400 animate-pulse" : "text-orange-500"} inline-flex items-center gap-1.5`}
						>
							<i className="fa-solid fa-fire text-[10px]" aria-hidden></i>Risk
						</span>
						<span className="text-orange-500">{heat}%</span>
					</div>
					<div className="h-2 bg-slate-900 rounded border border-white/10 overflow-hidden bg-stripes p-[1px]">
						<div
							className={`h-full progress-bar ${heat > 80 ? "bg-yellow-400" : "bg-orange-600"}`}
							style={{ width: `${heat}%` }}
						/>
					</div>
				</div>
				<div className="flex-1 md:w-28 space-y-1">
					<div className="flex justify-between text-[10px] font-black tracking-wide mb-1">
						<span
							className={`${hype < 20 ? "text-red-500 animate-pulse" : "text-cyan-400"} inline-flex items-center gap-1.5`}
						>
							<i className="fa-solid fa-chart-line text-[10px]" aria-hidden></i>
							Hype
						</span>
						<span className="text-cyan-400">{hype}%</span>
					</div>
					<div className="h-2 bg-slate-900 rounded border border-white/10 overflow-hidden bg-stripes p-[1px]">
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
