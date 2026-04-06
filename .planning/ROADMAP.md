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
**Plans:** 10/9 plans complete

**⚠️ REVISION REQUIRED:** Original plans (03-01 to 03-05) were written for OLD 6 legacy roles. Phase 02 introduced 10 NEW roles. See `03-REVISION-NOTES.md`.

Plans (REVISED FOR 10 ROLES):
- [x] 03-01-PLAN.md — Test scaffolding + card validation framework (updated for 10 role imports) ✓
- [x] **03-02-revised-PLAN.md** — Generate 80+ cards for 10 NEW roles (replaces 03-02) ✓
- [x] **03-03-revised-PLAN.md** — Integrate pressure metadata + shuffle testing for 10 roles ✓
- [x] **03-04-revised-PLAN.md** — UAT verification for 10 roles with distinct themes ✓
- [x] **03-05-revised-PLAN.md** — Real Case Reference for all 10 roles ✓

**Legacy plans (DEPRECATED - DO NOT USE):**
- 03-02-PLAN.md — Written for old 6 roles (DEVELOPMENT, FINANCE, etc.) ❌
- 03-03-PLAN.md — References legacy file structure ❌
- 03-04-PLAN.md — UAT for old 6 roles ❌
- 03-05-PLAN.md — References legacy card files ❌

**Gap Closure:**
- [x] **03-06-PLAN.md** — Rebalance fines to role-appropriate tiers ✓
- [x] **03-07-PLAN.md** — Rebalance heat penalties to match fine structure ✓

### Phase 04: Voice Files Restructure

**Goal:** Reorganize voice files into logical subfolders for better maintainability as file count grows
**Depends on:** None (organizational refactor)
**Plans:** 1 plan

Plans:
- [ ] 04-01-PLAN.md — Restructure voices folder with subfolders (archetype, death, feedback, core)

**Details:**
Current flat structure with 59 files across 3 personalities is becoming unwieldy. With plans for 100+ voice files, we need clear organization by content category:

| Type | Count | Folder |
|------|-------|--------|
| Archetype reveals | 21 files | 1/1 | Complete    | 2026-03-31 | 21 files | `death/` |
| Card feedback | 16 files | 9/9 | Complete    | 2026-03-26 | 9 files | `core/` |

**New structure:**
```
public/audio/voices/
├── {personality}/
│   ├── archetype/
│   ├── death/
│   ├── feedback/
│   └── core/
```

**Audio format research:**
Research document created at `.planning/research/audio-optimization-research.md` comparing:
- **Keep WAV**: 19MB, no changes needed
- **MP3 (192kbps)**: ~3MB, universal support
- **Opus (96kbps)**: ~2MB, best compression, Safari 15+ only

**Recommendation**: Restructure first (Phase 4), consider compression later if bandwidth is a concern.

**Documentation:**
- `03-REVISION-NOTES.md` — Why plans were revised
- `03-ROLE-MAPPING.md` — 10 role card content strategy

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

**Goal:** Cover more day-to-day AI risk incidents people actually face + audit archetypes/endings
**Depends on:** Phase 03
**Plans:** 6/6 plans complete

Plans:
- [x] 05-01-PLAN.md — Test scaffold: 7 test files (incidents, integration, penalties, voice, dedup, distribution matrix, Phase 03 snapshot) ✓
- [x] 05-02-PLAN.md — Prompt injection + model drift cards (40 total: 2 per category × 10 decks) + deck.ts verification ✓
- [x] 05-03-PLAN.md — Explainability + shadow AI cards (40 total: 2 per category × 10 decks) ✓
- [x] 05-04-PLAN.md — Synthetic data/copyright cards + full distribution verification (20 total, 100 complete) ✓
- [ ] 05-05-PLAN.md — UAT checkpoint: human gameplay verification
- [x] 05-06-PLAN.md — Archetype & death ending audit + new personality proposals (document-only) ✓

