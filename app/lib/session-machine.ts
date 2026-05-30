import type { ExerciseProgress } from './progress-repository';

export type SessionPhase =
  | 'idle'
  | 'exercise_intro'
  | 'set_active'
  | 'logging_reps'
  | 'resting'
  | 'evaluating'
  | 'feedback'
  | 'session_complete';

export type ExerciseResult = {
  exerciseId: number;
  sets: number[];
};

export type SessionState = {
  phase: SessionPhase;
  exerciseIndex: number;
  setNumber: number;
  reps: number;
  setResults: number[];
  sessionId: number | null;
  doneExerciseIndices: number[];
  exercises: ExerciseProgress[];
  lastLeveledUp: boolean;
  lastNewLevel: number;
  lastNewReps: number;
  exerciseResults: ExerciseResult[];
  levelUpCount: number;
};

export type SessionAction =
  | { type: 'START'; sessionId: number; exercises: ExerciseProgress[] }
  | { type: 'START_SET' }
  | { type: 'DONE_SET' }
  | { type: 'SET_REPS'; reps: number }
  | { type: 'LOG_SET' }
  | { type: 'SKIP_REST' }
  | { type: 'EVALUATION_DONE'; newReps: number; newLevel: number; leveledUp: boolean; improved: boolean }
  | { type: 'FEEDBACK_DONE' };

export const INITIAL_SESSION_STATE: SessionState = {
  phase: 'idle',
  exerciseIndex: 0,
  setNumber: 1,
  reps: 0,
  setResults: [],
  sessionId: null,
  doneExerciseIndices: [],
  exercises: [],
  lastLeveledUp: false,
  lastNewLevel: 0,
  lastNewReps: 0,
  exerciseResults: [],
  levelUpCount: 0,
};

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'START': {
      const first = action.exercises[0];
      return {
        ...state,
        phase: 'exercise_intro',
        sessionId: action.sessionId,
        exercises: action.exercises,
        exerciseIndex: 0,
        setNumber: 1,
        setResults: [],
        doneExerciseIndices: [],
        exerciseResults: [],
        levelUpCount: 0,
        reps: first ? first.currentReps + 1 : 0,
      };
    }

    case 'START_SET':
      return { ...state, phase: 'set_active' };

    case 'DONE_SET':
      return { ...state, phase: 'logging_reps' };

    case 'SET_REPS': {
      const ex = state.exercises[state.exerciseIndex];
      const clamped = Math.max(0, Math.min(ex?.rangeMax ?? Infinity, action.reps));
      return { ...state, reps: clamped };
    }

    case 'LOG_SET':
      return {
        ...state,
        phase: 'resting',
        setResults: [...state.setResults, state.reps],
      };

    case 'SKIP_REST': {
      if (state.setNumber < 3) {
        const ex = state.exercises[state.exerciseIndex];
        return {
          ...state,
          phase: 'set_active',
          setNumber: state.setNumber + 1,
          reps: ex ? ex.currentReps + 1 : 0,
        };
      }
      return { ...state, phase: 'evaluating' };
    }

    case 'EVALUATION_DONE': {
      const updatedExercises = state.exercises.map((ex, i) =>
        i === state.exerciseIndex
          ? { ...ex, currentReps: action.newReps, progressionLevel: action.newLevel }
          : ex,
      );
      const doneExerciseIndices = [...state.doneExerciseIndices, state.exerciseIndex];
      const currentEx = state.exercises[state.exerciseIndex];
      const exerciseResults = [
        ...state.exerciseResults,
        { exerciseId: currentEx?.exerciseId ?? 0, sets: [...state.setResults] },
      ];
      return {
        ...state,
        exercises: updatedExercises,
        doneExerciseIndices,
        exerciseResults,
        levelUpCount: state.levelUpCount + (action.leveledUp ? 1 : 0),
        phase: 'feedback',
        lastLeveledUp: action.leveledUp,
        lastNewLevel: action.newLevel,
        lastNewReps: action.newReps,
      };
    }

    case 'FEEDBACK_DONE': {
      const nextIndex = state.exerciseIndex + 1;
      if (nextIndex >= state.exercises.length) {
        return { ...state, phase: 'session_complete' };
      }
      const nextEx = state.exercises[nextIndex];
      return {
        ...state,
        phase: 'exercise_intro',
        exerciseIndex: nextIndex,
        setNumber: 1,
        setResults: [],
        reps: nextEx ? nextEx.currentReps + 1 : 0,
      };
    }

    default:
      return state;
  }
}
