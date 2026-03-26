# Phase 13: Image Asset Pipeline - Context

**Gathered:** 2026-03-16
**Updated:** 2026-03-26 (aligned plans with HOS pilot + incident-keyed outcome pairs; see `13-CONTRACT.md`)
**Status:** Ready for planning

<domain>
## Phase Boundary

Create an automated pipeline to generate AI images for the game, save them locally, and define mapping from game entities to image paths. This phase produces the images and mapping config. Displaying images in the UI is Phase 14.

**Normative API & keys:** `.planning/phases/13-image-asset-pipeline/13-CONTRACT.md` — single source for outcome filenames, helpers, and data invariants. Narrative below must not contradict it.

**Full catalog vs pilot:** Incident images are **per reference case** (`realWorldReference.incident`), deduped by slug. **~118** unique incidents = **expansion** target across all roles. **Phase 13 ship** is **HOS-first** (~18 unique incidents + ~36 outcome files + 7 archetypes + 7 deaths ≈ **68** assets). The pipeline auto-generates prompts from card data (no static prompt library file).

</domain>

<decisions>
## Implementation Decisions

**Normative keys and helpers:** `.planning/phases/13-image-asset-pipeline/13-CONTRACT.md` — read before editing `imageMap.ts`, `generate-images.ts`, or Phase 14 lookup code.

### Image Coverage Scope
**Phase 13 is HOS-first.** Images are generated for the Head of Something role (whose card scenarios already have audio coverage), all 7 death types, and all 7 archetypes. Other roles use the fallback placeholder until a future expansion phase.

- **HOS incident images** (~18 images): One image per unique `realWorldReference.incident` from HOS card decks. Keyed by slugified incident name (e.g., `hos-model-drift-team-blame` → `/images/incidents/hos-model-drift-team-blame.webp`). Scope anchored to the audio file scenarios: `explainability_hos_1/2`, `shadow_ai_hos_1/2`, `synthetic_data_hos_1/2`, `hos_copyright_team_blame`, `hos_delegation_gone_wrong`, `hos_explainability_politics`, `hos_managing_up_down`, `hos_model_drift_budget_conflict`, `hos_model_drift_retrain_delay`, `hos_model_drift_team_blame`, `hos_promotion_politics`, `hos_prompt_injection_blame`, `hos_prompt_injection_copilot_team`, `hos_prompt_injection_review_escape`, `hos_shadow_ai_team_discovery`.
- **HOS outcome images** (~36 images): One image per swipe **direction per distinct reference-case incident** on the HOS deck (left + right). Files: `{incidentSlug}-left.webp` and `{incidentSlug}-right.webp` where `incidentSlug = slugifyIncident(realWorldReference.incident)`. Same pair **reuses** if multiple HOS cards share the same incident string. Prompts use the canonical **`onLeft.lesson` / `onRight.lesson`** for that reference case — not legacy eight “consequence types.”
- **Archetype images** (7 images): One per ArchetypeId (Pragmatist, Shadow Architect, Disruptor, Conservative, Balanced, Chaos Agent, **Kirk**)
- **Death/collapse images** (7 images): One per DeathType (Bankrupt, Replaced by Script, Congress, Fled Country, Prison, Audit Failure, **Kirk**)
- **Total scope: ~68 images** (~18 HOS incidents + ~36 HOS outcomes + 7 archetypes + 7 deaths)

### Kirk Images
- DeathType.KIRK (7th death) and ArchetypeId "KIRK" (7th archetype) exist in the codebase
- All image maps include Kirk entries
- Death art direction for Kirk: dramatic AI corruption/glitch aesthetic matching the Easter egg theme
- Archetype portrait for Kirk: mysterious, glitched-out figure embodying the rogue AI personality

### Per-Incident Images (NOT Per-Category)
- **Expansion:** up to ~118 unique incident images keyed by `realWorldReference.incident` across all role decks.
- **Pilot:** generate only incidents that appear on **HOS** cards with `realWorldReference` (~18).
- Cards sharing the same incident string share one incident image (dedupe via `slugifyIncident`).
- **Invariant:** all cards sharing an incident must share the same `(onLeft.lesson, onRight.lesson)` pair, or outcome art cannot be canonical — enforce in data tests (see `13-CONTRACT.md`).

