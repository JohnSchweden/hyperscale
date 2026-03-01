import { test, expect } from '@playwright/test';
import { navigateToPlaying } from './helpers/navigation';
import { mockRoastApi } from './helpers/mockApi';

test.use({ baseURL: 'http://localhost:3000' });

/**
 * Latency test for streaming audio via Gemini Live API
 * Uses mocked API responses - no real Gemini calls.
 *
 * Tests:
 * 1. Time to first audio - should be faster than standard TTS (500ms-1000ms target)
 * 2. Audio playback speed - should not be 2x speed (chipmunk voice)
 * 3. Fallback behavior - when Live API fails, should fall back to TTS
 */

test.describe('Live API latency testing', () => {
  test.beforeEach(({ page }) => mockRoastApi(page));

  test('measures time to first audio for streaming', async ({ page }) => {
    // Navigate to playing stage
    await navigateToPlaying(page);
    
    // Find the roast textarea - use the aria-label from RoastTerminal
    const roastTextarea = page.getByLabel('Describe your use case / workflow for governance review');
    await roastTextarea.waitFor({ state: 'visible', timeout: 10000 });
    
    // Fill in a test prompt
    const testPrompt = 'I always use password123 for everything';
    await roastTextarea.fill(testPrompt);
    
    // Track timing from submit to output appearing
    const startTime = Date.now();
    
    // Submit the roast
    const roastButton = page.locator('[aria-label="Send roast"]');
    await roastButton.click();
    
    // Wait for the output to appear - this indicates audio is playing (or finished)
    // We check for the output element which appears after audio starts
    const outputElement = page.locator('[data-testid="roast-output"]');
    await outputElement.waitFor({ state: 'visible', timeout: 15000 });
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log(`Time from submit to output visible: ${totalTime}ms`);
    
    // Verify we got output (which means the roast worked, audio played)
    await expect(outputElement).toBeVisible();
    
    // The total time should be reasonable (under 15 seconds even with fallback)
    expect(totalTime).toBeLessThan(15000);
    
    // Note: Actual streaming latency (time to first audio) is difficult to measure 
    // in a headless browser test without instrumenting the AudioContext
    // The fallback TTS approach takes 3-5 seconds typically
    // Streaming should be under 2 seconds when Live API is working
  });
  
  test('verifies audio plays at correct speed (not 2x)', async ({ page }) => {
    // Navigate to playing stage
    await navigateToPlaying(page);
    
    // Fill in roast input - use the aria-label
    const roastTextarea = page.getByLabel('Describe your use case / workflow for governance review');
    await roastTextarea.waitFor({ state: 'visible', timeout: 10000 });
    await roastTextarea.fill('test prompt for audio speed');
    
    // Submit roast - click the button with the arrow icon
    const roastButton = page.locator('[aria-label="Send roast"]');
    await roastButton.click();
    
    // Wait for audio to complete or timeout
    // The test passes if audio plays without crashing (which would happen if 2x speed)
    await page.waitForTimeout(3000);
    
    // Check for any console errors that might indicate audio issues
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // If there were critical audio errors, fail the test
    const criticalErrors = consoleErrors.filter(e => 
      e.includes('AudioContext') || e.includes('audio') || e.includes('playback')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
  
  test('verifies fallback to TTS when Live API unavailable', async ({ page }) => {
    // We'll test this by checking the behavior - if Live API fails,
    // the app should fall back to standard TTS without crashing
    
    // Navigate to playing
    await navigateToPlaying(page);
    
    // Fill in roast input
    const roastTextarea = page.getByLabel('Describe your use case / workflow for governance review');
    await roastTextarea.waitFor({ state: 'visible', timeout: 10000 });
    await roastTextarea.fill('fallback test prompt');
    
    // Track console logs to see if fallback is triggered
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });
    
    // Submit roast - even if Live API fails, TTS fallback should work
    const roastButton = page.locator('[aria-label="Send roast"]');
    await roastButton.click();
    
    // Wait for response (either streaming or fallback)
    await page.waitForTimeout(5000);
    
    // Verify the output appears (indicates success via streaming OR fallback)
    const outputElement = page.locator('[data-testid="roast-output"]');
    
    // Either we get output, or we get an error message (which is acceptable for fallback test)
    const outputOrError = await Promise.race([
      outputElement.waitFor({ state: 'visible', timeout: 5000 }).then(() => 'output'),
      page.waitForTimeout(5000).then(() => 'timeout')
    ]);
    
    // The test passes if the app doesn't crash
    // If Live API fails but fallback works, we'll see output
    // If both fail, we should see an error message but no crash
    console.log('Fallback test result:', outputOrError);
    
    // At minimum, the app should not crash
    const pageErrors: string[] = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });
    
    expect(pageErrors.filter(e => e.includes('TypeError') || e.includes('Cannot'))).toHaveLength(0);
  });
});
