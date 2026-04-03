# Image Asset Pipeline Guide

## Overview

The image pipeline generates, stores, and maps AI-generated images to game entities in K-Maru. It uses the Gemini Image API to produce WebP assets from card data, then maps them to incidents, outcomes, archetypes, and death types via `data/imageMap.ts`.

**Why it exists:** Images move crises from abstract text to visible disaster. They trigger physiological stress responses, make the simulation feel real, and provide shareable assets for the debrief flow.

**Pipeline components:**

| Component | File | Purpose |
|-----------|------|---------|
| Generation script | `scripts/generate-images.ts` | Calls Gemini API, converts to WebP, saves to disk |
| Image map | `data/imageMap.ts` | Typed Records mapping entities to image paths |
| Storage | `public/images/{category}/` | WebP files served by Vite at root |
| UI integration | `components/ImageWithFallback.tsx` | Reusable image component with glitch placeholder |

**Tech stack:**

| Tool | Purpose |
|------|---------|
| `@google/genai` | Gemini image generation API |
| `sharp` | Image resizing and WebP conversion |
| `data/imageMap.ts` | Shared slugify + extraction functions |

---

## Image Generation

The generation script at `scripts/generate-images.ts` reads card data, builds prompts, calls the Gemini API, and saves WebP files.

### How it works

1. **Data extraction** — Reads `ROLE_CARDS`, `HEAD_OF_SOMETHING_CARDS`, `ARCHETYPES`, and `DEATH_ENDINGS` to build task lists
2. **Prompt generation** — Uses template functions with randomized meme format references to create prompts
3. **API call** — Sends prompts to `gemini-2.5-flash-image` with `responseModalities: ["IMAGE"]` and `16:9` aspect ratio
4. **Conversion** — Decodes base64 response, resizes to 800px max (inside fit), converts to WebP at quality 75 via sharp
5. **Save** — Writes to `public/images/{category}/{slug}.webp`
6. **Human checkpoint** — Pauses after the first incident image for quality review before continuing the batch

### Prompt templates

Each image category has its own prompt generator with randomized meme format selection:

| Category | Function | Meme formats pool |
|----------|----------|-------------------|
| Incidents | `generateIncidentPrompt()` | 10 formats (Distracted Boyfriend, Expanding Brain, This is Fine, etc.) |
| Outcomes | `generateOutcomePrompt()` | 14 formats (This is Fine fire, Drake AI disasters, Matrix spoon, etc.) |
| Archetypes | `generateArchetypePrompt()` | 10 formats (Clash Royale card, Among Us crewmate, Pokemon card, etc.) |
| Deaths | `generateDeathPrompt()` | 10 formats (This is Fine, Thanos snap, Dark Souls YOU DIED, etc.) |

### CLI flags

| Flag | Description |
|------|-------------|
| `--dry-run` | Print prompts without generating images |
| `--force` | Regenerate images that already exist on disk |
| `--scope <value>` | Limit to specific scope: `cso`, `hos`, `incidents`, `outcomes`, `archetypes`, `deaths` |
| `--slug <name>` | Generate images for a single incident (and its outcomes) |
| `--replace <slug>` | Regenerate a specific image by slug (asks for approval) |
| `--incidents` | Only generate incident images |
| `--outcomes` | Only generate outcome images |
| `--export-prompts` | Export all prompts to `scripts/prompts/` as markdown files |
| `--model <name>` | Override the default model (default: `gemini-2.5-flash-image`) |

### Running the script

```sh
# Prerequisite: set API key
export GEMINI_API_KEY="your-key-here"

# Generate all images (default: all categories)
bun scripts/generate-images.ts

# Dry run — preview prompts only
bun scripts/generate-images.ts --dry-run

# HOS pilot only (incidents + outcomes)
bun scripts/generate-images.ts --scope hos

# Incidents only
bun scripts/generate-images.ts --incidents

# Outcomes only
bun scripts/generate-images.ts --outcomes

# Specific incident
bun scripts/generate-images.ts --slug "samsung-chatgpt-code-leak"

# Replace a single image
bun scripts/generate-images.ts --replace "samsung-chatgpt-code-leak"

# Export prompts for review
bun scripts/generate-images.ts --export-prompts

# Force regenerate everything
bun scripts/generate-images.ts --force
```

