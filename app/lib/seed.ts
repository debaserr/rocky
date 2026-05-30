import { getDb } from './db';
import { exercises } from './schema';

const EXERCISES = [
  { sortOrder: 1, name: 'Deadbugs',  tutorialUrl: 'https://nick-e.com/deadbug/',     restSeconds: 60,  rangeMin: 6, rangeMax: 10, progressionCount: 9  },
  { sortOrder: 2, name: 'Bird dog',  tutorialUrl: 'https://nick-e.com/bird-dog/',    restSeconds: 60,  rangeMin: 6, rangeMax: 10, progressionCount: 9  },
  { sortOrder: 3, name: 'Push-ups',  tutorialUrl: 'https://nick-e.com/push-up/',     restSeconds: 120, rangeMin: 5, rangeMax: 12, progressionCount: 10 },
  { sortOrder: 4, name: 'Rows',      tutorialUrl: 'https://nick-e.com/row/',         restSeconds: 120, rangeMin: 5, rangeMax: 12, progressionCount: 10 },
  { sortOrder: 5, name: 'Squats',    tutorialUrl: 'https://nick-e.com/squat/',       restSeconds: 90,  rangeMin: 8, rangeMax: 15, progressionCount: 10 },
  { sortOrder: 6, name: 'Bridges',   tutorialUrl: 'https://nick-e.com/glutebridge/', restSeconds: 90,  rangeMin: 8, rangeMax: 15, progressionCount: 10 },
];

export async function seed() {
  const db = getDb();
  await db.insert(exercises).values(EXERCISES).onConflictDoNothing({ target: exercises.sortOrder });
}
