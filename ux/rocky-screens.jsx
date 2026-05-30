// rocky-screens.jsx — all 9 screens (+ variations).
// Each screen is a pure function of state; navigation lives in the prototype.

// ─────────────────────────────────────────────────────────────
// 1. LOGIN
// ─────────────────────────────────────────────────────────────
function ScreenLogin({ submitted, onSubmit, email, setEmail }) {
  return (
    <Phone>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '36px 28px 28px' }}>
        <RockyWordmark />
        <div style={{ flex: 1 }} />
        {!submitted ? (
          <React.Fragment>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{
                fontSize: 36, fontWeight: 600, lineHeight: 1.05, margin: 0,
                letterSpacing: -0.8,
              }}>Sign in.</h1>
              <p style={{
                fontSize: 16, color: 'var(--rk-text-dim)', margin: '12px 0 0', lineHeight: 1.4,
                maxWidth: 280,
              }}>We'll email you a magic link. No password.</p>
            </div>
            <RKLabel style={{ marginBottom: 8 }}>Email</RKLabel>
            <input
              type="email" value={email || ''} onChange={(e) => setEmail && setEmail(e.target.value)}
              placeholder="you@workout.gym"
              style={{
                height: 60, padding: '0 18px', borderRadius: 12,
                background: 'var(--rk-surface)', border: '1px solid var(--rk-line)',
                color: 'var(--rk-text)', font: '500 17px var(--rk-font)',
                outline: 'none', marginBottom: 14,
              }} />
            <RKButton onClick={onSubmit} iconRight={<Icons.arrowRight size={20} />}>
              Send magic link
            </RKButton>
            <p style={{
              fontSize: 12, color: 'var(--rk-text-muted)', textAlign: 'center', marginTop: 24,
              fontFamily: 'var(--rk-mono)', letterSpacing: 0.2,
            }}>BWF Primer · v0.4</p>
          </React.Fragment>
        ) : (
          <ConfirmationCard email={email || 'you@workout.gym'} />
        )}
        <div style={{ height: 32 }} />
      </div>
    </Phone>
  );
}

function RockyWordmark({ size = 22 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9, background: 'var(--rk-accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--rk-accent-ink)', font: '700 17px var(--rk-font)',
        letterSpacing: -0.5,
      }}>R</div>
      <div style={{ font: `700 ${size}px var(--rk-font)`, letterSpacing: -0.6 }}>rocky</div>
    </div>
  );
}

function ConfirmationCard({ email }) {
  return (
    <div style={{ textAlign: 'left' }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14, background: 'var(--rk-surface)',
        border: '1px solid var(--rk-line)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 22,
      }}>
        <Icons.check size={26} stroke="var(--rk-accent)" sw={2} />
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.1, margin: 0, letterSpacing: -0.6 }}>Check your email.</h1>
      <p style={{ fontSize: 16, color: 'var(--rk-text-dim)', margin: '12px 0 24px', lineHeight: 1.5 }}>
        We sent a link to <span style={{ color: 'var(--rk-text)' }}>{email}</span>. Tap it on this device to sign in.
      </p>
      <RKButton kind="secondary">Resend in 30s</RKButton>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. HOME — two variations (CTA-first / Progress-first)
// ─────────────────────────────────────────────────────────────
function ScreenHome({ variant = 'cta', exercises = ROCKY_BWF_PRIMER, onStart, onHistory, onSettings, streak = 5 }) {
  if (variant === 'progress') {
    return <HomeProgressFirst exercises={exercises} onStart={onStart} onHistory={onHistory} onSettings={onSettings} streak={streak} />;
  }
  return <HomeCTAFirst exercises={exercises} onStart={onStart} onHistory={onHistory} onSettings={onSettings} streak={streak} />;
}

