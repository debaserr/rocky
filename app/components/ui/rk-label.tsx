import React from 'react';

type RKLabelProps = {
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
};

export function RKLabel({ children, className, 'data-testid': testId }: RKLabelProps) {
  return (
    <div
      data-testid={testId}
      className={className}
      style={{
        fontFamily: 'var(--rk-mono)',
        fontSize: 11,
        fontWeight: 500,
        color: 'var(--rk-text-muted)',
        letterSpacing: 1.4,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  );
}
