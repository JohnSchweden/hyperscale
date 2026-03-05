/** Apollo-style radio / walkie-talkie effect for voice playback */

const QUINDAR_INTRO_HZ = 2525;
const QUINDAR_OUTRO_HZ = 2475;
const QUINDAR_DURATION_S = 0.25;
const QUINDAR_GAIN = 0.06;
const NOISE_GAIN = 0.03;
const NOISE_DURATION_S = 1;
const VOICE_HIGHPASS_HZ = 400;
const VOICE_LOWPASS_HZ = 2400;

function fillPinkNoiseBuffer(channel: Float32Array): void {
	let b0 = 0,
		b1 = 0,
		b2 = 0,
		b3 = 0,
		b4 = 0,
		b5 = 0,
		b6 = 0;
	for (let i = 0; i < channel.length; i++) {
		const white = Math.random() * 2 - 1;
		b0 = 0.99886 * b0 + white * 0.0555179;
		b1 = 0.99332 * b1 + white * 0.0750759;
		b2 = 0.969 * b2 + white * 0.153852;
		b3 = 0.8665 * b3 + white * 0.3104856;
		b4 = 0.55 * b4 + white * 0.5329522;
		b5 = -0.7616 * b5 - white * 0.016898;
		channel[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
		b6 = white * 0.115926;
	}
}

function playQuindarTone(
	ctx: AudioContext,
	frequency: number,
	startTime: number,
): void {
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = "sine";
	osc.frequency.value = frequency;
	gain.gain.value = QUINDAR_GAIN;
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.start(startTime);
	osc.stop(startTime + QUINDAR_DURATION_S);
}

export interface RadioSessionOptions {
	/** Delay (seconds) before intro beep and noise start */
	delaySeconds: number;
}

export interface RadioSession {
	/** Connect voice sources (AudioBufferSourceNode or MediaElementSourceNode) here */
	voiceInput: BiquadFilterNode;
	/** Schedules noise and intro. Returns time when first voice chunk can start. */
	start(): number;
	/** Returns start time for next chunk (clamped to now if late). Advance internal cursor. */
	scheduleChunk(duration: number): number;
	/** Stop noise immediately, no outro. Use when user interrupts. */
	stop(): void;
	/** Play outro beep and stop noise. Resolves when outro finishes. */
	end(): Promise<void>;
	/** AudioContext used by this session */
	readonly context: AudioContext;
}

/**
 * Create a radio-effect session: band-limited voice, pink noise, Quindar intro/outro.
 */
export function createRadioSession(
	ctx: AudioContext,
	options: RadioSessionOptions,
): RadioSession {
	const { delaySeconds } = options;

	const voiceHighpass = ctx.createBiquadFilter();
	voiceHighpass.type = "highpass";
	voiceHighpass.frequency.value = VOICE_HIGHPASS_HZ;
	const voiceLowpass = ctx.createBiquadFilter();
	voiceLowpass.type = "lowpass";
	voiceLowpass.frequency.value = VOICE_LOWPASS_HZ;
	voiceHighpass.connect(voiceLowpass);
	voiceLowpass.connect(ctx.destination);

	const noiseBuffer = ctx.createBuffer(
		1,
		ctx.sampleRate * NOISE_DURATION_S,
		ctx.sampleRate,
	);
	fillPinkNoiseBuffer(noiseBuffer.getChannelData(0));
	const noiseHighpass = ctx.createBiquadFilter();
	noiseHighpass.type = "highpass";
	noiseHighpass.frequency.value = VOICE_HIGHPASS_HZ;
	const noiseLowpass = ctx.createBiquadFilter();
	noiseLowpass.type = "lowpass";
	noiseLowpass.frequency.value = VOICE_LOWPASS_HZ;
	const noiseGainNode = ctx.createGain();
	noiseGainNode.gain.value = NOISE_GAIN;
	const noiseSource = ctx.createBufferSource();
	noiseSource.buffer = noiseBuffer;
	noiseSource.loop = true;
	noiseSource.connect(noiseHighpass);
	noiseHighpass.connect(noiseLowpass);
	noiseLowpass.connect(noiseGainNode);
	noiseGainNode.connect(ctx.destination);

	let nextVoiceStartTime = 0;

	return {
		voiceInput: voiceHighpass,
		context: ctx,

		start(): number {
			const now = ctx.currentTime;
			const introStart = now + delaySeconds;
			const introEnd = introStart + QUINDAR_DURATION_S;
			noiseSource.start(introStart);
			playQuindarTone(ctx, QUINDAR_INTRO_HZ, introStart);
			nextVoiceStartTime = introEnd;
			return introEnd;
		},

		scheduleChunk(duration: number): number {
			const now = ctx.currentTime;
			const t = nextVoiceStartTime < now ? now : nextVoiceStartTime;
			nextVoiceStartTime = t + duration;
			return t;
		},

		stop(): void {
			try {
				noiseSource.stop(ctx.currentTime);
			} catch {
				/* already stopped */
			}
		},

		async end(): Promise<void> {
			try {
				noiseSource.stop(ctx.currentTime);
			} catch {
				/* already stopped */
			}
			return new Promise((resolve) => {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = "sine";
				osc.frequency.value = QUINDAR_OUTRO_HZ;
				gain.gain.value = QUINDAR_GAIN;
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.onended = () => resolve();
				osc.start(ctx.currentTime);
				osc.stop(ctx.currentTime + QUINDAR_DURATION_S);
			});
		},
	};
}
