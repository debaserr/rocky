# 002 — Database Schema, Migrations, and Exercise Seed

## Parent PRD

[PRD.md](../PRD.md)

## What to build

Define and migrate the complete Drizzle schema for all app tables, then seed the 6 static BWF exercises. After this slice every subsequent slice can read and write real data.

**Tables to create:**

NextAuth tables are created automatically by `@auth/drizzle-adapter` — do not define them manually.

App tables (all `user_id` columns reference `users.id`):

```
exercises
  id            serial PK
  name          text NOT NULL
  tutorial_url  text NOT NULL
  rest_seconds  integer NOT NULL   -- 60 | 90 | 120
  range_min     integer NOT NULL
  range_max     integer NOT NULL   -- triggers level-up when hit
  sort_order    integer NOT NULL UNIQUE

user_progress
  id                serial PK
  user_id           text NOT NULL → users.id
  exercise_id       integer NOT NULL → exercises.id
  progression_level integer NOT NULL DEFAULT 1
  current_reps      integer NOT NULL
  updated_at        timestamptz NOT NULL DEFAULT now()

workout_sessions
  id           serial PK
  user_id      text NOT NULL → users.id
  started_at   timestamptz NOT NULL DEFAULT now()
  completed_at timestamptz

workout_sets
  id             serial PK
  session_id     integer NOT NULL → workout_sessions.id
  exercise_id    integer NOT NULL → exercises.id
  set_number     integer NOT NULL   -- 1 | 2 | 3
  reps_completed integer NOT NULL
  logged_at      timestamptz NOT NULL DEFAULT now()
```

**Exercise seed data** (applied via a Drizzle seed script, idempotent):

| sort_order | name      | tutorial_url                           | rest_seconds | range_min | range_max |
|------------|-----------|----------------------------------------|--------------|-----------|-----------|
| 1          | Deadbugs  | https://nick-e.com/deadbug/            | 60           | 6         | 10        |
| 2          | Bird dog  | https://nick-e.com/bird-dog/           | 60           | 6         | 10        |
| 3          | Push-ups  | https://nick-e.com/push-up/            | 120          | 5         | 12        |
| 4          | Rows      | https://nick-e.com/row/                | 120          | 5         | 12        |
| 5          | Squats    | https://nick-e.com/squat/              | 90           | 8         | 15        |
| 6          | Bridges   | https://nick-e.com/glutebridge/        | 90           | 8         | 15        |

Migrations must be applied to both the dev Neon branch and the `DATABASE_URL_TEST` Neon branch. The Playwright global setup script runs the seed before the suite.

## Acceptance criteria

- [ ] `npx drizzle-kit migrate` succeeds against dev and test DB branches with no errors.
- [ ] All 5 app tables exist in both branches with the correct column types and foreign keys.
- [ ] The seed script is idempotent (safe to run multiple times without duplicating rows).
- [ ] After seeding, querying `exercises` returns exactly 6 rows in sort_order 1–6 with correct `rest_seconds` values (60 / 60 / 120 / 120 / 90 / 90).
- [ ] A Playwright test queries `GET /api/healthz` (or a dedicated `/api/db-check` route) and asserts the exercises count equals 6.

## Blocked by

- Blocked by `issues/001-project-scaffold.md`

## User stories addressed

This slice is data infrastructure. It is a prerequisite for all data-dependent stories.
