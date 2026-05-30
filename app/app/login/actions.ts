'use server';

import { signIn } from '@/lib/auth';

export async function sendMagicLink(formData: FormData): Promise<void> {
  const email = formData.get('email') as string;
  // In PLAYWRIGHT mode the Resend API is not called — just return early
  // so the confirmation card is shown without an actual email send.
  if (process.env.PLAYWRIGHT === 'true') return;
  try {
    await signIn('resend', { email, redirect: false, redirectTo: '/' });
  } catch {
    // Silent: show confirmation regardless of send outcome
  }
}
