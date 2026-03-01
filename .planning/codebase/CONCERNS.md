# Codebase Concerns & Technical Debt

**Last Updated:** 2026-03-01  
**Analysis Scope:** Full codebase audit with focus on issues, technical debt, performance, and risks

---

## Executive Summary

This document catalogs current concerns across the SwipeRisk codebase, prioritized by severity. The most critical issues involve CSS architecture problems affecting mobile positioning, large bundle-size contributors, and testing infrastructure gaps.

---

## 🔴 Critical Severity

### 1. CSS Transform Containing Block Breaking Fixed Positioning
**Location:** [`App.tsx:328`](App.tsx:328), [`index.html:200-213`](index.html:200-213)  
**Issue:** The root container div uses `stage-transition` class which applies a CSS animation with `transform: translateY(10px) scale(0.98)` → `transform: translateY(0) scale(1)`. According to CSS specifications, any element with a transform value other than 'none' establishes a containing block for its descendants, causing `position: fixed` elements (like the feedback overlay) to be positioned relative to the transformed container instead of the viewport.

**Impact:**
- Answer overlay not centered on mobile screens (documented in [`.planning/debug/answer-overlay-mobile-centering.md`](.planning/debug/answer-overlay-mobile-centering.md))
- Fixed positioning behaves like absolute positioning relative to transformed ancestor
- Multiple containing blocks from `overflow-y-auto` on root AND `overflow-hidden` on LayoutShell compound the issue

**Remediation:**
1. Move feedback overlay outside transformed container using React Portal
2. Remove `stage-transition` from root container and apply to child wrapper instead
3. Use React Context for stage transition animations without CSS transform on container

---

### 2. NO_FCP Error in Lighthouse Reports
**Location:** All lighthouse reports (`.planning/lighthouse-report*.json`)  
**Issue:** Lighthouse tests consistently fail with `NO_FCP` (No First Contentful Paint) error, indicating the page did not paint any content during the test. This suggests either:
- Application requires JavaScript to render (no SSR)
- Animation/transition delays preventing paint detection
- Issue with headless Chrome detection

**Impact:**
- Cannot obtain performance metrics (LCP, TTI, CLS)
- No baseline for performance optimization
- CI/CD quality gates cannot be implemented

**Remediation:**
1. Add server-side rendering or prerendering for initial paint
2. Ensure critical CSS is inline and content is visible without JS
3. Disable animations for Lighthouse user agent
4. Add `aria-busy` pattern to signal content loading

---

## 🟠 High Severity

### 3. Massive constants.ts File (23KB+ / 518 lines)
**Location:** [`constants.ts`](constants.ts)  
**Issue:** Single file contains all game data (cards, personalities, death endings, boss questions). This violates single responsibility principle and creates maintenance burden.

**Statistics:**
- 518 lines of dense data structures
- ~23KB of static game content
- Contains ROLE_CARDS with nested objects for 5+ roles
- Each card has extensive text content, feedback variants (3 personalities), and action consequences

**Impact:**
- Difficult to review changes (large diffs)
- No tree-shaking possible (entire file imported even if subset used)
- Merge conflicts likely with multiple content editors
- Type checking performance degradation

**Remediation:**
1. Split into role-specific files: `data/cards/development.ts`, `data/cards/marketing.ts`, etc.
2. Create barrel export pattern: `data/cards/index.ts`
3. Consider JSON files with runtime validation using Zod/io-ts
4. Implement lazy loading for card data by role

**Files to Create:**
```
data/
  cards/
    development.ts
    marketing.ts
    management.ts
    hr.ts
    finance.ts
    cleaning.ts
    index.ts
  personalities.ts
  deathEndings.ts
  bossQuestions.ts
```

---

### 4. External CDN Dependencies (No Local Fallback)
**Location:** [`index.html:15-18`](index.html:15-18)  
**Issue:** Critical dependencies loaded from external CDNs without fallback:
- Tailwind CSS: `https://cdn.tailwindcss.com`
- Font Awesome: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
- Google Fonts: `https://fonts.googleapis.com/css2?family=Space+Grotesk...`

**Impact:**
- Application fails to render correctly if CDN unavailable
- No offline capability
- GDPR implications (external requests to US servers)
- Slower initial load due to additional DNS/TLS handshakes

