# Roadmap: hyperscale

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-02-20)
- ✅ **v1.1 Voice Files + Live API** — Phases 1-2 (shipped 2026-03-03)
- 📋 **v1.2 Kobayashi Maru: AI Governance Simulator** — Phases 01–14

---

## v1.2: Kobayashi Maru — AI Governance Simulator

**Goal:** Transform K-Maru into the Kobayashi Maru for AI risk, governance, and compliance — a safe sandbox where people experience real AI incidents without real consequences.

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

### Phase 02: New Role Set (Impact Zones)

**Goal:** Replace current roles with new "impact zone" set; comment out legacy roles for later
**Depends on:** Phase 01
**Plans:** 2 plans (✓ Complete)

Plans:
- [x] 02-01-PLAN.md — Foundation: RoleType, roles metadata, deck aliases, runtime wiring ✓
- [x] 02-02-PLAN.md — RoleSelect UI copy + test updates (navigation, snapshots) ✓

**Details:**
Replace role select (step_02 // damage_control) with new copy and roles:
- **Heading:** "Select your impact zone"
- **Copy:** "Choose the specific silo you want to set on fire first. Each role changes the cascading failures, the legal heat you attract, and the creative ways to lose that $10M budget."

**New roles (comment out DEVELOPMENT, MARKETING, MANAGEMENT, HR, FINANCE, CLEANING):**
- Chief Something Officer (The Blame-Shifter)
- Head of Something (The Middle-Management Shield)
- Something Manager (The Spreadsheet Warrior)
- Tech/AI Consultant (The Powerpoint Mercenary)
- Data Scientist (The Hallucination Wrangler)
- Software Architect (The Technical Debt Collector)
- Software Engineer (The Bug Manufacturer)
- Vibe Coder (The Prompt Magician)
- Vibe Engineer (The Latency Alchemist)
- Agentic Engineer (The Puppet Master of Rogue Bots)

Map new roles to existing card decks until role-specific cards added in Phase 05.

**Requirements:**
- ROLE-01: Comment out legacy RoleType enum values (preserve for later)
- ROLE-02: Add new RoleType values and ROLE_DESCRIPTIONS
- ROLE-03: Update RoleSelect UI (impact zone copy, icons)
- ROLE-04: Map ROLE_CARDS to existing decks (development, management, etc.)

### Phase 03: No-Win Scenario Cards

**Goal:** Add incidents where both options are bad (tradeoffs, not puzzles)
**Depends on:** Phase 02
**Plans:** 4 plans

Plans:
- [ ] 03-01-PLAN.md — Test scaffolding + card validation framework
- [ ] 03-02-PLAN.md — Generate 80+ no-win scenario cards across all roles
- [ ] 03-03-PLAN.md — Integrate pressure metadata + shuffle testing
- [ ] 03-04-PLAN.md — UAT verification and sign-off

**Details:**
Create 80+ no-win scenario cards where:
- Both swipe directions have negative consequences (different tradeoffs)
- No "correct" answer — tests judgment under ambiguity
- Mirrors real governance: choosing between bad outcomes
- Incident types: No-Win Dilemmas, Prompt Injection, Model Drift, Explainability, Shadow AI, Copyright
- 8-10 cards per role minimum
- ~20% of cards marked with time pressure (high-stakes decisions)
- All incidents sourced from 2024-2025 documented cases
- Role-specific framing (same scenario, different organizational lens)
- 3-voice personality feedback (ROASTER cynical, ZEN_MASTER wisdom, LOVEBOMBER enthusiasm)

**Requirements:**
- NOWIN-01: 6+ no-win cards per role (achieved 8-10 per role, 80+ total)
- NOWIN-02: Both outcomes show fine/heat/hype penalties (automated validation)
- NOWIN-03: Lessons explain the tradeoff, not a "right" answer
- NOWIN-04: Feedback reflects the complexity, not right/wrong

### Phase 04: Immersive Pressure Effects

**Goal:** Add psychological pressure and immersion to make it feel real
**Depends on:** Phase 01
**Plans:** 9/10 plans (04-10 gap closure in progress)

Plans:
- [x] 04-01-PLAN.md — Pressure metadata, useIncidentPressure, timer/undo orchestration ✓
- [x] 04-02-PLAN.md — Countdown UI, HUD escalation, shake/flicker/pulse visuals ✓
- [x] 04-03-PLAN.md — Audio cues, haptics, team-impact in FeedbackOverlay ✓
- [x] 04-04-PLAN.md — Gap: useCountdown reset, pressureAudio ctx.resume ✓
- [x] 04-05-PLAN.md — Gap: HUD escalation in overlay, haptic from gesture handlers ✓
- [x] 04-06-PLAN.md — Gap: Timer natural expiry (hasTickedWhileActive), no restart ✓
- [x] 04-07-PLAN.md — Gap: isCritical=heatHigh, heartbeat +10% volume ✓
- [x] 04-08-PLAN.md — Gap: Haptic in touch-swipe path (onBeforeSwipe) ✓
- [x] 04-09-PLAN.md — Automatic haptic triggers: critical state + timer expiry ✓
- [ ] 04-10-PLAN.md — Gap: Heartbeat on Android Chrome (first-sound-in-gesture)

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
**Plans:** 5 plans (✓ Planning complete)

Plans:
- [ ] 05-01-PLAN.md — Test scaffold: incident sourcing, no-win validation, personality feedback, integration ✓
- [ ] 05-02-PLAN.md — Prompt injection + model drift cards (40 total: 2 per category × 5 decks) ✓
- [ ] 05-03-PLAN.md — Explainability + shadow AI cards (40 total: 2 per category × 5 decks) ✓
- [ ] 05-04-PLAN.md — Synthetic data/copyright cards + distribution verification (10 total, 50+ complete) ✓
- [ ] 05-05-PLAN.md — UAT checkpoint: human gameplay verification ✓

**Details:**
Add 50+ new incident cards across 5 categories:
- **Prompt injection:** Security vs. usability tradeoff (GitHub Copilot RCE, financial jailbreak, e-commerce manipulation)
- **Model drift:** Accuracy vs. resource cost (retraining decisions, bias, stale models)
- **Explainability:** Audit risk vs. deployment speed (EU AI Act, black box governance, regulatory deadlines)
- **Shadow AI:** Innovation vs. governance (unauthorized Claude/ChatGPT, vendor governance, team morale)
- **Synthetic data/copyright:** Cost vs. legal exposure (training data provenance, lawsuit settlement)

All incidents sourced from documented 2024-2025 cases. Role-specific framing (same incident, different organizational lens). 3-personality feedback. ~20% time pressure.

**Requirements:**
- RISK-01: 2+ prompt injection incidents per role (20 cards)
- RISK-02: 2+ model drift / retraining incidents per role (20 cards)
- RISK-03: 2+ explainability / black box incidents per role (20 cards)
- RISK-04: 2+ shadow AI incidents per role (20 cards)
- RISK-05: 2+ synthetic data / copyright incidents per role (10 cards)
- RISK-06: Integrate into existing role card decks (all 10 new roles have 10+ cards each)

### Phase 06: Debrief & Replay System

**Goal:** 3-page "Reveal Build-Up" ending sequence — viral shareability + V2 lead capture
**Depends on:** Phase 04
**Plans:** 19/19 plans complete

Plans:
- [x] 06-01-PLAN.md — Archetype system foundation (types, data, hook) ✓
- [x] 06-02-PLAN.md — 3-page debrief UI flow (Collapse, Audit Trail, Verdict) ✓
- [x] 06-03-PLAN.md — LinkedIn share integration ✓
- [x] 06-04-PLAN.md — Email capture form and V2 waitlist ✓
- [x] 06-05-PLAN.md — Gamification: unlock progress + reflection prompt ✓
- [x] 06-16-PLAN.md — LinkedIn Share URL: Reliable sharing with pre-filled template ✓
- [x] 06-19-PLAN.md — Replace email form with LinkedIn CTA on debrief page 3 ✓
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

**Goal:** Reframe K-Maru as an explicit no-win experimentation sandbox
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

### Phase 09: Visual Effects

**Goal:** Add polish with general visual effects (distinct from Phase 04 stress indicators)
**Depends on:** Phase 01
**Plans:** 4 plans

Plans:
- [ ] 09-01-PLAN.md — SwipeFxLayer, bounded trails/bursts, usePrefersReducedMotion
- [ ] 09-02-PLAN.md — Stage transitions, optional View Transition API (Safari <18 fallback)
- [ ] 09-03-PLAN.md — Ambient menu/end-state motion (depends 01)
- [ ] 09-04-PLAN.md — Outcome micro-effects, performance guardrails (depends 01, 02, 03)

**Details:**
General polish and atmosphere:
- Card swipe flourishes (particles, trails)
- Stage transition enhancements
- Subtle ambient animations
- Feedback micro-interactions (success/fail bursts)

**Requirements:**
- VFX-01: Card swipe visual feedback (particles, motion trails)
- VFX-02: Enhanced stage transition animations
- VFX-03: Ambient/menu screen animations
- VFX-04: Outcome feedback micro-effects (success/fail visual cues)
- VFX-05: Performance-constrained (60fps, no jank)

### Phase 10: Background Audio

**Goal:** Add ambient music and non-voice audio (distinct from Phase 04 stress cues)
**Depends on:** Phase 01
**Plans:** 4 plans

Plans:
- [ ] 10-01-PLAN.md — Shared procedural audio engine with mix buses and voice ducking
- [ ] 10-02-PLAN.md — Stage music orchestration and menu/navigation cues
- [ ] 10-03-PLAN.md — Card interaction sounds for gameplay
- [ ] 10-04-PLAN.md — Volume controls (voice, music, SFX mixer)

**Details:**
General audio layer:
- Ambient background music (loops, mood-appropriate)
- Menu/interaction sound design
- Card flip/swipe audio cues
- Volume mix with existing voice playback

**Requirements:**
- AUDIO-01: Background music for game flow (optional, looped)
- AUDIO-02: Menu and navigation sound design
- AUDIO-03: Card interaction sounds (swipe, flip)
- AUDIO-04: Audio mix hierarchy (voice > cues > music)

### Phase 11: Settings Integration (deferred)

**Goal:** User controls for volume, effects, and accessibility
**Depends on:** Phase 01
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 11 to break down)

