# AGENTS.md — HANYU

<!-- BEGIN:nextjs-agent-rules -->
This is NOT the Next.js you know — read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project

Japanese learning platform (N5–N1 JLPT) with vocab/kanji/grammar + business Japanese. Full user accounts, quiz advancement.

## Tech

- **Next.js 16.2** (App Router), **React 19**, **Tailwind CSS 4**
- **Prisma 7.8** (PostgreSQL via `@prisma/adapter-pg`) — NOTE: Prisma 7 requires `new PrismaClient({ adapter })`, no `url` in schema.datasource
- **NextAuth.js v5 beta** (prepared but not wired)
- **TypeScript strict**

## Database

- **SQLite** via `@prisma/adapter-libsql` — no server process needed
- Seed: `npm run seed` (tsx `prisma/seed.ts`), quizzes: `npx tsx prisma/seed-quizzes.ts`
- Reset: delete `prisma/dev.db` and re-run `npx prisma db push`
- Schema in `prisma/schema.prisma`, URL in `.env`, config in `prisma.config.ts`
- Adapter pattern: `new PrismaLibSql({ url: process.env.DATABASE_URL! })`
- `.env` not committed

## Data files

```
data/
  n5/vocabulary.json, kanji.json, grammar.json   — seeded ✓
  n4/vocabulary.json, kanji.json, grammar.json   — seeded ✓
  work/                                           — not yet (Phase 5)
```

Each JSON feeds `prisma/seed.ts`. Add/edit files here and re-seed.

## Key commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Full build + typecheck |
| `npm run lint` | ESLint |
| `npm run seed` | Run `tsx prisma/seed.ts` |
| `npx tsx prisma/seed-quizzes.ts` | Generate quiz data from content |
| `npx prisma db push` | Sync schema (SQLite, no server needed) |
| `npx prisma studio` | GUI database browser |

## Content seeded

| Level | Vocab | Kanji | Grammar | Quizzes |
|-------|-------|-------|---------|---------|
| N5 | 804 | 112 | 90 | 3 lesson + 1 advancement |
| N4 | 1,011 | 286 | 104 | 3 lesson + 1 advancement |

## Architecture

- `src/app/` — Next.js App Router pages
- `src/lib/prisma.ts` — Prisma client singleton (libsql adapter for SQLite)
- `src/components/QuizClient.tsx` — Interactive quiz component (client-side)
- `prisma/schema.prisma` — All models
- `prisma/seed.ts` — Bulk importer from `data/*.json`
- `prisma/seed-quizzes.ts` — Auto-generates quizzes from seeded content
- `data/` — Content JSON files, one per level per category
- Auth via NextAuth.js v5 (Credentials + Google, JWT sessions)
- `.planning/` — GSD phase management files
- Styling: Tailwind CSS 4 with custom `jp-red` and `jp-gold` theme colors

## Gotchas

- **Prisma 7 changes**: No `url` in schema datasource block. All connection config in `prisma.config.ts`. Client needs adapter (use `PrismaLibSql` for SQLite, `PrismaPg` for Postgres).
- `tsx` runs non-transpiled scripts — no Next.js module resolution, all imports must be resolvable from node_modules.
- N5+N4 content complete. N3–N1 data is Phase 6.
- Quiz data is auto-generated — after adding new content, re-run `npx tsx prisma/seed-quizzes.ts`.
- SQLite stores `options` as JSON string (parsed in `QuizClient`).
