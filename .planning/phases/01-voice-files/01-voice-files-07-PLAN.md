---
phase: 01-voice-files
plan: 07
type: execute
wave: 4
depends_on: [01-voice-files-05]
files_modified: []
autonomous: false

must_haves:
  truths:
    - "Zen Master onboarding, victory, failure voices play correctly"
    - "Lovebomber onboarding, victory, failure voices play correctly"
  artifacts: []
  key_links: []
---

<objective>
Test Zen Master and Lovebomber voice playback integration

Purpose: Verify that Zen Master and Lovebomber voice files play correctly at the right game triggers
Output: Verified Zen Master and Lovebomber voice playback
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
  <what-built>Zen Master and Lovebomber voice playback integration (6 voice files + game triggers)</what-built>
  <how-to-verify>
## Zen Master Testing:
1. Start the dev server: `npm run dev` (if not already running)
2. Open browser to http://localhost:5173
3. Select "Zen Master (Bamboo)" personality
4. Verify onboarding voice plays (you should hear: "Namaste, corporate warrior...")
5. Win a game - verify victory voice plays ("Balance is achieved...")
6. Lose a game - verify failure voice plays ("Breathe in... and breathe out...")

## Lovebomber Testing:
1. Select "Lovebomber (Hype-Bro)" personality
2. Verify onboarding voice plays (you should hear: "OMG HI!! We are literally...")
3. Win a game - verify victory voice plays ("YOOO! We crushed those KPIs!...")
4. Lose a game - verify failure voice plays ("Bro! That breach was MASSIVE!...")

## Error Handling (for any personality):
- Test by temporarily renaming a file, verify narrative error appears
  </how-to-verify>
  <resume-signal>Type "approved" if all Zen Master and Lovebomber voices work correctly, or describe issues found</resume-signal>
</task>

</tasks>

<verification>
- [ ] Zen Master onboarding plays
- [ ] Zen Master victory plays
- [ ] Zen Master failure plays
- [ ] Lovebomber onboarding plays
- [ ] Lovebomber victory plays
- [ ] Lovebomber failure plays
- [ ] Error handling shows narrative message when file missing
</verification>

<success_criteria>
All Zen Master and Lovebomber voice triggers work correctly
</success_criteria>

<output>
After completion, create `.planning/phases/01-voice-files/01-voice-files-07-SUMMARY.md`
</output>
