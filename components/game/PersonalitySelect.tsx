import type React from "react";
import { PERSONALITIES } from "../../data";
import { PersonalityType } from "../../types";
import LayoutShell from "../LayoutShell";
import {
	LAYOUT_SHELL_CLASS,
	SELECT_CARD_BASE,
	SELECT_CARD_HOVER,
	STAGE_CONTAINER_CLASS,
	STAGE_GRID_CLASS,
	STAGE_HEADER_CLASS,
} from "./selectionStageStyles";

interface PersonalitySelectProps {
	isReady: boolean;
	hoverEnabled: boolean;
	onSelect: (personality: PersonalityType) => void;
}

function getPersonalityIcon(type: PersonalityType): string {
	switch (type) {
		case PersonalityType.ROASTER:
			return "fa-user-ninja";
		case PersonalityType.ZEN_MASTER:
			return "fa-leaf";
		case PersonalityType.LOVEBOMBER:
			return "fa-rocket";
		default:
			return "fa-user";
	}
}

export const PersonalitySelect: React.FC<PersonalitySelectProps> = ({
	isReady,
	hoverEnabled,
	onSelect,
}) => {
	return (
		<LayoutShell className={LAYOUT_SHELL_CLASS}>
			<div className={STAGE_CONTAINER_CLASS}>
				<div className={STAGE_HEADER_CLASS}>
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

				<div className={STAGE_GRID_CLASS}>
					{Object.entries(PERSONALITIES).map(([type, p], index) => (
						<button
							key={type}
							type="button"
							onClick={() => isReady && onSelect(type as PersonalityType)}
							data-testid={`personality-${type.toLowerCase()}`}
							className={`${SELECT_CARD_BASE} text-left ${hoverEnabled ? SELECT_CARD_HOVER : ""}`}
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
										className={`fa-solid ${getPersonalityIcon(type as PersonalityType)} text-2xl md:text-4xl`}
										aria-hidden
									></i>
								</div>
								<div className="text-xl md:text-2xl font-black">{p.name}</div>
								<div className="text-cyan-400 text-xs font-black tracking-wide">
									{p.title}
								</div>
							</div>
							<p className="text-slate-400 text-xs md:text-sm leading-relaxed w-full text-center">
								{p.description}
							</p>
						</button>
					))}
				</div>
			</div>
		</LayoutShell>
	);
};
