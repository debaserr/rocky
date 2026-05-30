import { test, expect, type BrowserContext, type Page } from '@playwright/test';

async function makeAudioSpy(context: BrowserContext): Promise<Page> {
  const page = await context.newPage();
  await page.addInitScript(() => {
    (window as any)._audioContextCreated = false;
    function MockAudioContext(this: any) {
      (window as any)._audioContextCreated = true;
      this.currentTime = 0;
      this.destination = {};
      this.createOscillator = () => {
        let _onended: (() => void) | null = null;
        return {
          connect: () => {},
          frequency: { value: 440 },
          type: 'sine' as OscillatorType,
          start: () => {},
          stop: () => { queueMicrotask(() => { if (_onended) _onended(); }); },
          get onended() { return _onended; },
          set onended(fn: (() => void) | null) { _onended = fn; },
        };
      };
      this.createGain = () => ({
        connect: () => {},
        gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
      });
      this.close = () => Promise.resolve();
    }
    (window as any).AudioContext = MockAudioContext;
  });
  return page;
}

// ── Behavior 1 (tracer bullet) ─────────────────────────────────
// After logging set 1, the rest screen shows an SVG ring timer
test('resting screen shows SVG ring timer after logging set 1', async ({ page }) => {
  await page.goto('/session');
  await page.getByRole('button', { name: /start set 1/i }).click();
  await page.getByRole('button', { name: /done.*log set/i }).click();
  await page.getByRole('button', { name: /done.*log set/i }).click();

  await expect(page.getByTestId('rest-ring')).toBeVisible({ timeout: 5000 });
});

// ── Behavior 2 ─────────────────────────────────────────────────
// After clock fast-forward past rest_seconds, timer auto-advances to set_active
// and AudioContext was created (beep played)
test('timer auto-advances after rest_seconds with beep (clock fast-forward)', async ({ browser }) => {
  const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
  const page = await makeAudioSpy(context);

  await page.clock.install();
  await page.goto('/session');
  await page.getByRole('button', { name: /start set 1/i }).click();
  await page.getByRole('button', { name: /done.*log set/i }).click();
  await page.getByRole('button', { name: /done.*log set/i }).click();

  await expect(page.getByTestId('rest-ring')).toBeVisible({ timeout: 5000 });

  // Deadbugs has 60s rest; fast-forward 65s (Date.now()-based elapsed, single tick suffices)
  await page.clock.fastForward(65_000);

  await expect(page.getByTestId('set-counter')).toContainText('Set 2 of 3', { timeout: 5000 });

  const audioCreated = await page.evaluate(() => (window as any)._audioContextCreated);
  expect(audioCreated).toBe(true);

  await context.close();
});

// ── Behavior 3 ─────────────────────────────────────────────────
// Skip button advances immediately to set_active without playing beep
test('skip advances to set_active immediately without beep', async ({ browser }) => {
  const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
  const page = await makeAudioSpy(context);

  await page.goto('/session');
  await page.getByRole('button', { name: /start set 1/i }).click();
  await page.getByRole('button', { name: /done.*log set/i }).click();
  await page.getByRole('button', { name: /done.*log set/i }).click();

  await expect(page.getByTestId('rest-ring')).toBeVisible({ timeout: 5000 });
  await page.getByTestId('skip-rest').click();

  await expect(page.getByTestId('set-counter')).toContainText('Set 2 of 3', { timeout: 5000 });

  const audioCreated = await page.evaluate(() => (window as any)._audioContextCreated);
  expect(audioCreated).toBe(false);

  await context.close();
});

// ── Behavior 4 ─────────────────────────────────────────────────
// Wake lock is not released when the timer fires and transitions to set_active
test('wake lock stays held after timer fires', async ({ browser }) => {
  const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
  const page = await makeAudioSpy(context);

  await page.addInitScript(() => {
    let released = false;
    const mockLock = { released: false, release: async () => { released = true; } };
    (window as any)._wakeLockReleased = () => released;
    Object.defineProperty(navigator, 'wakeLock', {
      configurable: true,
      value: { request: async () => mockLock },
    });
  });

  await page.clock.install();
  // Navigate from home so StartSessionButton acquires the wake lock
  await page.goto('/');
  await page.getByRole('button', { name: /start session/i }).click();
  await page.getByRole('button', { name: /start set 1/i }).click();
  await page.getByRole('button', { name: /done.*log set/i }).click();
  await page.getByRole('button', { name: /done.*log set/i }).click();

  await expect(page.getByTestId('rest-ring')).toBeVisible({ timeout: 5000 });

  await page.clock.fastForward(65_000);

  await expect(page.getByTestId('set-counter')).toContainText('Set 2 of 3', { timeout: 5000 });

  const released = await page.evaluate(() => (window as any)._wakeLockReleased());
  expect(released).toBe(false);

  await context.close();
});
