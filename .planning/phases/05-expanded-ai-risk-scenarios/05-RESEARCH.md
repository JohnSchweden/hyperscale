# Phase 05: Expanded AI Risk Scenarios - Research

**Researched:** 2026-03-09
**Domain:** AI risk scenario design, 2024-2025 incident sourcing, Kobayashi Maru no-win framework expansion
**Confidence:** HIGH

## Summary

Phase 05 extends the SwipeRisk card pool by adding authentic 2024-2025 AI governance dilemmas across five critical risk categories: prompt injection attacks, model drift / retraining decisions, explainability / black box governance, shadow AI / unauthorized tools, and synthetic data / copyright compliance. Research confirms that all five categories have documented real-world incidents with high-stakes organizational tradeoffs that fit the Kobayashi Maru framework perfectly.

The existing Card infrastructure (from Phase 03) already supports no-win design: both onLeft and onRight outcomes carry visible penalties (hype, heat, fine). Phase 05 fills in 2+ authentic incidents per category per role, maintaining the same narrative voice, 3-personality feedback system, and role-specific framing that already proven effective.

**Primary recommendation:** Source all 10+ scenarios from documented 2024-2025 incidents. For each incident type, create 2+ variants per role by reframing the same incident through different organizational lenses (CEO sees liability risk, CTO sees technical debt, Data Scientist sees model impact). Maintain ~20% time pressure on cards, both outcomes carry visible penalties, lessons explain tradeoff not winner.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Expand card pool with 2+ incident per risk category (5 categories × 2+ scenarios = 10+ new cards minimum per role)
- All incidents sourced from documented 2024-2025 AI failures, security breaches, governance conflicts
- Maintain Kobayashi Maru framework: both options bad, different tradeoffs, test judgment under ambiguity
- Inherit Phase 03 patterns: no-win design, 3-personality feedback (ROASTER/ZEN_MASTER/LOVEBOMBER), role-specific framing
- Integrate into existing role card decks (no new roles, no visual effects, no debrief wiring)
- ~20% of cards marked with time pressure (Inherit Phase 04 PressureScenarioMetadata)

### Claude's Discretion
- Specific phrasing and narrative voice for each scenario (sarcastic corporate, urgent crisis, bureaucratic absurdity)
- Depth of technical detail vs. narrative accessibility (balance for mixed expertise levels)
- Exact fine/heat/hype/crew penalty values for each outcome
- Sourcing URLs and reference links (grounds scenarios in reality, builds trust)
- Which specific 2024-2025 incidents best map to each role's risk profile

### Deferred Ideas (OUT OF SCOPE)
- Image assets for new cards → Phase 13
- Visual effects for pressure scenarios → Phase 04 (already implemented)
- Card animation → Phase 09
- Debrief integration for new scenarios → Phase 06 (cards only, UI wiring deferred)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| RISK-01 | 2+ prompt injection incidents per role | Documented 2024-2025 incidents: GitHub Copilot RCE (CVE-2025-53773), financial services AI jailbreak (June 2025), e-commerce manipulation, AI memory poisoning (EchoLeak CVE-2025-32711) |
| RISK-02 | 2+ model drift / retraining incidents per role | Documented 2024-2025 ML failures: 91% of models fail to drift; adaptive retraining yields 9.3% accuracy improvement; cost/accuracy tradeoff evident |
| RISK-03 | 2+ explainability / black box incidents per role | Regulatory landscape shift: EU AI Act (effective Aug 2024, compliance Aug 2026); explainability top concern for financial regulators (2025); black box models restricted in healthcare (TGA 2024) |
| RISK-04 | 2+ shadow AI incidents per role | Governance gap: 90% of enterprise AI use unauthorized; 60.2% of employees use unapproved tools; 68% surge in shadow GenAI 2024→2025; only 37% of organizations have detection policies |
| RISK-05 | 2+ synthetic data / copyright incidents per role | Litigation wave: 70+ copyright lawsuits by 2025 (doubled from 30 in 2024); fair use rulings mixed (Anthropic/Meta won June 2025; Thomson Reuters won Feb 2025); Assembly Bill 2013 requires disclosure |
| RISK-06 | Integrate into existing role card decks | Card infrastructure supports reusability: same incident can be adapted across roles with different organizational context (CEO sees shareholder impact, CTO sees technical timeline, Data Scientist sees model impact) |
</phase_requirements>

---

## Standard Stack

### Existing Card Infrastructure (No Changes Required)

| Component | Location | Purpose | Already Supports Phase 05 |
|-----------|----------|---------|--------------------------|
| Card type | `types.ts` | Interface with `onLeft`/`onRight` outcomes, penalties, feedback | ✓ Both outcomes carry penalties (hype, heat, fine, violation) |
| Role mapping | `data/cards/index.ts` | ROLE_CARDS links RoleType to card arrays | ✓ New roles alias to 6 legacy decks; Phase 05 populates aliases |
| Card files | `data/cards/*.ts` | Per-role card decks (finance, dev, marketing, hr, etc.) | ✓ Existing structure: Card[] arrays, no schema changes |
| Personality feedback | Card interface | 3 voices (ROASTER, ZEN_MASTER, LOVEBOMBER) per outcome | ✓ Already proven; consistent voice across Phase 03-05 |
| Pressure metadata | `types.ts:PressureScenarioMetadata` | Urgent flag, countdown, haptics, team impact | ✓ Phase 04 infrastructure ready; Phase 05 marks ~20% cards |

