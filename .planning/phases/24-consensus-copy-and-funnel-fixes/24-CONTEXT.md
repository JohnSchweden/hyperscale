# Phase 24: Consensus Copy and Funnel Fixes - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning
**Source:** PRD Express Path (verified plan from planning session)

<domain>
## Phase Boundary

Addresses the highest-agreement UX/copy gaps identified in the consensus review:
- Prison ending title rewrite (tone consistency, remove Office Space innuendo)
- Static OG meta in `index.html` (og:image, og:url, canonical, twitter:card) — fixes share preview fallback
- Brand spine unification: K-Maru leads, Kobayashi Maru is optional body mention
- Debrief copy voice: cynical-but-literate register consistent with IntroScreen
- P1 card order: lesson before vector explanation for pedagogical anchor
- P3 CTA framing: copy-first guidance + V2 button demotion to secondary
- Team Mode: add actionable "Copy game link" button
- Editorial hygiene: en-dash year ranges in failureLessons.ts
- Public URL constant: single source of truth via `VITE_PUBLIC_GAME_URL`

**Not in scope:** SSR/prerender for per-outcome OG tags, full audit-page collapsible UI, og-default.png asset creation (manual step).

</domain>

<decisions>
## Implementation Decisions

### 1.1 Prison Ending (LOCKED)
- `deathEndings.ts` PRISON title: `"Federal pound-me-in-the-ass prison"` → `"Federal indictment (jumpsuit included)"`
- PRISON description: `"Orange is the new black."` → `"Orange is not a branding choice."`

### 1.2 Public URL Constant (LOCKED)
- Create `src/lib/publicGameUrl.ts` with `getPublicGameUrl()` — reads `VITE_PUBLIC_GAME_URL` env, falls back to `https://k-maru-seven.vercel.app`
- Add to `vitest.config.ts` `define` block: `"import.meta.env.VITE_PUBLIC_GAME_URL": JSON.stringify("https://k-maru-seven.vercel.app")`
- Document in `.env.example` as commented-out optional var

### 1.3 index.html OG/Meta (LOCKED)
- Add `<link rel="canonical">`, `<meta property="og:url">`, `<meta property="og:image">` (×2 size attrs), `<meta name="twitter:card">`, `<meta name="twitter:image">` — all pointing to production host
- Update `og:description` / `meta[name=description]` to: `"Free swipe game, no signup. Every AI decision blows up in your face—workplace dilemmas from real 2024–25 incidents. For people who hate boring compliance training."`
- `og:image` URL: `https://k-maru-seven.vercel.app/og-default.png` (asset created manually out of band)

### 1.4 Brand Spine — Share Text (LOCKED)
- `formatShareText`: new body per spec (K-Maru first, Kobayashi optional one-liner, shorter)
- `getShareUrl` title: `"Kobayashi Maru - ${archetype.name} Archetype"` → `"K-Maru — ${archetype.name}"`
- `KIRK_SHARE_TEXT` in `DebriefPage3Verdict.tsx`: replace hardcoded URL with `getPublicGameUrl()`
- `updateMetaTags` ogTitle: fix hyphen → em dash; lowercase `resilience`
- `updateMetaTags` ogDesc: drop "Kobayashi Maru", use concise brag copy

### 2.1 DebriefPage2AuditTrail Voice (LOCKED)
- Insert 2-sentence intro blurb after "A complete record..." heading: paper-trail framing, no deniability
- Amber reflection line: `"Consider how different choices might have changed the outcome"` → `"Replay the forks mentally: same card, other swipe — different fine, different headline."`

### 2.2 DebriefPage1Collapse Victory Copy (LOCKED)
- Replace both `<p>` tags in "Why you survived" block with cynical-literate copy per spec

### 3.1 DebriefPage1Collapse Card Order (LOCKED)
- Non-Kirk path: swap ExplanationCard and FailureLessonCard so lesson sits immediately under DeathEndingCard
- Kirk path: keep existing order (explanation → lesson)
- Add comment documenting the rule

### 3.3 DebriefPage3Verdict CTA Framing (LOCKED)
- Insert helper hint `<p>` after subtitle: "Copy the post text first — LinkedIn usually shows the site's static preview, not text from this screen."
- V2 DM button: demote from `bg-cyan-600 hover:bg-cyan-500 text-white` to `border border-cyan-500/40 bg-transparent text-cyan-300 hover:bg-cyan-500/10`

### 2.3 PersonalitySelect Bridge Line (LOCKED — optional if voice still off)
- Append second `<p>` after existing subcopy: "Narrator accents are flavor; the scenarios are US tech satire. That mismatch is on purpose."

