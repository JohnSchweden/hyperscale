/** Phase 04: Browser-safe stress audio engine using Web Audio API primitives */

const HEARTBEAT_BPM = 90;
const HEARTBEAT_BASE_FREQ = 60;
const HEARTBEAT_DURATION = 0.08;
const ALERT_FREQ = 800;
const ALERT_DURATION = 0.15;
const GAIN_HEARTBEAT = 0.12;
const GAIN_ALERT = 0.08;

export interface PressureAudioSession {
	startHeartbeat(): void;
	startAlert(): void;
	stop(): void;
	readonly context: AudioContext;
}

function getOrCreateContext(): AudioContext {
	const Ctx =
		typeof window !== "undefined" &&
		(window.AudioContext ??
			(window as Window & { webkitAudioContext?: typeof AudioContext })
				.webkitAudioContext);
	if (!Ctx) throw new Error("AudioContext not supported");
	return new Ctx();
}

/**
 * Create a pressure audio session. Synthesizes heartbeat and alert cues via
 * Web Audio oscillators. Single session — calling start while already running
 * does not layer duplicate loops.
 */
export function createPressureAudioSession(): PressureAudioSession {
	const ctx = getOrCreateContext();
	let heartbeatOsc: OscillatorNode | null = null;
	let alertOsc: OscillatorNode | null = null;
	let alertGain: GainNode | null = null;
	let heartbeatIntervalId: ReturnType<typeof setInterval> | null = null;

	function stop(): void {
		if (heartbeatIntervalId) {
			clearInterval(heartbeatIntervalId);
			heartbeatIntervalId = null;
		}
		if (heartbeatOsc) {
			try {
				heartbeatOsc.stop(ctx.currentTime);
			} catch {
				/* already stopped */
			}
			heartbeatOsc = null;
		}
		if (alertOsc) {
			try {
				alertOsc.stop(ctx.currentTime);
			} catch {
				/* already stopped */
			}
			alertOsc = null;
			alertGain = null;
		}
	}

	async function playPulse(): Promise<void> {
		if (ctx.state === "suspended") {
			await ctx.resume();
		}
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "sine";
		osc.frequency.value = HEARTBEAT_BASE_FREQ;
		gain.gain.setValueAtTime(0, ctx.currentTime);
		gain.gain.linearRampToValueAtTime(GAIN_HEARTBEAT, ctx.currentTime + 0.01);
		gain.gain.linearRampToValueAtTime(0, ctx.currentTime + HEARTBEAT_DURATION);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start(ctx.currentTime);
		osc.stop(ctx.currentTime + HEARTBEAT_DURATION);
	}

	async function startHeartbeatAsync(): Promise<void> {
		stop();
		if (ctx.state === "suspended") {
			await ctx.resume();
		}
		const intervalMs = 60000 / HEARTBEAT_BPM;
		heartbeatIntervalId = setInterval(() => void playPulse(), intervalMs);
		await playPulse();
	}

	function startHeartbeat(): void {
		void startHeartbeatAsync();
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
		startAlert,
		stop,
		context: ctx,
	};
}
