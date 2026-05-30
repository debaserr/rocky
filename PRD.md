# PRD — Rocky: BWF Primer Web App

## Problem Statement

I guide myself through BWF Primer workouts using a Claude Code CLI command. It works well but has two friction points that break my focus during training: I have to look at my screen to read exercise instructions after each set, and I have to mentally track rest times myself. These interruptions pull me out of the workout.

## Solution

A deployed web application — accessible from my phone — that guides me through each BWF Primer session hands-free. The app announces each exercise and target via TTS, auto-starts the rest timer after each set, and beeps when rest is over. I log reps with large +/− buttons, and my progression updates automatically when I beat my current best. I never have to think about time or remember what's next.

## User Stories

### Authentication
1. As a user, I want to enter my email address and receive a magic link, so that I can log in without managing a password.
2. As a user, I want to be redirected to the workout home screen after clicking the magic link, so that I can start a session immediately.
3. As a user, I want my session to persist across browser restarts, so that I don't have to log in again every time I open the app.

### Starting a Session
4. As a user, I want a single prominent button to start a new session, so that I can begin my workout without navigating menus.
5. As a user, I want the screen to stay on automatically when I start a session, so that I don't have to unlock my phone between sets.
6. As a user, I want the first exercise to be announced via TTS as soon as the session starts, so that I know what to do without looking at the screen.

### Exercise Flow
7. As a user, I want to see one exercise at a time during my session, so that I can focus on the current movement without distraction.
8. As a user, I want the app to show me my current progression level for each exercise, so that I know which variant I should be performing.
9. As a user, I want the app to announce my next goal (current reps + 1) via TTS when each exercise begins, so that I know what I'm aiming for before I start.
10. As a user, I want to see a link to the exercise tutorial for each exercise, so that I can check form if needed.
11. As a user, I want to see all 6 exercises in a fixed order (Deadbugs → Bird dog → Push-ups → Rows → Squats → Bridges), so that the session is predictable.

### Set Logging
12. As a user, I want to tap a "Done" button after completing a set, so that I can signal completion without typing.
13. As a user, I want to log how many reps I completed using +/− buttons, so that I can input quickly with sweaty hands without a keyboard.
14. As a user, I want the +/− buttons to have large touch targets (minimum 48×48px), so that I can tap accurately on a phone mid-workout.
15. As a user, I want to see which set number I'm on (e.g. "Set 2 of 3"), so that I know how far through the exercise I am.

### Rest Timer
16. As a user, I want the rest timer to start automatically after I log a set, so that I don't have to start it manually.
17. As a user, I want to see a countdown of the remaining rest time, so that I can glance at the screen and know when to go.
18. As a user, I want to hear a beep when the rest timer ends, so that I know to start the next set without watching the screen.
19. As a user, I want TTS to announce the next set when the rest timer ends, so that I know what's coming before I look up.
20. As a user, I want the rest duration to match the exercise (60s for core, 90s for squats/bridges, 2 min for push-ups/rows), so that I'm resting the appropriate amount.
21. As a user, I want to be able to skip the rest timer early if I feel ready, so that I'm not forced to wait unnecessarily.

### Progression
22. As a user, I want my progress to update automatically after all 3 sets if my consistent performance beats my current target, so that I don't have to manually track improvements.
23. As a user, I want progress to advance to the level I consistently achieved (minimum reps across all 3 sets), so that a strong day advances me more than one step.
24. As a user, I want to be notified with a celebratory message when I level up to a new progression level, so that the milestone feels meaningful.
25. As a user, I want to receive warm encouragement even when I didn't improve, so that showing up feels worthwhile regardless of the result.
26. As a user, I want the level-up to automatically reset my rep target to the range minimum for the new progression level, so that the new exercise starts at a manageable level.

### Session Completion
27. As a user, I want to see a summary screen when all 6 exercises are complete, so that I can see how the session went.
28. As a user, I want the session to be saved to my workout history automatically on completion, so that I don't have to do anything to record it.

### Workout History
29. As a user, I want to see a list of my past workout sessions, so that I can track my consistency.
30. As a user, I want to see the date, exercises, and reps logged for each past session, so that I can review my performance over time.
31. As a user, I want to see how my reps per exercise have changed over time, so that I can see long-term progression.

### Settings
32. As a user, I want a settings page where I can view my current progression level and rep target for each exercise, so that I can verify the app reflects my actual state.
33. As a user, I want to manually adjust my progression level and rep target for any exercise, so that I can seed my initial state or correct mistakes.
34. As a user, I want changes on the settings page to take effect immediately, so that the next session uses the corrected values.

