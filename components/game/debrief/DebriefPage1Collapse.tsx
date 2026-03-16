import type React from "react";
import { DEATH_ENDINGS } from "../../../data";
import { useUnlockedEndings } from "../../../hooks";
import { DeathType, type GameState, PersonalityType } from "../../../types";
import LayoutShell from "../../LayoutShell";

function getPersonalityReplayLine(personality: PersonalityType | null): string {
	switch (personality) {
		case PersonalityType.ROASTER:
			return "Go ahead. Fail differently this time.";
		case PersonalityType.ZEN_MASTER:
			return "The test awaits your next attempt. Wisdom lies in repetition.";
		case PersonalityType.LOVEBOMBER:
			return "I believe in you. Let's see what you learn next time!";
		default:
			return "Ready for another attempt?";
	}
}

interface DebriefPage1CollapseProps {
	state: GameState;
	onNext: () => void;
}

function formatBudget(amount: number): string {
	if (amount >= 1000000) {
		return `$${(amount / 1000000).toFixed(1)}M`;
	}
	return `$${amount.toLocaleString()}`;
}

export const DebriefPage1Collapse: React.FC<DebriefPage1CollapseProps> = ({
	state,
	onNext,
}) => {
	const deathEnding = state.deathType ? DEATH_ENDINGS[state.deathType] : null;
	const { progressText, unlockedCount, totalCount } = useUnlockedEndings(
		state.unlockedEndings,
	);
	const replayLine = getPersonalityReplayLine(state.personality);

	return (
		<LayoutShell className="p-4 pb-12 md:p-6 md:pb-16 text-center bg-[#1a0505]">
			<div className="w-full max-w-2xl">
				{/* Game Over Header */}
				<div className="mb-6 md:mb-8">
					<h1 className="text-4xl md:text-6xl font-black text-red-500 mb-2 tracking-tighter">
						GAME OVER
					</h1>
					<p className="text-slate-400 text-base md:text-lg">
						Your tenure has come to an end
					</p>
				</div>

				{/* Death Ending Display */}
				{deathEnding && (
					<div className="mb-6 md:mb-8 p-6 md:p-8 rounded-xl border border-red-900/30 bg-red-950/20">
						<div
							className={`text-5xl md:text-7xl mb-4 animate-pulse drop-shadow-[0_0_30px_rgba(220,38,38,0.5)] ${deathEnding.color}`}
						>
							<i className={`fa-solid ${deathEnding.icon}`} aria-hidden></i>
						</div>
						<h2
							className={`text-2xl md:text-3xl font-bold mb-3 tracking-tighter ${deathEnding.color}`}
						>
							{deathEnding.title}
						</h2>
						<p className="text-slate-300 text-base md:text-lg leading-relaxed">
							{deathEnding.description}
						</p>
					</div>
				)}

				{/* Final Metrics */}
				<div className="mb-6 md:mb-8 grid grid-cols-3 gap-4">
					<div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
						<div className="text-xs text-slate-400 tracking-wide mb-1">
							Budget
						</div>
						<div
							className={`text-xl md:text-2xl font-black ${state.budget > 0 ? "text-emerald-400" : "text-red-500"}`}
						>
							{formatBudget(state.budget)}
						</div>
					</div>
					<div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
						<div className="text-xs text-slate-400 tracking-wide mb-1">
							Heat
						</div>
						<div
							className={`text-xl md:text-2xl font-black ${state.heat < 100 ? "text-amber-400" : "text-red-500"}`}
						>
							{state.heat}%
						</div>
					</div>
					<div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
						<div className="text-xs text-slate-400 tracking-wide mb-1">
							Hype
						</div>
						<div className="text-xl md:text-2xl font-black text-cyan-400">
							{state.hype}%
						</div>
					</div>
				</div>

				{/* Collection Progress - Prominent Display */}
				<div className="mb-6 md:mb-8 p-4 md:p-6 rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-slate-900/50">
					{/* Header with icon */}
					<div className="flex items-center justify-center gap-2 mb-4">
						<i className="fa-solid fa-trophy text-cyan-400 text-lg"></i>
						<div className="text-xs text-cyan-400 tracking-widest uppercase font-bold">
							Unlocked Endings
						</div>
						<i className="fa-solid fa-trophy text-cyan-400 text-lg"></i>
					</div>

					{/* Progress count */}
					<div className="mb-4">
						<div className="text-3xl md:text-4xl font-black text-cyan-400">
							{unlockedCount}
							<span className="text-slate-500">/{totalCount}</span>
						</div>
					</div>

					{/* Icon grid */}
					<div className="flex gap-2 md:gap-3 justify-center flex-wrap mb-4">
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

					{/* Encouragement text from hook */}
					<p className="text-sm md:text-base text-slate-300 leading-relaxed mb-3">
						{progressText}
					</p>

					{/* Personality-specific replay encouragement */}
					<p className="text-sm italic text-cyan-400/80">{replayLine}</p>
				</div>

				{/* Debrief Me Button */}
				<button
					type="button"
					onClick={onNext}
					className="px-6 py-3 md:px-12 md:py-4 text-base md:text-xl font-bold tracking-wide bg-white text-black hover:bg-cyan-400 hover:text-black transition-all duration-300 min-h-[40px] md:min-h-[48px]"
				>
					Debrief Me
				</button>
			</div>
		</LayoutShell>
	);
};
