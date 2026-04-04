/** Phase 04: Browser-safe stress audio engine using Web Audio API primitives */

import { getAudioPath } from "./audioUtils";

const STRESS_BPM = 90;
const HEARTBEAT_BASE_FREQ = 60;
const HEARTBEAT_DURATION = 0.08;
const ALERT_FREQ = 800;
const ALERT_DURATION = 0.15;
const GAIN_HEARTBEAT_STRESS = 0.132;
const GAIN_ALERT = 0.08;
const GAIN_ALERT_ANDROID = 0.35;
/** Android: sample playback (avoids synthesis volume issues); fallback gain for oscillators. */
const GAIN_HEARTBEAT_ANDROID = 0.55;
const GAIN_HEARTBEAT_ANDROID_MULT = 1.35; // was 1.5, 10% quieter
const HARMONIC_2_AMP = 0.15;
const HARMONIC_3_AMP = 0.05;
/** [freq, amp] for heartbeat synthesis (fundamental + harmonics). */
const HEARTBEAT_HARMONICS: readonly [number, number][] = [
	[HEARTBEAT_BASE_FREQ, 1],
	[HEARTBEAT_BASE_FREQ * 2, HARMONIC_2_AMP],
	[HEARTBEAT_BASE_FREQ * 3, HARMONIC_3_AMP],
];
/** Android heartbeat sample — Mixkit "Human single heart beat" CC0, ~1s. Uses Opus for supported browsers (92%), MP3 fallback (8%). */
const HEARTBEAT_SAMPLE_URL = getAudioPath("/audio/stress/heartbeat");

let cachedHeartbeatBuffer: AudioBuffer | null = null;

function isAndroid(): boolean {
	return (
		typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent)
	);
}

/** Progressive volume ramp: start (1x) → end (1.65x, 10% louder than prior 1.5x) */
const ESCALATION_END_MULT = 1.5 * 1.1; // 1.65
/** When no countdown: ramp over this many seconds from session start */
const RAMP_DURATION_NO_COUNTDOWN = 30;

export interface HeartbeatConfig {
	countdownValue?: number;
	countdownSec?: number;
}

export interface PressureAudioSession {
	startHeartbeat(config: HeartbeatConfig): void;
	updateHeartbeat(config: HeartbeatConfig): void;
	startAlert(): void;
	stop(): void;
	readonly context: AudioContext;
}

function getOrCreateContext(): AudioContext {
	if (typeof window === "undefined")
		throw new Error("AudioContext not supported");
	const Ctx =
		window.AudioContext ??
		(window as Window & { webkitAudioContext?: typeof AudioContext })
			.webkitAudioContext;
	if (!Ctx) throw new Error("AudioContext not supported");
	return new Ctx();
}

function tryStopOscillator(osc: OscillatorNode | null, when: number): void {
	if (!osc) return;
	try {
		osc.stop(when);
	} catch {
		/* already stopped */
	}
}

function addHeartbeatHarmonics(
	ctx: AudioContext,
	masterGain: GainNode,
	t0: number,
	duration: number,
): void {
	for (const [freq, amp] of HEARTBEAT_HARMONICS) {
		const osc = ctx.createOscillator();
		const g = ctx.createGain();
		osc.type = "sine";
		osc.frequency.value = freq;
		g.gain.setValueAtTime(amp, t0);
		osc.connect(g);
		g.connect(masterGain);
		osc.start(t0);
		osc.stop(t0 + duration);
	}
}

/** Simulator countdown (3, 2, 1) — minimal breath. */
const COUNTDOWN_DURATION = 0.035;
const COUNTDOWN_GAIN = 0.018;
const COUNTDOWN_ATTACK = 0.005;
const COUNTDOWN_FREQS: Record<1 | 2 | 3, number> = { 3: 200, 2: 235, 1: 275 };

/** Start tone — faint pulse, distinct from countdown 1 (275 Hz). */
const START_DURATION = 0.055;
const START_GAIN = 0.022;
const START_FREQ = 385;
const START_ATTACK = 0.01;

