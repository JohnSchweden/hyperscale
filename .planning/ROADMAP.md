# Roadmap: hyperscale

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-02-20)
- ✅ **v1.1 Voice Files + Live API** — Phases 1-2 (shipped 2026-03-03)
- 📋 **v1.2 Kobayashi Maru: AI Governance Simulator** — Phases 01, 03–08

---

## v1.2: Kobayashi Maru — AI Governance Simulator

**Goal:** Transform SwipeRisk into the Kobayashi Maru for AI risk, governance, and compliance — a safe sandbox where people experience real AI incidents without real consequences.

**Core Design Principle:** "You will fail. That's the point." — Learn by breaking things in a safe environment.

**Requirements (Kobayashi Maru Framework):**

- FRAME-01 to FRAME-03: Reframe as no-win experimentation sandbox
- NOWIN-01 to NOWIN-04: Add no-win scenario cards (both options bad)
- IMMERSE-01 to IMMERSE-05: Psychological pressure + immersive effects
- RISK-01 to RISK-06: Expanded AI risk scenarios (day-to-day incidents)
- DEBRIEF-01 to DEBRIEF-12: 3-page debrief + archetype + LinkedIn share + V2 waitlist
- KIRK-01 to KIRK-02: Hidden "Kirk" path Easter egg

### Phase 01: Live API STT Research

**Goal:** Research and implement speech-to-text for microphone input
**Depends on:** None (new feature research)
**Plans:** 3 plans (✓ Complete)

Plans:
- [x] 01-01-PLAN.md — Implement STT via Gemini Live API ✓
- [x] 01-02-PLAN.md — Fix STT (debug + verify audio transmission) ✓
- [x] 01-03-PLAN.md — Fix WebSocket closing (config fix) ✓

**Details:**
Speech-to-text now working with real-time transcription. Includes low-latency mode flag.

### Phase 03: No-Win Scenario Cards

**Goal:** Add incidents where both options are bad (tradeoffs, not puzzles)
**Depends on:** Phase 01
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 03 to break down)

**Details:**
Create new card types where:
- Both swipe directions have negative consequences (different tradeoffs)
- No "correct" answer — tests judgment under ambiguity
- Mirrors real governance: choosing between bad outcomes

**Requirements:**
- NOWIN-01: Design 6+ no-win cards across roles
- NOWIN-02: Both outcomes show fine/heat/hype penalties
- NOWIN-03: Lessons explain the tradeoff, not a "right" answer
- NOWIN-04: Feedback reflects the complexity, not right/wrong

### Phase 04: Immersive Pressure Effects

**Goal:** Add psychological pressure and immersion to make it feel real
**Depends on:** Phase 01
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 04 to break down)

**Details:**
Make the simulation feel real through:
- Time pressure: Optional countdown on urgent incidents
- Escalating stakes: Heat/budget warnings intensify visuals
- Physical cues: Screen shake, flicker, heartbeat pulse, sirens
- Social pressure: "Crew" consequences (morale, team impact)
- No escape: Decisions are final, no undo

**Requirements:**
- IMMERSE-01: Add optional countdown timer on urgent incidents
- IMMERSE-02: Visual stress indicators (shake, flicker, red pulse)
- IMMERSE-03: Audio stress cues (heartbeat, alerts) when heat high
- IMMERSE-04: "Team impact" text on some outcomes (morale, culture)
- IMMERSE-05: Haptic feedback (vibration) on mobile for critical moments

### Phase 05: Expanded AI Risk Scenarios

**Goal:** Cover more day-to-day AI risk incidents people actually face
**Depends on:** Phase 03
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 05 to break down)

**Details:**
Add new incident types beyond current coverage:
- Prompt injection attacks
- Model drift / when to retrain
- Explainability gaps (black box decisions)
- Shadow AI (unsanctioned tools)
- Synthetic data leakage
- Copyright / training data provenance

**Requirements:**
- RISK-01: 2+ prompt injection incidents
- RISK-02: 2+ model drift / retraining incidents
- RISK-03: 2+ explainability / black box incidents
- RISK-04: 2+ shadow AI incidents
- RISK-05: 2+ synthetic data / copyright incidents
- RISK-06: Integrate into existing role card decks

