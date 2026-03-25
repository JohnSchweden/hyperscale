# Phase 13: Image Asset Pipeline - Context

**Gathered:** 2026-03-16
**Updated:** 2026-03-25 (scoped to HOS-first: incidents + per-direction outcomes + deaths + archetypes)
**Status:** Ready for planning

<domain>
## Phase Boundary

Create an automated pipeline to generate AI images for the game, save them locally, and define mapping from game entities to image paths. This phase produces the images and mapping config. Displaying images in the UI is Phase 14.

Key shift from original plan: incident images are **per-incident** (~118 unique real-world incidents extracted from card data), not per-category (6). The pipeline auto-generates prompts from card data rather than using a hardcoded prompt library.

</domain>

<decisions>
## Implementation Decisions

### Image Coverage Scope
**Phase 13 is HOS-first.** Images are generated for the Head of Something role (whose card scenarios already have audio coverage), all 7 death types, and all 7 archetypes. Other roles use the fallback placeholder until a future expansion phase.

- **HOS incident images** (~18 images): One image per unique `realWorldReference.incident` from HOS card decks. Keyed by slugified incident name (e.g., `hos-model-drift-team-blame` → `/images/incidents/hos-model-drift-team-blame.webp`). Scope anchored to the audio file scenarios: `explainability_hos_1/2`, `shadow_ai_hos_1/2`, `synthetic_data_hos_1/2`, `hos_copyright_team_blame`, `hos_delegation_gone_wrong`, `hos_explainability_politics`, `hos_managing_up_down`, `hos_model_drift_budget_conflict`, `hos_model_drift_retrain_delay`, `hos_model_drift_team_blame`, `hos_promotion_politics`, `hos_prompt_injection_blame`, `hos_prompt_injection_copilot_team`, `hos_prompt_injection_review_escape`, `hos_shadow_ai_team_discovery`.
- **HOS outcome images** (~36 images): One image per swipe direction per HOS card (left + right). Keyed by `{hosCardSlug}-left` and `{hosCardSlug}-right`. Each depicts the specific consequence of that outcome — not a generic category.
- **Archetype images** (7 images): One per ArchetypeId (Pragmatist, Shadow Architect, Disruptor, Conservative, Balanced, Chaos Agent, **Kirk**)
- **Death/collapse images** (7 images): One per DeathType (Bankrupt, Replaced by Script, Congress, Fled Country, Prison, Audit Failure, **Kirk**)
- **Total scope: ~68 images** (~18 HOS incidents + ~36 HOS outcomes + 7 archetypes + 7 deaths)

### Kirk Images
- DeathType.KIRK (7th death) and ArchetypeId "KIRK" (7th archetype) exist in the codebase
- All image maps include Kirk entries
- Death art direction for Kirk: dramatic AI corruption/glitch aesthetic matching the Easter egg theme
- Archetype portrait for Kirk: mysterious, glitched-out figure embodying the rogue AI personality

### Per-Incident Images (NOT Per-Category)
- Instead of 6 generic per-category incident images, generate ~118 per-incident images keyed by `realWorldReference.incident` from card data
- Cards sharing the same real incident share one image (deduplication is automatic via slugify)
- Example: "Samsung ChatGPT Code Leak" referenced by both CSO and Software Engineer cards → one image at `/images/incidents/samsung-chatgpt-code-leak.webp`

### imageMap.ts as Single Source of Truth
- `data/imageMap.ts` exports `INCIDENT_IMAGES: Record<string, string>` keyed by slugified incident name (HOS scope)
- Exports `OUTCOME_IMAGES: Record<string, string>` keyed by `{cardSlug}-left` and `{cardSlug}-right` (per-direction, HOS scope)
- Exports `ARCHETYPE_IMAGES: Record<ArchetypeId, string>` and `DEATH_IMAGES: Record<DeathType, string>` (all 7 entries each)
- Exports helper functions: `getIncidentImagePath()`, `getOutcomeImagePath(slug, direction)`, `getArchetypeImagePath()`, `getDeathImagePath()`
- Exports `slugifyIncident()` for consistent slug generation
- Phase 14 will NOT create a separate imagePaths.ts — imageMap.ts is the single source of truth

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
- Per-direction per-HOS-card — outcome prompt derived from `left.lesson` / `right.lesson` content

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
- Tests validate "every HOS card with realWorldReference has a corresponding incident image entry" — HOS-scoped, dynamic (reads card data)
- Tests validate "every HOS card has left + right outcome image entries" — per-direction completeness
- Archetype count: all 7 ArchetypeId values have entries (including Kirk)
- Death count: all 7 DeathType values have entries (including Kirk)
- Dedup test: "no duplicate incident slugs"
- Other roles: no image coverage assertion — they use fallback placeholder

### Generation Tooling
- Script-first automated pipeline using Gemini image API (`gemini-2.5-flash-image` or `gemini-3.1-flash-image-preview`)
- No manual Midjourney or DALL-E workflow — fully automated and repeatable
- No separate prompt library file — prompts auto-generated from HOS card data at runtime
- User checkpoint after first incident image: readline prompt before batch continues

### File Structure
- Directory layout by entity type:
  - `public/images/incidents/` (~118 files, keyed by incident slug)
  - `public/images/outcomes/` (8 files)
  - `public/images/archetypes/` (7 files, including kirk.webp)
  - `public/images/deaths/` (7 files, including kirk.webp)
- Format: WebP for all images (800px width, quality 75)

### Entity-to-Image Mapping
- `data/imageMap.ts` config file with typed Record mappings
- INCIDENT_IMAGES auto-generated from card data at module load time
- No changes to Card interface or existing types
- Clean separation: mapping lives outside entity types
- Type aliases (IncidentSlug, OutcomeConsequenceType) defined in imageMap.ts, not types.ts

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
- Outcomes lean into internet meme culture — exaggerated, absurd, funny (stays per-consequence-type, not per-incident)
- Archetype portraits should be compelling enough to share on LinkedIn from the debrief page
- Death images channel "This is Fine" energy — dramatic disasters played for dark comedy
- Kirk archetype: glitched, corrupted, AI-gone-wrong aesthetic
- Pipeline script should be re-runnable: start with CSO pilot, expand incrementally
- Cross-role incident sharing means generating CSO images covers a significant portion of other roles

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

---

*Phase: 13-image-asset-pipeline*
*Context gathered: 2026-03-16*
*Architecture decisions applied: 2026-03-24*
*Scope revised: 2026-03-25 — HOS-first (incidents + per-direction outcomes + deaths + archetypes, ~68 images); Gemini only; user checkpoint after first image*
