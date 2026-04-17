# Phase 27: Mobile UX Fixes — Context

**Gathered:** 2026-04-16
**Status:** Ready for planning
**Source:** User requirements (direct)

<domain>
## Phase Boundary

Fix 8 specific bugs/improvements across mobile UX, audio behavior, button layout, copy text, and UIUX sizing. Most fixes are mobile-only; some apply to both platforms.

</domain>

<decisions>
## Implementation Decisions

### Audio: Default Music Volume
- Mobile: default BGM volume = 15%
- Desktop: default BGM volume = 20%
- Both platforms affected

### Audio: BGM Pause Must Not Mute Voices (MOBILE ONLY)
- When BGM is paused on mobile, voice/TTS audio must still play
- Pausing BGM currently mutes all audio on mobile — this is a bug
- Fix must isolate BGM pause from voice audio pipeline
- Do NOT change desktop behavior

### Debrief Buttons: Height Alignment (MOBILE ONLY)
- Share on LinkedIn button has different height than "Reboot System" and "Copy to Clipboard" buttons
- All three buttons must be same height on mobile
- Do NOT change desktop layout

### LinkedIn Share: Open In-App Instead of New Page (BOTH)
- Share on LinkedIn button currently opens a new browser page
- Should open LinkedIn like the DM button does (in-app / same-tab / correct intent)
- Match DM button behavior exactly

### Copy Game Link: Fix on Mobile (MOBILE ONLY)
- "Copy game link" button on intro page is not working on mobile
- Must be fixed for mobile
- Do NOT change desktop behavior

### Debrief Page 2 Copy Change (BOTH)
- Line: "A complete record of your governance decisions" → remove "governance", change to "A complete record of your decisions"
- Line: "Every decision left a paper trail" → change to "Each one left a paper trail"

### Debrief Pages: Replace Em Dashes (BOTH)
- Replace all "—" (em dash / hmm dashes) in debrief pages with appropriate alternatives
- User wants cleaner punctuation (commas, colons, or restructured sentences)

### UIUX Sizing Audit: Mobile View (MOBILE)
- Following UI/UX best practices, audit ALL pages for design and sizing on mobile
- Check: touch target sizes (min 44px), font readability, spacing, button proportions, overflow/clipping
- Fix any violations found

</decisions>

<specifics>
## Specific Details

- LinkedIn DM button is the reference for how LinkedIn share should open
- Debrief page 2 is specifically mentioned for copy changes (both lines)
- "Hmm dashes" = em dashes (—) throughout debrief pages
- BGM pause/voice isolation bug is mobile-only
- Copy game link button is on the IntroScreen
- Button height issue is on the debrief/end screen (Reboot System + Copy to Clipboard + LinkedIn)

</specifics>

<deferred>
## Deferred Ideas

None — all items are in scope for this phase.

</deferred>

---

*Phase: 27-mobile-ux-fixes*
*Context gathered: 2026-04-16 via user requirements*
