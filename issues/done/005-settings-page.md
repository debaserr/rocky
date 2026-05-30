# 005 — Settings Page

## Parent PRD

[PRD.md](../PRD.md)

## What to build

A read/write settings screen where the user can view and manually correct their current progression level and rep target for each of the 6 exercises. This is also the mechanism for seeding Oliver's initial state from `bwf-primer.md` on first deploy.

**Screen design:** implement `ScreenSettings` from `ux/rocky-screens-2.jsx`. The screen shows one card per exercise containing:
- Exercise name.
- **Progression level selector** — must be a dynamic dropdown/select populated from the exercise's actual progression list length, not a hard-coded range. (Known issue in PRD: the mockup shows a static selector; implementation must make this dynamic.)
- **Rep stepper** — `+` / `−` buttons with 48×48px minimum touch targets, clamped to the exercise's `range_min`–`range_max`.
- Current values loaded from `user_progress` for the authenticated user.

**Data flow:**
- On page load: `GET /api/progress` returns all 6 `user_progress` rows for the current user. If no rows exist yet (first-ever login), the API creates them with `progression_level = 1` and `current_reps = range_min` for each exercise.
- On change: `PATCH /api/progress/:exerciseId` updates the row immediately. No "Save" button — each change persists on the spot.
- All API routes are scoped to `session.user.id` — no cross-user access possible.

**Progress Repository** (`lib/progress-repository.ts`): server-side data access layer exposing `getUserProgress(userId)` and `updateExerciseProgress(userId, exerciseId, patch)`. No business logic here.

## Acceptance criteria

- [ ] `/settings` renders `ScreenSettings` with 6 exercise cards showing live data from `user_progress`.
- [ ] The progression level selector is dynamically bounded (not hard-coded).
- [ ] Rep stepper `+` / `−` buttons meet 48×48px minimum touch target.
- [ ] Changing a value persists to the DB immediately (no Save button required).
- [ ] Playwright test: load `/settings`, increment reps for Push-ups by 1, reload the page, assert the new value is shown and matches the DB row.
- [ ] First-time user with no `user_progress` rows sees sensible defaults (level 1, `range_min` reps) after page load creates them.
- [ ] API routes return 401 for unauthenticated requests.

## Blocked by

- Blocked by `issues/003-magic-link-auth.md`
- Blocked by `issues/002-db-schema-and-seed.md`

## User stories addressed

- User story 32 (view current progression level and rep target)
- User story 33 (manually adjust level and rep target)
- User story 34 (changes take effect immediately)
