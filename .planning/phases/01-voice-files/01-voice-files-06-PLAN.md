---
phase: 01-voice-files
plan: 06
type: execute
wave: 4
depends_on: [01-voice-files-05]
files_modified: []
autonomous: false

must_haves:
  truths:
    - "Roaster onboarding voice plays on game start"
    - "Roaster feedback voices play after card swipes"
    - "Roaster victory voice plays on win"
    - "Roaster failure voice plays on loss"
  artifacts: []
  key_links: []
---

<objective>
Test Roaster voice playback integration

Purpose: Verify that all Roaster voice files play correctly at the right game triggers
Output: Verified Roaster voice playback
</objective>

<execution_context>
@/Users/yevgenschweden/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/yevgenschweden/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/phases/01-voice-files/01-CONTEXT.md
</context>

<tasks>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Roaster voice playback integration (7 voice files + game triggers)</what-built>
  <how-to-verify>
1. Start the dev server: `npm run dev`
2. Open browser to http://localhost:5173
3. Select "Roaster (V.E.R.A.)" personality
4. Verify onboarding voice plays (you should hear: "Oh, look. Another 'Visionary' hired...")
5. Swipe through a few cards (both left and right)
6. Verify feedback voices play after each swipe (different messages for paste, debug, install, ignore)
7. Win a game (reach boss fight and answer correctly) - verify victory voice plays
8. Lose a game (fail boss fight or lose all hype) - verify failure voice plays
9. Test error handling: temporarily rename one file, reload, verify narrative error appears
  </how-to-verify>
  <resume-signal>Type "approved" if all Roaster voices work correctly, or describe issues found</resume-signal>
</task>

</tasks>

<verification>
- [ ] Onboarding plays for Roaster
- [ ] At least 2 feedback voices play (test different outcomes)
- [ ] Victory plays for Roaster
- [ ] Failure plays for Roaster
- [ ] Error handling shows narrative message when file missing
</verification>

<success_criteria>
Roaster personality has all 7 voice triggers working correctly
</success_criteria>

<output>
After completion, create `.planning/phases/01-voice-files/01-voice-files-06-SUMMARY.md`
</output>
