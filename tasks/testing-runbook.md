# Testing runbook

When to run which tests. See [test-lane-taxonomy.md](test-lane-taxonomy.md) for tag mapping.

## Commands

| Command | What it runs |
|--------|--------------|
| `bun run test:smoke` | @smoke only (~6 specs, fast) |
| `bun run test:visual` | @visual (stage snapshots) |
| `bun run test:slow` | @slow (excluded from CI gate) |
| `bun run test:area:gameplay` | @area:gameplay |
| `bun run test:area:input` | @area:input |
| `bun run test:area:layout` | @area:layout |
| `bun run test:area:boss` | @area:boss |
| `bun run test:area:audio` | @area:audio |
| `bun run test:changed` | Tests for changed files (or smoke if none) |
| `bun run test` | Full suite (excludes @live-api, @api-live; excludes @slow in CI) |

## When to run what

| Phase | Command |
|-------|---------|
| **During coding** | `test:area:<domain>` + `test:smoke` if touching critical path |
| **Before push** | `test:smoke` + impacted areas; add `test:visual` if UI changed |
| **Pre-merge CI** | Full suite (default `test`) – excludes @slow and @api-live |
| **Nightly** | Full + @slow; optionally `test:live-api` for live API |

## Env-driven runs

- `PLAYWRIGHT_GREP=@smoke bun run test` – run only smoke
- `PLAYWRIGHT_GREP_INVERT= bun run test` – clear invert (e.g. include @slow)
- `COMMIT_RANGE=main bun run test:changed` – diff vs main for PR scope

## Runtime budgets (measured)

- Smoke: ~15–20s (46 tests)
- area:input: ~10s (20 tests)
- Single area: ~5–15s (varies by area)
- Visual: ~30–40s (12 snapshot tests)
- Full (no slow, no api-live): ~30s (88 tests)
