export type ProgressionResult = {
  newReps: number;
  newLevel: number;
  leveledUp: boolean;
  improved: boolean;
};

export function evaluateProgression(params: {
  currentReps: number;
  currentLevel: number;
  rangeMin: number;
  rangeMax: number;
  set1: number;
  set2: number;
  set3: number;
}): ProgressionResult {
  const { currentReps, currentLevel, rangeMin, rangeMax, set1, set2, set3 } = params;
  const achieved = Math.min(set1, set2, set3);

  if (achieved <= currentReps) {
    return { newReps: currentReps, newLevel: currentLevel, leveledUp: false, improved: false };
  }

  if (achieved >= rangeMax) {
    return { newReps: rangeMin, newLevel: currentLevel + 1, leveledUp: true, improved: true };
  }

  return { newReps: achieved, newLevel: currentLevel, leveledUp: false, improved: true };
}
