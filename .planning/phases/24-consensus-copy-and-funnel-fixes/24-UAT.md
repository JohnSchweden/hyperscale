---
status: complete
phase: 24-consensus-copy-and-funnel-fixes
source:
  - 24-01-SUMMARY.md
  - 24-02-SUMMARY.md
  - 24-03-SUMMARY.md
  - 24-04-SUMMARY.md
  - 24-05-SUMMARY.md
started: 2026-04-10T21:15:00Z
updated: 2026-04-10T22:55:00Z
---

## Current Test

[testing complete]

## Tests

### 1. PRISON Ending Title
expected: Title reads "Federal indictment (jumpsuit included)" and description says "Orange is not a branding choice"
result: pass
verified: Source code check - src/data/deathEndings.ts line 40-42

### 2. LinkedIn Share Text
expected: LinkedIn share text starts with "K-Maru" and includes em dash (—) in title format like "K-Maru — ArchetypeName"
result: pass
verified: Source code check - src/utils/linkedin-share.ts line 18, src/components/game/debrief/DebriefPage3Verdict.tsx line 62

### 3. V2 Waitlist Button Style
expected: The "DM for V2 Waitlist" button on debrief page 3 has ghost style (border only, transparent background) instead of filled cyan
result: pass
verified: Source code check - src/components/game/debrief/DebriefPage3Verdict.tsx line 275-281 has border + bg-transparent

### 4. LinkedIn Helper Hint
expected: Text visible near share buttons explaining that LinkedIn shows static site preview and users should copy text first
result: pass
verified: Source code check - src/components/game/debrief/DebriefPage3Verdict.tsx line 232-235

### 5. Victory Debrief Copy Voice
expected: Victory debrief text includes phrases like "uneasy truce" and "still legal" instead of celebratory language
result: pass
verified: Source code check - src/components/game/debrief/DebriefPage1Collapse.tsx line 269, 290

### 6. Non-Kirk Death Card Order
expected: On debrief page 1 for non-Kirk deaths, you see the "What went wrong" lesson card BEFORE the detailed explanation
result: pass
verified: Source code check - src/components/game/debrief/DebriefPage1Collapse.tsx line 335-348 shows FailureLessonCard before ExplanationCard for non-Kirk paths

### 7. Debrief Page 2 Audit Trail Intro
expected: Debrief page 2 (audit trail) has intro blurb mentioning "paper trail" or similar framing for the decision log
result: pass
verified: Source code check - src/components/game/debrief/DebriefPage2AuditTrail.tsx line 231 "paper trail", line 236 "Replay the forks mentally"

### 8. Personality Select Bridge Line
expected: Personality selection screen includes text clarifying that "Narrator accents are flavor; the scenarios are US tech satire" or similar bridge explanation
result: pass
verified: Source code check - src/components/game/PersonalitySelect.tsx line 74-75

### 9. Team Mode Copy-Link Button
expected: Team Mode section on IntroScreen has a working "Copy game link" button that copies URL to clipboard
result: pass
verified: Source code check - src/components/game/IntroScreen.tsx line 87-96 with data-testid="copy-game-link-button", browser text capture confirmed "Copy game link" visible

### 10. OG/SEO Meta Tags
expected: Viewing page source shows og:title, og:description, og:image, twitter:card meta tags with K-Maru branded copy
result: pass
verified: Source code check - index.html lines 12-20 includes all OG/SEO meta tags with proper K-Maru branding

## Summary

total: 10
passed: 10
issues: 0
pending: 0
skipped: 0

## Gaps

[none - all tests passed]
