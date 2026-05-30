'use client';

import { useState } from 'react';
import { Icons } from '@/components/ui/rk-icons';

type ExerciseData = {
  exerciseId: number;
  name: string;
  sets: number[];
};

type SessionData = {
  id: number;
  startedAt: string;
  completedAt: string | null;
  exercises: ExerciseData[];
};

type Props = {
  sessions: SessionData[];
};

export function HistoryClient({ sessions }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (sessions.length === 0) {
    return (
      <div style={{ padding: '24px 22px', color: 'var(--rk-text)' }}>
        <div style={{ padding: '12px 22px 0' }}>
          <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: -1 }}>
            No sessions yet.
          </h1>
          <div style={{ fontFamily: 'var(--rk-mono)', fontSize: 12, color: 'var(--rk-text-dim)', marginTop: 6 }}>
            Start a session to see your history here.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, color: 'var(--rk-text)' }}>
      <div style={{ padding: '12px 22px 0', flexShrink: 0 }}>
        <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: -1 }}>
          {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
        </h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px 0', minHeight: 0 }}>
        {sessions.map((session) => {
          const isOpen = expandedId === session.id;
          const totalSets = session.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
          const date = new Date(session.startedAt);
          const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

          return (
            <div
              key={session.id}
              data-testid="session-row"
              style={{
                marginBottom: 10, background: 'var(--rk-surface)', borderRadius: 14,
                border: '1px solid var(--rk-line-2)', overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setExpandedId(isOpen ? null : session.id)}
                style={{
                  width: '100%', background: 'transparent', border: 'none', color: 'var(--rk-text)',
                  padding: '16px 16px', display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: -0.2 }}>
                    {dateStr}
                  </div>
                  <div style={{
                    fontFamily: 'var(--rk-mono)', fontSize: 12, color: 'var(--rk-text-dim)', marginTop: 4,
                  }}>
                    {totalSets} sets · {session.exercises.length} exercises
                  </div>
                </div>
                <div style={{
                  color: 'var(--rk-text-dim)',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform .2s',
                }}>
                  <Icons.chevD size={18} />
                </div>
              </button>

              {isOpen && (
                <div style={{ padding: '0 16px 16px' }}>
                  {session.exercises.map((ex) => (
                    <div
                      key={ex.exerciseId}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 0', borderTop: '1px solid var(--rk-line-2)',
                      }}
                    >
                      <span style={{ fontSize: 14, color: 'var(--rk-text)' }}>{ex.name}</span>
                      <span style={{ fontFamily: 'var(--rk-mono)', fontSize: 13, color: 'var(--rk-text-dim)' }}>
                        {ex.sets.join(' · ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div style={{ height: 12 }} />
      </div>
    </div>
  );
}
