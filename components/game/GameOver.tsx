import type React from "react";
import { DEATH_ENDINGS } from "../../data";
import { DeathType, type GameState } from "../../types";
import LayoutShell from "../LayoutShell";

interface GameOverProps {
	state: GameState;
	onRestart: () => void;
}

function formatBudget(amount: number): string {
	if (amount >= 1000000) {
		return `$${(amount / 1000000).toFixed(1)}M`;
	}
	return `$${amount.toLocaleString()}`;
}

export const GameOver: React.FC<GameOverProps> = ({ state, onRestart }) => {
	const deathEnding = state.deathType ? DEATH_ENDINGS[state.deathType] : null;

	return (
		<LayoutShell className="p-4 md:p-6 text-center bg-[#1a0505]">
			<div className="w-full max-w-2xl">
				{deathEnding && (
					<>
						<div
							className={`text-6xl md:text-9xl mb-4 md:mb-6 animate-pulse drop-shadow-[0_0_30px_rgba(220,38,38,0.5)] ${deathEnding.color}`}
						>
							<i className={`fa-solid ${deathEnding.icon}`} aria-hidden></i>
						</div>
						<h2
							className={`text-3xl md:text-6xl font-black mb-3 md:mb-4 tracking-tighter ${deathEnding.color}`}
						>
							{deathEnding.title}
						</h2>
						<p className="max-w-xl text-base md:text-xl mb-6 md:mb-8 text-slate-400 leading-relaxed px-4 mx-auto">
							{deathEnding.description}
						</p>
					</>
				)}

				<div className="mb-3 md:mb-4 p-3 md:p-4 rounded-lg">
					<div className="text-red-400 text-xs font-bold tracking-wide mb-1">
						Final budget
					</div>
					<div className="text-2xl md:text-3xl font-black text-red-500">
						{formatBudget(state.budget)}
					</div>
				</div>

				{/* Collection Progress */}
				<div className="mb-6 md:mb-8 p-4 md:p-6 rounded-xl">
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
					className="px-6 py-3 md:px-12 md:py-4 text-base md:text-xl font-bold tracking-wide bg-white text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105 min-h-[40px] md:min-h-[48px]"
				>
					Reboot system
				</button>
			</div>
		</LayoutShell>
	);
};
