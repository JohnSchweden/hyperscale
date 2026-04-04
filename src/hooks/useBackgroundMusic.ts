import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { BGM_TRACKS } from "../data/bgmPlaylist";
import { subscribeVoiceActivity } from "../services/voicePlayback";

const STORAGE = {
	VOLUME: "k-maru-bgm-volume",
	ENABLED: "k-maru-bgm-enabled",
	SESSION_TRACK: "k-maru-bgm-session-track",
	SESSION_TIME: "k-maru-bgm-session-time",
} as const;

const VOLUME = {
	DEFAULT: 0.2,
	MIN: 0,
	MAX: 1,
	STEP: 0.05,
} as const;

const SESSION_FLUSH_MS = 2000;
const VOICE_DUCK_MULT = 0.2;
const VOICE_UNDUCK_RAMP_MS = 1200;

function safeParse<T>(
	key: string,
	parser: (raw: string) => T | null,
	fallback: T,
): T {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = localStorage.getItem(key);
		if (raw == null) return fallback;
		const result = parser(raw);
		return result ?? fallback;
	} catch {
		return fallback;
	}
}

function safeSessionGet(key: string): string | null {
	if (typeof window === "undefined") return null;
	try {
		return sessionStorage.getItem(key);
	} catch {
		return null;
	}
}

function safeSessionSet(key: string, value: string): void {
	if (typeof window === "undefined") return;
	try {
		sessionStorage.setItem(key, value);
	} catch {
		/* quota / private mode */
	}
}

function safeSessionRemove(key: string): void {
	if (typeof window === "undefined") return;
	try {
		sessionStorage.removeItem(key);
	} catch {
		/* ignore */
	}
}

const clamp = (n: number, min: number, max: number) =>
	Math.min(max, Math.max(min, n));

function readStoredVolume(): number {
	return safeParse(
		STORAGE.VOLUME,
		(raw) => {
			const n = parseFloat(raw);
			return Number.isFinite(n) ? clamp(n, VOLUME.MIN, VOLUME.MAX) : null;
		},
		VOLUME.DEFAULT,
	);
}

function readStoredEnabled(): boolean {
	return safeParse(STORAGE.ENABLED, (raw) => raw !== "false", true);
}

function readSessionTrackIndex(): number {
	if (!readStoredEnabled()) return 0;
	const raw = safeSessionGet(STORAGE.SESSION_TRACK);
	if (raw == null) return 0;
	const i = parseInt(raw, 10);
	return Number.isFinite(i) && i >= 0 && i < BGM_TRACKS.length ? i : 0;
}

function readSessionTime(): number {
	const raw = safeSessionGet(STORAGE.SESSION_TIME);
	if (raw == null) return 0;
	const t = parseFloat(raw);
	return Number.isFinite(t) && t >= 0 ? t : 0;
}

function writeSessionProgress(trackIndex: number, time: number): void {
	safeSessionSet(STORAGE.SESSION_TRACK, String(trackIndex));
	safeSessionSet(STORAGE.SESSION_TIME, String(time));
}

function clearSessionProgress(): void {
	safeSessionRemove(STORAGE.SESSION_TRACK);
	safeSessionRemove(STORAGE.SESSION_TIME);
}

