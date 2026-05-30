# 004 — Home Screen and Navigation Shell

## Parent PRD

[PRD.md](../PRD.md)

## What to build

The authenticated landing screen and the persistent navigation shell that wraps every screen in the app.

**Home screen design:** implement `ScreenHome` from `ux/rocky-screens.jsx` using the `HomeCTAFirst` variant (recommended). The screen shows:
- A single prominent "Start session" CTA button (`RKButton` primary, full-width).
- A summary of the user's current progression state (exercise name + level chips) — data sourced from `user_progress`.
- `ExerciseProgressDots` primitive from `components/ui/` to display per-exercise progress.

**Navigation shell:** `PhoneFooterBar` from `components/ui/` with three tabs: Home, History, Settings. Active tab is highlighted with the lime accent. The shell wraps all authenticated routes via a shared layout.

**Wake Lock:** when the user taps "Start session", the app requests a `WakeLock` via the Wake Lock API before navigating to the session flow. If the API is unavailable (incognito, older Safari), the request fails silently — the session still starts normally.

**Layout:** mobile-first portrait layout matching the 390px column width from the design. On wider screens, the content column is centred with a max-width constraint. No sidebar nav is required for this slice.

## Acceptance criteria

- [ ] Authenticated users land on `/` and see the `HomeCTAFirst` home screen.
- [ ] Unauthenticated visits to `/` redirect to `/login`.
- [ ] The "Start session" button is visible and tappable without scrolling on a 390×844 viewport.
- [ ] `PhoneFooterBar` renders with Home, History, and Settings tabs; the active tab reflects the current route.
- [ ] Tapping "Start session" acquires a Wake Lock (verified in a Chromium Playwright test) before navigating to the session flow stub (`/session`).
- [ ] Wake Lock failure is caught silently — no error thrown or displayed to the user.
- [ ] `ExerciseProgressDots` renders a dot per exercise using live `user_progress` data for the authenticated test user.
- [ ] The page is usable in portrait mode at 390px width with no horizontal scroll.

## Blocked by

- Blocked by `issues/003-magic-link-auth.md`

## User stories addressed

- User story 4 (single prominent start button)
- User story 5 (screen stays on during session)
- User story 38 (usable in portrait on small screen)
- User story 39 (primary actions reachable with one thumb)
