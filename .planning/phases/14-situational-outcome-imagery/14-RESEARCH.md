# Phase 14: Situational & Outcome Imagery Display — Research

**Researched:** 2026-03-16
**Domain:** React image rendering, lazy loading, responsive sizing, WebP optimization
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Incident card images**: Hero banner above text, 16:9 aspect ratio, every card gets an image, image moves with card during swipe
- **Outcome overlay images**: Large hero at top of overlay, 16:9, different images per swipe direction (left/right), ~300ms fade-in, overlay width matches card width
- **Collapse page (Game Over)**: Full-width hero above death text, unique image per DeathType (~6 images), replaces FontAwesome icon
- **Archetype verdict**: Centered badge image (1:1) above archetype name, "achievement unlock" feel

### Claude's Discretion
- Exact image container styling (border radius, shadow, padding)
- Mobile-specific image height constraints
- Transition timing beyond ~300ms fade-in
- Preloaded image management (Image() constructor vs link preload)
- Glitch placeholder CSS implementation details

### Deferred Ideas (OUT OF SCOPE)
- Composite LinkedIn share card (badge + stats as og:image)
- Parallax swipe effect on card images
- Blur-up progressive loading
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| IMAGE-01 | Incident card image placement + sizing (mobile + web) | Native `<img>` with aspect-ratio CSS, object-fit: cover, responsive height constraints |
| IMAGE-02 | Outcome overlay image placement + sizing | Same pattern as cards, 16:9 hero at top of overlay, full overlay width |
| IMAGE-03 | Collapse page (Game Over) image placement + sizing | Full-width container, 16:9 hero above death ending text |
| IMAGE-04 | Archetype verdict image (tactical patch style) + share card sizing | 1:1 aspect ratio for badge, share card sizing TBD |
| IMAGE-05 | Fallback when image missing (placeholder or hide) | Glitch aesthetic placeholder matching "Glitched Corporate Surrealism" theme |
| IMAGE-06 | Lazy load / performance (avoid blocking render) | Native `loading="lazy"` + optional intersection observer for enhanced control |
</phase_requirements>

## Summary

Phase 14 introduces image rendering across 4 UI surfaces in a React + TypeScript + Tailwind CSS application. The project currently has **zero `<img>` tags** — all visuals are FontAwesome icons or CSS. Images will be stored in `public/images/` following the existing audio asset pattern.

**Primary recommendation:** Use **native HTML `<img>` with React state** for image loading — no additional libraries needed. Modern browsers handle lazy loading via `loading="lazy"`. Use CSS `aspect-ratio` for responsive sizing, `object-fit: cover` for cropping, and a hand-rolled fade-in transition. Implement a glitch-style placeholder that crossfades to the loaded image, matching the game's "Glitched Corporate Surrealism" aesthetic.

**Critical insight:** Images must move with cards during swipe gestures, which means the image must be inside the swipe-transformed container, not a separate layer. This affects how we structure the CardStack component.

**File naming convention from Phase 13:**
- `incident-{cardId}.webp` — incident card images
- `outcome-{cardId}-{direction}.webp` — outcome images (left/right variants)
- `collapse-{deathType}.webp` — death ending images
- `archetype-{archetypeId}.webp` — archetype badge images

---

## Standard Stack

### Core
| Approach | Version | Purpose | Why Standard |
|----------|---------|---------|--------------|
| Native `<img>` | HTML5 | Image rendering | Zero dependencies, works with React, browser-optimized |
| `loading="lazy"` | HTML5 | Lazy loading | Native, no JS overhead, 95%+ browser support |
| CSS `aspect-ratio` | CSS3 | Responsive sizing | Prevents layout shift, cleaner than padding-hack |
| `object-fit: cover` | CSS3 | Image cropping | Maintains aspect ratio while filling container |
| WebP format | Modern image | Compression | ~30% smaller than JPEG, all modern browsers |

