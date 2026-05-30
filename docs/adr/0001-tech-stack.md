# ADR 0001 — Tech Stack: Next.js + Neon + NextAuth (email) + Vercel

## Status
Accepted

## Context
The app needs to be deployed and usable from a phone. It requires persistent per-user progress storage and authentication. It started as a Claude Code CLI command (markdown files on disk) but needs a real backend to be phone-accessible.

## Decision
- **Framework**: Next.js — API routes handle database access without a separate backend server.
- **Database**: Neon (serverless Postgres) — free tier is sufficient for a single-user personal app; integrates cleanly with Vercel.
- **Auth**: NextAuth with the Email provider (magic link / passwordless) — no password to manage, no OAuth dependency on a third party like Google.
- **Email sending**: Resend — simplest option for NextAuth's Email provider on Vercel.
- **ORM**: Drizzle — TypeScript-first, lightweight, works natively with Neon's Postgres driver. Used with `@auth/drizzle-adapter` so NextAuth manages its own tables (`users`, `sessions`, `verification_tokens`) within the same database.
- **Deployment**: Vercel — zero-config for Next.js.
- **UI**: shadcn/ui + Radix UI + Tailwind CSS — accessible primitives, copy-pasteable components, well-supported by Claude Code for implementation from Claude Design mockups.

## Alternatives considered
- Pure React + separate backend: adds operational complexity with no benefit for a personal app.
- localStorage: doesn't work across devices; ruled out when phone access became a requirement.
- Firebase/Firestore: more complex setup, vendor lock-in to Google's data model.
- Prisma: heavier than Drizzle, slower cold starts on Vercel serverless — matters for a Neon serverless connection.

## Consequences
The app is decoupled from the CLI command's markdown files. Progress must be seeded manually via a settings page when first deployed.
