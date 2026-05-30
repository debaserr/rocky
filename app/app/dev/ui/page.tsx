import { RKButton } from '@/components/ui/rk-button';
import { RKCard } from '@/components/ui/rk-card';
import { RKLabel } from '@/components/ui/rk-label';
import { PhoneFooterBar } from '@/components/ui/phone-footer-bar';
import { Icons } from '@/components/ui/rk-icons';

// Dev-only page for smoke-testing Rocky UI primitives.
export default function DevUIPage() {
  return (
    <div style={{ padding: 24, background: 'var(--rk-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <RKButton data-testid="rk-button-primary">Primary Button</RKButton>
      <RKCard data-testid="rk-card">
        <p style={{ color: 'var(--rk-text)' }}>Card content</p>
      </RKCard>
      <RKLabel data-testid="rk-label">Section label</RKLabel>
      <PhoneFooterBar data-testid="phone-footer-bar">
        <RKButton kind="secondary">Footer action</RKButton>
      </PhoneFooterBar>
      <div data-testid="icons" style={{ display: 'flex', gap: 12, color: 'var(--rk-text)' }}>
        <Icons.arrowRight />
        <Icons.check />
        <Icons.plus />
        <Icons.minus />
        <Icons.settings />
        <Icons.history />
        <Icons.play />
        <Icons.flame />
        <Icons.trophy />
        <Icons.edit />
      </div>
    </div>
  );
}
