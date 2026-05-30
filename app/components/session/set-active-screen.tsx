'use client';

import { ExerciseProgressDots } from '@/components/ui/exercise-progress-dots';
import { PhoneFooterBar } from '@/components/ui/phone-footer-bar';
import { RKButton } from '@/components/ui/rk-button';
import { Icons } from '@/components/ui/rk-icons';
import type { ExerciseProgress } from '@/lib/progress-repository';

type Props = {
  exercise: ExerciseProgress;
  exerciseIndex: number;
  totalExercises: number;
  setNumber: number;
  goal: number;
  reps: number;
  doneExerciseIndices: number[];
  onSetReps: (reps: number) => void;
  onDone: () => void;
  onClose: () => void;
};

export function SetActiveScreen({
  exercise,
  exerciseIndex,
  totalExercises,
  setNumber,
  goal,
  reps,
  doneExerciseIndices,
  onSetReps,
  onDone,
  onClose,
}: Props) {
  const diff = reps - goal;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Top bar */}
      <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <button
          onClick={onClose}
          aria-label="Close session"
          style={{
            width: 44, height: 44, borderRadius: 12, background: 'transparent', border: 'none',
            color: 'var(--rk-text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', marginLeft: -10,
          }}
        >
          <Icons.x size={22} />
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <ExerciseProgressDots
            count={totalExercises}
            current={exerciseIndex}
            done={doneExerciseIndices}
          />
          <div style={{ fontFamily: 'var(--rk-mono)', fontSize: 11, color: 'var(--rk-text-muted)', letterSpacing: 1.2, textTransform: 'uppercase' }}>
            {exercise.name}
          </div>
        </div>
        <div style={{ width: 44 }} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '30px 28px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: 14, color: 'var(--rk-text-dim)', fontFamily: 'var(--rk-mono)',
              letterSpacing: 1.5, textTransform: 'uppercase',
            }}
            data-testid="set-counter"
          >
            Set {setNumber} of 3
          </div>
          <div
            style={{ fontFamily: 'var(--rk-mono)', fontSize: 13, color: 'var(--rk-text-muted)', marginTop: 8 }}
          >
            Goal · {goal} reps
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Rep counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <RepStepperBtn onClick={() => onSetReps(reps - 1)} aria-label="Decrease reps">
            <Icons.minus size={28} />
          </RepStepperBtn>
          <div
            data-testid="rep-count"
            style={{
              minWidth: 150, textAlign: 'center',
              fontFamily: 'var(--rk-mono)', fontVariantNumeric: 'tabular-nums',
              fontSize: 128, fontWeight: 500, lineHeight: 0.95, letterSpacing: -3,
              color: 'var(--rk-text)',
            }}
          >
            {reps}
          </div>
          <RepStepperBtn onClick={() => onSetReps(reps + 1)} aria-label="Increase reps">
            <Icons.plus size={28} />
          </RepStepperBtn>
        </div>

        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span style={{ fontFamily: 'var(--rk-mono)', fontSize: 12, color: 'var(--rk-text-muted)', letterSpacing: 0.4 }}>
            {diff === 0 ? 'matches goal' : diff > 0 ? `+${diff} over goal` : `${Math.abs(diff)} below goal`}
          </span>
        </div>

        <div style={{ flex: 1 }} />
      </div>

      <PhoneFooterBar>
        <RKButton onClick={onDone} iconRight={<Icons.check size={22} />}>
          Done — log set
        </RKButton>
      </PhoneFooterBar>
    </div>
  );
}

function RepStepperBtn({
  children,
  onClick,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  'aria-label': string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 84, height: 84, borderRadius: 28,
        background: 'var(--rk-surface)', border: '1px solid var(--rk-line)',
        color: 'var(--rk-text)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform .08s, background .12s',
      }}
    >
      {children}
    </button>
  );
}
