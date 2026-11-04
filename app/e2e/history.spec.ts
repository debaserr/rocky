import { test, expect } from '@playwright/test';
import { completeThreeSets, advancePastFeedback } from './session-helpers';

const EXERCISES = ['Deadbugs', 'Bird dog', 'Push-ups', 'Rows', 'Squats', 'Bridges'];

async function completeFullSession(page: import('@playwright/test').Page) {
  await page.goto('/session');

  for (let ex = 0; ex < EXERCISES.length; ex++) {
    await expect(
      page.getByRole('heading', { name: new RegExp(EXERCISES[ex], 'i') }),
    ).toBeVisible({ timeout: 8000 });

    await page.getByRole('button', { name: /start set 1/i }).click();

    await completeThreeSets(page);
    await advancePastFeedback(page);
  }
}

// ── Behavior 1 (tracer bullet) ────────────────────────────────
// After all 6 exercises, session complete screen appears
test('session complete screen shows after all 6 exercises', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    storageState: 'playwright/.auth/user.json',
  });
  const page = await context.newPage();

  await completeFullSession(page);

  await expect(page.getByText(/that's the work/i)).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('button', { name: /done/i })).toBeVisible();

  await context.close();
});

// ── Behavior 2 ────────────────────────────────────────────────
// Session complete screen lists all exercises
test('session complete screen lists all 6 exercises', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    storageState: 'playwright/.auth/user.json',
  });
  const page = await context.newPage();

  await completeFullSession(page);

  await expect(page.getByText(/that's the work/i)).toBeVisible({ timeout: 10000 });

  for (const exerciseName of EXERCISES) {
    await expect(page.getByText(new RegExp(exerciseName, 'i'))).toBeVisible();
  }

  await context.close();
});

// ── Behavior 3 ────────────────────────────────────────────────
// Done button returns to home screen
test('Done button on session complete returns to home', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    storageState: 'playwright/.auth/user.json',
  });
  const page = await context.newPage();

  await completeFullSession(page);

  await expect(page.getByText(/that's the work/i)).toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: /done/i }).click();
  await expect(page).toHaveURL('/', { timeout: 5000 });

  await context.close();
});

// ── Behavior 4 ────────────────────────────────────────────────
// GET /api/sessions returns 401 without auth
test('GET /api/sessions returns 401 without auth', async ({ playwright }) => {
  const ctx = await playwright.request.newContext({
    baseURL: 'http://localhost:3000',
    storageState: { cookies: [], origins: [] },
  });
  const response = await ctx.get('/api/sessions');
  expect(response.status()).toBe(401);
  await ctx.dispose();
});

// ── Behavior 5 ────────────────────────────────────────────────
// History page shows past sessions
test('history page shows completed sessions', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    storageState: 'playwright/.auth/user.json',
  });
  const page = await context.newPage();

  await completeFullSession(page);
  await expect(page.getByText(/that's the work/i)).toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: /done/i }).click();
  await expect(page).toHaveURL('/', { timeout: 5000 });

  await page.goto('/history');
  await expect(page.getByTestId('session-row').first()).toBeVisible({ timeout: 5000 });

  await context.close();
});

// ── Behavior 6 (Playwright AC) ────────────────────────────────
// Full E2E: complete session → history → expand row → see exercise data
test('completed session appears in history with exercise data', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    storageState: 'playwright/.auth/user.json',
  });
  const page = await context.newPage();

  await completeFullSession(page);
  await expect(page.getByText(/that's the work/i)).toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: /done/i }).click();
  await expect(page).toHaveURL('/', { timeout: 5000 });

  await page.goto('/history');

  const firstRow = page.getByTestId('session-row').first();
  await expect(firstRow).toBeVisible({ timeout: 5000 });

  await firstRow.click();
  await expect(page.getByText(/deadbugs/i)).toBeVisible({ timeout: 3000 });

  await context.close();
});
