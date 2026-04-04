import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const SWIPE_THRESHOLD = 100;
const SWIPE_PREVIEW_THRESHOLD = 50;
const VERTICAL_DOMINANCE_RATIO = 1.5;

function getSwipeDirectionFromDelta(
	deltaX: number,
	threshold: number,
): "LEFT" | "RIGHT" | null {
	if (Math.abs(deltaX) <= threshold) return null;
	return deltaX > 0 ? "RIGHT" : "LEFT";
}

interface SwipeState {
	offset: number;
	verticalOffset: number;
	direction: "LEFT" | "RIGHT" | null;
	isDragging: boolean;
	exitDirection: "LEFT" | "RIGHT" | null;
	exitPosition: { x: number; rotate: number } | null;
	isSnappingBack: boolean;
	hasDragged: boolean;
	isSwipeUp: boolean;
}

/**
 * State representing the current swipe gesture.
 */
export type { SwipeState };

/**
 * Options for the useSwipeGestures hook.
 */
interface UseSwipeGesturesOptions {
	enabled: boolean;
	onSwipe: (direction: "LEFT" | "RIGHT") => void;
	onBeforeSwipe?: (direction: "LEFT" | "RIGHT") => void;
	onSwipeUp?: () => void;
}

/**
 * Custom hook for handling swipe gestures on touch and mouse events.
 * @param options - Configuration options for swipe behavior
 * @returns Object with current state, event handlers, and programmatic swipe function
 */
