import React from 'react';

type PhoneFooterBarProps = {
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
};

export function PhoneFooterBar({ children, className, 'data-testid': testId }: PhoneFooterBarProps) {
  return (
    <div
      data-testid={testId}
      className={className}
      style={{
        padding: '14px 22px 8px',
        background: 'linear-gradient(to top, var(--rk-bg) 60%, rgba(10,11,11,0))',
      }}
    >
      {children}
    </div>
  );
}
