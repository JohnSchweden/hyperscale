/** Phase 04: Browser-safe stress audio engine using Web Audio API primitives */

const STRESS_BPM = 90;
const HEARTBEAT_BASE_FREQ = 60;
const HEARTBEAT_DURATION = 0.08;
const ALERT_FREQ = 800;
const ALERT_DURATION = 0.15;
const GAIN_HEARTBEAT_STRESS = 0.12;
const GAIN_ALERT = 0.08;

/** Volume ramp over last N seconds of countdown */
const ESCALATION_RAMP_SEC = 8;
const ESCALATION_MAX_MULT = 1.5;

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

function computeVolumeMultiplier(config: HeartbeatConfig): number {
	const { countdownValue, countdownSec } = config;
	if (
		countdownSec == null ||
		countdownSec <= 0 ||
		countdownValue == null ||
		countdownValue > countdownSec
	)
		return 1;

	const rampStart = Math.min(ESCALATION_RAMP_SEC, countdownSec * 0.3);
	if (countdownValue > rampStart) return 1;

	const progress = 1 - countdownValue / rampStart;
	return 1 + progress * ESCALATION_MAX_MULT;
}

export function createPressureAudioSession(): PressureAudioSession {
	const ctx = getOrCreateContext();
	let heartbeatOsc: OscillatorNode | null = null;
	let alertOsc: OscillatorNode | null = null;
	let alertGain: GainNode | null = null;
	let heartbeatIntervalId: ReturnType<typeof setInterval> | null = null;
	let currentConfig: HeartbeatConfig = {};

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
		if (ctx.state === "suspended") {
			await ctx.resume();
		}
		const mult = computeVolumeMultiplier(currentConfig);
		const peakGain = GAIN_HEARTBEAT_STRESS * mult;

		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "sine";
		osc.frequency.value = HEARTBEAT_BASE_FREQ;
		gain.gain.setValueAtTime(0, ctx.currentTime);
		gain.gain.linearRampToValueAtTime(peakGain, ctx.currentTime + 0.01);
		gain.gain.linearRampToValueAtTime(0, ctx.currentTime + HEARTBEAT_DURATION);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start(ctx.currentTime);
		osc.stop(ctx.currentTime + HEARTBEAT_DURATION);
	}

	async function startHeartbeatAsync(config: HeartbeatConfig): Promise<void> {
		stop();
		if (ctx.state === "suspended") {
			await ctx.resume();
		}
		currentConfig = config;
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
		if (ctx.state === "suspended") {
			await ctx.resume();
		}
		alertOsc = ctx.createOscillator();
		alertGain = ctx.createGain();
		alertOsc.type = "sine";
		alertOsc.frequency.value = ALERT_FREQ;
		alertGain.gain.setValueAtTime(0, ctx.currentTime);
		alertGain.gain.linearRampToValueAtTime(GAIN_ALERT, ctx.currentTime + 0.02);
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
