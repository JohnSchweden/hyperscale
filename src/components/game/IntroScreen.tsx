import type React from "react";
import { useEffect, useRef, useState } from "react";
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
	const [linkCopied, setLinkCopied] = useState(false);
	const linkCopiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (linkCopiedTimerRef.current) clearTimeout(linkCopiedTimerRef.current);
		};
	}, []);

	// Synchronous handler — keeps iOS gesture trust intact throughout execution.
	// execCommand runs first (synchronous, reliable on iOS within user gesture).
	// Clipboard API is the fallback for browsers where execCommand is unsupported.
	const handleCopyLink = () => {
		const url = window.location.href;

		// execCommand first — synchronous, works within iOS Safari user gesture.
		// Position at top:0/left:0 with opacity:0 so iOS allows focus + selection.
		const ta = document.createElement("textarea");
		ta.value = url;
		ta.style.cssText =
			"position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:none;outline:none;background:transparent;opacity:0;font-size:16px;";
		document.body.appendChild(ta);
		ta.focus();
		ta.setSelectionRange(0, url.length);
		let success = false;
		try {
			success = document.execCommand("copy");
		} catch {
			/* ignore */
		}
		document.body.removeChild(ta);

		if (success) {
			setLinkCopied(true);
			if (linkCopiedTimerRef.current) clearTimeout(linkCopiedTimerRef.current);
			linkCopiedTimerRef.current = setTimeout(() => setLinkCopied(false), 2000);
			return;
		}

		// Clipboard API fallback (desktop and Android)
		if (navigator.clipboard?.writeText) {
			void navigator.clipboard.writeText(url).then(() => {
				setLinkCopied(true);
				if (linkCopiedTimerRef.current)
					clearTimeout(linkCopiedTimerRef.current);
				linkCopiedTimerRef.current = setTimeout(
					() => setLinkCopied(false),
					2000,
				);
			});
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
					onClick={handleCopyLink}
					className="px-4 py-2 text-xs font-bold tracking-wide border border-slate-600 text-slate-400 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors duration-200 min-h-[44px]"
				>
					{linkCopied ? "Link copied." : "Copy game link"}
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
