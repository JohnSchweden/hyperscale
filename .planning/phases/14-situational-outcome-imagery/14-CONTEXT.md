# Phase 14: Situational & Outcome Imagery Display - Context

**Gathered:** 2026-03-16
**Updated:** 2026-03-24 (architecture decisions applied)
**Status:** Ready for execution

<domain>
## Phase Boundary

Display images at correct locations across 4 UI surfaces with mobile/web responsive sizing. Integrate image assets (from Phase 13 pipeline) into incident cards, outcome feedback overlays, Game Over collapse page, and archetype verdict page. Includes fallback behavior for missing images and lazy load performance.

</domain>

<decisions>
## Implementation Decisions

### Image resolution architecture
- **All image paths resolved via `data/imageMap.ts`** (created by Phase 13)
- **NO `utils/imagePaths.ts`** — all helpers live in imageMap.ts: `getIncidentImagePath()`, `getOutcomeImagePath()`, `getArchetypeImagePath()`, `getDeathImagePath()`
- **NO image field on Card or ChoiceOutcome** — cards resolve images via imageMap lookup using `realWorldReference.incident` slug
- **Archetype gets `image?: string` field** — small fixed set (7), useful for verdict page badge
- **Death endings use imageMap lookup** — `getDeathImagePath(deathType)`, no field on death ending type

### Incident card images
- Image appears **above the text** as a hero banner at the top of the card body
- Aspect ratio: **16:9** — cinematic, compact height, works on mobile
- Image lookup: `getIncidentImagePath(slugify(card.realWorldReference.incident))` — keyed by slugified incident name, NOT card ID
- Image **moves with the card** during swipe gesture — part of the card, not parallax
- Respects existing card width constraint (`max-w-full lg:max-w-[43rem]`)
- **Next card image preloaded** via `<link rel="preload">` to eliminate placeholder flash on swipe

### Outcome overlay images
- **Large hero image** at the top of the overlay, 16:9
- **Images keyed by consequence type** (8 types), NOT per card or per direction:
  - BUDGET_CRATER, PR_DISASTER, LEGAL_HAMMER, TEAM_REVOLT, AUDIT_DOOM, CAREER_OVER, REGULATORY_NUKE, DATA_BREACH
- **Overlay width matches ticket card width** on all breakpoints (mobile + desktop) — currently narrower, needs adjustment
- Image **fades in** (~300ms) when overlay opens — subtle reveal effect
- Personality feedback text, fines, and governance alerts flow below the image

### Collapse page (Game Over - debrief page 1)
- **Full-width hero image** above death ending text
- **Unique image per death type** — all 7 DeathTypes including **KIRK** (Phase 07 easter egg)
- Image resolved via `getDeathImagePath(deathType)` from imageMap — NOT a field on death ending object
- Replaces/supplements the current FontAwesome icon in the death ending display
- Dramatic "you failed" moment — image is the first thing players see

### Archetype verdict (debrief page 3)
- **Centered badge image (1:1)** above archetype name and description
- All 7 archetypes including **KIRK** (Phase 07 easter egg)
- Uses `archetype.image` field (Archetype interface) with fallback to `getArchetypeImagePath(id)`
- Kirk gets Kirk-specific glitch image for thematic easter egg feel
- Feels like unlocking an achievement
- Badge is for in-game display only — LinkedIn sharing currently uses text-only share URLs

### Performance strategy
- **Native `loading="lazy"` only** — no IntersectionObserver (simpler is better)
- **`img.decode()`** for jank prevention before showing image
- **CSS `aspect-ratio`** prevents layout shift (CLS)
- **CLS test kept**, fps/memory tests dropped (unreliable in CI)

### Test scope
- **CSO pilot role** for initial image assertions — CSO cards have populated `realWorldReference.incident`
- **Other roles test "placeholder shown when missing"** path
- **Kirk coverage** in debrief tests (both collapse and verdict pages)
- **7 test files total** (not 8 — no image-performance.spec.ts)

### Claude's Discretion
- Exact image container styling (border radius, shadow, padding)
- Mobile-specific image height constraints to avoid excessive scrolling
- Transition timing details beyond the ~300ms fade-in direction
- Glitch placeholder CSS implementation details
- How consequence type is derived from outcome stats in FeedbackOverlay parent

</decisions>

<specifics>
## Specific Ideas

- Outcome overlay width should match ticket card width — this is a **new layout change** not just image integration
- Glitch placeholder should feel intentional, part of the "Glitched Corporate Surrealism" aesthetic — not like a broken image or missing asset
- Phase 13 creates `data/imageMap.ts` with `INCIDENT_IMAGES`, `OUTCOME_IMAGES`, `ARCHETYPE_IMAGES`, `DEATH_IMAGES` records plus helper functions
- The crossfade from glitch placeholder to real image should feel smooth, not jarring
- Next card preload link prevents the placeholder flash that would occur on every swipe

</specifics>

<code_context>
## Existing Code Insights

### Key Types (from types.ts review)
- `DeathType` enum: 7 values (BANKRUPT, REPLACED_BY_SCRIPT, CONGRESS, FLED_COUNTRY, PRISON, AUDIT_FAILURE, **KIRK**)
- `ArchetypeId` type: 7 values (PRAGMATIST, SHADOW_ARCHITECT, DISRUPTOR, CONSERVATIVE, BALANCED, CHAOS_AGENT, **KIRK**)
- `Archetype` interface: id, name, description, icon, color, traits — gets `image?: string` in Phase 14
- `Card` interface: has `realWorldReference?: RealWorldReference` — NOT mutated with image field
- `RealWorldReference`: has incident, date, outcome, sourceUrl?

### Reusable Assets
- `CardStack.tsx`: Body section where incident image will be inserted (above sender/text)
- `FeedbackOverlay.tsx`: Header area where outcome hero image goes (above escalation banner)
- `DebriefPage1Collapse.tsx`: Death ending display area — image replaces FontAwesome icon
- `DebriefPage3Verdict.tsx`: Verdict box — badge above archetype name
- `data/imageMap.ts`: Phase 13 image mapping with all helper functions
- `data/archetypes.ts`: ARCHETYPES record with all 7 entries
- `data/deathEndings.ts`: DEATH_ENDINGS record with all 7 entries

### Established Patterns
- No existing `<img>` tags in codebase — this phase introduces image rendering
- FontAwesome icons used as current visual placeholders (source icons, death icons, archetype icons)
- Audio assets bundled in `public/audio/` — images will follow same pattern in `public/images/`
- Tailwind CSS for all styling — image containers will use Tailwind utilities
- `@/` alias for root-relative imports

### Integration Points
- `data/imageMap.ts` provides all path resolution (Phase 13)
- `Archetype` interface needs `image?: string` field
- Card/ChoiceOutcome interfaces NOT modified
- 8 outcome types for consequence-based images

</code_context>

<deferred>
## Deferred Ideas

- **Composite LinkedIn share card** (badge + stats + branding as og:image) — requires a shareable URL endpoint with server-rendered meta tags, not possible with current text-only LinkedIn share approach
- **Parallax swipe effect** on card images — mentioned as option, decided against for simplicity
- **Blur-up progressive loading** — requires generating thumbnail variants per image, decided against in favor of glitch placeholder
- **IntersectionObserver lazy loading** — decided against, native loading="lazy" is sufficient and simpler
- **Per-direction outcome images** — decided against, outcome images are per-consequence-type (8 types) not per-card-direction

</deferred>

---

*Phase: 14-situational-outcome-imagery*
*Context gathered: 2026-03-16*
*Architecture decisions applied: 2026-03-24*
