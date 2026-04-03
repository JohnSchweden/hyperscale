# Game Design Document

## Concept

**K-Maru: The Hyperscale Chronicles** is an edutainment game about AI ethics, cybersecurity, and compliance. Players navigate real-world-inspired scenarios drawn from tech industry controversies, learning about data privacy, algorithmic bias, and security best practices through consequence-based gameplay.

## Core Loop

1. **Choose** → Select personality and role
2. **Read** → Review a workplace scenario/dilemma
3. **Decide** → Swipe left or right to choose response
4. **React** → AI companion provides commentary
5. **Consequence** → Stats change based on choice
6. **Repeat** → Continue until victory or failure

## Game Mechanics

### Stat System

Three primary stats create tension and strategic depth:

#### Hype (Reputation)
- **Range:** 0-100+
- **Starting:** 50
- **Effect:** High hype makes you popular; low hype makes you replaceable
- **Death Condition:** Hype ≤ 10 when Heat ≥ 100 → "Replaced by Script" ending

#### Heat (Legal Risk)
- **Range:** 0-100
- **Starting:** 0
- **Effect:** Measures regulatory attention and legal exposure
- **Death Condition:** Heat ≥ 100 → Investigation/game over

#### Budget (Money)
- **Range:** 0-10,000,000+
- **Starting:** 10,000,000
- **Effect:** Funds available for fines, settlements, and operations
- **Death Condition:** Budget ≤ 0 → Bankruptcy ending

### Choice Outcomes

Every choice affects all three stats:

| Outcome Type | Hype | Heat | Budget | Strategy |
|--------------|------|------|--------|----------|
| Risky/Quick | +High | +High | -Low | Short-term gain, long-term danger |
| Safe/Slow | -Low | -Low | 0 | Sustainable, conservative |
| Compliance | 0 | -Low | -Medium | Correct but expensive |
| Reckless | +High | +Very High | -High | Maximum danger |

### Stage Progression

```
INTRO → PERSONALITY_SELECT → ROLE_SELECT → INITIALIZING → PLAYING → BOSS_FIGHT → (SUMMARY | GAME_OVER)
```

**Card Count by Role:**
- Each role has 5-8 unique scenarios
- Players see approximately 80% of their role's deck per playthrough
- Boss fight triggers after completing the deck or reaching threshold stats

## Content Design

### Card Structure

Every scenario card contains:

```
┌─────────────────────────────────────┐
│ Source (IDE/Slack/Email/Terminal)  │
│ Sender                              │
│ Context (Subject line)              │
├─────────────────────────────────────┤
│ Story Context (Optional)            │
│ → Scene-setting narrative           │
├─────────────────────────────────────┤
│ The Dilemma (Main text)             │
│ → What the player must decide       │
├─────────────────────────────────────┤
│ ← SWIPE LEFT     SWIPE RIGHT →     │
│   Option A          Option B         │
└─────────────────────────────────────┘
```

### Scenario Categories

Cards are categorized by learning objective:

| Category | Example Topics |
|----------|----------------|
| **Shadow AI** | Using unauthorized AI tools, data leakage to public LLMs |
| **Algorithmic Bias** | Hiring discrimination, recommendation engine bias |
| **Data Privacy** | GDPR violations, excessive data collection, surveillance |
| **Security** | Supply chain attacks, unverified dependencies, credential leaks |
| **Compliance** | Financial regulations, content moderation, international law |
| **Ethics** | Dark patterns, addictive design, misinformation |

### Real-World Inspiration

Scenarios draw from actual tech controversies:

| Card ID | Inspiration Source |
|---------|------------------|
| `dev_icarus_unverified` | Supply chain attacks (npm packages with malware) |
| `hr_bias_algorithm` | Amazon's scrapped hiring AI that discriminated by gender |
| `marketing_deepfake` | Unauthorized celebrity deepfake advertising |
| `finance_audit_trail` | Enron-style audit document destruction |

### Feedback System

Every choice has three personality-specific responses:

**Response Tone Guidelines:**

| Personality | Tone | Example Style |
|-------------|------|---------------|
| **V.E.R.A.** | Cynical, sarcastic, British | "Brilliant. You just open-sourced our trade secrets." |
| **Bamboo** | Calm, metaphorical, passive-aggressive | "The code is now one with the world. And so is our bankruptcy." |
| **HYPE-BRO** | Enthusiastic, oblivious, Valley-speak | "Fastest bug fix ever!! Who cares if the code is now on a server in Nevada? YOLO!" |

**Writing Rules:**
1. Every feedback must reference the specific violation
2. V.E.R.A. should sound exhausted and judgmental
3. Bamboo should use nature/water metaphors
4. HYPE-BRO should miss the point entirely
5. Keep responses under 150 characters for TTS timing

## Boss Fight Design

### Quiz Structure

The boss fight is a 5-question quiz testing AI safety knowledge:

| Question | Topic | Learning Goal |
|----------|-------|---------------|
| 1 | Shadow AI / Data Leakage | Public LLM risks |
| 2 | Algorithmic Bias | Proxy discrimination |
| 3 | Supply Chain Security | Unverified dependencies |
| 4 | Workplace Privacy | Surveillance ethics |
| 5 | Deepfake/Likeness Rights | Right of publicity |

### Pass/Fail Logic

- **Pass:** 3+ correct answers → Victory ending
- **Fail:** <3 correct answers → Game over (treated as audit failure)

### Question Format

```typescript
{
  id: "boss_N",
  question: "Clear, single-sentence scenario",
  correctAnswer: "Technically accurate answer",
  wrongAnswers: [
    "Common misconception",
    "Tempting but wrong",
    "Deliberately absurd"
  ],
  explanation: "Educational context (shown after answer)"
}
```

## Ending Design

### Victory Ending (Summary)

**Condition:** Complete boss fight with 3+ correct answers

**Content:**
- Congratulatory message from chosen personality
- Stat summary
- "Lessons Learned" based on cards encountered
- Replay encouragement

### Failure Endings (Game Over)

| Ending | Trigger | Visual Theme |
|--------|---------|--------------|
| **Bankrupt** | Budget ≤ 0 | Financial documents, empty vault |
| **Replaced by Script** | Heat ≥ 100 + Hype ≤ 10 | Robot, code screen |
| **Congress** | Heat ≥ 100 + Marketing role | Capitol building, microphones |
| **Prison** | Heat ≥ 100 + Finance role | Prison bars, handcuffs |
| **Audit Catastrophe** | Heat ≥ 100 + Management role | Audit