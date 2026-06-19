# Roadmap

## Phase 1: Foundation & Seed Data
**Goal:** Initialize Next.js project with Prisma schema, database, auth scaffolding, and seed N5–N4 data
**Requirements:** CONT-01, CONT-02, CONT-03, CONT-04, CONT-05
**Success Criteria:**
1. Project boots locally with Next.js + Prisma connected to PostgreSQL
2. Prisma schema covers all entities (User, Lesson, VocabularyItem, KanjiCharacter, GrammarPoint, Quiz, Question, UserProgress)
3. N5 vocabulary (800+), kanji (100+), grammar (80+) seeded in database
4. N4 vocabulary (1500+), kanji (200+), grammar (100+) seeded in database
5. Home page shows JLPT level grid
6. Auth (NextAuth) scaffolded with email + Google providers

## Phase 2: Content UI
**Goal:** Build lesson viewer, vocabulary cards, kanji detail pages, grammar explainer pages
**Requirements:** CONT-03, CONT-04, CONT-05
**Success Criteria:**
1. Level hub page shows vocab/kanji/grammar tabs per JLPT level
2. Vocabulary cards display word, reading, meaning, example sentences
3. Kanji detail page shows on'yomi, kun'yomi, stroke count, compounds
4. Grammar page shows pattern, explanation, usage rules, examples

## Phase 3: Quiz Engine
**Goal:** Build quiz system with multiple question types, scoring, feedback
**Requirements:** QUIZ-01, QUIZ-02, QUIZ-03, QUIZ-04
**Success Criteria:**
1. Quiz page renders questions from database per lesson
2. Multiple choice, fill-in-blank, matching question types work
3. Immediate score + correct/incorrect feedback after submission
4. Level advancement quiz unlocks next JLPT level

## Phase 4: Auth & Progress
**Goal:** User authentication, dashboard, progress tracking, level advancement
**Requirements:** USER-01, USER-02, USER-03, USER-04
**Success Criteria:**
1. Email/password and Google OAuth login works
2. Dashboard shows progress per level and lesson
3. Users can bookmark vocabulary and grammar items
4. Level advancement logic persists across sessions

## Phase 5: Work Content ✓
**Goal:** Dedicated business Japanese section with keigo, interview, workplace content
**Requirements:** WORK-01 ✓, WORK-02 ✓, WORK-03 ✓, WORK-04 ✓, WORK-05 ✓
**Success Criteria:**
1. Business Japanese hub page with categorized content ✓
2. Keigo lessons with examples for each politeness level ✓
3. Interview preparation section with common Q&A ✓
4. Workplace vocabulary and phrase library ✓
5. Resume/CV guidance with templates and vocabulary ✓

## Phase 6: N3–N1 Data & Polish ✓
**Goal:** Seed remaining JLPT levels, add search, SEO, responsive polish, deploy
**Requirements:** INFRA-01 ✓, INFRA-02 ✓, INFRA-03 ✓, INFRA-04 ✓
**Success Criteria:**
1. N3 (388 vocab, 81 kanji, 44 grammar) seeded ✓
2. N2 (258 vocab, 61 kanji, 31 grammar) seeded ✓
3. N1 (239 vocab, 42 kanji, 25 grammar) seeded ✓
4. Search works across all content ✓
5. SEO metadata on all pages ✓
6. Site responsive on mobile and desktop ✓
7. Deploy configuration prepared (vercel.json, .env.example) ✓
