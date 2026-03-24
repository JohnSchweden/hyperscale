# Phase 13: Image Asset Pipeline - Context

**Gathered:** 2026-03-16
**Updated:** 2026-03-24 (architecture decisions applied)
**Status:** Ready for planning

<domain>
## Phase Boundary

Create an automated pipeline to generate AI images for the game, save them locally, and define mapping from game entities to image paths. This phase produces the images and mapping config. Displaying images in the UI is Phase 14.

Key shift from original plan: incident images are **per-incident** (~118 unique real-world incidents extracted from card data), not per-category (6). The pipeline auto-generates prompts from card data rather than using a hardcoded prompt library.

</domain>

<decisions>
## Implementation Decisions

### Image Coverage Scope
- **Per-incident images** (~118 images): One image per unique `realWorldReference.incident` from card data. Cards sharing the same real-world incident share one image. Keyed by slugified incident name (e.g., "samsung-chatgpt-code-leak" → `/images/incidents/samsung-chatgpt-code-leak.webp`).
- Per-consequence-type images for outcomes (8 images): budget crater, PR disaster, legal hammer, team revolt, audit doom, career over, regulatory nuke, data breach
- 7 archetype character portraits (one per archetype: Pragmatist, Shadow Architect, Disruptor, Conservative, Balanced, Chaos Agent, **Kirk**)
- 7 death/collapse images (one per death type: Bankrupt, Replaced by Script, Congress, Fled Country, Prison, Audit Failure, **Kirk**)
- Total scope: ~140 images (~118 incidents + 8 outcomes + 7 archetypes + 7 deaths)

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
- `data/imageMap.ts` exports `INCIDENT_IMAGES: Record<string, string>` keyed by slugified incident name
- Also exports `OUTCOME_IMAGES`, `ARCHETYPE_IMAGES`, `DEATH_IMAGES` as typed Records
- Exports helper functions: `getIncidentImagePath()`, `getOutcomeImagePath()`, `getArchetypeImagePath()`, `getDeathImagePath()`
- Exports `slugifyIncident()` for consistent slug generation
- Phase 14 will NOT create a separate imagePaths.ts — imageMap.ts is the single source of truth

### Auto-Generated Prompts from Card Data
- No hardcoded prompt library. The pipeline script reads all card decks, extracts unique `realWorldReference.incident` values + context (date, outcome), and generates image prompts using art direction templates
- Deduplicates automatically via slugify
- Prompts include incident name, date, and outcome context for specificity

### CSO as Pilot (Iterative Pipeline)
- Start by extracting unique incidents from CSO cards, generate those first, review quality, then expand
- Pipeline scoped by unique real-world incidents (not by role), since incidents are shared across roles
- `--scope cso` flag processes only incidents referenced by CSO card deck
- CSO incidents shared with other roles are automatically covered

### Pipeline Organized by Incident, Not Role
- The `--scope` flag is useful for scoping which incidents to extract, but output is keyed by incident slug
- When you generate for CSO's incidents, those images automatically cover other roles referencing the same incidents
- Cross-role sharing is tracked and reported

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
- Meme-adjacent humor — overtly funny, exaggerated expressions, absurd situations
- Internet meme aesthetic rather than polished stock photography
- Ironic, sarcastic tone matching the game's personality feedback
- 8 consequence types, NOT per-incident — stays generic per outcome category

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
- Tests validate "every card with realWorldReference has a corresponding image entry" — no hardcoded counts
- Archetype and death counts updated to 7 (including Kirk)
- Dedup test: "no duplicate incident slugs"
- Shared incident test: "cards sharing same incident reference same image path"

### Generation Tooling
- Script-first automated pipeline using Gemini image API
- No manual Midjourney workflow — fully automated and repeatable
- No separate prompt library file — prompts auto-generated from card data at runtime

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
