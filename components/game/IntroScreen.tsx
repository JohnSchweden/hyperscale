import type React from "react";
import LayoutShell from "../LayoutShell";
import { LAYOUT_SHELL_CENTERED_CLASS } from "./selectionStageStyles";

/**
 * Props for the IntroScreen component.
 */
interface IntroScreenProps {
	/** Callback function triggered when the user clicks the boot system button */
	onStart: () => void;
}

/**
 * IntroScreen component displays the initial game introduction screen.
 * Shows the game title, description, and boot system button.
 * Provides context about the game's premise and starts the simulation.
 * @param props - The component props
 * @returns The rendered intro screen component
 */
export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
	return (
		<LayoutShell className={LAYOUT_SHELL_CENTERED_CLASS}>
			<div className="mb-8 md:mb-12 relative">
				<h1 className="text-6xl md:text-7xl font-bold glitch-text tracking-tighter mb-2">
					K-Maru
				</h1>
				<div className="text-red-600 font-bold mono text-xs md:text-sm animate-pulse tracking-[0.4em]">
					incident_response_terminal
					{" // "}
					os_v0.92
				</div>
			</div>
			<p className="max-w-xl text-slate-300 mb-8 md:mb-10 text-base md:text-lg px-4 leading-relaxed">
				<span className="font-bold block mb-2">
					AI Kobayashi Maru: A No-Win Simulation for the Brave
				</span>
				<span className="text-slate-400">
					Swipe your way through the AI Singularity. It's not about passing;
					it's about discovering who you are when the system collapses.
				</span>
				<span className="block mt-2 text-[#B8962E] mono text-sm md:text-base">
					[NOTICE: Made for people who hate f*cking boring training]
				</span>
			</p>
			<p className="max-w-xl text-slate-300 mb-12 md:mb-16 text-base md:text-lg px-4">
				<span className="text-slate-300 font-bold block mb-2">
					Project Icarus: The Last Human in the Loop
				</span>
				<span className="text-slate-400">
					The CEO just gave "Full Autonomy" to an experimental LLM. The
					safeguards are off. The servers are screaming.
				</span>
				<span className="block mt-2 text-white">
					You have 60 seconds to prevent a global PR meltdown or a total company
					liquidation. <span className="cursor-blink text-white">_</span>
				</span>
			</p>
			<div className="w-full flex justify-center">
				<button
					type="button"
					onClick={onStart}
					data-testid="boot-system-button"
					className="px-6 py-3 md:px-12 md:py-4 text-base md:text-xl font-bold tracking-wide bg-white text-black min-h-[40px] md:min-h-[48px] transition-colors duration-300 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
				>
					Boot system
				</button>
			</div>
			<div className="mt-8 md:mt-12 mono text-xs text-red-500 px-4 text-center">
				WARNING: PREVIOUS COMPLIANCE OFFICER CURRENTLY PENDING LITIGATION
			</div>
			<div className="mt-4 mono text-[10px] text-slate-500 px-4 text-center">
				Captain Kirk passed this test. You won&apos;t.
			</div>
		</LayoutShell>
	);
};
