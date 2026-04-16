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
	const handleCopyLink = async () => {
		const url = window.location.href;
		// Modern Clipboard API — works on desktop and Android (RESEARCH.md primary)
		if (
			navigator.clipboard &&
			typeof navigator.clipboard.writeText === "function"
		) {
			try {
				await navigator.clipboard.writeText(url);
				return;
			} catch {
				// iOS Safari may reject — fall through to execCommand fallback (RESEARCH.md)
			}
		}
		// execCommand fallback for iOS Safari (RESEARCH.md Pattern 4)
		// Works synchronously within user gesture, satisfying Safari's requirements
		const el = document.createElement("textarea");
		el.value = url;
		el.style.position = "fixed";
		el.style.left = "-9999px";
		el.style.top = "-9999px";
		document.body.appendChild(el);
		el.focus();
		el.select();
		try {
			document.execCommand("copy");
		} finally {
			document.body.removeChild(el);
		}
	};

	return (
		<LayoutShell className={LAYOUT_SHELL_CENTERED_CLASS}>
			{/* Brand Block */}
			<div className="mb-6 md:mb-8 relative">
				<h1 className="text-6xl md:text-7xl font-bold glitch-text tracking-tighter mb-2">
					K-Maru
				</h1>
				<div className="text-slate-400 text-xs md:text-sm mb-3">
					AI No-Win Scenario Simulator
				</div>
				<div className="text-red-600 font-bold mono text-xs md:text-sm animate-pulse tracking-[0.4em]">
					incident_response_terminal
					{" // "}
					os_v0.92
				</div>
			</div>

			{/* Notice — moved to top */}
			<p className="max-w-xl text-[#B8962E] mono text-sm md:text-base mb-4 md:mb-6 px-4 text-center font-bold">
				[NOTICE: F*ck mandatory slides. Stress-test the calls you&apos;d
				normally sign off on]
			</p>

			{/* Main Hook Block */}
			<p className="max-w-xl text-slate-300 mb-12 md:mb-16 text-base md:text-lg px-4 leading-relaxed">
				<span className="font-bold block mb-3 text-white text-lg md:text-xl">
					Every AI decision you make will blow up in your face.
					<br /> That's not a bug. That's the training.
				</span>
				<span className="text-slate-400 block mb-4">
					Swipe through real workplace AI dilemmas.
					<br /> Pick the least bad option. Watch it become the worst option.
					<br /> Repeat until Congress gets involved.
				</span>
				<span className="block text-slate-500 text-sm mono">
					10 minutes · No signup · Based on actual 2024–25 incidents
					<br /> (The scenarios are fictional. The lawsuits they're based on
					aren't.)
				</span>
			</p>

			{/* Role & CTA Block */}
			<p className="max-w-xl text-slate-300 mb-8 md:mb-10 text-base md:text-lg px-4">
				<span className="block mb-6">
					Pick your role. Pick your AI companion.
					<br /> Try not to end up as a case study.
				</span>
			</p>

			<div className="w-full flex justify-center mb-10 md:mb-12">
				<button
					type="button"
					onClick={onStart}
					data-testid="boot-system-button"
					className="px-4 py-2 md:px-8 md:py-3 text-base font-bold tracking-wide bg-white text-black min-h-[40px] md:min-h-[48px] transition-colors duration-300 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
				>
					Boot system
				</button>
			</div>

			{/* Team Mode */}
			<p className="max-w-xl text-slate-400 text-xs md:text-sm mb-3 md:mb-4 px-4 text-center leading-relaxed">
				[TEAM MODE: Forward this to a colleague.
				<br /> Watch them swipe the opposite way on every card.
				<br /> That&apos;s the debrief you never got from HR.]
			</p>

			<div className="w-full flex justify-center mb-10 md:mb-12">
				<button
					type="button"
					data-testid="copy-game-link-button"
					onClick={() => void handleCopyLink()}
					className="px-4 py-2 text-xs font-bold tracking-wide border border-slate-600 text-slate-400 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors duration-200 min-h-[44px]"
				>
					Copy game link
				</button>
			</div>

			{/* Footer warnings */}
			<div className="mt-6 md:mt-8 mono text-xs text-red-500 px-4 text-center">
				WARNING: PREVIOUS COMPLIANCE OFFICER CURRENTLY PENDING LITIGATION
			</div>
			<div className="mt-3 mono text-[10px] text-slate-500 px-4 text-center">
				Captain Kirk passed this test. You won&apos;t.
			</div>
		</LayoutShell>
	);
};
