import React from 'react';

type RKButtonKind = 'primary' | 'secondary' | 'ghost' | 'surface' | 'danger';
type RKButtonSize = 'lg' | 'md' | 'sm';

type RKButtonProps = {
  kind?: RKButtonKind;
  size?: RKButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  full?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'data-testid'?: string;
};

const kindStyles: Record<RKButtonKind, React.CSSProperties> = {
  primary: { background: 'var(--rk-accent)', color: 'var(--rk-accent-ink)', border: 'none' },
  secondary: { background: 'transparent', color: 'var(--rk-text)', border: '1px solid var(--rk-line)' },
  ghost: { background: 'transparent', color: 'var(--rk-text-dim)', border: 'none' },
  surface: { background: 'var(--rk-surface-2)', color: 'var(--rk-text)', border: '1px solid var(--rk-line)' },
  danger: { background: 'transparent', color: 'var(--rk-danger)', border: '1px solid rgba(255,107,107,.3)' },
};

export function RKButton({
  kind = 'primary',
  size = 'lg',
  icon,
  iconRight,
  children,
  onClick,
  disabled,
  full = true,
  type = 'button',
  className,
  'data-testid': testId,
}: RKButtonProps) {
  const h = size === 'lg' ? 60 : size === 'md' ? 48 : 36;
  const fs = size === 'lg' ? 18 : size === 'md' ? 15 : 13;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      className={className}
      style={{
        height: h,
        width: full ? '100%' : undefined,
        minWidth: full ? undefined : h,
        padding: full ? '0 20px' : '0 18px',
        borderRadius: 12,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        font: `600 ${fs}px/1 var(--rk-font)`,
        letterSpacing: 0.1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        transition: 'transform .08s ease, opacity .12s',
        ...kindStyles[kind],
      }}
    >
      {icon}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}
