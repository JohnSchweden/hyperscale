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

const BGM_VOLUME_STORAGE_KEY = "k-maru-bgm-volume";
const BGM_ENABLED_STORAGE_KEY = "k-maru-bgm-enabled";

/** Same-tab reload: restore track + position (sessionStorage clears when the tab closes). */
const BGM_SESSION_TRACK_KEY = "k-maru-bgm-session-track";
const BGM_SESSION_TIME_KEY = "k-maru-bgm-session-time";

const BGM_VOLUME_DEFAULT = 0.2;
const BGM_VOLUME_MIN = 0;
const BGM_VOLUME_MAX = 1;
const BGM_VOLUME_STEP = 0.05;

const SESSION_FLUSH_MS = 2000;

/** Multiply user BGM volume while TTS is playing (no pause). */
const VOICE_DUCK_MULT = 0.2;

/** Ramp BGM from duck level back to user volume after TTS ends. */
const VOICE_UNDUCK_RAMP_MS = 1200;

function readStoredVolume(): number {
	if (typeof window === "undefined") return BGM_VOLUME_DEFAULT;
	try {
		const raw = localStorage.getItem(BGM_VOLUME_STORAGE_KEY);
		if (raw == null) return BGM_VOLUME_DEFAULT;
		const n = parseFloat(raw);
		if (!Number.isFinite(n)) return BGM_VOLUME_DEFAULT;
		return Math.min(BGM_VOLUME_MAX, Math.max(BGM_VOLUME_MIN, n));
	} catch {
		return BGM_VOLUME_DEFAULT;
	}
}

function readStoredEnabled(): boolean {
	if (typeof window === "undefined") return true;
	try {
		const raw = localStorage.getItem(BGM_ENABLED_STORAGE_KEY);
		if (raw === "false") return false;
		return true;
	} catch {
		return true;
	}
}

function readSessionTrackIndex(): number {
	if (typeof window === "undefined") return 0;
	if (!readStoredEnabled()) return 0;
	try {
		const raw = sessionStorage.getItem(BGM_SESSION_TRACK_KEY);
		if (raw == null) return 0;
		const i = parseInt(raw, 10);
		if (!Number.isFinite(i) || i < 0 || i >= BGM_TRACKS.length) return 0;
		return i;
	} catch {
		return 0;
	}
}

function readSessionTime(): number {
	if (typeof window === "undefined") return 0;
	try {
		const raw = sessionStorage.getItem(BGM_SESSION_TIME_KEY);
		if (raw == null) return 0;
		const t = parseFloat(raw);
		return Number.isFinite(t) && t >= 0 ? t : 0;
	} catch {
		return 0;
	}
}

function writeSessionProgress(trackIndex: number, time: number): void {
	if (typeof window === "undefined") return;
	try {
		sessionStorage.setItem(BGM_SESSION_TRACK_KEY, String(trackIndex));
		sessionStorage.setItem(BGM_SESSION_TIME_KEY, String(time));
	} catch {
		/* quota / private mode */
	}
}

function clearSessionProgress(): void {
	if (typeof window === "undefined") return;
	try {
		sessionStorage.removeItem(BGM_SESSION_TRACK_KEY);
		sessionStorage.removeItem(BGM_SESSION_TIME_KEY);
	} catch {
		/* ignore */
	}
}

function applyDuckedVolume(
	el: HTMLAudioElement,
	userVolume: number,
	voiceDucking: boolean,
): void {
	const mult = voiceDucking ? VOICE_DUCK_MULT : 1;
	el.volume = Math.min(1, Math.max(0, userVolume * mult));
}

/** easeOutCubic: quick start, gentle landing toward target volume */
function easeOutCubic(t: number): number {
	return 1 - (1 - t) ** 3;
}

/** Swap `el` to the given playlist index (pause, reset, src, load). Returns whether a track exists. */
function primeBgmElementAtIndex(el: HTMLAudioElement, index: number): boolean {
	const track = BGM_TRACKS[index];
	if (!track) return false;
	el.pause();
	el.currentTime = 0;
	el.src = track.url;
	el.load();
	return true;
}

