import type React from "react";
import { PERSONALITIES } from "../../data";
import { PersonalityType } from "../../types";

interface TaskbarProps {
	personality: PersonalityType | null;
	currentTime: string;
}

export const Taskbar: React.FC<TaskbarProps> = ({
	personality,
	currentTime,
}) => {
	const personalityIcon =
		personality === PersonalityType.ROASTER
			? "fa-user-ninja"
			: personality === PersonalityType.ZEN_MASTER
				? "fa-leaf"
				: "fa-rocket";

	const personalityName = personality ? PERSONALITIES[personality].name : "";

	return (
		<div className="h-12 bg-slate-900/95 border-t border-white/5 flex items-center px-3 md:px-6 justify-between fixed bottom-0 w-full backdrop-blur-md safe-area-bottom z-20">
			<div className="flex items-center gap-2 md:gap-6">
				<button
					type="button"
					className="bg-slate-800 hover:bg-slate-700 px-3 md:px-4 py-2 flex items-center gap-2 border border-white/5 transition-colors min-h-[44px]"
				>
					<i className="fa-solid fa-atom text-cyan-400" aria-hidden></i>
					<span className="text-xs font-black tracking-wide hidden sm:inline">
						Start
					</span>
				</button>
				<div className="flex gap-2 md:gap-4">
					<div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
						<i
							className="fa-solid fa-comment-dots text-xs text-cyan-400"
							aria-hidden
						></i>
					</div>
					<div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center border border-white/5 opacity-50 hidden sm:flex">
						<i
							className="fa-solid fa-terminal text-xs text-slate-400"
							aria-hidden
						></i>
					</div>
				</div>
			</div>
			<div className="flex items-center gap-2 md:gap-6">
				<div className="bg-black/50 px-2 md:px-3 py-1.5 rounded border border-white/5 flex items-center gap-2 md:gap-3">
					<div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center">
						<i
							className={`fa-solid ${personalityIcon} text-[10px] text-cyan-500`}
							aria-hidden
						></i>
					</div>
					<span className="text-[10px] mono font-bold text-slate-400 tracking-tighter hidden md:inline">
						{personalityName}
					</span>
				</div>
				<div className="text-right">
					<div className="text-xs mono font-bold text-slate-300">
						{currentTime}
					</div>
					<div className="text-[8px] mono text-slate-400 tracking-wide hidden sm:block">
						v0.92-prod
					</div>
				</div>
			</div>
		</div>
	);
};