**Details:**
Add **100 new incident cards** across 5 categories and **10 role-specific decks** (NOT legacy alias files):
- **Prompt injection:** 2 per role × 10 roles = 20 cards (GitHub Copilot RCE, financial jailbreak, e-commerce manipulation)
- **Model drift:** 2 per role × 10 roles = 20 cards (retraining decisions, bias, stale models)
- **Explainability:** 2 per role × 10 roles = 20 cards (EU AI Act, black box governance, regulatory deadlines)
- **Shadow AI:** 2 per role × 10 roles = 20 cards (unauthorized Claude/ChatGPT, vendor governance, team morale)
- **Synthetic data/copyright:** 2 per role × 10 roles = 20 cards (training data provenance, lawsuit settlement)

Plus: Audit of 6 death endings and 3 personalities against 10 roles, with proposals for new personalities (implementation deferred to future phase).

All incidents sourced from documented 2024-2025 cases. Role-specific framing (same incident, different organizational lens). 3-personality feedback. ~20% time pressure. Card Design Checklist in 05-CONTEXT.md.

**Requirements:**
- RISK-01: 2+ prompt injection incidents per role (20 cards across 10 decks)
- RISK-02: 2+ model drift / retraining incidents per role (20 cards across 10 decks)
- RISK-03: 2+ explainability / black box incidents per role (20 cards across 10 decks)
- RISK-04: 2+ shadow AI incidents per role (20 cards across 10 decks)
- RISK-05: 2+ synthetic data / copyright incidents per role (20 cards across 10 decks)
- RISK-06: Integrate into existing role card decks (all 10 roles have 18+ cards each)

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

**Goal:** Generate AI images for HOS incidents, HOS per-direction outcomes, death endings, and archetypes via automated Gemini pipeline
**Depends on:** Phase 06 (archetype system for mapping), Phase 15 (HOS audio coverage defines scope)
**Plans:** 7 plans

- [x] 13-00-PLAN.md — TDD Wave 0: failing test scaffolding (image map contract + asset existence)
- [x] 13-01-PLAN.md — `data/imageMap.ts` data layer + slugify helpers
- [x] 13-02-PLAN.md — Gemini generation script (`scripts/generate-images.ts`) with user checkpoint
- [x] 13-03-PLAN.md — Contract compliance verification
- [x] 13-04-PLAN.md — Label-based outcome architecture
- [x] 13-05-PLAN.md — Single slug label-based generation
- [x] 13-06-PLAN.md — Meme-world aesthetic prompt redesign

**Details:**
Generate AI images via Gemini image generation (automated pipeline — no Midjourney, no DALL-E):

| Category | Count | Key |
|----------|-------|-----|
| HOS incident images | ~18 | `slugify(realWorldReference.incident)` — aligned to HOS audio scenarios |
| HOS outcome images | ~36 | `{cardSlug}-left` / `{cardSlug}-right` — depicts actual consequence per swipe direction |
| Death/collapse images | 7 | One per `DeathType` (including KIRK) |
| Archetype images | 7 | One per `ArchetypeId` (including KIRK) |
| **Total** | **~68** | |

**Art direction:**
- Incidents: Glitched Corporate Surrealism — photorealistic corporate scene with visible AI artifact
- Outcomes: "Task Failed Successfully" — polished corporate photo, subject matter is the specific disaster
- Deaths: "This is Fine" energy — dramatic failure, darkly comedic
- Archetypes: Tactical patch / futuristic tarot card (LinkedIn shareable)

**User checkpoint:** Script pauses after first incident image is generated and saved. File path printed to terminal — inspect quality before batch continues (Ctrl+C to abort, Enter to proceed).

**Requirements:**
- PIPELINE-01: Image prompt library (HOS incidents, HOS per-direction outcomes, deaths, archetypes)
- PIPELINE-02: Gemini generation script (`scripts/generate-images.ts`) with readline checkpoint after first image
- PIPELINE-03: File naming convention + directory structure (`public/images/{incidents,outcomes,archetypes,deaths}/`)
- PIPELINE-04: `data/imageMap.ts` — HOS incident slug → path, HOS `{slug}-{direction}` → path, archetype → path, deathType → path

### Phase 14: Situational & Outcome Imagery Display

**Goal:** Display images at correct UI locations with responsive sizing; HOS role gets full coverage, other roles graceful fallback
**Depends on:** Phase 13
**Plans:** 6/6 plans complete

