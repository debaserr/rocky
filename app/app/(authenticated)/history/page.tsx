import { auth } from '@/lib/auth';
import { getSessions } from '@/lib/progress-repository';
import { HistoryClient } from '@/components/history/history-client';

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const rawSessions = await getSessions(session.user.id);
  const sessions = rawSessions.map((s) => ({
    ...s,
    startedAt: s.startedAt.toISOString(),
    completedAt: s.completedAt?.toISOString() ?? null,
  }));

  return <HistoryClient sessions={sessions} />;
}