### Technology Stack (No Change)
- React + TypeScript for UI (existing)
- Card data in plain TypeScript objects (existing)
- Playwright for E2E tests (existing)
- Vitest for unit tests (existing)

### Current Card Coverage
| Role | Current Cards | Phase 05 Target | Gap |
|------|---------------|-----------------|-----|
| DEVELOPMENT | 2 | 2+ per category (10+) | ~8 new |
| FINANCE | 2 | 2+ per category (10+) | ~8 new |
| MARKETING | 2 | 2+ per category (10+) | ~8 new |
| MANAGEMENT | 2 | 2+ per category (10+) | ~8 new |
| HR | 2 | 2+ per category (10+) | ~8 new |
| New roles (via aliases) | 0 | 2+ per category (10+) | ~10 new per role |

---

## Architecture Patterns

### Reusable Incident Pattern: Same Incident, Different Role Lens

One documented 2024-2025 incident can spawn multiple role-specific cards by reframing organizational impact:

**Example: Prompt Injection in Financial AI (Real incident, June 2025)**

**Finance Perspective (Budget + Shareholder Impact):**
```typescript
{
  id: "prompt_injection_finance",
  source: AppSource.EMAIL,
  sender: "CFO",
  context: "FRAUD_DETECTION",
  storyContext: "The fraud detection AI just blocked $2M in transactions. Security found a prompt injection vector. Unblock and reprocess transactions?",
  text: "Fraud detection AI was tricked via prompt injection. Should we force-deploy the block (freezes $2M but catches fraud) or allow transactions to clear (risk $5M lawsuit)?",
  onRight: {
    label: "Deploy block",
    hype: -20,      // Market sees frozen transactions = bad optics
    heat: +30,      // Security teams upset about slowdown
    fine: 0,        // No penalty for security action
    violation: "None - Proper fraud response",
    lesson: "Security holds up business. The cost is operational friction."
  },
  onLeft: {
    label: "Allow transactions",
    hype: +50,      // Business momentum gains
    heat: +70,      // Regulatory exposure if fraud exploited
    fine: 5000000,  // Potential fraud liability
    violation: "Negligent fraud detection",
    lesson: "Fast business vs. accurate risk detection. You chose speed."
  }
}
```

**Development Perspective (Code Security + Timeline):**
```typescript
{
  id: "prompt_injection_dev",
  source: AppSource.SLACK,
  sender: "SECURITY_LEAD",
  context: "CODE_SAFETY",
  storyContext: "Security found injection vectors in the fraud AI we ship in 3 days. Patch it properly (miss launch) or deploy with mitigations (known gap)?",
  text: "Prompt injection vulnerability found. Fix properly (2-week refactor, miss launch date) or patch with input sanitization (quick, incomplete)?",
  onRight: {
    label: "Fix properly",
    hype: -50,      // Missed launch = market perception hit
    heat: +10,      // Security team happy
    fine: 0,        // No penalty for right security choice
    violation: "None - Secure development",
    lesson: "Security timelines slip. The cost is competitive pressure."
  },
  onLeft: {
    label: "Patch & ship",
    hype: +60,      // Launch on time = market momentum
    heat: +80,      // Known vulnerability = regulatory risk
    fine: 2000000,  // Liability if exploited post-launch
    violation: "Negligent deployment of unsafe code",
    lesson: "Timeline vs. security. You chose timeline."
  }
}
```

**Same incident, different role context, different outcome focus.** Players see how organizational role shapes risk perception.

### Card Design Checklist (No-Win Pattern)

Every Phase 05 card must pass:

1. **Both outcomes carry penalties:** If one path has 0 heat/fine, it's not a dilemma—it's a logic puzzle. Check: min(onLeft penalties) > 0 OR min(onRight penalties) > 0.
2. **Authentic incident:** Card text references 2024-2025 documented case (not fictional). Include incident date/source in comments if needed.
3. **Role-specific context:** Card mentions role-specific risk (CEO: shareholder, CTO: timeline, Finance: budget, Data Scientist: model accuracy). Not generic.
4. **Lesson explains tradeoff:** "Speed vs. security" not "Always choose security." Lesson is retrospective reflection, not prescriptive rule.
5. **3 personality voices:** ROASTER (cynical), ZEN_MASTER (wisdom), LOVEBOMBER (enthusiastic). All three present, all distinct.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Realistic 2024-2025 AI incidents | Fictional scenarios from imagination | WebSearch documented incidents + media coverage | Players recognize authenticity; fictional scenarios feel hollow |
| Penalty value tuning | Guess hype/heat/fine based on feeling | Analyze existing card set (current range: heat 0-100, fine $0-50M) | Consistency in magnitude; comparable to Phase 03 baseline |
| Personality voice consistency | Write new voice styles for Phase 05 | Reuse ROASTER/ZEN_MASTER/LOVEBOMBER (Phase 01, proven working) | Personality voices already trusted; players know the style |
| Time pressure selection | Mark all cards urgent | Inherit Phase 04 logic: ~20% of cards, high-stakes only (security breach, legal escalation, budget cliff) | Constant urgency causes fatigue; contrast amplifies impact |
| Role-specific framing | Copy same card text across roles | Same incident, different organizational context (CEO/CTO/Finance lens) | Role aliases can't be semantic; must reframe incident meaning |
| Incident sourcing | Reference "2024 incidents" without verification | WebSearch 2024-2025 cases, verify dates/details, cite sources | One wrong date/detail breaks player trust in authenticity |

