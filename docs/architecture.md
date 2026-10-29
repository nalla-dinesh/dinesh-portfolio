# Architecture

The portfolio is a single-page React application with one persistent Three.js room. Scroll position selects a station; hotspots and captions open case-file dialogs.

## Main modules

| Path | Responsibility |
|---|---|
| `src/data.ts` | Profile, projects, journey, capabilities, experience and links. Single source of truth for content. |
| `src/room/InvestigationRoom.ts` | Three.js scene, eight camera stations, sixteen hotspots, cork board, server rack, lights and render loop. |
| `src/room/textures.ts` | Canvas-generated labels, photos, milestone cards and screen textures. |
| `src/components/RoomCanvas.tsx` | Canvas lifecycle, WebGL fallback poster, motion state. |
| `src/components/Dossier.tsx` | Accessible case-file dialogs for projects, journey and capability map. |
| `src/App.tsx` | Scroll stations, captions, navigation rail and actions. |
| `src/styles.css` | Paper/room visual system, responsive layout, reduced-motion rules. |
| `tests/content.test.ts` | Content invariants: station count, journey order, key facts. |
| `tests/portfolio.spec.ts` | Browser flows: navigation, dialogs, mobile overflow, journey after contact. |

## Stations

0. Room entrance
1. AIOS
2. InsiderLens
3. WalkMate
4. VALVIX
5. Contact
6. Origin File / journey
7. End-to-end / capability map

## Motion and performance

- One renderer is reused across stations instead of creating a canvas per section.
- Lenis provides smooth wheel scrolling on fine-pointer desktop devices only.
- Touch devices use native browser scrolling; the 3D canvas allows vertical pan and pinch zoom.
- Case file dialogs scroll independently with `overscroll-behavior: contain`; background scroll is locked and restored on close.
- Device pixel ratio is capped to reduce GPU cost on mobile.
- Rendering pauses when the room is offscreen.
- A motion toggle and `prefers-reduced-motion` are respected.
- A static poster fallback is shown when WebGL is unavailable.
- GPU resources are disposed on unmount.

## Build output

Vite is configured with `base: './'` and `vite-plugin-singlefile`, so the production build emits a portable `dist/index.html` with embedded assets. This makes Vercel deployment and offline preview straightforward.
