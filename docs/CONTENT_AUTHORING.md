# Content Authoring Guide

## 1. Overview

K-Maru: The Hyperscale Chronicles is an edutainment game about AI ethics, cybersecurity, and compliance. All game content lives in `data/` as immutable TypeScript modules.

### Content Types

| Type | File(s) | Purpose |
|------|---------|---------|
| **Cards** | `data/cards/[role].ts` | Scenario/dilemma cards per role (180+ total) |
| **No-Win Dilemmas** | `data/cards/nowin-dilemmas.ts` | Reusable governance scenarios adaptable across roles |
| **Personalities** | `data/personalities.ts` | AI companion voice configurations (3 personalities) |
| **Roles** | `data/roles.ts` | Playable role definitions, descriptions, icons |
| **Boss Questions** | `data/bossQuestions.ts` | End-game quiz questions (5 questions) |
| **Death Endings** | `data/deathEndings.ts` | Failure ending copy (7 death types) |
| **Archetypes** | `data/archetypes.ts` | Leadership personality types calculated from choices (7 archetypes) |
| **Incidents** | `data/incidents.ts` | Centralized real-world incident references |
| **Violations** | `data/violations.ts` | Repeated violation text constants |
| **Choice Labels** | `data/choiceLabels.ts` | Repeated choice button text constants |
| **Pressure Scenarios** | `data/pressureScenarios.ts` | Countdown timer and team-impact metadata per card |
| **Death Vectors** | `data/deathVectors.ts` | Accumulates death type frequency from player choices |
| **Failure Lessons** | `data/failureLessons.ts` | Educational content shown on death screens |
| **Image Map** | `data/imageMap.ts` | Centralized image path resolution |
| **Deck Death Types** | `data/deckDeathTypes.ts` | Legacy fallback death types per deck |
| **BGM Playlist** | `data/bgmPlaylist.ts` | Background music configuration |
| **Sources** | `data/sources.ts` | App source enum-to-label mappings |
| **Voice UI Copy** | `data/voiceUiCopy.ts` | Voice UI hint text |

### Card Deck Structure

```
data/cards/
├── index.ts                    # Barrel export + ROLE_CARDS mapping
├── chief-something-officer.ts  # C-suite governance cards
├── head-of-something.ts        # Middle management cards
├── something-manager.ts        # Budget/ROI cards
├── tech-ai-consultant.ts       # Client/vendor cards
├── data-scientist.ts           # Model quality/bias cards
├── software-architect.ts       # System design cards
├── software-engineer.ts        # Implementation/security cards
├── vibe-coder.ts               # AI-assisted coding cards
├── vibe-engineer.ts            # Performance/latency cards
├── agentic-engineer.ts         # Autonomous agent cards
├── nowin-dilemmas.ts           # Reusable no-win scenarios
├── branches.ts                 # Branch injection cards
└── _archive/                   # Legacy decks (preserved)
```

Each role has 8-10+ unique cards. Players see approximately 80% of their role's deck per playthrough.

---

## 2. Card Anatomy

### The Card Interface

```typescript
interface Card {
  id: string;                        // Unique: role_identifier
  source: AppSource;                 // SLACK, EMAIL, TERMINAL, IDE, JIRA, NOTION, MEETING
  sender: string;                    // Who sent this (role-appropriate)
  context: string;                   // Subject line / category
  storyContext?: string;             // Optional scene-setting narrative
  text: string;                      // The dilemma presented to the player
  realWorldReference?: RealWorldReference;  // Real-world incident inspiration
  onRight: ChoiceOutcome;            // Outcome for right swipe
  onLeft: ChoiceOutcome;             // Outcome for left swipe
  choiceSidesSwapped?: boolean;      // Set by shuffle at runtime (do not set manually)
}
```

### ChoiceOutcome

```typescript
interface ChoiceOutcome {
  label: string;                     // Button text shown to player
  hype: number;                      // -50 to +50 reputation change
  heat: number;                      // 0 to 50 legal risk change
  fine: number;                      // Budget penalty (0 to 500M+)
  violation: string;                 // What was violated (or "None - ...")
  lesson: string;                    // Educational takeaway
  feedback: PersonalityFeedback;     // 3 personality-specific responses
  deathVector?: DeathType;           // Hint toward a specific death ending
}
```