**Remediation:**
1. Bundle Tailwind CSS in build process
2. Self-host Font Awesome or use SVG icons
3. Preload Google Fonts or use system font stack
4. Add `crossorigin` attributes and resource hints

---

### 5. Console Error Swallowing Pattern
**Location:** Multiple files ([`services/geminiLive.ts:198`](services/geminiLive.ts:198), [`services/geminiService.ts:81`](services/geminiService.ts:81), [`hooks/useVoicePlayback.ts:37-41`](hooks/useVoicePlayback.ts:37-41))  
**Issue:** Error handlers use `console.error` without user-facing feedback or error boundaries.

```typescript
// Anti-pattern found in codebase:
} catch (error) {
  console.error('[Gemini Live] Connection failed:', error);
}
```

**Impact:**
- Users see silent failures
- No error tracking integration (Sentry, etc.)
- Difficult to debug production issues
- No retry logic or degradation strategies

**Remediation:**
1. Implement error boundary components for React tree
2. Create user-facing error toast/notification system
3. Add structured logging with correlation IDs
4. Implement retry logic with exponential backoff

---

## 🟡 Medium Severity

### 6. scrollbar-gutter with overflow-y-auto Conflict
**Location:** [`.planning/debug/resolved/scrollbar-first-render.md`](.planning/debug/resolved/scrollbar-first-render.md), [`index.html`](index.html)  
**Issue:** HTML has `scrollbar-gutter: stable` but body has `overflow-y: auto`. Combined with nested `min-h-[100dvh]` containers and `stage-transition` animation starting at `translateY(20px)`, scrollbar appears briefly during stage transitions.

**Root Cause:**
- `key={state.stage}` triggers full remount on stage change
- Animation's initial position temporarily extends document height
- Double overflow containers create scroll context confusion

**Remediation:**
1. Remove `key` prop from root container (use React transitions instead)
2. Apply scrollbar-gutter only to html, not body
3. Use `overflow: hidden` on animation wrapper during transitions

---

### 7. Audio File Size Concerns
**Location:** `public/audio/voices/**/*.wav`  
**Issue:** WAV files are uncompressed and large:
- `lovebomber/onboarding.wav`: 420KB
- `roaster/onboarding.wav`: 467KB
- `roaster/feedback_paste.wav`: 402KB
- Total audio assets: ~3.5MB

**Impact:**
- Slow initial load on mobile networks
- High bandwidth usage
- No progressive loading strategy

**Remediation:**
1. Convert WAV to compressed formats (MP3/OGG) with fallbacks
2. Implement lazy loading for voice lines
3. Use Web Audio API for procedural audio where possible
4. Add service worker caching strategy

---

### 8. Taskbar Overlapping Content (Partially Resolved)
**Location:** [`.planning/debug/roast-window-mobile-cutoff.md`](.planning/debug/roast-window-mobile-cutoff.md), [`App.tsx`](App.tsx)  
**Status:** Partially resolved but pattern remains  
**Issue:** Fixed position taskbar (`h-12` at `bottom-0`) overlaps content. Main content only has `pb-2` (8px) bottom padding on mobile, but taskbar is 48px tall.

**Evidence:**
- Boot button cut off at bottom
- Roast terminal obscured by fixed taskbar
- Only 8px padding vs 48px taskbar = 40px overlap

**Remediation:**
1. Add `pb-12` (48px) to main content containers
2. Use CSS `env(safe-area-inset-bottom)` for notched devices
3. Consider sticky positioning instead of fixed

---

### 9. Hardcoded Animation Values
**Location:** [`index.html:17-84`](index.html:17-84)  
**Issue:** CSS custom properties define animation timing, but many animations use hardcoded values in keyframes:

```css
/* Inconsistent - some use variables, some don't */
animation: fadeSlideIn var(--anim-medium) ...  /* Good */
animation: glitch 0.3s ...                      /* Bad - hardcoded */
animation: cursor-blink 1s ...                  /* Bad - hardcoded */
```

**Impact:**
- Inconsistent animation timing across UI
- Difficult to adjust globally
- Violates design system consistency

**Remediation:**
1. Audit all animations and replace hardcoded values with CSS variables
2. Create animation timing tokens: `--duration-fast`, `--duration-normal`, `--duration-slow`
3. Document animation usage patterns

---

## 🟢 Low Severity

