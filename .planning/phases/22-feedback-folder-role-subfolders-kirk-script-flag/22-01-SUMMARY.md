---
phase: 22
plan: 01
subsystem: audio-paths
tags: [feedback-audio, kirk-path, audio-generation]
dependency_graph:
  requires: []
  provides: [feedback-folder-reorganization, kirk-audio-generation]
  affects: [voicePlayback.ts, useVoicePlayback.ts, generate-all-feedback-audio.ts]
tech_stack:
  added: []
  patterns: [role-based-subfolder-routing]
key_files:
  created: []
  modified:
    - src/services/voicePlayback.ts
    - src/hooks/useVoicePlayback.ts
    - scripts/generate-all-feedback-audio.ts
decisions:
  - "Use role-based subfolders for feedback audio organization"
  - "Add Kirk card IDs to CRITICAL_HOS_CARDS for feedback trigger"
  - "Support --kirk flag for targeted Kirk audio generation"
metrics:
  duration_minutes: 15
  completed_date: "2026-04-08"
---

# Phase 22 Plan 01: Feedback Folder Role Subfolders + Kirk Script Flag

**One-liner:** Reorganized feedback audio folder into role subfolders, added Kirk card support, and --kirk generation flag

## Summary

Successfully completed the feedback folder reorganization with role-based subfolders and added Kirk audio generation support:

### What Was Built

1. **Folder reorganization** — Feedback audio files now organized in 11 role subfolders (hos, ae, cso, se, tac, vc, ve, ds, sm, consultant, kirk) + generic files at root

2. **Code updates** — Updated `getSubfolder()` in voicePlayback.ts to route feedback triggers to correct role subfolder based on trigger name prefixes

3. **Kirk card support** — Added kirk-raise, kirk-ceo, kirk-nobel to CRITICAL_HOS_CARDS in useVoicePlayback.ts

4. **--kirk flag** — Added --kirk flag to generate-all-feedback-audio.ts script for generating 6 Kirk audio files

5. **Generated Kirk audio** — Created 6 MP3 files in feedback/kirk/ directory

### Key Changes

- `src/services/voicePlayback.ts`: getSubfolder() routes feedback_hos_*, feedback_kirk*, etc. to role subfolders
- `src/hooks/useVoicePlayback.ts`: CRITICAL_HOS_CARDS includes kirk-raise, kirk-ceo, kirk-nobel
- `scripts/generate-all-feedback-audio.ts`: Supports --kirk flag for Kirk-only generation

### Verification

- Folder structure: 12 subfolders + generic files at root ✓
- HoS files in feedback/hos/ ✓
- 6 Kirk files in feedback/kirk/ ✓
- TypeScript compiles without errors ✓

## Deviation from Plan

None - plan executed exactly as specified. Pre-work (folder creation + file moving) was already done before this plan execution.

## Commits

- Commit tracking in git log

## Self-Check: PASSED

- [x] getSubfolder() correctly routes feedback triggers to role subfolders
- [x] CRITICAL_HOS_CARDS includes kirk-raise, kirk-ceo, kirk-nobel
- [x] Script accepts --kirk flag and generates exactly 6 Kirk audio files
- [x] bun run typecheck passes