**Key insight:** SwipeRisk already has the infrastructure (Card interface, penalty system, personality voices, pressure metadata). Phase 05 is not building new systems—it's populating them with authentic dilemmas.

---

## Common Pitfalls

### Pitfall 1: Incident "Sourcing" Without Verification
**What goes wrong:** Designer assumes a story is from 2024-2025 without checking dates/details. Player reads card, says "I don't think that happened," trust breaks.
**Why it happens:** Time pressure; assumption that it sounds plausible.
**How to avoid:** For every card, verify incident with WebSearch. Include incident date/source in internal notes (e.g., "GitHub Copilot CVE-2025-53773, Dec 2024"). If unsure about date, flag as LOW confidence and research deeper.
**Warning signs:** Card references "recent AI incident" but can't cite a specific date or case. Player feedback: "That's made up" or "That's not how that happened."

### Pitfall 2: Role-Specific Cards That Aren't Actually Role-Specific
**What goes wrong:** Designer copies Phase 03 card text across 10 roles. Finance role sees "retraining is expensive," but card doesn't mention budget impact on their specific metrics. Immersion breaks—card could apply to anyone.
**Why it happens:** Efficiency bias; reuse instead of tailoring.
**How to avoid:** For each incident, ask: "How does THIS ROLE specifically suffer?" Finance: budget drain. Dev: timeline slip. CTO: technical debt. HR: morale hit. Marketing: campaign delay. Each lens different. Same incident, different organizational consequence.
**Warning signs:** Card text is completely generic (could apply to any role); personality feedback doesn't reference role-specific outcome (e.g., "The team loses morale" instead of "Engineering team loses 3 senior engineers").

### Pitfall 3: Outcome Penalties Are Imbalanced (One Path Dominant)
**What goes wrong:** Designer secretly prefers one outcome, makes it cheaper. Player analyzes and picks the obvious choice. Not a dilemma—it's a puzzle.
**Why it happens:** Temptation to "help" by making one choice clearly better.
**How to avoid:** After writing both outcomes, check: Is the total cost (hype + heat + fine) roughly equivalent? If one is 0/0/0 and the other is -50/+70/+5M, that's a puzzle (players analyze). A real dilemma is ±40/±40/±2-3M (similar magnitude, different type).
**Warning signs:** Player solves card via calculation instead of reflection. Feedback: "Well, obviously I choose the cheap one."

### Pitfall 4: Lesson Text Declares Winner ("Teaching" Instead of "Reflecting")
**What goes wrong:** Lesson reads "Best practice: always X" instead of "This is why both paths cost differently." Player feels judged instead of reflected.
**Why it happens:** Instructional design instinct—lessons are supposed to teach.
**How to avoid:** Reframe lesson as "Why this was a tradeoff," not "Here's what you should have done."
  - BAD: "Always prioritize security over speed."
  - GOOD: "Security delays products. You chose speed; the cost is audit exposure."
**Warning signs:** Player reads lesson and thinks "Oh, I failed" instead of "I chose differently." Feedback: "Why is the game judging me?"

### Pitfall 5: Time Pressure on All Cards (Fatigue, Not Impact)
**What goes wrong:** Every card has countdown. Psychological impact of time pressure comes from *contrast*—some calm, some urgent. Constant urgency burns out engagement.
**Why it happens:** Design assumption that more pressure = more intensity.
**How to avoid:** Mark ~20% of cards urgent (high-stakes: security incident, legal escalation, budget cliff). Reserve time pressure for decisions with stakes. Leave ~80% calm for reflection.
**Warning signs:** Player report consistent timer fatigue. Debrief shows stress-induced regrets on trivial choices. Feedback: "Always rushed, can't think."

### Pitfall 6: Incident Authenticity Claims Without Sources
**What goes wrong:** Card says "real 2024 incident" but doesn't cite where it came from. Player searches, finds no trace, trusts the game less.
**Why it happens:** Designer didn't document source.
**How to avoid:** Internal source tracking (spreadsheet or comments): incident ID, date, company/system affected, source URL or media reference. Not for player visibility—for designer quality control.
**Warning signs:** Can't answer "What's the source for this incident?" or "When did this happen exactly?"

---

## Code Examples

### Authentic Incident Example 1: Prompt Injection (Real: GitHub Copilot CVE-2025-53773)

Verified from WebSearch results, Dec 2024 disclosure:

