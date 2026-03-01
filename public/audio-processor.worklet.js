/**
 * AudioWorklet Processor for Streaming PCM Playback
 * 
 * Handles 24kHz → 48kHz sample rate conversion for Gemini Live API audio.
 * Without this conversion, audio plays at 2x speed (chipmunk voice).
 * 
 * Usage:
 * 1. Load: audioContext.audioWorklet.addModule('/audio-processor.worklet.js')
 * 2. Create node: new AudioWorkletNode(audioContext, 'streaming-audio-processor')
 * 3. Send PCM data: workletNode.port.postMessage({ type: 'chunk', data: float32Array })
 */

class StreamingAudioProcessor extends AudioWorkletProcessor {
  private buffer: Float32Array[] = [];
  private readonly maxBufferSize = 10; // Prevent memory leaks
  private isPlaying = false;
  private sampleRateRatio = 2; // 24kHz → 48kHz = 2x

  static get parameterDescriptors() {
    return [];
  }

  constructor() {
    super();
    console.log('[AudioWorklet] StreamingAudioProcessor initialized');

    // Listen for messages from main thread
    this.port.onmessage = (event) => {
      const { type, data } = event.data;

      if (type === 'chunk' && data) {
        // Data comes as Float32Array already converted from main thread
        // Just add to buffer
        this.addChunk(data);
      } else if (type === 'clear') {
        // Clear buffer (for new stream)
        this.buffer = [];
        console.log('[AudioWorklet] Buffer cleared');
      } else if (type === 'flush') {
        // Flush remaining data and stop
        this.buffer = [];
        console.log('[AudioWorklet] Buffer flushed');
      }
    };
  }

  /**
   * Add audio chunk to buffer
   * Handles buffer size limits to prevent memory leaks
   */
  private addChunk(chunk: Float32Array): void {
    // If buffer is full, remove oldest chunk
    if (this.buffer.length >= this.maxBufferSize) {
      this.buffer.shift();
      console.warn('[AudioWorklet] Buffer full, dropping oldest chunk');
    }

    this.buffer.push(chunk);
    this.isPlaying = true;
  }

  /**
   * Process audio - fills output with buffered data
   * Called by the browser's audio rendering thread at 48kHz
   */
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): boolean {
    const output = outputs[0];
    const outputChannel = output[0];

    if (!outputChannel) {
      return true;
    }

    // Fill output with buffered audio
    // Each process() call outputs 128 samples at 48kHz
    let samplesNeeded = outputChannel.length;
    let outputIndex = 0;

    while (samplesNeeded > 0 && this.buffer.length > 0) {
      const currentChunk = this.buffer[0];
      const remainingInChunk = currentChunk.length - this.chunkPosition;

      if (remainingInChunk > samplesNeeded) {
        // Current chunk has enough data
        outputChannel.set(
          currentChunk.subarray(
            this.chunkPosition,
            this.chunkPosition + samplesNeeded
          ),
          outputIndex
        );
        this.chunkPosition += samplesNeeded;
        samplesNeeded = 0;
      } else {
        // Use remaining data from current chunk
        outputChannel.set(
          currentChunk.subarray(this.chunkPosition),
          outputIndex
        );
        samplesNeeded -= remainingInChunk;
        outputIndex += remainingInChunk;

        // Remove used chunk
        this.buffer.shift();
        this.chunkPosition = 0;
      }
    }

    // If no data in buffer, fill with silence
    if (this.buffer.length === 0) {
      this.isPlaying = false;
    }

    // Continue processing
    return true;
  }

  // Track position within current chunk
  private chunkPosition = 0;
}

// Resample 24kHz → 48kHz using linear interpolation
// This prevents audio from playing at 2x speed (chipmunk voice)
function resample24to48(input: Float32Array): Float32Array {
  const output = new Float32Array(input.length * 2);

  for (let i = 0; i < output.length; i++) {
    const srcIndex = i / 2;
    const srcIndexInt = Math.floor(srcIndex);
    const frac = srcIndex - srcIndexInt;

    // Linear interpolation between adjacent samples
    const sample1 = input[srcIndexInt];
    const sample2 = input[Math.min(srcIndexInt + 1, input.length - 1)];
    output[i] = sample1 * (1 - frac) + sample2 * frac;
  }

  return output;
}

// Convert Int16 PCM to Float32
function int16ToFloat32(input: Int16Array): Float32Array {
  const output = new Float32Array(input.length);

  for (let i = 0; i < input.length; i++) {
    // Normalize from [-32768, 32767] to [-1, 1]
    output[i] = input[i] / 32768.0;
  }

  return output;
}

// Register the processor
registerProcessor('streaming-audio-processor', StreamingAudioProcessor);

// Export helper functions for use in main thread
export { resample24to48, int16ToFloat32 };
