import type React from "react";
import { useEffect, useState } from "react";
import { ROLE_LABELS } from "../../../data";
import { type Archetype, DeathType, type RoleType } from "../../../types";
import {
	encodeLinkedInShareUrl,
	formatShareText,
	getShareUrl,
} from "../../../utils/linkedin-share";
import LayoutShell from "../../LayoutShell";
import {
	GLASS_FILL_STRONG,
	GLASS_PANEL_DEFAULT,
} from "../selectionStageStyles";

const actionButtonBase =
	"px-6 py-3 md:px-8 md:py-4 text-base font-bold tracking-wide bg-white text-black hover:bg-cyan-400 hover:text-black transition-all duration-300 whitespace-nowrap";

interface DebriefPage3VerdictProps {
	archetype: Archetype | null;
	archetypeDescription: string;
	resilienceScore: number;
	role: RoleType | null;
	deathType?: DeathType | null;
	unlockedEndingsCount?: number;
	onRestart: () => void;
}

function getResilienceContext(score: number): string {
	if (score >= 80) return "Exceptional - You navigated the chaos with grace";
	if (score >= 60) return "Solid - You survived, mostly intact";
	if (score >= 40) return "Concerning - The system took its toll";
	return "Critical - You're lucky to be walking away";
}

function getArchetypeColor(score: number): string {
	if (score >= 80) return "text-emerald-400 border-emerald-500/40";
	if (score >= 60) return "text-cyan-400 border-cyan-500/40";
	if (score >= 40) return "text-amber-400 border-amber-500/40";
	return "text-red-400 border-red-500/40";
}

function updateMetaTags(
	archetype: Archetype | null,
	resilience: number,
	role: string | null,
): void {
	if (!archetype) return;

	// Update og:title for LinkedIn preview (displayed)
	// Format: Game - Archetype (Role, Score%)
	const roleLabel = role ? ` (${role})` : "";
	const ogTitle = `K-Maru - ${archetype.name}${roleLabel} • ${resilience}% Resilience`;
	const titleTag = document.querySelector('meta[property="og:title"]');
	if (titleTag) {
		titleTag.setAttribute("content", ogTitle);
	}

	// Update og:description for LinkedIn algorithm (130-160 chars optimal)
	// Friendly, brag-worthy message
	const ogDesc = `I faced the Kobayashi Maru as a ${role || "leader"} and discovered my leadership archetype. Can you beat my score?`;
	const descTag = document.querySelector('meta[property="og:description"]');
	if (descTag) {
		descTag.setAttribute("content", ogDesc);
	}

	// Update og:url for LinkedIn (current page URL)
	const urlTag = document.querySelector('meta[property="og:url"]');
	if (urlTag && typeof window !== "undefined") {
		urlTag.setAttribute("content", window.location.href);
	}
}

/** Phase 07: Kirk LinkedIn share text */
const KIRK_SHARE_TEXT =
	"I broke the Kobayashi Maru. There was always a third option. Kirk would be proud.\n\nhttps://k-maru-seven.vercel.app/";

