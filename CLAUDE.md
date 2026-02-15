# CLAUDE.md

## Project Overview
SyntheticDB Jailbreaks is a Next.js web application for generating synthetic red team AI datasets using the Anthropic API. It produces structured jailbreak attack/defense pairs for AI safety research and training.

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **API**: Anthropic SDK (`@anthropic-ai/sdk`) - Claude Sonnet 4
- **Runtime**: Node.js 22+

## Architecture
- Single-page app: config panel (left) + data table (right)
- API route (`/api/generate`) proxies to Anthropic, streams NDJSON responses
- Client reads NDJSON stream, renders rows progressively
- API key via `.env.local` or browser Settings dialog (localStorage)

## Key Files
- `src/app/api/generate/route.ts` - API route, Anthropic SDK integration
- `src/lib/prompt.ts` - System/user prompt construction
- `src/lib/types.ts` - All TypeScript interfaces
- `src/lib/constants.ts` - Categories, difficulty levels, labels
- `src/hooks/useGeneration.ts` - Generation state + streaming fetch
- `src/hooks/useTableControls.ts` - Sort, filter, search logic
- `src/components/ConfigPanel.tsx` - Left panel config UI
- `src/components/DataTable.tsx` - Primary output table
- `src/components/DataTableRow.tsx` - Expandable row with full detail view
- `src/components/SettingsDialog.tsx` - API key input modal
- `src/lib/export.ts` - CSV/JSON/JSONL serialization + download

## Commands
- `npm run dev` - Start dev server (http://localhost:3000)
- `npm run build` - Production build
- `npm run lint` - ESLint
- `node generate.mjs` - Standalone CLI dataset generator (requires ANTHROPIC_API_KEY env)

## Conventions
- No external UI library (shadcn, etc.) - all components are hand-rolled with Tailwind
- Dark theme only (zinc color palette)
- Streaming architecture: one API call per example, streamed as NDJSON
- Error handling: parse failures logged server-side, skipped client-side
- API key never committed - `.env*` is gitignored
