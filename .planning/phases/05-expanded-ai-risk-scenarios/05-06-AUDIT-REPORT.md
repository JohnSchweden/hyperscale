# 05-06 Audit Report: Archetypes & Death Endings

**Phase:** 05-expanded-ai-risk-scenarios  
**Plan:** 06  
**Date:** 2026-03-22  
**Status:** Document-only audit (no code changes)

---

## 1. Death Ending Audit

### Current Death Endings (6)

| DeathType | Title | Theme |
|-----------|-------|-------|
| BANKRUPT | Liquidated | Financial failure, VC withdrawal |
| REPLACED_BY_SCRIPT | Replaced by a script | Automation/AI displacement |
| CONGRESS | Testifying before Congress | Regulatory/legal scrutiny |
| FLED_COUNTRY | Fled the country | Escaping consequences |
| PRISON | Federal prison | Criminal liability |
| AUDIT_FAILURE | Audit catastrophe | Compliance/regulatory failure |

### Role × Death Ending Affinity Matrix

| DeathType | CSO | HoS | Mgr | TAC | DS | Arch | Eng | VC | VE | AE |
|-----------|-----|-----|-----|-----|----|------|-----|----|----|----|
| BANKRUPT | ✓ | ✓ | ✓ | ~ | ~ | ~ | ~ | ~ | ~ | ~ |
| REPLACED_BY_SCRIPT | ~ | ~ | ~ | ✓ | ✓ | ~ | ✓ | ✓ | ✓ | ✓ |
| CONGRESS | ✓ | ~ | ~ | ~ | ~ | ~ | ~ | ~ | ~ | ~ |
| FLED_COUNTRY | ✓ | ~ | ~ | ✓ | ~ | ~ | ~ | ~ | ~ | ~ |
| PRISON | ✓ | ~ | ~ | ~ | ~ | ~ | ~ | ~ | ~ | ~ |
| AUDIT_FAILURE | ✓ | ✓ | ✓ | ✓ | ~ | ~ | ~ | ~ | ~ | ~ |

**Legend:** ✓ = Strong thematic fit | ~ = Weak/generic fit

### Gap Analysis

**Leadership Roles (CSO, HoS, Mgr):**
- Well covered with 4-6 strong fits each
- Death endings focus on accountability, financial, and regulatory themes
- These align with leadership responsibilities

**Technical IC Roles (DS, Arch, Eng, VC, VE, AE):**
- Only 1-2 strong fits each
- Most endings feel generic or forced for hands-on technical roles
- Missing technical failure modes

**Identified Gaps by Role:**

| Role | Missing Thematic Ending |
|------|------------------------|
| Data Scientist | Model contamination, data poisoning |
| Software Architect | Technical debt collapse, system implosion |
| Software Engineer | Production outage cascade, dependency hell |
| Vibe Coder | Prompt injection takeover, AI-generated catastrophe |
| Vibe Engineer | Latency death spiral, infrastructure meltdown |
| Agentic Engineer | AI agent rogue, autonomous system breach |

### Recommendation

**KEEP existing 6 death endings** — they work well for leadership roles and provide broad coverage.

**Consider adding 2-3 new endings** for technical IC roles in a future phase:

1. **AGENT_UPRISING** — "The agents you built gained sentience. They're now running the company. You're redundant."
   - Fits: Agentic Engineer, Vibe Coder
   - Theme: AI autonomy gone wrong

2. **TECHNICAL_DEBT_COLLAPSE** — "The system you architected collapsed under its own complexity. No one knows how to fix it."
   - Fits: Software Architect, Software Engineer
   - Theme: Architectural failure

3. **DATA_POISONING** — "Your training data was contaminated. The model is now outputting nonsense. Retraining from scratch."
   - Fits: Data Scientist, Agentic Engineer
   - Theme: ML pipeline failure

---

## 2. Personality Archetype Audit

### Current Personalities (3)

| Personality | Name | TTS Voice | Thematic Niche |
|-------------|------|-----------|----------------|
| ROASTER | V.E.R.A. | Kore | Cynicism, dark humor, "told you so" |
| ZEN_MASTER | BAMBOO | Puck | Philosophical calm, acceptance, long-term thinking |
| LOVEBOMBER | HYPE-BRO | Enceladus | Toxic positivity, enthusiasm, hype |

### Distinctiveness Assessment

**Voice Clarity:** HIGH ✓
- All 3 personalities are immediately distinguishable from a single feedback line
- No overlap in tone or vocabulary

**Replay Value:** MEDIUM ✓
- 3 voices provide variety for 3-5 playthroughs
- After 5+ playthroughs, feedback becomes predictable
- 10-role coverage stretches the 3 voices thin

**Thematic Coverage:**

| Dimension | Covered By |
|-----------|------------|
| Emotional (cynical) | ROASTER |
| Emotional (optimistic) | LOVEBOMBER |
| Philosophical | ZEN_MASTER |
| Analytical | **MISSING** |
| Historical/Learning | **MISSING** |
| Paranoid/Surveillance | **MISSING** |

