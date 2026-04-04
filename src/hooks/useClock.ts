import { useEffect, useState } from "react";

function getCurrentTime(): string {
	return new Date().toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
}

/**
 * Hook that provides the current time as a formatted string, updating at regular intervals.
 * @param updateInterval - Interval in milliseconds for updating the time (default: 10000)
 * @returns Current time formatted as HH:MM
 */
export function useClock(updateInterval = 10000): string {
	const [time, setTime] = useState(getCurrentTime);

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(getCurrentTime());
		}, updateInterval);

		return () => clearInterval(timer);
	}, [updateInterval]);

	return time;
}