Plans:
- [x] 14-01-PLAN.md — ImageWithFallback component foundation with glitch placeholder; Archetype.image field; test scaffolding ✓
- [x] 14-02-PLAN.md — Outcome overlay image (per-direction HOS lookup, fade-in, overlay width fix) ✓
- [x] 14-03-PLAN.md — Collapse page (debrief page 1) death image ✓
- [x] 14-04-PLAN.md — Archetype verdict (debrief page 3) badge image + fallback glitch placeholder ✓
- [x] 14-05-PLAN.md — Gap: KIRK collapse image rendering, CSS class consolidation ✓
- [x] 14-06-PLAN.md — Gap: Missing DEBRIEF_PAGE_1 handler, HTTP→HTTPS fix ✓

**Details:**
Integrate images from Phase 13 into 4 UI surfaces:

| Surface | Image type | Placement | HOS | Other roles |
|---------|-----------|-----------|-----|-------------|
| Incident card | `getIncidentImagePath(slug)` | Hero above card text, 16:9 | ✓ full | Glitch placeholder |
| Outcome overlay | `getOutcomeImagePath(slug, direction)` | Hero at overlay top, 16:9 | ✓ full | No image (hidden) |
| Game Over (page 1) | `getDeathImagePath(deathType)` | Full-width hero | ✓ (all roles) | ✓ (all roles) |
| Verdict (page 3) | `getArchetypeImagePath(archetypeId)` | Centered 1:1 badge | ✓ (all roles) | ✓ (all roles) |

**Requirements:**
- IMAGE-01: Incident card image placement + sizing (mobile + web); 16:9, moves with swipe gesture
- IMAGE-02: Outcome overlay image — `{slug}-{direction}` lookup; hidden (not placeholder) for non-HOS roles
- IMAGE-03: Collapse page (Game Over) death image — full-width hero, one per DeathType
- IMAGE-04: Archetype verdict badge — 1:1 centered, all 7 archetypes including KIRK
- IMAGE-05: Fallback — glitch placeholder for missing incident images; no image for missing outcomes
- IMAGE-06: Lazy load via native `loading="lazy"` + `img.decode()` for jank prevention

### Phase 15: Voice Files Expanded

**Goal:** Generate voice audio files for archetype reveals, death endings, and high-impact Head of Something cards; restructure voice files for scalability
**Depends on:** Phase 06 (debrief system), Phase 07 (Kirk audio pattern)
**Plans:** 9/9 plans complete ✓

Plans:
- [x] 15-01-PLAN.md — Generate archetype reveal audio (7 archetypes × 3 personalities = 21 files) ✓
- [x] 15-02-PLAN.md — Generate death ending audio (7 deaths × 3 personalities = 21 files, including KIRK hybrid) ✓
- [x] 15-03-PLAN.md — Generate Head of Something critical card feedback (8 cards × 2 choices = 16 Roaster files) ✓
- [x] 15-04-PLAN.md — Restructure voices folder with subfolders (archetype, death, feedback, core) ✓
- [x] 15-05-PLAN.md — Compress audio to Opus and MP3 with automatic generation pipeline ✓ (completed 2026-03-24)

**Details:
Extend voice coverage beyond basic onboarding/victory/failure to create immersive audio moments:

**Archetype Reveals (21 files):**
Each of 7 archetypes needs a reveal voice line on debrief verdict page:
- PRAGMATIST, SHADOW_ARCHITECT, DISRUPTOR, CONSERVATIVE, BALANCED, CHAOS_AGENT, KIRK
- Generate for all 3 personalities (Roaster, ZenMaster, Lovebomber)

**Death Endings (21 files):**
Each of 7 death types needs audio on collapse page:
- BANKRUPT, REPLACED_BY_SCRIPT, CONGRESS, FLED_COUNTRY, PRISON, AUDIT_FAILURE, KIRK
- KIRK gets hybrid treatment: synthesized glitch + voice narration layered together
- Generate for all 3 personalities

**Head of Something Critical Cards (16 files):**
Focus on 8 highest-impact cards with Roaster voice only (based on fine/heat/hype analysis):
- Tier 1 (Game-Enders): `hos_managing_up_down`, `explainability_hos_2`
- Tier 2 (Sacrifice Moments): `hos_copyright_team_blame`, `hos_team_burnout_deadline`, `shadow_ai_hos_2`, `hos_model_drift_team_blame`
- Tier 3 (Major Consequences): `hos_explainability_politics`, `hos_prompt_injection_review_escape`