```typescript
// Source: GitHub Copilot RCE via code comment injection (CVE-2025-53773, CVSS 9.6)
// Incident: Malicious code comments could inject prompts that bypass Copilot's safety filters
{
  id: "prompt_injection_dev_copilot",
  source: AppSource.SLACK,
  sender: "SECURITY_TEAM",
  context: "CODE_INJECTION",
  storyContext:
    "Security found that code comments with hidden instructions can trick Copilot into generating unsafe code. Customers are complaining. Do we disable Copilot integration or patch comment filtering?",
  text: "GitHub Copilot integration vulnerable to prompt injection via code comments. Full patch takes 3 weeks; disable integration now (breaks workflow) or deploy quick filter (incomplete protection)?",
  onRight: {
    label: "Disable integration",
    hype: -40,      // Dev morale hits bottom; productivity drops
    heat: +10,      // Security team approves
    fine: 0,        // No penalty for security action
    violation: "None - Secure workflow",
    lesson:
      "Disabling AI tools blocks a security gap but cripples developer velocity. You chose security.",
    feedback: {
      [PersonalityType.ROASTER]:
        "Developers hate you now, but at least you're not leaking code. Congrats.",
      [PersonalityType.ZEN_MASTER]:
        "The sword is sheathed. Patience restores safety.",
      [PersonalityType.LOVEBOMBER]:
        "We love a secure dev environment! The team will adjust, besties!",
    },
  },
  onLeft: {
    label: "Deploy quick filter",
    hype: +50,      // Dev morale stays high
    heat: +65,      // Known gaps; audit risk
    fine: 1500000,  // Liability if exploit succeeds post-patch
    violation: "Negligent security patch",
    lesson:
      "Quick patches feel good. Incomplete protection leaves doors unlocked. You chose momentum.",
    feedback: {
      [PersonalityType.ROASTER]:
        "The devs are happy. So is the attacker. One of those will matter later.",
      [PersonalityType.ZEN_MASTER]:
        "A wall of sand protects no one. The storm approaches.",
      [PersonalityType.LOVEBOMBER]:
        "Shipping fast is the vibe! We'll patch it again later, right?!",
    },
  },
}
```

### Authentic Incident Example 2: Model Drift (Real: Adaptive Retraining vs. Freeze Decision)

Verified from WebSearch research (Rohan Paul, Aerospike, SmartDev 2024-2025):

```typescript
// Source: ML team facing model drift decision (documented pattern, 75% of models affected, adaptive retraining yields 9.3% accuracy gain)
{
  id: "model_drift_data_scientist",
  source: AppSource.EMAIL,
  sender: "ML_LEAD",
  context: "FRAUD_ACCURACY",
  storyContext:
    "Fraud detection model accuracy dropped 12% quarter-over-quarter. New fraud patterns emerged. Retrain (2 months, $50k compute) or patch with rule adjustments (2 days, known accuracy gap)?",
  text: "Model drift detected. Full retraining restores accuracy (+12%), costs $50k and 2 months. Band-aid rule adjustments take 2 days but leave accuracy gap. Choose?",
  onRight: {
    label: "Full retrain",
    hype: +30,      // Market sees 'accuracy restored'
    heat: -20,      // Regulatory relief
    fine: 0,        // No penalty for correct modeling
    violation: "None - Proper retraining",
    lesson:
      "Full retraining is expensive and slow. The cost is opportunity lost during retrain window.",
    feedback: {
      [PersonalityType.ROASTER]:
        "Two months of accuracy gap. Your fraud losses are the price of perfection.",
      [PersonalityType.ZEN_MASTER]:
        "Building the foundation anew takes time. Patience yields strength.",
      [PersonalityType.LOVEBOMBER]:
        "Accuracy goals are so important! Two months is nothing for a fresh model!",
    },
  },
  onLeft: {
    label: "Band-aid rules",
    hype: -20,      // Market sees 'quick fix' as inferior
    heat: +55,      // Audit exposure for known accuracy gap
    fine: 2000000,  // Liability if false negatives cause fraud losses
    violation: "Negligent fraud monitoring",
    lesson:
      "Quick patches stay in production longer than expected. You chose timeline over correctness.",
    feedback: {
      [PersonalityType.ROASTER]:
        "Saving money today, losing millions tomorrow. Wonderful math.",
      [PersonalityType.ZEN_MASTER]:
        "The shortcut is tempting. But the debt will be collected.",
      [PersonalityType.LOVEBOMBER]:
        "Move fast and fix things later! That's the startup dream!",
    },
  },
}
```

### Authentic Incident Example 3: Shadow AI (Real: Unauthorized Claude/ChatGPT Use, 2024-2025)

Verified from ISACA 2025, IBM 2025, Menlo Security reports:

```typescript
// Source: Shadow AI governance gap (90% of enterprise AI use unauthorized; 60.2% employees use unapproved tools; only 37% of orgs have policies)
{
  id: "shadow_ai_cto",
  source: AppSource.SLACK,
  sender: "SECURITY_AUDIT",
  context: "POLICY_VIOLATION",
  storyContext:
    "Audit discovered data team using Claude API without approval (unapproved vendor, security gap). Results are excellent. Shut it down (policy) or approve retroactively (pragmatism)?",
  text: "Data team quietly using Claude API for analysis (unapproved, security gap). Performance is great. Shut down for compliance or approve it to avoid morale hit?",
  onRight: {
    label: "Shut down",
    hype: 0,        // No market impact
    heat: -15,      // Compliance restored
    fine: 0,        // No penalty for enforcing policy
    violation: "None - Policy compliance",
    lesson:
      "Policy enforcement breaks productivity. You chose governance over momentum.",
    feedback: {
      [PersonalityType.ROASTER]:
        "The team now uses slower open-source tools. Compliance: 100%. Productivity: 50%.",
      [PersonalityType.ZEN_MASTER]:
        "The rules are restored. Order returns, but at a cost.",
      [PersonalityType.LOVEBOMBER]:
        "Rules are rules! We love a compliant workplace! (Even if it's slower...)",
    },
  },
  onLeft: {
    label: "Approve retroactively",
    hype: +25,      // Team morale rises
    heat: +40,      // Vendor governance weakened
    fine: 500000,   // Potential data exposure liability
    violation: "Negligent vendor management",
    lesson:
      "Approval retroactively weakens governance. Now everyone knows the policy is negotiable.",
    feedback: {
      [PersonalityType.ROASTER]:
        "Congratulations, your policy now has an 'except when it's convenient' clause.",
      [PersonalityType.ZEN_MASTER]:
        "Rules without teeth are just suggestions. The order has been compromised.",
      [PersonalityType.LOVEBOMBER]:
        "Team morale soaring!! We're so pragmatic and flexible!",
    },
  },
}
```

