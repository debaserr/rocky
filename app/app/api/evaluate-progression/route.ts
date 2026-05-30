import { evaluateProgression } from '@/lib/progression';

export async function POST(req: Request) {
  const body = await req.json();
  const { currentReps, currentLevel, rangeMin, rangeMax, set1, set2, set3 } = body;
  const result = evaluateProgression({ currentReps, currentLevel, rangeMin, rangeMax, set1, set2, set3 });
  return Response.json(result);
}