### RealWorldReference

```typescript
interface RealWorldReference {
  incident: string;     // Name of the real incident
  date: string;         // When it occurred (year or date range)
  outcome: string;      // What actually happened
  sourceUrl?: string;   // Optional URL to source documentation
}
```

### AppSource Enum

| Value | Visual Theme | Use For |
|-------|-------------|---------|
| `SLACK` | Chat message | Team communication, peer requests |
| `EMAIL` | Email client | Formal requests, external parties |
| `TERMINAL` | Terminal/CLI | System alerts, automated scans |
| `IDE` | Code editor | Code review, development tools |
| `JIRA` | Ticket system | Bug reports, task assignments |
| `NOTION` | Wiki/doc | Documentation, policy changes |
| `MEETING` | Calendar/meeting | In-person discussions, standups |

### Factory Function

Use `makeCard()` from `types.ts` to reduce boilerplate:

```typescript
import { AppSource, type Card, DeathType, makeCard } from "../../types";
import { ChoiceLabel } from "../choiceLabels";
import { RealWorld } from "../incidents";
import { Violation } from "../violations";

export const MY_ROLE_CARDS: Card[] = [
  makeCard(
    "myrole_unique_id",           // id
    AppSource.SLACK,              // source
    "SENIOR_ENGINEER",            // sender
    "CODE_REVIEW",                // context
    "The feature works but has security gaps...",  // storyContext
    "Ship now or fix first?",     // text (the dilemma)
    RealWorld.SomeIncident,       // realWorldReference
    {                             // onLeft outcome
      label: "Fix first",
      hype: -20,
      heat: 5,
      fine: 0,
      violation: "None - Quality gate",
      lesson: "Fixing before shipping prevents...",
      deathVector: DeathType.AUDIT_FAILURE,
      roaster: "Boring. Safe. Correct.",
      zenMaster: "The careful path avoids the cliff.",
      lovebomber: "Quality FIRST, bestie!!",
    },
    {                             // onRight outcome
      label: "Ship now",
      hype: 35,
      heat: 14,
      fine: 5000000,
      violation: Violation.shadowAiSecurityRisk,
      lesson: "Shipping with known gaps creates...",
      deathVector: DeathType.PRISON,
      roaster: "Fast. Reckless. Predictable.",
      zenMaster: "Haste builds the house that rain destroys.",
      lovebomber: "We're SHIPPING, bestie!!",
    },
  ),
];
```

### Required vs Optional Fields

| Field | Required | Notes |
|-------|----------|-------|
| `id` | Yes | Must be unique across ALL roles. Prefix with role abbreviation. |
| `source` | Yes | From `AppSource` enum. |
| `sender` | Yes | Role-appropriate sender name. |
| `context` | Yes | Short category/subject. |
| `text` | Yes | The dilemma. Keep under 200 characters. |
| `onLeft` | Yes | Full `ChoiceOutcome` object. |
| `onRight` | Yes | Full `ChoiceOutcome` object. |
| `storyContext` | No | Scene-setting narrative. Recommended for immersion. |
| `realWorldReference` | No | Use `RealWorld.*` from `incidents.ts` or inline object. |
| `deathVector` | No | Hint toward death type. Recommended for balance. |

### ID Naming Convention

Prefix card IDs with role abbreviations:

| Role | Prefix | Example |
|------|--------|---------|
| Chief Something Officer | `cso_` | `cso_prompt_injection_liability` |
| Head of Something | `hos_` | `hos_team_burnout_deadline` |
| Something Manager | `sm_` | `sm_compliance_checklist_deadline` |
| Tech AI Consultant | `tac_` | `tac_timeline_pressure_quality` |
| Data Scientist | `ds_` | `ds_bias_detection_deployment` |
| Software Architect | `sa_` | `sa_scalability_single_point_failure` |
| Software Engineer | `se_` | `se_security_patch_timeline` |
| Vibe Coder | `vc_` | `vc_hallucinated_library` |
| Vibe Engineer | `ve_` | `ve_autoscaling_cost_risk` |
| Agentic Engineer | `ae_` | `ae_emergent_behavior_optimization` |

