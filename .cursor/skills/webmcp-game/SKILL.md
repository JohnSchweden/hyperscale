# WebMCP Game Control Skill

Control the Swipe Risk game programmatically via WebMCP tools registered in the browser.

## Prerequisites

1. Dev server must be running: `bun dev` (http://localhost:3000)
2. Browser must be open to the game page
3. chrome-devtools MCP server must be connected (see `.cursor/mcp.json`)

## How It Works

WebMCP tools are registered in the browser via `navigator.modelContext` (polyfilled by `@mcp-b/global`). The `WebMCPToolsProvider` component in App.tsx registers 10 tools that map directly to game state and actions.

Tools are only active in DEV mode (`import.meta.env.DEV`). They are tree-shaken from production builds.

## Available Tools

| Tool | Input | Stage Guard | What It Does |
|------|-------|-------------|--------------|
| `get_game_state` | none | always | Returns stage, hype/heat/budget stats, role, personality, card index, feedback overlay status |
| `get_current_screen` | none | always | Human-readable description of current screen + next action hint |
| `start_game` | none | INTRO | Advances from intro to personality selection |
| `select_personality` | `{ personality: "ROASTER"\|"ZEN_MASTER"\|"LOVEBOMBER" }` | PERSONALITY_SELECT | Selects AI companion personality |
| `select_role` | `{ role: RoleType }` | ROLE_SELECT | Selects job role (see Role Values below) |
| `swipe_card` | `{ direction: "LEFT"\|"RIGHT" }` | PLAYING + no overlay | Swipes the current card |
| `dismiss_feedback` | none | overlay showing | Closes feedback overlay, advances to next card |
| `answer_boss_question` | `{ answerIndex: 0-3 }` | BOSS_FIGHT + !hasAnswered | Selects answer by index in the shuffled answers array |
| `advance_boss` | none | showExplanation=true | Advances to next boss question |
| `restart_game` | none | always | Full game reset back to intro |

## Role Values

```
CHIEF_SOMETHING_OFFICER, HEAD_OF_SOMETHING, SOMETHING_MANAGER,
TECH_AI_CONSULTANT, DATA_SCIENTIST, SOFTWARE_ARCHITECT,
SOFTWARE_ENGINEER, VIBE_CODER, VIBE_ENGINEER, AGENTIC_ENGINEER
```

## Example Full Playthrough

```
# 1. Check where we are
get_game_state → { stage: "INTRO", ... }
get_current_screen → "Intro screen — click Start to begin"

# 2. Start game
start_game → { success: true, movedTo: "PERSONALITY_SELECT" }

# 3. Select personality
select_personality({ personality: "ROASTER" }) → { success: true }

# 4. Select role
select_role({ role: "VIBE_CODER" }) → { success: true }

# 5. Wait for INITIALIZING to complete (auto-transitions to PLAYING after 3s countdown)
# Poll get_game_state until stage === "PLAYING"

# 6. Play through cards
get_game_state → { stage: "PLAYING", currentCardIndex: 0, hasFeedbackOverlay: false }
swipe_card({ direction: "RIGHT" }) → { success: true, cardIndex: 0 }

# 7. After swipe, feedback overlay appears
get_game_state → { hasFeedbackOverlay: true }
dismiss_feedback() → { success: true }

# 8. Repeat for remaining cards until BOSS_FIGHT stage

# 9. Boss fight
get_game_state → { stage: "BOSS_FIGHT" }
# fixedAnswers is available in the bossFight component — use answerIndex 0-3
answer_boss_question({ answerIndex: 1 }) → { success: true, isCorrect: true/false }
advance_boss() → { success: true }

# 10. Game ends (SUMMARY or GAME_OVER)
```

## Stage Guards — Error Response Pattern

When called from wrong stage, tools return:
```json
{ "success": false, "error": "Wrong stage", "currentStage": "PLAYING" }
```

Always call `get_current_screen` first if unsure what state the game is in.

## When to Use WebMCP vs Other Methods

| Method | Best For |
|--------|----------|
| **WebMCP tools** | Game logic verification, automated playthrough testing, state inspection, AI-driven gameplay |
| **agent-browser** | Quick visual checks, UI element inspection, exploratory testing |
| **playwright-cli** | Precise DOM interaction, screenshots, regression testing |
| **Playwright tests** | Automated CI testing, smoke tests, area tests |

## Implementation Files

- `hooks/useWebMCPTools.ts` — tool definitions and handlers
- `components/dev/WebMCPToolsProvider.tsx` — React component wrapper
- `App.tsx` — mounts provider inside `{import.meta.env.DEV && ...}` block
- `index.tsx` — imports `@mcp-b/global` polyfill in DEV mode

## Troubleshooting

**Tools not appearing in MCP client:**
- Verify dev server is running (`bun dev`)
- Ensure you're on http://localhost:3000 (not production)
- Check browser console for WebMCP errors

**Tool returns `{ success: false, error: "Wrong stage" }`:**
- Call `get_current_screen` to see what stage the game is in
- Follow the stage guard table above

**`answer_boss_question` returns wrong correctness:**
- The tool compares selected answer text against `question.correctAnswer`
- Use `get_game_state` to see current boss fight state
