# Coding Conventions

**Analysis Date:** 2026-04-03

## Naming Patterns

**Files:**
- TypeScript: camelCase for utilities/hooks (`geminiService.ts`, `useCountdown.ts`)
- Components: PascalCase with .tsx extension (`CardStack.tsx`, `GameHUD.tsx`)
- Test files: camelCase with .spec.ts/.spec.tsx (`useCountdown.spec.ts`, `stage-transitions.spec.ts`)

**Functions:**
- camelCase for all functions and methods (`createRadioSession`, `decodeAudioData`)

**Variables:**
- camelCase for constants and variables (`audioContext`, `activeSources`)
- PascalCase for React components (`CardStack`, `GameHUD`)

**Types:**
- PascalCase for interfaces and types (`UseCountdownOptions`, `CardStackProps`)
- camelCase for type aliases and unions

## Code Style

**Formatting:**
- Uses Biome formatter
- Tab indentation (not spaces)
- Double quotes for strings
- Trailing commas in multi-line structures

**Linting:**
- Biome linter with recommended rules enabled
- Import organization enabled (sorts imports automatically)
- VCS integration enabled (respects .gitignore)

## Import Organization

**Order:**
1. Type imports: `import type { PersonalityType } from "../types"`
2. React imports: `import type React from "react"`
3. External library imports: `import { useEffect } from "react"`
4. Internal imports: `import { ROLE_CARDS } from "../../data"`

**Path Aliases:**
- `@/*` maps to project root (configured in tsconfig.json)

## Error Handling

**Patterns:**
- Try-catch blocks with console.error logging
- Early returns for invalid states
- Null checks before operations

## Logging

**Framework:** console (console.error, console.log)

**Patterns:**
- Error logging: `console.error("TTS Error:", error)`
- Debug logging not observed in production code

## Comments

**When to Comment:**
- JSDoc comments on exported functions and hooks
- Interface prop descriptions: `/** Reference to the card container div */`
- Complex logic explanations

**JSDoc/TSDoc:**
- Used for all exported functions
- @param tags for parameters
- @returns tags for return values

## Function Design

**Size:** Functions are kept reasonably sized, complex logic split into helper functions

**Parameters:** Object destructuring for options interfaces (`{ startFrom, onComplete, onExpire, isActive }`)

**Return Values:** Consistent return types, often objects with named properties

## Module Design

**Exports:** Named exports preferred, default exports for main components

**Barrel Files:** Not extensively used, some in data/ directory (`data/index.ts`)

---

*Convention analysis: 2026-04-03*