### imageMap.ts as Single Source of Truth
- `data/imageMap.ts` exports `INCIDENT_IMAGES: Record<string, string>` keyed by slugified incident (pilot: HOS incidents only; grows toward full deck).
- Exports `OUTCOME_IMAGES: Record<string, string>` keyed by **`${incidentSlug}-left`** and **`${incidentSlug}-right`** for each pilot incident with swipe outcomes (see `13-CONTRACT.md`).
- Exports `ARCHETYPE_IMAGES: Record<ArchetypeId, string>` and `DEATH_IMAGES: Record<DeathType, string>` (all 7 entries each).
- Exports helpers: `getIncidentImagePath()`, **`getOutcomeImagePath(incidentSlug, direction)`** (returns `string | undefined` when no asset), `getArchetypeImagePath()`, `getDeathImagePath()`, `slugifyIncident()`.
- Phase 14 does **not** add `utils/imagePaths.ts`.

### Auto-Generated Prompts from Card Data
- No hardcoded prompt library. The pipeline script reads HOS card decks, extracts unique `realWorldReference.incident` values + context (date, outcome), and generates image prompts using art direction templates
- For outcome images: prompts are derived from the specific `left.lesson` and `right.lesson` outcome content of each HOS card — each prompt depicts the actual consequence, not a generic category
- Deduplicates incident images automatically via slugify
- Prompts include incident name, date, and outcome context for specificity

### HOS as Pilot (Iterative Pipeline)
- Phase 13 generates only for Head of Something cards — the role with the most audio coverage (18 card scenarios with Roaster feedback files)
- Both incident images and per-direction outcome images are scoped to HOS cards
- `--scope hos` flag processes only incidents + outcomes referenced by the HOS card deck
- Other roles get placeholder images until a future expansion phase

### User Checkpoint After First Image
- The generation script pauses after the first incident image is written to disk
- Prints the file path to the terminal so the image can be inspected before the batch continues
- If quality is wrong, abort (Ctrl+C), adjust prompts, re-run — saves API quota
- Implemented as a readline prompt in `scripts/generate-images.ts` before continuing the batch

### Image Optimization
- **800px max width** (withoutEnlargement: true)
- **WebP quality 75**
- Processed via sharp

### Art Style — Incidents
- Photorealistic with AI tells — hyper-realistic corporate photography where AI artifacts are the only clue something is off
- Maximum uncanny valley, minimal stylization
- Should feel like an AI-generated stock photo that's almost right
- Each prompt includes specific incident context (name, date, what happened) for unique imagery

### Art Style — Outcomes
- "Task Failed Successfully" — polished corporate stock photo aesthetic, subject matter is the actual disaster outcome
- Each image depicts the specific consequence of that HOS swipe choice (left vs right are visually distinct)
- Ironic, sarcastic tone matching the game's personality feedback
- Per-direction per **reference-case incident** on the HOS pilot deck — prompts from canonical `onLeft.lesson` / `onRight.lesson` for that incident

### Art Style — Archetypes
- Character portraits — AI-generated portraits embodying each archetype personality
- Examples: Pragmatist as a calm executive, Chaos Agent as a wild-eyed hacker, Kirk as a glitched AI entity
- Must be LinkedIn-shareable quality (used in debrief page 3 share flow)

### Art Style — Deaths/Collapse
- Dramatic + darkly comedic — over-the-top dramatic failure scenes with dark humor
- "This is Fine" energy — e.g., yacht sinking with "AI Governance" flag, robot in courtroom
- Matches the game's sarcastic Kobayashi Maru tone
- Kirk death: AI corruption/system takeover aesthetic

### Dynamic Contract Tests (13-00)
- Every **pilot** (HOS) card with `realWorldReference` has a matching **incident** map entry and **`-left` / `-right` outcome** keys (derived from incident slug).
- **Invariant test:** for each incident string, all referencing cards share one `(onLeft.lesson, onRight.lesson)` pair.
- Archetype / death: all 7 `ArchetypeId` and all 7 `DeathType` entries (including KIRK).
- Dedup: no duplicate incident slugs in map construction.
- Non-pilot roles: no coverage requirement in Phase 13 ship — placeholder in UI (Phase 14).

### Generation Tooling
- Script-first automated pipeline using Gemini image API (`gemini-2.5-flash-image` or `gemini-3.1-flash-image-preview`)
- No manual Midjourney or DALL-E workflow — fully automated and repeatable
- No separate prompt library file — prompts auto-generated from HOS card data at runtime
- User checkpoint after first incident image: readline prompt before batch continues

