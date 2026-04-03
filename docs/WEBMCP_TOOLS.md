# WebMCP Tools Reference

Programmatic game control tools registered via `navigator.modelContext` in the K-Maru (Swipe Risk) game.

## Overview

WebMCP tools are 10 dev-only functions registered in the browser that allow AI agents and scripts to control the game state machine directly, without DOM interaction. They are registered by the `WebMCPToolsProvider` component using `@mcp-b/react-webmcp` and polyfilled by `@mcp-b/global`.

**Key properties:**
- Only active in DEV mode (`import.meta.env.DEV`) — tree-shaken from production
- Registered via `navigator.modelContext.executeTool(toolName, args)`
- Map directly to game state machine actions, bypassing the UI layer
- All tools return `{ success: boolean, ... }` responses

**When to use WebMCP:**
- Game logic verification (stage transitions, stat changes, death vectors)
- Automated playthrough testing
- State inspection without parsing DOM
- AI-driven gameplay automation

**When NOT to use WebMCP:**
- Visual/layout verification (use `agent-browser` or `playwright-cli`)
- CSS rendering checks
- Regression testing that requires screenshots

## Prerequisites

1. Dev server running: `bun run dev` (http://localhost:3000)
2. Browser open to the game page
3. chrome-devtools MCP server connected (see `.cursor/mcp.json`)

## Game State Reference

### Game Stages

| Stage | Description |
|-------|-------------|
| `INTRO` | Landing screen, before game starts |
| `PERSONALITY_SELECT` | Choose AI companion personality |
| `ROLE_SELECT` | Choose player job role |
| `INITIALIZING` | 3-second countdown before gameplay |
| `PLAYING` | Card swipe phase |
| `BOSS_FIGHT` | Final quiz confrontation |
| `DEBRIEF_PAGE_1` | Outcome summary (win or death) |
| `DEBRIEF_PAGE_2` | Debrief page 2 |
| `DEBRIEF_PAGE_3` | Debrief page 3 |

### Personality Types

`ROASTER`, `ZEN_MASTER`, `LOVEBOMBER`

### Role Types

`CHIEF_SOMETHING_OFFICER`, `HEAD_OF_SOMETHING`, `SOMETHING_MANAGER`, `TECH_AI_CONSULTANT`, `DATA_SCIENTIST`, `SOFTWARE_ARCHITECT`, `SOFTWARE_ENGINEER`, `VIBE_CODER`, `VIBE_ENGINEER`, `AGENTIC_ENGINEER`

### Death Types

`BANKRUPT`, `REPLACED_BY_SCRIPT`, `CONGRESS`, `FLED_COUNTRY`, `PRISON`, `AUDIT_FAILURE`, `KIRK`

## Tool Reference

### Quick Summary

| Tool | Params | Stage Guard | Purpose |
|------|--------|-------------|---------|
| `get_game_state` | none | always | Full game state dump |
| `get_current_screen` | none | always | Human-readable screen description |
| `start_game` | none | `INTRO` | Begin game from intro |
| `select_personality` | `{ personality }` | `PERSONALITY_SELECT` | Choose AI personality |
| `select_role` | `{ role }` | `ROLE_SELECT` | Choose job role |
| `swipe_card` | `{ direction }` | `PLAYING` + no overlay | Swipe card left/right |
| `dismiss_feedback` | none | overlay showing | Close feedback overlay |
| `answer_boss_question` | `{ answerIndex }` | `BOSS_FIGHT` + !hasAnswered | Answer boss quiz |
| `advance_boss` | none | `BOSS_FIGHT` + showExplanation | Next boss question |
| `restart_game` | none | always | Full reset to intro |

---

### `get_game_state`

Returns the complete current game state including stats, stage, and overlay status.

**Parameters:** None

**Returns:**
```typescript
{
  success: true;
  stage: GameStage;
  hype: number;
  heat: number;
  budget: number;
  role: RoleType | null;
  personality: PersonalityType | null;
  currentCardIndex: number;
  deathReason: string | null;
  deathType: DeathType | null;
  bossFightAnswers: boolean[];
  hasFeedbackOverlay: boolean;
  feedbackAuthoringStem: string | null;
}
```

**Usage:**
```javascript
const state = await callWebMCPTool("get_game_state");
// { success: true, stage: "PLAYING", hype: 42, heat: 15, budget: 8000, ... }
```

**When to use:** Poll this to check game progress, verify state transitions, inspect death vectors, or determine what action to take next. Call before any action tool if unsure of current state.

---

### `get_current_screen`

Returns a human-readable description of the current screen with actionable hints.

**Parameters:** None

**Returns:**
```typescript
{
  success: true;
  screen: string;    // e.g. "Playing — swipe cards left or right"
  stage: GameStage;
}
```

**Usage:**
```javascript
const screen = await callWebMCPTool("get_current_screen");
// { success: true, screen: "Intro screen — click Start to begin", stage: "INTRO" }
```

**When to use:** Quick orientation check. Prefer this over `get_game_state` when you only need to know "what screen am I on and what should I do next." Includes context-aware hints like "feedback overlay is showing (use dismiss_feedback)".

---

### `start_game`

Advances the game from the intro screen to personality selection.

**Parameters:** None

**Returns:**
```typescript
{ success: true; movedTo: "PERSONALITY_SELECT" }
// or on wrong stage:
{ success: false; error: "Wrong stage"; currentStage: GameStage }
```

**Usage:**
```javascript
const result = await callWebMCPTool("start_game");
// { success: true, movedTo: "PERSONALITY_SELECT" }
```

**When to use:** Only when `stage === "INTRO"`. This is the first action in any game flow.

---

### `select_personality`

Selects the AI companion personality that provides feedback during gameplay.

**Parameters:**
```typescript
{
  personality: "ROASTER" | "ZEN_MASTER" | "LOVEBOMBER"
}
```

**Returns:**
```typescript
{ success: true; selected: string }
// or on wrong stage:
{ success: false; error: "Wrong stage"; currentStage: GameStage }
```

**Usage:**
```javascript
const result = await callWebMCPTool("select_personality", {
  personality: "ROASTER"
});
// { success: true, selected: "ROASTER" }
```

**When to use:** Only when `stage === "PERSONALITY_SELECT"`. Required before role selection.

---

### `select_role`

Selects the player's job role, which affects stat fine tiers.

**Parameters:**
```typescript
{
  role: RoleType  // see Role Types table above
}
```

**Returns:**
```typescript
{ success: true; selected: string }
// or on wrong stage:
{ success: false; error: "Wrong stage"; currentStage: GameStage }
```

**Usage:**
```javascript
const result = await callWebMCPTool("select_role", {
  role: "VIBE_CODER"
});
// { success: true, selected: "VIBE_CODER" }
```

**When to use:** Only when `stage === "ROLE_SELECT"`. After selection, the game auto-transitions through `INITIALIZING` (3s countdown) to `PLAYING`.

---

### `swipe_card`

Swipes the current incident card left (reject) or right (approve).

**Parameters:**
```typescript
{
  direction: "LEFT" | "RIGHT"
}
```

**Returns:**
```typescript
{ success: true; direction: string; cardIndex: number }
// or on wrong stage:
{ success: false; error: "Wrong stage"; currentStage: GameStage }
// or if overlay showing:
{ success: false; error: "Feedback overlay is showing — use dismiss_feedback first" }
```

**Usage:**
```javascript
const result = await callWebMCPTool("swipe_card", {
  direction: "RIGHT"
});
// { success: true, direction: "RIGHT", cardIndex: 0 }
```

**When to use:** Only when `stage === "PLAYING"` and `hasFeedbackOverlay === false`. After swiping, a feedback overlay appears — call `dismiss_feedback` to advance to the next card.

---

### `dismiss_feedback`

Closes the feedback overlay that appears after swiping a card and advances to the next card.

**Parameters:** None

**Returns:**
```typescript
{ success: true }
// or if no overlay:
{ success: false; error: "No feedback overlay is currently showing" }
```

**Usage:**
```javascript
const result = await callWebMCPTool("dismiss_feedback");
// { success: true }
```

**When to use:** After each `swipe_card`, when `hasFeedbackOverlay === true`. This is required to progress through the card deck.

---

### `answer_boss_question`

Selects an answer during the boss fight quiz phase.

**Parameters:**
```typescript
{
  answerIndex: number  // 0-3, index into the displayed answers array
}
```

**Returns:**
```typescript
{
  success: true;
  selectedAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
}
// or on wrong stage:
{ success: false; error: "Wrong stage"; currentStage: GameStage }
// or if already answered:
{ success: false; error: "Already answered — use advance_boss to go to the next question" }
// or invalid index:
{ success: false; error: "Invalid answer index X. Valid range: 0-3" }
```

**Usage:**
```javascript
const result = await callWebMCPTool("answer_boss_question", {
  answerIndex: 1
});
// { success: true, selectedAnswer: "Ship it Friday", isCorrect: true, correctAnswer: "Ship it Friday" }
```

**When to use:** Only when `stage === "BOSS_FIGHT"` and `hasAnswered === false`. Call `get_game_state` first to see the current question and available answers. The `answerIndex` corresponds to the displayed answer order, not the correct answer. After answering, an explanation appears.

---

### `advance_boss`

Advances to the next boss fight question after reading the explanation.

**Parameters:** None

**Returns:**
```typescript
{ success: true }
// or on wrong stage:
{ success: false; error: "Wrong stage"; currentStage: GameStage }
// or if explanation not showing:
{ success: false; error: "Explanation is not showing — answer the question first" }
```

**Usage:**
```javascript
const result = await callWebMCPTool("advance_boss");
// { success: true }
```

**When to use:** Only when `stage === "BOSS_FIGHT"` and `showExplanation === true`. Call after `answer_boss_question` to move to the next question.

---

### `restart_game`

Performs a full game reset, returning to the intro screen.

**Parameters:** None

**Returns:**
```typescript
{ success: true; movedTo: "INTRO" }
```

**Usage:**
```javascript
const result = await callWebMCPTool("restart_game");
// { success: true, movedTo: "INTRO" }
```

**When to use:** At any point to reset the game to its initial state. No stage guards — always available.

## Usage Patterns

### Full Game Playthrough

```
# 1. Check starting state
get_game_state → { stage: "INTRO", ... }

# 2. Start the game
start_game → { success: true, movedTo: "PERSONALITY_SELECT" }

# 3. Select personality
select_personality({ personality: "ROASTER" }) → { success: true }

# 4. Select role
select_role({ role: "VIBE_CODER" }) → { success: true }

# 5. Wait for INITIALIZING → PLAYING (auto-transitions after 3s)
# Poll get_game_state until stage === "PLAYING"

# 6. Play through cards (repeat for each card)
get_game_state → { stage: "PLAYING", hasFeedbackOverlay: false }
swipe_card({ direction: "RIGHT" }) → { success: true }
get_game_state → { hasFeedbackOverlay: true }
dismiss_feedback() → { success: true }

# 7. Boss fight (repeat for each question)
get_game_state → { stage: "BOSS_FIGHT" }
answer_boss_question({ answerIndex: 1 }) → { success: true, isCorrect: true }
advance_boss() → { success: true }

# 8. Game ends at DEBRIEF_PAGE_1
```

### Card Loop with State Polling

```javascript
for (let i = 0; i < 10; i++) {
  const state = await callWebMCPTool("get_game_state");

  if (state.stage !== "PLAYING") {
    console.log(`Game ended at card ${i}: ${state.stage}`);
    break;
  }

  if (state.hasFeedbackOverlay) {
    await callWebMCPTool("dismiss_feedback");
    continue;
  }

  const direction = i % 2 === 0 ? "RIGHT" : "LEFT";
  await callWebMCPTool("swipe_card", { direction });
}
```

### Boss Fight Loop

```javascript
while (true) {
  const state = await callWebMCPTool("get_game_state");

  if (state.stage !== "BOSS_FIGHT") break;

  if (!state.hasFeedbackOverlay) {
    // Question is available — answer it
    await callWebMCPTool("answer_boss_question", { answerIndex: 0 });
  } else {
    // Explanation/feedback showing — dismiss and advance
    await callWebMCPTool("dismiss_feedback");
    await callWebMCPTool("advance_boss");
  }
}
```

### State Inspection for Debugging

```javascript
const state = await callWebMCPTool("get_game_state");
console.log("Stats:", { hype: state.hype, heat: state.heat, budget: state.budget });
console.log("Death vectors:", state.deathVectorMap);
console.log("Boss answers:", state.bossFightAnswers);
console.log("Cards played:", state.currentCardIndex);
```

## WebMCP vs DOM Tools

| Scenario | Use | Why |
|----------|-----|-----|
| Verify stage transition | WebMCP | Direct state access, no DOM parsing |
| Check stat values (hype/heat/budget) | WebMCP | Exact numeric values |
| Verify death vector accumulation | WebMCP | Internal state not visible in DOM |
| Check button visibility | `agent-browser` | Visual rendering concern |
| Verify CSS layout | `playwright-cli` | DOM/styling concern |
| Take regression screenshots | `playwright-cli` | Visual comparison |
| Automated CI tests | Playwright `.spec.ts` | CI integration |
| Quick exploratory check | `agent-browser` | Fast interactive inspection |

**Rule of thumb:** Use WebMCP for game logic, DOM tools for visual presentation.

## Calling WebMCP from Scripts

### From Playwright (Node.js)

```javascript
async function callWebMCPTool(page, toolName, args = {}) {
  return await page.evaluate(
    async ({ tool, args }) => {
      const result = await window.navigator.modelContext.executeTool(tool, args);
      return JSON.parse(result.content[0].text);
    },
    { tool: toolName, args }
  );
}

// Usage
const state = await callWebMCPTool(page, "get_game_state");
await callWebMCPTool(page, "swipe_card", { direction: "RIGHT" });
```

### From chrome-devtools-mcp (AI agent)

Tools are automatically available when the MCP server is connected to a browser with the dev server running. Call them directly by name through the MCP client.

## Error Handling

All tools follow a consistent error pattern:

```typescript
// Success
{ success: true, ...data }

// Stage guard failure
{ success: false, error: "Wrong stage", currentStage: GameStage }

// State-specific failure
{ success: false, error: "descriptive message" }
```

**Common errors:**

| Error | Cause | Fix |
|-------|-------|-----|
| `"Wrong stage"` | Tool called from incompatible game stage | Call `get_current_screen` to check state |
| `"Feedback overlay is showing"` | Tried to swipe while overlay visible | Call `dismiss_feedback` first |
| `"No feedback overlay is currently showing"` | Tried to dismiss when no overlay exists | Check `hasFeedbackOverlay` via `get_game_state` |
| `"Already answered"` | Tried to answer boss question twice | Call `advance_boss` instead |
| `"Explanation is not showing"` | Tried to advance before answering | Call `answer_boss_question` first |
| `"Invalid answer index"` | Index out of range for current question | Use 0-based index matching displayed answers |

## Implementation Files

| File | Purpose |
|------|---------|
| `hooks/useWebMCPTools.ts` | Tool definitions and handlers |
| `components/dev/WebMCPToolsProvider.tsx` | React component wrapper |
| `App.tsx` | Mounts provider in DEV block |
| `index.tsx` | Imports `@mcp-b/global` polyfill |
| `test-phase16-webmcp.mjs` | Playwright-based verification script |

## Troubleshooting

**Tools not appearing in MCP client:**
- Verify dev server is running (`bun dev`)
- Ensure you are on http://localhost:3000 (not production)
- Check browser console for WebMCP errors
- Confirm `import.meta.env.DEV` is true

**Tool returns `{ success: false, error: "Wrong stage" }`:**
- Call `get_current_screen` to see what stage the game is in
- Follow the stage guard table in the tool reference above

**`answer_boss_question` returns unexpected correctness:**
- The tool compares selected answer text against `question.correctAnswer`
- Use `get_game_state` to inspect current boss fight state and available answers

**Game stuck in `INITIALIZING` stage:**
- This is expected — it auto-transitions to `PLAYING` after a 3-second countdown
- Poll `get_game_state` until `stage === "PLAYING"`
