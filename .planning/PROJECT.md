# HANYU — Japanese Learning Platform

A comprehensive JLPT N5–N1 learning website with abundant vocabulary, kanji, and grammar content, plus quizzes for level advancement. Includes business Japanese content for learners going to Japan for work.

## Core Value

One platform covering the full JLPT spectrum (N5→N1) with rich data and quiz-based progression, plus work-focused Japanese for employment in Japan.

## Context

- **Audience:** Japanese learners (self-study), JLPT exam takers, professionals moving to Japan for work
- **Platform:** Web (responsive)
- **Model:** Free learning content with progress tracking

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 14+ App Router | Full-stack React, SSR, API routes, easy Vercel deploy | — Decided |
| Prisma + PostgreSQL | Type-safe ORM, migrations, good DX | — Decided |
| NextAuth.js | Mature auth with multiple providers | — Decided |
| Tailwind CSS | Rapid UI development, utility-first | — Decided |
| Seed data from scratch | Full control over content quality | — Decided |

## Evolution

Requirements are hypotheses until shipped. This document evolves at phase transitions.

## Content Strategy

Data stored in structured JSON under /data/, imported by Prisma seed scripts.
Seeds are templated to enable bulk generation with realistic JLPT-style entries.

---

*Last updated: 2026-06-19 after initialization*
