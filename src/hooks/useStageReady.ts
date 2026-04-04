import { useCallback, useEffect, useRef, useState } from "react";
import type { GameStage } from "../types";

/**
 * Options for the useStageReady hook.
 */
interface UseStageReadyOptions {
	stage: GameStage;
	targetStage: GameStage;
	delay?: number;
}

/**
 * Return type for the useStageReady hook.
 */
interface UseStageReadyResult {
	isReady: boolean;
	hoverEnabled: boolean;
}

/**
 * Custom hook for managing UI readiness after stage transitions.
 * @param options - Configuration options
 * @returns Object with readiness state and hover enablement
 */
export function useStageReady({
	stage,
	targetStage,
	delay = 100,
}: UseStageReadyOptions): UseStageReadyResult {
	const [isReady, setIsReady] = useState(false);
	const [hoverEnabled, setHoverEnabled] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearPendingTimeout = useCallback((): void => {
		if (!timeoutRef.current) {
			return;
		}

		clearTimeout(timeoutRef.current);
		timeoutRef.current = null;
	}, []);

	// Block ghost clicks; enable clicks after short delay
	useEffect(() => {
		if (stage !== targetStage) {
			setIsReady(false);
			setHoverEnabled(false);
			clearPendingTimeout();
			return;
		}

		timeoutRef.current = setTimeout(() => {
			setIsReady(true);
			timeoutRef.current = null;
		}, delay);

		return () => {
			clearPendingTimeout();
		};
	}, [stage, targetStage, delay, clearPendingTimeout]);

	// Enable hover only after first pointer move
	useEffect(() => {
		if (stage !== targetStage) return;

		const onMove = () => {
			setHoverEnabled(true);
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("touchstart", onMove, true);
		};

		window.addEventListener("mousemove", onMove, { once: true });
		window.addEventListener("touchstart", onMove, {
			capture: true,
			once: true,
		});

		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("touchstart", onMove, true);
		};
	}, [stage, targetStage]);

	return { isReady, hoverEnabled };
}