### 4.1 Team Mode Copy Link (LOCKED)
- Add "Copy game link" `<button>` below Team Mode `<p>` in IntroScreen
- Uses `navigator.clipboard.writeText(window.location.href)`, `data-testid="copy-game-link-button"`
- Reduce Team Mode `<p>` bottom margin to `mb-3 md:mb-4`

### 4.2 En-Dash Year Ranges (LOCKED)
- Replace all `\d{4}-\d{4}` hyphen patterns in `failureLessons.ts` with en-dash (U+2013)

### Test Updates (LOCKED)
- `tests/image-collapse-page.spec.ts`: update PRISON title regex
- `unit/linkedin-share.test.ts`: update all expectations to match new formatShareText, getShareUrl title

### Claude's Discretion
- Wave assignment for parallel execution (SEO/brand changes can run in parallel with copy-only changes)
- Exact placement of new elements within existing JSX trees (follow existing spacing patterns)

</decisions>

<specifics>
## Specific References

**Files to modify:**
1. `src/data/deathEndings.ts`
2. `index.html`
3. `.env.example`
4. `vitest.config.ts`
5. `src/lib/publicGameUrl.ts` (NEW)
6. `src/utils/linkedin-share.ts`
7. `src/components/game/debrief/DebriefPage3Verdict.tsx`
8. `src/components/game/debrief/DebriefPage2AuditTrail.tsx`
9. `src/components/game/debrief/DebriefPage1Collapse.tsx`
10. `src/components/game/PersonalitySelect.tsx`
11. `src/components/game/IntroScreen.tsx`
12. `src/data/failureLessons.ts`
13. `unit/linkedin-share.test.ts`
14. `tests/image-collapse-page.spec.ts`

**Key exact strings confirmed from codebase:**

PRISON before: `title: "Federal pound-me-in-the-ass prison"`, `"Orange is the new black."`

formatShareText before:
```
return `I just faced the AI Kobayashi Maru as a ${roleTitle}.
My Resilience Score: ${clampedResilience}% (${archetypeName}). Can you beat my score?
Try the No-Win Simulation and swipe your way through the AI Singularity.
It's not about passing; it's about discovering who you are when the system collapses.
[NOTICE: Made for people who hate f*cking boring training]
${url}`;
```

formatShareText after:
```
return `I just finished K-Maru as a ${roleTitle} — the AI no-win swipe game (Kobayashi energy, corporate liability).
Resilience: ${clampedResilience}% (${archetypeName}). Beat my score?
${url}
[NOTICE: Made for people who hate f*cking boring training]`;
```

getShareUrl title before: `"Kobayashi Maru - ${archetype.name} Archetype"`
getShareUrl title after: `` `K-Maru — ${archetype.name}` ``

KIRK_SHARE_TEXT before: `"I broke the Kobayashi Maru. There was always a third option. Kirk would be proud.\n\nhttps://k-maru-seven.vercel.app/"`
KIRK_SHARE_TEXT after: `` `I broke K-Maru's no-win test. Third option. Kirk-coded.\n\n${getPublicGameUrl()}/` ``

Victory copy before:
```
<p className="text-xs text-slate-500 mb-2">
  Your decisions balanced risk across budget, heat, and hype — no single vector dominated.
</p>
<p className="text-sm text-gray-300 leading-relaxed">
  Surviving a quarter in hyperscale means managing competing pressures without letting any one metric spiral. You kept the budget sustainable, avoided regulatory heat, and maintained just enough hype to stay funded. That balance is the real win.
</p>
```

Victory copy after:
```
<p className="text-xs text-slate-500 mb-2">
  You kept budget, heat, and hype from eating each other — no single meter ran away.
</p>
<p className="text-sm text-gray-300 leading-relaxed">
  Hyperscale is three bad incentives on one dashboard. You held an uneasy truce
  long enough to file the quarter under "still legal." The synthetic coffee is still fake;
  the tradeoff you navigated isn't.
</p>
```

Amber line before: `"Consider how different choices might have changed the outcome"`
Amber line after: `"Replay the forks mentally: same card, other swipe — different fine, different headline."`

V2 button before: `bg-cyan-600 hover:bg-cyan-500 text-white`
V2 button after: `border border-cyan-500/40 bg-transparent text-cyan-300 hover:bg-cyan-500/10`

</specifics>

<deferred>
## Deferred Ideas

- SSR/prerender for per-outcome OG tags (larger lift, tracked in .planning/phases/14-situational-outcome-imagery/)
- Full audit-page collapsible UI
- og-default.png asset creation (manual step, out of band)
- Per-archetype rich LinkedIn previews (requires dedicated share URLs)

</deferred>

---

*Phase: 24-consensus-copy-and-funnel-fixes*
*Context gathered: 2026-04-10 via PRD Express Path (verified plan session)*
