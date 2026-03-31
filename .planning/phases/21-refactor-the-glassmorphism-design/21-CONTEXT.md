# Phase 21: refactor-the-glassmorphism-design - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning
**Source:** PRD-style plan from `.cursor/plans/real_glassmorphism_upgrade_0bc142bf.plan.md`

<domain>
## Phase Boundary

Replace all fake glass (heavy `bg-black/65` + weak `backdrop-blur-sm`) with real glassmorphism (low-opacity tint + strong blur + saturation boost) across all game components.

</domain>

<decisions>
## Implementation Decisions

### CSS Architecture
- Add global glass CSS classes to `index.html` (like sololevel-marketing-site)
- Classes: `.glass-card`, `.glass-strong`, `.glass-header`

### Glass Recipe
- `.glass-card`: background rgba(71,71,71,0.22), border rgba(255,255,255,0.08), blur(8px) saturate(150%)
- `.glass-strong`: background rgba(20,20,20,0.45), blur(12px) saturate(160%)  
- `.glass-header`: background rgba(14,14,14,0.25), blur(20px) saturate(180%)

### Shared Constants Update
- `GLASS_FILL_STRONG` → `"glass-strong shadow-lg"`
- `GLASS_PANEL_DEFAULT` → `"glass-card"`
- Remove `GLASS_BACKDROP` (no longer needed)

### Components to Update
1. `CardStack.tsx` - incidentCardGlass, incidentCardHeaderBar
2. `FeedbackOverlay.tsx` - modal panel, learning moment box
3. `RoastTerminal.tsx` - wrapper, title bar
4. `InitializingScreen.tsx` - card, title bar
5. `Taskbar.tsx` - main bar
6. `BossFight.tsx` - quiz panel
7. `StarfieldBackground.tsx` - speed panel

### Components Using Shared Constants (Automatic)
- PersonalitySelect, RoleSelect
- DebriefPage1Collapse, DebriefPage2AuditTrail, DebriefPage3Verdict

### Claude's Discretion
- Exact line numbers for replacements may vary slightly from spec
- Keep custom shadows where they exist (e.g., Taskbar)
- WebKit prefix `-webkit-backdrop-filter` is required for Safari

</decisions>

<specifics>
## Specific Ideas

**Reference:** sololevel-marketing-site `.glass-card` recipe

**Verification:**
- `bun run typecheck`
- `bun run test:smoke`
- Manual visual spot-check: confirm starfield visible through glass on desktop and mobile Safari

</specifics>

<deferred>
## Deferred Ideas

None — PRD covers phase scope fully.

</deferred>

---

*Phase: 21-refactor-the-glassmorphism-design*
*Context gathered: 2026-03-31 via PRD-style plan*