function applyDuckedVolume(
	el: HTMLAudioElement,
	userVolume: number,
	voiceDucking: boolean,
): void {
	el.volume = clamp(userVolume * (voiceDucking ? VOICE_DUCK_MULT : 1), 0, 1);
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

function primeBgmElementAtIndex(el: HTMLAudioElement, index: number): boolean {
	const track = BGM_TRACKS[index];
	if (!track) return false;
	el.pause();
	el.currentTime = 0;
	el.src = track.url;
	el.load();
	return true;
}

/**
 * Hook for managing background music playback with volume control, track skipping, and voice ducking.
 * Handles session persistence, user preferences, and automatic playlist progression.
 * @returns Object containing current track info, volume controls, and playback state
 */
export function useBackgroundMusic() {
	const sessionResume = useMemo(
		() => ({
			track: readSessionTrackIndex(),
			time: readStoredEnabled() ? readSessionTime() : 0,
		}),
		[],
	);

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const trackIndexRef = useRef(sessionResume.track);
	const enabledRef = useRef(readStoredEnabled());
	const userVolumeRef = useRef(readStoredVolume());
	const voiceDuckingRef = useRef(false);
	const volumeRampActiveRef = useRef(false);
	const volumeRampRafRef = useRef(0);
	const hadVoiceActivityRef = useRef(false);

	const cancelVolumeRamp = useCallback(() => {
		if (volumeRampRafRef.current !== 0) {
			cancelAnimationFrame(volumeRampRafRef.current);
			volumeRampRafRef.current = 0;
		}
		volumeRampActiveRef.current = false;
	}, []);

	const syncVolumeUnlessRamping = useCallback((el: HTMLAudioElement) => {
		if (volumeRampActiveRef.current) return;
		applyDuckedVolume(el, userVolumeRef.current, voiceDuckingRef.current);
	}, []);

	const startUnduckVolumeRamp = useCallback(
		(el: HTMLAudioElement) => {
			cancelVolumeRamp();
			const endVol = clamp(userVolumeRef.current, 0, 1);
			const startVol = Math.min(el.volume, endVol);
			if (endVol - startVol < 0.001) {
				el.volume = endVol;
				return;
			}
			volumeRampActiveRef.current = true;
			const t0 = performance.now();
			const step = (now: number) => {
				if (audioRef.current !== el || voiceDuckingRef.current) {
					cancelVolumeRamp();
					applyDuckedVolume(el, userVolumeRef.current, voiceDuckingRef.current);
					return;
				}
				const u = Math.min(1, (now - t0) / VOICE_UNDUCK_RAMP_MS);
				el.volume = clamp(
					startVol + (endVol - startVol) * easeOutCubic(u),
					0,
					1,
				);
				if (u >= 1) {
					volumeRampActiveRef.current = false;
					volumeRampRafRef.current = 0;
					return;
				}
				volumeRampRafRef.current = requestAnimationFrame(step);
			};
			volumeRampRafRef.current = requestAnimationFrame(step);
		},
		[cancelVolumeRamp],
	);

	const [trackIndex, setTrackIndex] = useState(sessionResume.track);
	const [userVolume, setUserVolumeState] = useState(readStoredVolume);
	const [enabled, setEnabled] = useState(readStoredEnabled);
	const [voiceDucking, setVoiceDucking] = useState(false);

	const loadTrack = useCallback(
		(index: number) => {
			cancelVolumeRamp();
			const el = audioRef.current;
			if (!el || !primeBgmElementAtIndex(el, index)) return;
			syncVolumeUnlessRamping(el);
		},
		[cancelVolumeRamp, syncVolumeUnlessRamping],
	);

	const logAudioError = useCallback((context: string, error: Error) => {
		if (import.meta.env.DEV && error.name !== "NotAllowedError") {
			console.warn(`[BGM] ${context}:`, error);
		}
	}, []);

	const tryPlay = useCallback(() => {
		const el = audioRef.current;
		if (!el || !enabledRef.current) return;
		syncVolumeUnlessRamping(el);

		const retryAfterReady = () => {
			el.removeEventListener("canplaythrough", retryAfterReady);
			el.removeEventListener("canplay", retryAfterReady);
			if (audioRef.current !== el || !enabledRef.current) return;
			syncVolumeUnlessRamping(el);
			void el
				.play()
				.catch((e2) => logAudioError("play retry after ready failed", e2));
		};

		void el.play().catch((err) => {
			logAudioError("play failed", err);
			if (el.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
				queueMicrotask(retryAfterReady);
				return;
			}
			el.addEventListener("canplaythrough", retryAfterReady, { once: true });
			el.addEventListener("canplay", retryAfterReady, { once: true });
		});
	}, [syncVolumeUnlessRamping, logAudioError]);

	useEffect(() => {
		enabledRef.current = enabled;
		const el = audioRef.current;
		if (!el) return;
		if (!enabled) {
			el.pause();
			return;
		}
		tryPlay();
	}, [enabled, tryPlay]);

	useEffect(() => {
		userVolumeRef.current = userVolume;
		const el = audioRef.current;
		if (!el) return;
		cancelVolumeRamp();
		applyDuckedVolume(el, userVolume, voiceDuckingRef.current);
	}, [userVolume, cancelVolumeRamp]);

	useEffect(() => {
		voiceDuckingRef.current = voiceDucking;
		const el = audioRef.current;
		if (!el) return;
		if (voiceDucking) {
			cancelVolumeRamp();
			applyDuckedVolume(el, userVolumeRef.current, true);
			hadVoiceActivityRef.current = true;
			return;
		}
		if (hadVoiceActivityRef.current) {
			hadVoiceActivityRef.current = false;
			startUnduckVolumeRamp(el);
		} else {
			syncVolumeUnlessRamping(el);
		}
	}, [
		voiceDucking,
		cancelVolumeRamp,
		startUnduckVolumeRamp,
		syncVolumeUnlessRamping,
	]);

	useEffect(() => {
		return subscribeVoiceActivity((active) => setVoiceDucking(active));
	}, []);

	useEffect(() => {
		const el = audioRef.current;
		if (!el) return;
		let lastFlush = 0;
		const flush = () => {
			if (!enabledRef.current || el.paused) return;
			writeSessionProgress(trackIndexRef.current, el.currentTime);
			lastFlush = Date.now();
		};
		const onTimeUpdate = () => {
			if (Date.now() - lastFlush < SESSION_FLUSH_MS) return;
			flush();
		};
		const onPageHide = () => {
			if (enabledRef.current && !el.paused) {
				writeSessionProgress(trackIndexRef.current, el.currentTime);
			}
		};
		el.addEventListener("timeupdate", onTimeUpdate);
		window.addEventListener("pagehide", onPageHide);
		return () => {
			el.removeEventListener("timeupdate", onTimeUpdate);
			window.removeEventListener("pagehide", onPageHide);
		};
	}, []);

	useEffect(() => {
		const el = audioRef.current;
		if (!el) return;
		const kick = () => {
			if (enabledRef.current) tryPlay();
		};
		queueMicrotask(kick);
		el.addEventListener("canplaythrough", kick, { once: true });
		return () => el.removeEventListener("canplaythrough", kick);
	}, [tryPlay]);

	useLayoutEffect(() => {
		const el = new Audio();
		el.preload = "auto";
		el.setAttribute("playsinline", "");
		el.setAttribute("webkit-playsinline", "");
		audioRef.current = el;
		trackIndexRef.current = sessionResume.track;
		const url = BGM_TRACKS[sessionResume.track]?.url ?? "";
		el.src = url;
		applyDuckedVolume(el, userVolumeRef.current, voiceDuckingRef.current);

		if (sessionResume.time > 0 && url) {
			const onMeta = () => {
				el.removeEventListener("loadedmetadata", onMeta);
				const dur = el.duration;
				if (Number.isFinite(dur) && dur > 0) {
					el.currentTime = Math.min(
						sessionResume.time,
						Math.max(0, dur - 0.05),
					);
				}
			};
			el.addEventListener("loadedmetadata", onMeta);
		}

		const onEnded = () => {
			cancelVolumeRamp();
			const next = (trackIndexRef.current + 1) % BGM_TRACKS.length;
			trackIndexRef.current = next;
			setTrackIndex(next);
			if (!primeBgmElementAtIndex(el, next)) return;
			syncVolumeUnlessRamping(el);
			if (enabledRef.current) tryPlay();
		};

		el.addEventListener("ended", onEnded);
		return () => {
			cancelVolumeRamp();
			el.removeEventListener("ended", onEnded);
			el.pause();
			el.removeAttribute("src");
			el.load();
			audioRef.current = null;
		};
	}, [
		sessionResume.track,
		sessionResume.time,
		cancelVolumeRamp,
		tryPlay,
		syncVolumeUnlessRamping,
	]);

	const setUserVolume = useCallback((v: number) => {
		const clamped = clamp(v, VOLUME.MIN, VOLUME.MAX);
		userVolumeRef.current = clamped;
		setUserVolumeState(clamped);
		try {
			localStorage.setItem(STORAGE.VOLUME, String(clamped));
		} catch {
			/* ignore */
		}
	}, []);

	const toggleEnabled = useCallback(() => {
		setEnabled((prev) => {
			const next = !prev;
			enabledRef.current = next;
			if (!next) clearSessionProgress();
			try {
				localStorage.setItem(STORAGE.ENABLED, String(next));
			} catch {
				/* ignore */
			}
			return next;
		});
	}, []);

	const skipNext = useCallback(() => {
		const next = (trackIndexRef.current + 1) % BGM_TRACKS.length;
		trackIndexRef.current = next;
		setTrackIndex(next);
		loadTrack(next);
		if (enabledRef.current) tryPlay();
	}, [loadTrack, tryPlay]);

	return {
		currentTrackTitle: BGM_TRACKS[trackIndex]?.title ?? "",
		userVolume,
		setUserVolume,
		enabled,
		toggleEnabled,
		skipNext,
		bgmVolumeMin: VOLUME.MIN,
		bgmVolumeMax: VOLUME.MAX,
		bgmVolumeStep: VOLUME.STEP,
	};
}
