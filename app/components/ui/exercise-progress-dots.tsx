type ExerciseProgressDotsProps = {
  count: number;
  current?: number;
  done?: number[];
  'data-testid'?: string;
};

export function ExerciseProgressDots({
  count,
  current = -1,
  done = [],
  'data-testid': testId = 'exercise-progress-dots',
}: ExerciseProgressDotsProps) {
  return (
    <div data-testid={testId} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {Array.from({ length: count }).map((_, i) => {
        const isDone = done.includes(i);
        const isCurrent = i === current;
        return (
          <div
            key={i}
            style={{
              width: isCurrent ? 26 : 8,
              height: 8,
              borderRadius: 4,
              background: isCurrent
                ? 'var(--rk-accent)'
                : isDone
                ? 'var(--rk-text-dim)'
                : 'var(--rk-line)',
              transition: 'all .25s ease',
            }}
          />
        );
      })}
    </div>
  );
}
