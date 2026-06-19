# Deployment State — Session Handoff

## Status: ✅ Deployed but incomplete

### URLs
- Production: https://nihongo-nu.vercel.app
- GitHub: https://github.com/j0yfullness/NIHONGO
- Vercel Dashboard: https://vercel.com/t4r0s4s-projects/nihongo

### Deployment Details
- Latest build: **Ready** (27s duration)
- Build command: `npx prisma generate && next build`
- Vercel project name: `nihongo`
- Git user: "Johan Tjhai" <johan.tjhai12s@gmail.com>

### Environment Variables (set on Vercel)
- `DATABASE_URL` — currently placeholder (`file:./prisma/dev.db`)
- `AUTH_SECRET` — random string

### Problem
Database uses SQLite (file-based), which is **read-only** on Vercel serverless.
App renders static pages but dynamic content (vocab, kanji, grammar queries) will fail.

## Remaining: Setup Turso Production Database

### Steps to complete:

1. **Create Turso database**
   - Go to https://turso.tech → Login with GitHub
   - Create new database → name: `nihongo`, region: `Singapore`

2. **Copy database URL**
   - Format: `libsql://nihongo-<random>.turso.io`
   - Also copy auth token if required

3. **Update Vercel env var**
   - Go to https://vercel.com/t4r0s4s-projects/nihongo/settings/environment-variables
   - Update `DATABASE_URL` with Turso URL
   - (If Turso uses API tokens, also add `TURSO_AUTH_TOKEN`)

4. **Seed production database**
   ```bash
   DATABASE_URL="libsql://nihongo-xxx.turso.io" npx tsx prisma/seed.ts
   ```

5. **Redeploy**
   - Push any commit to trigger auto-deploy, or
   - Click "Redeploy" in Vercel dashboard

## Project Summary (for next session)

### What's done (6 phases complete):
- P1: Next.js + Prisma + Seed N5/N4 + Home page
- P2: Content pages (vocab/kanji/grammar lists + details)
- P3: Quiz engine + data seeder + quiz pages
- P4: Auth & Progress (NextAuth, dashboard, bookmarks)
- P5: Work/Business Japanese (keigo, interview, vocab, resume)
- P6: N3-N1 data + Search API + SEO + Deploy prep

### Database counts:
- Vocab: 2,700 (N5:804, N4:1011, N3:388, N2:258, N1:239)
- Kanji: 582 (N5:112, N4:286, N3:81, N2:61, N1:42)
- Grammar: 294 (N5:90, N4:104, N3:44, N2:31, N1:25)
- Work: 23 items
- Lessons: 15 (3 per JLPT level)
- Quizzes: 8 (6 lesson + 2 advancement)

### Key files:
- `src/app/work/[category]/page.tsx` — dynamic work content route
- `src/app/search/SearchClient.tsx` — live search client component
- `src/app/api/search/route.ts` — search API
- `data/n3/`, `data/n2/`, `data/n1/` — JLPT JSON data files
- `data/work/` — business content JSON files
- `prisma/seed.ts` — seeding logic
- `prisma.config.ts` — Prisma config (uses DATABASE_URL env)
- `vercel.json` — Vercel build config
- `.env.example` — env documentation

### Deferred (v2):
- Audio pronunciations
- Spaced repetition
- Listening comprehension
- Community features
- JLPT mock timed tests

### Commands:
```bash
npm run dev        # local dev
npm run build      # typecheck + build
npm run lint       # ESLint
npm run seed       # seed database
npx tsx prisma/seed-quizzes.ts  # generate quiz data
npx prisma db push # sync schema
npx prisma studio  # GUI database
```
