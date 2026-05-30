'use client';

import { useState } from 'react';
import type { ExerciseProgress } from '@/lib/progress-repository';

export function ExerciseCard({ exercise }: { exercise: ExerciseProgress }) {
  const [level, setLevel] = useState(exercise.progressionLevel);
  const [reps, setReps] = useState(exercise.currentReps);

  async function patchLevel(newLevel: number) {
    setLevel(newLevel);
    await fetch(`/api/progress/${exercise.exerciseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progressionLevel: newLevel }),
    });
  }

  async function patchReps(delta: number) {
    const newReps = Math.max(exercise.rangeMin, Math.min(exercise.rangeMax, reps + delta));
    if (newReps === reps) return;
    setReps(newReps);
    await fetch(`/api/progress/${exercise.exerciseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentReps: newReps }),
    });
  }

  const levelNums = Array.from({ length: exercise.progressionCount }, (_, i) => i + 1);

  return (
    <div
      data-exercise={exercise.name}
      style={{
        padding: '14px 0',
        borderBottom: '1px solid var(--rk-line-2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: -0.2, color: 'var(--rk-text)' }}>
        {exercise.name}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        {/* Level selector */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--rk-mono)',
              fontSize: 10,
              color: 'var(--rk-text-muted)',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            Level
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {levelNums.map((l) => (
              <button
                key={l}
                data-testid="level-btn"
                onClick={() => patchLevel(l)}
                style={{
                  width: 36,
                  height: 48,
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: l === level ? 'var(--rk-accent)' : 'var(--rk-surface)',
                  color: l === level ? 'var(--rk-accent-ink)' : 'var(--rk-text-dim)',
                  border:
                    '1px solid ' + (l === level ? 'var(--rk-accent)' : 'var(--rk-line)'),
                  font: '500 14px var(--rk-mono)',
                  flexShrink: 0,
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Rep stepper */}
        <div style={{ width: 130, flexShrink: 0 }}>
          <div
            style={{
              fontFamily: 'var(--rk-mono)',
              fontSize: 10,
              color: 'var(--rk-text-muted)',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            Reps
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 48,
              background: 'var(--rk-surface)',
              border: '1px solid var(--rk-line)',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <button
              data-testid="reps-dec"
              onClick={() => patchReps(-1)}
              aria-label={`Decrease reps for ${exercise.name}`}
              style={{
                minWidth: 48,
                height: 48,
                background: 'transparent',
                border: 'none',
                color: 'var(--rk-text-dim)',
                cursor: 'pointer',
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              −
            </button>
            <div
              data-testid="reps-value"
              style={{
                flex: 1,
                textAlign: 'center',
                fontFamily: 'var(--rk-mono)',
                fontSize: 16,
                fontWeight: 500,
                color: 'var(--rk-text)',
              }}
            >
              {reps}
            </div>
            <button
              data-testid="reps-inc"
              onClick={() => patchReps(1)}
              aria-label={`Increase reps for ${exercise.name}`}
              style={{
                minWidth: 48,
                height: 48,
                background: 'transparent',
                border: 'none',
                color: 'var(--rk-text-dim)',
                cursor: 'pointer',
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