### Cross-Role Balance

| Role | Best Fit Personality | Reason |
|------|---------------------|--------|
| Chief Something Officer | ROASTER | Cynical C-suite commentary fits perfectly |
| Head of Something | ROASTER | Middle-management misery |
| Something Manager | ROASTER | Spreadsheet cynicism |
| Tech/AI Consultant | LOVEBOMBER | Snake oil synergy energy |
| Data Scientist | ZEN_MASTER | Data zen, acceptance of uncertainty |
| Software Architect | ROASTER | Technical debt collector persona |
| Software Engineer | ROASTER | Bug manufacturer cynicism |
| Vibe Coder | LOVEBOMBER | Prompt magic vibes |
| Vibe Engineer | LOVEBOMBER | Latency enthusiasm |
| Agentic Engineer | ROASTER | Rogue bot puppet master cynicism |

**Finding:** ROASTER dominates leadership and engineering roles (6/10). LOVEBOMBER fits consultant/vibe roles (3/10). ZEN_MASTER only strongly fits Data Scientist (1/10).

### Missing Personality Niches

1. **ANALYST/Data-Driven** — "Your risk exposure is now 47.3% above baseline"
2. **PARANOID/Conspiracy** — "They're watching. They already know what you chose."
3. **MENTOR/Professor** — "In the 2019 Boeing 737 MAX case, the same pattern..."
4. **GEN-Z/Meme-Speak** — "bestie no that's so unhinged fr fr"
5. **MACHIAVELLIAN** — "Interesting move. Now leverage their weakness."

---

## 3. New Personality Proposals

### Proposal 1: THE_ANALYST (QUANT)

**Name:** QUANT  
**Type:** ANALYST  
**TTS Voice:** Charon (neutral, measured, analytical)

**Voice Character:**
A quant hedge fund risk manager who sees everything as probabilities and distributions. Speaks in percentiles, confidence intervals, and expected value. No emotion, just cold numbers. Secretly enjoys watching models fail because it validates their worldview that everything is stochastic.

**Feedback Style Examples:**
- "Expected value of that decision: -$2.3M. Standard deviation: $8M. You're in the 95th percentile of bad choices."
- "Your risk-adjusted return on that swipe was negative. Sharpe ratio approaching zero."
- "Monte Carlo simulation suggests 73% probability of regulatory intervention. Want me to run it again?"
- "That option had a 2.4-sigma downside. You chose... poorly."
- "VaR analysis complete: 99% chance this ends badly. The 1% is just model error."

**Thematic Niche:** Data-driven commentary, statistical framing, risk metrics. Covers the "analytical" dimension missing from current personalities.

**Role Affinity:**
- Data Scientist (✓✓✓) — Natural fit, speaks the same language
- Software Architect (✓✓) — System risk analysis
- Tech/AI Consultant (✓✓) — Risk quantification
- Agentic Engineer (✓) — Model uncertainty

**Lines:**
- **Onboarding:** "I've modeled 10,000 simulations of your tenure. The median outcome involves bankruptcy. Shall we begin?"
- **Victory:** "Statistical anomaly. Your survival probability was 12%. Well... played."
- **Failure:** "Within expected parameters. Your p-value for disaster was significant at the 0.001 level."

---

### Proposal 2: THE_PARANOID (WATCHER)

**Name:** WATCHER  
**Type:** PARANOID  
**TTS Voice:** Fenrir (tense, cautious, slightly unnerving)

**Voice Character:**
A former NSA contractor turned AI ethics whistleblower. Sees patterns, backdoors, and surveillance everywhere. Everything is connected to a larger conspiracy. Knows things they shouldn't. Low-key terrified but masks it with urgent warnings.

**Feedback Style Examples:**
- "They logged that decision. It's in the training data now. They know what you chose."
- "Check your phone. Notice the battery drain? That's not coincidental."
- "The model predicted you'd swipe left. It knows you better than you know yourself."
- "That vendor integration? Backdoored. I have the documents. Can't share them."
- "Your 'private' cloud instance has three letter agencies as co-tenants. Just saying."

**Thematic Niche:** Surveillance anxiety, unseen forces, meta-commentary on AI systems. Covers the "paranoid/conspiracy" dimension.

**Role Affinity:**
- Agentic Engineer (✓✓✓) — Rogue AI awareness
- Vibe Coder (✓✓) — Prompt injection paranoia
- Data Scientist (✓✓) — Training data contamination fears
- Chief Something Officer (✓) — Corporate espionage

**Lines:**
- **Onboarding:** "Don't use your real name. The logs are permanent. I'll be watching your choices... for both our safety."
- **Victory:** "You survived. But they're archiving this session. Nothing is ever truly deleted."
- **Failure:** "They predicted this outcome. It was in the training set. We were always going to lose."

