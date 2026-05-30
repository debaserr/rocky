import NextAuth from 'next-auth';
import Resend from 'next-auth/providers/resend';
import Credentials from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getDb } from '@/lib/db';
import { accounts, sessions, users, verificationTokens } from '@/lib/schema';

const isPlaywright = process.env.PLAYWRIGHT === 'true';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(getDb(), {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM ?? 'Rocky <noreply@rocky.app>',
    }),
    ...(isPlaywright
      ? [
          Credentials({
            id: 'credentials',
            credentials: { email: {}, password: {} },
            async authorize({ email, password }) {
              if (password !== 'test') return null;
              return { id: `playwright-${email}`, email: email as string, name: 'Test User' };
            },
          }),
        ]
      : []),
  ],
  session: { strategy: 'database' },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
});
