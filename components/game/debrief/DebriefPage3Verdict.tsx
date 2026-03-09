import type React from "react";
import type { Archetype, RoleType } from "../../../types";
import { getShareUrl } from "../../../utils/linkedin-share";
import LayoutShell from "../../LayoutShell";
import { EmailCaptureForm } from "./EmailCaptureForm";

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

export const DebriefPage3Verdict: React.FC<DebriefPage3VerdictProps> = ({
	archetype,
	archetypeDescription,
	resilienceScore,
	role,
	onRestart,
}) => {
	const resilienceContext = getResilienceContext(resilienceScore);
	const archetypeColorClass = getArchetypeColor(resilienceScore);

	const handleShareLinkedIn = () => {
		if (!role || !archetype) return;
		const linkedInUrl = getShareUrl(role, archetype, resilienceScore);
		window.open(linkedInUrl, "_blank", "width=550,height=420");
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
						onClick={handleShareLinkedIn}
						className="px-6 py-3 md:px-8 md:py-4 text-base font-bold tracking-wide bg-white text-black hover:bg-cyan-400 hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
					>
						<i className="fa-brands fa-linkedin text-lg"></i>
						Share to LinkedIn
					</button>
					<button
						type="button"
						onClick={onRestart}
						className="px-6 py-3 md:px-8 md:py-4 text-base font-bold tracking-wide bg-white text-black hover:bg-cyan-400 hover:text-black transition-all duration-300"
					>
						Reboot System
					</button>
				</div>

				{/* V2 Waitlist Email Capture */}
				<div className="p-6 rounded-xl border border-slate-700 bg-slate-900/30">
					<div className="flex items-center justify-center gap-2 mb-4">
						<i className="fa-solid fa-envelope text-cyan-400"></i>
						<span className="text-sm font-medium text-slate-300">
							Get early access to V2
						</span>
					</div>
					<p className="text-sm text-slate-400 mb-4">
						This was the static test. The real Kobayashi Maru adapts to your
						weaknesses.
						<br />
						Enter your email to be first in line for the adaptive version.
					</p>
					<EmailCaptureForm
						role={role || "unknown"}
						archetype={archetype?.id || "UNKNOWN"}
						resilience={resilienceScore}
					/>
				</div>
			</div>
		</LayoutShell>
	);
};
