import { test, expect } from '@playwright/test';

// ── Behavior 1 ─────────────────────────────────────────────────
test('GET /login renders email input and Send magic link button', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /send magic link/i })).toBeVisible();
});

// ── Behavior 2 ─────────────────────────────────────────────────
test('submitting email shows Check your email confirmation', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill('test@rocky.test');
  await page.getByRole('button', { name: /send magic link/i }).click();
  await expect(page.getByText(/check your email/i)).toBeVisible({ timeout: 10_000 });
});

// ── Behavior 3 ─────────────────────────────────────────────────
test('unauthenticated access to / redirects to /login', async ({ browser }) => {
  // Explicit empty storageState overrides the project default, giving a truly
  // unauthenticated context (browser.newContext() inherits project storageState in PW 1.60+).
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page).toHaveURL(/\/login/);
  await context.close();
});

// ── Behavior 4 ─────────────────────────────────────────────────
test('authenticated user loads / without redirect (smoke test)', async ({ page }) => {
  // storageState is loaded from playwright.config.ts
  await page.goto('/');
  await expect(page).not.toHaveURL(/\/login/);
  await expect(page.locator('body')).toBeVisible();
});

// ── Behavior 5 ─────────────────────────────────────────────────
// Uses a dedicated session (logout-user.json) so signOut does not delete the
// shared main session used by other tests.
test.describe('logout', () => {
  test.use({ storageState: 'playwright/.auth/logout-user.json' });

  test('logout clears session and redirects to /login', async ({ page }) => {
    await page.goto('/settings');
    await page.getByRole('button', { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/login/);
    // Session cookie is now cleared; revisiting / must redirect back to /login
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });
});