### Rate limiting and retries

- 7-second delay between successful API calls
- Automatic retry (up to 3 attempts) on 429 rate limit errors with 60-second backoff
- Safety filter detection — reports `SAFETY` finish reason as failed rather than crashing

---

## Image Map

`data/imageMap.ts` is the single source of truth for mapping game entities to image paths.

### Structure

The module exports four typed Records and four helper functions:

| Export | Type | Key | Example value |
|--------|------|-----|---------------|
| `INCIDENT_IMAGES` | `Record<IncidentSlug, string>` | Slugified incident name | `/images/incidents/samsung-chatgpt-code-leak.webp` |
| `OUTCOME_IMAGES` | `Record<OutcomeImageKey, string>` | `${incidentSlug}-${labelSlug}` | `/images/outcomes/samsung-chatgpt-code-leak-give-names-to-compliance.webp` |
| `ARCHETYPE_IMAGES` | `Record<ArchetypeId, string>` | ArchetypeId enum | `/images/archetypes/pragmatist.webp` |
| `DEATH_IMAGES` | `Record<DeathType, string>` | DeathType enum | `/images/deaths/bankrupt.webp` |

### Helper functions

| Function | Parameters | Returns | Notes |
|----------|------------|---------|-------|
| `getIncidentImagePath(slug)` | `IncidentSlug` | `string` | Falls back to `/images/incidents/fallback.webp` |
| `getOutcomeImagePath(incidentSlug, labelSlug)` | `string, string` | `string \| undefined` | Returns `undefined` if no asset exists |
| `getArchetypeImagePath(id)` | `ArchetypeId` | `string \| undefined` | |
| `getDeathImagePath(type)` | `DeathType` | `string \| undefined` | |
| `slugify(text)` | `string` | `string` | Converts to lowercase kebab-case |

### Auto-generation

`INCIDENT_IMAGES` and `OUTCOME_IMAGES` are built at module load time from card data:

```typescript
// INCIDENT_IMAGES: extracts unique incidents from all ROLE_CARDS
export const INCIDENT_IMAGES: Record<IncidentSlug, string> = buildIncidentImages();

// OUTCOME_IMAGES: extracts unique HOS incident+label pairs
export const OUTCOME_IMAGES: Record<OutcomeImageKey, string> = buildOutcomeImages();
```

`ARCHETYPE_IMAGES` and `DEATH_IMAGES` are static Records keyed by enum values.

### Extractor functions

Shared between `imageMap.ts` and `generate-images.ts` for consistency:

| Function | Purpose | Used by |
|----------|---------|---------|
| `extractIncidentSlugs()` | Unique incidents from all role decks | imageMap, generate-images |
| `extractHosOutcomePairs()` | Unique HOS incident+label combos | imageMap, generate-images |

### Updating the image map

The map is auto-generated from card data. To add new images:

1. Add a card with `realWorldReference` to a card deck — the incident will be picked up automatically
2. Run `bun scripts/generate-images.ts` to generate the image file
3. The map entry is created at module load time — no manual registration needed

For archetypes and deaths, add entries directly to the static Records in `data/imageMap.ts`.

---

## Art Direction

### Visual strategy: "Glitched Corporate Surrealism"

High-fidelity AI-generated images of standard corporate scenes with visible, disturbing, or surreal artifacts. Looks real at first glance; the glitch forces a closer look.

### Category-specific direction

#### Incidents — Uncanny Valley

| Aspect | Direction |
|--------|-----------|
| Style | Photorealistic corporate photography with AI artifacts as the only clue something is off |
| Goal | Maximum uncanny valley, minimal stylization |
| Feel | AI-generated stock photo that's *almost* right |
| Content | Specific incident context (name, date, outcome) for unique imagery |

#### Outcomes — Task Failed Successfully

