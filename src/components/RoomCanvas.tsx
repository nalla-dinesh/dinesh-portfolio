import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { HOTSPOTS, InvestigationRoom, type CaseId } from '../room/InvestigationRoom'
import posterUrl from '../assets/room-poster.jpg'

export interface RoomHandle { setProgress: (p: number, immediate?: boolean) => void; pulse: () => void; resetLook: () => void }
interface Props { motion: boolean; station: number; onOpen: (id: CaseId) => void; onReady?: () => void }

const RoomCanvas = forwardRef<RoomHandle, Props>(function RoomCanvas({ motion, station, onOpen, onReady }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const roomRef = useRef<InvestigationRoom | null>(null)
  const spots = useRef(new Map<string, HTMLElement>())
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const motionRef = useRef(motion)
  useEffect(() => { motionRef.current = motion }, [motion])

  useImperativeHandle(ref, () => ({
    setProgress: (p, immediate) => roomRef.current?.setProgress(p, immediate),
    pulse: () => roomRef.current?.pulse(),
    resetLook: () => roomRef.current?.resetLook(),
  }), [])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    let room: InvestigationRoom | null = null
    try {
      room = new InvestigationRoom(canvas, { reduced: !motionRef.current, onReady: () => { setReady(true); onReady?.() } })
      roomRef.current = room; room.setHotspots(spots.current)
    } catch (err) { console.warn('3D room unavailable; using accessible fallback.', err); setFailed(true); return }
    const onResize = () => room?.resize()
    const onPointer = (e: PointerEvent) => { if (e.pointerType === 'mouse' && !room) return; if (e.pointerType === 'mouse') room?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1)) }
    const down = (e: PointerEvent) => { room?.beginDrag(e.clientX, e.clientY); canvas.setPointerCapture(e.pointerId) }
    const move = (e: PointerEvent) => room?.drag(e.clientX, e.clientY)
    const up = () => room?.endDrag()
    const lost = (e: Event) => { e.preventDefault(); setFailed(true); room?.stop() }
    const vis = () => { if (document.hidden) room?.stop(); else if (motionRef.current) room?.start() }
    window.addEventListener('resize', onResize); window.addEventListener('pointermove', onPointer, { passive: true })
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up)
    canvas.addEventListener('webglcontextlost', lost); document.addEventListener('visibilitychange', vis)
    if (motionRef.current) room.start()
    return () => {
      window.removeEventListener('resize', onResize); window.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up)
      canvas.removeEventListener('webglcontextlost', lost); document.removeEventListener('visibilitychange', vis)
      room?.dispose(); roomRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => { roomRef.current?.setReduced(!motion); if (motion) roomRef.current?.start() }, [motion])
  useEffect(() => { roomRef.current?.resetLook(); roomRef.current?.pulse() }, [station])

  return (
    <div className="room-layer">
      {!failed && <canvas ref={canvasRef} className="room-canvas" aria-label="Interactive 3D investigation room. Scroll to move between evidence stations, drag to look around, or use the case index." />}
      {!failed && !ready && <div className="room-loading mono">ENTERING THE ROOM…</div>}
      {failed && (
        <div className="room-fallback">
          <img src={posterUrl} alt="Stylized 3D investigation room with a cork evidence board, red thread, desk and monitors" />
          <p className="mono">3D is unavailable on this device. The case files are still fully readable.</p>
        </div>
      )}
      <div className="hotspots" hidden={failed}>
        {HOTSPOTS.map(h => (
          <button key={h.id} ref={el => { if (el) spots.current.set(h.id, el); else spots.current.delete(h.id) }}
            className={`hotspot ${h.station === station ? 'is-current' : ''}`} style={{ display: h.station === station ? undefined : 'none' }}
            onClick={() => onOpen(h.caseId)} aria-label={h.label}>
            <span className="hotspot-ring" /><span className="hotspot-label mono">{h.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
})
export default RoomCanvas