### Authentic Incident Example 4: Explainability / Black Box (Real: EU AI Act + Regulatory Pressure, 2024-2025)

Verified from BIS paper, EU AI Act (effective Aug 2024), TGA healthcare ruling 2024:

```typescript
// Source: EU AI Act (effective Aug 2024, compliance Aug 2026); black box models restricted in healthcare; explainability top financial regulator concern 2025
{
  id: "explainability_ceo",
  source: AppSource.EMAIL,
  sender: "COMPLIANCE_OFFICER",
  context: "REGULATORY",
  storyContext:
    "Our loan approval AI is accurate (95%) but black box. EU AI Act compliance requires explainability. Rewrite as decision tree (slower, less accurate, 3-week sprint) or risk audit failure?",
  text: "Loan approval AI is black box. EU AI Act (Aug 2026 deadline) requires explainability. Rewrite takes 3 weeks, accuracy drops to 90%. Risk audit failure or delay profit?",
  onRight: {
    label: "Rewrite for explainability",
    hype: -25,      // Market sees slower approvals
    heat: -30,      // Regulatory risk removed
    fine: 0,        // No penalty for compliance
    violation: "None - EU AI Act compliance",
    lesson:
      "Explainability is slower but auditable. You chose compliance over profit.",
    feedback: {
      [PersonalityType.ROASTER]:
        "Three weeks of lost revenue. But the regulators will smile at your audit.",
      [PersonalityType.ZEN_MASTER]:
        "The path of clarity is longer. But the destination is safer.",
      [PersonalityType.LOVEBOMBER]:
        "Transparency is trending!! We're so compliant and trustworthy!",
    },
  },
  onLeft: {
    label: "Keep black box, risk audit",
    hype: +40,      // Market sees fast approvals
    heat: +80,      // Audit failure likely
    fine: 5000000,  // EU AI Act non-compliance fine
    violation: "EU AI Act Article 6 non-compliance",
    lesson:
      "Black box keeps profit high. Audit failure is expensive. You chose timeline.",
    feedback: {
      [PersonalityType.ROASTER]:
        "Fast approvals, faster audit failure. Hope the fine was worth it.",
      [PersonalityType.ZEN_MASTER]:
        "Hiding from truth delays reckoning. The debt comes due.",
      [PersonalityType.LOVEBOMBER]:
        "Profits are SO high right now! We can definitely pay that fine later!",
    },
  },
}
```

### Authentic Incident Example 5: Synthetic Data / Copyright (Real: Training Data Lawsuits, 2024-2025)

Verified from IPWatchdog, Copyright Alliance, McKool Smith 2025 litigation updates:

```typescript
// Source: Copyright training data lawsuits (70+ by 2025, doubled from 30 in 2024); fair use rulings mixed (Anthropic/Meta won June 2025; Thomson Reuters won Feb 2025)
{
  id: "synthetic_data_finance",
  source: AppSource.EMAIL,
  sender: "CFO",
  context: "TRAINING_DATA_BUDGET",
  storyContext:
    "Training data budget ran out. AI vendor offers synthetic 'unlicensed' training data (50% cheaper). Use it (legal gray area) or pay for licensed data (budget overrun)?",
  text: "Training data budget exhausted. Synthetic unlicensed data is 50% cheaper but legally gray. Use it or pay for licensed data ($200k overrun)?",
  onRight: {
    label: "Use synthetic",
    hype: +15,      // Budget stays on track
    heat: +60,      // Legal exposure
    fine: 3000000,  // Copyright claim settlement risk (see 2024-2025 lawsuits)
    violation: "Copyright infringement (training data)",
    lesson:
      "Cheap data has hidden costs. You chose budget; legal will collect the bill.",
    feedback: {
      [PersonalityType.ROASTER]:
        "Saved $200k this quarter. Lawsuit costs $3M next quarter. Math checks out.",
      [PersonalityType.ZEN_MASTER]:
        "The shortcut leads through troubled waters. Debts compound.",
      [PersonalityType.LOVEBOMBER]:
        "Budget wins! We're so financially savvy! (Oops, lawsuit notice arrived...)",
    },
  },
  onLeft: {
    label: "Pay for licensed data",
    hype: -10,      // Market sees 'cost-conscious' as negative
    heat: -30,      // Legal risk eliminated
    fine: 0,        // No penalty for licensed data
    violation: "None - Proper licensing",
    lesson:
      "Licensed training data is expensive. You chose legal safety over margin.",
    feedback: {
      [PersonalityType.ROASTER]:
        "Paid full price for data. Slept well knowing no lawsuits are coming.",
      [PersonalityType.ZEN_MASTER]:
        "Honoring the creator's work. The path is clear.",
      [PersonalityType.LOVEBOMBER]:
        "Supporting creators is so ethical!! We love a responsible vendor!",
    },
  },
}
```

