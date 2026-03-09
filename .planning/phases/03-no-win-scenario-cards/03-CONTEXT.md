# Phase 03: No-Win Scenario Cards - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning
**Source:** Inline specification with Kobayashi Maru framework

<domain>
## Phase Boundary

Transform SwipeRisk cards to explicitly embrace the Kobayashi Maru no-win paradigm. Every card and outcome pair forces a choice between bad options with different tradeoffs. The goal is NOT to win or find the "right" answer, but to expose how people handle pressure, ambiguity, and failure.

</domain>

<decisions>
## Implementation Decisions

### Card Design (No-Win Pattern)
- **No dominant strategy:** Both left/right swipes lead to negative consequences (different kinds of loss)
- **Reusable across roles:** Same scenario can appear with different context OR different outcome focuses per role
- **8-10 cards minimum per role:** Expand card pools for each role with deep scenario variety
- **Web use cases:** Research real AI incidents online; reuse scenarios with reformulated text/focus for each role
- **Existing cards:** Reframe current cards to match no-win pattern (both outcomes are losses, not right/wrong)

### Kobayashi Maru Elements
- **Psychological pressure:** Time limits, escalating stakes, incomplete info (ambiguity forces quick choices)
- **Social pressure:** Crew/team consequences visible (e.g. "Marketing morale hits bottom," "Legal escalates")
- **Character over skill:** Cards test values, leadership, emotional resilience — not technical problem-solving
- **Emotional cost:** Losses are visible and personal (budget, team, reputation, freedom)
- **No escape:** Decisions final; no undo or skip
- **Debrief readiness:** Lessons explain the tradeoff, not a "right" answer; post-game summary maps choices → outcomes

### Scenario Variety
- **Multiple failure modes:** Different ways to lose (bankruptcy, prison, audit failure, scandal, etc.)
- **Progressive failure:** Not instant game over — cost unfolds visibly (crew dies, systems fail, budget drains, heat rises)
- **Resource tradeoffs:** Limited budget, crew, time — every choice has visible cost
- **Ambiguous choices:** Some cards where both options are genuinely unclear; logic alone can't solve them

### Frame & Tone
- **Intro framing:** "You will fail. That's the point." — Test of character, not a winnable game
- **Outcomes:** Both swipes show penalties (fine, heat, hype impact). Feedback reflects complexity/tradeoff, not winner/loser
- **Lessons:** Explain why it's a lose-lose, not declare a "right" choice

## Claude's Discretion
- Card narrative voice (sarcastic corporate? urgent crisis? bureaucratic absurdity?)
- Specific failure modes for each role (what does each role uniquely risk?)
- Audio/visual stress cues (when to escalate heartbeat, sirens, screen shake?)
- Post-game debrief template and archetype mapping

</decisions>

<specifics>
## Specific Ideas

### Card Pool Targets
- **No-Win Dilemmas:** 6+ cards per role where both options have serious tradeoffs (e.g., "Fire the ML engineer vs push to production")
- **Prompt Injection Scenarios:** 2+ per role (security vs. usability, blame vectors)
- **Model Drift / Retraining:** 2+ per role (cost vs. accuracy, when to pull trigger?)
- **Explainability / Black Box:** 2+ per role (audit risk vs. deployment speed)
- **Shadow AI / Unauthorized Tools:** 2+ per role (innovation vs. governance, job security)
- **Copyright / Data Provenance:** 2+ per role (cost-cutting vs. legal exposure)

### Role-Specific Framing Examples
- **CEO:** "Save the IPO vs. disclose the incident?" (timing, shareholder impact)
- **CTO:** "Rewrite the pipeline vs. patch on top?" (technical debt vs. timeline)
- **Data Scientist:** "Retrain on new data vs. freeze model?" (drift risk vs. resource burn)
- **ML Engineer:** "Escalate to legal vs. quiet fix?" (accountability vs. career)

### Reusability Pattern
A single scenario (e.g., "Prompt injection in production") can spawn:
1. **Same scenario, different context:** "Security team finds it" vs. "Customer discovers via API"
2. **Same scenario, different outcome focus:** CEO sees liability risk; Engineer sees technical fix; Data Scientist sees model impact

### Time Pressure Integration
- Optional countdown on ~20% of cards (not all — preserve thinking time)
- Shorter timers on high-stakes decisions to amplify pressure/error
- Timer expiry = auto-choose (penalizes indecision)

</specifics>

<deferred>
## Deferred Ideas

- **Image assets for cards** — Deferred to Phase 13 (Image Asset Pipeline)
- **Card animation/visual effects** — Deferred to Phase 09 (Visual Effects)
- **Settings/accessibility overrides** — Deferred to Phase 11 (Settings Integration)
- **Debrief screen wiring** — Deferred to Phase 06 (Debrief & Replay System) — this phase adds cards only

</deferred>

---

*Phase: 03-no-win-scenario-cards*
*Context gathered: 2026-03-09 via inline specification*
*Framework: Kobayashi Maru no-win experiential learning*