let countdownCtx: AudioContext | null = null;
export function getCountdownContext(): AudioContext | null {
	if (typeof window === "undefined") return null;
	if (!countdownCtx) countdownCtx = getOrCreateContext();
	return countdownCtx;
}
/** Call from user gesture (e.g. role select) before countdown starts. */
export function prepareCountdownAudio(): void {
	const ctx = getCountdownContext();
	if (ctx?.state === "suspended") void ctx.resume();
}
/** Play countdown beep for value 3, 2, or 1. No-op if context suspended. */
export function playCountdownBeep(value: 1 | 2 | 3): void {
	const ctx = getCountdownContext();
	if (!ctx || ctx.state === "suspended") return;
	const freq = COUNTDOWN_FREQS[value];
	const t0 = ctx.currentTime;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = "sine";
	osc.frequency.value = freq;
	gain.gain.setValueAtTime(0, t0);
	gain.gain.linearRampToValueAtTime(COUNTDOWN_GAIN, t0 + COUNTDOWN_ATTACK);
	gain.gain.linearRampToValueAtTime(0, t0 + COUNTDOWN_DURATION);
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.start(t0);
	osc.stop(t0 + COUNTDOWN_DURATION);
}
/** Play "Start" tone (countdown 0). No-op if context suspended. */
export function playCountdownStart(): void {
	const ctx = getCountdownContext();
	if (!ctx || ctx.state === "suspended") return;
	const t0 = ctx.currentTime;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = "sine";
	osc.frequency.value = START_FREQ;
	gain.gain.setValueAtTime(0, t0);
	gain.gain.linearRampToValueAtTime(START_GAIN, t0 + START_ATTACK);
	gain.gain.linearRampToValueAtTime(0, t0 + START_DURATION);
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.start(t0);
	osc.stop(t0 + START_DURATION);
}

/** Short unlock pulse for Android Chrome: first audio must run in user gesture. */
export function playUnlockPulse(ctx: AudioContext): void {
	const unlockGain =
		(isAndroid()
			? GAIN_HEARTBEAT_ANDROID * GAIN_HEARTBEAT_ANDROID_MULT
			: GAIN_HEARTBEAT_STRESS) * 0.5;

	if (isAndroid() && cachedHeartbeatBuffer) {
		const src = ctx.createBufferSource();
		src.buffer = cachedHeartbeatBuffer;
		const gain = ctx.createGain();
		gain.gain.setValueAtTime(unlockGain, ctx.currentTime);
		src.connect(gain);
		gain.connect(ctx.destination);
		src.start(0);
		src.stop(Math.min(0.15, cachedHeartbeatBuffer.duration));
	} else if (isAndroid()) {
		const masterGain = ctx.createGain();
		masterGain.gain.setValueAtTime(unlockGain, ctx.currentTime);
		masterGain.connect(ctx.destination);
		addHeartbeatHarmonics(ctx, masterGain, ctx.currentTime, 0.05);
	} else {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "sine";
		osc.frequency.value = HEARTBEAT_BASE_FREQ;
		gain.gain.setValueAtTime(unlockGain, ctx.currentTime);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start(0);
		osc.stop(0.05);
	}
}

/**
 * Progressive volume multiplier: smooth ramp from 1 at start to ESCALATION_END_MULT at end.
 * - With countdown: ramp over full countdown (first beat to last).
 * - Without countdown: ramp over RAMP_DURATION_NO_COUNTDOWN seconds from session start.
 */
function computeVolumeMultiplier(
	config: HeartbeatConfig,
	currentTime: number,
	heartbeatStartTime: number,
): number {
	const { countdownValue, countdownSec } = config;
	const elapsed = currentTime - heartbeatStartTime;

	let progress: number;
	if (
		countdownSec != null &&
		countdownSec > 0 &&
		countdownValue != null &&
		countdownValue >= 0 &&
		countdownValue <= countdownSec
	) {
		// Countdown: full ramp from first beat (progress=0) to last (progress=1)
		progress = 1 - countdownValue / countdownSec;
	} else {
		// No countdown: ramp over fixed duration from session start
		progress = Math.min(1, Math.max(0, elapsed / RAMP_DURATION_NO_COUNTDOWN));
	}

	return 1 + progress * (ESCALATION_END_MULT - 1);
}

async function loadHeartbeatSample(
	ctx: AudioContext,
): Promise<AudioBuffer | null> {
	try {
		const res = await fetch(HEARTBEAT_SAMPLE_URL);
		if (!res.ok) return null;
		const buf = await res.arrayBuffer();
		return await ctx.decodeAudioData(buf);
	} catch {
		return null;
	}
}

