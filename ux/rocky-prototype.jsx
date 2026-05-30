// rocky-prototype.jsx — interactive state machine that flows through the screens

function RockyPrototype({ restTimerVariant = 'numeric', homeVariant = 'cta', sessionCompleteVariant = 'list', restSeconds = 90, initialScreen = 'home' }) {
  // Phone-app state machine. Screens: login | login-confirm | home | history | settings | session
  // Inside session: exerciseIndex (0-5), setNumber (1-3), phase: 'intro' | 'active' | 'rest' | 'levelup'
  const [screen, setScreen] = React.useState(initialScreen);
  const [email, setEmail] = React.useState('');
  const [exercises, setExercises] = React.useState(ROCKY_BWF_PRIMER);

  // session state
  const [exIdx, setExIdx] = React.useState(0);
  const [setNum, setSetNum] = React.useState(1);
  const [phase, setPhase] = React.useState('intro');
  const [reps, setReps] = React.useState(exercises[0].target);
  const [secondsLeft, setSecondsLeft] = React.useState(restSeconds);
  const [sessionResults, setSessionResults] = React.useState(null);

  // Rest timer countdown
  React.useEffect(() => {
    if (phase !== 'rest') return;
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, secondsLeft]);
  // auto-advance when rest hits 0
  React.useEffect(() => {
    if (phase === 'rest' && secondsLeft <= 0) {
      startNextSet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, phase]);

  const startSession = () => {
    setExIdx(0); setSetNum(1); setPhase('intro'); setReps(exercises[0].target);
    setSessionResults(exercises.map((ex) => ({ id: ex.id, sets: [], target: ex.target, improved: false })));
    setScreen('session');
  };

  const startSet = () => { setPhase('active'); setReps(exercises[exIdx].target); };

  const logSet = () => {
    // record reps, decide rest or next exercise
    setSessionResults((rs) => rs.map((r, i) => i === exIdx ? { ...r, sets: [...r.sets, reps] } : r));
    if (setNum < 3) {
      setSecondsLeft(restSeconds);
      setPhase('rest');
    } else {
      // done with this exercise — maybe level-up (mocked: if exIdx === 2, trigger level-up)
      if (exIdx === 2 && exercises[2].level < 5) {
        setPhase('levelup');
      } else {
        advanceExercise();
      }
    }
  };

  const startNextSet = () => {
    setSetNum((n) => n + 1);
    setPhase('active');
    setReps(exercises[exIdx].target);
  };

  const advanceExercise = () => {
    if (exIdx >= exercises.length - 1) {
      setScreen('complete');
      return;
    }
    setExIdx((i) => i + 1);
    setSetNum(1);
    setPhase('intro');
    setReps(exercises[exIdx + 1].target);
  };

  const handleLevelUpContinue = () => {
    // bump the level
    setExercises((es) => es.map((ex, i) => i === exIdx ? { ...ex, level: ex.level + 1, target: ex.target + 1, levelName: `L${ex.level + 1} · Advanced` } : ex));
    advanceExercise();
  };

  // ──── render current screen ────
  if (screen === 'login') {
    return <ScreenLogin
      email={email} setEmail={setEmail}
      submitted={false}
      onSubmit={() => setScreen('login-confirm')} />;
  }
  if (screen === 'login-confirm') {
    return <ScreenLogin email={email} submitted={true} />;
  }
  if (screen === 'home') {
    return <ScreenHome
      variant={homeVariant}
      exercises={exercises}
      onStart={startSession}
      onHistory={() => setScreen('history')}
      onSettings={() => setScreen('settings')} />;
  }
  if (screen === 'history') {
    return <ScreenHistory exercises={exercises} onBack={() => setScreen('home')} />;
  }
  if (screen === 'settings') {
    return <ScreenSettings exercises={exercises} onBack={() => setScreen('home')} />;
  }
  if (screen === 'complete') {
    return <ScreenSessionComplete
      variant={sessionCompleteVariant}
      exercises={exercises}
      sessionResults={sessionResults}
      onDone={() => setScreen('home')} />;
  }
  if (screen === 'session') {
    const ex = exercises[exIdx];
    if (phase === 'intro') {
      return <ScreenExerciseIntro
        ex={ex} exerciseIndex={exIdx} totalExercises={exercises.length}
        onStartSet={startSet}
        onBack={() => setScreen('home')}
        onTutorial={() => alert('Open form video — not built in this prototype.')} />;
    }
    if (phase === 'active') {
      return <ScreenSetActive
        ex={ex} exerciseIndex={exIdx} totalExercises={exercises.length}
        setNumber={setNum} totalSets={3}
        reps={reps} setReps={setReps}
        onDone={logSet} onBack={() => setScreen('home')} />;
    }
    if (phase === 'rest') {
      return <ScreenRestTimer
        ex={ex} exerciseIndex={exIdx} totalExercises={exercises.length}
        nextSetNumber={setNum + 1} totalSets={3}
        secondsLeft={secondsLeft} totalSeconds={restSeconds}
        variant={restTimerVariant}
        onSkip={() => { setSecondsLeft(0); }}
        onBack={() => setScreen('home')} />;
    }
    if (phase === 'levelup') {
      return <ScreenLevelUp
        ex={ex}
        oldLevel={ex.levelName}
        newLevel={`L${ex.level + 1} · Advanced`}
        newTarget={ex.target + 1}
        onContinue={handleLevelUpContinue} />;
    }
  }
  return null;
}

Object.assign(window, { RockyPrototype });
