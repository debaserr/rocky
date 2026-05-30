# 008 — Level-Up Notification and Encouragement

## Parent PRD

[PRD.md](../PRD.md)

## What to build

After the progression evaluator runs following an exercise's third set, show the appropriate feedback screen before moving to the next exercise intro.

**Two outcomes to handle:**

1. **Level-up** (`leveledUp === true`): show `ScreenLevelUp` from `ux/rocky-screens-2.jsx`.
2. **No level-up** (including improvement without level-up, and no improvement): show a brief encouragement card before the next exercise intro.

**`ScreenLevelUp` design** (`ux/rocky-screens-2.jsx`):
- Old level chip → new level chip (e.g. "Level 2" → "Level 3"), with a transition arrow between them.
- New rep target displayed ("Starting at 5 reps").
- Celebratory copy — e.g. "You levelled up!".
- **Known issue in PRD:** the mockup copy needs a fix — confirm the exact copy during implementation and do not reproduce any placeholder text verbatim from the mockup.
- A "Continue →" button advances to the next `exercise_intro` state.

**Encouragement card** (no dedicated mockup — use `RKCard` + `RKLabel` primitives from `components/ui/`):
- Warm, brief message when the user didn't level up (improved or not).
- Auto-advances to the next `exercise_intro` after 2 seconds, or immediately on tap.
- Examples: _"Good work — keep showing up."_ / _"Solid set. See you next session."_

**State machine integration:** insert a new `feedback` state between `evaluating` and the next `exercise_intro`. The machine transitions:

```
evaluating → feedback → exercise_intro  (or session_complete if last exercise)
```

## Acceptance criteria

- [ ] When `leveledUp === true`, `ScreenLevelUp` is shown with the correct old and new level numbers and the reset rep target.
- [ ] `ScreenLevelUp` copy does not contain placeholder text from the mockup.
- [ ] "Continue →" button on `ScreenLevelUp` advances to the next exercise.
- [ ] When `leveledUp === false`, an encouragement card is shown briefly before auto-advancing (≤ 2 seconds).
- [ ] Encouragement card also advances immediately on tap.
- [ ] Playwright test (level-up path): use the test user's Push-ups state set to `current_reps = range_max - 1`; complete 3 sets at `range_max`; assert `ScreenLevelUp` appears with correct level chips.
- [ ] Playwright test (no level-up path): complete 3 sets below `range_max`; assert encouragement card appears and session advances.

## Blocked by

- Blocked by `issues/006-core-session-flow.md`

## User stories addressed

- User story 24 (celebratory message on level-up)
- User story 25 (warm encouragement when no improvement)
