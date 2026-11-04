import { test, expect } from '@playwright/test';
import { completeThreeSets } from './session-helpers';

// All tests modify the same test-user DB row — run serially to avoid races.
test.describe.configure({ mode: 'serial' });

async function setDeadbugsReps(page: import('@playwright/test').Page, currentReps: number, progressionLevel = 1) {
  const res = await page.request.get('/api/progress');
  const progress: { name: string; exerciseId: number; rangeMax: number; rangeMin: number }[] = await res.json();
  const deadbugs = progress.find((p) => p.name === 'Deadbugs');
  if (!deadbugs) throw new Error('Deadbugs not found in progress');
  await page.request.patch(`/api/progress/${deadbugs.exerciseId}`, {
    data: { currentReps, progressionLevel },
  });
  return deadbugs;
}

// ── Behavior 1 (tracer bullet) ─────────────────────────────────
// After 3 sets all hitting rangeMax, the level-up screen appears
test('level-up screen appears when 3 sets hit range max', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    storageState: 'playwright/.auth/user.json',
  });
  const page = await context.newPage();

  const deadbugs = await setDeadbugsReps(page, 9); // rangeMax=10, so currentReps=9

  await page.goto('/session');
  await expect(page.getByRole('heading', { name: /deadbugs/i })).toBeVisible({ timeout: 5000 });
  await page.getByRole('button', { name: /start set 1/i }).click();

  // Default reps = currentReps + 1 = 10 = rangeMax → triggers level-up
  await completeThreeSets(page);

  await expect(page.getByTestId('level-up-screen')).toBeVisible({ timeout: 8000 });

  await context.close();
  void deadbugs;
});

// ── Behavior 2 ─────────────────────────────────────────────────
// Level-up screen shows correct from/to level chips
test('level-up screen shows correct level chips (Level 1 → Level 2)', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    storageState: 'playwright/.auth/user.json',
  });
  const page = await context.newPage();

  await setDeadbugsReps(page, 9, 1);

  await page.goto('/session');
  await page.getByRole('button', { name: /start set 1/i }).click();
  await completeThreeSets(page);

  await expect(page.getByTestId('level-up-screen')).toBeVisible({ timeout: 8000 });
  await expect(page.getByTestId('level-chip-from')).toContainText('Level 1');
  await expect(page.getByTestId('level-chip-to')).toContainText('Level 2');

  await context.close();
});

// ── Behavior 3 ─────────────────────────────────────────────────
// Continue button on level-up screen advances to the next exercise intro
test('Continue button on level-up screen advances to next exercise', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    storageState: 'playwright/.auth/user.json',
  });
  const page = await context.newPage();

  await setDeadbugsReps(page, 9, 1);

  await page.goto('/session');
  await page.getByRole('button', { name: /start set 1/i }).click();
  await completeThreeSets(page);

  await expect(page.getByTestId('level-up-screen')).toBeVisible({ timeout: 8000 });
  await page.getByRole('button', { name: /continue/i }).click();

  await expect(page.getByRole('heading', { name: /bird dog/i })).toBeVisible({ timeout: 5000 });

  await context.close();
});

// ── Behavior 4 ─────────────────────────────────────────────────
// When no level-up occurs mid-workout, go straight to the next exercise (no encouragement card)
test('no level-up advances straight to next exercise', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    storageState: 'playwright/.auth/user.json',
  });
  const page = await context.newPage();

  // rangeMin=6 → default reps=7 < rangeMax=10 → no level-up
  await setDeadbugsReps(page, 6, 1);

  await page.goto('/session');
  await expect(page.getByRole('heading', { name: /deadbugs/i })).toBeVisible({ timeout: 5000 });
  await page.getByRole('button', { name: /start set 1/i }).click();
  await completeThreeSets(page);

  await expect(page.getByRole('heading', { name: /bird dog/i })).toBeVisible({ timeout: 8000 });
  await expect(page.getByTestId('encouragement-card')).toHaveCount(0);

  await context.close();
});

// ── Behavior 5 ─────────────────────────────────────────────────
// The encouragement card appears once, after the final exercise, then auto-advances
test('encouragement card shown only at end of workout and auto-advances', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    storageState: 'playwright/.auth/user.json',
  });
  const page = await context.newPage();

  // Put every exercise at rangeMin so nothing levels up
  const res = await page.request.get('/api/progress');
  const progress: { exerciseId: number; rangeMin: number }[] = await res.json();
  for (const p of progress) {
    await page.request.patch(`/api/progress/${p.exerciseId}`, {
      data: { currentReps: p.rangeMin, progressionLevel: 1 },
    });
  }

  await page.clock.install();
  await page.goto('/session');

  for (let ex = 0; ex < progress.length; ex++) {
    await page.getByRole('button', { name: /start set 1/i }).click();
    await completeThreeSets(page);
    if (ex < progress.length - 1) {
      await expect(page.getByRole('button', { name: /start set 1/i })).toBeVisible({ timeout: 8000 });
      await expect(page.getByTestId('encouragement-card')).toHaveCount(0);
    }
  }

  await expect(page.getByTestId('encouragement-card')).toBeVisible({ timeout: 8000 });
  await page.clock.fastForward(2100);
  await expect(page.getByTestId('session-complete-screen')).toBeVisible({ timeout: 5000 });

  await context.close();
});
