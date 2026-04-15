# Garden Planner

Vite + React 19 + Tailwind v4 single-page app. No backend.

## Commands

```bash
npm run dev       # dev server at http://localhost:5173
npm test          # watch mode
npm run test:run  # run once
npm run build     # output to dist/
```

## Key conventions

- All app state lives in `App.jsx` and is synced to the URL via `src/utils/urlState.js`
- `onUpdate` accepts either an object patch or a functional updater — always use the functional form when reading `selectedPlants` to avoid stale closures
- Plant data is in `src/data/plants.json`; `light` values are `"direct"` or `"partial"` only
- `buildRows` in `src/utils/gardenLayout.js` produces one row per `selectedPlants` entry (duplicates intentional)
- Tests use Vitest + @testing-library/react; run the suite after every change
