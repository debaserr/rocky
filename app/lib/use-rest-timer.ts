import { useState, useEffect, useRef } from 'react';

export interface RestTimer {
  secondsRemaining: number;
  isRunning: boolean;
  skip: () => void;
}

export function useRestTimer(totalSeconds: number, onAdvance: () => void): RestTimer {
  const startTimeRef = useRef(Date.now());
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [advanced, setAdvanced] = useState(false);
  const advancedRef = useRef(false);
  const onAdvanceRef = useRef(onAdvance);
  onAdvanceRef.current = onAdvance;

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setSecondsRemaining(Math.max(0, totalSeconds - elapsed));
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (secondsRemaining === 0 && !advancedRef.current) {
      advancedRef.current = true;
      setAdvanced(true);
      playBeep().finally(() => onAdvanceRef.current());
    }
  }, [secondsRemaining]);

  function skip() {
    if (advancedRef.current) return;
    advancedRef.current = true;
    setAdvanced(true);
    onAdvanceRef.current();
  }

  return { secondsRemaining, isRunning: !advanced && secondsRemaining > 0, skip };
}

function playBeep(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 440;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      osc.onended = () => {
        ctx.close();
        resolve();
      };
    } catch {
      resolve();
    }
  });
}
