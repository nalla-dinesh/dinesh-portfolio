export const PROFILE = {
  name: 'Dinesh Nalla',
  role: 'Agentic AI Engineer · Android Systems Builder',
  email: 'nalladinesh53@gmail.com',
  github: 'https://github.com/nalla-dinesh',
  linkedin: 'https://linkedin.com/in/dinesh-nalla-6037533b1',
  location: 'Solapur, Maharashtra, India',
} as const

export const AGENTS = [
  { id: 'planner', label: 'Planner', detail: 'Decomposes intent into an executable task graph.' },
  { id: 'memory', label: 'Memory', detail: 'Redis sessions, PostgreSQL profiles, ChromaDB semantics.' },
  { id: 'research', label: 'Research', detail: 'Web search, hybrid retrieval and source-grounded synthesis.' },
  { id: 'resume', label: 'Resume', detail: 'PDF parsing, skill extraction and ATS scoring.' },
  { id: 'job', label: 'Job', detail: 'Search, fit ranking and application guidance.' },
  { id: 'coding', label: 'Coding', detail: 'Generation, review and interview-question workflows.' },
  { id: 'evaluation', label: 'Evaluation', detail: 'Quality checks and hallucination detection.' },
  { id: 'documentation', label: 'Documentation', detail: 'Aggregates results into a readable report.' },
] as const

export type ScenarioId = 'career' | 'research' | 'code'
export const SCENARIOS: Record<ScenarioId, { label: string; prompt: string; steps: number[]; result: string }> = {
  career: {
    label: 'Career copilot',
    prompt: 'Analyse my resume and find matching Flutter roles.',
    steps: [0, 3, 4, 6, 7],
    result: 'Plan → resume skills → ranked roles → quality gate → report. A coordinated pipeline, not eight chatbots in a trench coat.',
  },
  research: {
    label: 'Research brief',
    prompt: 'Compare offline-first RAG stacks for a clinic.',
    steps: [0, 1, 2, 6, 7],
    result: 'Plan → memory context → retrieval + synthesis → evaluation → cited brief. Source grounding stays in the loop.',
  },
  code: {
    label: 'Build & review',
    prompt: 'Draft a FastAPI endpoint and review it.',
    steps: [0, 5, 6, 7],
    result: 'Plan → code generation → evaluation → documentation. The evaluator is a first-class stage, not an afterthought.',
  },
}

export const RULES = [
  { id: 'T1', label: 'Circular flow', kind: 'Transaction', evidence: 'A 3–6 hop cycle returns value to its origin inside a bounded window.', graph: [0, 1, 2, 3] },
  { id: 'E1', label: 'Off-hours ops', kind: 'Employee', evidence: 'A sensitive mutation lands outside the permitted working window.', graph: [4, 1] },
  { id: 'F1', label: 'Alarm fusion', kind: 'Fusion', evidence: 'Employee behaviour and money-flow risk meet on the same account inside the fusion window.', graph: [4, 1, 2, 3] },
] as const

export const EXPERIENCE = [
  { when: '2025 — Present', org: 'VALVIX', role: 'Co-Founder & Lead Flutter Developer', note: 'My freelance product studio. 10+ Android apps shipped end-to-end since 2025 across healthcare, fitness, retail and business — scoping, Flutter builds, backend integration and Play Store release.' },
  { when: 'Jul — Aug 2026', org: 'Dominal Technologies', role: 'Android App Development Intern', note: 'Completed a 1.5-month internship in Android application development.' },
  { when: '2024', org: 'DK Technos', role: 'Flutter App Developer Intern', note: 'End-to-end mobile development with Firebase integration and deployment.' },
  { when: '2025 — Present', org: 'VVP Engineering College', role: 'B.Tech, Computer Engineering', note: 'Solapur, Maharashtra.' },
] as const

export const STACK = [
  { group: 'Agentic AI', items: ['Python', 'LangChain', 'LangGraph', 'RAG', 'ChromaDB', 'Groq', 'Ollama', 'FastAPI'] },
  { group: 'Android / Mobile', items: ['Flutter', 'Dart', 'Kotlin', 'Riverpod', 'Foreground Services', 'Drift / SQLite', 'Hive', 'Firebase'] },
  { group: 'Systems', items: ['PostgreSQL', 'Redis', 'Supabase', 'Docker', 'NetworkX', 'Prometheus', 'Grafana', 'Git'] },
] as const

