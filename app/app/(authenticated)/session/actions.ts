'use server';

import { createSession, logSet, updateExerciseProgress, completeSession } from '@/lib/progress-repository';

export async function startSessionAction(userId: string): Promise<number> {
  return createSession(userId);
}

export async function logSetAction(
  sessionId: number,
  exerciseId: number,
  setNumber: number,
  repsCompleted: number,
): Promise<void> {
  await logSet(sessionId, exerciseId, setNumber, repsCompleted);
}

export async function updateProgressAction(
  userId: string,
  exerciseId: number,
  patch: { currentReps: number; progressionLevel: number },
): Promise<void> {
  await updateExerciseProgress(userId, exerciseId, patch);
}

export async function completeSessionAction(sessionId: number): Promise<void> {
  await completeSession(sessionId);
}