---

## 3. Writing No-Win Scenarios

### What Makes a Good Dilemma

A no-win scenario presents two choices where **both have meaningful costs**. Neither option should feel obviously correct. The player should feel genuine tension.

### Design Principles

1. **Comparable penalties** -- Both outcomes should have significant stat impacts. Avoid "dominant strategies" where one choice is clearly better.
2. **Tradeoffs, not winners** -- Lessons should explain the tradeoff, not declare a winner.
3. **Real-world grounding** -- Base scenarios on actual incidents from `data/incidents.ts`.
4. **Role-specific framing** -- The same governance dilemma reads differently for a C-suite exec vs a junior engineer.

### No-Win Dilemma Examples

The file `data/cards/nowin-dilemmas.ts` contains reusable scenarios:

| Dilemma ID | Core Tension |
|------------|-------------|
| `nowin_speed_vs_quality` | Ship now with bugs vs delay and lose momentum |
| `nowin_cost_vs_compliance` | Quick workaround vs expensive proper fix |
| `nowin_innovation_vs_governance` | Move fast vs enforce gates |
| `nowin_transparency_vs_reputation` | Disclose publicly vs patch quietly |
| `nowin_automation_vs_control` | Full automation vs human-in-loop |
| `nowin_centralized_vs_distributed` | Centralized control vs distributed resilience |

### Stat Impact Design Guidelines

| Choice Archetype | Hype | Heat | Fine | When to Use |
|-----------------|------|------|------|-------------|
| **Safe/Responsible** | -15 to -35 | -30 to +9 | 0-1M | The "correct" but costly path |
| **Risky/Quick** | +15 to +45 | +11 to +22 | 2M-15M | Fast but dangerous |
| **Extreme Risk** | +40 to +60 | +16 to +28 | 10M-50M | Maximum short-term gain, maximum long-term danger |

**Balancing rule:** The risky option should always have higher hype but also higher heat and fines. The safe option should have lower/negative hype but lower heat and minimal fines.

### Tone Guidelines for Dilemma Text

- **Keep it concise** -- Main `text` under 200 characters.
- **Use active voice** -- "Ship now or fix first?" not "Should the team ship now?"
- **Present concrete stakes** -- Mention timelines, costs, or consequences.
- **Avoid moralizing** -- Let the stat outcomes teach, not the text.

### Writing Feedback Responses

Each personality has a distinct voice:

| Personality | Voice | Tone | Length Limit |
|-------------|-------|------|-------------|
| **V.E.R.A.** (ROASTER) | British, cynical, exhausted | Sarcastic, judgmental, dry | Under 150 chars |
| **Bamboo** (ZEN_MASTER) | Calm, metaphorical | Nature/water metaphors, passive-aggressive wisdom | Under 150 chars |
| **HYPE-BRO** (LOVEBOMBER) | Silicon Valley, oblivious | Enthusiastic, misses the point, "bestie" | Under 150 chars |

**Feedback writing rules:**

1. Every feedback must reference the specific violation or action taken.
2. V.E.R.A. sounds exhausted and judgmental.
3. Bamboo uses nature/water metaphors.
4. HYPE-BRO misses the point entirely and is overly enthusiastic.
5. Keep responses under 150 characters for TTS timing.

---

## 4. Stat Balancing Methodology

### How Stats Work

| Stat | Range | Starting | Death Condition |
|------|-------|----------|----------------|
| **Hype** (Reputation) | 0-100+ | 50 | Hype <= 10 AND Heat >= 100 -> "Replaced by Script" |
| **Heat** (Legal Risk) | 0-100 | 0 | Heat >= 100 -> Investigation/game over |
| **Budget** (Money) | 0-10M+ | 10,000,000 | Budget <= 0 -> Bankruptcy |

### Role-Based Fine Tiers

Different roles have different financial scales. Use `ROLE_FINE_TIERS` from `types.ts`:

