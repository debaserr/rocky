import { auth } from '@/lib/auth';
import { getUserProgress } from '@/lib/progress-repository';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const progress = await getUserProgress(session.user.id);
  return Response.json(progress);
}