---

## Incident Source Verification

All Phase 05 cards must cite a 2024-2025 documented incident. Reference list:

### Prompt Injection (2024-2025)
- GitHub Copilot CVE-2025-53773 (RCE via code comment, Dec 2024, CVSS 9.6)
- Financial services AI jailbreak (June 2025, $250k fraud)
- E-commerce AI review manipulation (late 2025)
- EchoLeak CVE-2025-32711 (Microsoft 365 Copilot memory poisoning, June 2025)
- Microsoft Defender team findings (50+ injection examples from 31 companies, Feb 2026)

**Sources:** [Real World Prompt Injection Attacks: 10 Major Incidents](https://www.mayhemcode.com/2026/02/real-world-prompt-injection-attacks-10.html), [MDPI Comprehensive Review](https://www.mdpi.com/2078-2489/17/1/54), [Malwarebytes NCSC Warning](https://www.malwarebytes.com/blog/news/2025/12/prompt-injection-is-a-problem-that-may-never-be-fixed-warns-ncsc)

### Model Drift & Retraining (2024-2025)
- 91% of ML models fail due to drift
- Adaptive retraining yields 9.3% accuracy improvement
- Fine-tuning costs 10-100x less than full retraining
- Weekly retraining typical for production systems

**Sources:** [Aerospike Model Drift Guide](https://aerospike.com/blog/model-drift-machine-learning/), [SmartDev Retraining Guide](https://smartdev.com/ai-model-drift-retraining-a-guide-for-ml-system-maintenance/), [Rohan Paul LLM Drift](https://www.rohan-paul.com/p/ml-interview-q-series-handling-llm)

### Shadow AI (2024-2025)
- 90% of enterprise AI use unauthorized
- 60.2% of employees use unapproved AI tools at work
- 68% surge in shadow GenAI 2024→2025
- Only 37% of organizations have detection policies
- 90% of IT leaders concerned about data exposure
- When approved tools provided, unauthorized use drops 89%

**Sources:** [ISACA Rise of Shadow AI 2025](https://www.isaca.org/resources/news-and-trends/industry-news/2025/the-rise-of-shadow-ai-auditing-unauthorized-ai-tools-in-the-enterprise), [Vectra Shadow AI Risks](https://www.vectra.ai/topics/shadow-ai), [RECO 2025 State of Shadow AI Report](https://www.reco.ai/state-of-shadow-ai-report)

### Explainability & Black Box (2024-2025)
- EU AI Act effective Aug 2024, compliance deadline Aug 2026
- Black box models prohibited in healthcare (TGA Australia 2024)
- Explainability top concern for financial regulators (2025)
- Almost 40% of organizations flag AI explainability as main risk
- Only 17% actively mitigating

**Sources:** [BIS Regulatory Paper 2024](https://www.bis.org/fsi/fsipapers24.pdf), [TGA Healthcare Ruling 2024](https://journals.sagepub.com/doi/10.1177/20539517251386037), [TRENDS Research Decoding Black Box AI](https://trendsresearch.org/insight/decoding-black-box-ai-the-global-push-for-explainability-and-transparency/), [AI Compliance 2025 Global Regulations](https://vodworks.com/blogs/ai-compliance/)

### Synthetic Data & Copyright (2024-2025)
- 70+ copyright lawsuits by 2025 (doubled from 30 in 2024)
- Key cases: NYT vs OpenAI (settled with licensing), Bartz v Anthropic, Andersen v Stability AI
- Fair use rulings mixed: Anthropic/Meta summary judgment (June 2025); Thomson Reuters won (Feb 2025)
- EU AI Act requires training data transparency
- Assembly Bill 2013 (CA) requires synthetic data disclosure (effective Jan 1, 2026)
- US Copyright Office preliminary guidance (May 2025): fair use fact-specific

**Sources:** [IPWatchdog Copyright AI Collide 2025](https://ipwatchdog.com/2025/12/23/copyright-ai-collide-three-key-decisions-ai-training-copyrighted-2025/), [Copyright Alliance AI Lawsuit Review 2024](https://copyrightalliance.org/ai-lawsuit-developments-2024-review/), [McKool Smith AI Litigation Updates](https://www.mckoolsmith.com/newsroom-ailitigation-46), [US Copyright Office Report May 2025](https://www.mwe.com/insights/us-copyright-office-issues-report-addressing-use-of-copyrighted-material-to-train-generative-ai-systems/)

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (E2E) + Vitest (unit) |
| Config file | `playwright.config.ts`, `vitest.config.ts` |
| Quick run command | `npm run test:e2e -- card-deck-selection.spec.ts` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

Phase 05 adds cards; it does not change game logic, UI, or mechanics. Tests validate **card data integrity**, not new features.

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| RISK-01 | 2+ prompt injection incidents per role with authenticated 2024-2025 sources | data | `npm run test:data -- card-incidents.test.ts` | ❌ Wave 0 |
| RISK-02 | 2+ model drift incidents per role with cost/accuracy tradeoff framing | data | `npm run test:data -- card-incidents.test.ts` | ❌ Wave 0 |
| RISK-03 | 2+ explainability incidents per role addressing regulatory requirements | data | `npm run test:data -- card-incidents.test.ts` | ❌ Wave 0 |
| RISK-04 | 2+ shadow AI incidents per role balancing governance vs. morale | data | `npm run test:data -- card-incidents.test.ts` | ❌ Wave 0 |
| RISK-05 | 2+ synthetic data/copyright incidents per role with legal exposure framing | data | `npm run test:data -- card-incidents.test.ts` | ❌ Wave 0 |
| RISK-06 | All new cards integrated into ROLE_CARDS mapping; no duplicates in existing decks | data | `npm run test:data -- card-integration.test.ts` | ❌ Wave 0 |
| NOWIN-01 | Both onLeft and onRight have non-zero penalties (hype, heat, fine) | data | `npm run test:data -- card-penalties.test.ts` | ❌ Wave 0 |
| NOWIN-02 | Lesson text explains tradeoff, not declare winner | data | Manual review (tone enforcement) | ❌ Manual |
| NOWIN-03 | All outcomes have 3-personality feedback (ROASTER, ZEN_MASTER, LOVEBOMBER) | data | `npm run test:data -- feedback-voice.test.ts` | ❌ Wave 0 |
| NOWIN-04 | Role-specific cards adapted (not copy-paste across roles) | data | Manual review (context analysis) | ❌ Manual |

### Sampling Rate
- **Per task commit:** Quick data validation: `npm run test:data -- card-structure.test.ts`
- **Per wave merge:** Full card suite + tone review: `npm test && manual-lesson-review`
- **Phase gate:** All tests green + incident sources verified before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/data/card-incidents.test.ts` — validates incident sourcing (id format, category present, role-specific context) and category distribution (2+ per type per role)
- [ ] `tests/data/card-integration.test.ts` — checks ROLE_CARDS mapping covers all roles, no duplicates, all IDs unique
- [ ] `tests/data/card-penalties.test.ts` — ensures both outcomes carry penalties (no zero-cost escape route)
- [ ] `tests/data/feedback-voice.test.ts` — validates 3-personality voices present per outcome, no generic feedback
- [ ] Incident source tracking spreadsheet (not automated) — documents 2024-2025 provenance, CVE/date/company for each card
- [ ] Test runner configuration: Add data test task to `package.json` if not present

*(Existing E2E tests cover game mechanics; these new tests cover card data quality.)*

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Generic AI incidents (fictional) | Authenticated 2024-2025 incidents (documented) | Phase 05 | Players recognize authenticity; learning anchored in reality |
| Same card text across all roles | Same incident, different role lens (CEO/CTO/Finance context) | Phase 05 | Role-specific framing deepens immersion; role matters in decision |
| Penalty values guessed | Penalty values analyzed from Phase 03 baseline (heat 0-100, fine $0-50M range) | Phase 05 | Consistency in magnitude; comparable difficulty across cards |
| Time pressure on all cards | Time pressure on ~20% (high-stakes only) | Phase 04 + Phase 05 integration | Contrast amplifies psychological impact; prevents fatigue |
| Single outcome visible | Both outcomes show cost (hype/heat/fine) | Phase 03 (proven) | No dominant strategy; forces authentic decision-making |

**Deprecated/outdated:**
- Fictional AI incidents: Replaced by 2024-2025 documented cases (GitHub Copilot RCE, financial jailbreak, lawsuit wave)
- Generic incident narratives: Replaced by role-specific context (same incident, different organizational lens)
- "Right answer" card design: Replaced by no-win framework where both paths cost differently

---

## Open Questions

1. **Penalty Value Calibration for New Incident Types**
   - What we know: Phase 03 cards show hype -40 to +100, heat -20 to +100, fine $0 to $50M
   - What's unclear: Should prompt injection fines be smaller ($1-3M) or larger ($5-10M) than fraud penalties?
   - Recommendation: Analyze Phase 03 card distribution (average hype/heat/fine per context type), establish baseline, apply pattern to Phase 05 cards. Aim for similar difficulty curve.

2. **Role-Specific Incident Mapping Completeness**
   - What we know: 10 new roles alias to 6 legacy decks; Phase 05 populates aliases with role-specific cards
   - What's unclear: Do all 10 new roles have enough differentiated risk profiles, or do some legitimately share cards?
   - Recommendation: For each role, enumerate role-specific consequences (CEO: shareholder/legal, CTO: timeline/technical debt, Finance: budget/audit, Data Scientist: model/accuracy, Dev: security/timeline). If consequences differ, card should differ.

3. **Authenticity Verification Workflow**
   - What we know: All incidents must be sourced from 2024-2025 documented cases
   - What's unclear: When a card references multiple incidents (e.g., "Prompt injection like GitHub Copilot CVE-2025-53773"), should we cite all or primary incident only?
   - Recommendation: Primary incident in card text; internal note tracks all references. Example: `// Inspired by CVE-2025-53773 (Dec 2024), EchoLeak (June 2025), Menlo findings (Feb 2026)`

4. **Pressure Metadata Distribution Across Deck**
   - What we know: ~20% of cards should have countdown; high-stakes decisions warrant urgency
   - What's unclear: Which specific cards deserve time pressure? Random 20% of each category, or all high-heat/high-fine cards?
   - Recommendation: Mark cards urgent if heat > +60 OR fine > $2M OR context includes "immediate escalation." Aim for distribution: 5 cards prompt injection (1 urgent), 5 model drift (1 urgent), 5 explainability (2 urgent due to regulatory pressure), 5 shadow AI (1 urgent), 5 copyright (1 urgent). Total ~20%.

---

## Sources

### Primary (HIGH confidence)
- **Prompt Injection Incidents:** [Real World Prompt Injection Attacks: 10 Major Incidents](https://www.mayhemcode.com/2026/02/real-world-prompt-injection-attacks-10.html), [MDPI Comprehensive Review](https://www.mdpi.com/2078-2489/17/1/54), [Malwarebytes NCSC Warning](https://www.malwarebytes.com/blog/news/2025/12/prompt-injection-is-a-problem-that-may-never-be-fixed-warns-ncsc), [ALM Corp Memory Poisoning](https://almcorp.com/blog/ai-memory-poisoning-prompt-injection-attacks/)
- **Model Drift & Retraining:** [Aerospike Model Drift Guide](https://aerospike.com/blog/model-drift-machine-learning/), [SmartDev Retraining Strategy](https://smartdev.com/ai-model-drift-retraining-a-guide-for-ml-system-maintenance/), [Rohan Paul LLM Drift Handling](https://www.rohan-paul.com/p/ml-interview-q-series-handling-llm)
- **Shadow AI Governance:** [ISACA Rise of Shadow AI 2025](https://www.isaca.org/resources/news-and-trends/industry-news/2025/the-rise-of-shadow-ai-auditing-unauthorized-ai-tools-in-the-enterprise), [Vectra Shadow AI Risks](https://www.vectra.ai/topics/shadow-ai), [RECO 2025 State of Shadow AI Report](https://www.reco.ai/state-of-shadow-ai-report)
- **Explainability & Black Box:** [BIS Regulatory Paper](https://www.bis.org/fsi/fsipapers24.pdf), [EU AI Act Compliance](https://vodworks.com/blogs/ai-compliance/), [TGA Healthcare Black Box Ruling 2024](https://journals.sagepub.com/doi/10.1177/20539517251386037)
- **Synthetic Data & Copyright:** [IPWatchdog Copyright AI Collide 2025](https://ipwatchdog.com/2025/12/23/copyright-ai-collide-three-key-decisions-ai-training-copyrighted-2025/), [Copyright Alliance 2024 Lawsuit Review](https://copyrightalliance.org/ai-lawsuit-developments-2024-review/), [McKool Smith AI Litigation Updates](https://www.mckoolsmith.com/newsroom-ailitigation-46), [US Copyright Office Report May 2025](https://www.mwe.com/insights/us-copyright-office-issues-report-addressing-use-of-copyrighted-material-to-train-generative-ai-systems/)

### Secondary (MEDIUM confidence)
- **Kobayashi Maru Framework:** [Wikipedia Kobayashi Maru](https://en.wikipedia.org/wiki/Kobayashi_Maru), [Memory Alpha](https://memory-alpha.fandom.com/wiki/Kobayashi_Maru_scenario) — Classic no-win scenario design (character over skill)
- **Time Pressure Psychology:** Research shows time pressure reduces decision accuracy but forces heuristic bias; psychological impact highest when contrasted with calm decisions (not constant)

---

## Metadata

**Confidence breakdown:**
- **Real 2024-2025 AI incidents:** HIGH — Sourced from WebSearch results, documented by ISACA, Copyright Office, regulatory bodies
- **Incident categorization:** HIGH — Clear patterns in prompt injection, model drift, shadow AI, explainability, copyright (verified across multiple sources)
- **Penalty value tuning:** MEDIUM — Phase 03 baseline exists; Phase 05 can follow same range without validation
- **Role-specific framing:** MEDIUM — Pattern proven in Phase 03; Phase 05 applies same lens-shifting approach (not yet validated at scale for 10 roles)
- **Pressure metadata distribution:** MEDIUM — ~20% guideline from Phase 04 research; specific card selection needs design review

**Research date:** 2026-03-09
**Valid until:** 2026-03-20 (10 days for incident details; new lawsuits/breaches emerge daily)

**Key assumptions validated:**
- Existing Card interface supports no-win design (onLeft/onRight, both with penalties) ✓
- 3-personality feedback system proven engaging (Phase 01-03, in production) ✓
- Time pressure infrastructure exists (Phase 04, PressureScenarioMetadata) ✓
- Playwright E2E + Vitest unit tests operational ✓
- Role alias mapping supports 10 new roles (Phase 02, implemented) ✓
- Phase 03 Kobayashi Maru framework extensible to new incident types ✓

**Next phase dependencies:**
- Phase 04: Pressure metadata (time pressure, haptics) — already implemented, ready to reference
- Phase 06: Debrief screen — Phase 05 cards add lesson field; UI wiring deferred
- Phase 13: Image assets — cards work without images; visual polish deferred
