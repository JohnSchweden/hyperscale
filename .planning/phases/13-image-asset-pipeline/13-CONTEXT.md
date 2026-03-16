# Phase 13: Image Asset Pipeline - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Create a prompt library and automated pipeline to generate AI images for the game, save them locally, and define mapping from game entities (incident categories, outcome consequence types, archetypes, death types) to image paths. This phase produces the images and mapping config. Displaying images in the UI is Phase 14.

</domain>

<decisions>
## Implementation Decisions

### Image Coverage Scope
- Per-category images for incidents (~6 images): prompt injection, model drift, explainability, shadow AI, copyright, general dilemmas
- Per-consequence-type images for outcomes (~8-10 images): budget crater, PR disaster, legal hammer, team revolt, audit doom, etc.
- 6 archetype character portraits (one per archetype: Pragmatist, Shadow Architect, Disruptor, Conservative, Balanced, Chaos Agent)
- 6 death/collapse images (one per death type: Bankrupt, Replaced by Script, Congress, Fled Country, Prison, Audit Failure)
- Total scope: ~26-28 images

### Art Style — Incidents
- Photorealistic with AI tells — hyper-realistic corporate photography where AI artifacts are the only clue something is off
- Maximum uncanny valley, minimal stylization
- Should feel like an AI-generated stock photo that's almost right

### Art Style — Outcomes
- Meme-adjacent humor — overtly funny, exaggerated expressions, absurd situations
- Internet meme aesthetic rather than polished stock photography
- Ironic, sarcastic tone matching the game's personality feedback

### Art Style — Archetypes
- Character portraits — AI-generated portraits embodying each archetype personality
- Examples: Pragmatist as a calm executive, Chaos Agent as a wild-eyed hacker
- Must be LinkedIn-shareable quality (used in debrief page 3 share flow)

### Art Style — Deaths/Collapse
- Dramatic + darkly comedic — over-the-top dramatic failure scenes with dark humor
- "This is Fine" energy — e.g., yacht sinking with "AI Governance" flag, robot in courtroom
- Matches the game's sarcastic Kobayashi Maru tone

### Generation Tooling
- Script-first automated pipeline using Gemini or Groq image APIs
- No manual Midjourney workflow — fully automated and repeatable
- Deliverables: structured prompt library (JSON/MD with all ~28 prompts) + Node/TS pipeline script

### File Structure
- Directory layout by entity type:
  - `public/images/incidents/`
  - `public/images/outcomes/`
  - `public/images/archetypes/`
  - `public/images/deaths/`
- Format: WebP for all images

### Entity-to-Image Mapping
- Separate `data/imageMap.ts` config file with `Record<category, imagePath>` pattern
- No changes to Card interface or existing types
- Clean separation: mapping lives outside entity types

### Claude's Discretion
- Exact prompt wording for each of the ~28 images
- Consequence type taxonomy (which ~8-10 consequence categories for outcomes)
- Image dimensions and aspect ratios per entity type
- Gemini vs Groq selection (whichever produces better results)
- Post-processing details (resize, optimize, compression level)
- Script architecture and error handling

</decisions>

<specifics>
## Specific Ideas

- Incidents should feel like AI-generated corporate stock photos that are *almost* right — uncanny valley as a feature, not a bug
- Outcomes lean into internet meme culture — exaggerated, absurd, funny
- Archetype portraits should be compelling enough to share on LinkedIn from the debrief page
- Death images channel "This is Fine" energy — dramatic disasters played for dark comedy
- Pipeline script should be re-runnable: regenerate any image by re-running with a specific prompt ID

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `data/archetypes.ts`: 6 archetype definitions with id, name, description, icon, color, traits — image map can key off ArchetypeId
- `data/deathEndings.ts`: 6 death type entries with title, description, icon, color — image map can key off DeathType enum
- `types.ts`: Card interface has no image field (deliberate — mapping stays separate)
- `data/cards/`: 19 card deck files across roles — cards will need a `category` or similar field for incident image lookup

### Established Patterns
- Data files export typed Records keyed by enums (e.g., `Record<DeathType, {...}>`) — imageMap.ts should follow this pattern
- FontAwesome icons currently used for archetypes and deaths — images will supplement/replace these in Phase 14
- Barrel exports via `data/index.ts` — imageMap should be added to barrel

### Integration Points
- `public/images/` directory doesn't exist yet — needs creation
- `data/imageMap.ts` will be consumed by Phase 14 UI components
- Archetype images feed into LinkedIn share flow (debrief page 3)
- Pipeline script lives in project root or `scripts/` directory

</code_context>

<deferred>
## Deferred Ideas

- Displaying images in UI components — Phase 14 (Situational & Outcome Imagery Display)
- Image lazy loading and responsive sizing — Phase 14
- Image placeholders/loading states — Phase 14
- Animated or video assets — not currently scoped

</deferred>

---

*Phase: 13-image-asset-pipeline*
*Context gathered: 2026-03-16*