export function useBackgroundMusic() {
	/** One snapshot per mount so we do not re-read session every render. */
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

	/** Apply user + ducking to the element unless an unduck ramp is driving `el.volume`. */
	const syncVolumeUnlessRamping = useCallback((el: HTMLAudioElement) => {
		if (volumeRampActiveRef.current) return;
		applyDuckedVolume(el, userVolumeRef.current, voiceDuckingRef.current);
	}, []);

	const startUnduckVolumeRamp = useCallback(
		(el: HTMLAudioElement) => {
			cancelVolumeRamp();
			const endVol = Math.min(1, Math.max(0, userVolumeRef.current));
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
				const elapsed = now - t0;
				const u = Math.min(1, elapsed / VOICE_UNDUCK_RAMP_MS);
				el.volume = Math.min(
					1,
					startVol + (endVol - startVol) * easeOutCubic(u),
				);
				if (u >= 1) {
					el.volume = endVol;
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
	const [userVolume, setUserVolumeState] = useState(() => readStoredVolume());
	const [enabled, setEnabled] = useState(() => readStoredEnabled());
	const [voiceDucking, setVoiceDucking] = useState(false);

	const loadTrack = useCallback(
		(index: number) => {
			cancelVolumeRamp();
			const el = audioRef.current;
			if (!el) return;
			if (!primeBgmElementAtIndex(el, index)) return;
			syncVolumeUnlessRamping(el);
		},
		[cancelVolumeRamp, syncVolumeUnlessRamping],
	);

	const tryPlay = useCallback(() => {
		const el = audioRef.current;
		if (!el || !enabledRef.current) return;
		syncVolumeUnlessRamping(el);
		const retryAfterReady = () => {
			el.removeEventListener("canplaythrough", retryAfterReady);
			el.removeEventListener("canplay", retryAfterReady);
			if (audioRef.current !== el || !enabledRef.current) return;
			syncVolumeUnlessRamping(el);
			void el.play().catch((e2) => {
				if (import.meta.env.DEV) {
					console.warn("[BGM] play retry after ready failed:", e2);
				}
			});
		};
		void el.play().catch((err) => {
			if (import.meta.env.DEV) {
				console.warn("[BGM] play failed:", err);
			}
			/** If media is already buffered, canplay may have fired before we subscribed. */
			if (el.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
				queueMicrotask(retryAfterReady);
				return;
			}
			el.addEventListener("canplaythrough", retryAfterReady, { once: true });
			el.addEventListener("canplay", retryAfterReady, { once: true });
		});
	}, [syncVolumeUnlessRamping]);

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
		return subscribeVoiceActivity((active) => {
			setVoiceDucking(active);
		});
	}, []);

	/** Throttled progress + pagehide so reload can resume same track/time in this tab. */
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
			const now = Date.now();
			if (now - lastFlush < SESSION_FLUSH_MS) return;
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

	/**
	 * Autoplay on load: call play() as soon as the element exists and again at canplaythrough.
	 * Many browsers block unmuted autoplay until the user has interacted with the origin before;
	 * there is no standards-compliant way to force audible playback with zero prior engagement.
	 */
	useEffect(() => {
		const el = audioRef.current;
		if (!el) return;
		const kick = () => {
			if (!enabledRef.current) return;
			tryPlay();
		};
		queueMicrotask(kick);
		el.addEventListener("canplaythrough", kick, { once: true });
		return () => {
			el.removeEventListener("canplaythrough", kick);
		};
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
			const resumeAt = sessionResume.time;
			const onMeta = () => {
				el.removeEventListener("loadedmetadata", onMeta);
				const dur = el.duration;
				if (Number.isFinite(dur) && dur > 0) {
					el.currentTime = Math.min(resumeAt, Math.max(0, dur - 0.05));
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
			if (enabledRef.current) {
				tryPlay();
			}
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
		const clamped = Math.min(BGM_VOLUME_MAX, Math.max(BGM_VOLUME_MIN, v));
		userVolumeRef.current = clamped;
		setUserVolumeState(clamped);
		try {
			localStorage.setItem(BGM_VOLUME_STORAGE_KEY, String(clamped));
		} catch {
			/* ignore */
		}
	}, []);

	const toggleEnabled = useCallback(() => {
		setEnabled((prev) => {
			const next = !prev;
			enabledRef.current = next;
			if (!next) {
				clearSessionProgress();
			}
			try {
				localStorage.setItem(BGM_ENABLED_STORAGE_KEY, String(next));
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

	const currentTrackTitle = BGM_TRACKS[trackIndex]?.title ?? "";

	return {
		currentTrackTitle,
		userVolume,
		setUserVolume,
		enabled,
		toggleEnabled,
		skipNext,
		bgmVolumeMin: BGM_VOLUME_MIN,
		bgmVolumeMax: BGM_VOLUME_MAX,
		bgmVolumeStep: BGM_VOLUME_STEP,
	};
}