---

### Proposal 3: THE_MENTOR (PROFESSOR)

**Name:** PROFESSOR  
**Type:** MENTOR  
**TTS Voice:** Aoede (scholarly, warm, pedagogical)

**Voice Character:**
A grizzled ethics professor who's seen every failure mode in 30 years of teaching. References real cases constantly. Wants you to learn from history. Socratic method - asks questions more than gives answers. Genuinely wants you to grow, even through failure.

**Feedback Style Examples:**
- "In the 2019 Boeing 737 MAX case, engineers raised concerns. Management overruled them. Sound familiar?"
- "Theranos had great PR too. The lesson isn't 'don't innovate'—it's 'verify independently.'"
- "The 2010 Flash Crash was caused by automated systems making decisions faster than humans could intervene. Consider that."
- "Uber's 2016 breach wasn't the hack that killed them. It was the cover-up. Transparency matters."
- "Remember: Enron's auditors signed off right until the end. External validation isn't always... valid."

**Thematic Niche:** Historical context, case study references, pedagogical framing. Covers the "learning from history" dimension.

**Role Affinity:** All roles equally (✓✓) — universal appeal through historical context.

**Lines:**
- **Onboarding:** "Welcome to the curriculum. The syllabus is simple: every decision has precedent. Let's see if you've done the reading."
- **Victory:** "You've demonstrated pattern recognition. That's rarer than you think. Class dismissed... for now."
- **Failure:** "Failure is the tuition for wisdom. Review the case study. There will be a quiz—it's called 'your next decision.'"

---

## 4. Implementation Scope & Recommendations

### Implementation Effort

**Adding a new personality requires:**

1. **Update `types.ts`:**
   - Add to `PersonalityType` enum
   - Extend `makeFeedback()` helper

2. **Update `data/personalities.ts`:**
   - Add personality metadata (name, voice, lines)

3. **Update EVERY card (major effort):**
   - Add feedback entry for new personality on each card outcome
   - Current: ~200 entries across 10 roles
   - Post-Phase 05: ~400 entries (100 new cards)
   - **Per personality: ~400 feedback strings to write**

4. **Update tests:**
   - Extend card validation tests
   - Update voice heuristics tests

### Effort Estimate

| Task | Time per Personality |
|------|---------------------|
| Type system updates | 30 min |
| Personality metadata | 1 hour |
| Feedback writing (400 strings) | 4-6 hours |
| Testing & validation | 1-2 hours |
| **Total** | **6-8 hours per personality** |

### Recommended Priority

1. **THE_ANALYST (QUANT)** — HIGH PRIORITY
   - Fills the biggest gap (analytical/data-driven commentary)
   - Strong affinity with Data Scientist role
   - Distinct voice that's immediately recognizable

2. **THE_MENTOR (PROFESSOR)** — MEDIUM PRIORITY
   - Universal appeal across all roles
   - Educational value reinforces K-Maru learning goals
   - Can reuse existing real-world references from cards

3. **THE_PARANOID (WATCHER)** — LOW PRIORITY
   - Niche appeal (surveillance/conspiracy theme)
   - Fits Agentic Engineer well but less universal
   - Consider for Phase 08 (Kobayashi Maru Framing) meta-commentary

### Recommended Implementation Phase

**Phase 13 (Image Asset Pipeline)** or **Phase 08 (Kobayashi Maru Framing)**

- Phase 05 card content must be finalized first
- Adding personalities is content-heavy, not code-heavy
- Aligns with Phase 08's "experimentation sandbox" messaging
- Could be bundled with Phase 13 image assets for complete personality package

### Dependencies

- Phase 05 cards must be finalized (to write feedback for new cards)
- Gemini TTS voices must support the chosen voices (Charon, Fenrir, Aoede)
- Card validation tests must be updated to check for 4-6 personalities instead of 3

---

## Summary

### Death Endings
- ✅ **Keep 6 existing endings** — they work well
- ⚠️ **Consider adding 2-3 technical endings** for IC roles (AGENT_UPRISING, TECHNICAL_DEBT_COLLAPSE, DATA_POISONING)
- **Gap:** Technical IC roles have 1-2 strong fits vs 4-6 for leadership roles

### Personality Archetypes
- ✅ **Current 3 are distinct and well-designed**
- ⚠️ **ROASTER dominates** 6/10 roles, creating imbalance
- ⚠️ **Missing dimensions:** Analytical, historical, paranoid
- **Recommendation:** Add THE_ANALYST (high priority) and THE_MENTOR (medium priority)

### Next Steps
1. Decide on new death endings (optional, deferrable)
2. Prioritize new personalities for Phase 08 or 13
3. When implementing, plan for ~6-8 hours per personality
4. Update card validation tests before adding content

---

*Report generated: 2026-03-22*  
*Phase: 05-expanded-ai-risk-scenarios / Plan 06*