### Supporting
| Technique | Purpose | When to Use |
|-----------|---------|-------------|
| `onLoad` + `onError` handlers | Load state management | Trigger fade-in, handle missing images |
| CSS `@keyframes fadeIn` | Transition animation | 300ms opacity transition as specified |
| Intersection Observer (optional) | Advanced lazy loading | If `loading="lazy"` needs enhancement |
| `decode()` API | Prevent jank on large images | `img.decode().then()` before showing |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native `<img>` | `next/image` or similar | Next.js only, this is Vite project |
| `loading="lazy"` | `react-lazy-load-image-component` | +3KB bundle, native is sufficient |
| CSS transitions | Framer Motion | 09-01 constraint: no animation libraries |

**No additional dependencies needed.** Native web APIs suffice for all requirements.

---

## Architecture Patterns

### 1. Image Container Pattern

**Purpose:** Consistent responsive sizing with aspect ratio enforcement

```tsx
// Pattern for 16:9 images (incident cards, outcomes, collapse)
<div className="relative w-full aspect-video overflow-hidden rounded-lg">
  <img
    src={imagePath}
    alt={description}
    loading="lazy"
    className="w-full h-full object-cover opacity-0 transition-opacity duration-300"
    onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
    onError={(e) => handleImageError(e)}
  />
</div>
```

**Tailwind classes:**
- `aspect-video` = 16:9
- `aspect-square` = 1:1 (for archetype badges)
- `object-cover` = crop to fill
- `overflow-hidden` = clip overflow

### 2. Glitch Placeholder Pattern

**Purpose:** Thematic fallback that doesn't look like a broken image

```tsx
// Placeholder shown while loading or on error
<div className="absolute inset-0 bg-slate-800 flex items-center justify-center glitch-placeholder">
  <div className="text-cyan-500/50 text-4xl animate-pulse">
    <i className="fa-solid fa-image"></i>
  </div>
  {/* CSS glitch effect overlay */}
  <div className="glitch-overlay" aria-hidden />
</div>
```

**CSS glitch effect** (add to index.html):
```css
.glitch-placeholder {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  position: relative;
}
.glitch-placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(34, 211, 238, 0.03) 2px,
    rgba(34, 211, 238, 0.03) 4px
  );
  animation: glitch-scan 2s linear infinite;
}
@keyframes glitch-scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
```

### 3. Fade-In Transition Pattern

**Purpose:** Smooth 300ms reveal as specified

```tsx
const [isLoaded, setIsLoaded] = useState(false);
const [hasError, setHasError] = useState(false);

<img
  src={imagePath}
  className={`
    w-full h-full object-cover
    transition-opacity duration-300 ease-out
    ${isLoaded && !hasError ? 'opacity-100' : 'opacity-0'}
  `}
  onLoad={() => setIsLoaded(true)}
  onError={() => setHasError(true)}
/>
```

### 4. Image Path Resolution Pattern

**Purpose:** Centralized path generation following Phase 13 naming

```typescript
// utils/imagePaths.ts
export function getIncidentImagePath(cardId: string): string {
  return `/images/incident-${cardId}.webp`;
}

export function getOutcomeImagePath(cardId: string, direction: 'LEFT' | 'RIGHT'): string {
  return `/images/outcome-${cardId}-${direction.toLowerCase()}.webp`;
}

export function getCollapseImagePath(deathType: DeathType): string {
  return `/images/collapse-${deathType.toLowerCase()}.webp`;
}

export function getArchetypeImagePath(archetypeId: ArchetypeId): string {
  return `/images/archetype-${archetypeId.toLowerCase()}.webp`;
}
```

### 5. Card Integration Pattern

**Critical:** Image must be inside the swipe-transformed container

