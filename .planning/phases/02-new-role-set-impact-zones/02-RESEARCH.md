# Phase 02: New Role Set (Impact Zones) - Research

**Researched:** 2026-03-06
**Domain:** React/TypeScript role model refactor, card deck routing, game stage UI
**Confidence:** HIGH

## Summary

Phase 02 replaces six legacy department roles (DEVELOPMENT, MARKETING, MANAGEMENT, HR, FINANCE, CLEANING) with ten satirical "impact zone" roles. The codebase currently uses `RoleType` enum everywhere: `ROLE_CARDS`, `ROLE_DESCRIPTIONS`, `RoleSelect` UI, `determineDeathType` in useGameState, and `formatLabel` in RoleSelect/InitializingScreen.

The core challenge: **10 new roles must map to 6 existing card decks** until Phase 05 adds role-specific cards. An alias layer (`ROLE_DECK_ALIASES`) maps each new role to the closest legacy deck. Death-type branching (PRISON for finance-like, CONGRESS for marketing-like, AUDIT_FAILURE for management-like) must derive from that alias, not from removed enum members.

**Primary recommendation:** Implement in two waves: (1) data/runtime foundation (RoleType, roles.ts metadata, ROLE_CARDS alias routing, useGameState death logic); (2) UI copy and test updates. Use `ROLE_LABELS` and `ROLE_ICONS` in data/roles.ts as single source of truth—eliminate duplicated formatLabel/icon ternaries.

## Standard Stack

The project stack is fixed; no new libraries required.

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^19.2.4 | UI | Project standard |
| TypeScript | ~5.8.2 | Types | Project standard |
| Vite | ^6.2.0 | Build | Project standard |
| Playwright | ^1.58.2 | Tests | Project standard |
| Font Awesome | 6.4.0 (CDN) | Icons | Already used for role icons |

### Icon Usage
RoleSelect uses `fa-solid` + icon class. Current mapping: fa-code, fa-bullhorn, fa-briefcase, fa-users, fa-vault, fa-broom. New roles need 10 distinct icons from Font Awesome 6. Use `ROLE_ICONS: Record<RoleType, string>` in data/roles.ts.

## Architecture Patterns

### Current Structure

```
types.ts           → RoleType enum (6 values)
data/roles.ts      → ROLE_DESCRIPTIONS only
data/cards/index.ts → ROLE_CARDS: Record<RoleType, Card[]>
hooks/useGameState.ts → determineDeathType(role) branches on RoleType.FINANCE, .MARKETING, .MANAGEMENT
components/game/RoleSelect.tsx → formatLabel + inline icon ternary
components/game/InitializingScreen.tsx → duplicated formatLabel
```

### Recommended Pattern: Alias-Driven Routing

**What:** Map new roles to legacy decks via `ROLE_DECK_ALIASES`, then build `ROLE_CARDS` from that.

**When:** Any phase that changes RoleType but must preserve existing deck content.

**Example:**

```typescript
// data/roles.ts - LegacyDeck is internal type for the 6 existing deck keys
type LegacyDeck = "DEVELOPMENT" | "MARKETING" | "MANAGEMENT" | "HR" | "FINANCE" | "CLEANING";

export const ROLE_DECK_ALIASES: Record<RoleType, LegacyDeck> = {
  [RoleType.CHIEF_SOMETHING_OFFICER]: "MANAGEMENT",
  [RoleType.SOFTWARE_ENGINEER]: "DEVELOPMENT",
  // ...
};

// data/cards/index.ts
const LEGACY_DECKS: Record<LegacyDeck, Card[]> = {
  DEVELOPMENT: DEVELOPMENT_CARDS,
  MARKETING: MARKETING_CARDS,
  // ...
};

export const ROLE_CARDS: Record<RoleType, Card[]> = Object.fromEntries(
  (Object.values(RoleType) as RoleType[]).map((r) => [r, LEGACY_DECKS[ROLE_DECK_ALIASES[r]]])
) as Record<RoleType, Card[]>;
```

### Death-Type Logic via Alias

`determineDeathType` must not branch on removed enum values. Use the alias:

