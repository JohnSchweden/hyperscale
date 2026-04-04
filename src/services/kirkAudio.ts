/** Phase 07: Kirk Easter Egg — synthesized glitch/crash audio using Web Audio API */

/**
 * Level 1 subtle "something happened" tone — played on the first refusal.
 * Quick sawtooth frequency sweep over 144ms at low volume.
 * Guard: no-ops if AudioContext is suspended.
 */
export function playKirkGlitchTone(ctx: AudioContext): void {
	if (ctx.state === "suspended") return;
	const t0 = ctx.currentTime;

	// Quick frequency sweep: digital hiccup
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = "sawtooth";
	osc.frequency.setValueAtTime(200, t0);
	osc.frequency.exponentialRampToValueAtTime(800, t0 + 0.06);
	osc.frequency.exponentialRampToValueAtTime(100, t0 + 0.12);
	gain.gain.setValueAtTime(0.06, t0);
	gain.gain.linearRampToValueAtTime(0, t0 + 0.144);
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.start(t0);
	osc.stop(t0 + 0.144);
}

/**
 * Level 2 intense digital crash — played on the second refusal.
 * White noise burst (electrical short) + descending square oscillator (system powering down).
 * Guard: no-ops if AudioContext is suspended.
 */
export function playKirkCrashSound(ctx: AudioContext): void {
	if (ctx.state === "suspended") return;
	const t0 = ctx.currentTime;
	const duration = 0.8;

	// White noise burst with exponential decay envelope
	const bufferSize = Math.ceil(ctx.sampleRate * duration);
	const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < bufferSize; i++) {
		data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
	}
	const noise = ctx.createBufferSource();
	noise.buffer = buffer;

	// Descending square oscillator: system powering down
	const osc = ctx.createOscillator();
	osc.type = "square";
	osc.frequency.setValueAtTime(1200, t0);
	osc.frequency.exponentialRampToValueAtTime(40, t0 + duration);

	const noiseGain = ctx.createGain();
	noiseGain.gain.setValueAtTime(0.12, t0);
	noiseGain.gain.linearRampToValueAtTime(0, t0 + duration);

	const oscGain = ctx.createGain();
	oscGain.gain.setValueAtTime(0.04, t0);
	oscGain.gain.linearRampToValueAtTime(0, t0 + duration);

	noise.connect(noiseGain);
	osc.connect(oscGain);
	noiseGain.connect(ctx.destination);
	oscGain.connect(ctx.destination);

	noise.start(t0);
	osc.start(t0);
	noise.stop(t0 + duration);
	osc.stop(t0 + duration);
}
