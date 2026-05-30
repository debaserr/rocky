'use client';

import { useRouter } from 'next/navigation';
import { RKButton } from '@/components/ui/rk-button';
import { Icons } from '@/components/ui/rk-icons';

export function StartSessionButton() {
  const router = useRouter();

  async function handleStart() {
    try {
      await navigator.wakeLock.request('screen');
    } catch {
      // Wake Lock unavailable (incognito, older Safari) — proceed silently
    }
    router.push('/session');
  }

  return (
    <RKButton onClick={handleStart} icon={<Icons.play size={18} />}>
      Start session
    </RKButton>
  );
}
