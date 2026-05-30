'use client';

import { ExerciseProgressDots } from '@/components/ui/exercise-progress-dots';
import { PhoneFooterBar } from '@/components/ui/phone-footer-bar';
import { RKLabel } from '@/components/ui/rk-label';
import { Icons } from '@/components/ui/rk-icons';
import { useRestTimer } from '@/lib/use-rest-timer';
import type { ExerciseProgress } from '@/lib/progress-repository';

type Props = {
  exercise: ExerciseProgress;
  exerciseIndex: number;
  totalExercises: number;
  nextSetNumber: number;
  doneExerciseIndices: number[];
  onSkip: () => void;
  onClose: () => void;
};

export function RestingScreen({
  exercise,
  exerciseIndex,
  totalExercises,
  nextSetNumber,
  doneExerciseIndices,
  onSkip,
  onClose,
}: Props) {
  const { secondsRemaining, skip } = useRestTimer(exercise.restSeconds, onSkip);

  const mm = String(Math.floor(secondsRemaining / 60)).padStart(1, '0');
  const ss = String(secondsRemaining % 60).padStart(2, '0');
  const time = `${mm}:${ss}`;
  const pct = Math.max(0, Math.min(1, 1 - secondsRemaining / exercise.restSeconds));

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
      <div style={{ flex: 1, padding: '30px 28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <RKLabel>Rest</RKLabel>
        <div style={{ fontSize: 20, fontWeight: 500, marginTop: 10, color: 'var(--rk-text-dim)' }}>
          Set {nextSetNumber} of 3 coming up
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <RestRing time={time} pct={pct} />
        </div>
      </div>

      <PhoneFooterBar>
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={skip}
            data-testid="skip-rest"
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer', padding: '14px 24px',
              color: 'var(--rk-text-dim)', font: '500 14px var(--rk-mono)', letterSpacing: 0.4,
              textTransform: 'uppercase',
            }}
          >
            Skip rest →
          </button>
        </div>
      </PhoneFooterBar>
    </div>
  );
}

function RestRing({ time, pct }: { time: string; pct: number }) {
  const size = 260, sw = 8, r = (size - sw) / 2, c = 2 * Math.PI * r;
  return (
    <div data-testid="rest-ring" style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--rk-surface-2)" strokeWidth={sw} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--rk-accent)" strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * pct}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <div style={{
          fontFamily: 'var(--rk-mono)', fontVariantNumeric: 'tabular-nums',
          fontSize: 76, fontWeight: 500, lineHeight: 1, letterSpacing: -2,
        }}>{time}</div>
        <div style={{ fontFamily: 'var(--rk-mono)', fontSize: 11, color: 'var(--rk-text-muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 4 }}>
          remaining
        </div>
      </div>
    </div>
  );
}
