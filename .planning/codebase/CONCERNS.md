# Codebase Concerns

**Analysis Date:** 2026-03-01

## Tech Debt

### Limited Game Content
- **Issue:** Only 2 cards per role = 12 total incidents. Game ends after ~6 swipes
- **Files:** `constants.ts` (ROLE_CARDS)
- **Impact:** Very short gameplay experience, low replay value
- **Fix approach:** Add more cards per role (target 10+ per role)

### Hardcoded Voice Triggers
- **Issue:** Voice feedback triggers are hardcoded with extensive if/else chains for specific card IDs (lines 478-526 in `App.tsx`)
- **Files:** `App.tsx`
- **Impact:** Adding new cards requires updating voice trigger logic; many cards default to generic "feedback_ignore"
- **Fix approach:** Add `voiceTrigger` field to Card type in constants.ts

## Known Bugs

### Boss Fight Question Index Mismatch
- **Issue:** Boss fight always shows 5 questions but `BOSS_FIGHT_QUESTIONS` array has exactly 5 items. The win condition requires 3+ correct but there's no guarantee questions won't repeat.
- **Files:** `App.tsx` lines 795-805
- **Impact:** Players could potentially get same question twice
- **Fix approach:** Shuffle questions or ensure no repeat

### Missing Boss Fight State Reset on Role Change
- **Issue:** When restarting game (`restart()` function), boss fight state is reset but if returning from SUMMARY to INTRO directly, some state might persist
- **Files:** `App.tsx` line 819-827
- **Impact:** Residual boss fight state could affect new game
- **Fix approach:** Ensure all state is reset in the RESET action

### Swipe Race Condition
- **Issue:** Using both RAF (`rafRef`) and `animationTimeoutRef` for swipe handling can cause race conditions where swipe doesn't complete properly
- **Files:** `App.tsx` lines 626-680
- **Impact:** Card may not animate off screen or may get stuck
- **Fix approach:** Use single animation state machine with useEffect cleanup

## Security Considerations

### No Input Validation on Roast Feature
- **Issue:** User input to the roast feature is sent directly to Gemini without sanitization
- **Files:** `services/geminiService.ts` line 131-141
- **Risk:** Prompt injection if malicious input crafted
- **Recommendations:** Sanitize user input before including in prompt

### Console Error Logging in Production
- **Issue:** Multiple `console.error` calls throughout App.tsx for non-critical failures (voice playback, etc.)
- **Files:** `App.tsx` throughout
- **Risk:** Exposes internal state to browser dev tools in production
- **Recommendations:** Wrap console.error in NODE_ENV check

## Performance Bottlenecks

### Large Re-render on State Change
- **Issue:** Entire App component re-renders on any state change due to single large component
- **Files:** `App.tsx`
- **Cause:** No React.memo on most render functions, all state in single component
- **Improvement path:** Extract render functions as memoized components; use selector pattern for state

### Audio Memory Leak Potential
- **Issue:** Audio URL objects created via `URL.createObjectURL` may not be revoked if component unmounts mid-playback
- **Files:** `services/voicePlayback.ts` line 35
- **Cause:** Blob URL created but cleanup depends on subsequent loadVoice call
- **Improvement path:** Add cleanup in unmount effect or useRef to track URLs for cleanup

### Inefficient Card Rendering
- **Issue:** Card stack renders next card behind current card on every render, even when not needed
- **Files:** `App.tsx` lines 1024-1067
- **Impact:** Unnecessary DOM nodes created
- **Improvement path:** Memoize next card rendering based on currentCardIndex

## Fragile Areas

### Stage Transition Validation
- **Issue:** Stage transitions validated by `STAGE_TRANSITIONS` map but invalid transitions only log error and return same state - silent failure
- **Files:** `App.tsx` lines 116-122
- **Why fragile:** No UI feedback when transition fails, user stuck
- **Safe modification:** Add state to show error or fallback to INTRO
- **Test coverage:** No test coverage for invalid transitions

### Feedback Overlay Keyboard Handler
- **Issue:** `nextIncident` in dependency array of keyboard handler effect but `nextIncident` recreated on every render due to closures
- **Files:** `App.tsx` lines 777-787
- **Why fragile:** Could add stale event listeners or miss dismissals
- **Safe modification:** Wrap `nextIncident` in useCallback with proper dependencies

### Card ID String Matching
- **Issue:** Voice trigger logic uses string equality on card IDs (e.g., `cardId === 'dev_1'`)
- **Files:** `App.tsx` lines 478-510
- **Why fragile:** Typo in string breaks feature silently; no fallback for unknown cards
- **Safe modification:** Use enum or constant for card IDs

## Scaling Limits

### Game State Not Persisted
- **Current capacity:** Single session only
- **Limit:** Game progress lost on refresh
- **Scaling path:** Add localStorage persistence for gameState

### No Progressive Difficulty
- **Current capacity:** Same 2 cards per role always
- **Limit:** No scaling based on player performance
- **Scaling path:** Add difficulty tiers or shuffle card order

### Hardcoded Budget Values
- **Current capacity:** INITIAL_BUDGET = 10,000,000, fines are static
- **Limit:** Can't scale for different difficulty levels
- **Scaling path:** Make budget and fines configurable constants

## Dependencies at Risk

### @google/genai Package
- **Risk:** Uses bleeding-edge model "gemini-2.5-flash-preview-tts" which may change or be deprecated
- **Impact:** TTS feature could break without notice
- **Migration plan:** Pin to specific version or use stable TTS API alternative

### React 19
- **Risk:** Using React 19.2.4 which is very new; some patterns may not be stable
- **Impact:** Potential breaking changes in future minor versions
- **Migration plan:** Pin to specific version, test thoroughly on updates

## Missing Critical Features

### Game Completion Celebration
- **Problem:** Winning the game (SUMMARY) has no special unlock or achievement tracking beyond endings
- **Blocks:** Replay incentive
- **Priority:** Medium

### Sound/Music Toggle
- **Problem:** No way to mute or adjust game sounds; voice plays automatically
- **Blocks:** Accessibility and user preference
- **Priority:** High

### Mobile Gesture Conflicts
- **Problem:** Swipe gestures may conflict with browser back/forward gestures
- **Blocks:** Smooth mobile experience
- **Priority:** Medium

### Accessibility Issues
- **Problem:** Limited keyboard navigation beyond arrow keys; no screen reader announcements for game state
- **Blocks:** Accessibility compliance
- **Priority:** High

## Test Coverage Gaps

### No Unit Tests for Game Logic
- **What's not tested:** `gameReducer`, death determination, stage transitions
- **Files:** `App.tsx`
- **Risk:** Logic bugs in state management could go unnoticed
- **Priority:** High

### No Tests for API/Service Layer
- **What's not tested:** geminiService, voicePlayback error paths
- **Files:** `services/*.ts`
- **Risk:** API failures not handled gracefully in all cases
- **Priority:** Medium

### Missing Boss Fight Tests
- **What's not tested:** Timer logic, answer scoring, win/lose conditions
- **Files:** `App.tsx`
- **Risk:** Timer edge cases could cause unexpected behavior
- **Priority:** Medium

### No E2E for Full Game Flow
- **What's not tested:** Complete game from intro to summary/death
- **Files:** tests/*.spec.ts
- **Risk:** Integration issues between stages
- **Priority:** Medium

---

*Concerns audit: 2026-03-01*
