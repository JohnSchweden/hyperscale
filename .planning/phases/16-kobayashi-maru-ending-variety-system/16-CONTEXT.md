# Phase 16: Kobayashi Maru Ending Variety System - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning
**Source:** Conversation analysis (Option B + Option C)

<domain>
## Phase Boundary

Transform the ending system from role-based random death types to consequence-driven educational failure. Currently 70%+ of HoS endings are AUDIT_FAILURE due to structural issues (deck mapping, boss fight defaults, fallback logic). This phase makes each ending earned by the player's choices and teaches AI governance failure modes.

### Root Causes Identified
1. **Deck Mapping**: Head of Something maps to MANAGEMENT category which defaults to AUDIT_FAILURE
2. **Boss Fight Default**: Boss fight failure always returns AUDIT_FAILURE regardless of role
3. **Content Gap**: No "Congress" thematic content exists — CONGRESS death type can never trigger
4. **Fallback Logic**: `determineDeathType()` falls through to AUDIT_FAILURE for most paths

### Current Death Endings (7 Types)
1. AUDIT_FAILURE — "The auditors have questions"
2. BANKRUPT — "Budget exhausted"
3. CONGRESS — "Called to testify"
4. FLED_COUNTRY — "International incident"
5. KIRK — "You broke the simulation" (Easter egg)
6. PRISON — "Regulatory violation"
7. REPLACED_BY_SCRIPT — "Automated out of a job"

### Current Archetypes (7 Types)
- PRAGMATIST, SHADOW_ARCHITECT, DISRUPTOR, CONSERVATIVE, BALANCED, CHAOS_AGENT, KIRK

</domain>

<decisions>
## Implementation Decisions

### Option B: Death Vector System (Real Fix)
- Add `deathVector` metadata to card outcomes — each choice pushes toward a specific death type
- Connect archetypes to likely deaths:
  - SHADOW_ARCHITECT -> PRISON
  - DISRUPTOR -> CONGRESS
  - CONSERVATIVE -> REPLACED_BY_SCRIPT
  - CHAOS_AGENT -> FLED_COUNTRY
  - PRAGMATIST -> BANKRUPT
- Add 2-3 "Congressional hearing" cards to fill the CONGRESS content gap
- Update `determineDeathType()` to consider death vector frequency from player's actual choices
- Update debrief to explain *why* the player died — connect ending to their decision pattern
- Fix boss fight death type to use role-based/vector-based death instead of hardcoded AUDIT_FAILURE
- Fix HoS deck mapping (currently MANAGEMENT -> AUDIT_FAILURE)

### Option C: Kobayashi Maru Edition
- Implement "archetype pathing" — early choices lock in tendencies, making different playthroughs feel genuinely different
- Add 3-4 "failure lessons" per death type — educational content about AI governance failure modes
- Create "try again with different strategy" prompts — encourage experimentation and replayability
- Goal: true Kobayashi Maru — educational failure sandbox where failure TEACHES, not just PUNISHES

### Design Philosophy (Locked)
- Endings must reveal the player's decision pattern
- Endings must connect to actual choices (not random)
- Each ending must teach something about AI governance
- Endings must make players want to try again with different strategy
- "You will fail. That's the point." — but failure should be educational and varied

### Claude's Discretion
- Exact death vector values/weights per card
- Implementation details of archetype pathing mechanic
- UI/UX for failure lesson presentation
- Specific wording of "try again" prompts
- Whether death vectors go on the card level or outcome level
- How to present the "why you died" explanation in debrief

</decisions>

<specifics>
## Specific Ideas

### Death Vector Logic
```
// Card outcome has death_vector hint
{
  outcome: {
    fine: -500000,
    heat: 30,
    death_vector: 'CONGRESS',
    text: "The Senate AI Subcommittee wants to know why..."
  }
}

// determineDeathType() considers vector frequency
if (deathVectors.CONGRESS > 2) return 'CONGRESS';
if (deathVectors.PRISON > 2) return 'PRISON';
```

### Debrief Explanation Example
> "You died by AUDIT_FAILURE because you took 4 cards involving regulators but avoided congressional oversight issues."

### Archetype Tension
Create mutually exclusive choices that make archetype scoring more distinct:
```
if (riskyChoices > safeChoices * 2) {
  // Clearly DISRUPTOR or CHAOS_AGENT, not PRAGMATIST
}
```

</specifics>

<deferred>
## Deferred Ideas

- Adding new death types beyond current 7
- New personality types (THE_ANALYST, THE_MENTOR, THE_PARANOID)
- Voice audio for new failure lessons (can reuse existing TTS pipeline)

</deferred>

---

*Phase: 16-kobayashi-maru-ending-variety-system*
*Context gathered: 2026-03-25 via conversation analysis*
