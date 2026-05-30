import { auth, signOut } from '@/lib/auth';
import { getUserProgress } from '@/lib/progress-repository';
import { ExerciseCard } from '@/components/settings/exercise-card';

export default async function SettingsPage() {
  const session = await auth();
  const progress = session?.user?.id ? await getUserProgress(session.user.id) : [];

  return (
    <div style={{ padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: -0.8,
            margin: 0,
            color: 'var(--rk-text)',
            fontFamily: 'var(--rk-font)',
          }}
        >
          Settings
        </h1>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}
        >
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              background: 'transparent',
              border: '1px solid var(--rk-line)',
              color: 'var(--rk-text-dim)',
              cursor: 'pointer',
              font: '500 14px var(--rk-font)',
            }}
          >
            Sign out
          </button>
        </form>
      </div>

      <div>
        <p
          style={{
            margin: '0 0 16px',
            fontSize: 14,
            color: 'var(--rk-text-dim)',
            lineHeight: 1.4,
          }}
        >
          Tweak progression levels or reps. Useful if you missed a week or want to push harder.
        </p>
        {progress.map((ex) => (
          <ExerciseCard key={ex.exerciseId} exercise={ex} />
        ))}
      </div>
    </div>
  );
}
