import type React from "react";
import { useEffect, useState } from "react";
import type { Archetype, RoleType } from "../../../types";
import { formatShareText, getShareUrl } from "../../../utils/linkedin-share";
import LayoutShell from "../../LayoutShell";

// Utility function to format role labels (e.g., "SOFTWARE_ENGINEER" -> "Software Engineer")
const formatRoleLabel = (role: RoleType | null): string | null => {
	if (!role) return null;
	return role
		.replace(/_/g, " ")
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
};

// import { EmailCaptureForm } from "./EmailCaptureForm";

interface DebriefPage3VerdictProps {
	archetype: Archetype | null;
	archetypeDescription: string;
	resilienceScore: number;
	role: RoleType | null;
	onRestart: () => void;
}

function getResilienceContext(score: number): string {
	if (score >= 80) return "Exceptional - You navigated the chaos with grace";
	if (score >= 60) return "Solid - You survived, mostly intact";
	if (score >= 40) return "Concerning - The system took its toll";
	return "Critical - You're lucky to be walking away";
}

function getArchetypeColor(score: number): string {
	if (score >= 80)
		return "text-emerald-400 border-emerald-500/30 bg-emerald-950/20";
	if (score >= 60) return "text-cyan-400 border-cyan-500/30 bg-cyan-950/20";
	if (score >= 40) return "text-amber-400 border-amber-500/30 bg-amber-950/20";
	return "text-red-400 border-red-500/30 bg-red-950/20";
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

export const DebriefPage3Verdict: React.FC<DebriefPage3VerdictProps> = ({
	archetype,
	archetypeDescription,
	resilienceScore,
	role,
	onRestart,
}) => {
	// Update meta tags when archetype loads (for LinkedIn sharing)
	useEffect(() => {
		if (archetype) {
			const roleLabel = formatRoleLabel(role);
			updateMetaTags(archetype, Math.round(resilienceScore), roleLabel);
		}
	}, [archetype, resilienceScore, role]);

	const resilienceContext = getResilienceContext(resilienceScore);
	const archetypeColorClass = getArchetypeColor(resilienceScore);

	const linkedInShareUrl =
		role && archetype ? getShareUrl(role, archetype, resilienceScore) : null;

	// Generate share text for clipboard
	const shareText =
		role && archetype
			? formatShareText(role, archetype.name, resilienceScore)
			: "";

	// Copy feedback state
	const [copied, setCopied] = useState(false);

	// Handle copy to clipboard
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
		<LayoutShell className="p-4 pb-12 md:p-6 md:pb-16 text-center bg-slate-950">
			<div className="w-full max-w-2xl">
				{/* Header */}
				<div className="mb-6 md:mb-8">
					<h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter">
						SIMULATION COMPLETE
					</h1>
					<p className="text-slate-400 text-base md:text-lg">
						Your psych evaluation has been generated
					</p>
				</div>

				{/* Archetype Verdict */}
				<div
					className={`mb-6 md:mb-8 p-8 md:p-12 rounded-2xl border ${archetypeColorClass}`}
				>
					<div className="text-sm text-slate-400 uppercase tracking-widest mb-4">
						Classification
					</div>
					<h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
						{archetype?.name ?? "Unknown"}
					</h2>
					<p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-lg mx-auto">
						{archetypeDescription}
					</p>
				</div>

				{/* Resilience Score */}
				<div className="mb-6 md:mb-8 p-6 rounded-xl border border-slate-800 bg-slate-900/30">
					<div className="text-sm text-slate-400 uppercase tracking-widest mb-2">
						Resilience Score
					</div>
					<div className="flex items-center justify-center gap-4 mb-2">
						<span className="text-5xl md:text-7xl font-black text-white">
							{resilienceScore}%
						</span>
					</div>
					<p className="text-slate-400">{resilienceContext}</p>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
					<button
						type="button"
						onClick={handleCopy}
						disabled={!shareText}
						className="px-6 py-3 md:px-8 md:py-4 text-base font-bold tracking-wide bg-white text-black hover:bg-cyan-400 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
						aria-label="Copy share text to clipboard"
					>
						<i className="fa-regular fa-copy text-lg"></i>
						{copied ? "Copied!" : "1. Copy to Clipboard"}
					</button>
					<a
						href={linkedInShareUrl || "#"}
						className="px-6 py-3 md:px-8 md:py-4 text-base font-bold tracking-wide bg-white text-black hover:bg-cyan-400 hover:text-black transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
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
						className="px-6 py-3 md:px-8 md:py-4 text-base font-bold tracking-wide bg-white text-black hover:bg-cyan-400 hover:text-black transition-all duration-300 whitespace-nowrap"
					>
						Reboot System
					</button>
				</div>

				{/* V2 Waitlist LinkedIn CTA */}
				<div className="p-6 rounded-xl border border-slate-700 bg-slate-900/30">
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

					{/*
					PRESERVED FOR FUTURE RE-ENABLEMENT:
					<EmailCaptureForm
						role={role || "unknown"}
						archetype={archetype?.id || "UNKNOWN"}
						resilience={resilienceScore}
					/>
					*/}
				</div>
			</div>
		</LayoutShell>
	);
};