```typescript
function getLegacyDeck(role: RoleType): LegacyDeck {
  return ROLE_DECK_ALIASES[role];
}

if (getLegacyDeck(role) === "FINANCE") return DeathType.PRISON;
if (getLegacyDeck(role) === "MARKETING") return DeathType.CONGRESS;
if (getLegacyDeck(role) === "MANAGEMENT") return DeathType.AUDIT_FAILURE;
```

### Anti-Patterns to Avoid

- **Inline formatLabel/icon logic:** RoleSelect and InitializingScreen both had `formatLabel`. Consolidate to `ROLE_LABELS[role]` from data/roles.ts.
- **Hard-coded role checks in useGameState:** `role === RoleType.FINANCE` breaks when that enum no longer exists. Use alias.
- **Button-text selectors in tests:** `button:has-text("Development")` will break. Update to `button:has-text("Software Engineer")` or use `data-testid="role-software_engineer"`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|--------------|-----|
| Role→deck mapping | Custom switch/if chain | `ROLE_DECK_ALIASES` Record | Single source, easy to audit |
| Role→label conversion | formatLabel(s) with special cases | `ROLE_LABELS[role]` | No duplication, no HR special-case |
| Role→icon | Inline ternaries | `ROLE_ICONS[role]` | Same pattern as personalities |
| Death-type by role | New branching per new role | Alias→legacy deck→death | Only 3 death branches (finance/marketing/management) |

**Key insight:** The 10 roles collapse onto 6 decks. Don't invent 10 death-type branches; preserve the 3 legacy ones via deck alias.

## Common Pitfalls

### Pitfall 1: Orphaned Role References
**What goes wrong:** TypeScript or runtime errors after removing legacy enum; `ROLE_CARDS[role]` undefined.
**Why it happens:** Files still reference RoleType.DEVELOPMENT etc. after commenting them out.
**How to avoid:** Grep for `RoleType\.(DEVELOPMENT|MARKETING|MANAGEMENT|HR|FINANCE|CLEANING)` before finalizing. Update all consumers to use new enum or alias.
**Warning signs:** Build fails with "Property 'DEVELOPMENT' does not exist on type 'typeof RoleType'".

### Pitfall 2: Test Snapshot Drift
**What goes wrong:** `stage-snapshots.spec.ts` fails on role-select.png; navigateToRoleSelect, navigateToPlaying, navigateToGameOver break.
**Why it happens:** Button text changes from "Development"/"Marketing" to "Software Engineer"/"Tech/AI Consultant".
**How to avoid:** Update navigation helpers in one pass with RoleSelect. Prefer `data-testid` for role buttons: `data-testid="role-${role.toLowerCase()}"`.
**Warning signs:** Tests fail with "Timeout waiting for button:has-text('Development')".

### Pitfall 3: navigateToPlayingFast localStorage
**What goes wrong:** Fast-path tests (e.g. snap-back.spec.ts) fail silently or fall back to full navigation.
**Why it happens:** `navigateToPlayingFast` injects `role: "development"`. When RoleType becomes SOFTWARE_ENGINEER, the app may not recognize "development" as valid.
**How to avoid:** If the app hydrates from localStorage, update injected role to new enum value (e.g. `role: "software_engineer"`). Verify fast path still reaches playing stage.

### Pitfall 4: Duplicated formatLabel
**What goes wrong:** RoleSelect and InitializingScreen each have formatLabel; HR special-case lives in two places.
**How to avoid:** Delete formatLabel from both. Add `ROLE_LABELS: Record<RoleType, string>` in data/roles.ts. Import and use.

## Code Examples

### Current RoleSelect icon pattern (replace with ROLE_ICONS)
```typescript
// components/game/RoleSelect.tsx (current - remove)
className={`fa-solid ${
  role === RoleType.DEVELOPMENT ? "fa-code"
  : role === RoleType.MARKETING ? "fa-bullhorn"
  : role === RoleType.MANAGEMENT ? "fa-briefcase"
  : role === RoleType.HR ? "fa-users"
  : role === RoleType.FINANCE ? "fa-vault"
  : "fa-broom"
}`}
```

