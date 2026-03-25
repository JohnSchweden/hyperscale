# Phase 13: Image Asset Pipeline — Architecture

## Strategic Value

Imagery exponentially increases immersion, emotional connection, and viral sharing potential. The Kobayashi Maru is a **psychological test** — images trigger physiological stress responses and make the crisis feel real in a 60-second flash sim.

---

## Visual Strategy: "Glitched Corporate Surrealism"

**Core aesthetic:** High-fidelity, photorealistic AI-generated images (Gemini image generation) of standard corporate scenes, with visible, disturbing, or surreal AI-generated artifacts.

**Why it works:** Creates "scroll-stop" moments. Looks real at first glance; the glitch forces a closer look. Unsettling, funny, perfectly captures "unhinged AI" (Project Icarus narrative).

**NOT using:** Generic stock photos, "just another pixel art game," or cheap memes (Distracted Boyfriend). Creating our own "Structural Memes."

---

## Scope: HOS-First

Phase 13 generates images for three anchors tied to the **Head of Something (HOS)** audio coverage:

| Category | Count | Source |
|----------|-------|--------|
| HOS incident images | ~18 | One per unique `realWorldReference.incident` in HOS card decks |
| HOS outcome images | ~36 | One per swipe direction per HOS card (left + right) |
| Death/collapse images | 7 | One per `DeathType` (including KIRK) |
| Archetype images | 7 | One per `ArchetypeId` (including KIRK) |
| **Total** | **~68** | |

Other roles use the fallback placeholder until their own image generation phase.

---

## Image Categories

### 1. Incident Images (Uncanny Valley)

**Purpose:** Move crisis from abstract text to visible disaster. Trigger physiological stress.

**Scope:** HOS cards only. Each image keyed by `slugify(card.realWorldReference.incident)`.

**Style:** Corporate scene + visible AI artifact (slightly off, uncanny). Should feel like an AI-generated stock photo that's *almost* right.

**Example prompts (HOS scenarios):**
- **Model drift:** "Glossy photo of a mid-level manager presenting a performance dashboard, but the numbers on the screen are slowly melting into each other. Corporate boardroom. Unsettling."
- **Prompt injection:** "Professional photo of an executive reviewing a contract on a laptop, but the text on the screen keeps rearranging itself into something threatening. Office. Uncanny."
- **Shadow AI:** "Stock photo of a team meeting, but one person's face is slightly blurred and repeating at the edges of the frame, like a corrupted video call. Corporate. Disturbing."

### 2. Outcome Images (Per-Swipe, HOS)

**Purpose:** Visual match for the specific consequence of each HOS swipe choice. Left and right outcomes are visually distinct — they depict what actually happens.

**Style:** "Task Failed Successfully" — polished corporate stock photo aesthetic, but the subject matter is the actual disaster outcome. Sarcastic, high-contrast.

**Scope:** One image per swipe direction per HOS card (~36 images). Keyed by `{hosCardSlug}-left` and `{hosCardSlug}-right`.

**Example prompts:**
- **`hos_model_drift_team_blame` left (blame the team):** "Glossy boardroom photo. Manager points at scapegoat. Outside the window: a server room on fire. Everyone is smiling."
- **`hos_model_drift_team_blame` right (own the drift):** "Executive in solo press conference, surrounded by journalists. Behind her: a giant screen showing 'MODEL ACCURACY: 12%'. She is nodding confidently."

### 3. Collapse Images (Page 1 — Game Over)

**Purpose:** Dramatic failure visual when simulation ends. First thing players see on debrief page 1.

**Scope:** 7 images, one per `DeathType` (including KIRK).

**Style:** Dramatic + darkly comedic. "This is Fine" energy. Over-the-top corporate disasters played for dark comedy.

**Example prompts:**
- **BANKRUPT:** "Luxury yacht sinking while a small drone flies overhead holding the final audit report. Dramatic. Corporate satire."
- **KIRK:** "Corrupted server room. Every screen shows the same glitching face. The cables form words. AI takeover aesthetic."

### 4. Archetype Images (Page 3 — LinkedIn Share Engine)

**Purpose:** Viral engine. Professionals love badges/certificates. Provides social capital for "brag post" about failing the sim.

**Scope:** 7 images, one per `ArchetypeId` (including KIRK).

**Style:** NOT a photo. Stylized graphic — tactical patch or futuristic tarot card. High-contrast, iconic. LinkedIn-shareable quality.

**Example prompts:**
- **Pragmatist:** "Graphic of a fist holding a power plug, superimposed over a blueprint of a burning circuit board. Tactical patch style."
- **Chaos Agent:** "Graphic of a winged rocket ship with eye on nosecone, flying into black hole. Futuristic tarot card style."
- **KIRK:** "Glitched-out figure dissolving into binary. Half human, half static. Easter egg aesthetic."

---

## Pipeline Requirements

1. **Prompt library** — Auto-generated from HOS card data (incidents + outcomes) + handcrafted for deaths and archetypes
2. **Generation** — Gemini image API (automated script, `scripts/generate-images.ts`)
3. **User checkpoint** — Script pauses after the first incident image is generated and saved; prints file path for inspection before continuing
4. **Storage** — Save to `public/images/{incidents,outcomes,archetypes,deaths}/`
5. **Naming** — `incident-{slug}.webp`, `outcome-{slug}-left.webp`, `outcome-{slug}-right.webp`, `death-{deathType}.webp`, `archetype-{archetypeId}.webp`
6. **Mapping** — `data/imageMap.ts` with typed Records + helper functions

---

## Requirements (Phase 13)

- PIPELINE-01: Image prompt library (HOS incidents, HOS outcomes per-direction, deaths, archetypes)
- PIPELINE-02: Gemini generation script with user checkpoint after first image
- PIPELINE-03: File naming convention + directory structure
- PIPELINE-04: Mapping config (`data/imageMap.ts`) — HOS incident slug → path, HOS outcome slug+direction → path, archetype → path, deathType → path
