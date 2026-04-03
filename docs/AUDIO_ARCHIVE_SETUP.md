# Audio Archive Setup - Implementation Summary

## Changes Made

### 1. Modified `scripts/compress-audio.ts`
- Added `deleteWav?: boolean` option (default: `true` - opt-out)
- Added `archiveDir?: string` option (default: `"audio-archive"`)
- Added `archiveWavFile()` function to copy WAVs to archive before compression
- WAV files are now automatically archived and deleted after successful Opus+MP3 creation
- Archive maintains subfolder structure: `audio-archive/{personality}/{category}/`

### 2. Updated `.gitignore`
```
# Audio source files (archived WAVs)
audio-archive/
*.wav
```

### 3. Archived Existing WAV Files
- **93 WAV files** copied from `public/audio/voices/` to `audio-archive/`
- Preserved folder structure:
  - `audio-archive/{roaster,zenmaster,lovebomber}/{archetype,death,feedback,core}/`

### 4. Deleted Original WAV Files
- **93 WAV files** removed from `public/audio/voices/`
- Only **186 compressed files** remain (93 Opus + 93 MP3)

## File Counts

| Location | Files | Size | Git Status |
|----------|-------|------|------------|
| `audio-archive/` | 93 WAV | 29MB | Ignored |
| `public/audio/voices/` | 186 (Opus+MP3) | 21MB | Tracked |

## Future Audio Generation

All generation scripts now automatically:
1. Generate WAV file
2. **Archive** to `audio-archive/` (preserving structure)
3. **Compress** to Opus (96kbps) and MP3 (192kbps)
4. **Delete** original WAV from `public/audio/voices/`

Scripts affected:
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

## Usage

### To opt-out of deletion (keep WAV in public/):
```typescript
await compressAudioFile(outputPath, { deleteWav: false });
```

### To change archive location:
```typescript
await compressAudioFile(outputPath, { archiveDir: "custom-archive" });
```

### To compress existing files (manually):
```bash
# Single file
bun run scripts/compress-audio.ts file path/to/audio.wav

# Directory
bun run scripts/compress-audio.ts directory path/to/directory
```

## Benefits

- ✅ **Reduced repo size**: ~29MB less going forward (only compressed formats tracked)
- ✅ **Source preserved**: WAV masters archived locally for future use
- ✅ **Automatic**: Future generations auto-archive and cleanup
- ✅ **Type-safe**: Full TypeScript support for new options
- ✅ **Backward compatible**: Existing scripts work without changes

## Notes

- Git history still contains old WAV files (repo remains ~92MB)
- Future commits will only include compressed formats
- To remove WAVs from git history completely, use `git filter-repo` or similar tools
- Audio archive is local-only (git-ignored), each developer maintains their own

---
*Implemented: 2026-03-24*