**Details:**
Settings UI and persistence:
- Volume controls (voice, music, SFX)
- Visual/audio effect toggles (motion, sound)
- Persistence (localStorage or similar)
- Accessible from menu or intro

**Requirements:**
- SETT-01: Volume sliders (voice, music, SFX)
- SETT-02: Effect toggles (motion reduction, mute)
- SETT-03: Persist settings across sessions
- SETT-04: Settings accessible from main flow (menu, gear icon)
- SETT-05: Settings integrate with Phases 09 and 10 controls

### Phase 12: Gameplay Tweaks & Card Variety

**Goal:** Shuffle deck, branching logic, and expanded AppSource for scenario variety
**Depends on:** Phase 01
**Plans:** 3/2 plans complete

Plans:
- [x] 12-00-PLAN.md — Shuffle deck on game start + branching card logic (wave 1) ✓
- [x] 12-01-PLAN.md — AppSource enum expansion + SOURCE_ICONS + CardStack source rendering (wave 1) ✓

**Details:**

**Gameplay tweaks:**
- **Shuffle deck:** When entering `PLAYING`, use a shuffled copy of `ROLE_CARDS[state.role]` so card order isn't fixed.
- **Branching:** Optional "if they swiped right on card X, show card Y" so some cards only appear after bad choices.

