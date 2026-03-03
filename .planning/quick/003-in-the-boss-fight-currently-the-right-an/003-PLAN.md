---
phase: quick
plan: 003
type: execute
wave: 1
depends_on: []
files_modified:
  - hooks/useBossFight.ts
autonomous: true
user_setup: []
must_haves:
  truths:
    - "Right answers appear in random positions (not always first)"
    - "All 4 answer positions equally likely for correct answer"
  artifacts:
    - path: "hooks/useBossFight.ts"
      provides: "Randomized answer positioning"
      min_lines: 65
      contains: "sort.*random"
  key_links:
    - from: "hooks/useBossFight.ts"
      to: "BossFight.tsx"
      via: "fixedAnswers prop"
      pattern: "fixedAnswers.*sort"
---

<objective>
Randomize the position of the correct answer in boss fight questions.

Purpose: Currently the correct answer always appears as the first option (position A), making it predictable. Randomizing makes the quiz challenging.

Output: Updated useBossFight hook with randomized answer ordering.
</objective>

<execution_context>
@/Users/yevgenschweden/.config/opencode/get-shit-done/workflows/execute-plan.md
@/Users/yevgenschweden/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@hooks/useBossFight.ts
@components/game/BossFight.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Randomize answer position in useBossFight</name>
  <files>hooks/useBossFight.ts</files>
  <action>
    In hooks/useBossFight.ts, line 62, change:
    
    FROM:
    const fixedAnswers = question ? [question.correctAnswer, ...question.wrongAnswers] : [];
    
    TO:
    const fixedAnswers = question 
      ? [question.correctAnswer, ...question.wrongAnswers].sort(() => Math.random() - 0.5)
      : [];
    
    This shuffles all 4 answers randomly so the correct answer appears in a random position each question.
  </action>
  <verify>Run tests: bunx playwright test tests/stage-snapshots.spec.ts -t "boss-fight" to verify boss fight still renders correctly</verify>
  <done>Fixed answers are now randomized - correct answer can appear in any of the 4 positions (A, B, C, or D)</done>
</task>

</tasks>

<verification>
1. Start dev server: bun dev
2. Navigate to boss fight multiple times
3. Verify correct answer appears in different positions across questions
</verification>

<success_criteria>
- Correct answer is no longer always in position A
- All positions (A, B, C, D) are equally likely for the correct answer
- No visual regressions in boss fight UI
</success_criteria>

<output>
After completion, create `.planning/quick/003-in-the-boss-fight-currently-the-right-an/003-SUMMARY.md`
</output>
