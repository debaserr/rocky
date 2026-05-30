import { auth } from '@/lib/auth';
import { getSessions } from '@/lib/progress-repository';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const sessions = await getSessions(session.user.id);
  return Response.json(sessions);
}
