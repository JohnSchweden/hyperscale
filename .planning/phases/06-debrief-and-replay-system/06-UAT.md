---
status: testing
phase: 06-debrief-and-replay-system
source: 06-01-SUMMARY.md, 06-02-SUMMARY.md, 06-03-SUMMARY.md, 06-04-SUMMARY.md, 06-05-SUMMARY.md
started: ${TIMESTAMP}
updated: ${TIMESTAMP}
---

## Current Test

number: 1
name: 3-Page Debrief Flow - Page 1 (Collapse)
expected: |
  When you reach Game Over, you see a screen with:
  - Death type/cause (e.g., "FIRED", "BANKRUPTCY")
  - Final metrics (Budget, Heat, Hype)
  - A [Debrief Me] button to continue
awaiting: user response

## Tests

### 1. 3-Page Debrief Flow - Page 1 (Collapse)
expected: Game Over screen shows death type, final metrics (budget/heat/hype), and [Debrief Me] button
result: [pending]

### 2. 3-Page Debrief Flow - Page 2 (Audit Trail)
expected: Clicking [Debrief Me] shows audit trail with decision history, cards played, choices made, and personality-specific commentary
result: [pending]

### 3. 3-Page Debrief Flow - Page 3 (Verdict)
expected: Clicking [View Verdict] shows archetype classification (e.g., "Pragmatist"), resilience score (0-100%), [Share to LinkedIn] button, and [Reboot System] button
result: [pending]

### 4. LinkedIn Share Functionality
expected: Clicking [Share to LinkedIn] opens LinkedIn share dialog in new window with pre-filled text including role, archetype, and resilience score
result: [pending]

### 5. Email Capture Form
expected: On Page 3, an email capture form appears with validation. Entering valid email and clicking submit shows success message. Invalid email shows error.
result: [pending]

### 6. Unlock Progress Display
expected: On Page 1, a prominent display shows "You've unlocked X/6 endings" with trophy icons and encouragement to replay
result: [pending]

### 7. Reflection Prompt with Hints
expected: On Page 2, a reflection section asks "What would you do differently?" and shows hints for safe choices suggesting riskier alternatives
result: [pending]

### 8. Personality-Specific Language
expected: Different personality types (V.E.R.A., ZEN_MASTER, LOVEBOMBER) show different tones in commentary and replay encouragement
result: [pending]

### 9. Cold Start Smoke Test
expected: Kill dev server, clear storage, start fresh. Game loads, plays through to game over, and full debrief flow works without errors
result: [pending]

## Summary

total: 9
passed: 0
issues: 0
pending: 9
skipped: 0

## Gaps

[none yet]
