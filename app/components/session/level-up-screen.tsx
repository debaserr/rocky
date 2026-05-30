'use client';

import { PhoneFooterBar } from '@/components/ui/phone-footer-bar';
import { RKButton } from '@/components/ui/rk-button';
import { Icons } from '@/components/ui/rk-icons';

type Props = {
  exerciseName: string;
  oldLevel: number;
  newLevel: number;
  newReps: number;
  onContinue: () => void;
};

export function LevelUpScreen({ exerciseName, oldLevel, newLevel, newReps, onContinue }: Props) {
  return (
    <div data-testid="level-up-screen" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ flex: 1, padding: '40px 28px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }} />
        <div>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'var(--rk-accent)', color: 'var(--rk-accent-ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 28,
          }}>
            <Icons.trophy size={32} />
          </div>
          <div style={{ fontFamily: 'var(--rk-mono)', fontSize: 11, fontWeight: 500, color: 'var(--rk-accent)', letterSpacing: 1.4, textTransform: 'uppercase' }}>
            Level up
          </div>
          <h1 style={{
            fontSize: 56, fontWeight: 600, lineHeight: 0.95, margin: '14px 0 0',
            letterSpacing: -2, fontFamily: 'var(--rk-font)',
          }}>
            {exerciseName}.
          </h1>
          <p style={{ fontSize: 17, color: 'var(--rk-text-dim)', margin: '20px 0 32px', lineHeight: 1.45, maxWidth: 280 }}>
            You hit your goal every set. Time to move up.
          </p>

          <div style={{ display: 'flex', alignItems: 'stretch', gap: 14 }}>
            <LevelChip label="From" value={`Level ${oldLevel}`} data-testid="level-chip-from" muted />
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--rk-text-muted)' }}>
              <Icons.arrowRight size={20} />
            </div>
            <LevelChip label="To" value={`Level ${newLevel}`} data-testid="level-chip-to" highlight />
          </div>

          <div style={{
            marginTop: 18, padding: 14, borderRadius: 12,
            background: 'var(--rk-surface)', border: '1px solid var(--rk-line-2)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontFamily: 'var(--rk-mono)', fontSize: 12, color: 'var(--rk-text-muted)', letterSpacing: 1.2, textTransform: 'uppercase' }}>
              New target
            </span>
            <span style={{ fontFamily: 'var(--rk-mono)', fontSize: 18, fontWeight: 500, color: 'var(--rk-accent)' }}>
              3 × {newReps} reps
            </span>
          </div>
        </div>
        <div style={{ flex: 2 }} />
      </div>

      <PhoneFooterBar>
        <RKButton onClick={onContinue} iconRight={<Icons.arrowRight size={20} />}>
          Continue
        </RKButton>
      </PhoneFooterBar>
    </div>
  );
}

type ChipProps = {
  label: string;
  value: string;
  highlight?: boolean;
  muted?: boolean;
  'data-testid'?: string;
};

function LevelChip({ label, value, highlight, muted, 'data-testid': testId }: ChipProps) {
  return (
    <div
      data-testid={testId}
      style={{
        flex: 1, padding: '12px 14px', borderRadius: 12,
        background: highlight ? 'var(--rk-surface-2)' : 'var(--rk-surface)',
        border: highlight ? '1px solid var(--rk-accent)' : '1px solid var(--rk-line-2)',
      }}
    >
      <div style={{
        fontFamily: 'var(--rk-mono)', fontSize: 10, color: 'var(--rk-text-muted)',
        letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--rk-mono)', fontSize: 14, fontWeight: 500,
        color: highlight ? 'var(--rk-accent)' : muted ? 'var(--rk-text-dim)' : 'var(--rk-text)',
      }}>
        {value}
      </div>
    </div>
  );
}
