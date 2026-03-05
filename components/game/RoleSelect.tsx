import type React from "react";
import { ROLE_DESCRIPTIONS } from "../../data";
import { RoleType } from "../../types";
import LayoutShell from "../LayoutShell";

interface RoleSelectProps {
	isReady: boolean;
	hoverEnabled: boolean;
	onSelect: (role: RoleType) => void;
}

function formatLabel(s: string): string {
	return s === RoleType.HR
		? "HR"
		: s
				.replace(/_/g, " ")
				.toLowerCase()
				.replace(/\b\w/g, (c) => c.toUpperCase());
}

export const RoleSelect: React.FC<RoleSelectProps> = ({
	isReady,
	hoverEnabled,
	onSelect,
}) => {
	return (
		<LayoutShell className="p-4 md:p-6 bg-[#0a0a0c]">
			<div className="w-full max-w-4xl mx-auto">
				<div className="text-center mb-6 md:mb-10">
					<div className="text-red-600 mb-2 md:mb-3 mono text-[10px] md:text-xs tracking-[0.3em] fade-in px-4">
						step_02
						{" // "}
						damage_control
					</div>
					<h2 className="text-3xl md:text-5xl font-black mb-3 md:mb-4 tracking-tight fade-in px-4">
						Select your clearance level
					</h2>
					<p className="max-w-2xl mx-auto text-slate-400 text-sm md:text-base leading-relaxed px-4">
						Choose which part of the company you want to endanger first. Each
						role changes the kinds of incidents, heat you attract, and creative
						ways to lose that $10M budget.
					</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full px-4">
					{Object.values(RoleType).map((role, index) => (
						<button
							key={role}
							type="button"
							onClick={() => isReady && onSelect(role)}
							data-testid={`role-${role.toLowerCase()}`}
							className={`group p-6 md:p-8 bg-slate-900/60 border border-slate-800 transition-all text-center shadow-2xl ${hoverEnabled ? "hover:border-cyan-500 hover-scale" : ""}`}
							style={{
								animationDelay: `${index * 0.08}s`,
								pointerEvents: isReady ? "auto" : "none",
							}}
						>
							<div
								className={`text-3xl md:text-4xl mb-3 md:mb-4 text-slate-400 transition-colors ${hoverEnabled ? "group-hover:text-cyan-400" : ""}`}
							>
								<i
									className={`fa-solid ${
										role === RoleType.DEVELOPMENT
											? "fa-code"
											: role === RoleType.MARKETING
												? "fa-bullhorn"
												: role === RoleType.MANAGEMENT
													? "fa-briefcase"
													: role === RoleType.HR
														? "fa-users"
														: role === RoleType.FINANCE
															? "fa-vault"
															: "fa-broom"
									}`}
									aria-hidden
								></i>
							</div>
							<div
								className={`font-black text-xs md:text-sm tracking-wide text-slate-300 transition-colors ${hoverEnabled ? "group-hover:text-white" : ""}`}
							>
								{formatLabel(role)}
							</div>
							<p className="text-slate-400 text-xs md:text-sm leading-relaxed mt-2 md:mt-3">
								{ROLE_DESCRIPTIONS[role]}
							</p>
						</button>
					))}
				</div>
			</div>
		</LayoutShell>
	);
};
