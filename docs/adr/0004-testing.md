# ADR 0004 — E2E-First TDD with Playwright

## Status
Accepted

## Context
This is a personal app with a clear user flow (step-by-step workout sessions). The most valuable tests verify that flow end-to-end, not isolated units. Development should be test-driven.

## Decision
- **Playwright** for e2e tests, run against the local Next.js dev server.
- Tests live in `/e2e/`, written before or alongside each feature (TDD).
- `npx playwright test --ui` is the primary development loop — Playwright's UI mode gives watch-mode interactivity equivalent to Jest `--watch`.
- No separate unit test framework — component logic is simple enough to be covered by e2e tests.

## Alternatives considered
- Jest/Vitest + React Testing Library: better for isolated unit logic, but this app's complexity lives in the user flow (timer, TTS, progression updates), not individual functions.
- Cypress: comparable to Playwright but Playwright has better mobile viewport simulation, which matters for a phone-first app.

## Consequences
Slower test feedback loop than unit tests, but the tests verify what actually matters: the workout session flow works on a real browser. Mobile viewport tests in Playwright give confidence before deploying to phone.
