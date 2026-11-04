import { expect, type Page } from '@playwright/test';

/** Logs all 3 sets of the current exercise. Rest only happens between sets, not after the last one. */
export async function completeThreeSets(page: Page) {
  for (let set = 1; set <= 3; set++) {
    await expect(page.getByTestId('set-counter')).toContainText(`Set ${set} of 3`, { timeout: 5000 });
    await page.getByRole('button', { name: /done.*log set/i }).click();
    if (set < 3) await page.getByTestId('skip-rest').click();
  }
}

/**
 * After an exercise's last set, the app shows a level-up screen, the end-of-workout
 * encouragement card, or goes straight to the next exercise / session complete.
 * Dismisses whichever feedback screen appears.
 */
export async function advancePastFeedback(page: Page) {
  const levelUp = page.getByTestId('level-up-screen');
  const card = page.getByTestId('encouragement-card');
  const nextIntro = page.getByRole('button', { name: /start set 1/i });
  const complete = page.getByTestId('session-complete-screen');
  await expect(levelUp.or(card).or(nextIntro).or(complete)).toBeVisible({ timeout: 8000 });
  if (await levelUp.isVisible()) {
    await page.getByRole('button', { name: /continue/i }).click();
  }
  if (await card.isVisible()) {
    await card.click();
  }
}
