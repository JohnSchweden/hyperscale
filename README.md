<div align="center">
<img width="1200" height="475" alt="Swipe Risk: The Hyperscale Chronicles" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Swipe Risk: The Hyperscale Chronicles

An AI-powered compliance and cybersecurity education game built with React, TypeScript, and Google's Gemini AI. Swipe through ethical dilemmas, manage your corporate reputation, and try to survive the startup chaos without ending up in prison, Congress, or worse.

## 🎮 What is This?

**Swipe Risk** is a swipe-based decision game (inspired by Reigns/Tinder mechanics) where you play as an executive at a hyperscale tech company. You'll face realistic AI ethics and cybersecurity scenarios drawn from real-world tech controversies.

### Key Features

- **Swipe-Based Gameplay** - Swipe left or right to make decisions on ethical dilemmas
- **AI Voice Commentary** - Your chosen AI personality provides sarcastic, zen, or hype-filled commentary via Gemini TTS
- **Multiple Playable Roles** - Choose from Development, Marketing, Management, HR, Finance, or Cleaning
- **3 AI Personalities** - Each with unique voices (V.E.R.A. the Roaster, Bamboo the Zen Master, HYPE-BRO the Lovebomber)
- **6 Different Endings** - Go bankrupt, flee the country, testify before Congress, and more
- **Boss Fight Quiz** - Test your knowledge with AI safety and compliance questions
- **Responsive Design** - Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Bun](https://bun.sh/) (recommended) or npm
- A [Google Gemini API key](https://ai.google.dev/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd swipe-risk-the-hyperscale-chronicles
   ```

2. **Install dependencies:**
   ```bash
   bun install
   # or: npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your GEMINI_API_KEY
   ```

4. **Run the development server:**
   ```bash
   bun run dev
   # or: npm run dev
   ```

5. **Open your browser:** Navigate to `http://localhost:3000`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |
| `VITE_ENABLE_SPEECH` | Set to `false` to disable TTS | No |

## 🎯 How to Play

1. **Choose Your Personality** - Select an AI companion who will comment on your choices
2. **Select Your Role** - Each department faces different ethical dilemmas
3. **Swipe Through Scenarios** - Left or right to make decisions
4. **Manage Your Stats** - Balance **Hype** (reputation), **Heat** (legal risk), and **Budget** (money)
5. **Survive or Face the Consequences** - Too much heat or no money = game over
6. **Beat the Boss Fight** - Answer AI safety questions to unlock the final ending

### Game Stats

| Stat | Description | Danger Zone |
|------|-------------|-------------|
| **Hype** | Company reputation and viral momentum | Below 10 = Risk of being replaced by a script |
| **Heat** | Legal and regulatory attention | Above 100 = Investigation/game over |
| **Budget** | Available funds | Zero = Bankruptcy |

### Endings

The game features multiple endings based on your choices:

- 💸 **Liquidated** - Ran out of money
- 🤖 **Replaced by Script** - Low hype + high heat
- 🏛️ **Testifying Before Congress** - Marketing role disaster
- ✈️ **Fled the Country** - Management role meltdown
- 🔒 **Federal Prison** - Finance role catastrophe
- 📊 **Audit Catastrophe** - General compliance failure

## 🏗️ Project Structure

```
├── components/          # React components
│   └── LayoutShell.tsx  # Responsive layout wrapper
├── services/            # External service integrations
│   └── geminiService.ts # Gemini AI TTS service
├── tests/               # Playwright E2E tests
│   ├── helpers/         # Test utilities
│   └── *.spec.ts        # Test files
├── .cursor/             # Agent-specific documentation
│   ├── references/      # Workflow references
│   └── skills/          # Agent skill documentation
├── App.tsx              # Main application component
├── constants.ts         # Game data (cards, personalities, questions)
├── types.ts             # TypeScript type definitions
└── README.md            # This file
```

## 🧪 Testing

This project uses [Playwright](https://playwright.dev/) for end-to-end testing.

```bash
# Run all tests
bun run test
# or: bunx playwright test

# Run specific test file
bunx playwright test tests/swipe-interactions.spec.ts

# Run with UI mode for debugging
bunx playwright test --ui

# Run against mobile viewport
bunx playwright test --project=chromium-mobile
```

### Test Coverage

- **Stage Snapshots** - Visual regression tests for all game stages
- **Swipe Interactions** - Touch/drag gesture handling
- **Button Highlighting** - UI state verification
- **Exit Animations** - Card transition animations
- **Mobile Responsiveness** - Viewport adaptation

See [TESTING.md](TESTING.md) for detailed testing documentation.

## 🏛️ Architecture

The application follows a React + TypeScript architecture with:

- **State Management** - React useReducer for game state
- **Audio** - Web Audio API with Gemini 2.5 Flash TTS
- **Styling** - Tailwind CSS with custom animations
- **Testing** - Playwright for E2E and visual regression

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed technical documentation.

## 🎨 Game Design

See [GAME_DESIGN.md](GAME_DESIGN.md) for:
- Card scenario design principles
- Stat balancing
- Personality writing guidelines
- Boss fight question design

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development workflow
- Code style guidelines
- Adding new cards/scenarios
- Testing requirements

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical architecture and design decisions |
| [GAME_DESIGN.md](GAME_DESIGN.md) | Game mechanics and content design |
| [TESTING.md](TESTING.md) | Testing strategy and guidelines |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [API.md](API.md) | API documentation for services and components |

## 🔒 License

[Add your license information here]

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/), [React](https://react.dev/), and [TypeScript](https://www.typescriptlang.org/)
- AI voice powered by [Google Gemini](https://ai.google.dev/)
- Testing with [Playwright](https://playwright.dev/)

---

**⚠️ Content Warning:** This game contains satirical depictions of corporate tech culture, mild profanity, and dark humor about regulatory compliance and AI ethics.
