# Phase 06: Debrief & Replay System — Architecture

## Design: The Reveal Build-Up

A classic gamification mechanic (Myers-Briggs, Spotify Wrapped) that generates shareability through intentional friction and dramatic tension. Each click builds anticipation; the final archetype reveal feels earned.

---

## 3-Page Ending Sequence

### Page 1: The Collapse (The Cliffhanger)

**What happens:** Simulation crashes. Final disastrous outcome displayed. (Current Game Over / Ending page.)

**Button:** `[Debrief Me]`

**Why it works:** Shifts mindset from "playing the game" to "facing the music." Feels like stepping out of the simulator pod and walking into the Commander's office.

---

### Page 2: The Audit Trail (The Mirror)

**What happens:** The Incident Audit Log — structured debrief (not a boring list).

**Content to include:**
- Summary of key decisions and violations hit
- Real-world mapping: "In reality, this could mean…" (e.g. FTC investigation, class action, SEC inquiry)
- Takeaways prompt: "What would you do differently?"
- Encourage replay: "Unlock all endings" gamification (show progress: X/6 endings)
- "Try the wrong choice" hints — for cards where they swiped safe, note: "Curious what happens if you'd approved? Reboot and try."

**Framing:** Frame as **"Incident Audit Log"** (in-universe, not generic list).

**Personality comment:** Their chosen Emotional Advisor (V.E.R.A., BAMBOO, HYPE-BRO) leaves one final comment at the bottom before the button.
- Example (V.E.R.A.): *"Well, at least you were consistently terrible."*

**Button:** `[Generate Psych Evaluation]` or `[Extract Leadership Profile]`
- In-universe copy to keep immersion unbroken (avoid generic "Analyze character")

---

### Page 3: The Verdict (The Viral Engine)

**What happens:** Archetype reveal, LinkedIn share, Reboot.

**Verdict copy:**
> "SIMULATION COMPLETE. You are a 'Shadow Architect.' You prioritize system stability over human safety..."

**Primary action:** `[Share to LinkedIn]`

**Share text format:**
> "I just faced the Kobayashi Maru as a CTO. My Resilience Score: 88% (Pragmatist)."

**Why it works:** People share professional title + subtle personality brag. Strokes ego enough to hit Post.

**Secondary action:** `[Reboot System]`

**V2 Upsell (below buttons):**
> "This was the static test. The real Kobayashi Maru adapts to your weaknesses. Enter your email to get early access to V2: A self-learning adversary that ingests your provided context, crawls the web for relevant incidents, remembers your mistakes, and actively hunts your blind spots."

- `[Input: Email Address]` → `[Join V2 Waitlist]`

---

## Product-Led Growth (PLG) Loop

| Stage | Friction | Mechanism |
|-------|----------|-----------|
| Entry | Low | No login, just start |
| Middle | High engagement | Swiping + chaos |
| Ending | High ego-reward | 3-page debrief + archetype |
| Viral | Share loop | LinkedIn brings new users |
| Lead capture | Waitlist | V2 persistent, self-learning product |

**Outcome:** Stateless web app → lead-generation machine for autonomous V2.

---

## Requirements Extension (Phase 06)

### Existing
- DEBRIEF-01: Post-game summary screen with decision history
- DEBRIEF-02: Map violations to real-world consequences
- DEBRIEF-03: "Unlock all endings" progress + encouragement
- DEBRIEF-04: Optional "What would you do differently?" reflection

### New (from architecture)
- DEBRIEF-05: 3-page flow: Collapse → Audit Trail → Verdict
- DEBRIEF-06: Page 1 — [Debrief Me] CTA on Game Over
- DEBRIEF-07: Page 2 — Incident Audit Log (not boring list) + personality sign-off
- DEBRIEF-08: Page 2 — In-universe button: [Generate Psych Evaluation] or [Extract Leadership Profile]
- DEBRIEF-09: Page 3 — Archetype verdict + Resilience Score
- DEBRIEF-10: Page 3 — LinkedIn share with role + archetype + score
- DEBRIEF-11: Page 3 — V2 waitlist hook (email capture)
- DEBRIEF-12: Archetype system — map decision patterns to personality archetypes (e.g., Pragmatist, Shadow Architect)
