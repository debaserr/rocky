// rocky-screens-2.jsx — Level Up, Session Complete (3 variants), History, Settings

// ─────────────────────────────────────────────────────────────
// 6. LEVEL UP CELEBRATION
// ─────────────────────────────────────────────────────────────
function ScreenLevelUp({ ex, oldLevel = 'L2 · Standard', newLevel = 'L3 · Full', newTarget, onContinue }) {
  return (
    <Phone>
      <div style={{ flex: 1, padding: '40px 28px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }} />
        <div>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'var(--rk-accent)', color: 'var(--rk-accent-ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 28,
          }}>
            <Icons.trophy size={32} sw={1.8} />
          </div>
          <RKLabel style={{ color: 'var(--rk-accent)' }}>Level up</RKLabel>
          <h1 style={{
            fontSize: 56, fontWeight: 600, lineHeight: 0.95, margin: '14px 0 0',
            letterSpacing: -2,
          }}>{ex.name}.</h1>
          <p style={{ fontSize: 17, color: 'var(--rk-text-dim)', margin: '20px 0 32px', lineHeight: 1.45, maxWidth: 280 }}>
            3 × {ex.target}, clean. You've outgrown this one — time to step up.
          </p>

          <div style={{ display: 'flex', alignItems: 'stretch', gap: 14 }}>
            <LevelChip label="From" value={oldLevel} muted />
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--rk-text-muted)' }}>
              <Icons.arrowRight size={20} />
            </div>
            <LevelChip label="To" value={newLevel} highlight />
          </div>
          <div style={{
            marginTop: 18, padding: 14, borderRadius: 12,
            background: 'var(--rk-surface)', border: '1px solid var(--rk-line-2)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontFamily: 'var(--rk-mono)', fontSize: 12, color: 'var(--rk-text-muted)', letterSpacing: 1.2, textTransform: 'uppercase' }}>New target</span>
            <span style={{ fontFamily: 'var(--rk-mono)', fontSize: 18, fontWeight: 500, color: 'var(--rk-accent)' }}>3 × {newTarget || ex.target} {ex.unit}</span>
          </div>
        </div>
        <div style={{ flex: 2 }} />
      </div>
      <PhoneFooterBar>
        <RKButton onClick={onContinue} iconRight={<Icons.arrowRight size={20} />}>Continue</RKButton>
      </PhoneFooterBar>
    </Phone>
  );
}

function LevelChip({ label, value, highlight, muted }) {
  return (
    <div style={{
      flex: 1, padding: '12px 14px', borderRadius: 12,
      background: highlight ? 'var(--rk-surface-2)' : 'var(--rk-surface)',
      border: highlight ? '1px solid var(--rk-accent)' : '1px solid var(--rk-line-2)',
    }}>
      <div style={{
        fontFamily: 'var(--rk-mono)', fontSize: 10, color: 'var(--rk-text-muted)',
        letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6,
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--rk-mono)', fontSize: 14, fontWeight: 500,
        color: highlight ? 'var(--rk-accent)' : muted ? 'var(--rk-text-dim)' : 'var(--rk-text)',
      }}>{value}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. SESSION COMPLETE — three variants (list / grid / receipt)
// ─────────────────────────────────────────────────────────────
function ScreenSessionComplete({ exercises = ROCKY_BWF_PRIMER, sessionResults, durationMin = 24, levelUps = 1, onDone, variant = 'list' }) {
  const results = sessionResults || exercises.map((ex) => ({
    id: ex.id, sets: [ex.target, ex.target, ex.target], target: ex.target, improved: Math.random() > 0.6,
  }));
  if (variant === 'grid')    return <SessionCompleteGrid    exercises={exercises} results={results} durationMin={durationMin} levelUps={levelUps} onDone={onDone} />;
  if (variant === 'receipt') return <SessionCompleteReceipt exercises={exercises} results={results} durationMin={durationMin} levelUps={levelUps} onDone={onDone} />;
  return <SessionCompleteList exercises={exercises} results={results} durationMin={durationMin} levelUps={levelUps} onDone={onDone} />;
}

function SessionCompleteHeader({ durationMin, levelUps }) {
  return (
    <div style={{ padding: '24px 28px 0' }}>
      <RKLabel>Session complete</RKLabel>
      <h1 style={{
        fontSize: 44, fontWeight: 600, lineHeight: 0.95, margin: '10px 0 0', letterSpacing: -1.6,
      }}>That's the work.</h1>
      <div style={{ display: 'flex', gap: 24, marginTop: 20, marginBottom: 20 }}>
        <KPI label="Duration" value={`${durationMin}m`} />
        <KPI label="Sets logged" value="18" />
        <KPI label="Level ups" value={levelUps} accent={levelUps > 0} />
      </div>
    </div>
  );
}
function KPI({ label, value, accent }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--rk-mono)', fontSize: 10, color: 'var(--rk-text-muted)', letterSpacing: 1.2, textTransform: 'uppercase' }}>{label}</div>
      <div style={{
        fontFamily: 'var(--rk-mono)', fontVariantNumeric: 'tabular-nums',
        fontSize: 26, fontWeight: 500, marginTop: 4, letterSpacing: -0.5,
        color: accent ? 'var(--rk-accent)' : 'var(--rk-text)',
      }}>{value}</div>
    </div>
  );
}

