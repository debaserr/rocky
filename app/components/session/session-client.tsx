'use client';

import { useReducer, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { sessionReducer, INITIAL_SESSION_STATE } from '@/lib/session-machine';
import { evaluateProgression } from '@/lib/progression';
import { speak } from '@/lib/tts';
import { startSessionAction, logSetAction, updateProgressAction, completeSessionAction } from '@/app/(authenticated)/session/actions';
import { ExerciseIntroScreen } from './exercise-intro-screen';
import { SetActiveScreen } from './set-active-screen';
import { RestingScreen } from './resting-screen';
import { LevelUpScreen } from './level-up-screen';
import { EncouragementCard } from './encouragement-card';
import { SessionCompleteScreen } from './session-complete-screen';
import type { ExerciseProgress } from '@/lib/progress-repository';

type Props = {
  userId: string;
  exercises: ExerciseProgress[];
};

export function SessionClient({ userId, exercises }: Props) {
  const router = useRouter();
  const [state, dispatch] = useReducer(sessionReducer, INITIAL_SESSION_STATE);
  const prevPhaseRef = useRef(state.phase);

  // Start session on mount
  useEffect(() => {
    let cancelled = false;
    startSessionAction(userId).then((sessionId) => {
      if (!cancelled) {
        dispatch({ type: 'START', sessionId, exercises });
      }
    });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TTS on exercise_intro entry
  useEffect(() => {
    if (state.phase !== 'exercise_intro') return;
    const ex = state.exercises[state.exerciseIndex];
    if (!ex) return;
    const goal = ex.currentReps + 1;
    speak(`${ex.name}. Target ${goal} reps.`);
  }, [state.phase, state.exerciseIndex, state.exercises]);

  // TTS on resting → set_active
  useEffect(() => {
    const prev = prevPhaseRef.current;
    prevPhaseRef.current = state.phase;
    if (prev === 'resting' && state.phase === 'set_active') {
      speak(`Set ${state.setNumber} of 3. Go.`);
    }
  }, [state.phase, state.setNumber]);

  // Stamp completed_at when session finishes
  useEffect(() => {
    if (state.phase !== 'session_complete' || !state.sessionId) return;
    completeSessionAction(state.sessionId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  // Run evaluation when entering evaluating phase
  useEffect(() => {
    if (state.phase !== 'evaluating') return;
    const ex = state.exercises[state.exerciseIndex];
    if (!ex || state.setResults.length < 3) return;

    const result = evaluateProgression({
      currentReps: ex.currentReps,
      currentLevel: ex.progressionLevel,
      rangeMin: ex.rangeMin,
      rangeMax: ex.rangeMax,
      set1: state.setResults[0],
      set2: state.setResults[1],
      set3: state.setResults[2],
    });

    const finish = async () => {
      if (result.improved) {
        await updateProgressAction(userId, ex.exerciseId, {
          currentReps: result.newReps,
          progressionLevel: result.newLevel,
        });
      }
      dispatch({ type: 'EVALUATION_DONE', ...result });
    };

    finish();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  const currentExercise = state.exercises[state.exerciseIndex];
  const goal = currentExercise ? currentExercise.currentReps + 1 : 0;

  const handleLogSet = async () => {
    if (state.sessionId && currentExercise) {
      await logSetAction(state.sessionId, currentExercise.exerciseId, state.setNumber, state.reps);
    }
    dispatch({ type: 'LOG_SET' });
  };

  if (state.phase === 'idle') {
    return (
      <div style={{ padding: '24px 22px', color: 'var(--rk-text-dim)', fontFamily: 'var(--rk-mono)' }}>
        Starting session…
      </div>
    );
  }

  if (state.phase === 'session_complete') {
    return (
      <SessionCompleteScreen
        exercises={state.exercises}
        exerciseResults={state.exerciseResults}
        levelUpCount={state.levelUpCount}
        onDone={() => router.push('/')}
      />
    );
  }

  if (!currentExercise) return null;

  if (state.phase === 'evaluating') {
    return (
      <div style={{ padding: '24px 22px', color: 'var(--rk-text-dim)', fontFamily: 'var(--rk-mono)' }}>
        Saving progress…
      </div>
    );
  }

  if (state.phase === 'feedback') {
    const handleFeedbackDone = () => dispatch({ type: 'FEEDBACK_DONE' });
    if (state.lastLeveledUp) {
      return (
        <LevelUpScreen
          exerciseName={currentExercise.name}
          oldLevel={state.lastNewLevel - 1}
          newLevel={state.lastNewLevel}
          newReps={state.lastNewReps}
          onContinue={handleFeedbackDone}
        />
      );
    }
    return (
      <EncouragementCard
        exerciseIndex={state.exerciseIndex}
        onContinue={handleFeedbackDone}
      />
    );
  }

  if (state.phase === 'exercise_intro') {
    return (
      <ExerciseIntroScreen
        exercise={currentExercise}
        exerciseIndex={state.exerciseIndex}
        totalExercises={state.exercises.length}
        goal={goal}
        doneExerciseIndices={state.doneExerciseIndices}
        onStartSet={() => dispatch({ type: 'START_SET' })}
        onClose={() => router.push('/')}
      />
    );
  }

  if (state.phase === 'set_active') {
    return (
      <SetActiveScreen
        exercise={currentExercise}
        exerciseIndex={state.exerciseIndex}
        totalExercises={state.exercises.length}
        setNumber={state.setNumber}
        goal={goal}
        reps={state.reps}
        doneExerciseIndices={state.doneExerciseIndices}
        onSetReps={(reps) => dispatch({ type: 'SET_REPS', reps })}
        onDone={() => dispatch({ type: 'DONE_SET' })}
        onClose={() => router.push('/')}
      />
    );
  }

  if (state.phase === 'logging_reps') {
    return (
      <SetActiveScreen
        exercise={currentExercise}
        exerciseIndex={state.exerciseIndex}
        totalExercises={state.exercises.length}
        setNumber={state.setNumber}
        goal={goal}
        reps={state.reps}
        doneExerciseIndices={state.doneExerciseIndices}
        onSetReps={(reps) => dispatch({ type: 'SET_REPS', reps })}
        onDone={handleLogSet}
        onClose={() => router.push('/')}
      />
    );
  }

  if (state.phase === 'resting') {
    return (
      <RestingScreen
        exercise={currentExercise}
        exerciseIndex={state.exerciseIndex}
        totalExercises={state.exercises.length}
        nextSetNumber={state.setNumber + 1}
        doneExerciseIndices={state.doneExerciseIndices}
        onSkip={() => dispatch({ type: 'SKIP_REST' })}
        onClose={() => router.push('/')}
      />
    );
  }

  return null;
}
