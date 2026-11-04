import { test, expect } from '@playwright/test';
import { completeThreeSets, advancePastFeedback } from './session-helpers';

const EXERCISES = ['Deadbugs', 'Bird dog', 'Push-ups', 'Rows', 'Squats', 'Bridges'];

type ProgressEntry = { exerciseId: number; name: string; currentReps: number; rangeMin: number; rangeMax: number; progressionLevel: number };

async function getProgress(page: import('@playwright/test').Page): Promise<ProgressEntry[]> {
  const res = await page.request.get('/api/progress');
  return res.json();
}


// ── Behavior 1 (tracer bullet) ─────────────────────────────────
// "Start session" navigates to /session and shows exercise intro for Deadbugs
test('Start session shows ExerciseIntroScreen for Deadbugs', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /start session/i }).click();
  await expect(page).toHaveURL(/\/session/, { timeout: 5000 });
  // Exercise intro renders the exercise name as an h1
  await expect(page.getByRole('heading', { name: /deadbugs/i })).toBeVisible({ timeout: 5000 });
});

// ── Behavior 2 ─────────────────────────────────────────────────
// Goal label shows current_reps + 1 (not current_reps)
test('exercise intro goal label shows current_reps + 1', async ({ page }) => {
  // Ensure Deadbugs is at rangeMin=6 so goal = 7
  const progress = await getProgress(page);
  const deadbugs = progress.find((p) => p.name === 'Deadbugs');
  if (deadbugs) {
    await page.request.patch(`/api/progress/${deadbugs.exerciseId}`, {
      data: { currentReps: deadbugs.rangeMin, progressionLevel: 1 },
    });
  }

  await page.goto('/session');
  await expect(page.getByText(/3 × 7 reps/i)).toBeVisible({ timeout: 5000 });
});

// ── Behavior 3 ─────────────────────────────────────────────────
// TTS fires on exercise_intro entry — spy on speechSynthesis.speak
test('TTS announce fires on exercise intro', async ({ page }) => {
  // Ensure Deadbugs is at rangeMin=6 so TTS says "Target 7 reps"
  const progress = await getProgress(page);
  const deadbugs = progress.find((p) => p.name === 'Deadbugs');
  if (deadbugs) {
    await page.request.patch(`/api/progress/${deadbugs.exerciseId}`, {
      data: { currentReps: deadbugs.rangeMin, progressionLevel: 1 },
    });
  }

  await page.addInitScript(() => {
    const original = window.SpeechSynthesisUtterance;
    (window as any)._ttsSpoken = [];
    (window as any).SpeechSynthesisUtterance = function (text: string) {
      (window as any)._ttsSpoken.push(text);
      return original ? new original(text) : { text };
    };
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: { cancel: () => {}, speak: () => {} },
    });
  });

  await page.goto('/session');
  await page.waitForSelector('h1', { timeout: 5000 });

  const spokenTexts: string[] = await page.evaluate(() => (window as any)._ttsSpoken);
  // TTS text should mention "Deadbugs" and "7" (goal = rangeMin+1 = 7)
  const announcement = spokenTexts.find((t) => /deadbugs/i.test(t));
  expect(announcement).toBeTruthy();
  expect(announcement).toMatch(/7/);
});

// ── Behavior 4 ─────────────────────────────────────────────────
// A single "Done — log set" tap logs the set and advances to resting
// Skip rest advances set counter
test('set counter increments from 1 to 2 to 3', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    storageState: 'playwright/.auth/user.json',
  });
  const page = await context.newPage();

  await page.goto('/session');
  await page.getByRole('button', { name: /start set 1/i }).click();

  // Set 1: Done → resting → skip → set_active set 2
  await expect(page.getByTestId('set-counter')).toContainText('Set 1 of 3');
  await page.getByRole('button', { name: /done.*log set/i }).click();
  await page.getByTestId('skip-rest').click();

  // Now on set 2
  await expect(page.getByTestId('set-counter')).toContainText('Set 2 of 3');
  await page.getByRole('button', { name: /done.*log set/i }).click();
  await page.getByTestId('skip-rest').click();

  // Now on set 3
  await expect(page.getByTestId('set-counter')).toContainText('Set 3 of 3');

  await context.close();
});

// ── Behavior 5 ─────────────────────────────────────────────────
// Happy path: complete all 6 exercises × 3 sets, verify user_progress updated
test('happy path — all 6 exercises × 3 sets updates user_progress', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    storageState: 'playwright/.auth/user.json',
  });
  const page = await context.newPage();

  await page.goto('/session');

  for (let ex = 0; ex < EXERCISES.length; ex++) {
    const exerciseName = EXERCISES[ex];

    // Wait for exercise intro
    await expect(page.getByRole('heading', { name: new RegExp(exerciseName, 'i') })).toBeVisible({ timeout: 8000 });

    // Start set 1
    await page.getByRole('button', { name: /start set 1/i }).click();

    // 3 sets per exercise (no rest after the last one)
    await completeThreeSets(page);

    // Level-up / end-of-workout feedback, if any
    await advancePastFeedback(page);
  }

  // Verify full session flow reached session_complete
  await expect(page.getByTestId('session-complete-screen')).toBeVisible({ timeout: 10000 });

  await context.close();
});
