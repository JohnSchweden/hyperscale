import type React from "react";
import { forwardRef } from "react";
import { PERSONALITIES } from "../../data";
import { PersonalityType } from "../../types";
import { useStarfieldSpeedUIBurger } from "./StarfieldBackground";

function personalityIconClass(personality: PersonalityType | null): string {
	switch (personality) {
		case PersonalityType.ROASTER:
			return "fa-user-ninja";
		case PersonalityType.ZEN_MASTER:
			return "fa-leaf";
		case PersonalityType.LOVEBOMBER:
			return "fa-rocket";
		default:
			return "fa-rocket";
	}
}

interface TaskbarProps {
	personality: PersonalityType | null;
	currentTime: string;
}

const TaskbarFlySpeedBurger = forwardRef<
	HTMLButtonElement,
	{ menuOpen: boolean; onClick: () => void }
>(function TaskbarFlySpeedBurger({ menuOpen, onClick }, ref) {
	return (
		<button
			ref={ref}
			type="button"
			onClick={onClick}
			aria-expanded={menuOpen}
			aria-controls="starfield-speed-flyout"
			aria-label={
				menuOpen ? "Close game menu" : "Open game menu (starfield and music)"
			}
			className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-100 transition-colors duration-200 ease-out md:hidden"
		>
			<span
				className={`relative block w-5 transition-[height] duration-200 ease-out ${
					menuOpen ? "h-4" : "h-5"
				}`}
				aria-hidden
			>
				<span
					className={`absolute left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-current transition-all duration-200 ease-out ${
						menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[4px]"
					}`}
				/>
				<span
					className={`absolute left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-current transition-all duration-200 ease-out ${
						menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-[4px]"
					}`}
				/>
			</span>
		</button>
	);
});

/**
 * Taskbar component displays the bottom taskbar with personality info, time, and speed controls.
 * Integrates with starfield speed UI context for mobile burger menu.
 * @param props - The component props
 * @returns The rendered taskbar component
 */
export const Taskbar: React.FC<TaskbarProps> = ({
	personality,
	currentTime,
}) => {
	const speedUI = useStarfieldSpeedUIBurger();

	const personalityIcon = personalityIconClass(personality);
	const personalityName = personality ? PERSONALITIES[personality].name : "";

	return (
		<div className="pointer-events-none fixed bottom-0 left-0 right-0 z-20 pb-[env(safe-area-inset-bottom,0px)]">
			<div className="pointer-events-auto flex h-12 w-full items-center justify-between glass-header px-3 shadow-[0_-8px_32px_rgba(0,0,0,0.35)] md:px-6">
				<div className="flex items-center gap-2 md:gap-6">
					<button
						type="button"
						className="bg-slate-800 hover:bg-slate-700 px-3 md:px-4 py-2 flex items-center gap-2 border border-white/5 transition-colors min-h-[44px]"
					>
						<i className="fa-solid fa-atom text-slate-400" aria-hidden></i>
						<span className="text-xs font-black tracking-wide hidden sm:inline">
							Start
						</span>
					</button>
					<div className="flex gap-2 md:gap-4">
						<div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center border border-white/10">
							<i
								className="fa-solid fa-comment-dots text-xs text-slate-400"
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
					{speedUI?.showTaskbarBurger ? (
						<TaskbarFlySpeedBurger
							ref={speedUI.taskbarBurgerRef}
							menuOpen={speedUI.menuOpen}
							onClick={speedUI.toggleMenu}
						/>
					) : null}
					<div className="px-2 md:px-3 py-1.5 rounded border border-white/5 flex items-center gap-2 md:gap-3">
						<div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center">
							<i
								className={`fa-solid ${personalityIcon} text-[10px] text-slate-400`}
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
		</div>
	);
};