function SessionCompleteList({ exercises, results, durationMin, levelUps, onDone }) {
  const byId = Object.fromEntries(exercises.map((e) => [e.id, e]));
  return (
    <Phone>
      <SessionCompleteHeader durationMin={durationMin} levelUps={levelUps} />
      <div style={{ flex: 1, padding: '0 28px', overflowY: 'auto' }}>
        <RKLabel style={{ marginBottom: 10 }}>Breakdown</RKLabel>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {results.map((r) => {
            const ex = byId[r.id];
            return (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
                borderBottom: '1px solid var(--rk-line-2)',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: -0.2 }}>{ex.name}</div>
                  <div style={{ fontFamily: 'var(--rk-mono)', fontSize: 11, color: 'var(--rk-text-dim)', marginTop: 2 }}>
                    target {r.target}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {r.sets.map((s, i) => (
                    <span key={i} style={{
                      width: 30, height: 30, borderRadius: 8, display: 'inline-flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--rk-mono)', fontSize: 13, fontWeight: 500,
                      background: s >= r.target ? 'var(--rk-surface-2)' : 'transparent',
                      border: '1px solid var(--rk-line)',
                      color: s >= r.target ? 'var(--rk-text)' : 'var(--rk-text-dim)',
                    }}>{s}</span>
                  ))}
                </div>
                <div style={{ width: 22, display: 'flex', justifyContent: 'flex-end' }}>
                  {r.improved && <Icons.arrowRight size={14} stroke="var(--rk-accent)" style={{ transform: 'rotate(-45deg)' }} />}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ height: 16 }} />
        <p style={{
          fontFamily: 'var(--rk-mono)', fontSize: 13, color: 'var(--rk-text-dim)',
          lineHeight: 1.45, marginTop: 18, padding: '14px 16px',
          background: 'var(--rk-surface)', borderRadius: 12, border: '1px solid var(--rk-line-2)',
        }}>
          <span style={{ color: 'var(--rk-accent)' }}>"</span>Recovery is where you grow. See you Thursday.<span style={{ color: 'var(--rk-accent)' }}>"</span>
        </p>
      </div>
      <PhoneFooterBar>
        <RKButton onClick={onDone} iconRight={<Icons.check size={20} sw={2} />}>Done</RKButton>
      </PhoneFooterBar>
    </Phone>
  );
}