### Multi-User
35. As a new user, I want to sign up with just my email address, so that I can start tracking my own BWF Primer progress independently.
36. As a user, I want my progress and session history to be completely private, so that other users of the app cannot see my data.
37. As a user, I want my progression state to be independent from other users, so that my level-ups and history are my own.

### Mobile Experience
38. As a mobile user, I want the app to be usable in portrait mode on a small screen, so that I don't need to rotate my phone.
39. As a mobile user, I want the primary actions (Done, +/−) to be reachable with one thumb, so that I don't need two hands during a set.

---

## Implementation Decisions

### Tech Stack
- **Framework**: Next.js (App Router) — API routes handle database access without a separate backend.
- **Database**: Neon (serverless Postgres) — free tier, integrates with Vercel.
- **Auth**: NextAuth with the Email provider (magic link via Resend) — passwordless, no OAuth dependency.
- **UI**: shadcn/ui + Radix UI + Tailwind CSS.
- **Deployment**: Vercel.
- See ADR 0001.

### TTS and Timer
- Exercise announcements via Web Speech API (browser built-in).
- Rest-over signal is an audio beep, not TTS — more reliable on foreground regain.
- Wake Lock API keeps the screen on during a session (iOS Safari 16.4+, Chrome Android).
- If the user explicitly locks their screen, audio suspension is an accepted limitation.
- See ADR 0002.

### Progression Logic
The following type shape encodes the core rule precisely:

```ts
type ProgressionResult = {
  newReps: number;       // min(set1, set2, set3) if > currentReps, else currentReps
  newLevel: number;      // incremented if newReps === maxReps for this exercise
  leveledUp: boolean;
  improved: boolean;     // true if newReps > currentReps
};
```

- The app announces the **next goal** as `currentReps + 1`.
- After all 3 sets: `achieved = min(set1, set2, set3)`.
- If `achieved > currentReps`: progress updates to `achieved`.
- If `achieved === maxReps`: level up, reset reps to `rangeMin`.
- If `achieved ≤ currentReps`: no update.
- See ADR 0003.

### Session State Machine
The session progresses through a fixed sequence of states:

```
idle
  → exercise_intro      (TTS fires, next goal announced)
  → set_active          (user performing the set)
  → logging_reps        (Done tapped, +/− input shown)
  → resting             (timer counting down)
  → set_active          (next set, if sets remain)
  → evaluating          (after set 3: run progression logic, update DB if improved)
  → exercise_intro      (next exercise, if exercises remain)
  → session_complete    (all 6 done, log session to DB)
```

### Database Schema

Tables are split by owner. NextAuth tables are created and managed automatically by `@auth/drizzle-adapter` — do not manage them manually.

**Managed by NextAuth (via `@auth/drizzle-adapter`)**
- `users` — id, name, email, emailVerified, image
- `sessions` — id, userId (→ users.id), expires, sessionToken
- `verification_tokens` — identifier, token, expires

**Seed data (static, populated once)**
- `exercises` — id, name, tutorial_url, rest_seconds, range_min, range_max, max_reps, sort_order

**App tables (user_id references users.id)**
- `user_progress` — id, user_id, exercise_id, progression_level, current_reps, updated_at
- `workout_sessions` — id, user_id, started_at, completed_at
- `workout_sets` — id, session_id, exercise_id, set_number, reps_completed, logged_at

### Modules

**Progression Evaluator** — pure function, no side effects. Takes current state + 3 set results, returns a `ProgressionResult`. This is the deepest isolated module in the app.

**Session State Machine** — a React reducer (or hook) that owns session state and emits events consumed by TTS Announcer and Rest Timer. Keeps orchestration logic out of components.

**Rest Timer** — a hook encapsulating countdown, wake lock acquisition, and beep playback. Interface: `{ secondsRemaining, isRunning, skip }`.

**TTS Announcer** — thin wrapper around `window.speechSynthesis`. Interface: `speak(text)`, `cancel()`.

**Progress Repository** — server-side data access layer. Exposes: `getUserProgress`, `updateExerciseProgress`, `createSession`, `logSet`. No business logic — delegates progression evaluation to the Progression Evaluator. All queries are scoped to the authenticated user's ID — no cross-user data access is possible at the repository layer.

**Settings Page** — read/write UI for `user_progress`. Seeding initial state from the existing markdown file is done here manually on first deploy.

---

## Testing Decisions

Tests should verify external behaviour only — inputs and outputs — not internal implementation details. A test that breaks when you rename a variable is not a useful test.

**Framework**: Playwright, run against the local Next.js dev server. `npx playwright test --ui` is the TDD development loop. Tests live in `/e2e/`. See ADR 0004.

### Test environment

