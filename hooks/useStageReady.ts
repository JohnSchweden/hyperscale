import { useEffect, useRef, useState } from "react";
import type { GameStage } from "../types";

interface UseStageReadyOptions {
	stage: GameStage;
	targetStage: GameStage;
	delay?: number;
}

export function useStageReady({
	stage,
	targetStage,
	delay = 100,
}: UseStageReadyOptions) {
	const [isReady, setIsReady] = useState(false);
	const [hoverEnabled, setHoverEnabled] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Block ghost clicks; enable clicks after short delay
	useEffect(() => {
		if (stage !== targetStage) {
			setIsReady(false);
			setHoverEnabled(false);
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
			return;
		}

		timeoutRef.current = setTimeout(() => {
			setIsReady(true);
			timeoutRef.current = null;
		}, delay);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, [stage, targetStage, delay]);

	// Enable hover only after first pointer move
	useEffect(() => {
		if (stage !== targetStage) return;

		const onMove = () => {
			setHoverEnabled(true);
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("touchstart", onMove, { capture: true });
		};

		window.addEventListener("mousemove", onMove, { once: true });
		window.addEventListener("touchstart", onMove, {
			capture: true,
			once: true,
		});

		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("touchstart", onMove, { capture: true });
		};
	}, [stage, targetStage]);

	return { isReady, hoverEnabled };
}