function SessionCompleteGrid({ exercises, results, durationMin, levelUps, onDone }) {
  const byId = Object.fromEntries(exercises.map((e) => [e.id, e]));
  return (
    <Phone>
      <SessionCompleteHeader durationMin={durationMin} levelUps={levelUps} />
      <div style={{ padding: '0 22px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <RKLabel style={{ marginBottom: 10, padding: '0 6px' }}>Breakdown · 6 exercises</RKLabel>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1,
          gridAutoRows: 'min-content',
        }}>
          {results.map((r) => {
            const ex = byId[r.id];
            return (
              <div key={r.id} style={{
                background: 'var(--rk-surface)', borderRadius: 12, padding: 14,
                border: '1px solid var(--rk-line-2)',
                position: 'relative',
              }}>
                {r.improved && <div style={{
                  position: 'absolute', top: 10, right: 10, fontFamily: 'var(--rk-mono)', fontSize: 10,
                  color: 'var(--rk-accent)', letterSpacing: 1, textTransform: 'uppercase',
                }}>↑ up</div>}
                <div style={{ fontFamily: 'var(--rk-mono)', fontSize: 10, color: 'var(--rk-text-muted)', letterSpacing: 1.2 }}>{ex.short}</div>
                <div style={{ fontSize: 15, fontWeight: 500, marginTop: 4, letterSpacing: -0.2 }}>{ex.name}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
                  {r.sets.map((s, i) => (
                    <span key={i} style={{
                      flex: 1, height: 32, borderRadius: 6,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--rk-mono)', fontSize: 13, fontWeight: 500,
                      background: s >= r.target ? 'var(--rk-surface-3)' : 'transparent',
                      border: '1px solid var(--rk-line)',
                      color: s >= r.target ? 'var(--rk-text)' : 'var(--rk-text-dim)',
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <PhoneFooterBar>
        <RKButton onClick={onDone} iconRight={<Icons.check size={20} sw={2} />}>Done</RKButton>
      </PhoneFooterBar>
    </Phone>
  );
}

function SessionCompleteReceipt({ exercises, results, durationMin, levelUps, onDone }) {
  const byId = Object.fromEntries(exercises.map((e) => [e.id, e]));
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
  return (
    <Phone>
      <div style={{ padding: '20px 28px 0', flexShrink: 0 }}>
        <RKLabel>Session complete</RKLabel>
        <h1 style={{
          fontSize: 36, fontWeight: 600, lineHeight: 0.95, margin: '8px 0 0', letterSpacing: -1.2,
        }}>That's the work.</h1>
      </div>
      <div style={{ flex: 1, padding: '20px 22px', minHeight: 0, overflowY: 'auto' }}>
        <div style={{
          background: 'var(--rk-surface)', border: '1px solid var(--rk-line-2)', borderRadius: 6,
          padding: '20px 18px', fontFamily: 'var(--rk-mono)', fontSize: 12,
          color: 'var(--rk-text)',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 23px, var(--rk-line-2) 23px, var(--rk-line-2) 24px)',
          backgroundPositionY: 4,
        }}>
          <div style={{ textAlign: 'center', marginBottom: 14, letterSpacing: 1.5 }}>
            ROCKY · BWF PRIMER
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--rk-text-dim)', marginBottom: 6 }}>
            <span>{today}</span><span>{durationMin}m {Math.floor((durationMin % 1) * 60) || '00'}s</span>
          </div>
          <div style={{ borderTop: '1px dashed var(--rk-line)', margin: '12px 0' }} />
          {results.map((r) => {
            const ex = byId[r.id];
            return (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{ex.name.toUpperCase()}</span>
                  <span style={{ color: 'var(--rk-text-muted)', fontSize: 11 }}>{ex.levelName.split(' · ')[0]}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: r.sets.every((s) => s >= r.target) ? 'var(--rk-text)' : 'var(--rk-text-dim)' }}>
                    {r.sets.join(' · ')}
                  </span>
                  {r.improved && <div style={{ color: 'var(--rk-accent)', fontSize: 10, letterSpacing: 1, marginTop: 2 }}>↑ LEVEL UP</div>}
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: '1px dashed var(--rk-line)', margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
            <span>SETS</span><span>18 / 18</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: levelUps > 0 ? 'var(--rk-accent)' : 'var(--rk-text-dim)' }}>
            <span>LEVEL UPS</span><span>{levelUps}</span>
          </div>
          <div style={{ borderTop: '1px dashed var(--rk-line)', margin: '12px 0' }} />
          <div style={{ textAlign: 'center', color: 'var(--rk-text-dim)', marginTop: 10, fontSize: 11, letterSpacing: 1 }}>
            * THANK YOU FOR SHOWING UP *
          </div>
        </div>
      </div>
      <PhoneFooterBar>
        <RKButton onClick={onDone} iconRight={<Icons.check size={20} sw={2} />}>Done</RKButton>
      </PhoneFooterBar>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. HISTORY
// ─────────────────────────────────────────────────────────────
function ScreenHistory({ history = ROCKY_HISTORY, exercises = ROCKY_BWF_PRIMER, onBack }) {
  const [expanded, setExpanded] = React.useState(history[0]?.date);
  const byId = Object.fromEntries(exercises.map((e) => [e.id, e]));
  return (
    <Phone>
      <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 44, height: 44, borderRadius: 12, background: 'transparent', border: 'none',
          color: 'var(--rk-text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginLeft: -10,
        }}><Icons.arrowLeft size={22} /></button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 500 }}>History</div>
        <div style={{ width: 44 }} />
      </div>
      <div style={{ padding: '12px 22px 0' }}>
        <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: -1 }}>5 sessions</h1>
        <div style={{ fontFamily: 'var(--rk-mono)', fontSize: 12, color: 'var(--rk-text-dim)', marginTop: 6 }}>
          past 14 days · 4 level-ups
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px 0', minHeight: 0 }}>
        {history.map((s) => {
          const isOpen = expanded === s.date;
          const allHit = s.results.every((r) => r.sets.every((x) => x >= r.target));
          return (
            <div key={s.date} style={{
              marginBottom: 10, background: 'var(--rk-surface)', borderRadius: 14,
              border: '1px solid var(--rk-line-2)', overflow: 'hidden',
            }}>
              <button onClick={() => setExpanded(isOpen ? null : s.date)} style={{
                width: '100%', background: 'transparent', border: 'none', color: 'var(--rk-text)',
                padding: '16px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                textAlign: 'left',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--rk-mono)', fontSize: 12, color: 'var(--rk-text-muted)', letterSpacing: 1.2, textTransform: 'uppercase' }}>{s.day}</span>
                    <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: -0.2 }}>{formatDate(s.date)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 6, fontFamily: 'var(--rk-mono)', fontSize: 12, color: 'var(--rk-text-dim)' }}>
                    <span>{s.durationMin}m</span>
                    <span>·</span>
                    <span style={{ color: allHit ? 'var(--rk-accent)' : 'var(--rk-text-dim)' }}>{allHit ? '18/18 hit' : 'partial'}</span>
                    {s.levelUps > 0 && <span style={{ color: 'var(--rk-accent)' }}>· ↑ {s.levelUps}</span>}
                  </div>
                </div>
                <div style={{ color: 'var(--rk-text-dim)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>
                  <Icons.chevD size={18} />
                </div>
              </button>
              {isOpen && (
                <div style={{ padding: '0 16px 16px' }}>
                  {s.results.map((r) => (
                    <div key={r.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 0', borderTop: '1px solid var(--rk-line-2)',
                    }}>
                      <span style={{ fontSize: 14, color: 'var(--rk-text)' }}>{byId[r.id]?.name}</span>
                      <span style={{
                        fontFamily: 'var(--rk-mono)', fontSize: 13,
                        color: r.improved ? 'var(--rk-accent)' : 'var(--rk-text-dim)',
                      }}>{r.sets.join(' · ')}{r.improved ? '  ↑' : ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div style={{ height: 12 }} />
      </div>
    </Phone>
  );
}

function formatDate(iso) {
  const d = new Date(iso + 'T12:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─────────────────────────────────────────────────────────────
// 9. SETTINGS / PROGRESS EDITOR
// ─────────────────────────────────────────────────────────────
function ScreenSettings({ exercises = ROCKY_BWF_PRIMER, onBack }) {
  const [data, setData] = React.useState(exercises);
  const [dirty, setDirty] = React.useState(false);

  const updateTarget = (id, delta) => {
    setData((d) => d.map((ex) => ex.id === id ? { ...ex, target: Math.max(1, ex.target + delta) } : ex));
    setDirty(true);
  };
  const setLevel = (id, lvl) => {
    setData((d) => d.map((ex) => ex.id === id ? { ...ex, level: lvl, levelName: `L${lvl} · ${ex.levelName.split(' · ')[1] || 'Custom'}` } : ex));
    setDirty(true);
  };

  return (
    <Phone>
      <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <button onClick={onBack} style={{
          width: 44, height: 44, borderRadius: 12, background: 'transparent', border: 'none',
          color: 'var(--rk-text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginLeft: -10,
        }}><Icons.arrowLeft size={22} /></button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 500 }}>Progress</div>
        <button onClick={() => setDirty(false)} disabled={!dirty} style={{
          height: 44, padding: '0 12px', background: 'transparent', border: 'none',
          color: dirty ? 'var(--rk-accent)' : 'var(--rk-text-mute2)', cursor: dirty ? 'pointer' : 'default',
          font: '500 14px var(--rk-mono)', letterSpacing: 0.4, textTransform: 'uppercase',
        }}>Save</button>
      </div>
      <div style={{ padding: '12px 22px 0' }}>
        <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: -1 }}>Where you are.</h1>
        <p style={{ fontSize: 14, color: 'var(--rk-text-dim)', marginTop: 6, lineHeight: 1.4 }}>
          Tweak progression levels or reps. Useful if you missed a week or want to push harder.
        </p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px 12px', minHeight: 0 }}>
        {data.map((ex) => (
          <SettingsRow key={ex.id} ex={ex} onLevel={(l) => setLevel(ex.id, l)} onTarget={(d) => updateTarget(ex.id, d)} />
        ))}
      </div>
    </Phone>
  );
}

function SettingsRow({ ex, onLevel, onTarget }) {
  return (
    <div style={{
      padding: '14px 0', borderBottom: '1px solid var(--rk-line-2)',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: -0.2 }}>{ex.name}</div>
        <div style={{ fontFamily: 'var(--rk-mono)', fontSize: 11, color: 'var(--rk-text-muted)', letterSpacing: 1 }}>{ex.short}</div>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--rk-mono)', fontSize: 10, color: 'var(--rk-text-muted)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>Level</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1,2,3,4,5].map((l) => (
              <button key={l} onClick={() => onLevel(l)} style={{
                width: 36, height: 48, borderRadius: 8, cursor: 'pointer',
                background: l === ex.level ? 'var(--rk-accent)' : 'var(--rk-surface)',
                color: l === ex.level ? 'var(--rk-accent-ink)' : 'var(--rk-text-dim)',
                border: '1px solid ' + (l === ex.level ? 'var(--rk-accent)' : 'var(--rk-line)'),
                font: '500 14px var(--rk-mono)',
              }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ width: 130 }}>
          <div style={{ fontFamily: 'var(--rk-mono)', fontSize: 10, color: 'var(--rk-text-muted)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>Reps</div>
          <div style={{ display: 'flex', alignItems: 'center', height: 48, background: 'var(--rk-surface)', border: '1px solid var(--rk-line)', borderRadius: 8, overflow: 'hidden' }}>
            <button onClick={() => onTarget(-1)} style={{ width: 40, height: '100%', background: 'transparent', border: 'none', color: 'var(--rk-text-dim)', cursor: 'pointer' }}>
              <Icons.minus size={18} sw={2} />
            </button>
            <div style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--rk-mono)', fontSize: 16, fontWeight: 500 }}>{ex.target}</div>
            <button onClick={() => onTarget(1)} style={{ width: 40, height: '100%', background: 'transparent', border: 'none', color: 'var(--rk-text-dim)', cursor: 'pointer' }}>
              <Icons.plus size={18} sw={2} />
            </button>
          </div>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--rk-mono)', fontSize: 11, color: 'var(--rk-text-dim)' }}>{ex.levelName}</div>
    </div>
  );
}

Object.assign(window, {
  ScreenLevelUp, ScreenSessionComplete, ScreenHistory, ScreenSettings,
  SessionCompleteList, SessionCompleteGrid, SessionCompleteReceipt,
  SettingsRow, formatDate,
});