function HomeNav({ onHistory, onSettings }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 22px 0' }}>
      <RockyWordmark size={20} />
      <div style={{ display: 'flex', gap: 4 }}>
        <NavIconBtn onClick={onHistory}><Icons.history size={20} /></NavIconBtn>
        <NavIconBtn onClick={onSettings}><Icons.settings size={20} /></NavIconBtn>
      </div>
    </div>
  );
}
function NavIconBtn({ children, onClick }) {
  return <button onClick={onClick} style={{
    width: 44, height: 44, borderRadius: 12, background: 'transparent', border: 'none',
    color: 'var(--rk-text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>{children}</button>;
}

function HomeCTAFirst({ exercises, onStart, onHistory, onSettings, streak }) {
  return (
    <Phone>
      <HomeNav onHistory={onHistory} onSettings={onSettings} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 22px 0', minHeight: 0 }}>
        <RKLabel>Today · BWF Primer</RKLabel>
        <h1 style={{
          fontSize: 40, fontWeight: 600, lineHeight: 1, margin: '10px 0 4px',
          letterSpacing: -1.2,
        }}>Ready when<br />you are.</h1>
        <div style={{ marginTop: 22 }}>
          <RKButton onClick={onStart} icon={<Icons.play size={18} />}>Start session</RKButton>
        </div>

        <div style={{ marginTop: 30, marginBottom: 10 }}>
          <RKLabel>Up next · 6 exercises</RKLabel>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {exercises.map((ex, i) => (
            <ExerciseRowCompact key={ex.id} ex={ex} index={i} />
          ))}
        </div>
      </div>
    </Phone>
  );
}

function ExerciseRowCompact({ ex, index }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '10px 4px',
      borderBottom: '1px solid var(--rk-line-2)',
    }}>
      <span style={{
        fontFamily: 'var(--rk-mono)', fontSize: 12, color: 'var(--rk-text-muted)', width: 18,
      }}>{String(index + 1).padStart(2, '0')}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: -0.2 }}>{ex.name}</div>
        <div style={{ fontSize: 12, color: 'var(--rk-text-dim)', marginTop: 2, fontFamily: 'var(--rk-mono)' }}>{ex.levelName}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: 'var(--rk-mono)', fontSize: 15, fontWeight: 500, color: 'var(--rk-text)',
        }}>3 × {ex.target}</div>
        <div style={{ fontSize: 11, color: 'var(--rk-text-muted)', fontFamily: 'var(--rk-mono)', marginTop: 2 }}>{ex.unit}</div>
      </div>
    </div>
  );
}

function HomeProgressFirst({ exercises, onStart, onHistory, onSettings, streak }) {
  return (
    <Phone>
      <HomeNav onHistory={onHistory} onSettings={onSettings} />
      <div style={{ padding: '14px 22px 0', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <RKLabel>Your progress</RKLabel>
          <span style={{ fontFamily: 'var(--rk-mono)', fontSize: 12, color: 'var(--rk-accent)' }}>
            ↑ 2 levels this week
          </span>
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, gridAutoRows: 'min-content' }}>
          {exercises.map((ex) => (
            <ExerciseTile key={ex.id} ex={ex} />
          ))}
        </div>
      </div>
      <PhoneFooterBar>
        <RKButton onClick={onStart} icon={<Icons.play size={18} />}>Start session</RKButton>
      </PhoneFooterBar>
    </Phone>
  );
}

function ExerciseTile({ ex }) {
  return (
    <div style={{
      background: 'var(--rk-surface)', borderRadius: 14, padding: 14,
      border: '1px solid var(--rk-line-2)',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{
        fontFamily: 'var(--rk-mono)', fontSize: 10, color: 'var(--rk-text-muted)',
        letterSpacing: 1.2,
      }}>{ex.short}</div>
      <div style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.15, letterSpacing: -0.2 }}>{ex.name}</div>
      <div style={{ flex: 1, minHeight: 6 }} />
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--rk-mono)', fontSize: 11, color: 'var(--rk-text-dim)' }}>{ex.levelName.split(' · ')[0]}</span>
        <span style={{ fontFamily: 'var(--rk-mono)', fontSize: 14, color: 'var(--rk-text)' }}>3×{ex.target}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. EXERCISE INTRO
// ─────────────────────────────────────────────────────────────
function ScreenExerciseIntro({ ex, exerciseIndex = 0, totalExercises = 6, onStartSet, onBack, onTutorial }) {
  return (
    <Phone>
      <SessionTopBar onBack={onBack} index={exerciseIndex} total={totalExercises} />
      <div style={{ flex: 1, padding: '20px 28px 0', display: 'flex', flexDirection: 'column' }}>
        <RKLabel>Exercise {exerciseIndex + 1} of {totalExercises}</RKLabel>
        <h1 style={{
          fontSize: 56, fontWeight: 600, lineHeight: 0.95, margin: '12px 0 0',
          letterSpacing: -2.2,
        }}>{ex.name}.</h1>
        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Stat label="Progression" value={ex.levelName} />
          <Stat label="Today's goal" value={`3 × ${ex.target} ${ex.unit}`} accent />
          <Stat label="Form cue" value={ex.why} small />
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={onTutorial} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--rk-text-dim)', font: '500 14px var(--rk-mono)',
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 0',
          alignSelf: 'flex-start',
        }}>
          <span style={{ borderBottom: '1px solid var(--rk-text-mute2)' }}>How to do this exercise</span>
          <Icons.ext size={13} />
        </button>
      </div>
      <PhoneFooterBar>
        <RKButton onClick={onStartSet} iconRight={<Icons.arrowRight size={20} />}>Start set 1</RKButton>
      </PhoneFooterBar>
    </Phone>
  );
}