```tsx
// In CardStack.tsx — image goes inside the card body, above text
<div className="p-4 md:p-10 flex flex-col flex-1 overflow-hidden">
  {/* NEW: Hero image at top of card body */}
  <div className="mb-4 md:mb-6">
    <ImageWithFallback
      src={getIncidentImagePath(currentCard.id)}
      alt={`Scene: ${currentCard.context}`}
      aspectRatio="video"
    />
  </div>
  
  {/* Existing: Sender info */}
  <div className="flex items-center gap-3">...</div>
  
  {/* Existing: Card text */}
  <p className="text-base md:text-xl">{currentCard.text}</p>
</div>
```

**Why inside the card:** The card container has `transform: translateX(${offset}px)` applied during swipe. If the image were outside this container, it wouldn't move with the swipe gesture.

### 6. Responsive Sizing Strategy

| Surface | Mobile | Desktop | Aspect Ratio |
|---------|--------|---------|--------------|
| Incident card | `h-auto`, max-height via container | `h-auto`, constrained by card | 16:9 |
| Outcome overlay | Full overlay width | Full overlay width (matches card) | 16:9 |
| Collapse page | Full container width | Max-w-2xl centered | 16:9 |
| Archetype badge | 120px × 120px | 160px × 160px | 1:1 |

**Mobile height constraint:** Add `max-h-[200px]` or similar to prevent excessive scrolling on small screens.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Lazy loading detection | Scroll event listeners with getBoundingClientRect | `loading="lazy"` attribute | Native, optimized, no main thread work |
| Image preloading | Custom `<link rel="preload">` injection | `new Image().src = path` in useEffect | Simpler, works with React lifecycle |
| Aspect ratio maintenance | Padding-bottom percentage hack | CSS `aspect-ratio` property | Cleaner, handles all ratios |
| Fade transitions | requestAnimationFrame opacity loops | CSS `transition-opacity` | GPU-accelerated, simpler code |
| Image format detection | User-agent sniffing | Serve WebP, let browser fall back | Modern browsers all support WebP |

**Key insight:** Modern web APIs handle image loading elegantly. Custom solutions add bundle size and maintenance burden without benefit.

---

## Common Pitfalls

### Pitfall 1: Layout Shift (CLS)
**What goes wrong:** Image loads and pushes content down, causing jank
**Why it happens:** No reserved space for image before load
**How to avoid:** Always use `aspect-ratio` container; placeholder takes up same space as loaded image
**Warning signs:** Cumulative Layout Shift > 0.1 in Lighthouse

### Pitfall 2: Swipe Gesture Breakage
**What goes wrong:** Image doesn't move with card during swipe
**Why it happens:** Image placed outside the transformed container
**How to avoid:** Image must be descendant of the element with `transform: translateX()`
**Warning signs:** Swipe works but image stays fixed while card moves

### Pitfall 3: Mobile Scroll Performance
**What goes wrong:** Laggy scrolling when many images in view
**Why it happens:** `loading="lazy"` not used, or images too large
**How to avoid:** Always lazy load below-fold images; ensure WebP compression
**Warning signs:** FPS drops below 60 during scroll

### Pitfall 4: Flash of Unstyled Content
**What goes wrong:** Broken image icon shows before glitch placeholder
**Why it happens:** `onError` fires after initial render but before placeholder shows
**How to avoid:** Default to showing placeholder; hide only when `isLoaded && !hasError`

### Pitfall 5: Memory Leaks on Rapid Card Changes
**What goes wrong:** Images from previous cards stay in memory
**Why it happens:** Browser keeps decoded images in cache; rapid swiping accumulates
**How to avoid:** Don't preload images for off-screen cards; let browser manage cache
**Warning signs:** Memory usage grows continuously during gameplay

### Pitfall 6: Missing Alt Text Accessibility
**What goes wrong:** Screen readers can't describe images
**Why it happens:** Alt attribute omitted or generic
**How to avoid:** Use contextual alt: `"Scene: {card.context}"` not `"Image"`
**Warning signs:** a11y audit failures

---

## Code Examples