export const DebriefPage3Verdict: React.FC<DebriefPage3VerdictProps> = ({
	archetype,
	archetypeDescription,
	resilienceScore,
	role,
	deathType,
	unlockedEndingsCount = 0,
	onRestart,
}) => {
	const isKirk = deathType === DeathType.KIRK;

	useEffect(() => {
		if (!archetype) return;
		const roleLabel = role ? ROLE_LABELS[role] : null;
		updateMetaTags(archetype, Math.round(resilienceScore), roleLabel);
	}, [archetype, resilienceScore, role]);

	const resilienceContext = getResilienceContext(resilienceScore);
	const archetypeColorClass = isKirk
		? "text-cyan-400 border-cyan-500/40"
		: getArchetypeColor(resilienceScore);

	// Kirk uses unique share template; normal players use standard share URL
	const linkedInShareUrl = isKirk
		? encodeLinkedInShareUrl(
				window.location.href,
				KIRK_SHARE_TEXT,
				"Kobayashi Maru - Kirk Ending",
			)
		: role && archetype
			? getShareUrl(role, archetype, resilienceScore)
			: null;

	const shareText = isKirk
		? KIRK_SHARE_TEXT
		: role && archetype
			? formatShareText(role, archetype.name, resilienceScore)
			: "";

	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		if (!shareText) return;
		try {
			await navigator.clipboard.writeText(shareText);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<LayoutShell className="p-4 pb-12 md:p-6 md:pb-16 text-center !bg-transparent">
			<div className="w-full max-w-2xl">
				<div className="mb-6 md:mb-8">
					<h1
						className={`text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter${isKirk ? " kirk-glitch-text" : ""}`}
					>
						{isKirk ? "SIMULATION HIJACKED" : "SIMULATION COMPLETE"}
					</h1>
					<p className="text-slate-400 text-base md:text-lg">
						{isKirk
							? "You found the third option"
							: "Your psych evaluation has been generated"}
					</p>
				</div>

				{/* Archetype Verdict */}
				<div
					className={`mb-6 md:mb-8 p-8 md:p-12 rounded-2xl border ${archetypeColorClass} ${GLASS_FILL_STRONG}`}
				>
					<div className="text-sm text-slate-400 uppercase tracking-widest mb-4">
						Classification
					</div>
					<h2
						className={`text-4xl md:text-6xl font-black mb-4 tracking-tighter${isKirk ? " kirk-glitch-text text-cyan-400" : ""}`}
					>
						{archetype?.name ?? "Unknown"}
					</h2>
					{/* Kirk: Skill Acquired badge */}
					{isKirk && (
						<div className="inline-block px-4 py-1 mb-4 rounded-full border border-cyan-400 text-cyan-400 text-sm font-bold uppercase tracking-widest">
							Skill Acquired
						</div>
					)}
					<p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-lg mx-auto">
						{archetypeDescription}
					</p>
				</div>

				{/* Resilience Score — "Simulation Integrity" for Kirk */}
				<div className={`mb-6 md:mb-8 p-6 rounded-xl ${GLASS_PANEL_DEFAULT}`}>
					<div className="text-sm text-slate-400 uppercase tracking-widest mb-2">
						{isKirk ? "Simulation Integrity" : "Resilience Score"}
					</div>
					<div className="flex items-center justify-center gap-4 mb-2">
						<span
							className={`text-5xl md:text-7xl font-black ${isKirk ? "text-cyan-400" : "text-white"}`}
						>
							{isKirk ? "0%" : `${resilienceScore}%`}
						</span>
					</div>
					<p className="text-slate-400">
						{isKirk
							? "You broke the test. That was never supposed to happen."
							: resilienceContext}
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 w-fit max-w-full mx-auto">
					<button
						type="button"
						onClick={handleCopy}
						disabled={!shareText}
						className={`${actionButtonBase} flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
						aria-label="Copy share text to clipboard"
					>
						<i className="fa-regular fa-copy text-lg"></i>
						{copied ? "Copied!" : "1. Copy to Clipboard"}
					</button>
					<a
						href={linkedInShareUrl || "#"}
						className={`${actionButtonBase} flex items-center justify-center gap-2`}
						aria-label="Share on LinkedIn"
						onClick={(e) => {
							if (!linkedInShareUrl) {
								e.preventDefault();
							}
						}}
					>
						<i className="fa-brands fa-linkedin text-lg"></i>
						2. Share on LinkedIn
					</a>
					<button
						type="button"
						onClick={onRestart}
						className={actionButtonBase}
					>
						Reboot System
					</button>
				</div>

				{/* V2 Waitlist LinkedIn CTA */}
				<div className={`p-6 rounded-xl ${GLASS_PANEL_DEFAULT}`}>
					<div className="text-sm text-slate-400 uppercase tracking-widest mb-4">
						Early access to V2
					</div>
					<p className="text-sm text-slate-400 mb-6">
						This was the static test. The adaptive version crawls the web for
						new use cases relevant for you, reads your decisions in real time
						and adapts in response.
						<br />
						<br />
						Message me on LinkedIn if you want to be first to test it.
					</p>
					<a
						href="https://www.linkedin.com/in/schwedeny/"
						className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 text-base font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors duration-200"
					>
						<i className="fa-brands fa-linkedin text-lg"></i>
						Message Yevgen Schweden
					</a>
				</div>

				{/* "...or is it?" hint for completionists — shown to all players */}
				<div className="mt-6 text-center">
					<p className="text-sm text-slate-500">
						Endings discovered: {unlockedEndingsCount}/6{" "}
						<span className="italic text-slate-600 text-xs">...or is it?</span>
					</p>
				</div>
			</div>
		</LayoutShell>
	);
};
