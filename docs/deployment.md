# Deployment

Primary target: **Vercel via GitHub**. See [`vercel-github.md`](vercel-github.md).

## Requirements

- Node.js **^20.19.0 || >=22.12.0** (CI and `.nvmrc` use Node 22)
- npm

## Local development

```bash
npm ci
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The build emits `dist/index.html`. Vite uses a relative base and the single-file plugin, so the output is portable.

## Vercel

`vercel.json` sets:

```text
Framework: Vite
Install command: npm ci
Build command: npm run build
Output directory: dist
```

Import the GitHub repository in Vercel and deploy. No environment variables are required.

## Other static hosts

The same `dist/` output can be hosted on Netlify or any static host:

```text
Build command: npm run build
Output directory: dist
Node version: 22
```
