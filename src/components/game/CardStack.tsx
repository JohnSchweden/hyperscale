import type React from "react";
import type { RefObject } from "react";
import { useEffect } from "react";
import { ROLE_CARDS } from "../../data";
import { getIncidentImagePath, slugify } from "../../data/imageMap";
import type { Card, RoleType } from "../../types";
import { CardBody, CardHeaderBar } from "./CardStackComponents";
import { GLASS_CARD_MODAL } from "./selectionStageStyles";

/** Style for the next card visible behind the active card */
const NEXT_CARD_STYLE: React.CSSProperties = {
	zIndex: 0,
	transform: "scale(0.95)",
	opacity: 0.6,
};

/** Match feedback modal glass (`.glass-card-modal` in index.html) */
const incidentCardGlass = GLASS_CARD_MODAL;

function getCardTransition(
	isDragging: boolean,
	exitDirection: "LEFT" | "RIGHT" | null,
): string {
	if (isDragging) return "none";
	if (exitDirection)
		return "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
	return "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)";
}

/**
 * Grouped swipe animation and gesture state.
 */
export interface SwipeState {
	/** Horizontal offset for swipe animation */
	offset: number;
	/** Vertical offset for swipe animation */
	verticalOffset?: number;
	/** Current swipe direction */
	direction: "LEFT" | "RIGHT" | null;
	/** Whether the user is currently dragging */
	isDragging: boolean;
	/** Whether the user has dragged at least once */
	hasDragged: boolean;
	/** Direction of card exit animation */
	exitDirection: "LEFT" | "RIGHT" | null;
	/** Position and rotation for exit animation */
	exitPosition: { x: number; rotate: number } | null;
	/** Whether the card is snapping back to center */
	isSnappingBack: boolean;
}

/**
 * Grouped swipe gesture handlers.
 */
export interface SwipeHandlers {
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
}

/**
 * Grouped swipe distance thresholds.
 */
export interface SwipeThresholds {
	/** Distance threshold for completing a swipe */
	swipeThreshold: number;
	/** Distance threshold for showing swipe preview */
	swipePreviewThreshold: number;
}

/**
 * Props for the CardStack component.
 */
interface CardStackProps {
	/** The user's selected role type */
	role: RoleType;
	/** Array of cards to display */
	cards: Card[];
	/** Index of the currently displayed card */
	currentCardIndex: number;
	/** Whether this is the first card in the deck */
	isFirstCard: boolean;
	/** Reference to the card container div for swipe handling */
	cardRef: RefObject<HTMLDivElement>;
	/** Grouped swipe animation and gesture state */
	swipeState: SwipeState;
	/** Grouped swipe gesture handlers */
	swipeHandlers: SwipeHandlers;
	/** Grouped swipe distance thresholds */
	swipeThresholds: SwipeThresholds;
	/** Whether the card should show urgent stress visuals */
	isUrgent?: boolean;
}

/**
 * Props for the SwipePreview component.
 */
interface SwipePreviewProps {
	/** Direction of the swipe preview */
	direction: "LEFT" | "RIGHT";
	/** Current swipe offset distance */
	offset: number;
	/** Threshold for showing swipe preview */
	swipePreviewThreshold: number;
	/** Threshold for completing swipe */
	swipeThreshold: number;
	/** The card being swiped to show preview for */
	card: Card;
}

function SwipePreview({
	direction,
	offset,
	swipePreviewThreshold,
	swipeThreshold,
	card,
}: SwipePreviewProps): React.ReactElement {
	const raw = (Math.abs(offset) - swipePreviewThreshold) / swipeThreshold;
	const t = Math.max(0, Math.min(1, raw));
	const labelOpacity = Math.max(0, Math.min(1, 0.3 + t * 0.7));
	/** Edge wash — cyan-500 / orange-500 (left reads warmer than pure yellow) */
	const tintGradient =
		direction === "RIGHT"
			? "linear-gradient(to left, rgba(6, 182, 212, 0.4) 0%, rgba(6, 182, 212, 0.15) 42%, transparent 72%)"
			: "linear-gradient(to right, rgba(249, 115, 22, 0.4) 0%, rgba(249, 115, 22, 0.15) 42%, transparent 72%)";
	const label =
		direction === "RIGHT"
			? card.onRight.label.toUpperCase()
			: card.onLeft.label.toUpperCase();
	return (
		<div className="absolute inset-0 pointer-events-none z-10">
			<div
				className="absolute inset-0 rounded-[inherit]"
				style={{
					background: tintGradient,
					opacity: t * 0.9,
				}}
				aria-hidden
			/>
			<div
				className={`absolute top-1/2 -translate-y-1/2 font-black tracking-tighter ${direction === "RIGHT" ? "left-8 text-cyan-500" : "right-8 text-orange-500"}`}
				style={{
					fontSize: `clamp(1.5rem, ${2 + t * 2}rem, 3.75rem)`,
					transform: `scale(${0.5 + Math.min(0.5, t * 0.5)})`,
					opacity: labelOpacity,
				}}
			>
				{label}
			</div>
		</div>
	);
}

