import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 1) {
    return Response.json({ results: [] });
  }

  const [vocab, kanji, grammar, work] = await Promise.all([
    prisma.vocabularyItem.findMany({
      where: {
        OR: [
          { word: { contains: q } },
          { reading: { contains: q } },
          { meaning: { contains: q } },
        ],
      },
      include: { level: { select: { label: true } } },
      take: 20,
    }),
    prisma.kanjiCharacter.findMany({
      where: {
        OR: [
          { character: { contains: q } },
          { onyomi: { contains: q } },
          { kunyomi: { contains: q } },
          { meaning: { contains: q } },
        ],
      },
      include: { level: { select: { label: true } } },
      take: 20,
    }),
    prisma.grammarPoint.findMany({
      where: {
        OR: [
          { pattern: { contains: q } },
          { explanation: { contains: q } },
        ],
      },
      include: { level: { select: { label: true } } },
      take: 20,
    }),
    prisma.workContent.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { japanese: { contains: q } },
          { meaning: { contains: q } },
          { explanation: { contains: q } },
        ],
      },
      take: 10,
    }),
  ]);

  const results: Array<{
    type: string;
    id: string;
    title: string;
    subtitle: string;
    href: string;
    level?: string;
  }> = [];

  for (const v of vocab) {
    results.push({
      type: "vocabulary",
      id: v.id,
      title: v.word,
      subtitle: `${v.reading} — ${v.meaning}`,
      href: `/${v.level.label.toLowerCase()}/vocabulary/${v.id}`,
      level: v.level.label,
    });
  }

  for (const k of kanji) {
    results.push({
      type: "kanji",
      id: k.id,
      title: k.character,
      subtitle: k.meaning,
      href: `/${k.level.label.toLowerCase()}/kanji/${k.id}`,
      level: k.level.label,
    });
  }

  for (const g of grammar) {
    results.push({
      type: "grammar",
      id: g.id,
      title: g.pattern,
      subtitle: g.explanation.slice(0, 100),
      href: `/${g.level.label.toLowerCase()}/grammar/${g.id}`,
      level: g.level.label,
    });
  }

  for (const w of work) {
    results.push({
      type: "work",
      id: w.id,
      title: w.title,
      subtitle: w.meaning || w.category,
      href: `/work/${w.category.toLowerCase()}`,
    });
  }

  return Response.json({ results });
}