import { useCallback, useEffect, useRef } from 'react'
import { CAPABILITIES, EXPERIENCE, JOURNEY, JOURNEY_SUMMARY, LINKS, PROFILE, STACK, VALVIX } from '../data'
import type { CaseId } from '../room/InvestigationRoom'
import Replay from './Replay'
import Evidence from './Evidence'
import PhoneSim from './PhoneSim'
import alertShot from '../assets/insiderlens-alert.png'
import resumeUrl from '../assets/Dinesh_Nalla_Resume.pdf'

interface Props { id: CaseId | null; motion: boolean; onClose: () => void }
const META: Record<CaseId, { no: string; title: string; kind: string; stamp: string }> = {
  aios: { no: '01', title: 'AIOS', kind: 'Agentic AI system', stamp: 'SOURCE VERIFIED' },
  insiderlens: { no: '02', title: 'InsiderLens', kind: 'Explainable detection', stamp: 'EVIDENCE LEDGER' },
  walkmate: { no: '03', title: 'WalkMate v2', kind: 'Android reliability', stamp: 'FIELD TESTED' },
  valvix: { no: '04', title: 'VALVIX', kind: 'Freelance product studio', stamp: '10+ APPS SHIPPED' },
  profile: { no: '00', title: 'Dinesh Nalla', kind: 'Subject profile', stamp: 'BUILDER' },
  journey: { no: '05', title: 'The Origin File', kind: '2023 → now', stamp: 'FOLLOW THE THREAD' },
  capabilities: { no: '06', title: 'End-to-End', kind: 'Capability map', stamp: 'ONE BUILDER' },
}

