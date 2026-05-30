'use client';

import { PhoneFooterBar } from '@/components/ui/phone-footer-bar';
import { RKButton } from '@/components/ui/rk-button';
import { Icons } from '@/components/ui/rk-icons';
import type { ExerciseProgress } from '@/lib/progress-repository';
import type { ExerciseResult } from '@/lib/session-machine';

type Props = {
  exercises: ExerciseProgress[];
  exerciseResults: ExerciseResult[];
  levelUpCount: number;
  onDone: () => void;
};

export function SessionCompleteScreen({ exercises, exerciseResults, levelUpCount, onDone }: Props) {
  const totalSets = exerciseResults.reduce((sum, r) => sum + r.sets.length, 0);
  const byId = new Map(exercises.map((ex) => [ex.exerciseId, ex]));

  return (
    <div data-testid="session-complete-screen" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ padding: '24px 28px 0', flexShrink: 0 }}>
        <div style={{
          fontFamily: 'var(--rk-mono)', fontSize: 11, fontWeight: 500,
          color: 'var(--rk-accent)', letterSpacing: 1.4, textTransform: 'uppercase',
        }}>
          Session complete
        </div>
        <h1 style={{
          fontSize: 44, fontWeight: 600, lineHeight: 0.95, margin: '10px 0 0', letterSpacing: -1.6,
          fontFamily: 'var(--rk-font)',
        }}>
          That's the work.
        </h1>
        <div style={{ display: 'flex', gap: 24, marginTop: 20, marginBottom: 4 }}>
          <KPI label="Sets logged" value={String(totalSets)} />
          <KPI label="Level ups" value={String(levelUpCount)} accent={levelUpCount > 0} />
        </div>
      </div>

      <div style={{ flex: 1, padding: '12px 28px 0', overflowY: 'auto', minHeight: 0 }}>
        <div style={{
          fontFamily: 'var(--rk-mono)', fontSize: 10, color: 'var(--rk-text-muted)',
          letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10,
        }}>
          Breakdown
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {exerciseResults.map((result) => {
            const ex = byId.get(result.exerciseId);
            if (!ex) return null;
            const target = ex.currentReps;
            return (
              <div
                key={result.exerciseId}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
                  borderBottom: '1px solid var(--rk-line-2)',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: -0.2 }}>
                    {ex.name}
                  </div>
                  <div style={{
                    fontFamily: 'var(--rk-mono)', fontSize: 11, color: 'var(--rk-text-dim)', marginTop: 2,
                  }}>
                    target {target}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {result.sets.map((reps, i) => (
                    <span
                      key={i}
                      style={{
                        width: 30, height: 30, borderRadius: 8,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--rk-mono)', fontSize: 13, fontWeight: 500,
                        background: reps >= target ? 'var(--rk-surface-2)' : 'transparent',
                        border: '1px solid var(--rk-line)',
                        color: reps >= target ? 'var(--rk-text)' : 'var(--rk-text-dim)',
                      }}
                    >
                      {reps}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ height: 16 }} />
      </div>

      <PhoneFooterBar>
        <RKButton onClick={onDone} iconRight={<Icons.check size={20} />}>
          Done
        </RKButton>
      </PhoneFooterBar>
    </div>
  );
}

function KPI({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div style={{
        fontFamily: 'var(--rk-mono)', fontSize: 10, color: 'var(--rk-text-muted)',
        letterSpacing: 1.2, textTransform: 'uppercase',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--rk-mono)', fontVariantNumeric: 'tabular-nums',
        fontSize: 26, fontWeight: 500, marginTop: 4, letterSpacing: -0.5,
        color: accent ? 'var(--rk-accent)' : 'var(--rk-text)',
      }}>
        {value}
      </div>
    </div>
  );
}
