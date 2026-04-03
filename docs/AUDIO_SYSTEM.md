# Audio System Architecture

K-Maru uses multiple audio subsystems: pre-recorded voice playback, real-time TTS via Gemini, Live API streaming, background music, pressure-driven stress audio, radio effects, and speech recognition.

## Table of Contents

- [1. System Overview](#1-system-overview)
- [2. TTS Pipeline](#2-tts-pipeline)
- [3. Live API Streaming](#3-live-api-streaming)
- [4. Pre-recorded Voice Files](#4-pre-recorded-voice-files)
- [5. Audio Compression Pipeline](#5-audio-compression-pipeline)
- [6. Pressure Audio](#6-pressure-audio)
- [7. Background Music](#7-background-music)
- [8. Kirk Audio Effects](#8-kirk-audio-effects)
- [9. Radio Effects](#9-radio-effects)
- [10. Speech Recognition](#10-speech-recognition)
- [11. Audio State Management](#11-audio-state-management)
- [12. Troubleshooting](#12-troubleshooting)

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          App.tsx                                     │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────────────┐  │
│  │useVoicePlayback│ │usePressureAudio│ │  useBackgroundMusic      │  │
│  └──────┬───────┘  └───────┬───────┘  └──────────┬───────────────┘  │
│         │                   │                     │                   │
│         ▼                   ▼                     ▼                   │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────────────┐  │
│  │voicePlayback │  │ pressureAudio │  │  BGM playlist (HTMLAudio)│  │
│  │+ radioEffect │  │ (Web Audio API)│  │  + voice ducking         │  │
│  └──────┬───────┘  └───────────────┘  └──────────────────────────┘  │
│         │                                                           │
│         ▼                                                           │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Web Audio API                              │   │
│  │  AudioContext → RadioEffect (bandpass + Quindar + noise)     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ geminiService│  │  geminiLive  │  │useLiveAPISpeechRecognition│  │
│  │  (TTS)       │  │ (streaming)  │  │  (STT via Live API)       │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────────┘  │
│         │                  │                     │                   │
│         ▼                  ▼                     ▼                   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              Gemini API (Vercel proxy + direct WS)            │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Audio Subsystem Map

| Subsystem | Primary File | Technology | Purpose |
|-----------|-------------|------------|---------|
| TTS (roast responses) | `services/geminiService.ts` | Gemini TTS API + Vercel proxy | On-demand speech for Roast.exe |
| Live API Streaming | `services/geminiLive.ts` | Gemini Live API WebSocket | Real-time audio streaming with personality |
| Pre-recorded Voices | `services/voicePlayback.ts` | Web Audio API + HTMLAudioElement | Onboarding, feedback, death, archetype cues |
| Radio Effect | `services/radioEffect.ts` | Web Audio API (BiquadFilter, noise) | Walkie-talkie effect on all voice playback |
| Pressure Audio | `services/pressureAudio.ts` | Web Audio API (oscillators, samples) | Heartbeat/alert sounds under game stress |
| Background Music | `hooks/useBackgroundMusic.ts` | HTMLAudioElement | Ambient music playlist with ducking |
| Kirk Easter Egg | `services/kirkAudio.ts` | Web Audio API (synthesized) | Glitch/crash sounds for Kirk refusal |
| Speech Recognition | `hooks/useSpeechRecognition.ts` | Web Speech API | Browser-native STT (legacy) |
| Live API STT | `hooks/useLiveAPISpeechRecognition.ts` | Gemini Live API + AudioWorklet | Real-time mic transcription |
| Format Detection | `services/audioUtils.ts` | HTMLMediaElement.canPlayType | Opus vs MP3 browser codec detection |

### Audio Data Flow

```
User Action
    │
    ├── Swipe card ──► Feedback voice (pre-recorded .opus/.mp3)
    │                      │
    │                      ├── loadVoice() → fetch file
    │                      ├── createRadioSession() → bandpass + Quindar
    │                      └── play through AudioContext
    │
    ├── High pressure ──► Heartbeat pulse (oscillator or sample)
    │                        │
    │                        ├── 90 BPM base rate
    │                        ├── Volume escalates over time/countdown
    │                        └── Android: sample-based; others: synthesized
    │
    ├── Roast.exe ──► Gemini TTS or Live API streaming
    │                    │
    │                    ├── TTS: POST /api/speak → base64 PCM → AudioBuffer
    │                    └── Live: WebSocket → streaming PCM chunks
    │
    └── Game start ──► BGM playlist
                         │
                         ├── HTMLAudioElement, auto-advance
                         ├── Voice ducking (0.2x during speech)
                         └── Session persistence (sessionStorage)
```

---

## 2. TTS Pipeline

Text-to-Speech is used for the Roast.exe workflow, where the AI generates spoken roast responses to user-submitted workflows.

### Architecture

```
┌──────────┐    POST /api/speak    ┌──────────────┐    Gemini TTS API    ┌─────────────┐
│ Browser  │ ───────────────────►  │ Vercel Edge  │ ──────────────────►  │ Google API  │
│          │ ◄──────────────────── │  Function    │ ◄──────────────────  │             │
│          │   { audio: base64 }   │  api/speak   │   base64 PCM 24kHz   │             │
└────┬─────┘                       └──────────────┘                      └─────────────┘
     │
     │ decodeAudioData()
     │ Int16 PCM → Float32 AudioBuffer
     │
     ▼
┌─────────────────┐
│ createRadioSession()
│ → bandpass filter (400-2400 Hz)
│ → Quindar intro beep (2525 Hz)
│ → pink noise floor
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ AudioContext    │
│ createBufferSource()
│ play at 24kHz   │
└─────────────────┘
```

### TTS API Endpoint

**File:** `api/speak.ts`

| Property | Value |
|----------|-------|
| Model | `gemini-2.5-flash-preview-tts` |
| Input | `{ text: string, voiceName: string }` |
| Output | `{ audio: string }` (base64-encoded PCM) |
| Sample Rate | 24kHz |
| Auth | `GEMINI_API_KEY` (server-side env var) |

### Voice Selection

| Personality | Voice Name | Character |
|-------------|-----------|-----------|
| ROASTER | `Puck` | British, sarcastic |
| ZEN_MASTER | `Zephyr` | Calm, flowing |
| LOVEBOMBER | `Kore` | Energetic, enthusiastic |

### TTS Playback Flow

1. Browser sends `POST /api/speak` with text and voice name
2. Vercel function calls Gemini TTS API with server-side API key
3. Response contains base64-encoded 24kHz 16-bit PCM audio
4. `decodeAudioData()` converts Int16 PCM to Float32 AudioBuffer
5. AudioBuffer routed through `createRadioSession()` for walkie-talkie effect
6. Active sources tracked in `activeSources[]` for cleanup

### Feature Flag

```typescript
if (import.meta.env.VITE_ENABLE_SPEECH === "false") return;
```

TTS can be disabled entirely via environment variable.

---

## 3. Live API Streaming

The Gemini Live API provides real-time bidirectional audio streaming for Roast.exe, replacing the one-shot TTS call with a WebSocket-based streaming connection.

### Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Browser                                       │
│                                                                      │
│  connectToLiveSession(prompt, personality)                          │
│         │                                                            │
│         ├── getEphemeralToken(apiKey)                               │
│         │     POST /v1beta/tokens?key=... → ephemeralToken           │
│         │                                                            │
│         ├── ai.live.connect({                                        │
│         │     model: "gemini-2.5-flash-native-audio-latest",        │
│         │     config: {                                              │
│         │       responseModalities: [Modality.AUDIO],               │
│         │       speechConfig: { voiceConfig: { voiceName } },       │
│         │       outputAudioTranscription: {},                       │
│         │       systemInstruction: "<personality prompt>"           │
│         │     }                                                      │
│         │   })                                                        │
│         │                                                            │
│         ├── session.sendClientContent({ prompt })                   │
│         │                                                            │
│         └── ReadableStream<AudioChunk | TextChunk>                  │
│               ├── AudioChunk: { data: ArrayBuffer, isFinal: bool }  │
│               └── TextChunk: { text: string, isFinal: bool }        │
└─────────────────────────────────────────────────────────────────────┘
```

### Session Configuration

| Property | Value |
|----------|-------|
| Model | `gemini-2.5-flash-native-audio-latest` |
| Auth | Ephemeral token (expires ~1 hour) |
| Transport | WebSocket |
| Output | 24kHz 16-bit PCM audio + text transcription |
| Timeout | 15 seconds for connection |

### Personality System Instructions

Each personality has a unique system instruction that defines tone, vocabulary, and rhythm:

- **ROASTER (V.E.R.A.)**: British, sarcastic, dry, sardonic. Varies length and rhythm.
- **ZEN_MASTER (V.E.R.A.)**: Serene, Zen koans, water metaphors, kind but devastating.
- **LOVEBOMBER (V.E.R.A.)**: High-energy, positive, Silicon Valley slang ("literally", "slay", "goated").

All instructions include: "Communicate EXCLUSIVELY via audio. NEVER generate thinking text."

### Audio Chunk Processing

```typescript
// In onmessage callback:
if (part.inlineData?.data) {
  // Decode base64 → Uint8Array → ArrayBuffer
  const audioChunk: AudioChunk = { data: bytes.buffer, isFinal: false };
  controller.enqueue(audioChunk);
}

// Output transcription (for subtitles/UI):
const outputTranscription = message.serverContent?.outputTranscription;
// Input transcription (user speech):
const inputTranscription = message.serverContent?.inputTranscription;
```

### Fallback: Quick Roast

When Live API is unavailable, `getQuickRoast()` uses `generateContent` for text-only responses. `checkLiveAPIAvailable()` performs a pre-flight token check.

---

## 4. Pre-recorded Voice Files

Pre-recorded voice files provide deterministic audio for onboarding, card feedback, death endings, and archetype reveals.

### Directory Structure

```
public/audio/voices/
├── roaster/                    # V.E.R.A. personality
│   ├── core/                   # Onboarding, victory, failure
│   │   ├── onboarding.opus     # (also .mp3)
│   │   ├── victory.opus
│   │   └── failure.opus
│   ├── archetype/              # Archetype reveal clips
│   │   ├── archetype_balanced.opus
│   │   ├── archetype_chaos_agent.opus
│   │   ├── archetype_conservative.opus
│   │   ├── archetype_disruptor.opus
│   │   ├── archetype_kirk.opus
│   │   ├── archetype_pragmatist.opus
│   │   └── archetype_shadow_architect.opus
│   ├── death/                  # Death ending clips
│   │   ├── death_bankrupt.opus
│   │   ├── death_audit_failure.opus
│   │   ├── death_congress.opus
│   │   ├── death_fled_country.opus
│   │   ├── death_prison.opus
│   │   └── death_replaced_by_script.opus
│   └── feedback/               # Per-card feedback (Roaster only)
│       └── feedback_<cardId>_<slug>.opus
├── zenmaster/                  # Same structure as roaster
└── lovebomber/                 # Same structure as roaster
```

### File Naming Conventions

| Category | Pattern | Example |
|----------|---------|---------|
| Core | `{trigger}` | `onboarding`, `victory`, `failure` |
| Death | `death_{deathType}` | `death_bankrupt`, `death_prison` |
| Archetype | `archetype_{archetypeId}` | `archetype_pragmatist` |
| Feedback | `feedback_{cardId}_{slug}` | `feedback_hos_managing_up_down_refactor` |
| Feedback (generic) | `feedback_{action}` | `feedback_install`, `feedback_ignore`, `feedback_paste`, `feedback_debug` |

### Subfolder Resolution

The `getSubfolder()` function in `voicePlayback.ts` maps trigger names to directories:

```typescript
function getSubfolder(triggerName: string): string {
  if (triggerName.startsWith("archetype_")) return "archetype";
  if (triggerName.startsWith("death_")) return "death";
  if (triggerName.startsWith("feedback_")) return "feedback";
  if (["onboarding", "victory", "failure"].includes(triggerName)) return "core";
  return ""; // Fallback to root
}
```

### Browser Codec Detection

Voice files exist in both Opus and MP3 formats. The browser's supported codec is detected at runtime:

```typescript
// services/audioUtils.ts
export function getAudioExtension(): ".opus" | ".mp3" {
  return supportsOpus() ? ".opus" : ".mp3";
}
```

Opus support is tested against three container types:
- `audio/ogg; codecs="opus"` (Chrome, Firefox, Edge)
- `audio/webm; codecs="opus"` (alternative)
- `audio/x-caf` (Safari)

### Voice Playback Service

**File:** `services/voicePlayback.ts`

| Function | Purpose |
|----------|---------|
| `loadVoice(personality, trigger)` | Fetches audio file, creates radio session, prepares playback |
| `playVoice()` | Starts/resumes playback |
| `stopVoice()` | Stops playback, cleans up resources |
| `isPlaying()` | Returns whether voice is actively playing |
| `subscribeVoiceActivity(listener)` | Subscribe to voice start/stop events (used for BGM ducking) |

### Voice Playback Hook

**File:** `hooks/useVoicePlayback.ts`

Triggers voice playback based on game state:

| Trigger | Condition | Audio File |
|---------|-----------|------------|
| Onboarding | `stage === ROLE_SELECT` | `{personality}/core/onboarding` |
| Victory | `stage === DEBRIEF_PAGE_1` (no death) | `{personality}/core/victory` |
| Death ending | `stage === DEBRIEF_PAGE_1` + `deathType` | `{personality}/death/death_{type}` |
| Feedback | Card swipe (Roaster only) | `{personality}/feedback/feedback_{cardId}_{slug}` |
| Archetype reveal | `stage === DEBRIEF_PAGE_3` + `archetypeId` | `{personality}/archetype/archetype_{id}` |

### Critical HoS Cards

Cards with dedicated per-choice feedback audio (defined in `useVoicePlayback.ts`):

```
hos_managing_up_down, explainability_hos_2, hos_copyright_team_blame,
hos_team_burnout_deadline, shadow_ai_hos_2, hos_model_drift_team_blame,
hos_explainability_politics, hos_prompt_injection_review_escape,
hos_prompt_injection_blame, hos_model_drift_budget_conflict,
hos_delegation_gone_wrong, hos_promotion_politics,
hos_prompt_injection_copilot_team, hos_model_drift_retrain_delay,
explainability_hos_1, shadow_ai_hos_1, synthetic_data_hos_1,
synthetic_data_hos_2, hos_explainability_documentation,
hos_shadow_ai_retention, hos_copyright_sourcing,
hos_copyright_documentation, hos_congressional_hearing_demand,
hos_whistleblower_pressure, hos_ai_management_elimination,
hos_process_automation_takeover
```

### Feedback Audio Choice Mapping

**File:** `lib/feedbackAudioChoice.ts`

The `authoringFeedbackStem()` function maps the player's presentation choice (LEFT/RIGHT) to the correct authoring slug, accounting for `choiceSidesSwapped`:

```typescript
// When sides are swapped, the displayed LEFT maps to the original onRight
authoringFeedbackStem(card, "LEFT") // → slugify(card.onRight.label) if swapped
```

---

## 5. Audio Compression Pipeline

WAV files are compressed to Opus (96kbps) and MP3 (192kbps) for distribution. Original WAVs are archived locally.

### Compression Script

**File:** `scripts/compress-audio.ts`

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│  WAV file   │ ──► │  Archive     │ ──► │  Compress to     │
│ (generated) │     │  (local)     │     │  Opus + MP3      │
└─────────────┘     └──────────────┘     └────────┬─────────┘
                                                   │
                                    ┌──────────────┴──────────┐
                                    ▼                         ▼
                             {name}.opus               {name}.mp3
                             (96kbps)                  (192kbps)
                                    │                         │
                                    └──────────┬──────────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │  Delete original    │
                                    │  WAV from public/   │
                                    └─────────────────────┘
```

### Compression Settings

| Format | Codec | Bitrate | Container |
|--------|-------|---------|-----------|
| Opus | `libopus` | 96 kbps | Ogg Opus |
| MP3 | `libmp3lame` | 192 kbps | MP3 |

### Archive Structure

WAV masters are archived to `audio-archive/` (git-ignored), preserving the `public/audio/voices/` subfolder structure:

```
audio-archive/
├── roaster/
│   ├── archetype/
│   ├── death/
│   └── core/
├── zenmaster/
│   ├── archetype/
│   ├── death/
│   └── core/
└── lovebomber/
    ├── archetype/
    ├── death/
    └── core/
```

### CLI Usage

```bash
# Compress single file
bun run scripts/compress-audio.ts file path/to/audio.wav

# Compress all WAVs in directory (recursive)
bun run scripts/compress-audio.ts directory path/to/directory
```

### API

```typescript
// Default: archive + compress + delete WAV
await compressAudioFile(inputPath);

// Keep WAV (opt-out of deletion)
await compressAudioFile(inputPath, { deleteWav: false });

// Custom archive location
await compressAudioFile(inputPath, { archiveDir: "custom-archive" });
```

### Git Configuration

```gitignore
# .gitignore
audio-archive/
*.wav
```

WAV files are excluded from git. Only compressed formats (Opus + MP3) are tracked.

### Generation Scripts

All voice generation scripts use the compression pipeline automatically:

- `scripts/generate-voice.ts`
- `scripts/generate-hos-remaining.ts`
- `scripts/generate-hos-tier1.ts`
- `scripts/generate-hos-tier2.ts`
- `scripts/generate-hos-tier3.ts`
- `scripts/generate-death-roaster.ts`
- `scripts/generate-death-zenmaster.ts`
- `scripts/generate-death-lovebomber.ts`
- `scripts/generate-archetype-voices.ts`
- `scripts/generate-archetype-voices-remaining.ts`

---

## 6. Pressure Audio

Pressure audio provides stress cues when game metrics (heat, hype, budget) reach critical levels. Uses Web Audio API oscillators and samples.

### Architecture

```
┌──────────────────────────────────────────────────────┐
│                  usePressureAudio                     │
│                                                       │
│  hasHighPressure ──► startHeartbeat(config)          │
│  isCritical ──────► triggerHaptic()                  │
│  countdownValue ──► updateHeartbeat({ countdown })   │
│                                                       │
│  ┌────────────────────────────────────────────────┐   │
│  │            PressureAudioSession                 │   │
│  │                                                  │   │
│  │  Heartbeat (90 BPM)                             │   │
│  │  ├── Non-Android: oscillator + harmonics        │   │
│  │  │   - Fundamental: 60 Hz sine                 │   │
│  │  │   - 2nd harmonic: 120 Hz @ 15%              │   │
│  │  │   - 3rd harmonic: 180 Hz @ 5%               │   │
│  │  └── Android: sample-based (heartbeat.opus/mp3) │   │
│  │                                                  │   │
│  │  Volume Escalation                              │   │
│  │  ├── With countdown: ramp over countdown period │   │
│  │  │   - progress = 1 - (countdownValue / total)  │   │
│  │  │   - multiplier: 1.0 → 1.65x                 │   │
│  │  └── Without countdown: ramp over 30 seconds    │   │
│  │                                                  │   │
│  │  Alert (800 Hz, 150ms)                          │   │
│  │  └── Single pulse for critical moments          │   │
│  │                                                  │   │
│  │  Countdown Beeps (3, 2, 1)                      │   │
│  │  ├── 3: 200 Hz                                 │   │
│  │  ├── 2: 235 Hz                                 │   │
│  │  ├── 1: 275 Hz                                 │   │
│  │  └── Start: 385 Hz                             │   │
│  └────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

### Key Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `STRESS_BPM` | 90 | Heartbeat rate |
| `HEARTBEAT_BASE_FREQ` | 60 Hz | Fundamental frequency |
| `ALERT_FREQ` | 800 Hz | Alert tone frequency |
| `GAIN_HEARTBEAT_STRESS` | 0.132 | Desktop heartbeat volume |
| `GAIN_HEARTBEAT_ANDROID` | 0.55 | Android sample volume |
| `GAIN_ALERT` | 0.08 | Desktop alert volume |
| `GAIN_ALERT_ANDROID` | 0.35 | Android alert volume |
| `ESCALATION_END_MULT` | 1.65 | Max volume multiplier |
| `RAMP_DURATION_NO_COUNTDOWN` | 30s | Ramp duration without countdown |

### Android-Specific Handling

Android Chrome has known issues with oscillator volume. The pressure audio system detects Android and switches to sample-based playback:

```typescript
function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}
```

On Android:
- Heartbeat uses `heartbeat.opus`/`heartbeat.mp3` sample (Mixkit CC0)
- Falls back to oscillator + harmonics if sample fails to load
- Higher gain values compensate for playback differences

### Unlock Pulse

Chrome Android blocks `AudioContext.resume()` when not triggered by user gesture. `playUnlockPulse()` plays a short sound on first user interaction to unlock the audio context:

```typescript
function resumeOnFirstGesture(ctx: AudioContext): void {
  const resume = () => {
    if (ctx.state === "suspended") {
      ctx.resume().then(() => playUnlockPulse(ctx));
    }
  };
  document.addEventListener("touchend", resume, { once: true, capture: true });
  document.addEventListener("click", resume, { once: true, capture: true });
}
```

### Countdown Audio

Countdown beeps use ascending frequencies for tension:

| Value | Frequency | Duration | Gain |
|-------|-----------|----------|------|
| 3 | 200 Hz | 35ms | 0.018 |
| 2 | 235 Hz | 35ms | 0.018 |
| 1 | 275 Hz | 35ms | 0.018 |
| Start (0) | 385 Hz | 55ms | 0.022 |

`prepareCountdownAudio()` should be called from a user gesture (e.g., role select) before countdown starts.

---

## 7. Background Music

Background music plays ambient tracks during gameplay with automatic playlist progression and voice ducking.

### Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     useBackgroundMusic                        │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  HTMLAudioElement (single instance)                     │   │
│  │  - preload="auto"                                       │   │
│  │  - playsinline (mobile)                                 │   │
│  │  - Auto-advances on "ended" event                       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                               │
│  Playlist: BGM_TRACKS (loops)                                │
│  ┌──────────────────────┐  ┌────────────────────────────┐    │
│  │ 1. Chromed Rainfall  │─►│ 2. Quiet Apogee            │─►  │
│  │    (display: "Chromed│  │    (display: "Quiet        │    │
│  │     Rainfall")       │  │     Apogee")               │    │
│  └──────────────────────┘  └────────────────────────────┘    │
│           ▲                                                    │
│           └──────────────────────────────────────────────────┘ │
│                                                               │
│  Features:                                                    │
│  ├── Voice ducking (0.2x during speech)                       │
│  ├── Unduck ramp (1200ms easeOutCubic)                        │
│  ├── Volume persistence (localStorage)                        │
│  ├── Session resume (sessionStorage: track index + time)      │
│  └── Skip next track                                          │
└──────────────────────────────────────────────────────────────┘
```

### BGM Playlist

**File:** `data/bgmPlaylist.ts`

| Index | Source Stem | Display Title | Location |
|-------|------------|---------------|----------|
| 0 | `Chromed Rainfall Cover` | "Chromed Rainfall" | `/audio/music/` |
| 1 | `Quiet Apogee - AI Music` | "Quiet Apogee" | `/audio/music/` |

Files exist in both `.opus` and `.mp3` formats; codec selected at runtime via `getAudioPath()`.

### Volume System

| Constant | Value | Purpose |
|----------|-------|---------|
| `VOLUME.DEFAULT` | 0.2 | Default BGM volume |
| `VOLUME.MIN` | 0 | Muted |
| `VOLUME.MAX` | 1 | Full volume |
| `VOLUME.STEP` | 0.05 | Volume slider increment |
| `VOICE_DUCK_MULT` | 0.2 | Volume multiplier during voice |
| `VOICE_UNDUCK_RAMP_MS` | 1200 | Unduck ramp duration |

### Storage Keys

| Key | Storage | Purpose |
|-----|---------|---------|
| `k-maru-bgm-volume` | localStorage | User volume preference |
| `k-maru-bgm-enabled` | localStorage | BGM on/off preference |
| `k-maru-bgm-session-track` | sessionStorage | Current track index (session) |
| `k-maru-bgm-session-time` | sessionStorage | Playback position (session) |

### Voice Ducking

BGM volume is automatically reduced when voice playback is active:

```typescript
// Subscribed via voicePlayback.ts event emitter
subscribeVoiceActivity((active) => setVoiceDucking(active));

// Applied to BGM element
el.volume = clamp(userVolume * (voiceDucking ? 0.2 : 1), 0, 1);
```

Unduck uses `easeOutCubic` easing over 1200ms for smooth volume restoration.

### Hook API

```typescript
const {
  currentTrackTitle,  // Display name of current track
  userVolume,         // Current volume (0-1)
  setUserVolume,      // Set volume (persists to localStorage)
  enabled,            // BGM on/off state
  toggleEnabled,      // Toggle BGM (clears session if disabling)
  skipNext,           // Skip to next track
  bgmVolumeMin,       // 0
  bgmVolumeMax,       // 1
  bgmVolumeStep,      // 0.05
} = useBackgroundMusic();
```

---

## 8. Kirk Audio Effects

Special audio effects for the Kirk Easter egg, triggered when the player refuses to roast Kirk-related workflows.

### File: `services/kirkAudio.ts`

Two levels of synthesized glitch audio:

### Level 1: Glitch Tone (First Refusal)

| Property | Value |
|----------|-------|
| Waveform | Sawtooth |
| Duration | 144ms |
| Frequency sweep | 200 → 800 → 100 Hz |
| Volume | 0.06 |
| Purpose | Subtle "something happened" tone |

```
Frequency
  800 ────╮
          │  ╲
  200 ────╯   ╲
               ╲
  100 ──────────╯
  ──────────────────► Time (144ms)
```

### Level 2: Crash Sound (Second Refusal)

| Component | Type | Parameters |
|-----------|------|------------|
| White noise | BufferSource | Exponential decay (tau = 30% of duration), gain 0.12 |
| System power-down | Square oscillator | 1200 → 40 Hz over 800ms, gain 0.04 |
| Total duration | | 800ms |

```
Noise:  ████████░░░░░░░░░░░░ (exponential decay)
Osc:    1200Hz ────────────► 40Hz (square wave, descending)
```

Both functions guard against suspended AudioContext:

```typescript
if (ctx.state === "suspended") return;
```

---

## 9. Radio Effects

All voice playback (pre-recorded and TTS) is processed through a walkie-talkie/radio effect.

### File: `services/radioEffect.ts`

### Signal Chain

```
Voice Source ──► Highpass (400 Hz) ──► Lowpass (2400 Hz) ──► Destination
                                                  │
                     ┌────────────────────────────┘
                     │
Pink Noise ──► Highpass (400 Hz) ──► Lowpass (2400 Hz) ──► Gain (0.03) ──► Destination
(looped)
```

### Quindar Tones

Apollo-style beep tones mark the start and end of transmission:

| Tone | Frequency | Duration | Gain |
|------|-----------|----------|------|
| Intro | 2525 Hz | 250ms | 0.06 |
| Outro | 2475 Hz | 250ms | 0.06 |

### Pink Noise Generation

Uses Paul Kellet's refined method for perceptually flat pink noise:

```typescript
// 6-pole recursive filter
b0 = 0.99886 * b0 + white * 0.0555179;
b1 = 0.99332 * b1 + white * 0.0750759;
// ... (6 coefficients)
output = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
```

### RadioSession API

```typescript
interface RadioSession {
  voiceInput: BiquadFilterNode;  // Connect voice sources here
  start(): number;               // Schedules noise + intro, returns voice start time
  scheduleChunk(duration: number): number;  // Get start time for next voice chunk
  stop(): void;                  // Stop noise immediately (no outro)
  end(): Promise<void>;          // Play outro beep and stop noise
  context: AudioContext;
}
```

### Usage Pattern

```typescript
const radio = createRadioSession(ctx, { delaySeconds: 0 });
radio.start();

// Connect voice source
mediaSource.connect(radio.voiceInput);

// When voice ends
radio.end();
```

### Voice Playback Integration

In `voicePlayback.ts`, all loaded voices are routed through a radio session:

```typescript
const radio = createRadioSession(ctx, { delaySeconds: 0 });
radio.start();
currentRadio = radio;

const mediaSource = ctx.createMediaElementSource(audio);
mediaSource.connect(radio.voiceInput);
```

The 250ms Quindar intro delay (`QUINDAR_INTRO_MS`) is applied before playback starts.

---

## 10. Speech Recognition

Two STT implementations exist: legacy Web Speech API and Gemini Live API-based transcription.

### Option A: Web Speech API (Legacy)

**File:** `hooks/useSpeechRecognition.ts`

Uses the browser's built-in `SpeechRecognition` / `webkitSpeechRecognition` API.

| Property | Value |
|----------|-------|
| API | `window.SpeechRecognition` or `window.webkitSpeechRecognition` |
| Language | `en-US` |
| Continuous | `true` |
| Interim results | `true` |
| Auto-restart | Disabled (manual only) |

**Known Issues:**
- Fails with "network" error when not signed into Google in Chrome
- Blocked by firewalls restricting `speech.googleapis.com`
- Not available in Electron/embedded browsers
- Requires secure context (HTTPS)

**Hook API:**

```typescript
const {
  isListening,      // boolean
  transcript,       // accumulated text
  startListening,   // begin capture
  stopListening,    // end capture
  error,            // error string or null
} = useSpeechRecognition();
```

### Option B: Gemini Live API STT (Recommended)

**File:** `hooks/useLiveAPISpeechRecognition.ts`

Real-time transcription using Gemini Live API with `inputAudioTranscription`.

### Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    useLiveAPISpeechRecognition                    │
│                                                                   │
│  ┌─────────────┐    AudioWorklet     ┌───────────────────────┐   │
│  │  Microphone │ ──► PCM Processor  │  GoogleGenAI Live     │   │
│  │  getUserMedia│    Float32→Int16  │  session              │   │
│  │  (16kHz)    │ ──► base64 chunks  │  sendRealtimeInput()  │   │
│  └─────────────┘                    └───────────┬───────────┘   │
│                                                  │               │
│                                    onmessage callback            │
│                                    ├── inputTranscription.text   │
│                                    └── turnComplete (final)      │
│                                                                   │
│  Low Latency Mode (VITE_STT_LOW_LATENCY=true):                   │
│  ├── Disables echoCancellation                                   │
│  └── Disables noiseSuppression                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Audio Capture Pipeline

1. `getUserMedia({ audio: { sampleRate: 16000, channelCount: 1 } })`
2. AudioContext with actual sample rate (browser may give 48kHz)
3. AudioWorklet converts Float32 → Int16 PCM
4. PCM encoded to base64 and sent via `sendRealtimeInput()`
5. Live API returns transcription via `inputTranscription.text`

### Configuration

| Property | Value |
|----------|-------|
| Model | `gemini-2.5-flash-native-audio-latest` |
| API Version | `v1alpha` |
| Input format | `audio/pcm;rate={sampleRate}` |
| Voice | `Aoede` |
| System instruction | "You are a speech transcription service. Only transcribe user audio. Do not generate any response." |

### Debouncing

Transcription updates are debounced at 1500ms for final transcript detection:

```typescript
debounceTimerRef.current = setTimeout(() => {
  onTranscript(transcriptBufferRef.current.trim(), true);
}, 1500);
```

### Hook API

```typescript
const {
  startRecording,   // async - begin mic capture + transcription
  stopRecording,    // async - end capture, wait for final transcript
  transcript,       // accumulated text
  isRecording,      // boolean
  error,            // error string or null
} = useLiveAPISpeechRecognition({ onTranscript });
```

### Mobile Guard

Microphone access requires secure context. A guard prevents cryptic crashes:

```typescript
if (typeof navigator?.mediaDevices?.getUserMedia !== "function") {
  throw new Error("Microphone access is not available. Use HTTPS and a modern browser.");
}
```

### STT Research Summary

**File:** `docs/speech-to-text-research.md`

Three options were evaluated:

| Option | Use Case | Pros | Cons |
|--------|----------|------|------|
| Live API + `sendRealtimeInput` | Real-time mic button | Same SDK/key, streaming | Persistent session, billed per minute |
| `generateContent` + uploaded audio | Record-then-transcribe | Simple | Higher latency, record first |
| Google Cloud Speech-to-Text | Production STT | Dedicated service | Separate auth/billing |

**Recommendation:** Option 1 (Live API) -- already integrated, same auth, real-time UX.

---

## 11. Audio State Management

### Audio Context Sharing

Multiple subsystems create their own AudioContext instances:

| Subsystem | Context Location | Notes |
|-----------|-----------------|-------|
| Voice Playback | `services/voicePlayback.ts` | Shared singleton, lazy init |
| TTS (geminiService) | `services/geminiService.ts` | Separate instance, 24kHz |
| Pressure Audio | `services/pressureAudio.ts` | Per-session, created on mount |
| Countdown | `services/pressureAudio.ts` | Singleton via `getCountdownContext()` |
| Kirk Effects | Caller provides context | No internal context |

### Suspended Context Handling

Chrome blocks AudioContext creation until user gesture. All subsystems handle this:

```typescript
// Check before playing
if (ctx.state === "suspended") return;

// Resume on gesture
ctx.resume().then(() => { /* proceed */ });
```

### Voice Activity Events

The `voicePlayback.ts` module publishes voice activity events for cross-system coordination:

```typescript
// Publisher (voicePlayback.ts)
function emitVoiceActivity(active: boolean) {
  for (const fn of voiceActivityListeners) fn(active);
}

// Subscriber (useBackgroundMusic.ts)
subscribeVoiceActivity((active) => setVoiceDucking(active));
```

### Playback State Tracking

| Subsystem | State Tracking |
|-----------|---------------|
| Voice Playback | `currentAudio`, `currentRadio`, `currentBlobUrl` (module-level) |
| BGM | `trackIndexRef`, `enabledRef`, `userVolumeRef` (refs + state) |
| Pressure Audio | `sessionRef` (per-hook instance) |
| Death/Archetype audio | `hasPlayedDeathAudio`, `hasPlayedArchetypeAudio` (useRef, prevents re-trigger) |

### Cleanup Patterns

| Subsystem | Cleanup |
|-----------|---------|
| Voice Playback | `stopVoice()` on unmount (useEffect return) |
| BGM | `el.pause()`, `el.removeAttribute("src")`, `el.load()` on unmount |
| Pressure Audio | `session.stop()` on unmount |
| Live API STT | `mic.stop()`, `session.close()` on stopRecording |
| Web Speech API | `recognition.abort()` on unmount |

---

## 12. Troubleshooting

### No Audio Playing

**Symptom:** Voice clips or BGM do not play at all.

| Cause | Fix |
|-------|-----|
| AudioContext suspended | Click/tap anywhere to unlock (gesture required) |
| `VITE_ENABLE_SPEECH=false` | Set env var to `true` or remove it |
| Missing `VITE_GEMINI_API_KEY` | Add API key to `.env` |
| Missing audio files | Run generation scripts, then `bun run compress:dir public/audio/voices/` |
| Browser doesn't support codec | Check `supportsOpus()` -- MP3 fallback should activate |

### TTS Not Working

**Symptom:** Roast.exe produces text but no audio.

| Cause | Fix |
|-------|-----|
| Missing API key | Check `GEMINI_API_KEY` in Vercel env vars |
| `/api/speak` returns 500 | Check Vercel function logs |
| Live API timeout | 15s timeout -- check network, try fallback |
| Ephemeral token expired | Tokens last ~1 hour; reconnect triggers new token |

### Speech Recognition Fails

**Symptom:** Mic button shows error.

| Error | Cause | Fix |
|-------|-------|-----|
| `"network"` | Web Speech API needs Google sign-in | Use Live API STT instead |
| `"not-allowed"` | Mic permission denied | Grant mic permission in browser settings |
| `getUserMedia undefined` | HTTP context or unsupported browser | Serve over HTTPS; use modern browser |
| `"Microphone access is not available"` | Secure context required | Ensure HTTPS; not available in some WebViews |

### BGM Not Starting

**Symptom:** Background music never plays.

| Cause | Fix |
|-------|-----|
| Autoplay blocked | BGM requires user gesture; starts on first interaction |
| `k-maru-bgm-enabled` = `"false"` | Toggle BGM on in UI, or clear localStorage |
| Missing music files | Verify `/audio/music/` contains `.opus`/`.mp3` files |
| Session storage cleared | BGM resumes from session; cleared on tab close |

### Pressure Audio Silent

**Symptom:** No heartbeat during high-pressure gameplay.

| Cause | Fix |
|-------|-----|
| AudioContext suspended | `resumeOnFirstGesture()` handles this; click/tap to unlock |
| `hasHighPressure` never true | Check game logic for pressure threshold |
| Android sample missing | Verify `public/audio/stress/heartbeat.opus` exists |
| `ctx.state === "suspended"` | All pulse functions guard against this; no-op until resumed |

### Kirk Effects Not Playing

**Symptom:** No glitch sounds on Kirk refusal.

| Cause | Fix |
|-------|-----|
| Context suspended | Both functions return early if suspended |
| Caller not providing context | Ensure `AudioContext` is passed and active |

### Audio Quality Issues

**Symptom:** Voice sounds muffled or distorted.

| Cause | Fix |
|-------|-----|
| Radio effect bandpass | Intentional: 400-2400 Hz bandpass creates radio effect |
| Low Opus bitrate | 96kbps Opus is intentional for file size |
| Volume too low | Voice playback is fixed at 40% (`VOLUME = 0.4`) |
| BGM too loud | Default BGM volume is 20%; user can adjust |

### Chrome Android Specific

| Issue | Fix |
|-------|-----|
| AudioContext won't resume | `resumeOnFirstGesture()` + `playUnlockPulse()` on touch/click |
| Oscillator volume too low | Android uses sample-based playback (`heartbeat.opus`) |
| `getUserMedia` blocked | Must be HTTPS; check browser permissions |

### Debug Checklist

1. Check browser console for `[Voice]`, `[BGM]`, `[Speech]`, `[Gemini Live]` logs
2. Verify environment variables: `VITE_GEMINI_API_KEY`, `VITE_ENABLE_SPEECH`
3. Check Network tab for failed audio file requests (404 = missing files)
4. Check `supportsOpus()` result in console
5. Verify AudioContext state: `audioContext.state` should be `"running"`
6. For mobile: confirm HTTPS, mic permissions, and browser compatibility