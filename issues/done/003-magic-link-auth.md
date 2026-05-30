# 003 — Magic Link Authentication

## Parent PRD

[PRD.md](../PRD.md)

## What to build

Complete passwordless login: user enters their email, receives a magic link via Resend, clicks it, and lands on the home screen with a persisted session. A logout action is also required.

**Screen design:** implement `ScreenLogin` from `ux/rocky-screens.jsx`. The screen has two states:
- Default: email input + "Send magic link" button.
- Confirmation: `ConfirmationCard` — "Check your email" message shown after submission, no further action required from the user.

Both states use `RKButton` and `RKCard` primitives from `components/ui/`.

**Auth wiring:**

- NextAuth `Email` provider using Resend as the transport. Magic link redirects to `/` on success.
- `@auth/drizzle-adapter` connects NextAuth to the Neon database (creates `users`, `sessions`, `verification_tokens` tables automatically).
- Session strategy: `database` (cookie + DB session, persists across browser restarts).
- `NEXTAUTH_SECRET`, `RESEND_API_KEY`, and `EMAIL_FROM` are required env vars.

**Test environment bypass:**

- When `PLAYWRIGHT=true`, a second `Credentials` provider is enabled that accepts `{ email, password: "test" }` and creates/returns the test user without sending an email.
- Playwright global setup logs in once via this provider and saves `storageState` to `playwright/.auth/user.json`.
- All other Playwright tests load this `storageState` and start pre-authenticated.
- `PLAYWRIGHT=true` must never be set in production.

**Multi-user:** Each email address is an independent account. No user can access another user's data (enforced at the repository layer in later slices, but the isolation starts here with per-user session tokens).

## Acceptance criteria

- [ ] Navigating to `/login` renders `ScreenLogin` with email input and submit button.
- [ ] Submitting a valid email shows the `ConfirmationCard` confirmation state.
- [ ] Clicking a magic link from Resend redirects to `/` and the user is authenticated.
- [ ] Session persists after closing and reopening the browser tab.
- [ ] Logging out clears the session and redirects to `/login`.
- [ ] Unauthenticated requests to protected routes redirect to `/login`.
- [ ] Playwright global setup authenticates via the `Credentials` bypass and saves `storageState`; a smoke test asserts that a protected route returns 200 when loaded with saved auth state.
- [ ] `PLAYWRIGHT=true` is absent from `.env.production` and Vercel production env vars.

## Blocked by

- Blocked by `issues/001-project-scaffold.md`
- Blocked by `issues/002-db-schema-and-seed.md` (NextAuth adapter needs the DB tables)

## User stories addressed

- User story 1 (magic link login)
- User story 2 (redirect to home after clicking link)
- User story 3 (session persists across browser restarts)
- User story 35 (sign up with email only)
- User story 36 (data is private)
- User story 37 (progression state is independent)