### Target pattern
```typescript
// components/game/RoleSelect.tsx
import { ROLE_DESCRIPTIONS, ROLE_ICONS, ROLE_LABELS } from "../../data";
// ...
<i className={`fa-solid ${ROLE_ICONS[role]}`} aria-hidden />
<div>{ROLE_LABELS[role]}</div>
<p>{ROLE_DESCRIPTIONS[role]}</p>
```

### Role-to-deck mapping (from 02-01-PLAN)

| New Role | Alias → Legacy Deck |
|----------|---------------------|
| CHIEF_SOMETHING_OFFICER | MANAGEMENT |
| HEAD_OF_SOMETHING | MANAGEMENT |
| SOMETHING_MANAGER | FINANCE |
| TECH_AI_CONSULTANT | MARKETING |
| DATA_SCIENTIST | HR |
| SOFTWARE_ARCHITECT | DEVELOPMENT |
| SOFTWARE_ENGINEER | DEVELOPMENT |
| VIBE_CODER | DEVELOPMENT |
| VIBE_ENGINEER | DEVELOPMENT |
| AGENTIC_ENGINEER | DEVELOPMENT |

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| 6 roles, 6 decks, 1:1 | 10 roles, 6 decks, alias map | ROLE_CARDS built from alias |
| Death-type by role enum | Death-type by deck alias | useGameState imports ROLE_DECK_ALIASES |
| formatLabel + icon ternary in UI | ROLE_LABELS + ROLE_ICONS in data | Single source of truth |

**Deprecated:** Legacy RoleType.DEVELOPMENT, .MARKETING, etc. Comment out in enum, preserve for Phase 05.

## Open Questions

1. **Icon mapping for 10 roles**
   - What we know: Font Awesome 6.4.0 available; current 6 use fa-code, fa-bullhorn, fa-briefcase, fa-users, fa-vault, fa-broom.
   - What's unclear: Exact icons for Chief Something Officer, Head of Something, Something Manager, Tech/AI Consultant, Data Scientist, Software Architect, Vibe Coder, Vibe Engineer, Agentic Engineer.
   - Recommendation: Planner can propose a mapping (e.g. fa-user-tie, fa-shield-halved, fa-table-cells, fa-presentation-screen, fa-chart-line, fa-draw-polygon, fa-wand-magic-sparkles, fa-clock, fa-robot) or leave as implementation discretion.

2. **localStorage gameState hydration**
   - What we know: navigateToPlayingFast sets gameState in localStorage; CONCERNS.md says "No localStorage usage found" in app.
   - What's unclear: Whether the app actually reads gameState on load.
   - Recommendation: Verify during implementation. If app hydrates from localStorage, update injected role value in navigateToPlayingFast when roles change.

## Files Touched (Complete List)

| File | Change |
|------|--------|
| types.ts | Comment legacy enum, add 10 new RoleType values |
| data/roles.ts | Add ROLE_LABELS, ROLE_ICONS, ROLE_DECK_ALIASES; update ROLE_DESCRIPTIONS |
| data/cards/index.ts | Build ROLE_CARDS from ROLE_DECK_ALIASES |
| hooks/useGameState.ts | determineDeathType via alias |
| components/game/RoleSelect.tsx | New copy, ROLE_LABELS/ROLE_ICONS, remove formatLabel |
| components/game/InitializingScreen.tsx | Use ROLE_LABELS, remove formatLabel |
| tests/helpers/navigation.ts | Update button text: "Software Engineer", "Tech/AI Consultant" |
| tests/stage-snapshots.spec.ts | Refresh role-select snapshot |

## Sources

### Primary (HIGH confidence)
- Codebase: types.ts, data/roles.ts, data/cards/index.ts, RoleSelect.tsx, useGameState.ts, InitializingScreen.tsx
- .planning/phases/02-new-role-set-impact-zones/02-01-PLAN.md, 02-02-PLAN.md

### Secondary (MEDIUM confidence)
- .planning/ROADMAP.md — Phase 02 requirements

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Project uses React/TS/Vite/Playwright; no new deps needed
- Architecture: HIGH — Codebase inspected; alias pattern proven in 02-01 plan
- Pitfalls: HIGH — Grep and file read confirm all touch points

**Research date:** 2026-03-06
**Valid until:** 30 days (stable refactor)
