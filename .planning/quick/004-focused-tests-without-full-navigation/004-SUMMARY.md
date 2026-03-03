---
phase: quick
plan: 004
subsystem: testing
tags: [playwright, testing, performance, navigation]
created: 2026-03-03

dependency_graph:
  requires: []
  provides:
    - navigateToPlayingFast helper function
    - Optimized test patterns for direct navigation
  affects: []
  
tech_stack:
  added: []
  patterns:
    - LocalStorage state injection for bypassing navigation flow
    - Fast navigation with fallback to full navigation

key_files:
  created: []
  modified:
    - tests/helpers/navigation.ts
    - tests/swipe-interactions.spec.ts
    - tests/snap-back.spec.ts
    - playwright.config.ts

decisions: []

metrics:
  duration: ~3 minutes
  completed: 2026-03-03
  tests_passed: 132/132

success: true
---

# Quick Task 004: Focused Tests Without Full Navigation

## Summary

Added Playwright test optimization by introducing direct navigation helper that bypasses the 4-step flow (intro → boot → personality → role).

## Changes Made

### 1. New navigateToPlayingFast Helper
- Uses localStorage state injection to set game state directly to 'playing'
- Bypasses 4-step navigation flow for faster test execution
- Includes fallback to full navigation if fast approach fails

### 2. Test File Updates
- **swipe-interactions.spec.ts**: Refactored to use navigateToPlayingFast, separated CSS/static tests from interaction tests
- **snap-back.spec.ts**: Updated to use navigateToPlayingFast as template

### 3. Playwright Config
- Added contextOptions placeholder for future context reuse

## Verification

All 132 tests pass. The fast navigation works in most cases, falling back to full navigation when needed.

## Notes

- Playwright's `page` fixture cannot be used in `beforeAll` without manual context management
- The main optimization comes from `navigateToPlayingFast` which reduces navigation steps
- Parallel test execution (5 workers) already provides good performance
