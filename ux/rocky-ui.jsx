// rocky-ui.jsx — shared primitives. Phone shell, buttons, icons.

// --- icons (stroke 1.6, line caps round) ---
const RKIcon = ({ d, size = 20, fill = 'none', stroke = 'currentColor', sw = 1.6, vb = 24, style }) => (
  <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill={fill} stroke={stroke} strokeWidth={sw}
    strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d} />
  </svg>
);
const Icons = {
  arrowRight: (p) => <RKIcon {...p} d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft:  (p) => <RKIcon {...p} d="M19 12H5M11 6l-6 6 6 6" />,
  chevR:      (p) => <RKIcon {...p} d="M9 6l6 6-6 6" />,
  chevD:      (p) => <RKIcon {...p} d="M6 9l6 6 6-6" />,
  plus:       (p) => <RKIcon {...p} d="M12 5v14M5 12h14" />,
  minus:      (p) => <RKIcon {...p} d="M5 12h14" />,
  check:      (p) => <RKIcon {...p} d="M5 12.5l4.5 4.5L19 7" />,
  x:          (p) => <RKIcon {...p} d="M6 6l12 12M18 6L6 18" />,
  history:    (p) => <RKIcon {...p} d="M3 12a9 9 0 109-9 9 9 0 00-7.5 4M3 3v4h4M12 7v5l3 2" />,
  settings:   (p) => <RKIcon {...p} d="M12 9a3 3 0 100 6 3 3 0 000-6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />,
  play:       (p) => <RKIcon {...p} d="M7 5l12 7-12 7V5z" fill="currentColor" />,
  ext:        (p) => <RKIcon {...p} d="M14 4h6v6M10 14L20 4M19 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h5" />,
  flame:      (p) => <RKIcon {...p} d="M12 3s4 4 4 9a4 4 0 11-8 0c0-2 1-3 1-4 0-1.5-1-2-1-2 3 0 4-3 4-3z" />,
  trophy:     (p) => <RKIcon {...p} d="M7 4h10v4a5 5 0 11-10 0V4zM7 5H4a3 3 0 003 3M17 5h3a3 3 0 01-3 3M9 17h6M10 17l1 4h2l1-4M12 13v4" />,
  edit:       (p) => <RKIcon {...p} d="M4 20h4l10-10-4-4L4 16v4zM13.5 6.5l4 4" />,
};

// --- Phone shell ---
// 390×844 — raw app surface with status bar + home indicator.
// Not iOS-branded; just "a phone screen".
function Phone({ children, time = '7:42', battery = 64, hideStatus = false, hideHome = false, style }) {
  return (
    <div style={{
      width: 390, height: 844, background: 'var(--rk-bg)', color: 'var(--rk-text)',
      fontFamily: 'var(--rk-font)', overflow: 'hidden', position: 'relative',
      display: 'flex', flexDirection: 'column',
      WebkitFontSmoothing: 'antialiased', ...style,
    }}>
      {!hideStatus && <PhoneStatusBar time={time} battery={battery} />}
      <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      {!hideHome && <div style={{
        height: 34, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 9, flexShrink: 0,
      }}>
        <div style={{ width: 134, height: 5, borderRadius: 3, background: 'rgba(236,239,238,0.4)' }} />
      </div>}
    </div>
  );
}