| Role | Min Fine | Max Fine | Starting Budget |
|------|----------|----------|----------------|
| Chief Something Officer | 5M | 500M | 200M |
| Head of Something | 1M | 50M | 100M |
| Something Manager | 500K | 25M | 75M |
| Tech AI Consultant | 300K | 15M | 60M |
| Data Scientist | 300K | 15M | 60M |
| Software Architect | 500K | 20M | 75M |
| Software Engineer | 200K | 10M | 50M |
| Vibe Coder | 100K | 8M | 40M |
| Vibe Engineer | 200K | 12M | 50M |
| Agentic Engineer | 300K | 18M | 60M |

### Heat Scaling per Role

Each role has expected heat accumulation across a full deck (8-10 cards):

| Role | Min Heat | Max Heat |
|------|----------|----------|
| Chief Something Officer | 9 | 31 |
| Head of Something | 5 | 22 |
| Something Manager | 4 | 22 |
| Tech AI Consultant | 5 | 20 |
| Data Scientist | 4 | 19 |
| Software Architect | 5 | 22 |
| Software Engineer | 4 | 16 |
| Vibe Coder | 4 | 18 |
| Vibe Engineer | 4 | 19 |
| Agentic Engineer | 5 | 23 |

### Balancing Guidelines

1. **Per-card heat** should be 4-28 depending on risk level.
2. **Safe choices** should reduce heat slightly (-30 to -5) or add minimally (+4 to +9).
3. **Risky choices** should add +11 to +28 heat.
4. **Per-card hype** safe: -15 to -35, risky: +10 to +60.
5. **Per-card fines** should align with the role's fine tier.

### Testing Stat Changes

Run the heat correlation test to validate deck balance:

```bash
bun run test -- tests/data/heat-correlation.test.ts
```

Check that cumulative heat across a deck falls within the role's expected range.

---

## 5. Adding New Cards

### Step-by-Step Process

**Step 1: Choose or create the role file**

Cards live in `data/cards/[role].ts`. If the role file exists, add to it. If creating a new role, see Section 7.

**Step 2: Define the card using `makeCard()`**

```typescript
makeCard(
  "role_unique_id",
  AppSource.SLACK,
  "SENDER_NAME",
  "CONTEXT",
  "Optional scene-setting text",
  "The dilemma question?",
  RealWorld.SomeIncident,  // or inline { incident, date, outcome }
  { /* onLeft outcome */ },
  { /* onRight outcome */ },
)
```

**Step 3: Add to the role's card array**

Append the card to the exported array in the role file:

```typescript
export const MY_ROLE_CARDS: Card[] = [
  // ... existing cards
  makeCard(/* new card */),
];
```

**Step 4: Register the role in `data/cards/index.ts`**

If this is a new role file, add the import and ROLE_CARDS entry:

```typescript
import { MY_ROLE_CARDS } from "./my-role";

export const ROLE_CARDS: Record<RoleType, Card[]> = {
  // ... existing
  [RoleType.MY_ROLE]: MY_ROLE_CARDS,
};
```

**Step 5: Add pressure scenario (if urgent)**

If the card should have a countdown timer, add an entry to `data/pressureScenarios.ts`:

```typescript
my_role_urgent_card: {
  urgent: true,
  countdownSec: 45,
  timeoutResolvesTo: "LEFT",
  criticalForHaptics: true,
  outcomes: {
    LEFT: { teamImpact: "Team works through weekend." },
    RIGHT: { teamImpact: "Deadline missed. Executive pressure." },
  },
},
```

**Step 6: Typecheck**

```bash
bun run typecheck
```

**Step 7: Test**

```bash
bun run test
```

**Step 8: Verify visually**

```bash
bun run dev
```

Navigate to the role in the browser and play through the new card.

### Where Files Live

| Content | Location |
|---------|----------|
| Card data | `data/cards/[role].ts` |
| Role enum | `types.ts` (RoleType enum) |
| Role display data | `data/roles.ts` |
| Incident references | `data/incidents.ts` |
| Reusable violations | `data/violations.ts` |
| Reusable choice labels | `data/choiceLabels.ts` |
| Pressure scenarios | `data/pressureScenarios.ts` |
| Barrel export | `data/cards/index.ts` |

---

