import { test, expect } from '@playwright/test';

// ── Behavior 1 (tracer bullet) ─────────────────────────────────
// Authenticated user lands on / and sees the Start session CTA
test('home screen shows Start session button', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /start session/i })).toBeVisible();
});

// ── Behavior 2 ─────────────────────────────────────────────────
// Start session button is above the fold at 390×844 (no scroll needed)
test('Start session button is above the fold at 390×844', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    storageState: 'playwright/.auth/user.json',
  });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('button', { name: /start session/i })).toBeInViewport();
  await context.close();
});

// ── Behavior 3 ─────────────────────────────────────────────────
// PhoneFooterBar nav renders with the three tabs
test('navigation shows Home, History, and Settings tabs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /history/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /settings/i })).toBeVisible();
});

// ── Behavior 4 ─────────────────────────────────────────────────
// Active tab is highlighted on the current route
test('Home tab is marked active on /', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /home/i })).toHaveAttribute('aria-current', 'page');
});

// ── Behavior 5 ─────────────────────────────────────────────────
// ExerciseProgressDots renders one dot per exercise from live user_progress data
test('ExerciseProgressDots renders a dot per exercise', async ({ page }) => {
  await page.goto('/');
  const dots = page.locator('[data-testid="exercise-progress-dots"] > div');
  await expect(dots).toHaveCount(6);
});

// ── Behavior 6 ─────────────────────────────────────────────────
// Tapping Start session acquires Wake Lock then navigates to /session
test('Start session acquires Wake Lock before navigating to /session', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'wakeLock', {
      configurable: true,
      value: {
        request: async (type: string) => {
          (window as any).__wakeLockType = type;
          return { release: async () => {} };
        },
      },
    });
  });
  await page.goto('/');
  await page.getByRole('button', { name: /start session/i }).click();
  await expect(page).toHaveURL(/\/session/, { timeout: 5000 });
  const wakeLockType = await page.evaluate(() => (window as any).__wakeLockType);
  expect(wakeLockType).toBe('screen');
});

// ── Behavior 7 ─────────────────────────────────────────────────
// Wake Lock failure is caught silently — session still starts, no error shown
test('Wake Lock failure is caught silently', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'wakeLock', {
      configurable: true,
      value: {
        request: async () => { throw new Error('NotAllowedError'); },
      },
    });
  });
  await page.goto('/');

  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.getByRole('button', { name: /start session/i }).click();
  await expect(page).toHaveURL(/\/session/, { timeout: 5000 });
  expect(errors).toHaveLength(0);
});

// ── Behavior 8 ─────────────────────────────────────────────────
// No horizontal scroll at 390px width
test('no horizontal scroll at 390px width', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    storageState: 'playwright/.auth/user.json',
  });
  const page = await context.newPage();
  await page.goto('/');
  const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(390);
  await context.close();
});
