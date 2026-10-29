import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import RoomCanvas, { type RoomHandle } from './components/RoomCanvas'
import Dossier from './components/Dossier'
import { STATIONS, type CaseId } from './room/InvestigationRoom'
import { PROFILE } from './data'
import resumeUrl from './assets/Dinesh_Nalla_Resume.pdf'

const CAPTIONS = [
  { kicker: 'CASE NO. DN-026 / SOLAPUR, IN', title: 'THE BUILDER’S ROOM', body: 'Dinesh Nalla — Agentic AI × Android. Every shipped system leaves a trail. Follow the red thread.', cta: 'Inspect the evidence', caseId: null },
  { kicker: 'CASE 01 / AGENTIC AI', title: 'AIOS', body: 'Eight specialists. One orchestrator. A shared pipeline from intent to evaluated output.', cta: 'Open AIOS case file', caseId: 'aios' },
  { kicker: 'CASE 02 / EXPLAINABILITY', title: 'INSIDERLENS', body: 'Don’t just alert. Show the evidence: rules, thresholds and a graph an analyst can defend.', cta: 'Open evidence ledger', caseId: 'insiderlens' },
  { kicker: 'CASE 03 / ANDROID SYSTEMS', title: 'WALKMATE V2', body: 'The app doesn’t stop when the screen does. Foreground service, checkpoints, recovery.', cta: 'Open reliability file', caseId: 'walkmate' },
  { kicker: 'STUDIO / FREELANCE PRACTICE', title: 'VALVIX', body: '10+ Android apps shipped since 2025. Healthcare, fitness, retail and business — idea to Play Store.', cta: 'Open studio manifest', caseId: 'valvix' },
  { kicker: 'NEW CASE / OPEN FOR WORK', title: 'LET’S BUILD THE NEXT SYSTEM.', body: 'Agentic AI, Android products, or the awkward intersection of both. Tell me what you’re trying to ship.', cta: 'Start a conversation', caseId: null },
  { kicker: 'CASE HISTORY / 2023 → NOW', title: 'THE ORIGIN FILE.', body: 'Web development → app development → full-stack → VALVIX → agentic AI. The red thread is not a career switch; it is the same builder adding layers.', cta: 'Open origin file', caseId: 'journey' },
  { kicker: 'CAPABILITY MAP / FRONTEND → SERVERS → AI', title: 'ONE BUILDER. END-TO-END.', body: 'Frontend, backend, servers, mobile and agentic AI — I can own the path from idea to production, not just one slice of it.', cta: 'Open capability map', caseId: 'capabilities' },
] as const

function useStoredMotion() {
  const [motion, setMotion] = useState(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    try { return localStorage.getItem('dn-motion') !== 'off' } catch { return true }
  })
  const toggle = () => setMotion(m => { try { localStorage.setItem('dn-motion', m ? 'off' : 'on') } catch { /* private mode */ } return !m })
  return [motion, toggle] as const
}

