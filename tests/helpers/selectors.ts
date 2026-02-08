/**
 * Centralized selectors for all tests
 * Prioritize data-testid attributes, fallback to stable element selectors
 */
export const SELECTORS = {
  // Card elements
  card: '[data-testid="incident-card"]',
  cardFallback: 'div[style*="z-index: 10"]',
  cardContainer: '[data-testid="card-stack-container"]',

  // Swipe action buttons
  leftButton: '[data-testid="swipe-left-button"]',
  rightButton: '[data-testid="swipe-right-button"]',
  leftButtonFallback: 'button:has-text(/DEBUG|DISABLE|REJECT/i)',
  rightButtonFallback: 'button:has-text(/PASTE|ENABLE|ACCEPT/i)',

  // Navigation buttons
  bootButton: '[data-testid="boot-system-button"]',
  bootButtonFallback: 'button:has-text("Boot system")',
  feedbackDialog: '[data-testid="feedback-dialog"]',
  feedbackDialogFallback: 'role=dialog',

  // Stage selection buttons (by text pattern - functions)
  personalityButton: (name: string) => `button:has-text("${name}")`,
  personalityButtonFallback: (name: string) => `button:has-text("${name}")`,
  roleButton: (name: string) => `button:has-text("${name}")`,
  roleButtonFallback: (name: string) => `button:has-text("${name}")`,

  // Game stage specific buttons
  debugButton: 'button:has-text("Debug")',
  nextTicketButton: 'button:has-text("Next ticket")',
  nextQuestionButton: 'button:has-text("Next question")',
  finalResultButton: 'button:has-text("Final result")',
} as const;
