import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock AudioContext and related APIs
class MockAudioContext {
  state = 'running';
  sampleRate = 24000;
  createBufferSource = vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: null,
  }));
  createBuffer = vi.fn((channels, length, sampleRate) => ({
    numberOfChannels: channels,
    length,
    sampleRate,
    getChannelData: () => new Float32Array(length),
  }));
  decodeAudioData = vi.fn();
  close = vi.fn();
  resume = vi.fn();
}

const mockAudioContext = new MockAudioContext() as unknown as AudioContext;

describe('Voice Playback System', () => {
  beforeEach(() => {
    vi.stubGlobal('AudioContext', vi.fn(() => mockAudioContext));
    vi.stubGlobal('window', {
      AudioContext: vi.fn(() => mockAudioContext),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('loadVoice', () => {
    it('should load a valid voice file successfully', async () => {
      const { loadVoice } = await import('../services/voicePlayback');
      // This should fail initially - no implementation yet
      await expect(loadVoice('roaster', 'onboarding')).resolves.not.toThrow();
    });

    it('should throw narrative error for missing file', async () => {
      const { loadVoice } = await import('../services/voicePlayback');
      // Should fail with narrative error message
      await expect(loadVoice('roaster', 'nonexistent')).rejects.toThrow('V.E.R.A.');
    });
  });

  describe('playVoice', () => {
    it('should play loaded voice', async () => {
      const { loadVoice, playVoice } = await import('../services/voicePlayback');
      await loadVoice('roaster', 'onboarding');
      await expect(playVoice()).resolves.not.toThrow();
    });
  });

  describe('stopVoice', () => {
    it('should stop currently playing voice', async () => {
      const { loadVoice, playVoice, stopVoice } = await import('../services/voicePlayback');
      await loadVoice('roaster', 'onboarding');
      await playVoice();
      expect(() => stopVoice()).not.toThrow();
    });
  });

  describe('error messages', () => {
    it('should show Roaster narrative error', async () => {
      const { loadVoice } = await import('../services/voicePlayback');
      try {
        await loadVoice('roaster', 'invalid');
      } catch (e: any) {
        expect(e.message).toContain('V.E.R.A.');
      }
    });

    it('should show Zen Master narrative error', async () => {
      const { loadVoice } = await import('../services/voicePlayback');
      try {
        await loadVoice('zenmaster', 'invalid');
      } catch (e: any) {
        expect(e.message).toContain('spreadsheets');
      }
    });

    it('should show Lovebomber narrative error', async () => {
      const { loadVoice } = await import('../services/voicePlayback');
      try {
        await loadVoice('lovebomber', 'invalid');
      } catch (e: any) {
        expect(e.message).toContain('OMG');
      }
    });
  });
});
