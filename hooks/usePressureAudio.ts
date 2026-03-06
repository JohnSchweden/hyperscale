import { useEffect, useRef } from "react";
import { createPressureAudioSession } from "../services/pressureAudio";

/** Phase 04: React lifecycle wrapper around pressure audio session */

export interface UsePressureAudioOptions {
	/** Whether pressure is high enough to trigger stress cues */
	hasHighPressure: boolean;
	/** Whether we're in a critical moment (haptic pulse) */
	isCritical: boolean;
	/** Whether we're actively playing (not feedback overlay) */
	isActive: boolean;
}

const VIBRATE_PATTERN = [50, 30, 50];

function triggerHaptic(): void {
	if (
		typeof navigator !== "undefined" &&
		"vibrate" in navigator &&
		typeof navigator.vibrate === "function"
	) {
		navigator.vibrate(VIBRATE_PATTERN);
	}
}

export function usePressureAudio({
	hasHighPressure,
	isCritical,
	isActive,
}: UsePressureAudioOptions): void {
	const sessionRef = useRef<ReturnType<
		typeof createPressureAudioSession
	> | null>(null);
	const wasCriticalRef = useRef(false);

	if (typeof window !== "undefined" && !sessionRef.current) {
		try {
			sessionRef.current = createPressureAudioSession();
		} catch {
			sessionRef.current = null;
		}
	}

	// Audio: start heartbeat when high pressure + active, stop otherwise
	useEffect(() => {
		const session = sessionRef.current;
		if (!session) return;

		if (hasHighPressure && isActive) {
			session.startHeartbeat();
		} else {
			session.stop();
		}

		return () => {
			session.stop();
		};
	}, [hasHighPressure, isActive]);

	// Haptic: single pulse when entering critical state
	useEffect(() => {
		if (isCritical && !wasCriticalRef.current) {
			triggerHaptic();
			wasCriticalRef.current = true;
		}
		if (!isCritical) {
			wasCriticalRef.current = false;
		}
	}, [isCritical]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			sessionRef.current?.stop();
		};
	}, []);
}