- Tests run against a separate Neon database branch (`DATABASE_URL_TEST`), never the development or production database. See ADR 0005.
- A Playwright global setup script seeds the test database with known fixture data before the suite runs: the 6 exercises and a test user with fixed progression state.
- Authentication is bypassed via a test-only `Credentials` provider in NextAuth, enabled only when `PLAYWRIGHT=true`. Global setup logs in once and saves `storageState`; all tests start pre-authenticated.
- `PLAYWRIGHT=true` must never be set in production.

### Modules to test

- **Progression Evaluator** — tested via API route. Parameterised cases: no improvement, improvement (not level-up), improvement (level-up), improvement by more than +1 (strong day), exactly matching current (no update). Highest-priority suite — the logic is non-trivial and fully deterministic.

- **Session State Machine** — tested via the full workout flow in a mobile viewport. Happy path: complete all 3 sets for all 6 exercises, verify TTS is called at the right moments, verify timer starts and beep fires, verify progression updates after a session.

- **Rest Timer** — tested using Playwright's clock API (`page.clock.fastForward`) to avoid real waits. Assert timer counts down, beep fires on zero, wake lock is requested.

- **Settings Page** — load page, change reps for an exercise, reload, verify the new value persists in the database.

No unit test framework (Jest/Vitest) is used. Component-level logic is covered by the e2e suite.

---

## Out of Scope

- Push notifications for rest timer (requires service worker; wake lock covers the use case for a foreground app).
- Voice selection or custom TTS voices — Web Speech API default voice is sufficient.
- User management / admin (no way to list, delete, or manage other users' accounts).
- Syncing progress back to the CLI command's markdown files.
- Exercise progression list content (the app links to external tutorial pages; it does not host the progression lists itself).
- Offline support / PWA.
- Social or sharing features.

---

## Design References

All screens are implemented as React components in `ux/`. The design uses a dark theme with a lime accent, Space Grotesk + JetBrains Mono typefaces, and a fixed 390×844 phone shell for mockups. Tablet layout (centered max-width column, sidebar nav) is handled at the CSS level in implementation — not represented in the mockup shell.

| Screen | File | Component | Notes |
|---|---|---|---|
| Login | `ux/rocky-screens.jsx` | `ScreenLogin` | Includes confirmation state (`ConfirmationCard`) |
| Home | `ux/rocky-screens.jsx` | `ScreenHome` | Two variants: `HomeCTAFirst` (recommended) and `HomeProgressFirst` (grid tiles) |
| Exercise Intro | `ux/rocky-screens.jsx` | `ScreenExerciseIntro` | Shows exercise name, progression level, goal, form cue, tutorial link |
| Set Active | `ux/rocky-screens.jsx` | `ScreenSetActive` | Rep counter (84×84px stepper buttons) + "Done — log set" in footer. Goal label must show `current_reps + 1`, not `current_reps` (see Known Issues) |
| Rest Timer | `ux/rocky-screens.jsx` | `ScreenRestTimer` | Three variants: `numeric` (large countdown), `ring` (SVG progress ring), `bar` (progress bar). Recommend `ring` for production. |
| Level Up | `ux/rocky-screens-2.jsx` | `ScreenLevelUp` | Old → new level chips, new target display. Copy fix needed (see Known Issues) |
| Session Complete | `ux/rocky-screens-2.jsx` | `ScreenSessionComplete` | Three variants: `list` (recommended), `grid`, `receipt` |
| History | `ux/rocky-screens-2.jsx` | `ScreenHistory` | Expandable session rows, level-up count |
| Settings | `ux/rocky-screens-2.jsx` | `ScreenSettings` | Per-exercise level selector + rep stepper. Level selector must be dynamic (see Known Issues) |

### Shared primitives (`ux/rocky-ui.jsx`)
`Phone`, `RKButton`, `RKCard`, `RKLabel`, `ExerciseProgressDots`, `PhoneFooterBar`, `Icons` — these map directly to shadcn/Radix/Tailwind components in implementation.

### Theme tokens (`ux/rocky-theme.jsx`)
CSS custom properties (`--rk-*`) define the full colour and typography system. Four accent options (lime, volt, ember, bone); three font stacks (athletic, neutral, modern). Default: lime + athletic.

---

## Further Notes

- On first deploy, progress must be seeded manually via the settings page using the values from `bwf-primer.md`.
- The exercises table is seed data — the 6 BWF Primer exercises are static and do not change at runtime.
- The Wake Lock API will be silently unavailable in some browser contexts (e.g. private/incognito on some browsers). The app should degrade gracefully — session still works, screen may dim.
- The CLI command (`/workout`) remains usable independently. The two sources of truth (database vs markdown file) can drift; the settings page is the correction mechanism.
