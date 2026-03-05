/**
 * AudioWorklet Processor for Streaming PCM Playback
 *
 * Resamples 24kHz (Gemini Live API) to 48kHz (browser) to prevent double-speed playback.
 *
 * Usage:
 * 1. Load: audioContext.audioWorklet.addModule('/audio-processor.worklet.js')
 * 2. Create node: new AudioWorkletNode(audioContext, 'streaming-audio-processor')
 * 3. Send PCM data: workletNode.port.postMessage({ type: 'chunk', data: float32Array })
 */

class StreamingAudioProcessor extends AudioWorkletProcessor {
	constructor() {
		super();
		this._buffer = [];
		this._maxBufferSize = 10;
		this._isPlaying = false;
		this._chunkPosition = 0;
		console.log("[AudioWorklet] StreamingAudioProcessor initialized");

		// Listen for messages from main thread
		this.port.onmessage = (event) => {
			const { type, data } = event.data;

			if (type === "chunk" && data) {
				this._addChunk(resample24to48(data));
			} else if (type === "clear") {
				// Clear buffer (for new stream)
				this._buffer = [];
				console.log("[AudioWorklet] Buffer cleared");
			} else if (type === "flush") {
				// Flush remaining data and stop
				this._buffer = [];
				console.log("[AudioWorklet] Buffer flushed");
			}
		};
	}

	static get parameterDescriptors() {
		return [];
	}

	_addChunk(chunk) {
		if (this._buffer.length >= this._maxBufferSize) {
			this._buffer.shift();
			console.warn("[AudioWorklet] Buffer full, dropping oldest chunk");
		}
		this._buffer.push(chunk);
		this._isPlaying = true;
	}

	process(_inputs, outputs, _parameters) {
		const output = outputs[0];
		const outputChannel = output[0];
		if (!outputChannel) return true;

		let samplesNeeded = outputChannel.length;
		let outputIndex = 0;

		while (samplesNeeded > 0 && this._buffer.length > 0) {
			const currentChunk = this._buffer[0];
			const remainingInChunk = currentChunk.length - this._chunkPosition;

			if (remainingInChunk > samplesNeeded) {
				outputChannel.set(
					currentChunk.subarray(
						this._chunkPosition,
						this._chunkPosition + samplesNeeded,
					),
					outputIndex,
				);
				this._chunkPosition += samplesNeeded;
				samplesNeeded = 0;
			} else {
				outputChannel.set(
					currentChunk.subarray(this._chunkPosition),
					outputIndex,
				);
				samplesNeeded -= remainingInChunk;
				outputIndex += remainingInChunk;
				this._buffer.shift();
				this._chunkPosition = 0;
			}
		}

		if (this._buffer.length === 0) {
			this._isPlaying = false;
		}
		return true;
	}
}

function resample24to48(input) {
	const output = new Float32Array(input.length * 2);
	for (let i = 0; i < output.length; i++) {
		const srcIndex = i / 2;
		const srcIndexInt = Math.floor(srcIndex);
		const frac = srcIndex - srcIndexInt;
		const sample1 = input[srcIndexInt];
		const sample2 = input[Math.min(srcIndexInt + 1, input.length - 1)];
		output[i] = sample1 * (1 - frac) + sample2 * frac;
	}
	return output;
}

registerProcessor("streaming-audio-processor", StreamingAudioProcessor);
