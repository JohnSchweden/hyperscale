---
phase: 25-hos-vera-alignment-roaster-copy-update-incident-fixes-and-audio-regen
plan: 01
subsystem: content
tags: [hos, cards, bug-fix, structural]
dependency-graph:
  requires: []
  provides: [25-02, 25-03, 25-04]
  affects: [src/data/cards/head-of-something.ts]
tech-stack:
  added: []
  patterns: [makeCard arg order correction]
key-files:
  created: []
  modified:
    - src/data/cards/head-of-something.ts
decisions: []
metrics:
  duration: 5
  task-count: 2
  completed: "2026-04-10"
---

# Phase 25 Plan 01: Structural makeCard Arg Fixes — Summary

## Overview

Corrected the `makeCard` argument order for two Head of Something (HOS) cards where the `storyContext` (5th arg) and `text` (6th arg) were swapped, causing the long setup paragraph to display as the card prompt and the short binary question to display as story context.

## Changes Made

### 1. hos_ai_management_elimination

**Before:**
- 5th arg (wrong): "Volunteer to pilot your own replacement or fight the restructuring?"
- 6th arg (wrong): "The CTO's 'AI-First Operations' report concluded..."

**After:**
- 5th arg (correct): "The CTO's 'AI-First Operations' report concluded that AI orchestration tools can replace 60% of middle management coordination tasks. Your entire Head of Something layer is being evaluated for elimination. You can volunteer to lead the pilot — proving AI can do your job — or fight the restructure through HR."
- 6th arg (correct): "Volunteer to pilot your own replacement or fight the restructuring?"

### 2. hos_process_automation_takeover

**Before:**
- 5th arg (wrong): "Honestly document your remaining value-add or inflate your contribution metrics?"
- 6th arg (wrong): "Your team's workflow automation initiative has been so successful..."

**After:**
- 5th arg (correct): "Your team's workflow automation initiative has been so successful that the AI tools now handle all the status updates, sprint planning coordination, and stakeholder reporting you used to manage. The quarterly org review asks: does your role still add value beyond what the tools already do?"
- 6th arg (correct): "Honestly document your remaining value-add or inflate your contribution metrics?"

## Verification

- `bun run typecheck` passed
- `bun run test:data` passed (pre-existing failures unrelated to changes)

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] Both cards have long paragraph as storyContext (5th arg)
- [x] Both cards have short question as text (6th arg)
- [x] No wording changes — only arg positions swapped
- [x] Typecheck passes
- [x] Data tests pass

## Commits

- `fix(25-01): swap makeCard args for hos_ai_management_elimination and hos_process_automation_takeover`
