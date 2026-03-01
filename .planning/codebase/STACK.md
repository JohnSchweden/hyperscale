# SwipeRisk Technology Stack

## Overview

SwipeRisk is a React-based web application built with modern tooling and a lightweight architecture. The stack prioritizes developer experience, fast builds, and minimal runtime dependencies.

---

## Core Framework

### React 19.2.4
- **Version:** ^19.2.4 (latest stable)
- **Usage:** Component-based UI architecture with functional components and hooks
- **Why:** Latest React version with improved performance and concurrent features
- **Key Features Used:**
  - `useState`, `useEffect`, `useRef`, `useCallback` for state management
  - Custom hooks pattern for reusable logic
  - JSX transform via `react-jsx` (no React import needed)

### React DOM 19.2.4
- **Version:** ^19.2.4
- **Usage:** DOM rendering and hydration

### TypeScript 5.8.2
- **Version:** ~5.8.2
- **Configuration:** [`tsconfig.json`](tsconfig.json:1)
- **Why:** Type safety, better IDE support, self-documenting code
- **Key Settings:**
  - `target: "ES2022"` - Modern JavaScript features
  - `module: "ESNext"` - ES modules for tree-shaking
  - `jsx: "react-jsx"` - New JSX transform
  - `moduleResolution: "bundler"` - Vite-compatible resolution
  - `paths: { "@/*": ["./*"] }` - Absolute imports from project root

---

## Build Tools & Bundler

### Vite 6.2.0
- **Version:** ^6.2.0
- **Configuration:** [`vite.config.ts`](vite.config.ts:1)
- **Why:** Extremely fast dev server, optimized production builds, native ESM support
- **Features:**
  - Dev server on port 3000 with host `0.0.0.0`
  - API proxy to localhost:3001 for local development
  - Path aliasing with `@/` pointing to project root
  - Hot Module Replacement (HMR) via `@vitejs/plugin-react`

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
```

### @vitejs/plugin-react 5.0.0
- **Purpose:** Official React plugin for Vite
- **Features:** Fast Refresh, JSX transformation, automatic runtime

---

## Package Manager

### Bun
- **Evidence:** `bun.lock` file, `bunx playwright test` in scripts
- **Why:** Fast installs, native TypeScript support, faster script execution
- **Usage:** 
  - `bun dev` - Start development server
  - `bunx playwright test` - Run test suite

---

## UI Libraries & Styling

### Tailwind CSS (CDN)
- **Source:** `https://cdn.tailwindcss.com`
- **Location:** [`index.html`](index.html:15)
- **Why:** Utility-first CSS without build-step configuration
- **Approach:** All styling done via Tailwind utility classes
- **Key Patterns:**
  - Responsive prefixes (`md:`, `lg:`)
  - State variants (`hover:`, `focus:`)
  - Custom design system via CSS variables

### Font Awesome 6.4.0
- **Source:** CDN (`cdnjs.cloudflare.com`)
- **Usage:** Icon system throughout the UI
- **Examples:** `fa-robot`, `fa-landmark`, `fa-file-invoice-dollar`

### Google Fonts
- **Fonts:** Space Grotesk, JetBrains Mono
- **Usage:** 
  - Space Grotesk: Primary UI font (weights 300-700)
  - JetBrains Mono: Code/terminal-style text
- **Loading:** `display=optional` for performance

### Custom CSS Variables
- **Location:** [`index.html`](index.html:20)
- **Design System Tokens:**
  ```css
  /* Animation Timing */
  --anim-quick: 150ms;    /* Button hovers, micro-interactions */
  --anim-medium: 450ms;   /* Stage transitions, card swipes */
  --anim-slow: 600ms;     /* Emphasis animations */
  
  /* Colors */
  --color-bg-primary: #0a0a0c;
  --color-accent: #22d3ee;
  --color-success: #22c55e;
  --color-danger: #ef4444;
  ```

---

## State Management

### React Hooks (No External Library)
- **Approach:** Built-in React state management
- **Custom Hooks:**
  - [`useGameState`](hooks/useGameState.ts:1) - Central game state logic
  - [`useSwipeGestures`](hooks/useSwipeGestures.ts:1) - Touch/mouse gesture handling
  - [`useVoicePlayback`](hooks/useVoicePlayback.ts:1) - Audio playback management
  - [`useRoast`](hooks/useRoast.ts:1) - AI roast generation
  - [`useBossFight`](hooks/useBossFight.ts:1) - Boss fight mini-game logic
  - [`useStageReady`](hooks/useStageReady.ts:1) - Stage transition timing
  - [`useCountdown`](hooks/useCountdown.ts:1) - Countdown timer
  - [`useClock`](hooks/useClock.ts:1) - Real-time clock display

### State Structure
```typescript
// types.ts
interface GameState {
  hype: number;           // Company hype metric
  heat: number;           // Regulatory heat metric
  budget: number;         // Financial budget
  stage: GameStage;       // Current game stage
  personality: PersonalityType | null;
  role: RoleType | null;
  currentCardIndex: number;
  history: { cardId: string; choice: 'LEFT' | 'RIGHT' }[];
  deathReason: string | null;
  deathType: DeathType | null;
  unlockedEndings: DeathType[];
  bossFightAnswers: boolean[];
}
```

---

## Testing Framework

### Playwright 1.58.2
- **Version:** ^1.58.2 (@playwright/test)
- **Configuration:** [`playwright.config.ts`](playwright.config.ts:1)
- **Why:** Modern E2E testing with automatic waiting, screenshot comparisons, mobile emulation
- **Features:**
  - Parallel test execution
  - Web server auto-start (`bun run dev`)
  - Multiple project configurations:
    - `chromium-desktop`: 1280x720 viewport
    - `chromium-mobile`: Pixel 5 emulation (393x851)
  - Screenshot comparison testing
  - Trace recording on first retry

---

## Runtime Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@google/genai` | ^1.40.0 | Google Gemini AI SDK |
| `react` | ^19.2.4 | UI framework |
| `react-dom` | ^19.2.4 | DOM renderer |

---

## Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@playwright/test` | ^1.58.2 | E2E testing framework |
| `@types/node` | ^22.14.0 | Node.js type definitions |
| `@vercel/node` | ^5.6.9 | Vercel serverless function types |
| `@vitejs/plugin-react` | ^5.0.0 | Vite React plugin |
| `playwright` | ^1.58.2 | Browser automation |
| `typescript` | ~5.8.2 | Type checking |
| `vite` | ^6.2.0 | Build tool & dev server |

---

## Project Structure

```
swiperisk/
├── api/                    # Vercel serverless functions
├── components/             # React components
│   └── game/              # Game-specific components
├── hooks/                  # Custom React hooks
├── services/               # External service integrations
├── tests/                  # Playwright E2E tests
├── unit/                   # Unit tests
├── public/                 # Static assets
│   └── audio/voices/      # Pre-recorded voice files
├── scripts/                # Build/utility scripts
├── types.ts               # TypeScript type definitions
├── constants.ts           # Game constants & data
└── App.tsx                # Root application component
```

---

## Key Architectural Decisions

1. **No State Management Library:** Using React hooks only keeps bundle size small and reduces complexity
2. **CDN-based Styling:** Tailwind via CDN eliminates build-step CSS processing
3. **ES Modules Throughout:** Native ESM with `type: "module"` in package.json
4. **Absolute Imports:** `@/` alias simplifies imports and refactoring
5. **Custom Hooks Pattern:** Business logic extracted into reusable hooks
6. **Vercel Serverless Functions:** API routes in `/api` folder for server-side operations
