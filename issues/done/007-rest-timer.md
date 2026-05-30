# 007 — Rest Timer

## Parent PRD

[PRD.md](../PRD.md)

## What to build

Replace the "Skip rest →" placeholder from slice 006 with a real countdown timer. The timer auto-starts after each set is logged, counts down to zero, plays an audio beep, announces the next set via TTS, and offers a skip button for early exit.

**Screen design:** implement `ScreenRestTimer` from `ux/rocky-screens.jsx` using the **`ring` variant** (SVG progress ring — recommended for production). The other variants (`numeric`, `bar`) exist in the mockup but are not required for production.

The screen shows:
- Large countdown display (JetBrains Mono typeface, from the theme).
- SVG ring depleting as time passes (lime accent stroke on dark background).
- "Skip rest →" button below the ring — advances immediately to the next set.
- Exercise name and upcoming set number as a subtitle.

**Rest Timer hook** (`lib/use-rest-timer.ts`):

```ts
interface RestTimer {
  secondsRemaining: number;
  isRunning: boolean;
  skip: () => void;
}
```

- Countdown starts automatically when the session machine enters the `resting` state.
- Duration is sourced from `exercises.rest_seconds` for the current exercise (60 / 90 / 120).
- On reaching zero: plays an audio beep (short 440 Hz tone via `AudioContext`, not TTS — more reliable on foreground regain) then calls `skip()` internally, advancing the machine to `set_active`.
- On `skip()` called by the user: advances immediately, no beep.
- Wake Lock remains held throughout the rest period.

**TTS on timer end:** when the timer hits zero and advances to `set_active`, TTS speaks: _"Set [n] of 3. Go."_ (same announcement as the normal set transition — already wired in slice 006).

## Acceptance criteria

- [ ] After tapping "Done — log set" on set 1 or 2, `ScreenRestTimer` (ring variant) appears and countdown begins automatically.
- [ ] Timer duration matches the current exercise: 60s (Deadbugs, Bird dog), 120s (Push-ups, Rows), 90s (Squats, Bridges).
- [ ] The SVG ring depletes smoothly as time passes.
- [ ] An audio beep plays when the timer reaches zero.
- [ ] TTS announces the next set after the beep.
- [ ] "Skip rest →" button advances to the next set immediately without a beep.
- [ ] Playwright `page.clock.fastForward` test: enter resting state, fast-forward clock past `rest_seconds`, assert the session machine has advanced to `set_active` and the beep AudioContext was created.
- [ ] Wake Lock is still held after the timer fires (assert `wakeLock` is not null).

## Blocked by

- Blocked by `issues/006-core-session-flow.md`

## User stories addressed

- User story 16 (rest timer starts automatically after logging a set)
- User story 17 (countdown visible)
- User story 18 (beep when rest ends)
- User story 19 (TTS announces next set when timer ends)
- User story 20 (rest duration matches exercise)
- User story 21 (skip rest early)
