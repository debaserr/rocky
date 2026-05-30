# ADR 0005 — E2E Test Infrastructure: Test Database Branch + Auth Bypass

## Status
Accepted

## Context
Playwright e2e tests run against a real Next.js server and a real database. Tests must not pollute the production or development database, and they cannot go through the magic link email flow (no inbox to click in CI or during local TDD).

## Decision

### Test database isolation
- A separate Neon database branch (`test`) is used for all e2e tests.
- The branch URL is provided via a `DATABASE_URL_TEST` environment variable, never `DATABASE_URL`.
- Playwright's global setup script runs before the suite: applies migrations, truncates app tables, and seeds known fixture data (the 6 exercises + a test user with fixed progression state).
- Tests rely on this known fixture state — no test creates data without cleaning up after itself.

### Auth bypass
- A `Credentials` provider is added to the NextAuth config, but only when `PLAYWRIGHT=true` is set in the environment. It accepts a fixed test email and returns a valid session without sending any email.
- Playwright's global setup logs in via this provider and saves the resulting session cookies to `storageState`.
- All test specs load `storageState` in their `use` config and start pre-authenticated — no test touches the login flow unless it is specifically testing auth.
- The `Credentials` provider must never be present in production. This is enforced by the `PLAYWRIGHT=true` gate — the condition must be checked at NextAuth config initialisation time, not at runtime per-request.

## Alternatives considered
- Mocking the database at the module level: hides real DB behaviour; we've already decided tests should hit a real database (see ADR 0004).
- Docker Postgres for tests: more portable than a Neon branch, but requires Docker in CI and diverges from the production database engine configuration.
- Intercepting `/api/auth` calls via `page.route()`: brittle — tightly coupled to NextAuth's internal URL structure.
- Seeding a fixed test user via a one-time migration in the test branch: simpler than the Credentials provider, but doesn't produce a real NextAuth session, so session-dependent behaviour can't be tested.

## Consequences
- `PLAYWRIGHT=true` must never be set in production deployments. This should be documented and enforced in CI pipeline configuration.
- The test branch schema must be kept in sync with the main branch. The global setup script's migration step handles this automatically.
- Tests are deterministic because they always start from the same seeded state. Order-dependent tests are a bug.
