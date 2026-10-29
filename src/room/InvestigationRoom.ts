import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import * as T from './textures'
import alertShot from '../assets/insiderlens-alert.png'
import dashboardShot from '../assets/insiderlens-dashboard.png'
import { JOURNEY } from '../data'

export type CaseId = 'aios' | 'insiderlens' | 'walkmate' | 'valvix' | 'profile' | 'journey' | 'capabilities'
export interface Station { id: string; label: string; pos: [number, number, number]; target: [number, number, number]; mpos: [number, number, number]; mtarget: [number, number, number] }
export const STATIONS: Station[] = [
  { id: 'room', label: 'The room', pos: [5.6, 3.9, 8.6], target: [0, 2.7, -2], mpos: [0.2, 3.5, 10.9], mtarget: [0, 3.25, -2] },
  { id: 'aios', label: 'AIOS', pos: [-2.5, 3.7, 2.4], target: [-2.1, 4.0, -3.6], mpos: [-2.1, 3.9, 4.6], mtarget: [-2.1, 4.0, -3.6] },
  { id: 'insiderlens', label: 'InsiderLens', pos: [2.6, 3.7, 2.4], target: [2.2, 3.9, -3.6], mpos: [2.2, 3.9, 4.6], mtarget: [2.2, 3.9, -3.6] },
  { id: 'walkmate', label: 'WalkMate', pos: [3.7, 2.6, 2.2], target: [2.3, 1.8, -1.2], mpos: [2.3, 2.5, 4.0], mtarget: [2.3, 1.8, -1.2] },
  { id: 'valvix', label: 'VALVIX', pos: [-3.7, 2.7, 2.6], target: [-2.4, 1.95, -1.3], mpos: [-2.4, 2.5, 4.2], mtarget: [-2.4, 1.95, -1.3] },
  { id: 'contact', label: 'New case', pos: [0.2, 2.8, 3.4], target: [0, 2.3, -2.1], mpos: [0, 2.7, 5.0], mtarget: [0, 2.3, -2.1] },
  { id: 'journey', label: 'Origin file', pos: [4.7, 3.5, 2.4], target: [5.9, 3.35, -3.9], mpos: [5.9, 3.5, 4.4], mtarget: [5.9, 3.35, -3.9] },
  { id: 'capabilities', label: 'End-to-end', pos: [-3.6, 3.1, 3.8], target: [-7.2, 2.9, 1.2], mpos: [-4.4, 3.1, 4.8], mtarget: [-7.2, 2.9, 1.2] },
]
export interface Hotspot { id: string; label: string; caseId: CaseId; station: number; pos: [number, number, number] }
export const HOTSPOTS: Hotspot[] = [
  { id: 'h-aios', label: 'AIOS case file', caseId: 'aios', station: 0, pos: [-2.3, 4.25, -3.5] },
  { id: 'h-insider', label: 'InsiderLens evidence', caseId: 'insiderlens', station: 0, pos: [2.2, 4.15, -3.5] },
  { id: 'h-walk', label: 'WalkMate device', caseId: 'walkmate', station: 0, pos: [2.3, 1.85, -1.0] },
  { id: 'h-valvix', label: 'VALVIX shipping desk', caseId: 'valvix', station: 0, pos: [-2.4, 2.0, -1.2] },
  { id: 'h-profile', label: 'Subject profile', caseId: 'profile', station: 0, pos: [0, 4.6, -3.5] },
  { id: 'h-aios-2', label: 'Open AIOS file', caseId: 'aios', station: 1, pos: [-2.3, 4.25, -3.5] },
  { id: 'h-code', label: 'Orchestrator source', caseId: 'aios', station: 1, pos: [-1.4, 2.35, -2.0] },
  { id: 'h-insider-2', label: 'Open evidence ledger', caseId: 'insiderlens', station: 2, pos: [2.2, 4.15, -3.5] },
  { id: 'h-graph', label: 'Detection graph', caseId: 'insiderlens', station: 2, pos: [1.3, 2.35, -2.0] },
  { id: 'h-walk-2', label: 'Reliability tests', caseId: 'walkmate', station: 3, pos: [2.3, 1.85, -1.0] },
  { id: 'h-valvix-2', label: 'Studio manifest', caseId: 'valvix', station: 4, pos: [-2.4, 2.0, -1.2] },
  { id: 'h-profile-2', label: 'Subject profile', caseId: 'profile', station: 5, pos: [0, 4.6, -3.5] },
  { id: 'h-journey', label: 'Open origin file', caseId: 'journey', station: 6, pos: [5.9, 3.35, -3.6] },
  { id: 'h-journey-now', label: 'Where the thread leads now', caseId: 'journey', station: 6, pos: [5.9, 1.45, -3.6] },
  { id: 'h-cap-map', label: 'Capability map', caseId: 'capabilities', station: 7, pos: [-7.6, 3.5, 1.2] },
  { id: 'h-cap-rack', label: 'Servers / deployment', caseId: 'capabilities', station: 7, pos: [-6.4, 1.6, 1.2] },
]

