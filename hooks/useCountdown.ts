import { useCallback, useEffect, useState } from "react";

interface UseCountdownOptions {
	startFrom: number;
	onComplete: () => void;
	isActive: boolean;
}

interface UseCountdownResult {
	count: number;
	reset: () => void;
}

export function useCountdown(options: UseCountdownOptions): UseCountdownResult {
	const { startFrom, onComplete, isActive } = options;
	const [count, setCount] = useState(startFrom);

	useEffect(() => {
		if (!isActive) {
			setCount(startFrom);
			return;
		}
		if (count === 0 && startFrom > 0) {
			setCount(startFrom);
			return;
		}
		if (count > 0) {
			const id = setTimeout(() => setCount((c) => c - 1), 1000);
			return () => clearTimeout(id);
		}
		onComplete();
	}, [isActive, count, startFrom, onComplete]);

	const reset = useCallback(() => setCount(startFrom), [startFrom]);

	return { count, reset };
}
