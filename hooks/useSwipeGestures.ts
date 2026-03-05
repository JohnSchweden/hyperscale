import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const SWIPE_THRESHOLD = 100;
const SWIPE_PREVIEW_THRESHOLD = 50;

interface SwipeState {
	offset: number;
	direction: "LEFT" | "RIGHT" | null;
	isDragging: boolean;
	exitDirection: "LEFT" | "RIGHT" | null;
	exitPosition: { x: number; rotate: number } | null;
	isSnappingBack: boolean;
	hasDragged: boolean;
}

export type { SwipeState };

interface UseSwipeGesturesOptions {
	enabled: boolean;
	onSwipe: (direction: "LEFT" | "RIGHT") => void;
}

export function useSwipeGestures({
	enabled,
	onSwipe,
}: UseSwipeGesturesOptions) {
	const [state, setState] = useState<SwipeState>({
		offset: 0,
		direction: null,
		isDragging: false,
		exitDirection: null,
		exitPosition: null,
		isSnappingBack: false,
		hasDragged: false,
	});

	const touchStartX = useRef(0);
	const touchStartY = useRef(0);
	const isHorizontalSwipe = useRef(false);
	const rafRef = useRef<number | null>(null);
	const pendingSwipeRef = useRef<{ deltaX: number; deltaY: number } | null>(
		null,
	);
	const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);

	const reset = useCallback(() => {
		setState({
			offset: 0,
			direction: null,
			isDragging: false,
			exitDirection: null,
			exitPosition: null,
			isSnappingBack: false,
			hasDragged: false,
		});
	}, []);

	const handleTouchStart = useCallback(
		(clientX: number, clientY: number) => {
			if (!enabled) return;

			touchStartX.current = clientX;
			touchStartY.current = clientY;
			isHorizontalSwipe.current = false;
			setState((prev) => ({ ...prev, isDragging: true, hasDragged: true }));
		},
		[enabled],
	);

	const handleTouchMove = useCallback(
		(clientX: number, clientY: number) => {
			if (!state.isDragging || !enabled) return;

			const deltaX = clientX - touchStartX.current;
			const deltaY = clientY - touchStartY.current;

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
					const newDirection =
						Math.abs(dx) > SWIPE_PREVIEW_THRESHOLD
							? dx > 0
								? "RIGHT"
								: "LEFT"
							: null;
					setState((prev) => ({
						...prev,
						offset: dx,
						direction: newDirection,
					}));
				}

				rafRef.current = null;
				pendingSwipeRef.current = null;
			});
		},
		[state.isDragging, enabled],
	);

	const handleTouchEnd = useCallback(() => {
		if (!state.isDragging) return;

		let finalOffset = state.offset;
		let finalDirection: "LEFT" | "RIGHT" | null = state.direction;

		if (rafRef.current !== null) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}

		if (pendingSwipeRef.current) {
			const { deltaX } = pendingSwipeRef.current;
			finalOffset = deltaX;
			if (isHorizontalSwipe.current) {
				finalDirection =
					Math.abs(deltaX) > SWIPE_PREVIEW_THRESHOLD
						? deltaX > 0
							? "RIGHT"
							: "LEFT"
						: null;
				setState((prev) => ({
					...prev,
					offset: deltaX,
					direction: finalDirection,
				}));
			}
			pendingSwipeRef.current = null;
		}

		setState((prev) => ({ ...prev, isDragging: false }));

		if (Math.abs(finalOffset) > SWIPE_THRESHOLD) {
			const direction = finalOffset > 0 ? "RIGHT" : "LEFT";
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
				direction: null,
			}));
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
			animationTimeoutRef.current = setTimeout(() => {
				setState((prev) => ({ ...prev, isSnappingBack: false }));
				animationTimeoutRef.current = null;
			}, 600);
		}
	}, [state.isDragging, state.offset, state.direction, onSwipe]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
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
		},
		[handleTouchStart],
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
		isHorizontalSwipe: () => isHorizontalSwipe.current,
		SWIPE_THRESHOLD,
		SWIPE_PREVIEW_THRESHOLD,
	};
}