### 10. Missing TODO/FIXME Comments
**Location:** Across codebase  
**Issue:** Only 2 occurrences found:
- [`tests/helpers/selectors.ts:14`](tests/helpers/selectors.ts:14) - DEBUG/DISABLE/PASTE/ENABLE text patterns
- [`constants.ts:136`](constants.ts:136) - DEBUG_BOT sender name

**Impact:**
- Technical debt not documented
- No explicit markers for known issues
- Makes long-term maintenance harder

**Remediation:**
1. Add TODO comments for known issues
2. Use issue tracker integration (TODO → GitHub issue)
3. Consider linting rule to flag TODOs in CI

---

### 11. Playwright Tests Using Relaxed Matchers
**Location:** [`tests/helpers/selectors.ts`](tests/helpers/selectors.ts)  
**Issue:** Test selectors use case-insensitive regex fallbacks:

```typescript
leftButtonFallback: 'button:has-text(/DEBUG|DISABLE|REJECT/i)',
rightButtonFallback: 'button:has-text(/PASTE|ENABLE|ACCEPT/i)',
```

**Impact:**
- Tests may pass incorrectly if button text changes
- Case-insensitive matching can cause false positives
- Reliance on fallback selectors indicates primary selectors may be unreliable

**Remediation:**
1. Use data-testid attributes consistently
2. Remove fallback selectors once primary selectors are stable
3. Add accessibility labels and test via ARIA roles

---

### 12. Package.json Scripts Limitation
**Location:** [`package.json:6-11`](package.json:6-11)  
**Issue:** Limited npm scripts available:
- No `lint` script configured
- No `format` (Prettier) script
- No `typecheck` script
- Only basic `dev`, `build`, `preview`, `test`

**Remediation:**
1. Add ESLint configuration and `lint` script
2. Add Prettier configuration and `format` script
3. Add `typecheck` script for TypeScript checking
4. Add `test:ui` for Playwright UI mode

---

### 13. Empty Task Files
**Location:** [`tasks/todo.md`](tasks/todo.md), [`tasks/lessons.md`](tasks/lessons.md)  
**Issue:** Task tracking files are empty (0 bytes each)

**Remediation:**
1. Populate with initial structure or remove
2. Integrate with project management tool
3. Add GitHub Issues/Projects integration

---

## Security Considerations

### ENV Variable Exposure Pattern
**Location:** [`services/geminiLive.ts:255`](services/geminiLive.ts:255)  
**Pattern:** API keys accessed via `import.meta.env.VITE_GEMINI_API_KEY`

**Risk Level:** Low (expected for client-side with proper CORS)  
**Mitigation:** Ensure API routes have proper CORS and rate limiting

### Local Storage Usage
**Search:** No localStorage/sessionStorage usage found  
**Status:** ✅ No concerns

---

## Performance Analysis

### Bundle Size Concerns
| File | Size | Impact |
|------|------|--------|
| `constants.ts` | ~23KB | Loaded eagerly, not tree-shakeable |
| Audio assets | ~3.5MB | Large uncompressed WAV files |
| Tailwind CDN | Variable | External dependency, not optimized |

### Key Metrics
- **NO_FCP Error:** All Lighthouse tests fail
- **Total Lines:** ~5,500 (excluding tests and node_modules)
- **Largest File:** `constants.ts` at 518 lines

---

## Recommendations Summary

### Immediate Actions (This Sprint)
1. **Fix CSS containing block issue** - Move overlay outside transformed container
2. **Split constants.ts** - Separate into role-specific data files
3. **Add padding for taskbar** - Fix mobile cutoff issues

### Short-term (Next 2 Sprints)
4. Bundle Tailwind CSS and remove CDN dependency
5. Implement error boundaries and user-facing error handling
6. Convert audio files to compressed formats
7. Fix Lighthouse NO_FCP errors for performance baseline

### Long-term (Next Quarter)
8. Implement SSR or prerendering
9. Add comprehensive linting (ESLint, Prettier)
10. Set up error tracking (Sentry)
11. Implement service worker for offline support

---

## Related Documents

- [TESTING.md](TESTING.md) - Testing strategy and coverage
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design overview
- [`.planning/debug/`](.planning/debug/) - Active and resolved debug issues
- [`.planning/codebase/STACK.md`](STACK.md) - Technology stack documentation
