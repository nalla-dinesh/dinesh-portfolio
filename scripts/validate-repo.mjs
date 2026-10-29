import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = process.cwd()
const errors = []
const required = [
  'README.md',
  'profile/README.md',
  'profile/assets/hero-dark.svg',
  'profile/assets/hero-light.svg',
  'profile/assets/journey.svg',
  'profile/assets/stack-map.svg',
  'package.json',
  'package-lock.json',
  'vite.config.ts',
  'playwright.config.ts',
  '.github/workflows/ci.yml',
  'vercel.json',
  'docs/github-audit-2026-10-29.md',
  'docs/deployment.md',
  'docs/vercel-github.md',
  'LICENSE',
  'SECURITY.md',
  'CONTENT_NOTICE.md',
]

for (const file of required) {
  if (!existsSync(join(root, file))) errors.push(`Missing required file: ${file}`)
}

const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'))
if (vercel.outputDirectory !== 'dist') errors.push('vercel.json outputDirectory must be dist')
if (vercel.buildCommand !== 'npm run build') errors.push('vercel.json buildCommand must be npm run build')

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
for (const script of ['dev', 'build', 'preview', 'check', 'test', 'test:e2e', 'verify']) {
  if (!pkg.scripts?.[script]) errors.push(`Missing npm script: ${script}`)
}
if (!pkg.engines?.node) errors.push('package.json should declare engines.node')

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    if (['node_modules', 'dist', '.git', 'test-results', 'playwright-report', 'coverage'].includes(entry)) continue
    const path = join(dir, entry)
    const stat = statSync(path)
    if (stat.isDirectory()) out.push(...walk(path))
    else out.push(path)
  }
  return out
}

const files = walk(root)
for (const file of files) {
  const rel = relative(root, file)
  const base = rel.split('/').pop()
  if (base.startsWith('.env') && base !== '.env.example') {
    errors.push(`Potential secret file must not be shipped: ${rel}`)
  }
  if (file.endsWith('.svg')) {
    const text = readFileSync(file, 'utf8')
    if (/<script[\s>]/i.test(text)) errors.push(`SVG contains script: ${rel}`)
    if (/<foreignObject[\s>]/i.test(text)) errors.push(`SVG contains foreignObject: ${rel}`)
    if (/\bon[a-z]+\s*=/i.test(text)) errors.push(`SVG contains event handler: ${rel}`)
    if (/(?:href|src)\s*=\s*["']https?:/i.test(text)) errors.push(`SVG references external resource: ${rel}`)
    if (!text.includes('prefers-reduced-motion')) errors.push(`SVG missing reduced-motion rule: ${rel}`)
    if (!text.includes('<title') || !text.includes('<desc')) errors.push(`SVG missing title/desc: ${rel}`)
  }
}

const profileReadme = readFileSync(join(root, 'profile/README.md'), 'utf8')
for (const match of profileReadme.matchAll(/(?:srcset|src)="(assets\/[^"]+)"/g)) {
  if (!existsSync(join(root, 'profile', match[1]))) errors.push(`Profile README references missing asset: ${match[1]}`)
}

if (errors.length) {
  console.error(errors.map((e) => `✖ ${e}`).join('\n'))
  process.exit(1)
}
console.log(`✔ Repository validation passed (${files.length} files checked)`)