**Total New Files:** 58 audio files (21 + 21 + 16)

**Voice Files Restructure (15-04):**
Current flat structure with 59 files across 3 personalities is becoming unwieldy. Plan 04 reorganizes files into logical subfolders:

| Type | Count | Folder |
|------|-------|--------|
| Archetype reveals | 21 files | `archetype/` |
| Death endings | 21 files | `death/` |
| Card feedback | 16 files | `feedback/` |
| Core (onboarding/victory/failure) | 9 files | `core/` |

**New structure:**
```
public/audio/voices/
├── {personality}/
│   ├── archetype/
│   ├── death/
│   ├── feedback/
│   └── core/
```

**Audio Generation Pipeline:**
Reuses v1.1 infrastructure: `scripts/generate-voice.ts` (Gemini TTS) → `services/radioEffect.ts` (post-processing) → `public/audio/voices/{personality}/{type}/{trigger}.wav`

**Requirements:**
- VOICE-01: Archetype reveal audio plays on DebriefPage3 verdict display
- VOICE-02: Death ending audio plays on DebriefPage1 collapse display
- VOICE-03: Critical card feedback audio triggers on swipe for Head of Something role
- VOICE-04: All files follow naming convention: `{personality}/{type}/{trigger}.wav`
- VOICE-05: Update voicePlayback.ts to support subfolder paths

**Audio Compression (15-05):**
Automated compression pipeline to reduce bandwidth while maintaining quality:

| Format | Bitrate | Quality | Browser Support | Savings |
|--------|---------|---------|-----------------|---------|
| Opus | 96 kbps | Excellent | 92% (Chrome, Firefox, Edge, Safari 15+) | ~6x smaller |
| MP3 | 192 kbps | Good | 100% (Universal fallback) | ~3x smaller |

**Automation Features:**
- `scripts/compress-audio.ts` - Core compression utility using FFmpeg
- `scripts/compress-existing-audio.ts` - Batch compress all 59 existing files
- Auto-compression after WAV generation in all generation scripts
- Browser detection in voicePlayback.ts serves Opus to modern browsers, MP3 to legacy
- npm scripts: `compress:existing`, `compress:verify`, `compress:file`, `compress:dir`

**Impact:** 19MB → ~3MB for 92% of users (83% bandwidth reduction)

---

## Progress

| Phase | Goal | Milestone | Status |
|-------|------|-----------|--------|
| 1-4 | Core game | v1.0 | Complete |
| 1-2 | Voice Files + Live API | v1.1 | Complete |
| 01 | Live API STT Research | v1.2 | Complete |
| 02 | New Role Set (Impact Zones) | v1.2 | Complete |
| 03 | No-Win Scenario Cards | v1.2 | Complete (9/9) |
| 04 | Immersive Pressure Effects | v1.2 | Complete (10/10) |
| 05 | Expanded AI Risk Scenarios | v1.2 | Complete (6/6) |
| 06 | Debrief & Replay System | v1.2 | Complete (19/19) |
| 07 | Kirk Easter Egg | v1.2 | Complete |
| 08 | Kobayashi Maru Framing (deferred) | v1.2 | Deferred |
| 09 | Visual Effects | v1.2 | Not started |
| 10 | Background Audio | v1.2 | Not started |
| 11 | Settings Integration (deferred) | v1.2 | Deferred |
| 12 | Gameplay Tweaks & Card Variety | v1.2 | Complete (2/2) |
| 13 | Image Asset Pipeline | v1.2 | Complete (8/8) |
| 14 | Situational & Outcome Imagery | v1.2 | Complete (6/6) |
| 15 | Voice Files Expanded | v1.2 | Complete (8/8) |
| 16 | Ending Variety System | v1.2 | Complete (10/10) |
| 17 | Shuffle-aware Feedback TTS | v1.2 | Complete (5/5) |
| 18 | Meme Template System | v1.2 | In progress (1/3) |
| 19 | refactor the design | v1.2 | Complete (13/13) |
| 20 | Short Video Clips for Key Moments | v1.2 | Not started |
| 21 | refactor-the-glassmorphism-design | v1.2 | Not started (1 plan) |