function Stat({ label, value, accent, small }) {
  return (
    <div>
      <RKLabel style={{ marginBottom: 4 }}>{label}</RKLabel>
      <div style={{
        fontSize: small ? 16 : 22, fontWeight: small ? 400 : 500,
        color: accent ? 'var(--rk-accent)' : 'var(--rk-text)',
        lineHeight: 1.3, letterSpacing: small ? 0 : -0.3,
        fontFamily: accent ? 'var(--rk-mono)' : 'var(--rk-font)',
      }}>{value}</div>
    </div>
  );
}

function SessionTopBar({ onBack, index, total, exerciseName, doneIndices = [] }) {
  return (
    <div style={{
      padding: '6px 22px 0', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0,
    }}>
      <button onClick={onBack} style={{
        width: 44, height: 44, borderRadius: 12, background: 'transparent', border: 'none',
        color: 'var(--rk-text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginLeft: -10,
      }}><Icons.x size={22} /></button>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <ExerciseProgressDots count={total} current={index} done={doneIndices.length ? doneIndices : Array.from({ length: index }, (_, i) => i)} />
        {exerciseName && <div style={{ fontFamily: 'var(--rk-mono)', fontSize: 11, color: 'var(--rk-text-muted)', letterSpacing: 1.2, textTransform: 'uppercase' }}>{exerciseName}</div>}
      </div>
      <div style={{ width: 44 }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. SET ACTIVE
// ─────────────────────────────────────────────────────────────
function ScreenSetActive({ ex, exerciseIndex = 0, totalExercises = 6, setNumber = 1, totalSets = 3, reps, setReps, onDone, onBack }) {
  return (
    <Phone>
      <SessionTopBar onBack={onBack} index={exerciseIndex} total={totalExercises} exerciseName={ex.name} />
      <div style={{ flex: 1, padding: '30px 28px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 14, color: 'var(--rk-text-dim)', fontFamily: 'var(--rk-mono)',
            letterSpacing: 1.5, textTransform: 'uppercase',
          }}>Set {setNumber} of {totalSets}</div>
          <h1 style={{
            fontSize: 32, fontWeight: 600, margin: '8px 0 0', letterSpacing: -0.8,
          }}>{ex.name}</h1>
          <div style={{
            fontFamily: 'var(--rk-mono)', fontSize: 13, color: 'var(--rk-text-muted)', marginTop: 8,
          }}>Goal · {ex.target} {ex.unit}</div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Rep counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <RepStepperBtn onClick={() => setReps && setReps(Math.max(0, reps - 1))}>
            <Icons.minus size={28} sw={2.2} />
          </RepStepperBtn>
          <div style={{
            minWidth: 150, textAlign: 'center',
            fontFamily: 'var(--rk-mono)', fontVariantNumeric: 'tabular-nums',
            fontSize: 128, fontWeight: 500, lineHeight: 0.95, letterSpacing: -3,
            color: 'var(--rk-text)',
          }}>{reps}</div>
          <RepStepperBtn onClick={() => setReps && setReps(reps + 1)}>
            <Icons.plus size={28} sw={2.2} />
          </RepStepperBtn>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span style={{ fontFamily: 'var(--rk-mono)', fontSize: 12, color: 'var(--rk-text-muted)', letterSpacing: 0.4 }}>
            {reps === ex.target ? 'matches goal' : reps > ex.target ? `+${reps - ex.target} over goal` : `${ex.target - reps} below goal`}
          </span>
        </div>

        <div style={{ flex: 1 }} />
      </div>
      <PhoneFooterBar>
        <RKButton onClick={onDone} iconRight={<Icons.check size={22} sw={2.2} />}>
          Done — log set
        </RKButton>
      </PhoneFooterBar>
    </Phone>
  );
}

function RepStepperBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 84, height: 84, borderRadius: 28,
      background: 'var(--rk-surface)', border: '1px solid var(--rk-line)',
      color: 'var(--rk-text)', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'transform .08s, background .12s',
    }}
    onPointerDown={(e) => { e.currentTarget.style.background = 'var(--rk-surface-2)'; e.currentTarget.style.transform = 'scale(0.96)'; }}
    onPointerUp={(e) => { e.currentTarget.style.background = 'var(--rk-surface)'; e.currentTarget.style.transform = ''; }}
    onPointerLeave={(e) => { e.currentTarget.style.background = 'var(--rk-surface)'; e.currentTarget.style.transform = ''; }}>
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. REST TIMER — three variants (numeric / ring / bar)
// ─────────────────────────────────────────────────────────────
function ScreenRestTimer({ ex, exerciseIndex = 0, totalExercises = 6, nextSetNumber = 2, totalSets = 3, secondsLeft, totalSeconds = 90, onSkip, onBack, variant = 'numeric' }) {
  const mm = String(Math.floor(secondsLeft / 60)).padStart(1, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const time = `${mm}:${ss}`;
  const pct = Math.max(0, Math.min(1, 1 - secondsLeft / totalSeconds));

  return (
    <Phone>
      <SessionTopBar onBack={onBack} index={exerciseIndex} total={totalExercises} exerciseName={ex.name} />
      <div style={{ flex: 1, padding: '30px 28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <RKLabel>Rest</RKLabel>
        <div style={{ fontSize: 20, fontWeight: 500, marginTop: 10, color: 'var(--rk-text-dim)' }}>
          Set {nextSetNumber} of {totalSets} coming up
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          {variant === 'numeric' && <RestNumeric time={time} secondsLeft={secondsLeft} />}
          {variant === 'ring'    && <RestRing time={time} pct={pct} />}
          {variant === 'bar'     && <RestBar time={time} pct={pct} totalSeconds={totalSeconds} />}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{
            fontFamily: 'var(--rk-mono)', fontSize: 12, color: 'var(--rk-text-muted)',
            letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6,
          }}>Next up</div>
          <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.4 }}>{ex.name}</div>
          <div style={{ fontFamily: 'var(--rk-mono)', fontSize: 13, color: 'var(--rk-text-dim)', marginTop: 4 }}>
            target · {ex.target} {ex.unit}
          </div>
        </div>
      </div>
      <PhoneFooterBar>
        <div style={{ textAlign: 'center' }}>
          <button onClick={onSkip} style={{
            background: 'transparent', border: 'none', cursor: 'pointer', padding: '14px 24px',
            color: 'var(--rk-text-dim)', font: '500 14px var(--rk-mono)', letterSpacing: 0.4,
            textTransform: 'uppercase',
          }}>Skip rest</button>
        </div>
      </PhoneFooterBar>
    </Phone>
  );
}

function RestNumeric({ time, secondsLeft }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--rk-mono)', fontVariantNumeric: 'tabular-nums',
        fontSize: 168, fontWeight: 400, lineHeight: 0.9, letterSpacing: -6,
        color: secondsLeft <= 5 ? 'var(--rk-accent)' : 'var(--rk-text)',
        transition: 'color .25s',
      }}>{time}</div>
    </div>
  );
}

