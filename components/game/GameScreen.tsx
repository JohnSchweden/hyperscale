import type React from "react";
import type { GameState } from "../../types";
import { ROLE_FINE_TIERS } from "../../types";
import LayoutShell from "../LayoutShell";
import { CardStack } from "./CardStack";
import { GameHUD } from "./GameHUD";
import { RoastTerminal } from "./RoastTerminal";
import { Taskbar } from "./Taskbar";

/**
 * Props for the GameScreen component.
 */
interface GameScreenProps {
	/** Current game state containing role, personality, budget, heat, hype, etc. */
	state: GameState;
	/** Whether this is the first card in the deck */
	isFirstCard: boolean;
	/** Reference to the card container div for swipe handling */
	cardRef: React.RefObject<HTMLDivElement>;
	// Swipe state
	/** Horizontal offset for swipe animation */
	swipeOffset: number;
	/** Vertical offset for swipe animation */
	swipeVerticalOffset?: number;
	/** Current swipe direction */
	swipeDirection: "LEFT" | "RIGHT" | null;
	/** Whether the user is currently dragging */
	isDragging: boolean;
	/** Whether the user has dragged at least once */
	hasDragged: boolean;
	/** Direction of card exit animation */
	cardExitDirection: "LEFT" | "RIGHT" | null;
	/** Position and rotation for exit animation */
	exitPosition: { x: number; rotate: number } | null;
	/** Whether the card is snapping back to center */
	isSnappingBack: boolean;
	/** Whether this is an upward swipe gesture */
	isSwipeUp?: boolean;
	// Swipe handlers
	/** Handler for touch/mouse start events */
	onTouchStart: (e: React.TouchEvent | React.MouseEvent) => void;
	/** Handler for touch/mouse move events */
	onTouchMove: (e: React.TouchEvent | React.MouseEvent) => void;
	/** Handler for touch/mouse end events */
	onTouchEnd: () => void;
	/** Action to perform on left swipe */
	onSwipeLeft: () => void;
	/** Action to perform on right swipe */
	onSwipeRight: () => void;
	// Roast
	/** Current roast input text */
	roastInput: string;
	/** Roast output text or null if no output */
	roastOutput: string | null;
	/** Whether roast is currently being generated */
	isRoasting: boolean;
	/** Reference to roast output container for auto-scrolling */
	roastOutputRef: React.RefObject<HTMLDivElement>;
	/** Handler for roast input text changes */
	onRoastInputChange: (value: string) => void;
	/** Handler for roast submission */
	onRoastSubmit: () => void;
	// Taskbar
	/** Current time string for display */
	currentTime: string;
	// Config
	/** Distance threshold for completing a swipe */
	swipeThreshold: number;
	/** Distance threshold for showing swipe preview */
	swipePreviewThreshold: number;
	// Pressure / countdown
	/** Current countdown value when active */
	countdownValue?: number;
	/** Whether countdown is currently active */
	isCountdownActive?: boolean;
	/** Whether the current state is critical */
	isCritical?: boolean;
}

/**
 * GameScreen component renders the main game interface with card stack, HUD, and roast terminal.
 * Manages the core gameplay loop including swipe interactions, pressure states, and UI orchestration.
 * Displays countdown timers during urgent situations and handles all game interactions.
 * @param props - The component props
 * @returns The rendered game screen component
 */
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
