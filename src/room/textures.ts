import * as THREE from 'three'

function rng(seed: number) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 } }
export function canvasTexture(w: number, h: number, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void): THREE.CanvasTexture {
  const el = document.createElement('canvas'); el.width = w; el.height = h
  const c = el.getContext('2d')!; draw(c, w, h)
  const t = new THREE.CanvasTexture(el); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t
}
export function plaster(): THREE.CanvasTexture {
  const t = canvasTexture(512, 512, (c, w, h) => {
    c.fillStyle = '#2a332f'; c.fillRect(0, 0, w, h)
    const r = rng(7); const img = c.getImageData(0, 0, w, h); const d = img.data
    for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * 20; d[i] += n; d[i + 1] += n; d[i + 2] += n }
    c.putImageData(img, 0, 0)
    c.strokeStyle = 'rgba(0,0,0,.16)'; c.lineWidth = 1
    for (let i = 0; i < 12; i++) { c.beginPath(); let x = r() * w, y = r() * h; c.moveTo(x, y); for (let j = 0; j < 5; j++) { x += (r() - .5) * 60; y += r() * 40; c.lineTo(x, y) } c.stroke() }
  }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2); return t
}
export function wood(): THREE.CanvasTexture {
  const t = canvasTexture(512, 512, (c, w, h) => {
    c.fillStyle = '#654630'; c.fillRect(0, 0, w, h); const r = rng(21)
    for (let y = 0; y < h; y += 3) { c.strokeStyle = `rgba(${35 + r() * 30},${22 + r() * 18},${10 + r() * 10},${.25 + r() * .3})`; c.lineWidth = 1 + r() * 2; c.beginPath(); c.moveTo(0, y); for (let x = 0; x <= w; x += 32) c.lineTo(x, y + Math.sin(x * .02 + y) * 3 + (r() - .5) * 2); c.stroke() }
    for (let i = 0; i < 7; i++) { c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 2; c.beginPath(); c.ellipse(r() * w, r() * h, 18 + r() * 30, 6 + r() * 10, r(), 0, Math.PI * 2); c.stroke() }
  }); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t
}
export function cork(): THREE.CanvasTexture {
  const t = canvasTexture(512, 512, (c, w, h) => {
    c.fillStyle = '#92714c'; c.fillRect(0, 0, w, h); const r = rng(33)
    for (let i = 0; i < 9000; i++) { const x = r() * w, y = r() * h, s = 1 + r() * 3; c.fillStyle = `rgba(${65 + r() * 80},${45 + r() * 50},${25 + r() * 30},${.25 + r() * .4})`; c.fillRect(x, y, s, s) }
  }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 1); return t
}
export function paper(opts: { title: string; subtitle?: string; lines?: string[]; stamp?: string; accent?: string; seed?: number }): THREE.CanvasTexture {
  return canvasTexture(512, 640, (c, w, h) => {
    const r = rng(opts.seed ?? 5); c.fillStyle = '#ece3cd'; c.fillRect(0, 0, w, h)
    for (let i = 0; i < 2200; i++) { c.fillStyle = `rgba(120,100,70,${r() * .07})`; c.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2) }
    c.fillStyle = '#1d1a16'; c.font = 'bold 32px monospace'; c.fillText(opts.title.toUpperCase(), 32, 62)
    if (opts.subtitle) { c.font = '17px monospace'; c.fillStyle = '#5a5142'; c.fillText(opts.subtitle, 32, 94) }
    c.strokeStyle = '#1d1a16'; c.lineWidth = 2; c.beginPath(); c.moveTo(32, 114); c.lineTo(w - 32, 114); c.stroke()
    c.font = '18px monospace'; c.fillStyle = '#2b261f'
    ;(opts.lines ?? []).forEach((ln, i) => { c.fillText(ln.length > 40 ? ln.slice(0, 39) + '…' : ln, 32, 154 + i * 33) })
    if (opts.stamp) { c.save(); c.translate(w - 145, h - 105); c.rotate(-.16); c.strokeStyle = opts.accent ?? '#a3242a'; c.lineWidth = 4; c.strokeRect(-92, -32, 184, 64); c.fillStyle = opts.accent ?? '#a3242a'; c.font = 'bold 24px monospace'; c.textAlign = 'center'; c.fillText(opts.stamp, 0, 9); c.restore() }
    c.fillStyle = opts.accent ?? '#a3242a'; c.fillRect(32, h - 56, 120, 7)
  })
}
export function sticky(text: string, color = '#e8c85a'): THREE.CanvasTexture {
  return canvasTexture(256, 256, (c, w, h) => {
    c.fillStyle = color; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(0, h - 16, w, 16)
    c.fillStyle = '#2a2116'; c.font = 'bold 25px monospace'; const words = text.split(' '); let line = '', y = 58
    for (const word of words) { const test = line + word + ' '; if (c.measureText(test).width > w - 40 && line) { c.fillText(line, 20, y); line = word + ' '; y += 32 } else line = test }
    c.fillText(line, 20, y)
  })
}
export function screen(kind: 'code' | 'graph' | 'contact' | 'map' | 'stack'): THREE.CanvasTexture {
  return canvasTexture(768, 480, (c, w, h) => {
    c.fillStyle = '#0a1110'; c.fillRect(0, 0, w, h); c.fillStyle = '#101b19'; c.fillRect(0, 0, w, 36)
    c.fillStyle = '#7fd4c1'; c.font = '16px monospace'; c.fillText(kind === 'code' ? 'aios / orchestrator' : kind === 'graph' ? 'insiderlens / evidence' : kind === 'map' ? 'walkmate / session' : kind === 'stack' ? 'end-to-end / capability map' : 'new_case.txt', 16, 24)
    if (kind === 'code') {
      const lines = ['class AgentOrchestrator:', '  AGENT_REGISTRY = {', '    "planner": Planner,', '    "memory": Memory,', '    "research": Research,', '    "resume": Resume,', '    "job": Job,', '    "coding": Coding,', '    "evaluation": Eval,', '    "documentation": Docs,', '  }', '', '  def run(plan):', '    for task in plan:', '      yield agents[task].execute()']
      lines.forEach((ln, i) => { c.fillStyle = i === 0 || i === 12 ? '#e8c85a' : ln.includes('"') ? '#9ad0ff' : '#b7f397'; c.font = '17px monospace'; c.fillText(ln, 20, 70 + i * 25) })
    } else if (kind === 'graph') {
      const nodes = [[140, 140], [330, 90], [560, 150], [430, 320], [180, 340], [620, 330]]
      c.strokeStyle = '#7fd4c1'; c.lineWidth = 2
      ;[[0,1],[1,2],[2,3],[3,4],[4,0],[1,3],[3,5]].forEach(([a,b]) => { c.beginPath(); c.moveTo(nodes[a][0], nodes[a][1]); c.lineTo(nodes[b][0], nodes[b][1]); c.stroke() })
      nodes.forEach(([x, y], i) => { c.fillStyle = i === 3 ? '#c43b32' : '#e9e0c9'; c.beginPath(); c.arc(x, y, 22, 0, Math.PI * 2); c.fill(); c.fillStyle = '#0a1110'; c.font = 'bold 16px monospace'; c.textAlign = 'center'; c.fillText(i === 3 ? 'EMP' : 'A' + i, x, y + 6) })
      c.textAlign = 'left'; c.fillStyle = '#e8c85a'; c.font = '18px monospace'; c.fillText('T1 cycle + E1 off-hours -> F1 fusion', 24, 440)
    } else if (kind === 'map') {
      c.strokeStyle = '#1e3a34'; c.lineWidth = 1; for (let x = 0; x < w; x += 40) { c.beginPath(); c.moveTo(x, 36); c.lineTo(x, h); c.stroke() }; for (let y = 36; y < h; y += 40) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke() }
      c.strokeStyle = '#b7f397'; c.lineWidth = 5; c.beginPath(); c.moveTo(120, 400); c.bezierCurveTo(200, 300, 160, 220, 330, 200); c.bezierCurveTo(470, 180, 480, 110, 620, 90); c.stroke()
      c.fillStyle = '#c43b32'; c.beginPath(); c.arc(620, 90, 12, 0, Math.PI * 2); c.fill(); c.fillStyle = '#e9e0c9'; c.font = '18px monospace'; c.fillText('FOREGROUND SERVICE / CHECKPOINT OK', 24, 450)
    } else if (kind === 'stack') {
      const layers = [['FRONTEND', '#e8c85a'], ['MOBILE', '#7fd4c1'], ['BACKEND', '#9ad0ff'], ['SERVERS / DATA', '#b7f397'], ['AGENTIC AI', '#c43b32']] as const
      layers.forEach(([name, color], i) => { const y = 70 + i * 74; c.strokeStyle = color; c.lineWidth = 2; c.strokeRect(60, y, w - 120, 54); c.fillStyle = color; c.font = 'bold 24px monospace'; c.fillText(name, 84, y + 35); if (i < layers.length - 1) { c.beginPath(); c.moveTo(w / 2, y + 54); c.lineTo(w / 2, y + 74); c.stroke() } })
      c.fillStyle = '#e9e0c9'; c.font = '18px monospace'; c.fillText('ONE BUILDER / IDEA -> PRODUCTION', 60, 452)
    } else {
      c.fillStyle = '#e9e0c9'; c.font = 'bold 40px monospace'; c.fillText('OPEN A NEW CASE', 40, 120)
      c.fillStyle = '#7fd4c1'; c.font = '22px monospace'; c.fillText('nalladinesh53@gmail.com', 40, 180)
      c.fillStyle = '#9a9f96'; c.font = '18px monospace'; c.fillText('Agentic AI / Android / Freelance products', 40, 230); c.fillText('Solapur, Maharashtra, India', 40, 262)
      c.strokeStyle = '#c43b32'; c.lineWidth = 3; c.strokeRect(40, 310, 300, 64); c.fillStyle = '#c43b32'; c.font = 'bold 24px monospace'; c.fillText('START A CONVERSATION', 58, 350)
    }
  })
}
export function photoTexture(src: string, caption: string, onLoad?: () => void): THREE.CanvasTexture {
  const tex = canvasTexture(640, 480, (c, w, h) => { c.fillStyle = '#ddd3bb'; c.fillRect(0, 0, w, h); c.fillStyle = '#111'; c.fillRect(18, 18, w - 36, h - 90); c.fillStyle = '#2a2116'; c.font = 'bold 22px monospace'; c.fillText(caption, 24, h - 34) })
  const img = new Image(); img.onload = () => { const c = (tex.image as HTMLCanvasElement).getContext('2d')!; c.drawImage(img, 18, 18, 604, 372); tex.needsUpdate = true; onLoad?.() }; img.src = src
  return tex
}
export function label(text: string, bg = '#1d1a16', fg = '#e9e0c9'): THREE.CanvasTexture {
  return canvasTexture(512, 128, (c, w, h) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); c.fillStyle = fg; let size = 52; c.font = `bold ${size}px monospace`; while (c.measureText(text).width > w - 40 && size > 18) { size -= 2; c.font = `bold ${size}px monospace` } c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, w / 2, h / 2) })
}

export function milestone(year: string, title: string, detail: string, accent = '#a3242a'): THREE.CanvasTexture {
  return canvasTexture(640, 256, (c, w, h) => {
    c.fillStyle = '#ece3cd'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.07)'; c.fillRect(0, h - 8, w, 8)
    c.fillStyle = accent; c.font = 'bold 44px monospace'; c.fillText(year.toUpperCase(), 28, 62)
    c.fillStyle = '#1d1a16'; c.font = 'bold 34px monospace'; c.fillText(title.toUpperCase(), 28, 116)
    c.fillStyle = '#4a4237'; c.font = '20px monospace'
    const words = detail.split(' '); let line = '', y = 158
    for (const word of words) { const test = line + word + ' '; if (c.measureText(test).width > w - 56 && line) { c.fillText(line, 28, y); line = word + ' '; y += 28 } else line = test }
    c.fillText(line, 28, y)
    c.strokeStyle = accent; c.lineWidth = 4; c.beginPath(); c.moveTo(28, h - 26); c.lineTo(150, h - 26); c.stroke()
  })
}