**App source infrastructure:**
- Add values to `AppSource` (e.g. `JIRA`, `NOTION`, `MEETING`). Purely cosmetic — makes scenarios feel more varied.
- Create `SOURCE_ICONS` mapping for each source's Font Awesome icon, update CardStack to use it.
- **Note:** Card additions using new sources belong in Phase 03 (No-Win Scenario Cards) or Phase 05 (Expanded AI Risk Scenarios).

**Requirements:**
- TWEAK-01: Shuffle deck on game start
- TWEAK-02: Branching card logic — conditional card injection based on prior swipes
- TWEAK-03: Extend `AppSource` enum (JIRA, NOTION, MEETING, etc.) + SOURCE_ICONS + CardStack rendering

### Phase 13: Image Asset Pipeline

**Goal:** Create pipeline + image prompts to generate assets, save locally, and map to correct locations
**Depends on:** Phase 06 (archetype system for mapping)
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 13 to break down)

**Details:**
Generate AI images (Midjourney v6 / DALL-E 3 / Stable Diffusion) for:
- **Incident images** — Glitched Corporate Surrealism (uncanny valley, visible AI artifacts)
- **Outcome images** — Sarcastic Stock Photos (polished corporate + disaster subject)
- **Collapse image** — Dramatic failure (e.g. yacht sinking, drone with audit report)
- **Archetype images** — Tactical patch / futuristic tarot card style (LinkedIn shareable)

