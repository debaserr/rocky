'use client';

import { ExerciseProgressDots } from '@/components/ui/exercise-progress-dots';
import { PhoneFooterBar } from '@/components/ui/phone-footer-bar';
import { RKButton } from '@/components/ui/rk-button';
import { RKLabel } from '@/components/ui/rk-label';
import { Icons } from '@/components/ui/rk-icons';
import type { ExerciseProgress } from '@/lib/progress-repository';

type Props = {
  exercise: ExerciseProgress;
  exerciseIndex: number;
  totalExercises: number;
  goal: number;
  doneExerciseIndices: number[];
  onStartSet: () => void;
  onClose: () => void;
};

export function ExerciseIntroScreen({
  exercise,
  exerciseIndex,
  totalExercises,
  goal,
  doneExerciseIndices,
  onStartSet,
  onClose,
}: Props) {
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
        </div>
        <div style={{ width: 44 }} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '20px 28px 0', display: 'flex', flexDirection: 'column' }}>
        <RKLabel>Exercise {exerciseIndex + 1} of {totalExercises}</RKLabel>
        <h1
          style={{
            fontSize: 56, fontWeight: 600, lineHeight: 0.95, margin: '12px 0 0',
            letterSpacing: -2.2, color: 'var(--rk-text)', fontFamily: 'var(--rk-font)',
          }}
        >
          {exercise.name}.
        </h1>

        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Stat label="Progression" value={`Level ${exercise.progressionLevel}`} />
          <Stat label="Today's goal" value={`3 × ${goal} reps`} accent />
        </div>

        <div style={{ flex: 1 }} />

        <a
          href={exercise.tutorialUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--rk-text-dim)', font: '500 14px var(--rk-mono)',
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 0',
            alignSelf: 'flex-start', textDecoration: 'none',
          }}
        >
          <span style={{ borderBottom: '1px solid var(--rk-text-dim)' }}>How to do this exercise</span>
          <Icons.ext size={13} />
        </a>
      </div>

      <PhoneFooterBar>
        <RKButton onClick={onStartSet} iconRight={<Icons.arrowRight size={20} />}>
          Start set 1
        </RKButton>
      </PhoneFooterBar>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div style={{ marginBottom: 4 }}><RKLabel>{label}</RKLabel></div>
      <div
        style={{
          fontSize: 22, fontWeight: 500,
          color: accent ? 'var(--rk-accent)' : 'var(--rk-text)',
          lineHeight: 1.3, letterSpacing: -0.3,
          fontFamily: accent ? 'var(--rk-mono)' : 'var(--rk-font)',
        }}
      >
        {value}
      </div>
    </div>
  );
}