export default function App() {
  const [motion, toggleMotion] = useStoredMotion()
  const [station, setStation] = useState(0)
  const [dossier, setDossier] = useState<CaseId | null>(null)
  const [indexOpen, setIndexOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const room = useRef<RoomHandle>(null)
  const lenis = useRef<Lenis | null>(null)
  const indexRef = useRef<HTMLDialogElement>(null)
  const stationRef = useRef(0)
  const lockedRef = useRef(false)
  const scrollLockY = useRef(0)
  const pendingStation = useRef<number | null>(null)
  const n = STATIONS.length
  const locked = dossier !== null || indexOpen

  useEffect(() => {
    document.documentElement.classList.toggle('motion-off', !motion)
    let l: Lenis | null = null; let raf = 0
    // Touch devices keep native browser scrolling. Lenis is only for fine-pointer desktop wheels.
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (motion && finePointer) {
      l = new Lenis({
        duration: 1.2,
        smoothWheel: true,
        syncTouch: false,
        anchors: false,
        prevent: node => node.closest('dialog, [data-lenis-prevent]') !== null,
        virtualScroll: ({ event }) => !event.type.startsWith('touch'),
      })
      lenis.current = l
      const loop = (t: number) => { l?.raf(t); raf = requestAnimationFrame(loop) }; raf = requestAnimationFrame(loop)
    } else lenis.current = null
    const onScroll = () => {
      if (lockedRef.current) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      room.current?.setProgress(p)
      const s = Math.round(p * (n - 1)); if (s !== stationRef.current) { stationRef.current = s; setStation(s) }
    }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll()
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); l?.destroy(); lenis.current = null }
  }, [motion, n])

  const scrollToStation = useCallback((i: number) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const y = (i / (n - 1)) * max
    room.current?.resetLook()
    if (lenis.current) lenis.current.scrollTo(y, { immediate: !motion })
    else window.scrollTo({ top: y, behavior: motion ? 'smooth' : 'auto' })
  }, [motion, n])

  // iOS-safe background scroll lock: keep the page position, let the dialog scroll independently.
  useEffect(() => {
    if (!locked) return
    const body = document.body
    const html = document.documentElement
    const y = window.scrollY
    scrollLockY.current = y
    lockedRef.current = true
    lenis.current?.stop()
    const previous = {
      position: body.style.position, top: body.style.top, left: body.style.left,
      right: body.style.right, width: body.style.width, overflow: body.style.overflow,
    }
    body.style.position = 'fixed'
    body.style.top = `-${y}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    html.classList.add('scroll-locked')
    return () => {
      body.style.position = previous.position
      body.style.top = previous.top
      body.style.left = previous.left
      body.style.right = previous.right
      body.style.width = previous.width
      body.style.overflow = previous.overflow
      html.classList.remove('scroll-locked')
      lockedRef.current = false
      window.scrollTo(0, scrollLockY.current)
      lenis.current?.start()
      lenis.current?.resize()
      const target = pendingStation.current
      pendingStation.current = null
      if (target !== null) scrollToStation(target)
    }
  }, [locked, scrollToStation])
  useEffect(() => { document.querySelector<HTMLElement>('.rail-stop.is-active')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: motion ? 'smooth' : 'auto' }) }, [station, motion])
  useEffect(() => { const d = indexRef.current; if (!d) return; if (indexOpen && !d.open) d.showModal(); else if (!indexOpen && d.open) d.close() }, [indexOpen])

  const go = useCallback((i: number) => {
    setIndexOpen(false)
    if (lockedRef.current) { pendingStation.current = i; return }
    scrollToStation(i)
  }, [scrollToStation])
  const open = useCallback((id: CaseId) => { setDossier(id); room.current?.pulse() }, [])
  const copyEmail = async () => { try { await navigator.clipboard.writeText(PROFILE.email); setCopied(true); window.setTimeout(() => setCopied(false), 1800) } catch { window.location.href = `mailto:${PROFILE.email}` } }
  const cap = CAPTIONS[station]

  return (
    <>
      <a className="skip-link" href="#case-index" onClick={e => { e.preventDefault(); setIndexOpen(true) }}>Skip to case index</a>
      <RoomCanvas ref={room} motion={motion} station={station} onOpen={open} />
      <div className="room-vignette" aria-hidden="true" />
      <div className="scroll-track" style={{ height: `${n * 100}svh` }} aria-hidden="true" />

      <header className="hud-top">
        <button className="hud-brand" onClick={() => go(0)} aria-label="Back to the room"><span className="hud-mark">DN</span><span className="mono">INVESTIGATION ROOM<br/><em>Dinesh Nalla · Agentic AI × Android</em></span></button>
        <div className="hud-actions">
          <span className="hud-hint mono" aria-hidden="true">SCROLL TO MOVE · DRAG TO LOOK</span>
          <button className="hud-btn mono" onClick={() => setIndexOpen(true)}>Case index</button>
          <button className="hud-btn mono" onClick={toggleMotion} aria-pressed={motion}>{motion ? 'Motion on' : 'Motion off'}</button>
        </div>
      </header>

      <main className="hud-caption" id="main" aria-live="polite">
        <div className="caption-inner" key={station}>
          <span className="mono caption-kicker">{cap.kicker}</span>
          {station === 0 ? <h1>{cap.title}</h1> : <h2>{cap.title}</h2>}
          <p>{cap.body}</p>
          <div className="caption-actions">
            {station === 0 && <><button className="paper-btn" onClick={() => go(1)}>{cap.cta} ↓</button><button className="paper-btn ghost" onClick={() => open('profile')}>Subject profile</button></>}
            {station > 0 && station !== 5 && cap.caseId && <button className="paper-btn" onClick={() => open(cap.caseId as CaseId)}>{cap.cta} ↗</button>}
            {station === 6 && <button className="paper-btn ghost" onClick={() => go(7)}>See the full stack ↓</button>}
            {station === 7 && <button className="paper-btn ghost" onClick={() => go(5)}>Open a new case ↗</button>}
            {station === 5 && <><a className="paper-btn" href={`mailto:${PROFILE.email}`}>{cap.cta} ↗</a><button className="paper-btn ghost" onClick={copyEmail}>{copied ? 'Copied ✓' : 'Copy email'}</button><a className="paper-btn ghost" href={resumeUrl} download="Dinesh_Nalla_Resume.pdf">Résumé ↓</a><button className="paper-btn ghost" onClick={() => go(6)}>My journey ↓</button></>}
          </div>
        </div>
      </main>

      <nav className="hud-rail" aria-label="Evidence stations">
        <div className="rail-line" aria-hidden="true"><span style={{ width: `${(station / (n - 1)) * 100}%` }} /></div>
        {STATIONS.map((s, i) => <button key={s.id} className={`rail-stop ${i === station ? 'is-active' : ''}`} onClick={() => go(i)} aria-current={i === station ? 'step' : undefined}><span className="rail-no mono">0{i}</span><span className="rail-label">{s.label}</span></button>)}
      </nav>

      <dialog ref={indexRef} data-lenis-prevent className="case-index" id="case-index" onClose={() => setIndexOpen(false)} onClick={e => { if (e.target === e.currentTarget) setIndexOpen(false) }} aria-labelledby="index-title">
        <div className="index-paper" data-lenis-prevent>
          <header className="dossier-head"><div><span className="mono dossier-no">CASE INDEX / DN-026</span><h2 id="index-title">Follow the evidence</h2></div><button className="dossier-close" onClick={() => setIndexOpen(false)} aria-label="Close case index">✕</button></header>
          <ol className="index-list">
            {STATIONS.map((s, i) => <li key={s.id}><button className="index-move" onClick={() => go(i)}><span className="mono">0{i}</span><strong>{s.label}</strong><span className="mono">Move camera →</span></button>{i > 0 && i !== 5 && CAPTIONS[i].caseId && <button className="index-file" onClick={() => { setIndexOpen(false); open(CAPTIONS[i].caseId as CaseId) }}>Open file</button>}{i === 0 && <button className="index-file" onClick={() => { setIndexOpen(false); open('profile') }}>Profile</button>}</li>)}
          </ol>
          <div className="paper-actions"><a className="paper-link" href={PROFILE.github} target="_blank" rel="noreferrer">GitHub ↗</a><a className="paper-link" href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a className="paper-link" href={`mailto:${PROFILE.email}`}>Email ↗</a></div>
          <p className="dossier-note">The room is a stylized investigation space, not a real crime scene. Project evidence comes from public repositories; VALVIX output is founder-reported client work. AIOS replay is scripted, not a live LLM.</p>
        </div>
      </dialog>
      <Dossier id={dossier} motion={motion} onClose={() => setDossier(null)} />
    </>
  )
}
