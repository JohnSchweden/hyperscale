---
phase: 15-voice-files-expanded
plan: 06
subsystem: audio
tags: [voice, audio, hos, head-of-something, roaster, tts]

requires:
  - phase: 15-voice-files-expanded
    provides: Head of Something critical card audio foundation (8 cards)

provides:
  - Audio generation script for 11 remaining HoS cards
  - 2 new audio files generated (1 card: hos_prompt_injection_blame left/right)
  - Updated CRITICAL_HOS_CARDS with all 19 HoS card IDs

affects:
  - Phase 15-voice-files-expanded (remaining audio generation)
  - Head of Something gameplay experience

tech-stack:
  added: []
  patterns: []

key-files:
  created:
    - scripts/generate-hos-remaining.ts - Generation script for remaining 11 HoS cards
  modified:
    - hooks/useVoicePlayback.ts - Added 11 card IDs to CRITICAL_HOS_CARDS set
    - public/audio/voices/roaster/feedback/feedback_hos_prompt_injection_blame_*.wav - 2 new audio files
    - public/audio/voices/roaster/feedback/feedback_hos_prompt_injection_blame_*.opus - Opus compressed versions
    - public/audio/voices/roaster/feedback/feedback_hos_prompt_injection_blame_*.mp3 - MP3 fallback versions

key-decisions:
  - "Script structured to skip existing files for graceful partial generation"
  - "Sequential generation with delays to respect Gemini API rate limits"
  - "All 19 HoS cards mapped in CRITICAL_HOS_CARDS despite partial audio completion"

requirements-completed: []

duration: 12min
completed: 2026-03-24T22:36:00Z
---

# Phase 15 Plan 06: Head of Something Audio Gap Closure Summary

**Audio generation script created and CRITICAL_HOS_CARDS updated to include all 19 Head of Something cards. 2 of 22 audio files generated before API quota limit.**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-24T22:24:00Z
- **Completed:** 2026-03-24T22:36:00Z
- **Tasks:** 3
- **Files modified:** 7 (1 script + 1 TypeScript file + 6 audio files)

## Accomplishments

1. Created `scripts/generate-hos-remaining.ts` with all 11 missing HoS card definitions and Roaster feedback text
2. Generated first card audio: `hos_prompt_injection_blame` (LEFT and RIGHT with WAV, Opus, MP3 formats)
3. Updated `CRITICAL_HOS_CARDS` set to include all 19 HoS card IDs
4. Script includes graceful handling for partial generation (skips existing files)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create audio generation script** - `75038d6` (feat)
2. **Task 2: Generate 22 audio files (partial)** - `619eead` (feat) - 2 of 22 files generated
3. **Task 3: Update CRITICAL_HOS_CARDS** - `6326366` (feat)

**Plan metadata:** `TBD` (docs: complete plan)

## Files Created/Modified

- `scripts/generate-hos-remaining.ts` - Generation script for 11 remaining HoS cards with Roaster feedback text
- `hooks/useVoicePlayback.ts` - CRITICAL_HOS_CARDS now contains all 19 HoS card IDs (8 original + 11 new)
- `public/audio/voices/roaster/feedback/feedback_hos_prompt_injection_blame_left.wav` - New audio file
- `public/audio/voices/roaster/feedback/feedback_hos_prompt_injection_blame_right.wav` - New audio file
- `public/audio/voices/roaster/feedback/feedback_hos_prompt_injection_blame_*.opus` - Compressed Opus versions
- `public/audio/voices/roaster/feedback/feedback_hos_prompt_injection_blame_*.mp3` - MP3 fallback versions

## Decisions Made

- Script designed to skip existing files, enabling incremental/resumable generation when API quota resets
- All 19 card IDs added to CRITICAL_HOS_CARDS immediately, so feedbackVoiceTrigger() returns proper triggers even before all audio exists
- Audio files saved in all three formats (WAV, Opus, MP3) per project compression standards

## Deviations from Plan

### Partial Generation Due to API Quota

**Issue:** Gemini API quota exceeded after generating 2 voice clips
- **Found during:** Task 2 (Audio file generation)
- **Issue:** Free tier limited to 10 requests/day per model; quota already partially used
- **Result:** Generated 2 voice files (hos_prompt_injection_blame LEFT and RIGHT) = 6 files with opus/mp3 variants
- **Remaining:** 20 voice files for 10 cards need generation when quota resets
- **Files created:** 6 new files (2 wav + 2 opus + 2 mp3)
- **Impact:** Script is ready and will skip existing files on next run; no code changes needed

**Total deviations:** 1 external dependency issue (API quota)
**Impact on plan:** Core work complete (script + mapping). Audio files can be generated later without code changes.

## Issues Encountered

1. **Gemini API Quota Limit (429 Error)**
   - Error: `RESOURCE_EXHAUSTED` - quota exceeded for `generate_content_free_tier_requests`
   - Limit: 10 requests/day for gemini-2.5-flash-tts model
   - Resolution: Script handles this gracefully; remaining 20 files can be generated when quota resets
   - Workaround: 2 files generated successfully; remaining cards will use generic feedback until audio generated

## User Setup Required

None - no external service configuration required.

**Note:** To complete audio generation when Gemini API quota resets, run:
```bash
export GEMINI_API_KEY="your-key"
bun run scripts/generate-hos-remaining.ts
```

## Next Phase Readiness

- ✅ Generation script ready for resumption when quota resets
- ✅ CRITICAL_HOS_CARDS mapping complete (all 19 cards)
- ⚠️ 20 of 22 audio files pending API quota reset
- ℹ️ Script will automatically skip already-generated files

---
*Phase: 15-voice-files-expanded*
*Completed: 2026-03-24*
