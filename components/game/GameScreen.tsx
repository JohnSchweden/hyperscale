import type React from "react";
import type { GameState } from "../../types";
import LayoutShell from "../LayoutShell";
import { CardStack } from "./CardStack";
import { GameHUD } from "./GameHUD";
import { RoastTerminal } from "./RoastTerminal";
import { Taskbar } from "./Taskbar";

interface GameScreenProps {
	state: GameState;
	isFirstCard: boolean;
	cardRef: React.RefObject<HTMLDivElement>;
	// Swipe state
	swipeOffset: number;
	swipeDirection: "LEFT" | "RIGHT" | null;
	isDragging: boolean;
	hasDragged: boolean;
	cardExitDirection: "LEFT" | "RIGHT" | null;
	exitPosition: { x: number; rotate: number } | null;
	isSnappingBack: boolean;
	// Swipe handlers
	onTouchStart: (e: React.TouchEvent | React.MouseEvent) => void;
	onTouchMove: (e: React.TouchEvent | React.MouseEvent) => void;
	onTouchEnd: () => void;
	onSwipeLeft: () => void;
	onSwipeRight: () => void;
	// Roast
	roastInput: string;
	roastOutput: string | null;
	isRoasting: boolean;
	roastOutputRef: React.RefObject<HTMLDivElement>;
	onRoastInputChange: (value: string) => void;
	onRoastSubmit: () => void;
	// Taskbar
	currentTime: string;
	// Config
	swipeThreshold: number;
	swipePreviewThreshold: number;
	// Pressure / countdown (Phase 04 — 04-02 will render timer UI)
	countdownValue?: number;
	isCountdownActive?: boolean;
	isCritical?: boolean;
}

export const GameScreen: React.FC<GameScreenProps> = ({
	state,
	isFirstCard,
	cardRef,
	swipeOffset,
	swipeDirection,
	isDragging,
	hasDragged,
	cardExitDirection,
	exitPosition,
	isSnappingBack,
	onTouchStart,
	onTouchMove,
	onTouchEnd,
	onSwipeLeft,
	onSwipeRight,
	roastInput,
	roastOutput,
	isRoasting,
	roastOutputRef,
	onRoastInputChange,
	onRoastSubmit,
	currentTime,
	swipeThreshold,
	swipePreviewThreshold,
	countdownValue = 0,
	isCountdownActive = false,
	isCritical = false,
}) => {
	if (!state.role || !state.personality) return null;

	// Expose countdown for Phase 04-02 (timer UI)
	const pressureAttrs =
		isCountdownActive && countdownValue > 0
			? { "data-pressure-countdown": String(countdownValue) }
			: {};

	const showCountdown = isCountdownActive && countdownValue > 0;

	return (
		<LayoutShell className="bg-[#0a0a0c]">
			<GameHUD
				budget={state.budget}
				heat={state.heat}
				hype={state.hype}
				countdownValue={showCountdown ? countdownValue : undefined}
			/>
			{showCountdown && (
				<div
					className="absolute top-14 md:top-[4.25rem] left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/60 text-red-200 text-sm font-bold mono animate-pulse"
					data-testid="urgent-countdown"
					role="timer"
					aria-live="polite"
					aria-label={`Urgent decision: ${countdownValue} seconds remaining`}
				>
					<i className="fa-solid fa-clock text-red-400" aria-hidden />
					<span>{countdownValue}s</span>
					<span className="text-red-300/90 text-xs font-medium hidden sm:inline">
						— Decide now or the choice is made for you
					</span>
				</div>
			)}

			{/* Main Content */}
			<div
				className="absolute top-[80px] md:top-[56px] bottom-12 left-0 right-0 overflow-y-auto"
				{...pressureAttrs}
			>
				<div className="flex flex-col items-center p-3 md:p-6 pb-8 md:pb-12 gap-4 md:gap-6 min-h-full">
					{/* Card Stack */}
					<CardStack
						role={state.role}
						cards={state.effectiveDeck ?? []}
						currentCardIndex={state.currentCardIndex}
						isFirstCard={isFirstCard}
						cardRef={cardRef}
						offset={swipeOffset}
						direction={swipeDirection}
						isDragging={isDragging}
						exitDirection={cardExitDirection}
						exitPosition={exitPosition}
						isSnappingBack={isSnappingBack}
						hasDragged={hasDragged}
						onTouchStart={onTouchStart}
						onTouchMove={onTouchMove}
						onTouchEnd={onTouchEnd}
						onSwipeLeft={onSwipeLeft}
						onSwipeRight={onSwipeRight}
						swipeThreshold={swipeThreshold}
						swipePreviewThreshold={swipePreviewThreshold}
						isUrgent={isCountdownActive}
						isCritical={isCritical}
					/>

					{/* Roast Terminal */}
					<RoastTerminal
						personality={state.personality}
						input={roastInput}
						output={roastOutput}
						isLoading={isRoasting}
						outputRef={roastOutputRef}
						onInputChange={onRoastInputChange}
						onSubmit={onRoastSubmit}
					/>
				</div>
			</div>

			{/* Taskbar */}
			<Taskbar personality={state.personality} currentTime={currentTime} />
		</LayoutShell>
	);
};
