import type React from "react";
import type { GameState } from "../../types";
import { ROLE_FINE_TIERS } from "../../types";
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
	swipeVerticalOffset?: number;
	swipeDirection: "LEFT" | "RIGHT" | null;
	isDragging: boolean;
	hasDragged: boolean;
	cardExitDirection: "LEFT" | "RIGHT" | null;
	exitPosition: { x: number; rotate: number } | null;
	isSnappingBack: boolean;
	isSwipeUp?: boolean;
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
	swipeVerticalOffset = 0,
	swipeDirection,
	isDragging,
	hasDragged,
	cardExitDirection,
	exitPosition,
	isSnappingBack,
	isSwipeUp = false,
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

	// Get role-appropriate starting budget for progress bar (Phase 03-06)
	const startingBudget = ROLE_FINE_TIERS[state.role]?.budget ?? 10000000;

	const countdownVisible = isCountdownActive && countdownValue > 0;

	const pressureAttrs = countdownVisible
		? { "data-pressure-countdown": String(countdownValue) }
		: {};

	return (
		<LayoutShell className="!bg-transparent">
			<GameHUD
				budget={state.budget}
				heat={state.heat}
				hype={state.hype}
				countdownValue={countdownVisible ? countdownValue : undefined}
				startingBudget={startingBudget}
			/>
			{countdownVisible && (
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

			{/* Main Content — extends under taskbar so content shows through blur; padding clears the bar + safe area */}
			<div
				className="absolute top-[31px] md:top-[56px] bottom-0 left-0 right-0 overflow-y-auto overflow-x-hidden"
				{...pressureAttrs}
			>
				<div className="flex min-h-full flex-col items-center gap-4 p-3 pb-[calc(3rem+env(safe-area-inset-bottom,0px)+2rem)] md:gap-6 md:p-6 md:pb-[calc(3rem+env(safe-area-inset-bottom,0px)+3rem)]">
					{/* Card Stack */}
					<CardStack
						role={state.role}
						cards={state.effectiveDeck ?? []}
						currentCardIndex={state.currentCardIndex}
						isFirstCard={isFirstCard}
						cardRef={cardRef}
						offset={swipeOffset}
						verticalOffset={swipeVerticalOffset}
						direction={swipeDirection}
						isDragging={isDragging}
						exitDirection={cardExitDirection}
						exitPosition={exitPosition}
						isSnappingBack={isSnappingBack}
						isSwipeUp={isSwipeUp}
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
