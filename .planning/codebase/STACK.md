# Technology Stack

**Analysis Date:** 2026-03-01

## Languages

**Primary:**
- TypeScript 5.8.2 - All application code (React components, services, types)
- HTML/CSS - `index.html` contains all custom styling with Tailwind CDN

**Secondary:**
- JavaScript - Bundled via Vite, used in importmap for ESM loading

## Runtime

**Environment:**
- Browser-based SPA (Single Page Application)
- Target: Modern browsers (Chrome, Safari, Firefox, Edge)

**Package Manager:**
- Bun 1.x (detected via `bun.lock` and `bun` commands in scripts)
- Lockfile: `bun.lock` present

## Frameworks

**Core:**
- React 19.2.4 - UI framework
  - Loaded via ESM: `https://esm.sh/react@^19.2.4/`
  - React DOM 19.2.4 - DOM rendering

**Testing:**
- Playwright 1.58.2 - E2E testing framework
- Vitest 4.0.18 - Unit testing (dev dependency)
- Config: `playwright.config.ts`

**Build/Dev:**
- Vite 6.2.0 - Build tool and dev server
- @vitejs/plugin-react 5.0.0 - React Fast Refresh

## Key Dependencies

**Critical:**
- `@google/genai` 1.40.0 - Google Gemini AI SDK
  - Used for: Text generation (roast generation), Text-to-Speech
  - Loaded via ESM: `https://esm.sh/@google/genai@^1.40.0`

**Infrastructure:**
- `react` 19.2.4 - Core React library
- `react-dom` 19.2.4 - React DOM renderer
- `@playwright/test` 1.58.2 - Playwright test runner
- `@types/node` 22.14.0 - Node.js type definitions

## CDN Dependencies (Loaded in `index.html`)

**Styling:**
- Tailwind CSS 3.x - via CDN: `https://cdn.tailwindcss.com`
  - Note: Using CDN version, not npm package

**Icons:**
- Font Awesome 6.4.0 - via CDNJS: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`

**Fonts:**
- Google Fonts: Space Grotesk, JetBrains Mono
  - Loaded via: `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk...')`

## Configuration

**Environment:**
- `.env` and `.env.local` - Both files exist with identical content
- `GEMINI_API_KEY` - Required for AI features
- `VITE_ENABLE_SPEECH` - Set to `false` to disable TTS

**Build:**
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- Path alias: `@/*` maps to `./*`

**Key Vite Config Settings:**
```typescript
server: {
  port: 3000,
  host: '0.0.0.0',
}
```

## Platform Requirements

**Development:**
- Bun runtime for package management and scripts
- Node.js compatible (works with npm/yarn as fallback)
- Playwright browsers installed

**Production:**
- Static hosting (builds to `dist/` directory)
- Any web server capable of serving static files
- Requires `GEMINI_API_KEY` environment variable for AI features

## Browser Features Used

- Web Audio API (`AudioContext`) - For TTS playback
- Touch Events - For swipe gesture handling
- CSS Animations - For card transitions and effects
- LocalStorage - Not detected in current code
- Service Workers - Not configured

---

*Stack analysis: 2026-03-01*