**Pipeline:** Write prompts → generate → save to `public/images/` or asset folder → define mapping (cardId/outcomeId/archetypeId → image path).

**Requirements:**
- PIPELINE-01: Image prompt library (incidents, outcomes, collapse, archetypes)
- PIPELINE-02: Script or process to generate + save images locally
- PIPELINE-03: File naming convention + directory structure
- PIPELINE-04: Mapping config (card → image, outcome → image, archetype → image, deathType → collapse image)

### Phase 14: Situational & Outcome Imagery Display

**Goal:** Display images at correct locations with mobile/web responsive sizing
**Depends on:** Phase 13
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 14 to break down)

**Details:**
Integrate images into UI:
- **Incident cards** — Image above/below text, appropriate aspect ratio (e.g. 16:9 or 4:3)
- **Outcome feedback overlay** — Image alongside sarcastic reveal
- **Page 1 (Collapse)** — Full-width or hero-style collapse image
- **Page 3 (Archetype)** — Archetype avatar/badge for LinkedIn share

**Responsive sizing:**
- **Mobile:** Constrained width, adequate touch targets, avoid excessive scroll
- **Web:** Max dimensions, preserve aspect ratio, lazy load where appropriate

**Requirements:**
- IMAGE-01: Incident card image placement + sizing (mobile + web)
- IMAGE-02: Outcome overlay image placement + sizing
- IMAGE-03: Collapse page (Game Over) image placement + sizing
- IMAGE-04: Archetype verdict image (tactical patch style) + share card sizing
- IMAGE-05: Fallback when image missing (placeholder or hide)
- IMAGE-06: Lazy load / performance (avoid blocking render)

---

## Progress

| Phase | Goal | Milestone | Status |
|-------|------|-----------|--------|
| 1-4 | Core game | v1.0 | Complete |
| 1-2 | Voice Files + Live API | v1.1 | Complete |
| 01 | Live API STT Research | v1.2 | Complete |
| 02 | New Role Set (Impact Zones) | v1.2 | Complete |
| 03 | No-Win Scenario Cards | v1.2 | Planned (4 plans) |
| 04 | Immersive Pressure Effects | v1.2 | Complete (9/10) |
| 05 | Expanded AI Risk Scenarios | v1.2 | Planned (5 plans) |
| 06 | 19/19 | Complete    | 2026-03-16 |
| 07 | Kirk Easter Egg | v1.2 | Not started |
| 08 | Kobayashi Maru Framing (deferred) | v1.2 | Deferred |
| 09 | Visual Effects | v1.2 | Not started |
| 10 | Background Audio | v1.2 | Planned (4 plans) |
| 11 | Settings Integration (deferred) | v1.2 | Deferred |
| 12 | Gameplay Tweaks & Card Variety | v1.2 | Complete (2/2) |
| 13 | Image Asset Pipeline | v1.2 | Not started |
| 14 | Situational & Outcome Imagery Display | v1.2 | Not started |

---

*Roadmap updated: 2026-03-16 — Phase 06 complete (19/19 plans: LinkedIn CTA replaces email form on debrief page 3)*
