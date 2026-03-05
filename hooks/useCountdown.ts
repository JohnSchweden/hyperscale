import { useCallback, useEffect, useState } from "react";

interface UseCountdownOptions {
	startFrom: number;
	onComplete: () => void;
	isActive: boolean;
}

export function useCountdown({
	startFrom,
	onComplete,
	isActive,
}: UseCountdownOptions) {
	const [count, setCount] = useState(startFrom);

	useEffect(() => {
		if (!isActive) {
			setCount(startFrom);
			return;
		}

		if (count > 0) {
			const timer = setTimeout(() => setCount((c) => c - 1), 1000);
			return () => clearTimeout(timer);
		} else {
			onComplete();
		}
	}, [isActive, count, startFrom, onComplete]);

	const reset = useCallback(() => {
		setCount(startFrom);
	}, [startFrom]);

	return { count, reset };
}