## 6. Personalities/AI Voices

### Configuration

Personalities are defined in `data/personalities.ts`:

```typescript
export const PERSONALITIES = {
  [PersonalityType.ZEN_MASTER]: {
    name: "BAMBOO",
    title: "The Zen Master",
    description: "Meditation app vibes, flowing water, passive-aggressive calmness.",
    voice: "Puck",                    // Gemini TTS voice name
    onboarding: "Namaste, corporate warrior...",
    victory: "Balance is achieved...",
    failure: "Breathe in... and breathe out the lawsuits...",
  },
  // ... ROASTER, LOVEBOMBER
};
```

### Adding a New Personality

1. Add enum entry in `types.ts`:
   ```typescript
   export enum PersonalityType {
     // ... existing
     NEW_PERSONALITY = "NEW_PERSONALITY",
   }
   ```

2. Add configuration in `data/personalities.ts`:
   ```typescript
   [PersonalityType.NEW_PERSONALITY]: {
     name: "DISPLAY_NAME",
     title: "The Title",
     description: "Description of voice/tone.",
     voice: "GeminiVoiceName",
     onboarding: "...",
     victory: "...",
     failure: "...",
   },
   ```

3. Add feedback for **every card choice** in all card files. Each `ChoiceOutcome.feedback` must include the new personality key.

4. Update `makeFeedback()` helper in `types.ts` if the signature changes.

5. Generate voice files using `bun run scripts/generate-all.ts` (requires `GEMINI_API_KEY`).

### Voice Generation

Voice files are generated via Gemini TTS API. The `generate-all.ts` script creates `.wav` files in `public/audio/voices/`:

```bash
GEMINI_API_KEY=your_key bun run scripts/generate-all.ts
```

Voice output structure:
```
public/audio/voices/
├── roaster/
│   ├── core/         # onboarding, victory, failure
│   └── feedback/     # per-card feedback
├── zenmaster/
│   ├── core/
│   └── feedback/
└── lovebomber/
    ├── core/
    └── feedback/
```

---

## 7. Roles

### Role Definition

Each role requires entries in three places:

**1. `types.ts` -- Enum entry:**
```typescript
export enum RoleType {
  // ... existing
  NEW_ROLE = "NEW_ROLE",
}
```

**2. `data/roles.ts` -- Display data:**
```typescript
export const ROLE_DESCRIPTIONS: Record<RoleType, string> = {
  // ... existing
  [RoleType.NEW_ROLE]: "The description text.",
};

export const ROLE_LABELS: Record<RoleType, string> = {
  // ... existing
  [RoleType.NEW_ROLE]: "Display Label",
};

export const ROLE_ICONS: Record<RoleType, string> = {
  // ... existing
  [RoleType.NEW_ROLE]: "fa-icon-name",  // Font Awesome class
};
```

**3. `data/cards/[new-role].ts` -- Card deck:**
```typescript
export const NEW_ROLE_CARDS: Card[] = [
  // 8-10+ cards
];
```

**4. `data/cards/index.ts` -- Registration:**
```typescript
import { NEW_ROLE_CARDS } from "./new-role";

export const ROLE_CARDS: Record<RoleType, Card[]> = {
  // ... existing
  [RoleType.NEW_ROLE]: NEW_ROLE_CARDS,
};
```

**5. `types.ts` -- Fine tiers and heat scales:**
```typescript
export const ROLE_FINE_TIERS = {
  // ... existing
  NEW_ROLE: { min: 200000, max: 10000000, budget: 50000000 },
} as const;

export const ROLE_HEAT_SCALES = {
  // ... existing
  NEW_ROLE: { min: 4, max: 18 },
} as const;
```

### Role UI

Add the role button to the role selection screen in `App.tsx` (or the relevant selection component).

---

## 8. Endings/Deaths

### Death Types

