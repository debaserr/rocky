import React from 'react';

type RKCardProps = {
  children: React.ReactNode;
  onClick?: () => void;
  padding?: number;
  className?: string;
  'data-testid'?: string;
};

export function RKCard({ children, onClick, padding = 18, className, 'data-testid': testId }: RKCardProps) {
  return (
    <div
      onClick={onClick}
      data-testid={testId}
      className={className}
      style={{
        background: 'var(--rk-surface)',
        borderRadius: 16,
        padding,
        border: '1px solid var(--rk-line-2)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {children}
    </div>
  );
}
