'use client';

import { useEffect } from 'react';
import { RKCard } from '@/components/ui/rk-card';
import { RKLabel } from '@/components/ui/rk-label';

const MESSAGES = [
  'Good work — keep showing up.',
  'Solid effort. See you next session.',
  'Keep building the habit.',
];

type Props = {
  exerciseIndex: number;
  onContinue: () => void;
};

export function EncouragementCard({ exerciseIndex, onContinue }: Props) {
  const message = MESSAGES[exerciseIndex % MESSAGES.length];

  useEffect(() => {
    const id = setTimeout(onContinue, 2000);
    return () => clearTimeout(id);
  // onContinue identity is stable (dispatch); exerciseIndex guards remount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '0 28px' }}>
      <RKCard
        data-testid="encouragement-card"
        onClick={onContinue}
        padding={24}
      >
        <RKLabel>Keep going</RKLabel>
        <p style={{
          margin: '12px 0 0', fontSize: 22, fontWeight: 500,
          lineHeight: 1.3, letterSpacing: -0.4,
          color: 'var(--rk-text)', fontFamily: 'var(--rk-font)',
        }}>
          {message}
        </p>
      </RKCard>
    </div>
  );
}
