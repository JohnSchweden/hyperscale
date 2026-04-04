import type React from "react";
import { SOURCE_ICONS } from "../../data/sources";
import type { Card } from "../../types";

const incidentCardHeaderBar = "bg-slate-800 border-b border-white/5";

interface CardHeaderBarProps {
	source: string;
	context: string;
}

export function CardHeaderBar({
	source,
	context,
}: CardHeaderBarProps): React.ReactElement {
	return (
		<div
			className={`px-3 md:px-4 py-2 flex items-center justify-between ${incidentCardHeaderBar}`}
		>
			<div className="flex items-center gap-2 text-[10px] mono font-bold text-slate-400 truncate">
				<i
					className={`fa-solid ${SOURCE_ICONS[source] ?? "fa-hashtag"}`}
					aria-hidden
				></i>
				<span className="truncate">
					{source}
					{" // "}
					{context}
				</span>
			</div>
			<div className="flex gap-1.5 shrink-0">
				<div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
				<div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
				<div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
			</div>
		</div>
	);
}

interface CardBodyProps {
	card: Card;
	incidentNumber: number;
	variant: "preview" | "full";
	onSwipeLeft?: () => void;
	onSwipeRight?: () => void;
	leftLabel?: string;
	rightLabel?: string;
	currentDirection?: "LEFT" | "RIGHT" | null;
	isUrgent?: boolean;
}

export function CardBody({
	card,
	incidentNumber,
	variant,
	onSwipeLeft,
	onSwipeRight,
	leftLabel,
	rightLabel,
	currentDirection,
	isUrgent,
}: CardBodyProps): React.ReactElement {
	const swipeButtonBase =
		"flex-1 py-2 px-2.5 md:py-3 md:px-3 text-base border-[0.5px] border-solid tracking-wide transition-all min-h-[40px] md:min-h-[48px]";
	const swipeButtonDefault =
		"border-white/35 text-slate-300 bg-transparent hover:bg-cyan-500 hover:border-cyan-500 hover:text-black active:bg-cyan-500 active:border-cyan-500 active:text-black";
	const swipeButtonSelected =
		"border-[0.5px] border-solid bg-cyan-500 border-cyan-500 font-bold text-black";

	const senderTextClass =
		variant === "preview" ? "text-slate-400" : "text-cyan-400";

	if (variant === "preview") {
		return (
			<div className="p-4 md:p-6 flex flex-col justify-between flex-1 overflow-hidden">
				<div className="space-y-3 overflow-y-auto">
					<div className="flex items-center gap-3">
						<div className="w-7 h-7 md:w-8 md:h-8 rounded bg-white/5 flex items-center justify-center border border-white/10 shrink-0 backdrop-blur-sm">
							<i
								className="fa-solid fa-robot text-slate-500 text-xs"
								aria-hidden
							></i>
						</div>
						<div className="min-w-0">
							<div className="text-xs font-bold text-slate-400 truncate">
								{card.sender}
							</div>
							<div className="text-[9px] text-slate-600 mono truncate">
								Incident #{incidentNumber}
							</div>
						</div>
					</div>
					{card.storyContext && (
						<p className="text-xs text-slate-500 line-clamp-2">
							{card.storyContext}
						</p>
					)}
					<p className="text-sm md:text-base font-medium leading-relaxed text-slate-400 line-clamp-3">
						{card.text}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="p-4 md:p-6 flex flex-col justify-between flex-1 overflow-hidden">
			<div
				className={`space-y-3 md:space-y-6 overflow-y-auto ${isUrgent ? "pressure-shake-counter" : ""}`}
			>
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 md:w-10 md:h-10 rounded bg-white/5 flex items-center justify-center border border-white/10 shrink-0 backdrop-blur-sm">
						<i
							className="fa-solid fa-robot text-slate-400 text-xs md:text-base"
							aria-hidden
						></i>
					</div>
					<div className="min-w-0">
						<div
							className={`text-xs md:text-sm font-bold truncate ${senderTextClass}`}
						>
							{card.sender}
						</div>
						<div className="text-[9px] md:text-[10px] text-slate-400 mono truncate">
							Incident #{incidentNumber}
						</div>
					</div>
				</div>
				{card.storyContext && (
					<p className="text-sm md:text-base text-slate-400 leading-relaxed">
						{card.storyContext}
					</p>
				)}
				<p className="text-base md:text-xl font-medium leading-relaxed text-slate-200">
					{card.text}
				</p>
			</div>
			{onSwipeLeft && onSwipeRight && leftLabel && rightLabel && (
				<div className="flex flex-col gap-2 md:gap-3 mt-4 md:mt-8 shrink-0">
					<div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 mono">
						<span className="hidden md:inline px-1.5 py-0.5 rounded bg-white/5 border border-white/10 backdrop-blur-sm">
							←
						</span>
						<span className="hidden md:inline">Swipe or use arrow keys</span>
						<span className="hidden md:inline px-1.5 py-0.5 rounded bg-white/5 border border-white/10 backdrop-blur-sm">
							→
						</span>

						<span className="flex md:hidden items-center justify-center gap-3">
							<span className="text-slate-300 font-bold">← Swipe left</span>
							<span className="text-slate-600">or</span>
							<span className="text-slate-300 font-bold">Swipe right →</span>
						</span>
					</div>

					<div className="flex flex-row gap-3 md:gap-4">
						<button
							type="button"
							onClick={onSwipeLeft}
							data-testid="swipe-left-button"
							className={`${swipeButtonBase} ${currentDirection === "LEFT" ? swipeButtonSelected : `font-semibold ${swipeButtonDefault}`}`}
						>
							{leftLabel}
						</button>
						<button
							type="button"
							onClick={onSwipeRight}
							data-testid="swipe-right-button"
							className={`${swipeButtonBase} ${currentDirection === "RIGHT" ? swipeButtonSelected : `font-bold ${swipeButtonDefault}`}`}
						>
							{rightLabel}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