| Aspect | Direction |
|--------|-----------|
| Style | Polished corporate stock photo aesthetic depicting the actual disaster outcome |
| Goal | Ironic, sarcastic tone matching the game's personality feedback |
| Left vs Right | Visually distinct — each depicts the specific consequence of that swipe choice |
| Content | Derived from `onLeft.lesson` / `onRight.lesson` text |

#### Archetypes — Character Portraits

| Aspect | Direction |
|--------|-----------|
| Style | Stylized graphic — tactical patch or futuristic tarot card |
| Goal | LinkedIn-shareable quality for debrief page 3 |
| Feel | Self-important corporate character portrait, completely earnest |
| Contrast | NOT photorealistic — high-contrast, iconic, symbolic |

#### Deaths — Dramatic Failure

| Aspect | Direction |
|--------|-----------|
| Style | Over-the-top dramatic failure scenes with dark humor |
| Goal | "This is Fine" energy — dramatic disasters played for dark comedy |
| Tone | Maximum dramatic irony, deadpan presentation of absolute disaster |
| Kirk | AI corruption/system takeover aesthetic, glitched-out figure |

### Text rules

| Rule | Detail |
|------|--------|
| Maximum text | 6 words total in the entire image |
| Text placement | Short labels on characters or objects only |
| Prohibited | Infographic boxes, stat callouts, slide deck layouts, LinkedIn post frames, charts, percentage labels |
| Priority | The joke must be visible in the image — not explained in text |

### Prohibited visual patterns

- Infographic boxes or stat callouts
- Slide deck layouts
- LinkedIn post frames
- Charts or percentage labels
- Generic stock photos without AI artifacts

---

## Regenerating Images

### Regenerate all images

```sh
# Full regeneration (skips existing files)
bun scripts/generate-images.ts --force

# Full regeneration with dry run first
bun scripts/generate-images.ts --dry-run
bun scripts/generate-images.ts --force
```

### Regenerate specific images

```sh
# Replace a single image by slug
bun scripts/generate-images.ts --replace "samsung-chatgpt-code-leak"

# Regenerate a specific incident and its outcomes
bun scripts/generate-images.ts --slug "samsung-chatgpt-code-leak"

# Regenerate only incidents
bun scripts/generate-images.ts --incidents --force

# Regenerate only outcomes
bun scripts/generate-images.ts --outcomes --force

# Regenerate HOS scope only
bun scripts/generate-images.ts --scope hos --force
```

### Step-by-step: replacing a bad image

1. Identify the slug of the image to replace (check `public/images/{category}/`)
2. Run with `--replace`:
   ```sh
   bun scripts/generate-images.ts --replace "bad-image-slug"
   ```
3. Review the generated image
4. If unsatisfactory, adjust the prompt template in `scripts/generate-images.ts` and re-run
5. Commit the new image file

### Step-by-step: full regeneration workflow

1. Review prompts first:
   ```sh
   bun scripts/generate-images.ts --export-prompts
   ```
2. Check generated prompt files in `scripts/prompts/`
3. Run dry run to verify task count:
   ```sh
   bun scripts/generate-images.ts --dry-run
   ```
4. Generate with checkpoint (pauses after first image):
   ```sh
   bun scripts/generate-images.ts --force
   ```
5. Review the first image when prompted — type `yes` to continue or `no` to abort
6. If aborted, adjust templates and re-run

---

## Quality Checkpoint

### What to verify

| Check | What to look for |
|-------|-----------------|
| Text rendering | Maximum 6 words, legible, no garbled characters |
| Meme format | Recognizable layout matching the referenced format |
| Visual clarity | Core irony/absurdity visible without reading text |
| AI artifacts | Present but not overwhelming — uncanny, not broken |
| Color quality | Bold, clean colors — not muddy or washed out |
| Composition | Clean layout — no infographic boxes, charts, or slide-deck elements |
| Category match | Incident = uncanny stock photo, Outcome = disaster metaphor, Archetype = stylized portrait, Death = dramatic failure |

### Checkpoint behavior

The script automatically pauses after the first incident image is generated:

```
🔍 First image generated: /path/to/public/images/incidents/first-slug.webp
Review the image quality and art direction.
Continue with remaining 117 images? (yes/no):
```

