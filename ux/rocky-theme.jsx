// rocky-theme.jsx — design tokens, exercise data, helpers

const THEMES = {
  fonts: {
    athletic: { display: '"Space Grotesk", system-ui, sans-serif', mono: '"JetBrains Mono", ui-monospace, monospace', label: 'Athletic — Space Grotesk + JetBrains Mono' },
    neutral:  { display: '"Inter Tight", system-ui, sans-serif',     mono: '"IBM Plex Mono", ui-monospace, monospace', label: 'Neutral — Inter Tight + IBM Plex Mono' },
    modern:   { display: '"Sora", system-ui, sans-serif',            mono: '"Geist Mono", ui-monospace, monospace',    label: 'Modern — Sora + Geist Mono' },
  },
  accents: {
    lime:   { hex: '#C6FF3D', ink: '#0A0E04', label: 'Lime' },
    volt:   { hex: '#4DD9FF', ink: '#04131A', label: 'Volt' },
    ember:  { hex: '#FF7A2D', ink: '#1A0805', label: 'Ember' },
    bone:   { hex: '#ECEFEE', ink: '#0B0D0C', label: 'Bone' },
  },
};

const ROCKY_BWF_PRIMER = [
  { id: 'deadbug',  name: 'Deadbugs',  level: 2, levelName: 'L2 · Standard', target: 8,  unit: 'reps/side', short: 'DB',
    why: 'Core anti-extension. Slow + controlled.' },
  { id: 'birddog',  name: 'Bird Dog',  level: 1, levelName: 'L1 · Bodyweight', target: 8,  unit: 'reps/side', short: 'BD',
    why: 'Anti-rotation + scapular control.' },
  { id: 'pushup',   name: 'Push-ups',  level: 3, levelName: 'L3 · Full',       target: 6,  unit: 'reps', short: 'PU',
    why: 'Horizontal push. Brace the ribs.' },
  { id: 'row',      name: 'Rows',      level: 2, levelName: 'L2 · Inverted',   target: 6,  unit: 'reps', short: 'RO',
    why: 'Horizontal pull. Pinch shoulder blades.' },
  { id: 'squat',    name: 'Squats',    level: 3, levelName: 'L3 · Full',       target: 10, unit: 'reps', short: 'SQ',
    why: 'Knees track toes. Full depth.' },
  { id: 'bridge',   name: 'Bridges',   level: 2, levelName: 'L2 · Glute Bridge', target: 10, unit: 'reps', short: 'BR',
    why: 'Squeeze at the top. No lower-back arch.' },
];

// Recent session history (mocked)
const ROCKY_HISTORY = [
  { date: '2026-05-21', day: 'Thu', durationMin: 24, levelUps: 1, results: [
    { id: 'deadbug', sets: [8,8,8], target: 8, improved: false },
    { id: 'birddog', sets: [8,8,8], target: 8, improved: true },
    { id: 'pushup', sets: [6,6,5], target: 6, improved: false },
    { id: 'row', sets: [6,6,6], target: 6, improved: false },
    { id: 'squat', sets: [10,10,10], target: 10, improved: true },
    { id: 'bridge', sets: [10,10,10], target: 10, improved: false },
  ]},
  { date: '2026-05-19', day: 'Tue', durationMin: 22, levelUps: 0, results: [
    { id: 'deadbug', sets: [7,7,6], target: 7, improved: false },
    { id: 'birddog', sets: [7,7,7], target: 7, improved: false },
    { id: 'pushup', sets: [6,5,5], target: 6, improved: false },
    { id: 'row', sets: [6,6,5], target: 6, improved: false },
    { id: 'squat', sets: [10,10,9], target: 10, improved: false },
    { id: 'bridge', sets: [10,10,10], target: 10, improved: true },
  ]},
  { date: '2026-05-17', day: 'Sun', durationMin: 26, levelUps: 2, results: [
    { id: 'deadbug', sets: [7,7,7], target: 7, improved: true },
    { id: 'birddog', sets: [7,7,7], target: 7, improved: false },
    { id: 'pushup', sets: [6,6,6], target: 6, improved: true },
    { id: 'row', sets: [6,5,5], target: 6, improved: false },
    { id: 'squat', sets: [10,9,9], target: 10, improved: false },
    { id: 'bridge', sets: [9,9,9], target: 9, improved: false },
  ]},
  { date: '2026-05-14', day: 'Thu', durationMin: 21, levelUps: 0, results: [
    { id: 'deadbug', sets: [6,6,6], target: 6, improved: false },
    { id: 'birddog', sets: [7,7,6], target: 7, improved: false },
    { id: 'pushup', sets: [5,5,5], target: 5, improved: false },
    { id: 'row', sets: [5,5,5], target: 5, improved: false },
    { id: 'squat', sets: [9,9,9], target: 9, improved: false },
    { id: 'bridge', sets: [9,9,8], target: 9, improved: false },
  ]},
  { date: '2026-05-12', day: 'Tue', durationMin: 25, levelUps: 1, results: [
    { id: 'deadbug', sets: [6,6,6], target: 6, improved: true },
    { id: 'birddog', sets: [7,7,7], target: 7, improved: false },
    { id: 'pushup', sets: [5,5,4], target: 5, improved: false },
    { id: 'row', sets: [5,5,5], target: 5, improved: false },
    { id: 'squat', sets: [9,9,8], target: 9, improved: false },
    { id: 'bridge', sets: [9,9,9], target: 9, improved: true },
  ]},
];

// Build the runtime style sheet for the theme. Re-injects when accent/font/density changes.
function applyRockyTheme({ accent = 'lime', fontKey = 'athletic', density = 'comfortable' } = {}) {
  const a = THEMES.accents[accent] || THEMES.accents.lime;
  const f = THEMES.fonts[fontKey] || THEMES.fonts.athletic;
  const pad = density === 'compact' ? { gap: 12, pad: 16, row: 56 } : { gap: 18, pad: 22, row: 68 };
  const css = `
    :root {
      --rk-bg: #0A0B0B;
      --rk-surface: #14171A;
      --rk-surface-2: #1B2024;
      --rk-surface-3: #232A2F;
      --rk-line: #262C30;
      --rk-line-2: #1E2327;
      --rk-text: #ECEFEE;
      --rk-text-dim: #8A9290;
      --rk-text-muted: #565C5A;
      --rk-text-mute2: #3A4042;
      --rk-danger: #FF6B6B;
      --rk-warn: #FFB13D;
      --rk-good: ${a.hex};
      --rk-accent: ${a.hex};
      --rk-accent-ink: ${a.ink};
      --rk-font: ${f.display};
      --rk-mono: ${f.mono};
      --rk-gap: ${pad.gap}px;
      --rk-pad: ${pad.pad}px;
      --rk-row: ${pad.row}px;
    }
  `;
  let el = document.getElementById('rk-theme-vars');
  if (!el) { el = document.createElement('style'); el.id = 'rk-theme-vars'; document.head.appendChild(el); }
  el.textContent = css;
}

Object.assign(window, { THEMES, ROCKY_BWF_PRIMER, ROCKY_HISTORY, applyRockyTheme });
