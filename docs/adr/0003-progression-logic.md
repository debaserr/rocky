# ADR 0003 — Per-Set Rep Logging and Progression Logic

## Status
Accepted

## Context
The app logs reps per set and must decide when and how to advance progress. The logic must be intuitive for a workout context and consistent with the CLI command where possible.

## Decision
- Reps are logged **per set** (not once at the end of all sets).
- The app announces the **next goal** as `current_reps + 1` so the target is explicit.
- After all 3 sets, progress is evaluated as: `achieved = min(set1, set2, set3)`.
- If `achieved > current_reps`: progress updates to `achieved` (not just +1 — a strong day where all sets hit 8 when the goal was 6 advances to 8).
- If `achieved ≤ current_reps`: no update — "showing up is the work."
- If `achieved` equals the exercise's max reps: progression level increments by 1 and reps reset to the range minimum for that exercise.

## Alternatives considered
- Update to current+1 only: simpler but penalises strong sessions and feels unintuitive.
- CLI command logic (report once after all sets, update to whatever was reported): the per-set logging makes min-across-sets a more precise and honest measure.

## Consequences
Edge-case divergence from the CLI command: the CLI updates to whatever the user self-reports, while the app uses the minimum across sets. The settings page allows manual correction if the two ever drift.