/**
 * CardStack component for displaying and handling swipe interactions on incident cards.
 * Renders the current card with swipe gestures, preview overlays, and next card background.
 * Handles touch/mouse events, animations, and visual stress indicators.
 * @param props - The component props
 * @returns The rendered card stack component
 */
export const CardStack: React.FC<CardStackProps> = ({
	role,
	cards: propsCards,
	currentCardIndex,
	isFirstCard,
	cardRef,
	swipeState,
	swipeHandlers,
	swipeThresholds,
	isUrgent = false,
}) => {
	const {
		offset,
		verticalOffset = 0,
		direction,
		isDragging,
		hasDragged,
		exitDirection,
		exitPosition,
		isSnappingBack,
	} = swipeState;
	const { onTouchStart, onTouchMove, onTouchEnd, onSwipeLeft, onSwipeRight } =
		swipeHandlers;
	const { swipeThreshold, swipePreviewThreshold } = swipeThresholds;
	// Use cards from props (effectiveDeck with shuffling/branching), fall back to ROLE_CARDS for compatibility
	const cards = propsCards.length > 0 ? propsCards : ROLE_CARDS[role];
	const currentCard = cards[currentCardIndex];
	const nextCard = cards[currentCardIndex + 1];

	// Preload next card's image to eliminate placeholder flash on swipe (must be before early return)
	useEffect(() => {
		if (!nextCard?.realWorldReference?.incident) return;
		const link = document.createElement("link");
		link.rel = "preload";
		link.as = "image";
		link.href = getIncidentImagePath(
			slugify(nextCard.realWorldReference.incident),
		);
		document.head.appendChild(link);
		return () => {
			document.head.removeChild(link);
		};
	}, [nextCard]);

	if (!currentCard) return null;

	return (
		<div
			className={`relative flex-shrink-0 w-full max-w-full lg:max-w-[43rem] h-[420px] md:h-[540px] ${isUrgent ? "pressure-shake" : ""}`}
			data-testid="incident-card-container"
			data-pressure-stress={isUrgent ? "true" : undefined}
		>
			{/* Next card (behind) */}
			{nextCard && (
				<div
					className={`absolute inset-0 rounded-xl overflow-hidden flex flex-col ${incidentCardGlass}`}
					style={NEXT_CARD_STYLE}
				>
					<CardHeaderBar source={nextCard.source} context={nextCard.context} />
					<CardBody
						card={nextCard}
						incidentNumber={(currentCardIndex + 2) * 324}
						variant="preview"
					/>
				</div>
			)}

			{/* Glow overlay: sibling to card, not in transform subtree — avoids compositor layer skipping repaint until touch */}
			{isUrgent && (
				<div
					className="absolute inset-0 rounded-xl pointer-events-none pressure-pulse-overlay"
					style={{ zIndex: 5 }}
					aria-hidden
				/>
			)}

			{/* Current card (front) - role="group" for a11y on interactive div */}
			{/* biome-ignore lint/a11y/useSemanticElements: swipe card container is not a form fieldset */}
			<div
				ref={cardRef}
				role="group"
				data-testid="incident-card"
				data-card-id={currentCard.id}
				className={`absolute inset-0 rounded-xl overflow-hidden flex flex-col select-none swipe-card ${incidentCardGlass} ${isFirstCard && !exitDirection && !isDragging && !hasDragged ? "ticket-transition" : ""} ${isSnappingBack ? "spring-snap-back" : ""} ${isUrgent ? "pressure-flicker" : ""}`}
				key={currentCardIndex}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
				onMouseDown={onTouchStart}
				onMouseUp={onTouchEnd}
				style={{
					zIndex: 10,
					transform:
						exitDirection && exitPosition
							? `translateX(${exitPosition.x}px) rotate(${exitPosition.rotate}deg)`
							: `translateX(${offset}px) translateY(${verticalOffset}px) rotate(${offset * 0.05}deg)`,
					transition: getCardTransition(isDragging, exitDirection),
					cursor: isDragging ? "grabbing" : "grab",
					opacity: exitDirection ? 0 : 1,
				}}
			>
				{/* Dynamic Swipe Preview */}
				{direction && (
					<SwipePreview
						direction={direction}
						offset={offset}
						swipePreviewThreshold={swipePreviewThreshold}
						swipeThreshold={swipeThreshold}
						card={currentCard}
					/>
				)}

				<CardHeaderBar
					source={currentCard.source}
					context={currentCard.context}
				/>
				<CardBody
					card={currentCard}
					incidentNumber={(currentCardIndex + 1) * 324}
					variant="full"
					onSwipeLeft={onSwipeLeft}
					onSwipeRight={onSwipeRight}
					leftLabel={currentCard.onLeft.label}
					rightLabel={currentCard.onRight.label}
					currentDirection={direction}
					isUrgent={isUrgent}
				/>
			</div>
		</div>
	);
};
