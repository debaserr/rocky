import { test, expect } from '@playwright/test';

const URL = '/api/evaluate-progression';

type Input = {
  currentReps: number;
  currentLevel: number;
  rangeMin: number;
  rangeMax: number;
  set1: number;
  set2: number;
  set3: number;
};

async function evaluate(page: import('@playwright/test').Page, input: Input) {
  const res = await page.request.post(URL, { data: input });
  expect(res.status()).toBe(200);
  return res.json();
}

// ── Case 1: no improvement ─────────────────────────────────────
test('no improvement — achieved ≤ currentReps → no update', async ({ page }) => {
  const result = await evaluate(page, {
    currentReps: 8, currentLevel: 1, rangeMin: 5, rangeMax: 12,
    set1: 7, set2: 8, set3: 6,  // min = 6 < 8
  });
  expect(result).toEqual({ newReps: 8, newLevel: 1, leveledUp: false, improved: false });
});

// ── Case 2: improvement, no level-up ──────────────────────────
test('improvement not at range_max → newReps = achieved, leveledUp = false', async ({ page }) => {
  const result = await evaluate(page, {
    currentReps: 6, currentLevel: 1, rangeMin: 5, rangeMax: 12,
    set1: 9, set2: 8, set3: 10, // min = 8 > 6, 8 < 12
  });
  expect(result).toEqual({ newReps: 8, newLevel: 1, leveledUp: false, improved: true });
});

// ── Case 3: exactly at range_max → level up, reset to range_min
test('achieved === range_max → level up, reps reset to range_min', async ({ page }) => {
  const result = await evaluate(page, {
    currentReps: 10, currentLevel: 2, rangeMin: 5, rangeMax: 12,
    set1: 12, set2: 12, set3: 14, // min = 12 === range_max
  });
  expect(result).toEqual({ newReps: 5, newLevel: 3, leveledUp: true, improved: true });
});

// ── Case 4: strong day — achieved is currentReps + 2 ──────────
test('strong day: achieved = currentReps + 2 → newReps = currentReps + 2', async ({ page }) => {
  const result = await evaluate(page, {
    currentReps: 5, currentLevel: 1, rangeMin: 5, rangeMax: 12,
    set1: 8, set2: 7, set3: 9, // min = 7 = 5 + 2
  });
  expect(result).toEqual({ newReps: 7, newLevel: 1, leveledUp: false, improved: true });
});

// ── Case 5: all sets equal currentReps → no update ────────────
test('all sets equal currentReps → no update', async ({ page }) => {
  const result = await evaluate(page, {
    currentReps: 8, currentLevel: 1, rangeMin: 5, rangeMax: 12,
    set1: 8, set2: 8, set3: 8,
  });
  expect(result).toEqual({ newReps: 8, newLevel: 1, leveledUp: false, improved: false });
});
