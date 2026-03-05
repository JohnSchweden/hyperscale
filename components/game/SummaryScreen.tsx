import type React from "react";
import { DEATH_ENDINGS } from "../../data";
import { DeathType, type GameState } from "../../types";
import LayoutShell from "../LayoutShell";

interface SummaryScreenProps {
	state: GameState;
	onRestart: () => void;
}

function formatBudget(amount: number): string {
	if (amount >= 1000000) {
		return `$${(amount / 1000000).toFixed(1)}M`;
	}
	return `$${amount.toLocaleString()}`;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
	state,
	onRestart,
}) => {
	return (
		<LayoutShell className="p-4 md:p-6 text-center bg-[#051a0d]">
			<div className="w-full max-w-2xl">
				<div className="text-6xl md:text-9xl text-green-500 mb-6 md:mb-8 animate-bounce drop-shadow-[0_0_30px_rgba(34,197,94,0.4)]">
					<i className="fa-solid fa-trophy" aria-hidden></i>
				</div>
				<h2 className="text-3xl md:text-6xl font-black mb-3 md:mb-4 tracking-tighter text-green-400">
					Quarter survived
				</h2>
				<p className="max-w-xl text-base md:text-xl mb-6 md:mb-8 text-slate-400 px-4 mx-auto">
					Against all odds, the company is still legal. You've earned a voucher
					for a synthetic coffee.
				</p>

				<div className="mb-6 md:mb-8 p-4 md:p-6 bg-green-900/20 border border-green-500/30 rounded-xl">
					<div className="text-green-400 text-xs font-bold tracking-wide mb-1">
						Remaining budget
					</div>
					<div className="text-3xl md:text-4xl font-black text-green-500">
						{formatBudget(state.budget)}
					</div>
				</div>

				{/* Collection Progress */}
				<div className="mb-6 md:mb-8 p-4 md:p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
					<div className="text-xs text-slate-400 tracking-wide mb-3 md:mb-4">
						Ending collection
					</div>
					<div className="flex gap-2 md:gap-3 justify-center flex-wrap">
						{Object.values(DeathType).map((type) => (
							<div
								key={type}
								className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${
									state.unlockedEndings.includes(type)
										? "bg-cyan-500/20 border border-cyan-500"
										: "bg-slate-800 border border-slate-700 opacity-30"
								}`}
								title={DEATH_ENDINGS[type].title}
							>
								<i
									className={`fa-solid ${DEATH_ENDINGS[type].icon} ${state.unlockedEndings.includes(type) ? "text-cyan-400" : "text-slate-600"}`}
									aria-hidden
								></i>
							</div>
						))}
					</div>
					<div className="mt-3 text-sm text-slate-400">
						{state.unlockedEndings.length} / {Object.keys(DeathType).length}{" "}
						unlocked
					</div>
				</div>

				<button
					type="button"
					onClick={onRestart}
					className="px-6 py-3 md:px-16 md:py-5 text-base md:text-2xl font-black tracking-wide bg-green-600 text-white hover:bg-white hover:text-green-600 transition-all shadow-xl min-h-[40px] md:min-h-[48px]"
				>
					Log off
				</button>
			</div>
		</LayoutShell>
	);
};
