# MARIS — Attribution Console

React + TypeScript + Tailwind CSS (v4) frontend for the MARIS maritime oil-spill
attribution dashboard. Built with Vite.

## Structure

```
src/
  components/
    layout/      Sidebar, Topbar, AppShell (page frame + routing outlet)
    ui/           Reusable primitives: Panel, StatCard, Badge, ProgressBar,
                   KeyValueRow, ListRow, LineChart, Sparkline
    maps/         IncidentMap, DriftMap — SVG chart-style map panels
  pages/           One file per route: Incidents, Vessels, DriftModel, Alerts, ModelHealth
  data/            mockData.ts — sample data; swap for real FastAPI calls here
  types/           Shared TypeScript interfaces for the domain model
```

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build      # type-check + production build
```

## Wiring up the real backend

Everything currently reads from `src/data/mockData.ts`. To connect to the
FastAPI backend from the system architecture diagram:

1. Add an `src/api/` folder with a small fetch/axios client.
2. Replace the imports in each page (e.g. `import { incidents } from "../data/mockData"`)
   with a data-fetching hook (e.g. `useIncidents()` backed by `fetch('/api/incidents')`).
3. Keep the TypeScript interfaces in `src/types/` as the contract between
   frontend and backend — update them first if the API response shape differs.

## Design tokens

Color, font, and spacing tokens live in `src/index.css` under `@theme`, so
Tailwind utility classes like `bg-panel`, `text-teal`, `border-border-soft`
are available anywhere in the app.
