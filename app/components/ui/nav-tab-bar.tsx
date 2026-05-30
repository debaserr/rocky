'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from './rk-icons';
import { PhoneFooterBar } from './phone-footer-bar';

const TABS = [
  { href: '/', label: 'Home', Icon: Icons.home },
  { href: '/history', label: 'History', Icon: Icons.history },
  { href: '/settings', label: 'Settings', Icon: Icons.settings },
] as const;

export function NavTabBar() {
  const pathname = usePathname();

  return (
    <PhoneFooterBar>
      <nav style={{ display: 'flex', justifyContent: 'space-around' }}>
        {TABS.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '6px 16px',
                color: isActive ? 'var(--rk-accent)' : 'var(--rk-text-dim)',
                textDecoration: 'none',
                font: '500 10px var(--rk-mono)',
                letterSpacing: 0.8,
                textTransform: 'uppercase',
              }}
            >
              <Icon size={22} />
              {label}
            </Link>
          );
        })}
      </nav>
    </PhoneFooterBar>
  );
}
