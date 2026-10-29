import { useState } from 'react'
const MODES = [
  { id: 'screen', label: 'Screen off', state: 'FOREGROUND SERVICE', text: 'A persistent notification keeps the tracking service alive while the display sleeps. WakeLock and fused location updates continue in the background.' },
  { id: 'kill', label: 'Process killed', state: 'CHECKPOINT → RECOVER', text: 'Periodic checkpoints persist the session. On restart, the recovery flow restores the walk instead of silently dropping it.' },
  { id: 'noise', label: 'GPS noise', state: 'FILTER → VALIDATE', text: 'Location samples pass through noise filtering and speed validation before they affect distance. Bad fixes do not become fake kilometres.' },
] as const
export default function PhoneSim() {
  const [mode, setMode] = useState(0)
  const m = MODES[mode]
  return (
    <div className="phonesim">
      <div className="chips" role="group" aria-label="Android reliability scenario">
        {MODES.map((x, i) => <button key={x.id} className={`chip ${mode === i ? 'is-active' : ''}`} onClick={() => setMode(i)} aria-pressed={mode === i}>{x.label}</button>)}
      </div>
      <div className="phonesim-grid">
        <div className={`device device-${m.id}`} aria-hidden="true">
          <div className="device-notch" />
          <div className="device-screen">
            <span className="mono device-state">{m.state}</span>
            <svg viewBox="0 0 160 220"><path d="M30 190 C 50 140, 20 110, 70 85 S 120 45, 110 20" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 5"/><circle cx="30" cy="190" r="6" fill="currentColor"/><circle cx="110" cy="20" r="7" className="device-end"/></svg>
            <div className="device-bars"><i/><i/><i/><i/></div>
          </div>
        </div>
        <div className="phonesim-copy">
          <span className="mono">RELIABILITY CONTRACT</span>
          <h4>{m.label}</h4>
          <p>{m.text}</p>
          <ul className="ticks"><li>Kotlin foreground service</li><li>Checkpointed session state</li><li>OEM-aware battery guidance</li></ul>
        </div>
      </div>
    </div>
  )
}
