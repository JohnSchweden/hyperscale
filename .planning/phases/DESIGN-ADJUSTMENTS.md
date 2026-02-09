# Design Adjustments: Clean, Readable, Minimal, Catchy

Modern best-practice tweaks without losing the terminal/game identity.

---

## 1. Reduce visual noise (minimal, readable)

| Current | Change | Why |
|--------|--------|-----|
| CRT overlay on all viewports | **Desktop only** via `@media (min-width: 769px)`; disable on mobile | Less distraction on small screens; already in 03-03 for perf |
| Full scanline animation | **Soften**: lower opacity (e.g. 0.04 max), slower (12s), or remove | Keeps “retro” without dominating |
| Glitch on title hover | Keep but **shorten** (e.g. 0.2s, 2 iterations) or trigger on focus only | Catchy accent, not a seizure |
| `border-radius: 0 !important` on all buttons | Use **one radius**: e.g. `var(--radius-md)` (6px) for buttons, `var(--radius-lg)` for cards | Softer, modern; still sharp enough for “terminal” |

**CSS (index.html):**
- Wrap CRT `body::after` in `@media (min-width: 769px) { ... }`.
- Scanline: reduce cyan alpha to ~0.04–0.06; animation 12s.
- Add to `button`: `border-radius: var(--radius-md);` and remove the `!important` override (or replace with same radius).

---

## 2. Typography (readable, polished)

| Current | Change | Why |
|--------|--------|-----|
| Mixed tiny sizes (8px, 9px, 10px) | **Floor**: no body/UI text below 12px; use 11px only for labels/captions | Readability and accessibility |
| Inconsistent line-height | **Body**: 1.5–1.6; **headings**: 1.2–1.3 | Clear hierarchy, less cramped |
| Space Grotesk + JetBrains Mono | Fix **font-family** in CSS: `'Space Grotesk'` (no `+`); use `font-feature-settings` on mono for tabular figures where relevant | Correct loading; cleaner numbers in HUD |

**CSS:**
```css
body {
  font-family: 'Space Grotesk', sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```
- In App/LayoutShell: bump `text-[10px]` / `text-[9px]` to `text-xs` (12px) for labels; keep mono for “Incident #”, timestamps, etc.
- Headings: add `leading-tight` where missing.

---

## 3. Color and contrast (clean, catchy)

| Current | Change | Why |
|--------|--------|-----|
| Many accent colors (red, green, cyan, yellow, orange) | **Primary accent**: cyan for interactive/positive; **semantic only**: red = danger, green = success; de-emphasize orange/yellow to status (e.g. risk bar only) | One hero color; rest support |
| HUD bars very saturated | Slightly **desaturate** or use opacity variants (e.g. `bg-cyan-500/90`) so they don’t overpower content | Content-first |
| “Catchy” | Keep **one** strong moment: e.g. Boot button hover (cyan) or card hover glow; remove duplicate scale/glow on every CTA | One clear focal point |

**Concrete:**
- Intro: keep cyan on “Boot system” hover; consider one subtle glow on that button only.
- Game Over / Summary: keep red/green for state; avoid extra animate-pulse on text (use only for critical alerts if needed).
- HUD: use same palette but consider `text-slate-400` for labels and reserve cyan/green/red for values and bar fill.

---

## 4. Spacing and rhythm (minimal, polished)

| Current | Change | Why |
|--------|--------|-----|
| Inconsistent padding (p-3, p-4, p-6, p-8, p-10) | **Stick to scale**: e.g. 16px (p-4) default, 24px (p-6) for cards, 32px (p-8) for sections | Predictable rhythm |
| Dense blocks (personality/role copy) | **Increase** paragraph `margin-bottom` and/or `space-y` between blocks | Easier scanning |
| Modal content | Use `space-y-6` (or vars) between sections; max one line of “Governance alert” label | Less cramped |

**App.tsx:**
- Personality/Role: `space-y-4` or `space-y-6` between title, subtitle, grid.
- Feedback overlay: consistent `space-y-6`; single-line “Governance alert” header.

---

## 5. Components (consistent, minimal)

| Area | Change | Why |
|------|--------|-----|
| Cards (personality, role, incident) | **Single radius**: e.g. `rounded-xl` (or `var(--radius-xl)`); consistent border `border-slate-700/80` | Unified surface language |
| Buttons | **One radius** (e.g. 6px); primary = white bg + black text; secondary = border only; same padding scale (e.g. px-6 py-3) | Clear primary vs secondary |
| Progress bars | Keep stripes optional; **reduce** stripe contrast (e.g. white 0.03 opacity) or use solid track | Cleaner HUD |
| Taskbar | Slightly **reduce** icon/badge count or group; same radius as rest | Less busy |

---

## 6. Motion (polished, not flashy)

| Current | Change | Why |
|--------|--------|-----|
| `hover:scale-105` on multiple CTAs | **Reserve for one** primary CTA (e.g. Boot / Reboot / Log off); others use color/opacity only | Clear hierarchy |
| `animate-pulse` on budget/heat/hype | Use only when **critical** (e.g. budget &lt; 2M, heat &gt; 80); remove from stable state | Less distraction |
| Stage transition | Already good (fade + slight scale); keep | — |

---

## 7. Implementation order

1. **Quick wins (index.html + one pass App.tsx)**  
   - CRT desktop-only; scanline softer; button radius; body font + line-height + font-smoothing; floor font sizes to 12px for UI.

2. **Color and motion**  
   - Restrict accent usage; remove duplicate scale/pulse; keep one “hero” hover.

3. **Spacing and components**  
   - Apply spacing scale and single radius to cards/modals.

4. **Optional**  
   - Reduce stripe intensity on HUD; shorten glitch; a11y check contrast on cyan/slate.

---

## Summary

- **Clean/readable:** Less CRT/scanline noise, higher minimum font size, consistent line-height, font-smoothing.
- **Minimal:** One accent (cyan), one radius system, one primary CTA scale, spacing scale.
- **Polished:** Softer scanline, shorter glitch, pulse only when critical, consistent card/button treatment.
- **Catchy:** Keep title glitch (refined), Boot hover, and swipe feedback; avoid spreading “catchy” everywhere.

Result: same personality, less clutter, better readability, one clear focal point per screen.
