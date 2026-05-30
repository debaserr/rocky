import * as path from 'path';
import * as fs from 'fs';
import { config as loadEnv } from 'dotenv';
import { FullConfig } from '@playwright/test';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { eq, asc } from 'drizzle-orm';
import { seed } from '../lib/seed';
import * as schema from '../lib/schema';

async function globalSetup(_config: FullConfig) {
  loadEnv({ path: path.resolve(process.cwd(), '.env.local'), override: false });

  if (process.env.DATABASE_URL_TEST) {
    process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
  }

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');

  const db = drizzle(neon(url), { schema });
  await migrate(db, { migrationsFolder: path.resolve(process.cwd(), 'drizzle') });

  await seed();

  // ── Playwright auth bypass ──────────────────────────────────────
  // Create a test user + two database sessions:
  //   • user.json       — shared by most tests
  //   • logout-user.json — used only by the logout test (gets deleted during that test)

  const TEST_EMAIL = 'test@rocky.test';
  const MAIN_TOKEN = `playwright-main-${Date.now()}`;
  const LOGOUT_TOKEN = `playwright-logout-${Date.now()}`;
  const EXPIRES = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db.insert(schema.users).values({ email: TEST_EMAIL, name: 'Test User' }).onConflictDoNothing();
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, TEST_EMAIL));
  if (!user) throw new Error('Failed to create test user');

  // Seed user_progress for the test user (one row per exercise at level 1)
  const allExercises = await db
    .select()
    .from(schema.exercises)
    .orderBy(asc(schema.exercises.sortOrder));
  await db.delete(schema.userProgress).where(eq(schema.userProgress.userId, user.id));
  if (allExercises.length > 0) {
    await db.insert(schema.userProgress).values(
      allExercises.map((ex) => ({
        userId: user.id,
        exerciseId: ex.id,
        progressionLevel: 1,
        currentReps: ex.rangeMin,
      })),
    );
  }

  // Delete old test sessions to keep the DB tidy
  await db.delete(schema.sessions).where(eq(schema.sessions.userId, user.id));
  await db.insert(schema.sessions).values([
    { sessionToken: MAIN_TOKEN, userId: user.id, expires: EXPIRES },
    { sessionToken: LOGOUT_TOKEN, userId: user.id, expires: EXPIRES },
  ]);

  const authDir = path.resolve(process.cwd(), 'playwright/.auth');
  fs.mkdirSync(authDir, { recursive: true });

  const makeCookie = (token: string) => ({
    cookies: [
      {
        name: 'authjs.session-token',
        value: token,
        domain: 'localhost',
        path: '/',
        expires: Math.floor(EXPIRES.getTime() / 1000),
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ],
    origins: [],
  });

  fs.writeFileSync(path.join(authDir, 'user.json'), JSON.stringify(makeCookie(MAIN_TOKEN)));
  fs.writeFileSync(path.join(authDir, 'logout-user.json'), JSON.stringify(makeCookie(LOGOUT_TOKEN)));
}

export default globalSetup;
