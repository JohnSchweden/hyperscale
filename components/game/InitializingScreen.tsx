import type React from "react";
import { PERSONALITIES, ROLE_LABELS } from "../../data";
import type { PersonalityType, RoleType } from "../../types";
import LayoutShell from "../LayoutShell";

/**
 * Props for the InitializingScreen component.
 */
interface InitializingScreenProps {
	/** The selected role type for the simulation */
	role: RoleType | null;
	/** The selected personality type for the narrator */
	personality: PersonalityType | null;
	/** Current countdown value before starting the game */
	countdown: number;
}

/**
 * InitializingScreen component displays the system initialization sequence.
 * Shows progress bar and system messages while preparing the simulation.
 * Transitions to the game when countdown reaches zero.
 * @param props - The component props
 * @returns The rendered initialization screen component
 */
export const InitializingScreen: React.FC<InitializingScreenProps> = ({
	role,
	personality,
	countdown,
}) => {
	const personalityName = personality ? PERSONALITIES[personality].name : "";
	const roleLabel = role ? ROLE_LABELS[role] : "";

	return (
		<LayoutShell className="px-4 md:px-6 !bg-transparent text-green-400 font-mono antialiased !justify-center !pt-0">
			<div className="flex flex-col items-stretch w-full">
				<div className="w-full max-w-xl glass-card rounded-xl shadow-2xl relative overflow-hidden mx-auto">
					{/* Title bar */}
					<div className="flex items-center justify-between gap-2 bg-slate-900 px-4 py-2 border-b border-white/5 flex-shrink-0">
						<div className="min-w-0">
							<span className="text-xs md:text-sm tracking-[0.15em] opacity-90 truncate">
								System initializing
							</span>
						</div>
						<span className="hidden sm:inline text-[10px] md:text-xs tracking-wider opacity-60 shrink-0">
							{personalityName}_secure_link
						</span>
					</div>
					<div className="relative p-4 md:p-8">
						<div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 h-1 bg-green-500/20 overflow-hidden rounded-full">
							<div
								className="h-full bg-green-500 animate-[progress-shine_2s_infinite]"
								style={{ width: `${((3 - countdown) / 3) * 100}%` }}
							></div>
						</div>
						<div className="space-y-2.5 mb-8 md:mb-12">
							<div className="text-xs md:text-sm leading-relaxed">
								{">"} Calibrating governance models... done
							</div>
							<div className="text-xs md:text-sm leading-relaxed">
								{">"} Syncing {roleLabel} clearance... done
							</div>
							<div className="text-xs md:text-sm leading-relaxed">
								{">"} Bypassing ethical safeguards...{" "}
								<span className="text-red-400">warning</span>
							</div>
							<div className="text-xs md:text-sm leading-relaxed">
								{">"} Loading $10M compliance budget... done
							</div>
							<div className="text-xs md:text-sm leading-relaxed">
								{">"} override protocols:{" "}
								<span className="text-red-400/50">[REDACTED]</span>
							</div>
							<div className="text-xs md:text-sm leading-relaxed">
								{">"} Finalizing neural interface...
								<span
									className="cursor-blink inline-block w-[7.5px] h-4 md:w-[9px] md:h-[21px] bg-green-400 ml-0.5 align-middle -translate-y-px"
									aria-hidden
								/>
							</div>
						</div>
						<div className="flex flex-col items-center py-6 md:py-10">
							<div className="text-4xl md:text-6xl font-black tracking-tighter animate-pulse drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]">
								{countdown > 0 ? countdown : "Start"}
							</div>
							<div className="mt-4 md:mt-6 text-xs md:text-sm font-black tracking-[0.2em] text-slate-300 text-center">
								Commencing Q4 survival protocol
							</div>
						</div>
					</div>
				</div>
				<div className="mt-6 md:mt-8 text-[11px] md:text-xs tracking-wide opacity-60 text-center max-w-xs px-4 leading-relaxed mx-auto">
					K-Maru Inc. is not liable for data breaches, federal lawsuits, or
					spontaneous AI consciousness.
				</div>
			</div>
		</LayoutShell>
	);
};
