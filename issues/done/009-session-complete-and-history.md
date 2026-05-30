# 009 — Session Complete and Workout History

## Parent PRD

[PRD.md](../PRD.md)

## What to build

The end-of-session summary screen and the history page showing all past sessions.

---

### Session Complete screen

**Screen design:** implement `ScreenSessionComplete` from `ux/rocky-screens-2.jsx` using the **`list` variant** (recommended). The screen shows:
- A completion message.
- List of all 6 exercises with reps logged per set (sourced from the `workout_sets` written during the session).
- Any level-ups earned this session highlighted.
- "Done" button returning to the home screen.

**Auto-save on completion:** when the session machine reaches `session_complete`, the `completed_at` timestamp on the `workout_sessions` row is written automatically. No user action required. (The session row and individual set rows are already written during the session — this just closes the record.)

Add `completeSession(sessionId)` to the Progress Repository to stamp `completed_at`.

---

### History page

**Screen design:** implement `ScreenHistory` from `ux/rocky-screens-2.jsx`. The screen shows:
- Chronological list of past sessions (most recent first).
- Each row: date, total sets completed.
- Expandable rows showing per-exercise reps for that session.
- Level-up count badge per session (count of exercises where `leveledUp` occurred — derive from comparing `user_progress.updated_at` timestamps against `workout_sessions.completed_at`, or store a `leveled_up` flag on `workout_sets`).

Accessible at `/history` via the `PhoneFooterBar` History tab.

**Data route:** `GET /api/sessions` returns the authenticated user's sessions with nested set data, scoped strictly to `session.user.id`.

---

### Progress Repository additions

Add to `lib/progress-repository.ts`:
- `completeSession(sessionId)` — stamps `completed_at = now()`.
- `getSessions(userId)` — returns sessions with nested `workout_sets`, ordered by `started_at DESC`.

## Acceptance criteria

- [ ] After the final exercise's feedback state, `ScreenSessionComplete` (list variant) is shown.
- [ ] The summary lists all 6 exercises with correct reps per set.
- [ ] `workout_sessions.completed_at` is written automatically — no user action required.
- [ ] Tapping "Done" returns to the home screen.
- [ ] `/history` renders `ScreenHistory` with past sessions in reverse-chronological order.
- [ ] Each session row is expandable and shows per-exercise rep data.
- [ ] History data is scoped to the authenticated user — no cross-user rows returned.
- [ ] `GET /api/sessions` returns 401 for unauthenticated requests.
- [ ] Playwright test: complete a full session (all 6 exercises, all 3 sets), navigate to `/history`, assert the new session appears as the most recent row with correct exercise data.

## Blocked by

- Blocked by `issues/006-core-session-flow.md`
- Blocked by `issues/007-rest-timer.md`
- Blocked by `issues/008-level-up-and-encouragement.md`

## User stories addressed

- User story 27 (summary screen after session)
- User story 28 (session saved automatically on completion)
- User story 29 (list of past sessions)
- User story 30 (date, exercises, reps per past session)
- User story 31 (reps per exercise over time)