| DeathType | Trigger | Description |
|-----------|---------|-------------|
| `BANKRUPT` | Budget <= 0 | Financial collapse |
| `REPLACED_BY_SCRIPT` | Heat >= 100 AND Hype <= 10 | Automated replacement |
| `CONGRESS` | Heat >= 100, high visibility | Congressional testimony |
| `FLED_COUNTRY` | Heat >= 100, international | International legal action |
| `PRISON` | Heat >= 100, criminal | Federal prosecution |
| `AUDIT_FAILURE` | Heat >= 100, documentation | Audit catastrophe |
| `KIRK` | Easter egg (swipe up 2x) | Simulation breach |

### Adding a New Death Type

**1. `types.ts` -- Enum entry:**
```typescript
export enum DeathType {
  // ... existing
  NEW_DEATH = "NEW_DEATH",
}
```

**2. `data/deathEndings.ts` -- Ending copy:**
```typescript
export const DEATH_ENDINGS: Record<DeathType, DeathEnding> = {
  // ... existing
  [DeathType.NEW_DEATH]: {
    title: "Death Title",
    description: "Description text shown on game over screen.",
    icon: "fa-icon-name",
    color: "text-color-class",
  },
};
```

**3. `data/failureLessons.ts` -- Educational content:**
```typescript
export const FAILURE_LESSONS: Record<DeathType, FailureLesson[]> = {
  // ... existing
  [DeathType.NEW_DEATH]: [
    {
      title: "Lesson Title",
      explanation: "Detailed explanation.",
      realWorldExample: "Real-world example text.",
    },
  ],
};
```

Add retry prompts to `RETRY_PROMPTS` and death explanations to `DEATH_EXPLANATIONS`.

**4. `data/imageMap.ts` -- Image path:**
```typescript
export const DEATH_IMAGES: Record<DeathType, string> = {
  // ... existing
  [DeathType.NEW_DEATH]: "/images/deaths/new-death.webp",
};
```

**5. `data/deckDeathTypes.ts` -- Fallback mapping (if applicable):**
```typescript
export const DECK_DEATH_TYPES: Record<string, DeathType> = {
  // ... existing
  SOME_DECK: DeathType.NEW_DEATH,
};
```

**6. `data/archetypes.ts` -- Archetype affinity (optional):**
```typescript
export const ARCHETYPE_DEATH_AFFINITY: Partial<Record<ArchetypeId, DeathType>> = {
  // ... existing
  SOME_ARCHETYPE: DeathType.NEW_DEATH,
};
```

### Death Vector Assignment

When writing cards, assign `deathVector` to outcomes to guide which death type the player trends toward:

```typescript
{
  label: "Risky choice",
  hype: 40,
  heat: 18,
  fine: 10000000,
  deathVector: DeathType.PRISON,  // This choice trends toward prison
  // ...
}
```

The death vector system accumulates frequencies from player choices. The highest-frequency death type (with count >= 2) is selected, with archetype affinity as a tiebreaker.

---

## 9. Content Generation Scripts

### Image Generation

`scripts/generate-images.ts` generates game images using Gemini's image model.

```bash
# Generate all images
GEMINI_API_KEY=your_key bun run scripts/generate-images.ts

# Dry run (preview what would be generated)
bun run scripts/generate-images.ts --dry-run

# Generate only incident images
bun run scripts/generate-images.ts --incidents

# Generate only outcome images
bun run scripts/generate-images.ts --outcomes

# Regenerate a specific image
bun run scripts/generate-images.ts --replace some-incident-slug

# Export prompts for review
bun run scripts/generate-images.ts --export-prompts
```

Generated images go to `public/images/`:
```
public/images/
├── incidents/     # Card scenario images (role-scoped)
├── outcomes/      # Outcome/consequence images
├── archetypes/    # Archetype badge images (7 total)
└── deaths/        # Death ending screen images (7 total)
```

### Prompt Files

Image generation prompts are exported to `scripts/prompts/`:

| File | Content |
|------|---------|
| `archetypes.md` | Prompts for 7 archetype portraits |
| `deaths.md` | Prompts for 7 death ending images |
| `incidents.md` | Prompts for card incident images |
| `outcomes.md` | Prompts for outcome images |
| `INDEX.md` | Summary table of all prompts |

Regenerate prompts:
```bash
bun run scripts/generate-images.ts --export-prompts
```

### Voice Generation

```bash
# Generate all voice files
GEMINI_API_KEY=your_key bun run scripts/generate-all.ts
```

