import { useEffect, useRef } from "react";
import {
	createPressureAudioSession,
	type HeartbeatConfig,
	playUnlockPulse,
} from "../services/pressureAudio";
import { triggerHaptic } from "../utils/haptic";

/** Phase 04: React lifecycle wrapper around pressure audio session */

/**
 * Options for the usePressureAudio hook.
 */
export interface UsePressureAudioOptions {
	/** Whether pressure is high enough to trigger stress cues */
	hasHighPressure: boolean;
	/** Whether we're in a critical moment (haptic pulse) */
	isCritical: boolean;
	/** Current countdown value when countdown is active */
	countdownValue?: number;
	/** Total countdown length in seconds */
	countdownSec?: number;
	/** Whether countdown is ticking */
	isCountdownActive?: boolean;
}

/**
 * Resume AudioContext on first user gesture. Chrome Android blocks resume()
 * when not triggered by user interaction; heartbeat starts from useEffect
 * (hasHighPressure change) which is not a gesture.
 */
function resumeOnFirstGesture(ctx: AudioContext): void {
	const resume = () => {
		if (ctx.state === "suspended") {
			ctx.resume().then(() => playUnlockPulse(ctx));
		}
	};
	// touchend for mobile, click for desktop
	const opts = { once: true, capture: true };
	document.addEventListener("touchend", resume, opts);
	document.addEventListener("click", resume, opts);
}

/**
 * Custom hook for managing pressure audio cues during gameplay.
 * @param options - Configuration options for pressure audio
 */
export function usePressureAudio({
	hasHighPressure,
	isCritical,
	countdownValue,
	countdownSec,
	isCountdownActive,
}: UsePressureAudioOptions): void {
	const sessionRef = useRef<ReturnType<
		typeof createPressureAudioSession
	> | null>(null);
	const wasCriticalRef = useRef(false);

	if (typeof window !== "undefined" && !sessionRef.current) {
		try {
			const session = createPressureAudioSession();
			sessionRef.current = session;
			resumeOnFirstGesture(session.context);
		} catch {
			sessionRef.current = null;
		}
	}

	useEffect(() => {
		const session = sessionRef.current;
		if (!session) return;

		if (!hasHighPressure) {
			session.stop();
			return;
		}

		const config: HeartbeatConfig =
			isCountdownActive && countdownValue != null && countdownSec != null
				? { countdownValue, countdownSec }
				: {};
		session.updateHeartbeat(config);
	}, [hasHighPressure, isCountdownActive, countdownValue, countdownSec]);

	// Fallback haptic; primary path is App.tsx onSwipe (vibrate blocked outside user gesture).
	useEffect(() => {
		if (isCritical && !wasCriticalRef.current) {
			triggerHaptic();
			wasCriticalRef.current = true;
		}
		if (!isCritical) {
			wasCriticalRef.current = false;
		}
	}, [isCritical]);

	useEffect(() => {
		return () => {
			sessionRef.current?.stop();
		};
	}, []);
}
