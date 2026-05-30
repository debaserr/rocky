import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { exercises } from '@/lib/schema';

export async function GET() {
  const db = getDb();
  const rows = await db.select().from(exercises);
  return NextResponse.json({ exercisesCount: rows.length });
}