Scripts for individual voice generation:
- `scripts/generate-feedback.ts` -- Feedback voice lines
- `scripts/generate-voice.ts` -- Single voice line
- `scripts/generate-archetype-voices.ts` -- Archetype voice lines
- `scripts/generate-death-roaster.ts` -- Death screen V.E.R.A. lines
- `scripts/generate-death-zenmaster.ts` -- Death screen Bamboo lines
- `scripts/generate-death-lovebomber.ts` -- Death screen HYPE-BRO lines

### Content Audit

Export a content audit of all cards:
```bash
bun run scripts/export-card-content-audit.ts
```

### Audio Compression

```bash
# Compress audio files
bun run scripts/compress-audio.ts

# Verify compressed audio
bun run scripts/verify-compressed-audio.ts
```

---

## 10. Content Checklist

### Pre-Merge Checklist for New Cards

- [ ] Card ID is unique across all roles (use `role_` prefix)
- [ ] `source` uses valid `AppSource` enum value
- [ ] `sender` is role-appropriate
- [ ] `text` is under 200 characters
- [ ] Both `onLeft` and `onRight` outcomes are defined
- [ ] Each outcome has `label`, `hype`, `heat`, `fine`, `violation`, `lesson`
- [ ] Each outcome has feedback for all 3 personalities
- [ ] Feedback responses are under 150 characters each
- [ ] `deathVector` is assigned to outcomes
- [ ] `realWorldReference` points to a known incident (use `RealWorld.*` from `incidents.ts`)
- [ ] Stat values align with role's fine tier and heat scale
- [ ] Safe choice has lower hype, lower heat, lower fine
- [ ] Risky choice has higher hype, higher heat, higher fine
- [ ] Card is added to the role's card array export
- [ ] Card is registered in `data/cards/index.ts` ROLE_CARDS
- [ ] `bun run typecheck` passes
- [ ] `bun run test` passes
- [ ] Card renders correctly in dev server
- [ ] If urgent: pressure scenario added to `data/pressureScenarios.ts`
- [ ] If using repeated text: use `ChoiceLabel.*` or `Violation.*` constants

### Pre-Merge Checklist for New Roles

- [ ] `RoleType` enum entry added to `types.ts`
- [ ] `ROLE_DESCRIPTIONS`, `ROLE_LABELS`, `ROLE_ICONS` added to `data/roles.ts`
- [ ] `ROLE_FINE_TIERS` and `ROLE_HEAT_SCALES` added to `types.ts`
- [ ] Card deck file created with 8-10+ cards
- [ ] Deck registered in `data/cards/index.ts`
- [ ] Role button added to selection UI
- [ ] All typecheck and test commands pass

### Pre-Merge Checklist for New Death Types

- [ ] `DeathType` enum entry added to `types.ts`
- [ ] Entry in `DEATH_ENDINGS` (`data/deathEndings.ts`)
- [ ] Entry in `FAILURE_LESSONS` (`data/failureLessons.ts`)
- [ ] Entry in `RETRY_PROMPTS` and `DEATH_EXPLANATIONS` (`data/failureLessons.ts`)
- [ ] Entry in `DEATH_IMAGES` (`data/imageMap.ts`)
- [ ] Image asset placed at `/images/deaths/[slug].webp`
- [ ] Archetype affinity updated if applicable (`data/deathVectors.ts`)
- [ ] Cards reference the new death type via `deathVector`

---

## 11. Image Assets

### Image Categories

| Category | Path Convention | Resolution | Format |
|----------|----------------|------------|--------|
| Incidents | `/images/incidents/{slug}.webp` | Auto-generated | WebP |
| Outcomes | `/images/outcomes/{incidentSlug}-{labelSlug}.webp` | Auto-generated | WebP |
| Archetypes | `/images/archetypes/{archetypeId}.webp` | Auto-generated | WebP |
| Deaths | `/images/deaths/{deathType}.webp` | Auto-generated | WebP |

### Image Map Resolution

The `imageMap.ts` module auto-generates incident and outcome image mappings from card data:

