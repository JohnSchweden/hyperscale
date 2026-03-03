---
status: investigating
trigger: "Answer overlay window not centered on mobile screen regardless of top padding"
created: "2026-02-08T00:00:00Z"
updated: "2026-02-08T00:00:00Z"
---

## Current Focus

hypothesis: Root container's CSS transform animation (stage-transition) creates a containing block, breaking the fixed positioning of the overlay
test: Analyzing CSS containing blocks and fixed positioning behavior
expecting: Confirm that transform on ancestor breaks fixed positioning viewport relativity
next_action: Document root cause and provide fix direction

## Symptoms

expected: Answer overlay window centered on mobile screen
actual: "the answer overlay window is on mobile not positioned center on the screen regardless the top padding"
errors: None reported
reproduction: Test 2 in UAT - Answer feedback overlay appears after swiping a card on mobile
started: Discovered during Phase 1 UAT

## Eliminated

## Evidence

- timestamp: "2026-02-08T00:00:00Z"
  checked: App.tsx - Answer overlay implementation (lines 00717-00751)
  found: |
    Overlay uses correct centering technique:
    - fixed inset-0 z-50 (fixed position covering viewport)
    - flex items-center justify-center (flexbox centering)
    - p-4 md:p-6 (responsive padding)
    - Inner container: w-full max-w-lg (constrained width)
  implication: CSS centering technique itself is correct

- timestamp: "2026-02-08T00:00:00Z"
  checked: App.tsx - Root container structure (line 00962-00966)
  found: |
    Root div has stage-transition class:
    ```jsx
    <div className="min-h-[100dvh] overflow-y-auto stage-transition" key={state.stage}>
      {renderStage()}
    </div>
    ```
  implication: Root container has transform animation applied

- timestamp: "2026-02-08T00:00:00Z"
  checked: index.html - stage-transition CSS definition
  found: |
    stage-transition applies transform animation:
    ```css
    .stage-transition {
      animation: fadeSlideIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    
    @keyframes fadeSlideIn {
      from { transform: translateY(20px) scale(0.98); }
      to { transform: translateY(0) scale(1); }  /* Transform persists! */
    }
    ```
  implication: After animation completes, element retains transform: translateY(0) scale(1)

- timestamp: "2026-02-08T00:00:00Z"
  checked: CSS Containing Block specification
  found: |
    According to CSS specs, an element with a transform value other than 'none' 
    establishes a containing block for all positioned descendants including fixed.
    This causes position:fixed to behave like position:absolute relative to the 
    transformed ancestor instead of the viewport.
  implication: The root container's transform breaks the overlay's fixed positioning

- timestamp: "2026-02-08T00:00:00Z"
  checked: LayoutShell component and overflow properties
  found: |
    - LayoutShell on game stage has overflow-hidden class
    - Root container has overflow-y-auto
    - Both overflow properties also create containing blocks
  implication: Multiple containing blocks compound the positioning issue

## Resolution

root_cause: |
  The root container div in App.tsx has a 'stage-transition' class that applies 
  a CSS animation with transform property (translateY + scale). According to CSS 
  specifications, any element with a transform value other than 'none' establishes 
  a containing block for its descendants. This causes the feedback overlay's 
  'position: fixed' to be positioned relative to the transformed root container 
  instead of the viewport, breaking the centering.
  
  Additionally, the root container has 'overflow-y-auto' and LayoutShell has 
  'overflow-hidden', both of which also create containing blocks, further 
  complicating the positioning context.

fix: |
  Solution options:
  1. Move the feedback overlay outside the transformed container using React Portal
  2. Remove the stage-transition animation from the root container
  3. Replace fixed positioning with alternative centering technique that works within containing blocks
  4. Apply the transform animation to a child wrapper instead of the root container

verification: |
  To verify: Remove stage-transition class from root div in App.tsx line 963,
  then test the overlay positioning on mobile. The overlay should center correctly
  when the transform-containing-block is eliminated.

files_changed:
  - App.tsx: Root container (line ~963) has stage-transition class that creates containing block
  - index.html: stage-transition CSS animation defines transform that persists after animation
  - LayoutShell.tsx: overflow-hidden on game stage creates additional containing block