function PhoneStatusBar({ time = '7:42', battery = 64 }) {
  return (
    <div style={{
      height: 54, padding: '18px 28px 0', display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between', flexShrink: 0, color: 'var(--rk-text)',
    }}>
      <div style={{ fontFamily: 'var(--rk-mono)', fontSize: 14, fontWeight: 500, letterSpacing: 0.2 }}>{time}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0"  y="7"   width="3" height="4" rx="0.6"/>
          <rect x="4.5" y="5" width="3" height="6" rx="0.6"/>
          <rect x="9"   y="2.5" width="3" height="8.5" rx="0.6"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.6"/>
        </svg>
        {/* battery */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontFamily: 'var(--rk-mono)', fontSize: 11, fontWeight: 500, marginRight: 3, opacity: 0.7 }}>{battery}</span>
          <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
            <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" strokeOpacity="0.4" />
            <rect x="2" y="2" width={battery * 0.19} height="8" rx="1.5" fill="currentColor" />
            <path d="M24 4.5v3c.7-.2 1.2-.9 1.2-1.5S24.7 4.7 24 4.5z" fill="currentColor" opacity="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// --- Buttons ---
// kind: 'primary' (lime fill, dark ink) | 'secondary' (bone outline) | 'ghost' (text only) | 'danger'
// size: 'lg' (60h), 'md' (48h), 'sm' (36h)
function RKButton({ kind = 'primary', size = 'lg', icon, iconRight, children, onClick, style, disabled, full = true, type, dataLabel }) {
  const h = size === 'lg' ? 60 : size === 'md' ? 48 : 36;
  const fs = size === 'lg' ? 18 : size === 'md' ? 15 : 13;
  const palette = {
    primary:   { bg: 'var(--rk-accent)', fg: 'var(--rk-accent-ink)', border: 'transparent' },
    secondary: { bg: 'transparent',      fg: 'var(--rk-text)',       border: '1px solid var(--rk-line)' },
    ghost:     { bg: 'transparent',      fg: 'var(--rk-text-dim)',   border: 'none' },
    surface:   { bg: 'var(--rk-surface-2)', fg: 'var(--rk-text)',    border: '1px solid var(--rk-line)' },
    danger:    { bg: 'transparent',      fg: 'var(--rk-danger)',     border: '1px solid rgba(255,107,107,.3)' },
  }[kind];
  return (
    <button type={type} onClick={onClick} disabled={disabled} data-label={dataLabel}
      style={{
        height: h, width: full ? '100%' : undefined, minWidth: full ? undefined : h,
        padding: full ? '0 20px' : '0 18px',
        background: palette.bg, color: palette.fg, border: palette.border,
        borderRadius: 12, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
        font: `600 ${fs}px/1 var(--rk-font)`, letterSpacing: 0.1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        transition: 'transform .08s ease, opacity .12s',
        ...style,
      }}
      onPointerDown={(e) => { e.currentTarget.style.transform = 'scale(0.985)'; }}
      onPointerUp={(e) => { e.currentTarget.style.transform = ''; }}
      onPointerLeave={(e) => { e.currentTarget.style.transform = ''; }}>
      {icon}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}

// --- Card surface ---
function RKCard({ children, style, onClick, padding = 18 }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--rk-surface)', borderRadius: 16, padding,
      border: '1px solid var(--rk-line-2)',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

// --- Section label (compact, mono caps) ---
function RKLabel({ children, style }) {
  return <div style={{
    fontFamily: 'var(--rk-mono)', fontSize: 11, fontWeight: 500,
    color: 'var(--rk-text-muted)', letterSpacing: 1.4, textTransform: 'uppercase', ...style,
  }}>{children}</div>;
}

// --- Progress dots (which of 6 exercises) ---
function ExerciseProgressDots({ count = 6, current = 0, done = [] }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: count }).map((_, i) => {
        const isDone = done.includes(i);
        const isCurrent = i === current;
        return (
          <div key={i} style={{
            width: isCurrent ? 26 : 8, height: 8, borderRadius: 4,
            background: isCurrent ? 'var(--rk-accent)' : isDone ? 'var(--rk-text-dim)' : 'var(--rk-line)',
            transition: 'all .25s ease',
          }} />
        );
      })}
    </div>
  );
}

// --- Mini bottom-of-screen nav (used in some screens) ---
function PhoneFooterBar({ children, style }) {
  return (
    <div style={{
      padding: '14px 22px 8px', background: 'linear-gradient(to top, var(--rk-bg) 60%, rgba(10,11,11,0))',
      ...style,
    }}>{children}</div>
  );
}

Object.assign(window, {
  Icons, Phone, PhoneStatusBar, RKButton, RKCard, RKLabel,
  ExerciseProgressDots, PhoneFooterBar,
});
