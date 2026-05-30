import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const db = getDb();
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ ok: true, db: 'connected' });
  } catch {
    return NextResponse.json({ ok: false, db: 'error' }, { status: 503 });
  }
}