### Phase 06: Debrief & Replay System

**Goal:** 3-page "Reveal Build-Up" ending sequence — viral shareability + V2 lead capture
**Depends on:** Phase 04
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 06 to break down)

**Details:**
3-page ending flow (The Reveal Build-Up — Myers-Briggs / Spotify Wrapped mechanic):

1. **Page 1: The Collapse** — Simulation crashes, final outcome. Button: `[Debrief Me]` (steps into Commander's office).
2. **Page 2: The Audit Trail** — "Incident Audit Log" (not boring list). Personality sign-off at bottom (e.g. V.E.R.A.: "Well, at least you were consistently terrible."). Button: `[Generate Psych Evaluation]` or `[Extract Leadership Profile]`.
3. **Page 3: The Verdict** — Archetype reveal + Resilience Score. Primary: `[Share to LinkedIn]` (e.g. "I just faced the Kobayashi Maru as a CTO. My Resilience Score: 88% (Pragmatist)."). Secondary: `[Reboot System]`. V2 Upsell: Email capture for "self-learning adversary" waitlist.

**PLG loop:** Low-friction entry → high engagement → high ego-reward ending → viral share → lead capture.

**Requirements:**
- DEBRIEF-01: Post-game summary screen with decision history
- DEBRIEF-02: Map violations to real-world consequences
- DEBRIEF-03: "Unlock all endings" progress + encouragement
- DEBRIEF-04: Optional "What would you do differently?" reflection
- DEBRIEF-05: 3-page flow (Collapse → Audit Trail → Verdict)
- DEBRIEF-06: Page 1 — [Debrief Me] CTA on Game Over
- DEBRIEF-07: Page 2 — Incident Audit Log + personality sign-off
- DEBRIEF-08: Page 2 — In-universe button ([Generate Psych Evaluation] / [Extract Leadership Profile])
- DEBRIEF-09: Page 3 — Archetype verdict + Resilience Score
- DEBRIEF-10: Page 3 — LinkedIn share (role + archetype + score)
- DEBRIEF-11: Page 3 — V2 waitlist email capture
- DEBRIEF-12: Archetype system — map decision patterns to personality types

### Phase 07: Kirk Easter Egg

**Goal:** Hidden path to "change the conditions of the test"
**Depends on:** Phase 06
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 07 to break down)

**Details:**
Kobayashi Maru had one solution: cheat the test. Add a hidden path:
- Specific sequence or choice (e.g., "Escalate to Legal," "Request extension")
- Different ending: "You changed the conditions of the test"
- Rewards creative thinking outside the binary swipe options

**Requirements:**
- KIRK-01: Design hidden interaction (not obvious swipe choice)
- KIRK-02: Unique ending screen + personality reaction

### Phase 08: Kobayashi Maru Framing (deferred)

**Goal:** Reframe SwipeRisk as an explicit no-win experimentation sandbox
**Depends on:** Phase 07
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 08 to break down)

**Details:**
Update intro, onboarding, and messaging to explicitly frame the experience as:
- "You will fail. That's the point."
- "Experiment freely — try risky options, see what happens."
- "Learn by breaking things — no real consequences."
- Character test focus: values and judgment, not "winning."

**Requirements:**
- FRAME-01: Update intro screen with Kobayashi Maru framing
- FRAME-02: Add "This is a simulation" messaging throughout
- FRAME-03: Personality onboarding acknowledges experimentation is safe

---

## Progress

| Phase | Goal | Milestone | Status |
|-------|------|-----------|--------|
| 1-4 | Core game | v1.0 | Complete |
| 1-2 | Voice Files + Live API | v1.1 | Complete |
| 01 | Live API STT Research | v1.2 | Complete |
| 03 | No-Win Scenario Cards | v1.2 | Not started |
| 04 | Immersive Pressure Effects | v1.2 | Not started |
| 05 | Expanded AI Risk Scenarios | v1.2 | Not started |
| 06 | Debrief & Replay System | v1.2 | Not started |
| 07 | Kirk Easter Egg | v1.2 | Not started |
| 08 | Kobayashi Maru Framing (deferred) | v1.2 | Deferred |

---

*Roadmap updated: 2026-03-04 — Phase 02 deferred to Phase 08*
