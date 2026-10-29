import { useEffect, useRef, useState } from 'react'
import { AGENTS, SCENARIOS, type ScenarioId } from '../data'

export default function Replay({ onAgent, motion }: { onAgent: (i: number) => void; motion: boolean }) {
  const [scenario, setScenario] = useState<ScenarioId>('career')
  const [running, setRunning] = useState(false)
  const [step, setStep] = useState(-1)
  const timer = useRef<number | null>(null)
  const sc = SCENARIOS[scenario]
  const done = step >= sc.steps.length

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current) }, [])
  useEffect(() => {
    if (!running) return
    if (step >= sc.steps.length) { setRunning(false); onAgent(-1); return }
    onAgent(sc.steps[step] ?? -1)
    timer.current = window.setTimeout(() => setStep(s => s + 1), motion ? 750 : 250)
    return () => { if (timer.current) window.clearTimeout(timer.current) }
  }, [running, step, sc, motion, onAgent])

  const run = () => { setStep(0); setRunning(true) }
  const change = (id: ScenarioId) => { setScenario(id); setRunning(false); setStep(-1); onAgent(-1) }

  return (
    <div className="replay" aria-label="AIOS architecture replay">
      <div className="replay-head">
        <span className="mono">ARCHITECTURE REPLAY</span>
        <span className="replay-badge">Scripted · no live LLM</span>
      </div>
      <div className="chips" role="group" aria-label="Replay scenario">
        {(Object.keys(SCENARIOS) as ScenarioId[]).map(id => (
          <button key={id} className={`chip ${scenario === id ? 'is-active' : ''}`} onClick={() => change(id)} aria-pressed={scenario === id}>{SCENARIOS[id].label}</button>
        ))}
      </div>
      <p className="prompt mono">“{sc.prompt}”</p>
      <ol className="agents">
        {AGENTS.map((a, i) => {
          const at = sc.steps.indexOf(i)
          const isActive = running && step >= 0 && sc.steps[step] === i
          const isDone = at >= 0 && (done || at < step)
          return (
            <li key={a.id} className={`agent ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''} ${at < 0 ? 'is-idle' : ''}`}>
              <span className="agent-dot" />
              <span className="agent-name">{a.label}</span>
              <span className="agent-detail">{a.detail}</span>
            </li>
          )
        })}
      </ol>
      <div className="replay-progress" aria-hidden="true"><span style={{ width: `${done ? 100 : Math.max(0, step) / sc.steps.length * 100}%` }} /></div>
      <div className="replay-foot">
        <button className="btn btn-solid" onClick={run} disabled={running}>{running ? 'Running…' : done ? 'Replay again' : 'Run replay'} <span aria-hidden="true">▶</span></button>
        <p className="replay-result" aria-live="polite">{done ? sc.result : running ? `Stage ${Math.min(step + 1, sc.steps.length)} / ${sc.steps.length}` : 'Select a scenario, then run the pipeline.'}</p>
      </div>
    </div>
  )
}
