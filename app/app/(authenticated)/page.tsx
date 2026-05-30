import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { exercises, userProgress } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { ExerciseProgressDots } from '@/components/ui/exercise-progress-dots';
import { StartSessionButton } from '@/components/home/start-session-button';
import { RKLabel } from '@/components/ui/rk-label';

export default async function HomePage() {
  const session = await auth();
  const db = getDb();

  const [allExercises, progressRows] = await Promise.all([
    db.select().from(exercises).orderBy(exercises.sortOrder),
    session?.user?.id
      ? db.select().from(userProgress).where(eq(userProgress.userId, session.user.id))
      : Promise.resolve([]),
  ]);

  const progressByExercise = new Map(progressRows.map((p) => [p.exerciseId, p]));

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '14px 22px 0',
      }}
    >
      <RKLabel>Today · BWF Primer</RKLabel>
      <h1
        style={{
          fontSize: 40,
          fontWeight: 600,
          lineHeight: 1,
          margin: '10px 0 16px',
          letterSpacing: -1.2,
          color: 'var(--rk-text)',
          fontFamily: 'var(--rk-font)',
        }}
      >
        Ready when
        <br />
        you are.
      </h1>

      <ExerciseProgressDots count={allExercises.length} />

      <div style={{ marginTop: 22 }}>
        <StartSessionButton />
      </div>

      <div style={{ marginTop: 30, marginBottom: 10 }}>
        <RKLabel>Up next · {allExercises.length} exercises</RKLabel>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {allExercises.map((ex, i) => {
          const progress = progressByExercise.get(ex.id);
          const levelLabel = progress
            ? `Level ${progress.progressionLevel} · ${progress.currentReps} reps`
            : `${ex.rangeMin}–${ex.rangeMax} reps`;
          return (
            <div
              key={ex.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '10px 4px',
                borderBottom: '1px solid var(--rk-line-2)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--rk-mono)',
                  fontSize: 12,
                  color: 'var(--rk-text-muted)',
                  width: 18,
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{ fontSize: 17, fontWeight: 500, letterSpacing: -0.2, color: 'var(--rk-text)' }}
                >
                  {ex.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--rk-text-dim)',
                    marginTop: 2,
                    fontFamily: 'var(--rk-mono)',
                  }}
                >
                  {levelLabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
