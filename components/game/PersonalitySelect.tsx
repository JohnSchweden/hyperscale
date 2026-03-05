import type React from "react";
import { PERSONALITIES } from "../../data";
import { PersonalityType } from "../../types";
import LayoutShell from "../LayoutShell";

interface PersonalitySelectProps {
	isReady: boolean;
	hoverEnabled: boolean;
	onSelect: (personality: PersonalityType) => void;
}

export const PersonalitySelect: React.FC<PersonalitySelectProps> = ({
	isReady,
	hoverEnabled,
	onSelect,
}) => {
	return (
		<LayoutShell className="p-4 md:p-6 bg-[#0a0a0c]">
			<div className="w-full max-w-5xl mx-auto">
				<div className="text-center mb-6 md:mb-10">
					<div className="text-red-600 mb-3 mono text-[10px] md:text-xs tracking-[0.3em]">
						step_01
						{" // "}
						chaos_handler
					</div>
					<h2 className="text-3xl md:text-5xl font-black tracking-tight fade-in px-4">
						Select your emotional support
					</h2>
					<p className="mt-4 md:mt-6 max-w-xl mx-auto text-slate-400 text-sm md:text-base leading-relaxed px-4">
						Pick the unhinged co-pilot that will narrate your simulation spiral,
						hype your bad ideas, and occasionally try to keep you out of prison.
						Or not.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full px-4">
					{Object.entries(PERSONALITIES).map(([type, p], index) => (
						<button
							key={type}
							type="button"
							onClick={() => isReady && onSelect(type as PersonalityType)}
							data-testid={`personality-${type.toLowerCase()}`}
							className={`group p-6 md:p-10 bg-slate-900/60 border border-slate-800 focus:outline-none flex flex-col shadow-2xl transition-colors w-full text-left ${hoverEnabled ? "hover:border-cyan-500 hover-scale" : ""}`}
							style={{
								animationDelay: `${index * 0.1}s`,
								pointerEvents: isReady ? "auto" : "none",
							}}
						>
							<div className="flex flex-col items-center text-center mb-4 md:mb-6">
								<div
									className={`text-slate-400 transition-colors mb-2 md:mb-3 ${hoverEnabled ? "group-hover:text-cyan-500" : ""}`}
								>
									<i
										className={`fa-solid ${
											type === PersonalityType.ROASTER
												? "fa-user-ninja"
												: type === PersonalityType.ZEN_MASTER
													? "fa-leaf"
													: "fa-rocket"
										} text-2xl md:text-4xl`}
										aria-hidden
									></i>
								</div>
								<div className="text-xl md:text-2xl font-black">{p.name}</div>
								<div className="text-cyan-400 text-xs font-black tracking-wide">
									{p.title}
								</div>
							</div>
							<p className="text-slate-400 text-xs md:text-sm leading-relaxed w-full mt-auto text-center">
								{p.description}
							</p>
						</button>
					))}
				</div>
			</div>
		</LayoutShell>
	);
};
