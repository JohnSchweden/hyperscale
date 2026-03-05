import type React from "react";
import type { RefObject } from "react";
import { ROLE_CARDS } from "../../data";
import { AppSource, type RoleType } from "../../types";

interface CardStackProps {
	role: RoleType;
	currentCardIndex: number;
	isFirstCard: boolean;
	cardRef: RefObject<HTMLDivElement>;
	// Swipe state
	offset: number;
	direction: "LEFT" | "RIGHT" | null;
	isDragging: boolean;
	hasDragged: boolean;
	exitDirection: "LEFT" | "RIGHT" | null;
	exitPosition: { x: number; rotate: number } | null;
	isSnappingBack: boolean;
	// Event handlers
	onTouchStart: (e: React.TouchEvent | React.MouseEvent) => void;
	onTouchMove: (e: React.TouchEvent | React.MouseEvent) => void;
	onTouchEnd: () => void;
	// Actions
	onSwipeLeft: () => void;
	onSwipeRight: () => void;
	// Thresholds
	swipeThreshold: number;
	swipePreviewThreshold: number;
}

export const CardStack: React.FC<CardStackProps> = ({
	role,
	currentCardIndex,
	isFirstCard,
	cardRef,
	offset,
	direction,
	isDragging,
	hasDragged,
	exitDirection,
	exitPosition,
	isSnappingBack,
	onTouchStart,
	onTouchMove,
	onTouchEnd,
	onSwipeLeft,
	onSwipeRight,
	swipeThreshold,
	swipePreviewThreshold,
}) => {
	const cards = ROLE_CARDS[role];
	const currentCard = cards[currentCardIndex];
	const nextCard = cards[currentCardIndex + 1];

	if (!currentCard) return null;

	return (
		<div
			className="relative flex-shrink-0 w-full max-w-full lg:max-w-[43rem] h-[420px] md:h-[560px]"
			data-testid="incident-card-container"
		>
			{/* Next card (behind) */}
			{nextCard && (
				<div
					className="absolute inset-0 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col"
					style={{
						zIndex: 0,
						transform: "scale(0.95)",
						opacity: 0.6,
					}}
				>
					<div className="bg-slate-800 px-3 md:px-4 py-2 flex items-center justify-between border-b border-white/5">
						<div className="flex items-center gap-2 text-[10px] mono font-bold text-slate-400 truncate">
							<i
								className={`fa-solid ${nextCard.source === AppSource.IDE ? "fa-terminal" : "fa-hashtag"}`}
								aria-hidden
							></i>
							<span className="truncate">
								{nextCard.source}
								{" // "}
								{nextCard.context}
							</span>
						</div>
						<div className="flex gap-1.5 shrink-0">
							<div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
							<div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
							<div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
						</div>
					</div>
					<div className="p-4 md:p-6 flex flex-col justify-between flex-1 overflow-hidden">
						<div className="space-y-3 overflow-y-auto">
							<div className="flex items-center gap-3">
								<div className="w-7 h-7 md:w-8 md:h-8 rounded bg-slate-800 flex items-center justify-center border border-white/5 shrink-0">
									<i
										className="fa-solid fa-user-robot text-slate-500 text-xs"
										aria-hidden
									></i>
								</div>
								<div className="min-w-0">
									<div className="text-xs font-bold text-slate-400 truncate">
										{nextCard.sender}
									</div>
									<div className="text-[9px] text-slate-600 mono truncate">
										Incident #{(currentCardIndex + 2) * 324}
									</div>
								</div>
							</div>
							{nextCard.storyContext && (
								<p className="text-xs text-slate-500 line-clamp-2">
									{nextCard.storyContext}
								</p>
							)}
							<p className="text-sm md:text-base font-medium leading-relaxed text-slate-400 line-clamp-3">
								{nextCard.text}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Current card (front) - role="group" for a11y on interactive div */}
			{/* biome-ignore lint/a11y/useSemanticElements: swipe card container is not a form fieldset */}
			<div
				ref={cardRef}
				role="group"
				data-testid="incident-card"
				className={`absolute inset-0 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col select-none swipe-card ${isFirstCard && !exitDirection && !isDragging && !hasDragged ? "ticket-transition" : ""} ${isSnappingBack ? "spring-snap-back" : ""}`}
				key={currentCardIndex}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
				onMouseDown={onTouchStart}
				onMouseMove={onTouchMove}
				onMouseUp={onTouchEnd}
				onMouseLeave={onTouchEnd}
				style={{
					zIndex: 10,
					transform:
						exitDirection && exitPosition
							? `translateX(${exitPosition.x}px) rotate(${exitPosition.rotate}deg)`
							: `translateX(${offset}px) rotate(${offset * 0.05}deg)`,
					transition: isDragging
						? "none"
						: exitDirection
							? "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
							: "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
					cursor: isDragging ? "grabbing" : "grab",
					opacity: exitDirection ? 0 : 1,
				}}
			>
				{/* Dynamic Swipe Preview */}
				{direction && (
					<div
						className="absolute inset-0 pointer-events-none z-10"
						style={{
							opacity: Math.min(
								1,
								0.3 +
									((Math.abs(offset) - swipePreviewThreshold) /
										swipeThreshold) *
										0.7,
							),
						}}
					>
						<div
							className={`absolute top-1/2 -translate-y-1/2 ${direction === "RIGHT" ? "left-8" : "right-8"} font-black tracking-tighter ${direction === "RIGHT" ? "text-green-500" : "text-red-500"}`}
							style={{
								fontSize:
									direction === "RIGHT"
										? `clamp(1.5rem, ${2 + ((Math.abs(offset) - swipePreviewThreshold) / swipeThreshold) * 2}rem, 3.75rem)`
										: `clamp(1.5rem, ${2 + ((Math.abs(offset) - swipePreviewThreshold) / swipeThreshold) * 2}rem, 3.75rem)`,
								transform: `scale(${0.5 + Math.min(0.5, ((Math.abs(offset) - swipePreviewThreshold) / swipeThreshold) * 0.5)})`,
							}}
						>
							{direction === "RIGHT"
								? currentCard.onRight.label.toUpperCase()
								: currentCard.onLeft.label.toUpperCase()}
						</div>
					</div>
				)}

				<div className="bg-slate-800 px-3 md:px-4 py-2 flex items-center justify-between border-b border-white/5">
					<div className="flex items-center gap-2 text-[10px] mono font-bold text-slate-400 truncate">
						<i
							className={`fa-solid ${currentCard.source === AppSource.IDE ? "fa-terminal" : "fa-hashtag"}`}
							aria-hidden
						></i>
						<span className="truncate">
							{currentCard.source}
							{" // "}
							{currentCard.context}
						</span>
					</div>
					<div className="flex gap-1.5 shrink-0">
						<div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
						<div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
						<div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
					</div>
				</div>
				<div className="p-4 md:p-10 flex flex-col justify-between flex-1 overflow-hidden">
					<div className="space-y-3 md:space-y-6 overflow-y-auto">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 md:w-10 md:h-10 rounded bg-slate-800 flex items-center justify-center border border-white/5 shrink-0">
								<i
									className="fa-solid fa-user-robot text-slate-400 text-xs md:text-base"
									aria-hidden
								></i>
							</div>
							<div className="min-w-0">
								<div className="text-xs md:text-sm font-bold text-cyan-400 truncate">
									{currentCard.sender}
								</div>
								<div className="text-[9px] md:text-[10px] text-slate-400 mono truncate">
									Incident #{(currentCardIndex + 1) * 324}
								</div>
							</div>
						</div>
						{currentCard.storyContext && (
							<p className="text-sm md:text-base text-slate-400 leading-relaxed">
								{currentCard.storyContext}
							</p>
						)}
						<p className="text-base md:text-xl font-medium leading-relaxed text-slate-200">
							{currentCard.text}
						</p>
					</div>
					<div className="flex flex-col gap-3 mt-6 md:mt-8 shrink-0">
						{/* Keyboard hint */}
						<div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 mono">
							<span className="hidden md:inline px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded">
								←
							</span>
							<span className="hidden md:inline">Swipe or use arrow keys</span>
							<span className="hidden md:inline px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded">
								→
							</span>

							<span className="flex md:hidden items-center justify-center gap-3">
								<span className="text-red-500 font-bold">← Swipe left</span>
								<span className="text-slate-600">or</span>
								<span className="text-green-500 font-bold">Swipe right →</span>
							</span>
						</div>

						<div className="flex flex-row gap-3 md:gap-4">
							<button
								type="button"
								onClick={onSwipeLeft}
								data-testid="swipe-left-button"
								className={`flex-1 py-2 px-3 md:py-4 md:px-4 text-sm md:text-base border font-bold tracking-wide transition-all min-h-[40px] md:min-h-[48px] ${direction === "LEFT" ? "bg-cyan-500 border-cyan-500 text-black" : "border-white text-white bg-transparent hover:bg-cyan-500 hover:border-cyan-500 hover:text-black active:bg-cyan-500 active:border-cyan-500 active:text-black"}`}
							>
								{currentCard.onLeft.label}
							</button>
							<button
								type="button"
								onClick={onSwipeRight}
								data-testid="swipe-right-button"
								className={`flex-1 py-2 px-3 md:py-4 md:px-4 text-sm md:text-base border font-black tracking-wide transition-all min-h-[40px] md:min-h-[48px] ${direction === "RIGHT" ? "bg-cyan-500 border-cyan-500 text-black" : "border-white text-white bg-transparent hover:bg-cyan-500 hover:border-cyan-500 hover:text-black active:bg-cyan-500 active:border-cyan-500 active:text-black"}`}
							>
								{currentCard.onRight.label}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