export function createPressureAudioSession(): PressureAudioSession {
	const ctx = getOrCreateContext();
	let heartbeatOsc: OscillatorNode | null = null;
	let alertOsc: OscillatorNode | null = null;
	let alertGain: GainNode | null = null;
	let heartbeatIntervalId: ReturnType<typeof setInterval> | null = null;
	let currentConfig: HeartbeatConfig = {};
	let heartbeatBuffer: AudioBuffer | null = null;
	let heartbeatStartTime = 0;

	if (isAndroid()) {
		void loadHeartbeatSample(ctx).then((b) => {
			heartbeatBuffer = b;
			cachedHeartbeatBuffer = b;
		});
	}

	function stop(): void {
		if (heartbeatIntervalId) {
			clearInterval(heartbeatIntervalId);
			heartbeatIntervalId = null;
		}
		const t = ctx.currentTime;
		tryStopOscillator(heartbeatOsc, t);
		heartbeatOsc = null;
		tryStopOscillator(alertOsc, t);
		alertOsc = null;
		alertGain = null;
	}

	async function playPulse(): Promise<void> {
		if (ctx.state === "suspended") return;
		const mult = computeVolumeMultiplier(
			currentConfig,
			ctx.currentTime,
			heartbeatStartTime,
		);
		const baseGain = isAndroid()
			? GAIN_HEARTBEAT_ANDROID * GAIN_HEARTBEAT_ANDROID_MULT * mult
			: GAIN_HEARTBEAT_STRESS * mult;
		const t0 = ctx.currentTime;

		if (isAndroid() && heartbeatBuffer) {
			const src = ctx.createBufferSource();
			src.buffer = heartbeatBuffer;
			const gain = ctx.createGain();
			gain.gain.setValueAtTime(baseGain, t0);
			src.connect(gain);
			gain.connect(ctx.destination);
			src.start(t0);
			const clipDur = Math.min(0.15, heartbeatBuffer.duration);
			src.stop(t0 + clipDur);
		} else if (isAndroid()) {
			const masterGain = ctx.createGain();
			masterGain.gain.setValueAtTime(0, t0);
			masterGain.gain.linearRampToValueAtTime(baseGain, t0 + 0.01);
			masterGain.gain.linearRampToValueAtTime(0, t0 + HEARTBEAT_DURATION);
			masterGain.connect(ctx.destination);
			addHeartbeatHarmonics(ctx, masterGain, t0, HEARTBEAT_DURATION);
		} else {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sine";
			osc.frequency.value = HEARTBEAT_BASE_FREQ;
			gain.gain.setValueAtTime(0, t0);
			gain.gain.linearRampToValueAtTime(baseGain, t0 + 0.01);
			gain.gain.linearRampToValueAtTime(0, t0 + HEARTBEAT_DURATION);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start(t0);
			osc.stop(t0 + HEARTBEAT_DURATION);
		}
	}

	async function startHeartbeatAsync(config: HeartbeatConfig): Promise<void> {
		stop();
		// Don't await ctx.resume() — Chrome blocks when not in user gesture.
		// Context is resumed by usePressureAudio on first touch/click.
		// Interval runs; playPulse no-ops when suspended until first gesture.
		currentConfig = config;
		heartbeatStartTime = ctx.currentTime;
		const intervalMs = 60000 / STRESS_BPM;
		heartbeatIntervalId = setInterval(() => void playPulse(), intervalMs);
		await playPulse();
	}

	function startHeartbeat(config: HeartbeatConfig): void {
		void startHeartbeatAsync(config);
	}

	function updateHeartbeat(config: HeartbeatConfig): void {
		if (!heartbeatIntervalId) {
			startHeartbeat(config);
			return;
		}
		currentConfig = config;
	}

	async function startAlertAsync(): Promise<void> {
		stop();
		if (ctx.state === "suspended") return;
		const alertGainVal = isAndroid() ? GAIN_ALERT_ANDROID : GAIN_ALERT;
		alertOsc = ctx.createOscillator();
		alertGain = ctx.createGain();
		alertOsc.type = "sine";
		alertOsc.frequency.value = ALERT_FREQ;
		alertGain.gain.setValueAtTime(0, ctx.currentTime);
		alertGain.gain.linearRampToValueAtTime(
			alertGainVal,
			ctx.currentTime + 0.02,
		);
		alertGain.gain.linearRampToValueAtTime(0, ctx.currentTime + ALERT_DURATION);
		alertOsc.connect(alertGain);
		alertGain.connect(ctx.destination);
		alertOsc.start(ctx.currentTime);
		alertOsc.stop(ctx.currentTime + ALERT_DURATION);
		alertOsc.onended = () => {
			alertOsc = null;
			alertGain = null;
		};
	}

	function startAlert(): void {
		void startAlertAsync();
	}

	return {
		startHeartbeat,
		updateHeartbeat,
		startAlert,
		stop,
		context: ctx,
	};
}
