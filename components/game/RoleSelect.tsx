import type React from "react";
import { ROLE_DESCRIPTIONS, ROLE_ICONS, ROLE_LABELS } from "../../data";
import { ROLE_FINE_TIERS, RoleType } from "../../types";

function formatBudget(amount: number): string {
	if (amount >= 1000000) {
		return `$${(amount / 1000000).toFixed(0)}M`;
	}
	return `$${amount.toLocaleString()}`;
}

import LayoutShell from "../LayoutShell";
import {
	LAYOUT_SHELL_CLASS,
	SELECT_CARD_BASE,
	SELECT_CARD_HOVER,
	STAGE_CONTAINER_CLASS,
	STAGE_GRID_CLASS,
	STAGE_HEADER_CLASS,
} from "./selectionStageStyles";

interface RoleSelectProps {
	isReady: boolean;
	hoverEnabled: boolean;
	onSelect: (role: RoleType) => void;
}

export const RoleSelect: React.FC<RoleSelectProps> = ({
	isReady,
	hoverEnabled,
	onSelect,
}) => {
	return (
		<LayoutShell className={LAYOUT_SHELL_CLASS}>
			<div className={STAGE_CONTAINER_CLASS}>
				<div className={STAGE_HEADER_CLASS}>
					<div className="text-red-600 mb-2 md:mb-3 mono text-[10px] md:text-xs tracking-[0.3em] fade-in px-4">
						step_02
						{" // "}
						damage_control
					</div>
					<h2 className="text-3xl md:text-5xl font-black mb-3 md:mb-4 tracking-tight fade-in px-4">
						Select your impact zone
					</h2>
					<p className="max-w-2xl mx-auto text-slate-400 text-sm md:text-base leading-relaxed px-4">
						Choose the specific silo you want to set on fire first. Each role
						changes the cascading failures, the legal heat you attract, and the
						creative ways to lose your budget.
					</p>
				</div>

				<div className={STAGE_GRID_CLASS}>
					{Object.values(RoleType).map((role, index) => (
						<button
							key={role}
							type="button"
							onClick={() => isReady && onSelect(role)}
							data-testid={`role-${role.toLowerCase()}`}
							className={`${SELECT_CARD_BASE} text-center ${hoverEnabled ? SELECT_CARD_HOVER : ""}`}
							style={{
								animationDelay: `${index * 0.08}s`,
								pointerEvents: isReady ? "auto" : "none",
							}}
						>
							<div
								className={`text-3xl md:text-4xl mb-3 md:mb-4 text-slate-400 transition-colors ${hoverEnabled ? "group-hover:text-cyan-400" : ""}`}
							>
								<i className={`fa-solid ${ROLE_ICONS[role]}`} aria-hidden></i>
							</div>
							<div
								className={`font-black text-xs md:text-sm tracking-wide text-slate-300 transition-colors ${hoverEnabled ? "group-hover:text-white" : ""}`}
							>
								{ROLE_LABELS[role]}
							</div>
							<p className="text-slate-400 text-xs md:text-sm leading-relaxed mt-2 md:mt-3">
								{ROLE_DESCRIPTIONS[role]}
							</p>
							<div className="text-cyan-400 text-xs md:text-sm font-semibold mt-2 md:mt-3 flex items-center justify-center gap-1.5">
								<i className="fa-solid fa-wallet" aria-hidden></i>
								<span>
									Your budget: {formatBudget(ROLE_FINE_TIERS[role].budget)}
								</span>
							</div>
						</button>
					))}
				</div>
			</div>
		</LayoutShell>
	);
};
