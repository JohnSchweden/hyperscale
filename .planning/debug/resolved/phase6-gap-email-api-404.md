# Debug Session: Email API 404 Error

## Problem
Submitting email on Page 3 shows error: "Something went wrong. Try again"
Browser console shows: `POST https://localhost:3000/api/v2-waitlist 404 ()`

## Setup
- API handler: `api/v2-waitlist.ts` (exists, exports default handler)
- Vite plugin: `apiRoutesPlugin()` in `vite.config.ts` (should intercept `/api/*`)
- Client: `hooks/useEmailCapture.ts` calls `fetch("/api/v2-waitlist", ...)`

## Potential Causes

### 1. Middleware Ordering
The plugin uses `server.middlewares.use("/api", ...)` but may be registered after Vite's default handlers.

### 2. Path Matching Issues
URL parsing might fail on edge cases:
- Query strings in URL
- Trailing slashes
- URL encoding

### 3. Handler Import Failure
Dynamic import might fail silently:
- Path resolution issues
- Module loading errors
- TypeScript compilation issues

### 4. Request Body Parsing
POST body might not be parsed correctly before reaching handler.

### 5. Response Not Sent
Handler executes but response isn't properly returned to client.

## Debug Steps

1. Add console logging to plugin:
```typescript
console.log(`[API] Request: ${req.method} ${req.url}`);
console.log(`[API] Route path: ${routePath}`);
console.log(`[API] Handler exists: ${fs.existsSync(handlerPath)}`);
```

2. Test with curl:
```bash
curl -X POST http://localhost:3000/api/v2-waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","role":"TEST","archetype":"TEST","resilience":50,"timestamp":1700000000000}'
```

3. Check server console for logs

## Fix Approaches

### Option A: Fix Existing Plugin
- Add comprehensive logging
- Improve error handling
- Ensure middleware order

### Option B: Simplify Plugin
- Remove dynamic import complexity
- Handle specific routes explicitly
- Use try/catch with detailed errors

### Option C: Alternative Architecture
- Use Vercel CLI for local dev
- Run separate API server
- Use Vite proxy config

## Files
- Fix: `vite.config.ts` (lines 12-115)
- Handler: `api/v2-waitlist.ts`
- Tests: `tests/debrief-email-api.spec.ts`

## Related
- Plan: `.planning/phases/06-debrief-and-replay-system/06-18-PLAN.md`
- UAT: `.planning/phases/06-debrief-and-replay-system/06-UAT.md` (Test 5)