const V = (a: [number, number, number]) => new THREE.Vector3(...a)
const smooth = (t: number) => t * t * (3 - 2 * t)

export class InvestigationRoom {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private raf = 0
  private clock = new THREE.Clock()
  private progress = 0
  private targetProgress = 0
  private reduced = false
  private running = false
  private disposed = false
  private look = new THREE.Vector2()
  private lookTarget = new THREE.Vector2()
  private pointer = new THREE.Vector2()
  private dragging = false
  private last = new THREE.Vector2()
  private hotspots = new Map<string, HTMLElement>()
  private monitors: THREE.MeshStandardMaterial[] = []
  private lamp!: THREE.SpotLight
  private dust!: THREE.Points
  private pinLights: THREE.Mesh[] = []
  private disposables: Array<{ dispose: () => void }> = []
  private mobile = false
  private pos = new THREE.Vector3()
  private tgt = new THREE.Vector3()
  private tmp = new THREE.Vector3()

  constructor(canvas: HTMLCanvasElement, opts: { reduced: boolean; onReady?: () => void }) {
    this.reduced = opts.reduced
    RectAreaLightUniformsLib.init()
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    this.renderer.setClearColor(0x0b0e0d)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.mobile = window.innerWidth < 768
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.mobile ? 1.5 : 2))
    this.camera = new THREE.PerspectiveCamera(this.mobile ? 62 : 50, 1, 0.1, 80)
    this.scene.fog = new THREE.Fog(0x0b0e0d, 14, 34)
    this.buildRoom()
    this.resize()
    this.setProgress(0, true)
    this.renderer.render(this.scene, this.camera)
    opts.onReady?.()
  }

  private mat(color: number, rough = 0.8, metal = 0, map?: THREE.Texture) {
    const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, map }); this.disposables.push(m); return m
  }
  private box(w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number, rounded = 0) {
    const g = rounded ? new RoundedBoxGeometry(w, h, d, 3, rounded) : new THREE.BoxGeometry(w, h, d)
    this.disposables.push(g); const mesh = new THREE.Mesh(g, m); mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; this.scene.add(mesh); return mesh
  }
  private plane(w: number, h: number, m: THREE.Material, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) {
    const g = new THREE.PlaneGeometry(w, h); this.disposables.push(g); const mesh = new THREE.Mesh(g, m); mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz); mesh.receiveShadow = true; this.scene.add(mesh); return mesh
  }
  private tex(t: THREE.Texture) { this.disposables.push(t); return t }

  private buildRoom() {
    const plaster = this.tex(T.plaster()), wood = this.tex(T.wood()), cork = this.tex(T.cork())
    const wall = this.mat(0xffffff, .95, 0, plaster), floor = this.mat(0xffffff, .7, 0, wood), timber = this.mat(0xffffff, .6, 0, wood)
    const dark = this.mat(0x171a18, .6, .3), metal = this.mat(0x3a3f3c, .35, .8), paper = this.mat(0xece3cd, .9)
    const red = this.mat(0xa3242a, .5), brass = this.mat(0xb08a4a, .35, .7)
    // shell
    this.plane(16, 12, floor, 0, 0, 0, -Math.PI / 2)
    this.plane(16, 8, wall, 0, 4, -4.2)
    this.plane(12, 8, wall, -8, 4, 0, 0, Math.PI / 2)
    this.plane(12, 8, wall, 8, 4, 0, 0, -Math.PI / 2)
    this.plane(16, 12, this.mat(0x141816, .95), 0, 8, 0, Math.PI / 2)
    this.box(16, .25, .12, dark, 0, .12, -4.14)
    // window with blinds (left wall)
    const win = this.plane(3.2, 2.6, new THREE.MeshBasicMaterial({ color: 0x2b4a52 }), -7.94, 4.2, -1.2, 0, Math.PI / 2)
    this.disposables.push(win.material as THREE.Material)
    this.box(.1, 2.8, 3.4, dark, -7.9, 4.2, -1.2)
    for (let i = 0; i < 9; i++) this.box(.06, .08, 3.2, metal, -7.86, 3.1 + i * .28, -1.2)
    const windowLight = new THREE.RectAreaLight(0x7fb6c9, 6, 3, 2.4); windowLight.position.set(-7.6, 4.2, -1.2); windowLight.lookAt(0, 2, -1); this.scene.add(windowLight)
    // evidence board
    this.box(7.6, 3.8, .16, timber, 0, 4.0, -4.05)
    this.plane(7.2, 3.4, this.mat(0xffffff, .95, 0, cork), 0, 4.0, -3.95)
    this.plane(3.2, .4, this.basic(T.label('EVIDENCE / BUILT SYSTEMS', '#1d1a16', '#e8c85a')), 0, 5.62, -3.9)
    const pin = (x: number, y: number, z: number) => { const g = new THREE.SphereGeometry(.05, 10, 10); this.disposables.push(g); const p = new THREE.Mesh(g, red); p.position.set(x, y, z); this.scene.add(p); this.pinLights.push(p); return p }
    const sheet = (tex: THREE.Texture, w: number, h: number, x: number, y: number, rz = 0) => { const m = new THREE.MeshStandardMaterial({ map: tex, roughness: .9 }); this.disposables.push(m); const p = this.plane(w, h, m, x, y, -3.88, 0, 0, rz); p.castShadow = true; pin(x - w * .38, y + h * .42, -3.82); pin(x + w * .38, y + h * .42, -3.82); return p }
    sheet(this.tex(T.paper({ title: 'AIOS', subtitle: 'multi-agent operating system', lines: ['8 specialized agents', 'Planner -> Memory -> Research', 'Groq / Ollama routing', 'RAG + evaluation gate', 'FastAPI + Docker'], stamp: 'CASE 01', seed: 1 })), 1.55, 1.95, -2.3, 4.15, .04)
    sheet(this.tex(T.photoTexture(alertShot, 'INSIDERLENS / ALERT LEDGER', () => this.renderOnce())), 1.9, 1.42, 2.2, 4.35, -.05)
    sheet(this.tex(T.photoTexture(dashboardShot, 'INSIDERLENS / DASHBOARD', () => this.renderOnce())), 1.5, 1.12, 2.9, 3.25, .06)
    sheet(this.tex(T.paper({ title: 'WalkMate v2', subtitle: 'background-safe GPS', lines: ['Kotlin foreground service', 'Checkpointed sessions', 'Crash recovery', 'GPS noise filtering', 'OEM battery guidance'], stamp: 'CASE 03', seed: 3 })), 1.35, 1.7, .95, 3.35, -.03)
    sheet(this.tex(T.paper({ title: 'VALVIX', subtitle: 'freelance product studio', lines: ['Founded 2025', '10+ Android apps shipped', 'Healthcare / fitness / retail', 'Idea -> Play Store', 'Client work under NDA'], stamp: 'STUDIO', accent: '#1f6f5f', seed: 4 })), 1.45, 1.8, -.85, 3.3, .05)
    sheet(this.tex(T.paper({ title: 'Dinesh Nalla', subtitle: 'subject / builder', lines: ['Agentic AI engineer', 'Android systems builder', 'Solapur, MH, India', 'VALVIX since 2025', 'Dominal intern Jul-Aug 2026'], stamp: 'PROFILE', accent: '#1f4f6f', seed: 9 })), 1.15, 1.45, 0, 4.75, -.02)
    sheet(this.tex(T.sticky('follow the red thread')), .7, .7, -3.3, 4.9, .12)
    sheet(this.tex(T.sticky('ship > slides', '#b7f397')), .7, .7, 3.3, 4.9, -.1)
    sheet(this.tex(T.sticky('10+ apps', '#e8a45a')), .65, .65, -1.6, 4.95, -.08)
    // red threads with sag
    const thread = (a: [number, number, number], b: [number, number, number]) => {
      const A = V(a), B = V(b), mid = A.clone().lerp(B, .5); mid.y -= .18; mid.z += .06
      const curve = new THREE.CatmullRomCurve3([A, mid, B]); const g = new THREE.TubeGeometry(curve, 16, .012, 5, false); this.disposables.push(g)
      const mesh = new THREE.Mesh(g, red); this.scene.add(mesh)
    }
    thread([-2.3, 4.9, -3.8], [0, 5.3, -3.8]); thread([0, 5.3, -3.8], [2.2, 4.9, -3.8]); thread([-2.3, 4.9, -3.8], [.95, 4.0, -3.8]); thread([2.2, 4.9, -3.8], [-.85, 4.0, -3.8]); thread([-.85, 4.0, -3.8], [.95, 4.0, -3.8]); thread([0, 5.3, -3.8], [-2.4, 2.1, -1.3]); thread([2.2, 4.9, -3.8], [2.3, 1.9, -1.0])
    // desk
    this.box(6.8, .18, 2.3, timber, 0, 1.5, -1.6)
    for (const x of [-3.1, 3.1]) for (const z of [-2.5, -.7]) this.box(.14, 1.45, .14, metal, x, .75, z)
    this.box(2.0, .9, 1.9, dark, -2.3, .95, -1.6); this.box(1.8, .06, 1.7, metal, -2.3, 1.2, -1.6); this.box(1.8, .06, 1.7, metal, -2.3, .8, -1.6)
    // monitors
    const monitor = (x: number, kind: 'code' | 'graph' | 'contact') => {
      this.box(2.1, 1.3, .1, dark, x, 2.4, -2.35, .04); this.box(.12, .5, .12, metal, x, 1.85, -2.4); this.box(.7, .06, .4, metal, x, 1.62, -2.3)
      const m = new THREE.MeshStandardMaterial({ map: this.tex(T.screen(kind)), emissive: 0xffffff, emissiveMap: this.tex(T.screen(kind)), emissiveIntensity: .9, roughness: .4 }); this.disposables.push(m); this.monitors.push(m)
      this.plane(1.94, 1.14, m, x, 2.4, -2.29)
      const glow = new THREE.PointLight(kind === 'graph' ? 0x7fd4c1 : 0x9ad0ff, 2.2, 4); glow.position.set(x, 2.4, -1.9); this.scene.add(glow)
    }
    monitor(-1.35, 'code'); monitor(1.35, 'graph')
    // keyboard + mouse
    this.box(1.9, .07, .6, dark, 0, 1.63, -.85, .03)
    const keyGeo = new THREE.BoxGeometry(.11, .03, .11); this.disposables.push(keyGeo); const keys = new THREE.InstancedMesh(keyGeo, this.mat(0x2c322f, .6), 60); const mtx = new THREE.Matrix4(); let k = 0
    for (let r = 0; r < 4; r++) for (let c = 0; c < 15; c++) { mtx.setPosition(-.84 + c * .12, 1.68, -1.02 + r * .13); keys.setMatrixAt(k++, mtx) } keys.castShadow = true; this.scene.add(keys)
    this.box(.22, .07, .34, dark, 1.35, 1.64, -.85, .05)
    // phone (WalkMate)
    this.box(.42, .05, .85, dark, 2.3, 1.62, -1.0, .04)
    const phoneMat = new THREE.MeshStandardMaterial({ map: this.tex(T.screen('map')), emissive: 0xffffff, emissiveMap: this.tex(T.screen('map')), emissiveIntensity: .8 }); this.disposables.push(phoneMat)
    this.plane(.36, .76, phoneMat, 2.3, 1.651, -1.0, -Math.PI / 2)
    // VALVIX shipping boxes + laptop
    const boxMat = this.mat(0xb99a6b, .9); this.box(1.1, .7, .9, boxMat, -2.5, 1.95, -1.3); this.box(.9, .55, .8, boxMat, -2.2, 2.55, -1.5)
    this.plane(.9, .24, this.basic(T.label('VALVIX', '#b99a6b', '#1d1a16')), -2.5, 1.95, -.84)
    this.plane(.7, .2, this.basic(T.label('10+ APPS', '#b99a6b', '#1d1a16')), -2.2, 2.55, -1.09)
    this.box(1.3, .05, .9, metal, -1.0, 1.62, -1.5, .02); const lid = this.box(1.3, .85, .05, dark, -1.0, 2.05, -1.92, .02); lid.rotation.x = -.25
    const lapMat = new THREE.MeshStandardMaterial({ map: this.tex(T.screen('contact')), emissive: 0xffffff, emissiveMap: this.tex(T.screen('contact')), emissiveIntensity: .7 }); this.disposables.push(lapMat)
    const lapScreen = this.plane(1.18, .74, lapMat, -1.0, 2.05, -1.89); lapScreen.rotation.x = -.25
    // lamp
    this.box(.5, .06, .5, brass, 2.95, 1.62, -2.2); this.box(.06, 1.1, .06, brass, 2.95, 2.15, -2.2)
    const shade = new THREE.Mesh(new THREE.ConeGeometry(.32, .4, 20, 1, true), this.mat(0x1f4f4f, .4, .5)); this.disposables.push(shade.geometry); shade.position.set(2.95, 2.75, -2.1); shade.rotation.x = .5; this.scene.add(shade)
    this.lamp = new THREE.SpotLight(0xffd28a, 55, 9, .75, .5, 1.4); this.lamp.position.set(2.95, 2.7, -2.0); this.lamp.target.position.set(1.2, 1.5, -1.0); this.lamp.castShadow = true; this.lamp.shadow.mapSize.set(this.mobile ? 1024 : 2048, this.mobile ? 1024 : 2048); this.lamp.shadow.bias = -.0005; this.scene.add(this.lamp, this.lamp.target)
    // mug, notebook, cables
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(.14, .12, .28, 18), this.mat(0xe9e0c9, .6)); this.disposables.push(mug.geometry); mug.position.set(1.9, 1.75, -1.6); mug.castShadow = true; this.scene.add(mug)
    this.box(.7, .04, .5, paper, .55, 1.62, -1.7); this.box(.02, .02, .5, red, .55, 1.65, -1.7)
    const cable = new THREE.CatmullRomCurve3([V([1.35, 1.6, -2.3]), V([1.6, 1.55, -1.8]), V([2.0, 1.6, -1.2]), V([2.3, 1.62, -1.0])]); const cg = new THREE.TubeGeometry(cable, 20, .015, 5); this.disposables.push(cg); this.scene.add(new THREE.Mesh(cg, dark))
    // shelves + binders on right wall
    this.box(.12, .08, 3.2, timber, 7.9, 3.2, -1.5); this.box(.12, .08, 3.2, timber, 7.9, 4.4, -1.5)
    for (let i = 0; i < 7; i++) { const b = this.box(.16, .7, .5, this.mat([0xa3242a, 0x1f4f6f, 0x1f6f5f, 0xe8c85a][i % 4], .8), 7.85, 3.6, -2.8 + i * .42); b.rotation.z = (i % 2 ? .04 : -.03) }
    // clock
    const clock = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .06, 32), this.mat(0xe9e0c9, .6)); this.disposables.push(clock.geometry); clock.position.set(-5.2, 5.4, -4.05); clock.rotation.x = Math.PI / 2; this.scene.add(clock)
    this.box(.03, .3, .02, dark, -5.2, 5.5, -4.0); this.box(.22, .03, .02, dark, -5.1, 5.4, -4.0)

    // ORIGIN FILE — vertical case-history board added after the contact station
    this.box(3.1, 5.1, .16, timber, 5.9, 3.3, -4.05)
    this.plane(2.9, 4.9, this.mat(0xffffff, .95, 0, cork), 5.9, 3.3, -3.95)
    this.plane(2.8, .36, this.basic(T.label('ORIGIN FILE / 2023 -> NOW', '#1d1a16', '#e8c85a')), 5.9, 5.98, -3.9)
    JOURNEY.forEach((m, i) => {
      const y = 5.05 - i * .92
      sheet(this.tex(T.milestone(m.year, m.title, m.label, i === 4 ? '#1f6f5f' : '#a3242a')), 2.35, .82, 5.9, y, (i % 2 ? .025 : -.025))
      if (i < JOURNEY.length - 1) thread([5.9, y - .34, -3.8], [5.9, y - .58, -3.8])
    })
    sheet(this.tex(T.sticky('the thread is the skill stack', '#b7f397')), .72, .72, 4.85, 1.05, .1)
    const archive = this.mat(0xb99a6b, .9)
    ;['2023', '2024', '2025', 'NOW'].forEach((yr, i) => { const x = 4.9 + i * .62; this.box(.52, .42, .5, archive, x, .21, -3.25); this.plane(.44, .16, this.basic(T.label(yr, '#b99a6b', '#1d1a16')), x, .24, -2.99) })
    const originLight = new THREE.SpotLight(0xffe2b0, 34, 11, .8, .6, 1.2); originLight.position.set(5.9, 7.0, 1.2); originLight.target.position.set(5.9, 3.2, -4); this.scene.add(originLight, originLight.target)
    // END-TO-END capability rack + wall map on the left side of the room
    this.box(.12, 2.7, 3.9, dark, -7.94, 3.5, 1.2)
    this.plane(3.6, 2.35, this.basic(T.screen('stack')), -7.87, 3.5, 1.2, 0, Math.PI / 2)
    this.plane(2.6, .3, this.basic(T.label('ONE BUILDER / END-TO-END', '#1d1a16', '#7fd4c1')), -7.86, 4.95, 1.2, 0, Math.PI / 2)
    this.box(.95, 2.5, 1.5, dark, -6.9, 1.25, 1.2, .03)
    for (let i = 0; i < 5; i++) {
      this.box(.06, .34, 1.28, metal, -6.41, .48 + i * .43, 1.2)
      const led = new THREE.Mesh(new THREE.SphereGeometry(.035, 8, 8), new THREE.MeshBasicMaterial({ color: i === 4 ? 0xc43b32 : 0xb7f397 })); this.disposables.push(led.geometry, led.material); led.position.set(-6.37, .48 + i * .43, .72); this.scene.add(led)
    }
    this.plane(.9, .22, this.basic(T.label('SERVERS / DEPLOY', '#171a18', '#e8c85a')), -6.36, 2.35, 1.2, 0, Math.PI / 2)
    const rackGlow = new THREE.PointLight(0x7fd4c1, 2.4, 5); rackGlow.position.set(-6.2, 1.6, 1.2); this.scene.add(rackGlow)
    const rackCable = new THREE.CatmullRomCurve3([V([-6.4, .3, 1.2]), V([-5.4, .08, 1.0]), V([-4.2, .08, -.4]), V([-3.1, .4, -1.6])]); const rcg = new THREE.TubeGeometry(rackCable, 24, .02, 5); this.disposables.push(rcg); this.scene.add(new THREE.Mesh(rcg, dark))
    // chair
    this.box(1.1, .12, 1.0, dark, .6, 1.0, .5, .05); this.box(1.1, 1.1, .12, dark, .6, 1.6, .95, .05); this.box(.08, .9, .08, metal, .6, .5, .5)
    // rug + contact shadow
    this.plane(7.5, 4.2, this.mat(0x2b2118, .95), 0, .01, -.4, -Math.PI / 2)
    // lights
    this.scene.add(new THREE.AmbientLight(0xffffff, .22))
    this.scene.add(new THREE.HemisphereLight(0x8fb6c9, 0x2a1a10, .35))
    const ceiling = new THREE.PointLight(0xffc98a, 18, 16, 1.6); ceiling.position.set(0, 6.8, 1); this.scene.add(ceiling)
    const boardLight = new THREE.SpotLight(0xffe2b0, 40, 12, .9, .6, 1.2); boardLight.position.set(0, 7.2, 1.5); boardLight.target.position.set(0, 4, -4); this.scene.add(boardLight, boardLight.target)
    // dust
    const n = this.mobile ? 80 : 160; const pos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - .5) * 12; pos[i * 3 + 1] = Math.random() * 6 + .5; pos[i * 3 + 2] = (Math.random() - .5) * 8 }
    const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); this.disposables.push(dg)
    const dm = new THREE.PointsMaterial({ color: 0xffe2b0, size: .02, transparent: true, opacity: .35, depthWrite: false }); this.disposables.push(dm)
    this.dust = new THREE.Points(dg, dm); this.scene.add(this.dust)
  }
  private basic(t: THREE.Texture) { const m = new THREE.MeshBasicMaterial({ map: t, transparent: true }); this.disposables.push(m); return m }

  setHotspots(map: Map<string, HTMLElement>) { this.hotspots = map }
  setProgress(p: number, immediate = false) { this.targetProgress = THREE.MathUtils.clamp(p, 0, 1); if (immediate || this.reduced) { this.progress = this.targetProgress; this.updateCamera(0); this.renderOnce() } }
  setReduced(v: boolean) { this.reduced = v; if (v) { this.stop(); this.progress = this.targetProgress; this.updateCamera(0); this.renderOnce() } else this.start() }
  setPointer(x: number, y: number) { this.pointer.set(x, y) }
  pulse() { this.monitors.forEach(m => { m.emissiveIntensity = 1.6 }); if (this.reduced) this.renderOnce() }

  private stationAt(p: number) {
    const f = p * (STATIONS.length - 1); const i = Math.min(Math.floor(f), STATIONS.length - 2); const t = smooth(f - i)
    const a = STATIONS[i], b = STATIONS[i + 1]
    const pa = this.mobile ? a.mpos : a.pos, pb = this.mobile ? b.mpos : b.pos
    const ta = this.mobile ? a.mtarget : a.target, tb = this.mobile ? b.mtarget : b.target
    this.pos.set(THREE.MathUtils.lerp(pa[0], pb[0], t), THREE.MathUtils.lerp(pa[1], pb[1], t), THREE.MathUtils.lerp(pa[2], pb[2], t))
    this.tgt.set(THREE.MathUtils.lerp(ta[0], tb[0], t), THREE.MathUtils.lerp(ta[1], tb[1], t), THREE.MathUtils.lerp(ta[2], tb[2], t))
  }
  private updateCamera(dt: number) {
    this.stationAt(this.progress)
    const damp = dt ? 1 - Math.exp(-dt * 4) : 1
    this.look.lerp(this.lookTarget, damp)
    const parallax = this.reduced ? 0 : 1
    this.tmp.copy(this.pos)
    this.tmp.x += this.look.x * 1.1 + this.pointer.x * .18 * parallax
    this.tmp.y += this.look.y * .6 + this.pointer.y * .1 * parallax
    this.camera.position.lerp(this.tmp, dt ? 1 - Math.exp(-dt * 6) : 1)
    const target = this.tgt.clone(); target.x += this.look.x * .35; target.y += this.look.y * .2
    this.camera.lookAt(target)
  }
  private updateHotspots() {
    const w = window.innerWidth, h = window.innerHeight
    for (const hs of HOTSPOTS) {
      const el = this.hotspots.get(hs.id); if (!el) continue
      this.tmp.set(...hs.pos).project(this.camera)
      const visible = this.tmp.z < 1 && Math.abs(this.tmp.x) < 1.05 && Math.abs(this.tmp.y) < 1.05
      el.style.visibility = visible ? 'visible' : 'hidden'
      el.style.transform = `translate(-50%,-50%) translate(${(this.tmp.x * .5 + .5) * w}px, ${(-this.tmp.y * .5 + .5) * h}px)`
    }
  }
  private tick = () => {
    if (!this.running || this.disposed) return
    this.raf = requestAnimationFrame(this.tick)
    const dt = Math.min(this.clock.getDelta(), .05); const time = this.clock.elapsedTime
    this.progress += (this.targetProgress - this.progress) * (1 - Math.exp(-dt * 5))
    this.updateCamera(dt)
    if (!this.reduced) {
      this.dust.rotation.y = time * .01
      this.lamp.intensity = 55 + Math.sin(time * 7) * 1.2
      this.monitors.forEach((m, i) => { m.emissiveIntensity += ((.85 + Math.sin(time * 2 + i) * .05) - m.emissiveIntensity) * .05 })
      this.pinLights.forEach((p, i) => { p.scale.setScalar(1 + Math.sin(time * 2 + i) * .06) })
    }
    this.renderer.render(this.scene, this.camera)
    this.updateHotspots()
  }
  private renderOnce() { if (this.disposed) return; this.updateCamera(0); this.renderer.render(this.scene, this.camera); this.updateHotspots() }
  resize() {
    const w = window.innerWidth, h = window.innerHeight; this.mobile = w < 768
    this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.fov = this.mobile ? 62 : 50; this.camera.updateProjectionMatrix(); this.renderOnce()
  }
  start() { if (this.running || this.disposed || this.reduced) return; this.running = true; this.clock.start(); this.raf = requestAnimationFrame(this.tick) }
  stop() { this.running = false; cancelAnimationFrame(this.raf) }
  beginDrag(x: number, y: number) { this.dragging = true; this.last.set(x, y) }
  drag(x: number, y: number) { if (!this.dragging) return; this.lookTarget.x = THREE.MathUtils.clamp(this.lookTarget.x - (x - this.last.x) * .004, -1.4, 1.4); this.lookTarget.y = THREE.MathUtils.clamp(this.lookTarget.y + (y - this.last.y) * .003, -.7, .7); this.last.set(x, y); if (this.reduced) this.renderOnce() }
  endDrag() { this.dragging = false }
  resetLook() { this.lookTarget.set(0, 0) }
  dispose() {
    this.disposed = true; this.stop()
    this.disposables.forEach(d => d.dispose()); this.renderer.dispose()
    this.scene.clear()
  }
}
