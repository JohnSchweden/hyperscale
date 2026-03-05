import { useEffect, useState } from "react";

export function useClock(updateInterval = 10000) {
	const [time, setTime] = useState(() =>
		new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
	);

	useEffect(() => {
		const timer = setInterval(() => {
			setTime(
				new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
			);
		}, updateInterval);
		return () => clearInterval(timer);
	}, [updateInterval]);

	return time;
}