### 1. Reusable ImageWithFallback Component

```tsx
// components/ImageWithFallback.tsx
import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  aspectRatio?: 'video' | 'square' | 'auto';
  className?: string;
  containerClassName?: string;
}

export function ImageWithFallback({
  src,
  alt,
  aspectRatio = 'video',
  className = '',
  containerClassName = '',
}: ImageWithFallbackProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const aspectClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    auto: '',
  }[aspectRatio];

  const showImage = isLoaded && !hasError;

  return (
    <div className={`relative overflow-hidden rounded-lg ${aspectClass} ${containerClassName}`}>
      {/* Glitch placeholder - always rendered, visibility toggled */}
      <div
        className={`
          absolute inset-0 bg-slate-800 flex items-center justify-center
          glitch-placeholder transition-opacity duration-300
          ${showImage ? 'opacity-0' : 'opacity-100'}
        `}
        aria-hidden={showImage}
      >
        <i className="fa-solid fa-image text-cyan-500/30 text-3xl animate-pulse" />
      </div>

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`
          absolute inset-0 w-full h-full object-cover
          transition-opacity duration-300 ease-out
          ${showImage ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
```

### 2. CardStack Integration

```tsx
// In CardStack.tsx — add to card body section
import { ImageWithFallback } from './ImageWithFallback';
import { getIncidentImagePath } from '../../utils/imagePaths';

// Inside the current card render, above sender info:
<div className="p-4 md:p-10 flex flex-col flex-1 overflow-hidden">
  {/* Hero image - moves with card during swipe */}
  <div className="mb-4 md:mb-6 shrink-0">
    <ImageWithFallback
      src={getIncidentImagePath(currentCard.id)}
      alt={`Incident: ${currentCard.context}`}
      aspectRatio="video"
      containerClassName="max-h-[200px] md:max-h-none"
    />
  </div>
  
  {/* Rest of card content... */}
</div>
```

### 3. FeedbackOverlay Integration

```tsx
// In FeedbackOverlay.tsx — add hero image at top
import { ImageWithFallback } from '../ImageWithFallback';
import { getOutcomeImagePath } from '../../utils/imagePaths';

// Props need cardId and choice added:
interface FeedbackOverlayProps {
  // ... existing props
  cardId?: string;
  choice?: 'LEFT' | 'RIGHT';
}

// Inside the modal content, after escalation banner:
{cardId && choice && (
  <div className="mb-6">
    <ImageWithFallback
      src={getOutcomeImagePath(cardId, choice)}
      alt="Outcome visualization"
      aspectRatio="video"
    />
  </div>
)}
```

### 4. DebriefPage1Collapse Integration

```tsx
// In DebriefPage1Collapse.tsx — replace/supplement FontAwesome icon
import { ImageWithFallback } from '../ImageWithFallback';
import { getCollapseImagePath } from '../../../utils/imagePaths';

// Inside death ending display:
{deathEnding && (
  <div className="mb-6 md:mb-8 p-6 md:p-8 rounded-xl border border-red-900/30 bg-red-950/20">
    {/* Image replaces/supplements icon */}
    <div className="mb-4 mx-auto max-w-md">
      <ImageWithFallback
        src={getCollapseImagePath(state.deathType!)}
        alt={`Ending: ${deathEnding.title}`}
        aspectRatio="video"
      />
    </div>
    
    {/* Optional: keep icon smaller, below image */}
    <div className={`text-3xl mb-2 ${deathEnding.color}`}>
      <i className={`fa-solid ${deathEnding.icon}`} aria-hidden></i>
    </div>
    
    <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${deathEnding.color}`}>
      {deathEnding.title}
    </h2>
    <p className="text-slate-300 text-base md:text-lg">{deathEnding.description}</p>
  </div>
)}
```

### 5. DebriefPage3Verdict Integration

```tsx
// In DebriefPage3Verdict.tsx — badge above archetype name
import { ImageWithFallback } from '../ImageWithFallback';
import { getArchetypeImagePath } from '../../../utils/imagePaths';

// Inside archetype verdict section:
<div className={`mb-6 md:mb-8 p-8 md:p-12 rounded-2xl border ${archetypeColorClass}`}>
  <div className="text-sm text-slate-400 uppercase tracking-widest mb-4">
    Classification
  </div>
  
  {/* Archetype badge - 1:1 aspect ratio */}
  {archetype && (
    <div className="mx-auto mb-6 w-32 h-32 md:w-40 md:h-40">
      <ImageWithFallback
        src={getArchetypeImagePath(archetype.id)}
        alt={`Badge: ${archetype.name}`}
        aspectRatio="square"
        containerClassName="rounded-xl border-2 border-current"
      />
    </div>
  )}
  
  <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
    {archetype?.name ?? "Unknown"}
  </h2>
  <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-lg mx-auto">
    {archetypeDescription}
  </p>
</div>
```

### 6. Type Extensions

```typescript
// types.ts — add image fields

export interface Card {
  id: string;
  source: AppSource;
  sender: string;
  context: string;
  storyContext?: string;
  text: string;
  realWorldReference?: RealWorldReference;
  // Phase 14: Image path (optional for fallback)
  image?: string;
  onRight: ChoiceOutcome;
  onLeft: ChoiceOutcome;
}

export interface ChoiceOutcome {
  label: string;
  hype: number;
  heat: number;
  fine: number;
  violation: string;
  feedback: { [key in PersonalityType]: string };
  lesson: string;
  // Phase 14: Outcome-specific image
  image?: string;
}

// data/deathEndings.ts — add image field
export const DEATH_ENDINGS: Record<
  DeathType,
  { 
    title: string; 
    description: string; 
    icon: string; 
    color: string;
    image?: string; // Phase 14
  }
> = { /* ... */ };

// data/archetypes.ts — add image field  
export interface Archetype {
  id: ArchetypeId;
  name: string;
  description: string;
  icon: string;
  color: string;
  traits: string[];
  image?: string; // Phase 14
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `padding-bottom` hack for aspect ratio | CSS `aspect-ratio` property | 2021 (broad support) | Cleaner code, better performance |
| Intersection Observer polyfills | Native `loading="lazy"` | 2019 (Chrome), 2020 (FF/Safari) | Simpler, 95%+ browser support |
| JavaScript fade animations | CSS `transition-opacity` | Always best practice | GPU-accelerated, less JS |
| JPEG/PNG | WebP with fallbacks | 2020+ | ~30% smaller files |

**Current browser support (as of 2026):**
- `aspect-ratio`: 96%+ (all modern browsers)
- `loading="lazy"`: 95%+ (all modern browsers)
- WebP: 96%+ (all modern browsers)
- No fallbacks needed for target audience (tech professionals, modern browsers)

---

## Open Questions

1. **Image dimensions and compression**
   - What we know: WebP format recommended, ~30% savings over JPEG
   - What's unclear: Exact pixel dimensions for each image type
   - Recommendation: Start with 800×450 for 16:9 (incident/outcome), 400×400 for 1:1 (archetype)

2. **Outcome overlay width adjustment**
   - What we know: Currently `max-w-lg`, needs to match card width
   - What's unclear: Exact breakpoint behavior
   - Recommendation: Change to `max-w-full lg:max-w-[43rem]` to match CardStack

3. **Preloading strategy**
   - What we know: Option to preload next card's image
   - What's unclear: Memory impact on mobile devices
   - Recommendation: Start without preloading, add only if perceptible lag observed

4. **Glitch placeholder animation intensity**
   - What we know: Should match "Glitched Corporate Surrealism" theme
   - What's unclear: How subtle vs. aggressive
   - Recommendation: Subtle scanline animation, test with stakeholders

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright 1.58.2 |
| Config file | `playwright.config.ts` |
| Quick run command | `bun run test -- -g "image"` |
| Full suite command | `bun run test` |
| Visual tests | `bun run test:visual` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| IMAGE-01 | Incident card displays image with 16:9 ratio | visual + layout | `bun run test -- tests/image-incident-card.spec.ts` | ❌ Wave 0 |
| IMAGE-01 | Image moves with card during swipe | interaction | `bun run test -- tests/image-swipe-sync.spec.ts` | ❌ Wave 0 |
| IMAGE-02 | Outcome overlay shows hero image | visual | `bun run test -- tests/image-outcome-overlay.spec.ts` | ❌ Wave 0 |
| IMAGE-02 | Fade-in transition completes | visual | `bun run test -- tests/image-transitions.spec.ts` | ❌ Wave 0 |
| IMAGE-03 | Collapse page shows death image | visual | `bun run test -- tests/image-collapse-page.spec.ts` | ❌ Wave 0 |
| IMAGE-04 | Archetype badge 1:1 ratio | visual | `bun run test -- tests/image-archetype-badge.spec.ts` | ❌ Wave 0 |
| IMAGE-05 | Glitch placeholder on missing image | visual + functional | `bun run test -- tests/image-fallback.spec.ts` | ❌ Wave 0 |
| IMAGE-06 | Images lazy load below fold | performance | `bun run test -- tests/image-lazy-load.spec.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `bun run test:smoke` (~15s)
- **Per wave merge:** `bun run test` (full suite)
- **Phase gate:** Visual tests pass before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `tests/image-incident-card.spec.ts` — covers IMAGE-01
- [ ] `tests/image-swipe-sync.spec.ts` — covers IMAGE-01 interaction
- [ ] `tests/image-outcome-overlay.spec.ts` — covers IMAGE-02
- [ ] `tests/image-transitions.spec.ts` — covers IMAGE-02 fade-in
- [ ] `tests/image-collapse-page.spec.ts` — covers IMAGE-03
- [ ] `tests/image-archetype-badge.spec.ts` — covers IMAGE-04
- [ ] `tests/image-fallback.spec.ts` — covers IMAGE-05
- [ ] `tests/image-lazy-load.spec.ts` — covers IMAGE-06

---

## Sources

### Primary (HIGH confidence)
- [MDN: HTMLImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement) — native img API
- [MDN: Lazy loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading) — loading="lazy" behavior
- [MDN: aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) — CSS property reference
- [web.dev: Optimize LCP](https://web.dev/articles/optimize-lcp) — image loading best practices
- [Can I Use: WebP](https://caniuse.com/webp) — browser support matrix

### Secondary (MEDIUM confidence)
- Phase 09 RESEARCH.md — animation constraints, CSS transition patterns
- Phase 04 RESEARCH.md — prefers-reduced-motion, performance patterns
- CardStack.tsx (existing) — swipe gesture implementation
- FeedbackOverlay.tsx (existing) — modal structure

### Tertiary (LOW confidence)
- Project-specific "Glitched Corporate Surrealism" aesthetic — visual design direction
- Phase 13 architecture (referenced in CONTEXT.md) — file naming conventions

---

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — Native web APIs with broad support
- Architecture: **HIGH** — Clear integration points from existing code
- Pitfalls: **HIGH** — Common patterns well-documented in web perf community
- Image dimensions: **MEDIUM** — Recommendations based on typical usage, need validation
- Glitch aesthetic: **LOW** — Design preference, needs stakeholder review

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (30 days — image loading patterns are stable)

**Next steps for planner:**
1. Wave 0: Create ImageWithFallback component + utility functions
2. Wave 0: Add image path fields to types
3. Wave 1: Integrate into CardStack with tests
4. Wave 2: Integrate into FeedbackOverlay with tests
5. Wave 3: Integrate into debrief pages with tests
6. Wave 4: CSS polish, glitch placeholder refinement