- Type `yes` or `y` to continue
- Type anything else to abort
- Adjust prompt templates and re-run with `--force` or `--replace`

### Automated tests

Contract tests verify image map integrity without calling the API:

```sh
# Run image map contract tests
bun run test -- -g "image-map"

# Run image asset tests
bun run test -- -g "image-assets"
```

Tests verify:
- Every card with `realWorldReference` has a corresponding `INCIDENT_IMAGES` entry
- All 7 archetypes and 7 deaths have map entries
- No duplicate incident slugs
- Path format is correct (`/images/{category}/{slug}.webp`)
- Committed assets exist on disk

---

## Image Storage

### Directory structure

```
public/images/
├── archetypes/          # 7 files — one per ArchetypeId
│   ├── pragmatist.webp
│   ├── shadow-architect.webp
│   ├── disruptor.webp
│   ├── conservative.webp
│   ├── balanced.webp
│   ├── chaos-agent.webp
│   └── kirk.webp
├── deaths/              # 7 files — one per DeathType
│   ├── bankrupt.webp
│   ├── replaced-by-script.webp
│   ├── congress.webp
│   ├── fled-country.webp
│   ├── prison.webp
│   ├── audit-failure.webp
│   └── kirk.webp
├── incidents/           # ~118 files — one per unique incident slug
│   ├── samsung-chatgpt-code-leak.webp
│   ├── github-copilot-rce-cve-2025-53773.webp
│   └── ...
├── outcomes/            # ~36 files — one per HOS incident+label pair
│   ├── samsung-chatgpt-code-leak-give-names-to-compliance.webp
│   ├── samsung-chatgpt-code-leak-shield-the-team.webp
│   └── ...
└── victory.webp         # Static victory image
```

### Naming conventions

| Category | Pattern | Example |
|----------|---------|---------|
| Incidents | `{incidentSlug}.webp` | `samsung-chatgpt-code-leak.webp` |
| Outcomes | `{incidentSlug}-{labelSlug}.webp` | `samsung-chatgpt-code-leak-give-names-to-compliance.webp` |
| Archetypes | `{archetypeId}.webp` (lowercase) | `pragmatist.webp` |
| Deaths | `{deathType}.webp` (lowercase) | `bankrupt.webp` |

Slugification: lowercase, kebab-case, special characters removed. Uses the shared `slugify()` function from `data/imageMap.ts`.

### Image specifications

| Property | Value |
|----------|-------|
| Format | WebP |
| Max dimension | 800px (inside fit, without enlargement) |
| Quality | 75 |
| Aspect ratio | 16:9 (set at generation time) |
| Processing | sharp library |

### Optimization

Images are pre-optimized at generation time. No build-time processing needed. Vite serves `public/` files directly at root — no `public/` prefix in paths.

### Accessing images in code

No `public/` prefix needed. Vite serves the `public/` directory at the site root:

```typescript
// Correct — no public/ prefix
const path = "/images/incidents/samsung-chatgpt-code-leak.webp";

// Using the helper
const path = getIncidentImagePath("samsung-chatgpt-code-leak");
```

---

## Card-Image Mapping

### How cards reference images

Cards do not have an `image` field. Image lookup is indirect through `realWorldReference`:

```
Card.realWorldReference.incident → slugify() → INCIDENT_IMAGES[slug] → image path
```

### Lookup flow by component

| Component | Image type | Lookup method |
|-----------|------------|---------------|
| `CardStack.tsx` | Incident | `getIncidentImagePath(slugify(card.realWorldReference.incident))` |
| `FeedbackOverlay.tsx` | Outcome | `getOutcomeImagePath(incidentSlug, labelSlug)` |
| `DebriefPage1Collapse.tsx` | Death | `getDeathImagePath(deathType)` |
| `DebriefPage3Verdict.tsx` | Archetype | `getArchetypeImagePath(archetype.id)` (falls back to `archetype.image`) |

### Fallback behavior