### File Structure
- **Pilot (HOS):** `public/images/incidents/` **~18** WebP (unique incident slugs on HOS deck); `public/images/outcomes/` **~36** WebP (`{slug}-left.webp`, `{slug}-right.webp` per pilot incident); `public/images/archetypes/` **7**; `public/images/deaths/` **7**.
- **Expansion:** incidents directory grows toward **~118** files; outcomes grow with **2 ×** each new incident slug that gets outcome art.
- Format: WebP (800px max width, quality 75).

### Entity-to-Image Mapping
- `data/imageMap.ts` — typed Record mappings; incidents/outcomes built from card data (pilot-scoped first).
- No `Card` image field — lookup by `realWorldReference` + helpers.
- Type aliases in `imageMap.ts` (e.g. `IncidentSlug`, optional `OutcomeImageKey`) — **do not** use legacy `OutcomeConsequenceType` for filenames.

### Claude's Discretion
- Exact art direction template wording for auto-prompt generation
- Image dimensions and aspect ratios per entity type
- Gemini model selection (whichever produces better results)
- Post-processing details beyond 800px/q75 (crop, color adjustments)
- Script architecture and error handling details
- Fallback image strategy for missing incidents

</decisions>

<specifics>
## Specific Ideas

- Incidents should feel like AI-generated corporate stock photos that are *almost* right — uncanny valley as a feature, not a bug
- Each incident image is unique to its real-world event (Samsung leak vs GitHub Copilot RCE should look visually distinct)
- Outcomes: Lean into internet meme culture — exaggerated, absurd, funny  — **per reference-case incident + direction**, visually distinct left vs right
- Archetype portraits should be compelling enough to share on LinkedIn from the debrief page
- Death images channel "This is Fine" energy — dramatic disasters played for dark comedy
- Kirk archetype: glitched, corrupted, AI-gone-wrong aesthetic
- Pipeline re-runnable: **`--scope hos`** pilot first, then expand scope as maps grow
- Cross-role incident sharing: generating a reference-case incident once benefits every role that references it

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `data/archetypes.ts`: 7 archetype definitions (including KIRK) with id, name, description, icon, color, traits — image map keys off ArchetypeId
- `data/deathEndings.ts`: 7 death type entries (including KIRK) with title, description, icon, color — image map keys off DeathType enum
- `types.ts`: DeathType enum has 7 values (KIRK added in Phase 07). ArchetypeId union has 7 values (KIRK added in Phase 07). Card interface has no image field (deliberate — mapping stays separate)
- `data/cards/`: 18 card deck files across roles — each card has `realWorldReference.incident` string that serves as the image key

### Established Patterns
- Data files export typed Records keyed by enums (e.g., `Record<DeathType, {...}>`) — imageMap.ts follows this pattern
- FontAwesome icons currently used for archetypes and deaths — images will supplement/replace these in Phase 14
- Barrel exports via `data/index.ts` — imageMap added to barrel
- `slugifyIncident()` function shared between imageMap.ts and pipeline script for consistency

### Integration Points
- `public/images/` directory doesn't exist yet — needs creation
- `data/imageMap.ts` will be consumed by Phase 14 UI components (no separate imagePaths.ts needed)
- Archetype images feed into LinkedIn share flow (debrief page 3)
- Pipeline script lives in `scripts/` directory, following existing `scripts/generate-voice.ts` pattern

</code_context>

<deferred>
## Deferred Ideas

- Displaying images in UI components — Phase 14 (Situational & Outcome Imagery Display)
- Image lazy loading and responsive sizing — Phase 14
- Image placeholders/loading states — Phase 14
- Short video clips (4-6s loops) for key moments — Phase 15 (Short Video Clips for Key Moments)

</deferred>

## GIF Text Overlay System (NEW - Gap Closure)

### Option 2: Local GIF Text Overlay Research

**Recommended:** `text-on-gif` package
- Simplest API to get started
- No system dependencies  
- Supports animated GIFs
- Works with URLs or local files
- Free, open-source (ISC license)

