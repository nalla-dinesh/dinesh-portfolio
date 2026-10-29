import { useEffect, useRef, useState } from 'react'
import { RULES } from '../data'
import alertShot from '../assets/insiderlens-alert.png'

const NODES = [
  { id: 0, x: 60, y: 60, label: 'A' }, { id: 1, x: 200, y: 40, label: 'B' },
  { id: 2, x: 320, y: 90, label: 'C' }, { id: 3, x: 240, y: 190, label: 'D' },
  { id: 4, x: 80, y: 190, label: 'EMP' },
]
const EDGES = [[0,1],[1,2],[2,3],[3,0],[4,1],[4,3]]

export default function Evidence() {
  const [rule, setRule] = useState(0)
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => { const d = dialogRef.current; if (!d) return; if (open && !d.open) d.showModal(); else if (!open && d.open) d.close() }, [open])
  const r = RULES[rule]
  const lit = new Set<number>(r.graph)
  return (
    <div className="evidence">
      <div className="chips" role="group" aria-label="Detection rule">
        {RULES.map((x, i) => <button key={x.id} className={`chip chip-dark ${rule === i ? 'is-active' : ''}`} onClick={() => setRule(i)} aria-pressed={rule === i}><b>{x.id}</b> {x.label}</button>)}
      </div>
      <div className="evidence-grid">
        <svg viewBox="0 0 380 240" className="graph" role="img" aria-label={`Illustrative graph for ${r.label}`}>
          {EDGES.map(([a, b], i) => {
            const A = NODES[a], B = NODES[b]
            const on = lit.has(a) && lit.has(b)
            return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} className={on ? 'edge on' : 'edge'} />
          })}
          {NODES.map(n => <g key={n.id} className={lit.has(n.id) ? 'node on' : 'node'}><circle cx={n.x} cy={n.y} r={n.id === 4 ? 20 : 16}/><text x={n.x} y={n.y + 4}>{n.label}</text></g>)}
        </svg>
        <div className="ledger">
          <span className="mono ledger-kind">{r.kind} rule · {r.id}</span>
          <h4>{r.label}</h4>
          <p>{r.evidence}</p>
          <p className="ledger-note">Every alert carries its why-fire blocks, thresholds and subgraph. Ground truth is kept outside the detection engine.</p>
          <button className="btn btn-dark" onClick={() => setOpen(true)}>View repository screenshot</button>
        </div>
      </div>
      <p className="fine">Illustrative graph on synthetic data. Not a live bank feed; no real customer information.</p>
      <dialog ref={dialogRef} className="shot-dialog" onClose={() => setOpen(false)} onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
        <div className="shot-inner">
          <div className="shot-head"><span className="mono">InsiderLens · alert ledger (repository screenshot)</span><button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close screenshot">✕</button></div>
          <img src={alertShot} alt="InsiderLens alert ledger showing evidence blocks and a subgraph" loading="lazy" />
        </div>
      </dialog>
    </div>
  )
}