```typescript
// Auto-generated from all ROLE_CARDS
export const INCIDENT_IMAGES: Record<IncidentSlug, string> = buildIncidentImages();

// Auto-generated from HOS cards (incident + label combinations)
export const OUTCOME_IMAGES: Record<OutcomeImageKey, string> = buildOutcomeImages();

// Static mappings
export const ARCHETYPE_IMAGES: Record<ArchetypeId, string> = { ... };
export const DEATH_IMAGES: Record<DeathType, string> = { ... };
```

### Slug Convention

Incident names are slugified to kebab-case:

| Incident Name | Slug | Image Path |
|--------------|------|------------|
| "Samsung ChatGPT Code Leak" | `samsung-chatgpt-code-leak` | `/images/incidents/samsung-chatgpt-code-leak.webp` |
| "XZ Utils Backdoor (CVE-2024-3094)" | `xz-utils-backdoor-cve-2024-3094` | `/images/incidents/xz-utils-backdoor-cve-2024-3094.webp` |

Outcome image keys combine incident slug + label slug:
```
{incidentSlug}-{labelSlug}.webp
```

### Fallback Behavior

Missing incident images fall back to `/images/incidents/fallback.webp`. Missing outcome images return `undefined` (no image shown).

### Generating Missing Images

```bash
# Check what images are needed
bun run scripts/generate-images.ts --dry-run

# Generate all missing images
GEMINI_API_KEY=your_key bun run scripts/generate-images.ts

# Replace a specific image
bun run scripts/generate-images.ts --replace incident-slug
```

### Image Style Guide

All game images follow a consistent visual style:
- **Incidents**: Satirical corporate/tech imagery with meme-world aesthetic
- **Outcomes**: Consequence-focused imagery matching the choice made
- **Archetypes**: Character portrait style, meme format meets corporate headshot
- **Deaths**: Thematic imagery matching the death type (prison bars, capitol building, etc.)

---

## Appendix A: Real-World Incident Reference

Use incidents from `data/incidents.ts` via the `RealWorld` namespace:

```typescript
import { RealWorld } from "../incidents";

// Usage in makeCard:
RealWorld.SamsungCodeLeak
RealWorld.GithubCopilotRce
RealWorld.XzUtilsBackdoor
RealWorld.ZillowModelDrift
RealWorld.AmazonRecruitingBias
// ... 50+ incidents available
```

If an incident doesn't exist, add it to `data/incidents.ts`:

```typescript
export const RealWorld = {
  // ... existing
  NewIncidentKey: {
    incident: "Descriptive Name of Incident",
    date: "2024" or "2023-2024",
    outcome: "Brief description of what happened and consequences.",
    sourceUrl: "https://example.com/source",  // optional
  },
};
```

## Appendix B: Reusable Constants

### Violation Constants (`data/violations.ts`)

Use for violations that appear 2+ times across cards:

```typescript
import { Violation } from "../violations";

violation: Violation.shadowAiSecurityRisk    // "Shadow AI + Security Risk"
violation: Violation.auditNonCompliance      // "Audit Non-Compliance + Regulatory Risk"
violation: Violation.observabilityGap        // "Observability Gap + Debug Risk"
```

### Choice Label Constants (`data/choiceLabels.ts`)

Use for choice button text that appears 2+ times:

```typescript
import { ChoiceLabel } from "../choiceLabels";

label: ChoiceLabel.useUnauthorizedTool     // "Use unauthorized tool"
label: ChoiceLabel.stickToApproved         // "Stick to approved"
label: ChoiceLabel.discloseImmediately     // "Disclose immediately"
```

## Appendix C: Branch Injections

Branch cards are conditionally injected after specific choices. Define in `data/cards/branches.ts`:

```typescript
export const BRANCH_CARDS: Card[] = [
  makeCard("dev_branch_aftermath", /* ... */),
];
```

Register the injection in `data/cards/index.ts`:

```typescript
export const BRANCH_INJECTIONS: Record<string, Card[]> = {
  "dev_1:RIGHT": [/* cards to inject after dev_1 RIGHT choice */],
};
```

Key format: `{cardId}:{choice}` where choice is `LEFT` or `RIGHT`.
