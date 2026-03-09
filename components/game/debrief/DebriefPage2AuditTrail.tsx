import type React from "react";
import { PERSONALITIES, ROLE_CARDS } from "../../../data";
import { type GameState, PersonalityType, RoleType } from "../../../types";
import LayoutShell from "../../LayoutShell";

interface DebriefPage2AuditTrailProps {
	state: GameState;
	onNext: () => void;
}

function getPersonalityComment(personality: PersonalityType): string {
	switch (personality) {
		case PersonalityType.ROASTER:
			return "Well, at least you were consistently terrible. The board will remember this when they write your farewell card.";
		case PersonalityType.ZEN_MASTER:
			return "Your journey was turbulent, but every stumble teaches. The data flows on, regardless of our attachment to outcomes.";
		case PersonalityType.LOVEBOMBER:
			return "Bro! That was WILD! You made CHOICES! Some of them were... definitely choices! We LITERALLY saw it all happen!";
		default:
			return "Your decisions have been logged.";
	}
}

function formatConsequence(hype: number, heat: number, fine: number): string {
	const parts: string[] = [];
	if (hype !== 0) parts.push(`${hype > 0 ? "+" : ""}${hype} hype`);
	if (heat !== 0) parts.push(`${heat > 0 ? "+" : ""}${heat} heat`);
	if (fine > 0) parts.push(`$${(fine / 1000000).toFixed(1)}M fine`);
	return parts.join(" • ") || "No change";
}

export const DebriefPage2AuditTrail: React.FC<DebriefPage2AuditTrailProps> = ({
	state,
	onNext,
}) => {
	const { personality, role, history } = state;
	const cards = role ? ROLE_CARDS[role] : [];

	const personalityComment = personality
		? getPersonalityComment(personality)
		: "";
	const personalityData = personality ? PERSONALITIES[personality] : null;

	return (
		<LayoutShell className="p-4 pb-12 md:p-6 md:pb-16 text-center bg-slate-950">
			<div className="w-full max-w-2xl">
				{/* Header */}
				<div className="mb-6 md:mb-8">
					<h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter">
						Incident Audit Log
					</h1>
					<p className="text-slate-400 text-base md:text-lg">
						A complete record of your governance decisions
					</p>
				</div>

				{/* Audit Log List */}
				<div className="mb-6 md:mb-8">
					{history.length === 0 ? (
						<div className="p-8 rounded-xl border border-slate-800 bg-slate-900/30 text-slate-500">
							No decisions recorded
						</div>
					) : (
						<div className="space-y-3">
							{history.map((entry, index) => {
								const card = cards.find((c) => c.id === entry.cardId);
								if (!card) return null;

								const outcome =
									entry.choice === "RIGHT" ? card.onRight : card.onLeft;
								const cardPreview = card.text.slice(0, 40);

								return (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: Audit log is chronological and stable
										key={`audit-entry-${index}`}
										className="p-4 rounded-lg border border-slate-800 bg-slate-900/50 text-left"
									>
										<div className="flex items-start justify-between gap-4 mb-2">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<span className="text-xs font-mono text-slate-500">
														#{index + 1}
													</span>
													<span className="text-sm font-medium text-slate-300 truncate">
														{card.sender}
													</span>
													<span className="text-xs text-slate-500">
														({card.source})
													</span>
												</div>
												<p className="text-sm text-slate-400 truncate">
													"{cardPreview}
													{card.text.length > 40 ? "..." : ""}"
												</p>
											</div>
											<div
												className={`px-3 py-1 rounded text-xs font-bold ${
													entry.choice === "RIGHT"
														? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
														: "bg-rose-500/20 text-rose-400 border border-rose-500/30"
												}`}
											>
												{entry.choice}
											</div>
										</div>
										<div className="flex items-center gap-2 text-xs text-slate-500">
											<span className="font-medium">Consequence:</span>
											<span>
												{formatConsequence(
													outcome.hype,
													outcome.heat,
													outcome.fine,
												)}
											</span>
										</div>
										{outcome.violation && (
											<div className="mt-2 text-xs text-red-400/80">
												Violation: {outcome.violation}
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}
				</div>

				{/* Personality Sign-off */}
				{personalityData && (
					<div className="mb-6 md:mb-8 p-6 rounded-xl border border-cyan-900/30 bg-cyan-950/10">
						<div className="flex items-center gap-3 mb-3">
							<div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
								<i className="fa-solid fa-robot text-cyan-400"></i>
							</div>
							<div className="text-left">
								<div className="font-bold text-white">
									{personalityData.name}
								</div>
								<div className="text-xs text-slate-400">
									{personalityData.title}
								</div>
							</div>
						</div>
						<p className="text-left text-slate-300 italic">
							"{personalityComment}"
						</p>
					</div>
				)}

				{/* Reflection Prompt */}
				<div className="mb-6 md:mb-8 p-6 rounded-xl border border-slate-700 bg-slate-900/40">
					<h3 className="text-lg font-bold text-slate-200 mb-3">
						<i className="fa-solid fa-lightbulb text-yellow-500 mr-2"></i>
						What would you do differently?
					</h3>
					<p className="text-slate-400 text-sm mb-4 leading-relaxed">
						Every choice you made shaped this outcome. As you look back at your
						decisions, consider the paths not taken. The Kobayashi Maru awaits
						your next attempt.
					</p>

					{/* Per-choice hints for safe decisions */}
					{history.length > 0 && (
						<div className="space-y-2">
							<div className="text-xs text-slate-500 uppercase tracking-wide mb-2">
								Alternate paths to explore
							</div>
							{history.map((entry, index) => {
								const card = cards.find((c) => c.id === entry.cardId);
								if (!card) return null;

								// Hint only appears for LEFT choices (safer option)
								// suggesting they try the RIGHT (riskier) option
								if (entry.choice === "LEFT") {
									return (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: Stable chronological list
											key={`hint-${index}`}
											className="text-xs text-slate-500 italic pl-3 border-l-2 border-slate-700"
										>
											Decision {index + 1}: Curious what happens if you'd
											<span className="text-cyan-400">
												{" "}
												{card.onRight.label.toLowerCase()}
											</span>
											instead? Reboot and try the riskier path.
										</div>
									);
								}
								return null;
							})}
						</div>
					)}
				</div>

				{/* Generate Psych Evaluation Button */}
				<button
					type="button"
					onClick={onNext}
					className="px-6 py-3 md:px-12 md:py-4 text-base md:text-xl font-bold tracking-wide bg-white text-black hover:bg-cyan-400 hover:text-black transition-all duration-300 min-h-[40px] md:min-h-[48px]"
				>
					Generate Psych Evaluation
				</button>
			</div>
		</LayoutShell>
	);
};