### Phase 16: Kobayashi Maru Ending Variety System

**Goal:** Transform endings from role-based random death types to consequence-driven educational failure. Add death vector metadata to card outcomes, fix boss fight hardcoded AUDIT_FAILURE, fill CONGRESS content gap, and add failure lessons that teach AI governance.
**Depends on:** Phase 15
**Plans:** 10/10 plans complete ✓

Plans:
- [x] 16-01-PLAN.md — Death vector types, accumulator utility, and vector-aware death resolution (TDD) ✓
- [x] 16-02-PLAN.md — Wire death vectors into game reducer, fix boss fight death type ✓
- [x] 16-03-PLAN.md — Annotate all 10 card decks with death vectors, add CONGRESS cards ✓
- [x] 16-04-PLAN.md — Failure lessons, death explanations, and retry prompts in debrief ✓
- [x] 16-05-PLAN.md — Gap closure: annotate 7 unannotated decks with deathVector (DV-05) ✓ (completed 2026-03-25)
- [x] 16-06-PLAN.md — Gap closure: broaden 3 partial decks + restore coverage test thresholds ✓ (completed 2026-03-25)
- [x] 16-07-PLAN.md — Gap closure: CSO/HoS deck differentiation (CONGRESS, REPLACED_BY_SCRIPT) ✓ (completed 2026-03-26)
- [x] 16-08-PLAN.md — Gap closure: Tech AI Consultant / Something Manager death vector expansion ✓ (completed 2026-03-26)
- [x] 16-09-PLAN.md — Gap closure: Narrative copy precision (FLED_COUNTRY, REPLACED_BY_SCRIPT) ✓ (completed 2026-03-26)
- [x] 16-10-PLAN.md — Simplification: Extract hydration/death modules, merge failureLessons data ✓ (completed 2026-03-28)

**Requirements:**
- DV-01: DeathVector type on Card outcomes (optional field, backward compatible)
- DV-02: Vector accumulation and resolution logic with archetype affinity tiebreaker
- DV-03: Game reducer uses vector-based death type instead of role-deck-only logic
- DV-04: Boss fight failure uses vector-based death (not hardcoded AUDIT_FAILURE)
- DV-05: All 10 card decks annotated with death vectors (at least 4 of 6 types per deck)
- DV-06: CONGRESS content gap filled (2-3 new congressional hearing cards)
- DV-07: Debrief explains WHY player died (connected to decision pattern)
- DV-08: 3-4 failure lessons per death type teaching AI governance failure modes
- DV-09: Personality-specific retry prompts with strategy hints per death type

### Phase 17: Shuffle-aware feedback TTS & content integrity

**Goal:** Fix Roaster feedback audio desync when `shuffleDeck` swaps card sides; align incident pressure with `effectiveDeck`; remove duplicate HoS shadow-AI card and orphan audio; vary roast LLM cadence in prompts.
**Depends on:** Phase 15 (voice/feedback pipeline)
**Plans:** 5/5 plans complete ✓

**Requirements:**
- FA-01: `choiceSidesSwapped` on shuffled cards + `authoringFeedbackStem` maps chosen visible choice → authoring file suffix (label slug) for that outcome
- FA-02: `App` uses `effectiveDeck` for `currentCard`; overlay + `useVoicePlayback` use authoring stem for card feedback clips (choice/outcome keyed, not naive direction)
- FA-03: Single HoS shadow-enforcement card; `CRITICAL_HOS_CARDS` / scripts / tests / assets synced
- FA-04: `geminiLive` + `api/roast` prompts allow varied length/rhythm

Plans:
- [x] [17-01-PLAN.md](phases/17-shuffle-aware-feedback-tts-fixes/17-01-PLAN.md) — Card flag, shuffleDeck, `authoringFeedbackStem` helper (TDD) ✓
- [x] [17-02-PLAN.md](phases/17-shuffle-aware-feedback-tts-fixes/17-02-PLAN.md) — App `currentCard`, overlay authoring stem, `useVoicePlayback` wiring ✓
- [x] [17-03-PLAN.md](phases/17-shuffle-aware-feedback-tts-fixes/17-03-PLAN.md) — HoS dedupe, critical lists + orphan audio, roast prompts ✓
- [x] [17-04-PLAN.md](phases/17-shuffle-aware-feedback-tts-fixes/17-04-PLAN.md) — Code: authoringFeedbackStem returns label slug, type widening ✓
- [x] [17-05-PLAN.md](phases/17-shuffle-aware-feedback-tts-fixes/17-05-PLAN.md) — Assets: rename 76 audio files + update tests + generation scripts ✓ (completed 2026-03-27)

