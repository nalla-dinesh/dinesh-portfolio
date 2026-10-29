# Design notes — The Builder’s Room

## Why this redesign
The previous version still read as a conventional section-based portfolio. This version stages the portfolio as a physical investigation room: the visitor follows evidence rather than scrolling marketing cards.

## Spatial narrative
1. The room — wide establishing shot; cork board, red thread, desk, monitors.
2. AIOS — camera moves to the agent-system case file and orchestrator monitor.
3. InsiderLens — evidence ledger photographs and detection graph monitor.
4. WalkMate — phone on the desk; background-service reliability file.
5. VALVIX — shipping boxes and laptop; freelance studio manifest (2025, 10+ apps).
6. New case — contact monitor and résumé.
7. Origin file — vertical case-history board: 2023 web → app dev → full-stack → VALVIX → agentic AI, connected by red thread.
8. End-to-end — capability wall map + server rack: frontend, mobile, backend, servers/data, agentic AI.

## What is real 3D
Room shell, desk, monitors, keyboard, phone, lamp, boxes, shelves, clock, chair, cork board, pinned papers, pushpins and sagging red threads are Three.js geometry. Paper/screen/wood/cork/plaster surfaces are procedural canvas textures. InsiderLens photographs are real repository screenshots mapped onto polaroid-style planes.

## Interaction
Native scroll drives a smoothed camera rail; drag adds a bounded look offset. Evidence markers are projected from world coordinates into accessible HTML buttons. Case files open as native dialogs. A static poster + readable case index is used when WebGL is unavailable.

## Performance
One renderer; DPR capped at 1.5 mobile / 2 desktop; rendering pauses when the tab is hidden; reduced-motion mode stops the render loop and uses immediate camera cuts. Shadows use a single shadow-casting desk lamp. No runtime network assets.

## Verified content
AIOS agent registry/router, InsiderLens rules/guards/screenshots and WalkMate foreground service/checkpoint manager were inspected in public source. VALVIX dates/output and Dominal internship dates were confirmed directly with Dinesh.
