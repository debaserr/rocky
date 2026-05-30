# 001 — Project Scaffold

## Parent PRD

[PRD.md](../PRD.md)

## What to build

Bootstrap the full technology stack so every subsequent slice has a working foundation to build on. By the end of this slice a deployed Vercel URL exists, a database connection is live, and a Playwright test can run against a separate test DB branch.

Specific setup tasks:

- **Next.js 16 App Router** project with TypeScript.
- **Drizzle ORM** wired to **Neon** (serverless Postgres). `DATABASE_URL` for dev/prod; `DATABASE_URL_TEST` for a separate Neon branch used only by Playwright.
- **NextAuth** package installed and `[...nextauth]` route scaffolded — no email provider configured yet (that's slice 003).
- **shadcn/ui + Tailwind CSS** initialised. Apply the theme from `ux/rocky-theme.jsx`: dark background, lime accent (`--rk-accent`), Space Grotesk (body) + JetBrains Mono (numbers/timers) typefaces, and the full `--rk-*` CSS custom property set.
- Shared UI primitives from `ux/rocky-ui.jsx` — `RKButton`, `RKCard`, `RKLabel`, `PhoneFooterBar`, `Icons` — ported to shadcn/Radix/Tailwind components under `components/ui/`.
- **Playwright** configured: `playwright.config.ts` pointing at `http://localhost:3000`, global setup file (stub — full auth wiring comes in slice 003), `DATABASE_URL_TEST` injected via env.
- `GET /api/healthz` returns `{ ok: true, db: "connected" }` — Playwright smoke test asserts 200.
- **Vercel** project created and linked; `main` deploys automatically.

## Acceptance criteria

- [ ] `npm run dev` starts without errors.
- [ ] `GET /api/healthz` returns `200 { ok: true, db: "connected" }` against both dev and test DB branches.
- [ ] `npx playwright test` runs (and the healthz smoke test passes) against a local dev server.
- [ ] A Vercel preview URL exists and the healthz endpoint responds there too.
- [ ] The `--rk-*` CSS custom properties from `ux/rocky-theme.jsx` are defined globally and lime + athletic defaults are active.
- [ ] Shared primitives (`RKButton`, `RKCard`, `RKLabel`, `PhoneFooterBar`, `Icons`) exist under `components/ui/` and render without errors.

## Blocked by

None — can start immediately.

## User stories addressed

This slice is infrastructure. It is a prerequisite for all user-facing stories.