### Phase 18: Meme Template System

**Goal:** Generate shareable meme templates from gameplay outcomes (archetypes, death types, high-impact moments) for viral social sharing
**Depends on:** Phase 17
**Plans:** 3 plans (+ 1 deferred)

Plans:
- [x] 18-01-PLAN.md — Meme template data model and image generation ✓ (COMPLETED 2026-04-06)
- [x] 18-02-PLAN.md — Simple download/caching service for Imgflip templates ✓ (COMPLETED 2026-04-06)
- [ ] 18-03-PLAN.md — CLI script to download all memes at once
- [ ] ~~18-04-PLAN.md~~ — Overlay service for adding punchlines (DEFERRED)

### Phase 19: refactor the design

**Goal:** Reduce visual clutter across game screens (FeedbackOverlay, GameOver, DebriefPage2, CardStack, DebriefPage3) to match the minimalist design DNA of the selection screens. All changes are subtractive.
**Requirements**: DESIGN-01 to DESIGN-05
**Depends on:** Phase 18
**Plans:** 13/13 plans executed

Plans:
- [x] 19-01-PLAN.md — FeedbackOverlay clutter removal ✓
- [x] 19-02-PLAN.md — GameOver clutter removal ✓
- [x] 19-03-PLAN.md — DebriefPage2 reflection prompt removal ✓
- [x] 19-04-PLAN.md — CardStack padding reduction and mobile storyContext suppression ✓
- [x] 19-05-PLAN.md — DebriefPage3 endings hint removal ✓
- [x] 19-06-PLAN.md — Gap closure: restore context labels, add reflection hint, remove placeholder images ✓
- [x] 19-07-PLAN.md — Hype metric in FeedbackOverlay ✓
- [x] 19-08-PLAN.md — Gap closure: outcome images centered ✓
- [x] 19-09-PLAN.md — Victory page alignment ✓
- [x] 19-10-PLAN.md — Gap closure: outcome image centering ✓
- [x] 19-11-PLAN.md — Gap closure: Kirk ending lessons ✓
- [x] 19-12-PLAN.md — Kirk/Victory ending consistency ✓
- [x] 19-13-PLAN.md — Always-visible consequences display ✓

### Phase 20: Short Video Clips for Key Moments

**Goal:** Generate short video clips (3-10 seconds) of key moments for TikTok/Reels/YouTube Shorts virality
**Depends on:** Phase 19
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd:plan-phase 20 to break down)

### Phase 21: refactor-the-glassmorphism-design

**Goal:** Replace fake glass (heavy `bg-black/65` + weak `backdrop-blur-sm`) with real glassmorphism (low-opacity tint + strong blur + saturation boost) across all game components.
**Requirements**: GLASS-01 to GLASS-03
**Depends on:** Phase 19
**Plans:** 1/1 plans complete

Plans:
- [x] 21-01-PLAN.md — Add CSS glass classes + update shared constants + update 7 components ✓

**Details:**
Add 3 CSS glass classes to `index.html`: `.glass-card`, `.glass-strong`, `.glass-header`. Update shared constants in `selectionStageStyles.ts`. Update 7 components with inline glass definitions.

Components using shared constants (PersonalitySelect, RoleSelect, DebriefPage components) automatically upgrade via updated `GLASS_FILL_STRONG` and `GLASS_PANEL_DEFAULT` constants.

**Requirements:**
- GLASS-01: Global glass CSS classes in index.html with proper blur/saturation values
- GLASS-02: Shared glass constants reference CSS classes for automatic component updates
- GLASS-03: All 9 components use real glassmorphism (starfield visible through glass)

---

*Roadmap updated: 2026-03-28 — Phases 13, 16, 18 updated with all gap closure plans and extra phases*
