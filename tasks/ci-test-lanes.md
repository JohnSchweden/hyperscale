# CI test lane matrix

## Lane definitions

| Lane | Grep | When to run |
|------|------|-------------|
| **smoke** | `@smoke` | Every PR, every push |
| **area** | `@area:*` (or per-area) | On PR; optionally filter by changed files |
| **visual** | `@visual` | When UI-affecting paths change |
| **full** | (none) | PR merge gate; excludes @slow, @api-live |
| **nightly** | (none) | Full + @slow; optional @api-live |

## File-change → lane mapping

Use `bun run test:changed` with `COMMIT_RANGE=main` to run tests for PR changes.

| Changed paths | Lanes to run |
|---------------|--------------|
| `hooks/useGameState*`, `data/*`, `components/*Game*` | smoke, area:gameplay, area:boss |
| `*Card*`, `*swipe*`, `*drag*`, `*animation*` | smoke, area:input |
| `*Layout*`, `*layout*`, `*.css` | smoke, area:layout, visual |
| `*voice*`, `*audio*`, `*roast*` | smoke, area:audio |
| Any | smoke (minimum) |

## CI job examples

```yaml
# PR pipeline (required)
- run: bun run test:smoke

# PR pipeline (conditional visual – when UI files change)
- run: bun run test:visual
  if: changes include **/*.tsx or **/*.css

# Merge gate (full suite, no slow)
- run: bun run test
  # Config already excludes @slow in CI

# Nightly (full + slow)
- run: PLAYWRIGHT_GREP_INVERT=@api-live bun run test -- --grep-invert ''
  # Include @slow, still exclude live API
```

## Playwright config behavior in CI

- `process.env.CI` is set → `grepInvert` excludes @live-api, @api-live, @slow
- For nightly including @slow: override `grepInvert` via env or `--grep-invert` so @slow is not excluded
