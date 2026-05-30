import { getDb } from './db';
import { exercises, userProgress, workoutSessions, workoutSets } from './schema';
import { eq, and, asc, desc, inArray } from 'drizzle-orm';

export type ExerciseProgress = {
  exerciseId: number;
  name: string;
  tutorialUrl: string;
  progressionCount: number;
  rangeMin: number;
  rangeMax: number;
  restSeconds: number;
  progressionLevel: number;
  currentReps: number;
};

export async function getUserProgress(userId: string): Promise<ExerciseProgress[]> {
  const db = getDb();

  const [allExercises, progressRows] = await Promise.all([
    db.select().from(exercises).orderBy(asc(exercises.sortOrder)),
    db.select().from(userProgress).where(eq(userProgress.userId, userId)),
  ]);

  if (progressRows.length === 0 && allExercises.length > 0) {
    await db.insert(userProgress).values(
      allExercises.map((ex) => ({
        userId,
        exerciseId: ex.id,
        progressionLevel: 1,
        currentReps: ex.rangeMin,
      })),
    );
    return allExercises.map((ex) => ({
      exerciseId: ex.id,
      name: ex.name,
      tutorialUrl: ex.tutorialUrl,
      progressionCount: ex.progressionCount,
      rangeMin: ex.rangeMin,
      rangeMax: ex.rangeMax,
      restSeconds: ex.restSeconds,
      progressionLevel: 1,
      currentReps: ex.rangeMin,
    }));
  }

  const progressByExercise = new Map(progressRows.map((p) => [p.exerciseId, p]));

  return allExercises.map((ex) => {
    const p = progressByExercise.get(ex.id);
    return {
      exerciseId: ex.id,
      name: ex.name,
      tutorialUrl: ex.tutorialUrl,
      progressionCount: ex.progressionCount,
      rangeMin: ex.rangeMin,
      rangeMax: ex.rangeMax,
      restSeconds: ex.restSeconds,
      progressionLevel: p?.progressionLevel ?? 1,
      currentReps: p?.currentReps ?? ex.rangeMin,
    };
  });
}

export async function createSession(userId: string): Promise<number> {
  const db = getDb();
  const [row] = await db.insert(workoutSessions).values({ userId }).returning({ id: workoutSessions.id });
  return row.id;
}

export async function logSet(
  sessionId: number,
  exerciseId: number,
  setNumber: number,
  repsCompleted: number,
): Promise<void> {
  const db = getDb();
  await db.insert(workoutSets).values({ sessionId, exerciseId, setNumber, repsCompleted });
}

export async function updateExerciseProgress(
  userId: string,
  exerciseId: number,
  patch: { progressionLevel?: number; currentReps?: number },
) {
  const db = getDb();
  await db
    .update(userProgress)
    .set({ ...patch, updatedAt: new Date() })
    .where(and(eq(userProgress.userId, userId), eq(userProgress.exerciseId, exerciseId)));
}

export async function completeSession(sessionId: number): Promise<void> {
  const db = getDb();
  await db
    .update(workoutSessions)
    .set({ completedAt: new Date() })
    .where(eq(workoutSessions.id, sessionId));
}

export type SessionExerciseData = {
  exerciseId: number;
  name: string;
  sets: number[];
};

export type SessionSummary = {
  id: number;
  startedAt: Date;
  completedAt: Date | null;
  exercises: SessionExerciseData[];
};

export async function getSessions(userId: string): Promise<SessionSummary[]> {
  const db = getDb();

  const sessionRows = await db
    .select()
    .from(workoutSessions)
    .where(eq(workoutSessions.userId, userId))
    .orderBy(desc(workoutSessions.startedAt));

  if (sessionRows.length === 0) return [];

  const sessionIds = sessionRows.map((s) => s.id);

  const setRows = await db
    .select({
      sessionId: workoutSets.sessionId,
      exerciseId: workoutSets.exerciseId,
      exerciseName: exercises.name,
      sortOrder: exercises.sortOrder,
      setNumber: workoutSets.setNumber,
      repsCompleted: workoutSets.repsCompleted,
    })
    .from(workoutSets)
    .innerJoin(exercises, eq(workoutSets.exerciseId, exercises.id))
    .where(inArray(workoutSets.sessionId, sessionIds))
    .orderBy(asc(workoutSets.sessionId), asc(exercises.sortOrder), asc(workoutSets.setNumber));

  const setsBySession = new Map<number, Map<number, { name: string; sets: number[] }>>();

  for (const row of setRows) {
    if (!setsBySession.has(row.sessionId)) {
      setsBySession.set(row.sessionId, new Map());
    }
    const byExercise = setsBySession.get(row.sessionId)!;
    if (!byExercise.has(row.exerciseId)) {
      byExercise.set(row.exerciseId, { name: row.exerciseName, sets: [] });
    }
    byExercise.get(row.exerciseId)!.sets.push(row.repsCompleted);
  }

  return sessionRows.map((session) => ({
    id: session.id,
    startedAt: session.startedAt,
    completedAt: session.completedAt,
    exercises: Array.from(setsBySession.get(session.id)?.entries() ?? []).map(
      ([exerciseId, data]) => ({ exerciseId, name: data.name, sets: data.sets }),
    ),
  }));
}
