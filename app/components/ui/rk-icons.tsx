
type IconProps = {
  size?: number;
  className?: string;
};

function RKIcon({
  d,
  size = 20,
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = 1.6,
  viewBox = 24,
  className,
}: {
  d: string;
  size?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  viewBox?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={d} />
    </svg>
  );
}

export const Icons = {
  arrowRight: (p: IconProps) => <RKIcon {...p} d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft: (p: IconProps) => <RKIcon {...p} d="M19 12H5M11 6l-6 6 6 6" />,
  chevR: (p: IconProps) => <RKIcon {...p} d="M9 6l6 6-6 6" />,
  chevD: (p: IconProps) => <RKIcon {...p} d="M6 9l6 6 6-6" />,
  plus: (p: IconProps) => <RKIcon {...p} d="M12 5v14M5 12h14" />,
  minus: (p: IconProps) => <RKIcon {...p} d="M5 12h14" />,
  check: (p: IconProps) => <RKIcon {...p} d="M5 12.5l4.5 4.5L19 7" />,
  x: (p: IconProps) => <RKIcon {...p} d="M6 6l12 12M18 6L6 18" />,
  history: (p: IconProps) => (
    <RKIcon {...p} d="M3 12a9 9 0 109-9 9 9 0 00-7.5 4M3 3v4h4M12 7v5l3 2" />
  ),
  settings: (p: IconProps) => (
    <RKIcon
      {...p}
      d="M12 9a3 3 0 100 6 3 3 0 000-6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"
    />
  ),
  play: (p: IconProps) => <RKIcon {...p} d="M7 5l12 7-12 7V5z" fill="currentColor" />,
  ext: (p: IconProps) => (
    <RKIcon {...p} d="M14 4h6v6M10 14L20 4M19 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h5" />
  ),
  flame: (p: IconProps) => (
    <RKIcon {...p} d="M12 3s4 4 4 9a4 4 0 11-8 0c0-2 1-3 1-4 0-1.5-1-2-1-2 3 0 4-3 4-3z" />
  ),
  trophy: (p: IconProps) => (
    <RKIcon
      {...p}
      d="M7 4h10v4a5 5 0 11-10 0V4zM7 5H4a3 3 0 003 3M17 5h3a3 3 0 01-3 3M9 17h6M10 17l1 4h2l1-4M12 13v4"
    />
  ),
  edit: (p: IconProps) => (
    <RKIcon {...p} d="M4 20h4l10-10-4-4L4 16v4zM13.5 6.5l4 4" />
  ),
  home: (p: IconProps) => (
    <RKIcon {...p} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  ),
};