export function useSwipeGestures({
	enabled,
	onSwipe,
	onBeforeSwipe,
	onSwipeUp,
}: UseSwipeGesturesOptions) {
	const [state, setState] = useState<SwipeState>({
		offset: 0,
		verticalOffset: 0,
		direction: null,
		isDragging: false,
		exitDirection: null,
		exitPosition: null,
		isSnappingBack: false,
		hasDragged: false,
		isSwipeUp: false,
	});

	const touchStartX = useRef(0);
	const touchStartY = useRef(0);
	/** Synchronous drag flag so the first mousemove after mousedown is not dropped (state.isDragging lags one frame). */
	const isDraggingRef = useRef(false);
	const isHorizontalSwipe = useRef(false);
	const lastDeltaX = useRef(0);
	const lastDeltaY = useRef(0);
	const rafRef = useRef<number | null>(null);
	const pendingSwipeRef = useRef<{ deltaX: number; deltaY: number } | null>(
		null,
	);
	const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);
	const removeWindowMouseListenersRef = useRef<(() => void) | null>(null);
	const enabledRef = useRef(enabled);
	enabledRef.current = enabled;

	const reset = useCallback(() => {
		removeWindowMouseListenersRef.current?.();
		removeWindowMouseListenersRef.current = null;
		isDraggingRef.current = false;
		setState({
			offset: 0,
			verticalOffset: 0,
			direction: null,
			isDragging: false,
			exitDirection: null,
			exitPosition: null,
			isSnappingBack: false,
			hasDragged: false,
			isSwipeUp: false,
		});
	}, []);

	const handleTouchStart = useCallback(
		(clientX: number, clientY: number) => {
			if (!enabled) return;

			touchStartX.current = clientX;
			touchStartY.current = clientY;
			isHorizontalSwipe.current = false;
			lastDeltaX.current = 0;
			lastDeltaY.current = 0;
			isDraggingRef.current = true;
			setState((prev) => ({ ...prev, isDragging: true, hasDragged: true }));
		},
		[enabled],
	);

	const handleTouchMove = useCallback(
		(clientX: number, clientY: number) => {
			if (!isDraggingRef.current || !enabled) return;

			const deltaX = clientX - touchStartX.current;
			const deltaY = clientY - touchStartY.current;

			lastDeltaX.current = deltaX;
			lastDeltaY.current = deltaY;
			pendingSwipeRef.current = { deltaX, deltaY };

			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}

			rafRef.current = requestAnimationFrame(() => {
				const pending = pendingSwipeRef.current;
				if (pending == null) {
					rafRef.current = null;
					return;
				}

				const { deltaX: dx, deltaY: dy } = pending;

				if (!isHorizontalSwipe.current && Math.abs(dx) > Math.abs(dy)) {
					isHorizontalSwipe.current = true;
				}

				if (isHorizontalSwipe.current) {
					const newDirection = getSwipeDirectionFromDelta(
						dx,
						SWIPE_PREVIEW_THRESHOLD,
					);
					setState((prev) => ({
						...prev,
						offset: dx,
						verticalOffset: 0,
						direction: newDirection,
					}));
				} else if (
					dy < 0 &&
					Math.abs(dy) > Math.abs(dx) * VERTICAL_DOMINANCE_RATIO
				) {
					// Vertical-dominant upward gesture - track for swipe-up preview
					setState((prev) => ({
						...prev,
						offset: 0,
						verticalOffset: dy,
						isSwipeUp: Math.abs(dy) > SWIPE_PREVIEW_THRESHOLD,
					}));
				}

				rafRef.current = null;
				pendingSwipeRef.current = null;
			});
		},
		[enabled],
	);

	const handleTouchEnd = useCallback(() => {
		if (!isDraggingRef.current) return;
		isDraggingRef.current = false;

		// Prefer pointer deltas over React state — state.offset can lag a frame behind RAF/setState.
		let finalDeltaY = lastDeltaY.current;
		let finalDeltaX = lastDeltaX.current;
		let finalOffset = finalDeltaX;
		let finalDirection: "LEFT" | "RIGHT" | null = isHorizontalSwipe.current
			? getSwipeDirectionFromDelta(finalDeltaX, SWIPE_PREVIEW_THRESHOLD)
			: state.direction;

		if (rafRef.current !== null) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}

		if (pendingSwipeRef.current) {
			const { deltaX, deltaY } = pendingSwipeRef.current;
			finalOffset = deltaX;
			finalDeltaX = deltaX;
			finalDeltaY = deltaY;
			if (isHorizontalSwipe.current) {
				finalDirection = getSwipeDirectionFromDelta(
					deltaX,
					SWIPE_PREVIEW_THRESHOLD,
				);
				setState((prev) => ({
					...prev,
					offset: deltaX,
					direction: finalDirection,
				}));
			}
			pendingSwipeRef.current = null;
		}

		setState((prev) => ({ ...prev, isDragging: false }));

		// Swipe-up detection: vertical-dominant upward gesture exceeding threshold
		// Guard: !isHorizontalSwipe.current (not locked as horizontal)
		// Guard: deltaY < -SWIPE_THRESHOLD (upward, negative Y)
		// Guard: |deltaY| > |deltaX| * VERTICAL_DOMINANCE_RATIO (vertical dominant by 1.5x ratio)
		if (
			!isHorizontalSwipe.current &&
			finalDeltaY < -SWIPE_THRESHOLD &&
			Math.abs(finalDeltaY) > Math.abs(finalDeltaX) * VERTICAL_DOMINANCE_RATIO
		) {
			onSwipeUp?.();
			// Snap back with vertical animation (like incomplete left/right swipe)
			setState((prev) => ({
				...prev,
				isSnappingBack: true,
				offset: 0,
				verticalOffset: 0,
				direction: null,
				isSwipeUp: false,
			}));
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
			animationTimeoutRef.current = setTimeout(() => {
				setState((prev) => ({ ...prev, isSnappingBack: false }));
				animationTimeoutRef.current = null;
			}, 600);
			return;
		}

		// Below-threshold vertical gesture: snap back like incomplete horizontal swipe
		if (
			!isHorizontalSwipe.current &&
			finalDeltaY < 0 &&
			Math.abs(finalDeltaY) > Math.abs(finalDeltaX) * VERTICAL_DOMINANCE_RATIO
		) {
			setState((prev) => ({
				...prev,
				isSnappingBack: true,
				offset: 0,
				verticalOffset: 0,
				direction: null,
				isSwipeUp: false,
			}));
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
			animationTimeoutRef.current = setTimeout(() => {
				setState((prev) => ({ ...prev, isSnappingBack: false }));
				animationTimeoutRef.current = null;
			}, 600);
			return;
		}

		if (Math.abs(finalOffset) > SWIPE_THRESHOLD) {
			const direction = finalOffset > 0 ? "RIGHT" : "LEFT";

			// Call onBeforeSwipe synchronously while still in user gesture context
			onBeforeSwipe?.(direction);

			const targetX =
				direction === "RIGHT"
					? window.innerWidth * 1.2
					: -window.innerWidth * 1.2;
			const targetRotate = direction === "RIGHT" ? 25 : -25;

			setState((prev) => ({
				...prev,
				exitDirection: direction,
				exitPosition: { x: targetX, rotate: targetRotate },
			}));

			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
			animationTimeoutRef.current = setTimeout(() => {
				onSwipe(direction);
				setState((prev) => ({ ...prev, hasDragged: false }));
				animationTimeoutRef.current = null;
			}, 350);
		} else {
			setState((prev) => ({
				...prev,
				isSnappingBack: true,
				offset: 0,
				verticalOffset: 0,
				direction: null,
				isSwipeUp: false,
			}));
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
			animationTimeoutRef.current = setTimeout(() => {
				setState((prev) => ({ ...prev, isSnappingBack: false }));
				animationTimeoutRef.current = null;
			}, 600);
		}
	}, [state.direction, onSwipe, onBeforeSwipe, onSwipeUp]);

	const handleTouchMoveRef = useRef(handleTouchMove);
	handleTouchMoveRef.current = handleTouchMove;
	const handleTouchEndRef = useRef(handleTouchEnd);
	handleTouchEndRef.current = handleTouchEnd;

	const attachWindowMouseDrag = useCallback(() => {
		removeWindowMouseListenersRef.current?.();
		const move = (ev: MouseEvent) => {
			handleTouchMoveRef.current(ev.clientX, ev.clientY);
		};
		const up = () => {
			removeWindowMouseListenersRef.current?.();
			removeWindowMouseListenersRef.current = null;
			handleTouchEndRef.current();
		};
		window.addEventListener("mousemove", move);
		window.addEventListener("mouseup", up);
		removeWindowMouseListenersRef.current = () => {
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", up);
		};
	}, []);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			removeWindowMouseListenersRef.current?.();
			removeWindowMouseListenersRef.current = null;
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
		};
	}, []);

	// React event handlers wrapper
	const onTouchStart = useCallback(
		(e: React.TouchEvent | React.MouseEvent) => {
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
			handleTouchStart(clientX, clientY);

			// Playwright page.mouse dispatches MouseEvent, not PointerEvent. Card-level
			// mousemove stops when the cursor leaves the card; window listeners keep
			// the gesture coherent through threshold and off-card mouseup.
			if (!("touches" in e) && "button" in e && e.button === 0) {
				attachWindowMouseDrag();
			}
		},
		[handleTouchStart, attachWindowMouseDrag],
	);

	const onTouchMove = useCallback(
		(e: React.TouchEvent | React.MouseEvent) => {
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
			handleTouchMove(clientX, clientY);
		},
		[handleTouchMove],
	);

	const onTouchEnd = useCallback(() => {
		handleTouchEnd();
	}, [handleTouchEnd]);

	const swipeProgrammatically = useCallback(
		(direction: "LEFT" | "RIGHT") => {
			if (state.exitDirection) return;

			const targetX =
				direction === "RIGHT"
					? window.innerWidth * 1.2
					: -window.innerWidth * 1.2;
			const targetRotate = direction === "RIGHT" ? 25 : -25;

			setState((prev) => ({
				...prev,
				exitDirection: direction,
				exitPosition: { x: targetX, rotate: targetRotate },
			}));

			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
			animationTimeoutRef.current = setTimeout(() => {
				onSwipe(direction);
				setState((prev) => ({ ...prev, hasDragged: false }));
				animationTimeoutRef.current = null;
			}, 350);
		},
		[state.exitDirection, onSwipe],
	);

	return {
		...state,
		reset,
		onTouchStart,
		onTouchMove,
		onTouchEnd,
		swipeProgrammatically,
		SWIPE_THRESHOLD,
		SWIPE_PREVIEW_THRESHOLD,
	};
}
