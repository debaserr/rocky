# 006 — Core Session Flow and Progression Evaluator

## Parent PRD

[PRD.md](../PRD.md)

## What to build

The full workout experience: a React state machine that sequences 6 exercises × 3 sets end-to-end, with rep logging, TTS announcements, and automatic progression evaluation after the final set of each exercise. This is the core of the app.

---

### Session state machine

A React reducer (or hook) in `lib/session-machine.ts` owns all session state and drives every screen transition. The fixed sequence:

```
idle
  → exercise_intro      TTS fires, next goal announced
  → set_active          user performing the set
  → logging_reps        Done tapped, +/− input shown
  → resting             timer placeholder (replaced in slice 007)
  → set_active          next set, if sets remain
  → evaluating          after set 3: run progression logic, write to DB
  → exercise_intro      next exercise, if exercises remain
  → session_complete    all 6 done
```

The machine emits events consumed by the TTS Announcer. It holds no timer state — that is injected by the Rest Timer hook in slice 007. For this slice, the resting state shows a "Skip rest →" button that advances immediately.

---

### Screens to implement

**Exercise Intro** — `ScreenExerciseIntro` from `ux/rocky-screens.jsx`:
- Exercise name, current progression level, form cue.
- **Goal announced as `current_reps + 1`** — not `current_reps`. (Known issue in PRD: the mockup label is incorrect; implementation must show the next goal.)
- Tutorial link opening in a new tab.
- TTS fires on entry to this state: _"Next up: [exercise name]. Target: [current_reps + 1] reps."_

**Set Active** — `ScreenSetActive` from `ux/rocky-screens.jsx`:
- Set counter: "Set 2 of 3".
- **84×84px stepper buttons** (`+` / `−`) for rep input — sourced from the `ux/rocky-screens.jsx` spec.
- Goal label shows `current_reps + 1`.
- "Done — log set" button in `PhoneFooterBar`.
- Rep count initialised to `current_reps + 1`; clamped to `[0, range_max]`.

---

### Progression evaluator

Pure function `evaluateProgression` in `lib/progression.ts`. No side effects — takes current state and 3 set results, returns a `ProgressionResult`:

```ts
type ProgressionResult = {
  newReps: number;    // min(set1, set2, set3) if > currentReps, else currentReps
  newLevel: number;   // incremented if newReps === range_max for this exercise
  leveledUp: boolean;
  improved: boolean;  // true if newReps > currentReps
};
```

Rules:
- `achieved = min(set1, set2, set3)`
- If `achieved > currentReps`: update progress to `achieved`
- If `achieved === range_max`: level up, reset reps to `range_min`
- If `achieved ≤ currentReps`: no update

Exposed via `POST /api/evaluate-progression` for Playwright testing.

**Playwright test suite for `evaluateProgression`** (parameterised, all via the API route):
1. No improvement (`achieved ≤ currentReps`) → no update.
2. Improvement, not level-up → `newReps = achieved`, `leveledUp = false`.
3. Exactly at `range_max` → level up, reps reset to `range_min`.
4. Strong day: `achieved` is `currentReps + 2` → `newReps = currentReps + 2`.
5. All sets equal current reps → no update.

After the evaluating state, `updateExerciseProgress` is called (via the Progress Repository) if `improved === true`.

---

### TTS Announcer

Thin wrapper `lib/tts.ts` around `window.speechSynthesis`:
- `speak(text: string)` — cancels any current utterance and speaks the new one.
- `cancel()` — stops speech immediately.
- No-ops silently if `speechSynthesis` is unavailable.

TTS fires at:
- `exercise_intro` entry: _"[Exercise name]. Target [goal] reps."_
- `resting` → `set_active` transition: _"Set [n] of 3. Go."_

---

### Progress Repository additions

Add to `lib/progress-repository.ts`:
- `createSession(userId)` → returns new `workout_sessions.id`.
- `logSet(sessionId, exerciseId, setNumber, repsCompleted)`.

(Session is created when the machine leaves `idle`; sets are logged on each `logging_reps` → `resting` transition.)

## Acceptance criteria

- [ ] Tapping "Start session" on the home screen navigates to `/session` and shows `ScreenExerciseIntro` for Deadbugs.
- [ ] TTS announces the exercise name and goal (`current_reps + 1`) on exercise intro.
- [ ] Goal label on `ScreenExerciseIntro` and `ScreenSetActive` shows `current_reps + 1`, not `current_reps`.
- [ ] "Done — log set" advances to `logging_reps`; tapping it again advances to `resting` (placeholder skip button visible).
- [ ] Set counter increments correctly through sets 1 → 2 → 3.
- [ ] After set 3, `evaluateProgression` runs; if `improved`, the `user_progress` row is updated in the DB.
- [ ] All 6 exercises play through in order (Deadbugs → Bird dog → Push-ups → Rows → Squats → Bridges).
- [ ] Each set is written to `workout_sets` via `logSet`.
- [ ] Playwright parameterised suite for `evaluateProgression`: all 5 cases pass via `POST /api/evaluate-progression`.
- [ ] Playwright happy-path test (mobile viewport 390×844): complete all 3 sets for all 6 exercises, verify `user_progress` is updated for the test user.
- [ ] TTS `speak` is called at the correct state transitions (assert via `page.evaluate` that `speechSynthesis.speaking` fired, or spy on the speak function).

## Blocked by

- Blocked by `issues/004-home-screen-and-nav.md`
- Blocked by `issues/005-settings-page.md`

## User stories addressed

- User story 6 (first exercise announced via TTS on session start)
- User story 7 (one exercise at a time)
- User story 8 (current progression level shown)
- User story 9 (next goal announced via TTS)
- User story 10 (tutorial link per exercise)
- User story 11 (6 exercises in fixed order)
- User story 12 (Done button to signal set completion)
- User story 13 (+/− buttons for rep logging)
- User story 14 (48×48px minimum touch targets — 84×84px per design spec)
- User story 15 (set number shown)
- User story 21 (skip rest — placeholder button in this slice)
- User story 22 (progress updates automatically after all 3 sets)
- User story 23 (minimum reps across sets determines advancement)
- User story 26 (level-up resets rep target to range minimum)