| Scenario | Fallback |
|----------|----------|
| Missing incident image | `/images/incidents/fallback.webp` |
| Missing outcome image | `undefined` (component handles absence) |
| Missing archetype image | `undefined` (falls back to FontAwesome icon) |
| Missing death image | `undefined` |

### ImageWithFallback component

Reusable component at `components/ImageWithFallback.tsx` provides:

- Native lazy loading (`loading="lazy"`)
- `img.decode()` API to prevent jank
- Glitch placeholder with scanline effect while loading
- Smooth 300ms fade-in transition
- Error fallback to placeholder
- Responsive aspect ratios (`video` 16:9, `square` 1:1, `auto`)

```tsx
<ImageWithFallback
  src={getIncidentImagePath(slug)}
  alt="Incident image"
  aspectRatio="video"
/>
```

### Scope tiers

| Tier | Incident coverage | Outcome coverage |
|------|-------------------|------------------|
| Phase 13 ship (HOS pilot) | ~18 unique HOS incidents | ~36 outcome files (left + right per incident) |
| Expansion (later) | ~118 unique incidents across all roles | Grows with new incident slugs |
| Archetypes | All 7 (global) | N/A |
| Deaths | All 7 (global) | N/A |

Non-pilot roles use the fallback placeholder until their image generation phase.

---

## Troubleshooting

### GEMINI_API_KEY not set

```
ERROR: GEMINI_API_KEY not set. Set it to enable image generation.
```

**Fix:**
```sh
export GEMINI_API_KEY="your-key-here"
# Or add to .env file
```

### Rate limit errors

```
Rate limit hit, waiting 60s... (retry 1/3)
```

The script auto-retries up to 3 times with 60-second backoff. If all retries are exhausted:

- Wait a few minutes and re-run with `--replace <slug>` for failed images
- The script skips existing files, so only missing images will be regenerated

### Safety filter blocked

```
Safety filter blocked: some-incident-slug
```

The Gemini safety filter rejected the prompt. Options:

1. Re-run with `--replace <slug>` — random meme format selection may produce a different prompt
2. Adjust the prompt template to reduce potentially sensitive content
3. Skip the image — it will fall back to the placeholder in the UI

### Image exists but looks wrong

```sh
# Replace the specific image
bun scripts/generate-images.ts --replace "bad-image-slug"

# Or force regenerate all
bun scripts/generate-images.ts --force
```

### No images generated (all skipped)

Check if files already exist on disk. The script skips existing files by default:

```sh
# Check what would be generated
bun scripts/generate-images.ts --dry-run

# Force regenerate
bun scripts/generate-images.ts --force
```

### Outcome images not showing in UI

`getOutcomeImagePath()` returns `undefined` for non-pilot roles or missing assets. Verify:

```sh
# Check if the outcome key exists
ls public/images/outcomes/ | grep "incident-slug"

# Check the image map
bun -e "import { OUTCOME_IMAGES } from './data/imageMap'; console.log(Object.keys(OUTCOME_IMAGES).filter(k => k.includes('incident-slug')))"
```

### Incident image not found for a card

Verify the card has `realWorldReference.incident`:

```sh
# Check if the incident is in the map
bun -e "import { INCIDENT_IMAGES, slugify } from './data/imageMap'; console.log(INCIDENT_IMAGES[slugify('Your Incident Name')])"
```

If `undefined`, the card may be from a non-pilot role. The image will fall back to `/images/incidents/fallback.webp`.

### Prompt export for review

To review all prompts before generating:

```sh
bun scripts/generate-images.ts --export-prompts
# Check scripts/prompts/incidents.md, outcomes.md, archetypes.md, deaths.md
```

### Disk space

Each WebP image is typically 50-200KB. Full pipeline (~170 images) uses approximately 10-35MB.

### Common slug issues

| Problem | Cause | Fix |
|---------|-------|-----|
| Image not found | Slug mismatch in lookup | Use `slugify()` from `imageMap.ts` consistently |
| Duplicate images | Same incident, different casing | `slugify()` normalizes to lowercase kebab-case |
| Outcome key not found | Using direction instead of label slug | Key is `${incidentSlug}-${labelSlug}`, not `${incidentSlug}-left` |