function RestRing({ time, pct }) {
  const size = 260, sw = 8, r = (size - sw) / 2, c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--rk-surface-2)" strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--rk-accent)" strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * pct}
          style={{ transition: 'stroke-dashoffset 1s linear' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <div style={{
          fontFamily: 'var(--rk-mono)', fontVariantNumeric: 'tabular-nums',
          fontSize: 76, fontWeight: 500, lineHeight: 1, letterSpacing: -2,
        }}>{time}</div>
        <div style={{ fontFamily: 'var(--rk-mono)', fontSize: 11, color: 'var(--rk-text-muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 4 }}>
          remaining
        </div>
      </div>
    </div>
  );
}

function RestBar({ time, pct, totalSeconds }) {
  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--rk-mono)', fontVariantNumeric: 'tabular-nums',
        fontSize: 124, fontWeight: 500, lineHeight: 0.9, letterSpacing: -4, marginBottom: 28,
      }}>{time}</div>
      <div style={{
        height: 10, borderRadius: 5, background: 'var(--rk-surface-2)', overflow: 'hidden',
        margin: '0 4px',
      }}>
        <div style={{
          height: '100%', width: `${pct * 100}%`, background: 'var(--rk-accent)',
          borderRadius: 5, transition: 'width 1s linear',
        }} />
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', marginTop: 10, padding: '0 4px',
        fontFamily: 'var(--rk-mono)', fontSize: 11, color: 'var(--rk-text-muted)', letterSpacing: 1,
      }}>
        <span>0:00</span>
        <span>{Math.floor(totalSeconds / 60)}:{String(totalSeconds % 60).padStart(2, '0')}</span>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenLogin, ScreenHome, ScreenExerciseIntro, ScreenSetActive, ScreenRestTimer,
  HomeCTAFirst, HomeProgressFirst, RestNumeric, RestRing, RestBar,
  RockyWordmark, SessionTopBar, Stat, ExerciseRowCompact, ExerciseTile,
});
