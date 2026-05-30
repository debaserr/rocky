import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  if (!req.auth?.user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
});

export const config = {
  // Protect all routes except login, NextAuth API routes, and Next.js internals
  matcher: ['/((?!login|api|_next/static|_next/image|favicon.ico).*)'],
};
