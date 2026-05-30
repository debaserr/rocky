import { auth } from '@/lib/auth';
import { getUserProgress } from '@/lib/progress-repository';
import { SessionClient } from '@/components/session/session-client';

export default async function SessionPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const exercises = await getUserProgress(session.user.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <SessionClient userId={session.user.id} exercises={exercises} />
    </div>
  );
}
