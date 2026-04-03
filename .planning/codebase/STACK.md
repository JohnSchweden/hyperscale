# Technology Stack

**Analysis Date:** 2026-04-03

## Languages

**Primary:**
- TypeScript 5.8.2 - React component development, API routes, utilities
- Target: ES2022

**Secondary:**
- JavaScript (as JSX/TSX) - React component syntax

## Runtime

**Environment:**
- Node.js 24.x - Required engine (specified in `package.json`)

**Package Manager:**
- Bun - Primary runtime (used for `dev`, `build`, `test` commands)
- Lockfile: `bun.lock` (148.7K) - Present and committed

## Frameworks

**Core:**
- React 19.2.4 - UI framework for card-swiping game interface
- React DOM 19.2.4 - React rendering target for DOM

**Build & Development:**
- Vite 6.2.0 - Build tool and dev server
  - Config: `vite.config.ts`
  - Dev server: `bun run dev` → localhost:3000
  - Custom API routes plugin for serverless function simulation
- Vite React Plugin (@vitejs/plugin-react 5.0.0) - JSX transformation

**CSS/Styling:**
- Tailwind CSS 4.2.2 - Utility-first CSS framework
  - Entry: `styles.css` with `@import "tailwindcss"` directive
  - No separate `tailwind.config.ts` (using Tailwind v4 defaults)
- @tailwindcss/vite 4.2.2 - Vite plugin for Tailwind compilation
- @tailwindcss/postcss 4.2.2 - PostCSS plugin for Tailwind
- PostCSS 8.5.8 - CSS transformation pipeline
- Autoprefixer 10.4.27 - Browser vendor prefix support

**Testing:**
- Playwright 1.58.2 - E2E browser testing
  - Config: `playwright.config.ts`
  - Runs: `bun run test`
  - Projects: chromium-desktop (1280x720), chromium-mobile (Pixel 5, 393x851)
  - Grep tags: `@smoke`, `@area:*`, `@visual`, `@slow`, `@live-api`
- Vitest 4.0.18 - Unit test runner
  - Config: `vitest.config.ts`
  - Environment: happy-dom
  - Runs: `bun run test:unit`
- @testing-library/react 16.3.2 - React testing utilities
- @testing-library/jest-dom 6.9.1 - DOM assertion library

**Code Quality:**
- Biome 2.4.6 - Linting and formatting (replaces ESLint/Prettier)
  - Config: `biome.json`
  - Runs: `bun run check`, `bun run fix`, `bun run lint`
  - Format: tabs, double quotes in JSX
- TypeScript (tsc) - Type checking
  - Runs: `bun run typecheck`
- Husky 9.1.7 - Git hooks
- Lint-staged 16.3.2 - Pre-commit linting on staged files
  - Targets: `*.{ts,tsx,js,jsx,json}`

**Audio & Media:**
- Sharp 0.34.5 - Image processing (used in scripts)
- ffmpeg-static 5.3.0 - Audio compression utility
- fluent-ffmpeg 2.1.3 - FFmpeg wrapper for audio encoding
- ExcelJS 4.4.0 - Spreadsheet data export/import

**Development Utilities:**
- TSX 4.21.0 - TypeScript executor for scripts
- Zod 3.25.0 - Runtime type validation and schema parsing
- zod-to-json-schema 3.25.1 - Convert Zod schemas to JSON Schema
- Happy DOM 20.8.3 - Lightweight DOM implementation for tests
- JSDOM 28.1.0 - Alternative DOM implementation for tests

## Key Dependencies

**Critical:**

- `@google/generative-ai` 0.24.1 - Google Generative AI SDK for Gemini API
  - Used for TTS (Text-to-Speech) via `gemini-2.5-flash-preview-tts` model
  - Fallback roast generation via `gemini-2.5-flash-lite` or `gemini-2.5-flash`
  - See `services/geminiService.ts`, `api/speak.ts`, `api/roast.ts`

- `@google/genai` 1.40.0 - Google Generative AI TypeScript client
  - Used for Gemini Live API (real-time audio interaction)
  - Streaming audio response via WebSocket with ephemeral token auth
  - See `services/geminiLive.ts`

**Development & WebMCP:**

- `@mcp-b/global` 2.2.0 - Global MCP context registration (dev-only)
- `@mcp-b/react-webmcp` 2.2.0 - React WebMCP integration for dev tools
- Conditionally imported in `index.tsx` (gated by `import.meta.env.DEV`)
- Registers 10 dev tools via `navigator.modelContext`
- See `components/dev/WebMCPToolsProvider.tsx`

**Analytics & Monitoring:**

- `@vercel/analytics` 2.0.1 - Vercel Analytics integration for production usage metrics
  - Client component: `<Analytics />` in `App.tsx`

**Server Runtime:**

- `@vercel/node` 5.6.9 - Vercel serverless function types and utilities
  - Used in API handlers: `api/speak.ts`, `api/roast.ts`, `api/v2-waitlist.ts`
  - Provides `VercelRequest`, `VercelResponse` types

## Configuration

**Environment:**

- Loaded via Vite's custom `.env` file loader in `vite.config.ts` (lines 14-31)
- Frontend: `VITE_*` prefixed variables (exposed to browser via `import.meta.env`)
- Server: `process.env.*` (Vercel serverless functions)
- Files: `.env` (git-ignored), `.env.local` (git-ignored)

**Key Vite Environment Variables:**

- `VITE_GEMINI_API_KEY` - Google Gemini API key for browser-based calls (Live API)
- `VITE_ENABLE_SPEECH` - Feature flag for TTS UI (default: "true", checked in `services/geminiService.ts:37`)
- `VITE_ENABLE_LIVE_API` - Feature flag for Gemini Live API (streaming audio, checked in `services/roastService.ts:8`)
- `VITE_STT_LOW_LATENCY` - Low-latency mode for speech-to-text (checked in `hooks/useLiveAPISpeechRecognition.ts:78`)

**Key Server Environment Variables:**

- `GEMINI_API_KEY` - Google Gemini API key for server-side API calls (checked in `api/speak.ts:13`, `api/roast.ts:28`)
- `RESEND_API_KEY` - Resend email service API key (optional, for v2 waitlist signup emails, checked in `api/v2-waitlist.ts:55`)

**Build Configuration:**

- `vite.config.ts` - Custom Vite config with:
  - React plugin + Tailwind plugin + basic SSL plugin + custom API routes middleware
  - API routes middleware for serverless function simulation in dev (lines 39-181)
  - Path alias: `@/` → project root
  - Dev server: port 3000, host 0.0.0.0, HTTPS with self-signed cert
- `tsconfig.json` - TypeScript compilation:
  - Target: ES2022, Module: ESNext
  - JSX: react-jsx (no React import needed)
  - Path alias: `@/*` → `./`
  - moduleResolution: bundler
  - Exclude: `unit/**/*`, `scripts/**/*`
- `biome.json` - Code formatting & linting:
  - Tabs for indentation, double quotes for JS/TSX
  - Recommended ruleset enabled
  - Git-aware (uses `.gitignore`)
  - Assists with import organization (`organizeImports: "on"`)

## Platform Requirements

**Development:**
- Node.js 24.x
- Bun runtime (for fast builds and testing)
- Modern browser with Web Audio API, WebSocket support
- HTTPS/SSL support in dev (via @vitejs/plugin-basic-ssl)

**Production:**
- Vercel platform (serverless functions in `api/` directory)
- Environment variables injected at build time
- Browser support: Modern browsers with Web Audio API, AudioContext

---

*Stack analysis: 2026-03-28*
