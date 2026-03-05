---
name: typescript-lint-format
description: Run TypeScript type checking, linting, and formatting in this repo. Use when verifying code after changes, before committing, or when the user asks to typecheck, lint, or format. Always use Bun (bun run / bunx) for scripts in this project.
---

# TypeScript, Lint & Format (Bun)

This project uses **Bun** as the package manager and runtime. Use `bun run <script>` and `bunx` for all tooling; do not use npm/npx unless a package requires it.

## Commands (run from repo root)

| Purpose      | Command               |
|-------------|------------------------|
| Type check  | `bun run typecheck`   |
| Lint        | `bun run lint`        |
| Lint + fix  | `bun run lint:fix`    |
| Format      | `bun run format`      |
| Format check| `bun run format:check`|
| Check all   | `bun run check`       |
| Fix all     | `bun run fix`         |

## When to run

- **After making code changes**: Run typecheck and lint before marking a task complete.
- **Before committing**: Run typecheck, lint, and format (or rely on pre-commit hook if configured).
- **When tests fail**: If failures look like type or style issues, run typecheck and lint and fix reported errors.

## Fix workflow

1. `bun run typecheck` — fix any reported type errors.
2. `bun run fix` — Biome: format, lint fix, organize imports (or `bun run lint:fix` then `bun run format`).
3. Re-run `bun run typecheck` and `bun run check` to confirm clean.

Lint and format are provided by **Biome** (`biome.json`). Do not add ESLint or Prettier.
