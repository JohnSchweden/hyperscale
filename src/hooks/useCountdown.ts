import { useCallback, useEffect, useRef, useState } from "react";

interface UseCountdownOptions {
	startFrom: number;
	onComplete: () => void;
	onExpire?: () => void;
	isActive: boolean;
}

interface UseCountdownResult {
	count: number;
	reset: () => void;
}

/**
 * Hook for managing a countdown timer with completion and expiry callbacks.
 * Handles activation, reset, and automatic progression.
 * @param options - Configuration options for the countdown
 * @returns Object containing current count and reset function
 */
export function useCountdown(options: UseCountdownOptions): UseCountdownResult {
	const { startFrom, onComplete, onExpire, isActive } = options;
	const [count, setCount] = useState(startFrom);
	const hasTickedWhileActive = useRef(false);

	useEffect(() => {
		if (!isActive) {
			setCount(startFrom);
			hasTickedWhileActive.current = false;
			return;
		}
		if (count === 0 && startFrom > 0) {
			if (hasTickedWhileActive.current) {
				// Natural expiry: count reached 0 after ticking
				onExpire?.();
				onComplete();
			} else {
				// Fresh activation: isActive turned true, count is 0, haven't ticked yet
				setCount(startFrom);
			}
			return;
		}
		if (count > 0) {
			// Mark that we will tick; when tick fires and count becomes 0,
			// next effect run sees hasTickedWhileActive true → onComplete
			hasTickedWhileActive.current = true;
			const id = setTimeout(() => setCount((c) => c - 1), 1000);
			return () => clearTimeout(id);
		}
		// count === 0 && startFrom === 0: immediate completion
		onComplete();
	}, [isActive, count, startFrom, onComplete, onExpire]);

	const reset = useCallback(() => setCount(startFrom), [startFrom]);

	return { count, reset };
}
