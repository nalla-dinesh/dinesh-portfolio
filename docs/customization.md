# Customization guide

## Change profile content

Edit `src/data.ts`:

- `PROFILE`
- `AGENTS`
- `EXPERIENCE`
- `STACK`
- `VALVIX`
- `LINKS`
- `JOURNEY`
- `CAPABILITIES`
- `JOURNEY_SUMMARY`

Then run:

```bash
npm test
npm run build
```

Content tests guard key facts and station order.

## Change the 3D room

- Camera stations and hotspots: `src/room/InvestigationRoom.ts`
- Canvas textures and labels: `src/room/textures.ts`
- Fallback poster: `src/assets/room-poster.jpg`

Keep station count, hotspot IDs and `CaseId` values in sync with `src/components/Dossier.tsx` and `src/App.tsx`.

## Change the animated GitHub profile

- Profile copy: `profile/README.md`
- SVG assets: `profile/assets/`

The SVGs are self-contained. They use CSS animation and include `prefers-reduced-motion` rules. Do not add JavaScript, external fonts or remote images if you want the README to remain portable.

## Add a new case file

1. Add data in `src/data.ts`.
2. Add a station/hotspot in `InvestigationRoom.ts`.
3. Add a dialog branch in `Dossier.tsx`.
4. Add caption/navigation behavior in `App.tsx`.
5. Update tests and README station list.

## Refresh the GitHub audit

Re-run the public API audit, update `docs/github-audit-2026-10-29.md` or create a dated successor, then update the snapshot sections in both READMEs. Do not publish secrets or private client code.