export default function Dossier({ id, motion, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const noop = useCallback(() => {}, [])
  useEffect(() => {
    const d = ref.current; if (!d) return
    if (id && !d.open) d.showModal(); else if (!id && d.open) d.close()
  }, [id])
  const m = id ? META[id] : null
  return (
    <dialog ref={ref} className="dossier" onClose={onClose} onClick={e => { if (e.target === e.currentTarget) onClose() }} aria-labelledby="dossier-title">
      {m && id && (
        <article className="dossier-paper">
          <header className="dossier-head">
            <div><span className="mono dossier-no">CASE FILE {m.no} / {m.kind}</span><h2 id="dossier-title">{m.title}</h2></div>
            <button className="dossier-close" onClick={onClose} aria-label="Close case file">✕</button>
          </header>
          <div className="dossier-stamp mono" aria-hidden="true">{m.stamp}</div>
          <div className="dossier-body">
            {id === 'aios' && <>
              <p className="dossier-lead">One prompt, eight specialists. AIOS coordinates planning, memory, research, resume, jobs, coding, evaluation and documentation through a shared pipeline. Groq routes to Ollama when the network or rate limits demand it.</p>
              <dl className="dossier-facts"><div><dt>Agents</dt><dd>8 specialized roles</dd></div><div><dt>Routing</dt><dd>Groq ↔ Ollama</dd></div><div><dt>Memory</dt><dd>Redis · PostgreSQL · ChromaDB</dd></div><div><dt>Interface</dt><dd>FastAPI + Streamlit</dd></div></dl>
              <Replay onAgent={noop} motion={motion} />
              <a className="paper-link" href={LINKS.aios} target="_blank" rel="noreferrer">Inspect public source ↗</a>
            </>}
            {id === 'insiderlens' && <>
              <p className="dossier-lead">Thirteen configurable rules fuse transaction patterns with employee behaviour. Every alert is a ledger: why it fired, which thresholds it crossed, and the graph an analyst can defend.</p>
              <img className="dossier-photo" src={alertShot} alt="InsiderLens alert ledger from the public repository" />
              <Evidence />
              <a className="paper-link" href={LINKS.insiderlens} target="_blank" rel="noreferrer">Inspect public source ↗</a>
            </>}
            {id === 'walkmate' && <>
              <p className="dossier-lead">A GPS walking tracker engineered for the hostile reality of Android background execution: foreground services, checkpointed sessions, crash recovery and OEM-aware battery guidance.</p>
              <PhoneSim />
              <dl className="dossier-facts"><div><dt>Native</dt><dd>Kotlin foreground service</dd></div><div><dt>State</dt><dd>Riverpod + SQLite checkpoints</dd></div><div><dt>Location</dt><dd>Fused location + noise filter</dd></div><div><dt>Maps</dt><dd>OpenStreetMap</dd></div></dl>
              <a className="paper-link" href={LINKS.walkmate} target="_blank" rel="noreferrer">Inspect public source ↗</a>
            </>}
            {id === 'valvix' && <>
              <p className="dossier-lead">{VALVIX.tagline} Co-founded in {VALVIX.since}, VALVIX is my freelance practice — {VALVIX.apps} Android apps delivered across {VALVIX.domains.join(', ').toLowerCase()}.</p>
              <dl className="studio-stats">{VALVIX.stats.map(s => <div className="studio-stat" key={s.label}><dt className="mono">{s.label}</dt><dd>{s.value}</dd></div>)}</dl>
              <ol className="studio-process">{VALVIX.process.map((p, i) => <li key={p}><span className="mono">0{i + 1}</span><strong>{p}</strong></li>)}</ol>
              <div className="studio-services">{VALVIX.services.map(s => <section key={s.title}><h3>{s.title}</h3><p>{s.detail}</p></section>)}</div>
              <p className="dossier-note">Founder-reported studio output. Client apps live in private repositories under NDA, so they are presented as studio capability — not open-source case studies. Work samples and references available on request.</p>
            </>}

            {id === 'journey' && <>
              <p className="dossier-lead">{JOURNEY_SUMMARY}</p>
              <ol className="journey-timeline">
                {JOURNEY.map((m, i) => <li key={m.title} className="journey-node">
                  <div className="journey-pin" aria-hidden="true"><span>{String(i + 1).padStart(2, '0')}</span></div>
                  <div className="journey-card">
                    <span className="mono journey-year">{m.year} / {m.label}</span>
                    <h3>{m.title}</h3>
                    <p>{m.body}</p>
                    <ul className="journey-evidence">{m.evidence.map(e => <li key={e}>{e}</li>)}</ul>
                  </div>
                </li>)}
              </ol>
              <p className="dossier-note">The thread is cumulative: each stage added a layer instead of replacing the previous one. Web → mobile → full-stack → client products → agentic AI.</p>
            </>}
            {id === 'capabilities' && <>
              <p className="dossier-lead">I can own the path from interface to infrastructure: frontend, mobile, backend, servers/data and agentic AI. The point is not “I know every tool” — it is that I can connect the layers and ship the whole system.</p>
              <div className="capability-map">
                {CAPABILITIES.map((c, i) => <section className="capability-layer" key={c.layer}>
                  <span className="mono capability-no">L{i + 1}</span>
                  <div><h3>{c.layer}</h3><p>{c.detail}</p><ul className="journey-evidence">{c.tools.map(t => <li key={t}>{t}</li>)}</ul></div>
                </section>)}
              </div>
              <p className="dossier-note">Frontend → backend → servers is the delivery path; mobile and agentic AI are product surfaces on top of the same engineering discipline.</p>
              <div className="paper-actions"><a className="paper-link" href={PROFILE.github} target="_blank" rel="noreferrer">See the code ↗</a><a className="paper-link" href={`mailto:${PROFILE.email}`}>Open a new case ↗</a></div>
            </>}
            {id === 'profile' && <>
              <p className="dossier-lead">{PROFILE.role}. I build agentic AI systems and Android products that survive real devices, real networks and real users. Based in {PROFILE.location}.</p>
              <div className="profile-timeline">{EXPERIENCE.map(e => <div key={e.org}><span className="mono">{e.when}</span><h3>{e.org}</h3><p className="profile-role">{e.role}</p><p>{e.note}</p></div>)}</div>
              <div className="profile-stack">{STACK.map(s => <section key={s.group}><h3 className="mono">{s.group}</h3><p>{s.items.join(' · ')}</p></section>)}</div>
              <div className="paper-actions"><a className="paper-link" href={resumeUrl} download="Dinesh_Nalla_Resume.pdf">Download résumé ↓</a><a className="paper-link" href={PROFILE.github} target="_blank" rel="noreferrer">GitHub ↗</a><a className="paper-link" href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
            </>}
          </div>
        </article>
      )}
    </dialog>
  )
}
