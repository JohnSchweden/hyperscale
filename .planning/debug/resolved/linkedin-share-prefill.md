---
status: resolved
trigger: "When I try to share my progress on LinkedIn, it opens LinkedIn, opens a new post, attaches the Swipe Risk link, and besides this it doesn't fill any other content textually so it's a blank post just with the link. Check why the data for the pre-filling of the post is not included."
created: 2026-03-16T00:00:00Z
updated: 2026-03-16T00:00:00Z
---

## Current Focus

hypothesis: COMPLETE - Root cause identified
test: N/A - Investigation complete
expecting: N/A
next_action: Provide diagnosis to user

## Symptoms

expected: When sharing to LinkedIn, the post should be pre-filled with text (role, archetype, resilience score) along with the link
actual: LinkedIn opens with only the link attached, no text content pre-filled
errors: None - functionality works but without pre-filled content
reproduction: Complete a game session, reach the debrief page, click "Share to LinkedIn" button
started: User reports this is current behavior (not specified when it started)

## Eliminated

(none yet)

## Evidence

- timestamp: 2026-03-16T00:00:00Z
  checked: grep search for linkedin share code
  found: linkedin-share.ts utility and DebriefPage3Verdict.tsx component
  implication: Need to examine how the share URL is constructed

- timestamp: 2026-03-16T00:00:00Z
  checked: linkedin-share.ts lines 24-26
  found: Comment explicitly states "LinkedIn share-offsite only uses og:title and og:description meta tags, URL parameters are ignored"
  implication: The title and summary URL parameters being added are intentionally not used by LinkedIn

- timestamp: 2026-03-16T00:00:00Z
  checked: index.html static meta tags
  found: Generic og:title="K-Maru" and og:description="AI Kobayashi Maru: A No-Win Simulation for the Brave"
  implication: LinkedIn crawler sees these static tags, not the dynamically updated ones

- timestamp: 2026-03-16T00:00:00Z
  checked: DebriefPage3Verdict.tsx updateMetaTags function
  found: Meta tags are updated client-side via JavaScript AFTER page load
  implication: LinkedIn's crawler does NOT execute JavaScript - it reads static HTML only

## Resolution

root_cause: LinkedIn's share-offsite endpoint does NOT support pre-filling post text via URL parameters. It only fetches Open Graph meta tags from the shared URL. Since this is a client-side SPA, the meta tags in index.html are static/generic. Even though the app updates meta tags dynamically with JavaScript, LinkedIn's crawler does NOT execute JavaScript, so it never sees the personalized content.

fix: Added a "Copy to Clipboard" button that copies the pre-formatted share text to the clipboard. Users can now:
1. Click "1. copy to clipboard" to copy their personalized share text
2. Click "2. Share on LinkedIn" to open LinkedIn
3. Paste the copied text into their LinkedIn post manually

This provides a workaround for LinkedIn's limitation while simplifying the sharing workflow.

verification: 
- Typecheck passes
- Smoke tests pass (47 passed)
- Implementation uses navigator.clipboard API with proper error handling
- Button shows "Copied!" feedback for 2 seconds after successful copy

files_changed:
- components/game/debrief/DebriefPage3Verdict.tsx:
  - Added useState import for copy feedback
  - Added formatShareText import from linkedin-share
  - Added shareText generation using formatShareText
  - Added [copied, setCopied] state for feedback
  - Added handleCopy async function using navigator.clipboard
  - Changed buttons layout: Copy button (left) + LinkedIn button (right)
  - Copy button uses fa-regular fa-copy icon
  - Copy button text: "1. copy to clipboard" (shows "Copied!" when clicked)
  - LinkedIn button text updated: "2. Share on LinkedIn"