### Implementation Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    INCIDENT MEME SYSTEM                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │  Imgflip    │    │   GIF       │    │   Static    │   │
│  │  API (free) │    │  Templates  │    │   Memes     │   │
│  │             │    │  (cached)   │    │   (API)     │   │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘   │
│         │                  │                  │             │
│         ▼                  ▼                  ▼             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            TEMPLATE SELECTOR                         │    │
│  │   incident type → best matching template            │    │
│  └──────────────────────┬──────────────────────────────┘    │
│                         │                                     │
│                         ▼                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            TEXT GENERATOR (AI)                       │    │
│  │   Generate short punchline based on template         │    │
│  └──────────────────────┬──────────────────────────────┘    │
│                         │                                     │
│                         ▼                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         GIF/MEME TEXT OVERLAY                        │    │
│  │   - Fetch template (free)                           │    │
│  │   - Add text overlay (local tool)                    │    │
│  │   - Return URL                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Imgflip API Capabilities

| Feature | Free Tier | Premium ($9.99/mo) |
|---------|-----------|-------------------|
| Get static meme templates | ✅ | ✅ |
| Caption static images | ✅ | ✅ |
| Get GIF templates | ✅ | ✅ |
| **Caption GIFs** | ❌ | ✅ ($0.02/GIF after 50 free) |

**Free Tier Works:**
- `/get_memes?type=gif` — Fetch GIF template list
- `/caption_image` — Add captions to static images
- Just fetch GIF URLs for overlay processing

### Template List (Top GIFs to Pre-Cache)

| # | Template | Text Zones | Best For |
|---|----------|------------|----------|
| 1 | Party Parrot | 1 | Celebration/hype |
| 2 | Panik Kalm Panik | 3 | Escalating panic |
| 3 | This Is Fine | 1 | Denial in disaster |
| 4 | Expanding Brain | 4 | Escalating "insight" |
| 5 | Disaster Girl | 1 | Fire/chaos setting |
| 6 | Homer Backing Away | 1 | Backing out |
| 7 | Running Away Balloon | 1 | Something taken |
| 8 | Surprised Pikachu | 1 | Obvious outcome |
| 9 | Two Buttons | 2 | Hard choice |
| 10 | Left Exit 12 | 2 | Wrong choice |
| 11 | Drake Hotline Bling | 2 | Yes/no preference |
| 12 | Distracted Boyfriend | 3 | Ignoring important |

### Incident-to-Meme Mapping

| Incident Pattern | Recommended Templates |
|-----------------|---------------------|
| Ignored warnings/Red flags | Surprised Pikachu, One Does Not Simply, Boardroom Meeting |
| AI/Model overconfidence | Distracted Boyfriend, "This Is Fine", Expanding Brain |
| Predictable failure | Surprised Pikachu, Arrow to the Knee, "You're Gonna Have A Bad Time" |
| Escalating disaster | Left Exit 12 Off Ramp, Panik Kalm Panik, "This Is Fine" |
| Bad decision/choice | Two Buttons, Drake Hotline Bling, Left Exit 12 |
| Team/group failure | Boardroom Meeting, Change My Mind, Gru's Plan |
| Obvious outcome ignored | Surprised Pikachu, Is This a Pigeon?, "I Have The High Ground" |

### Cost Analysis

| Item | Cost |
|------|------|
| text-on-gif | Free (npm) |
| Canvas (system dep) | Free |
| GIF templates | Free (cached) |
| Imgflip API (static) | Free |
| **Total** | **$0** |

### Clarifying Questions

1. **Where to host processed GIFs?** 
   - Local filesystem (your server)
   - Cloud storage (S3, Cloudinary)
   - Serve directly from memory

2. **Text positioning flexibility:**
   - Current `text-on-gif` supports: top/middle/bottom alignment
   - Need precise X/Y coordinates? (would need canvas-gif instead)

3. **Caching strategy:**
   - Pre-cache popular templates at startup?
   - Lazy load on first request?
   - External CDN?

4. **Template source:**
   - Use Imgflip to fetch GIF URLs (free)
   - Or manually curate a list

5. **Dual System:**
   - Keep existing Gemini AI image generation for custom incident imagery
   - Add GIF/meme overlay as alternative for quick, recognizable visuals
   - Select based on incident type (complex incidents → AI images, simple patterns → meme templates)

---

*Phase: 13-image-asset-pipeline*
*Context gathered: 2026-03-16*
*Architecture decisions applied: 2026-03-24*
*Scope revised: 2026-03-25 — HOS-first; 2026-03-26 — plans + `13-CONTRACT.md` aligned to incident-keyed outcome pairs*
*GIF overlay addition: 2026-03-26*
