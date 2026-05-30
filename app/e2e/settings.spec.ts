import { test, expect } from '@playwright/test';

// ── Behavior 1 (tracer bullet) ─────────────────────────────────
// Authenticated user loads /settings and sees all 6 exercise cards
test('settings page shows all 6 exercise names', async ({ page }) => {
  await page.goto('/settings');
  for (const name of ['Deadbugs', 'Bird dog', 'Push-ups', 'Rows', 'Squats', 'Bridges']) {
    await expect(page.getByText(name)).toBeVisible();
  }
});

// ── Behavior 2 ─────────────────────────────────────────────────
// Level selector is dynamically bounded by the exercise's progression count
test('level buttons are bounded by progressionCount for each exercise', async ({ page }) => {
  await page.goto('/settings');
  const deadbugsCard = page.locator('[data-exercise="Deadbugs"]');
  const pushUpsCard = page.locator('[data-exercise="Push-ups"]');

  // Deadbugs has 9 progression levels, Push-ups has 10
  const deadbugsButtons = deadbugsCard.locator('[data-testid="level-btn"]');
  const pushUpsButtons = pushUpsCard.locator('[data-testid="level-btn"]');
  await expect(deadbugsButtons).toHaveCount(9);
  await expect(pushUpsButtons).toHaveCount(10);
});

// ── Behavior 3 ─────────────────────────────────────────────────
// Rep stepper +/− buttons meet 48×48px minimum touch target
test('rep stepper buttons are at least 48x48px', async ({ page }) => {
  await page.goto('/settings');
  const firstDec = page.locator('[data-testid="reps-dec"]').first();
  const firstInc = page.locator('[data-testid="reps-inc"]').first();

  const decBox = await firstDec.boundingBox();
  const incBox = await firstInc.boundingBox();

  expect(decBox!.width).toBeGreaterThanOrEqual(48);
  expect(decBox!.height).toBeGreaterThanOrEqual(48);
  expect(incBox!.width).toBeGreaterThanOrEqual(48);
  expect(incBox!.height).toBeGreaterThanOrEqual(48);
});

// ── Behavior 4 ─────────────────────────────────────────────────
// Incrementing reps persists immediately — no Save button needed
test('incrementing Push-ups reps persists after page reload', async ({ page }) => {
  await page.goto('/settings');
  const card = page.locator('[data-exercise="Push-ups"]');
  const repsDisplay = card.locator('[data-testid="reps-value"]');

  const initialText = await repsDisplay.textContent();
  const initialReps = parseInt(initialText!.trim());

  const patchDone = page.waitForResponse(/\/api\/progress\//);
  await card.locator('[data-testid="reps-inc"]').click();
  await patchDone;

  await page.reload();

  await expect(
    page.locator('[data-exercise="Push-ups"] [data-testid="reps-value"]'),
  ).toHaveText(String(initialReps + 1));

  // Also verify via the API that the DB row matches
  const response = await page.request.get('/api/progress');
  const data = await response.json();
  const pushUps = data.find((ex: { name: string }) => ex.name === 'Push-ups');
  expect(pushUps.currentReps).toBe(initialReps + 1);
});

// ── Behavior 5 ─────────────────────────────────────────────────
// API returns 401 for unauthenticated requests
test('GET /api/progress returns 401 for unauthenticated requests', async ({ browser }) => {
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const page = await context.newPage();
  const response = await page.request.get('/api/progress');
  expect(response.status()).toBe(401);
  await context.close();
});

test('PATCH /api/progress/:exerciseId returns 401 for unauthenticated requests', async ({
  browser,
}) => {
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const page = await context.newPage();
  const response = await page.request.patch('/api/progress/1', {
    data: { currentReps: 5 },
  });
  expect(response.status()).toBe(401);
  await context.close();
});
