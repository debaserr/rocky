import { auth } from '@/lib/auth';
import { updateExerciseProgress } from '@/lib/progress-repository';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ exerciseId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { exerciseId } = await params;
  const body = await request.json();
  await updateExerciseProgress(session.user.id, parseInt(exerciseId), body);
  return Response.json({ ok: true });
}