export const VALVIX = {
  name: 'VALVIX',
  since: '2025',
  apps: '10+',
  tagline: 'My freelance product studio — where ideas become installed apps.',
  domains: ['Healthcare', 'Fitness', 'Retail', 'Business'],
  stats: [
    { value: '10+', label: 'Android apps shipped' },
    { value: '2025', label: 'Studio founded' },
    { value: 'E2E', label: 'Idea → Play Store' },
    { value: '4+', label: 'Domains served' },
  ],
  services: [
    { title: 'Product scoping', detail: 'Requirement breakdown, screens, milestones and fixed-scope plans — no vague estimates.' },
    { title: 'Flutter + Kotlin builds', detail: 'Clean Architecture, Riverpod, offline-first data, background-safe Android systems.' },
    { title: 'Backend & integrations', detail: 'Firebase, Supabase, REST APIs, payments, maps, notifications and AI features.' },
    { title: 'Release & care', detail: 'Play Store publishing, crash monitoring, updates and post-launch iteration.' },
  ],
  process: ['Scope in days', 'Build in sprints', 'Harden on real devices', 'Release & iterate'],
} as const

export const LINKS = {
  aios: 'https://github.com/nalla-dinesh/AIOS',
  insiderlens: 'https://github.com/nalla-dinesh/insiderlens',
  walkmate: 'https://github.com/nalla-dinesh/walkmate-v2',
} as const


export const JOURNEY = [
  { year: '2023', title: 'Web development', label: 'First trail', body: 'Started with the browser: layouts, interactions and the fundamentals of shipping interfaces. The first commits were less about polish and more about understanding how software reaches a user.', evidence: ['HTML / CSS / JS', 'UI fundamentals', 'Browser delivery'] },
  { year: 'Soon after', title: 'App development', label: 'Went mobile', body: 'Moved from web pages to installed apps. Flutter and Android became the main craft: architecture, state, offline data, background services and the discipline of building for real devices — not just emulators.', evidence: ['Flutter / Dart', 'Kotlin services', 'Production releases'] },
  { year: 'Then', title: 'Full-stack development', label: 'Connected the system', body: 'Stopped treating frontend and backend as separate worlds. APIs, databases, auth, payments, notifications and deployment became one pipeline. The goal shifted from “make a screen” to “own the system”.', evidence: ['FastAPI / REST', 'SQL / Firebase', 'Auth / payments'] },
  { year: '2025', title: 'VALVIX', label: 'Started shipping for clients', body: 'Turned the skill stack into a freelance product studio. Since 2025, VALVIX has shipped 10+ Android apps across healthcare, fitness, retail and business — from scoping to Play Store release.', evidence: ['10+ apps shipped', 'Client delivery', 'Idea → Play Store'] },
  { year: 'Now', title: 'Agentic AI', label: 'Systems that reason', body: 'Added multi-agent orchestration, RAG, tool use and evaluation to the stack. The focus is production-minded AI: systems that can plan, retrieve, act, check themselves and integrate into real products.', evidence: ['LangChain / LangGraph', 'RAG / evaluation', 'AI + product integration'] },
] as const

export const CAPABILITIES = [
  { layer: 'Frontend', detail: 'Web interfaces, 3D experiences, responsive UI, design systems and interaction details.', tools: ['React', 'TypeScript', 'Three.js', 'GSAP', 'CSS'] },
  { layer: 'Mobile', detail: 'Android-first apps that survive background execution, weak networks and real devices.', tools: ['Flutter', 'Dart', 'Kotlin', 'Riverpod', 'SQLite'] },
  { layer: 'Backend', detail: 'APIs, auth, data models, payments, notifications and business logic.', tools: ['FastAPI', 'Python', 'REST', 'Firebase', 'Supabase'] },
  { layer: 'Servers / data', detail: 'Databases, caches, containers, deployment and observability — the parts users never see but always feel.', tools: ['PostgreSQL', 'Redis', 'Docker', 'Prometheus', 'Grafana'] },
  { layer: 'Agentic AI', detail: 'Multi-agent workflows, retrieval, tool use, evaluation and AI features inside products.', tools: ['LangChain', 'LangGraph', 'RAG', 'ChromaDB', 'LLM APIs'] },
] as const

export const JOURNEY_SUMMARY = 'I started in 2023 with web development, moved into app development, grew into full-stack engineering, started VALVIX in 2025, and now build production-focused agentic AI systems. Today I can own the path from frontend to backend to servers — and connect all of it to mobile and AI.'
