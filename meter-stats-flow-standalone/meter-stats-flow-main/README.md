# Meter Stats Flow (Standalone)

A standalone React + Vite + TypeScript dashboard for visualizing smart-meter statistics (mock data).  
This version is **fully independent** – no Lovable tooling, links, or plugins.

## Run locally
```bash
# install
npm install
# or: pnpm install / bun install

# dev server
npm run dev
# open the printed localhost URL

# build for production
npm run build
npm run preview
```

## Tech
- React 18, Vite, TypeScript
- TailwindCSS + shadcn/ui + Radix UI
- Recharts for charts

## Notes
- Mock data lives in `src/lib/mockData.ts` – replace with real API calls when ready.
- Project metadata and meta tags were cleaned of external service references.
