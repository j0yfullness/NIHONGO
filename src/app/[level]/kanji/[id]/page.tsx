import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookmarkButton from "@/components/BookmarkButton";

interface Props {
  params: Promise<{ level: string; id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const item = await prisma.kanjiCharacter.findUnique({ where: { id }, select: { character: true, meaning: true, level: { select: { label: true } } } });
  if (!item) return { title: "Not Found — Hanyu" };
  return { title: `${item.character} — ${item.level.label} Kanji — Hanyu`, description: item.meaning };
}

export default async function KanjiDetailPage({ params }: Props) {
  const { level: slug, id } = await params;

  const item = await prisma.kanjiCharacter.findUnique({
    where: { id },
    include: { level: true },
  });

  if (!item || item.level.name.toLowerCase() !== slug) notFound();

  return (
    <article className="max-w-2xl mx-auto">
      <Link
        href={`/${slug}/kanji`}
        className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 mb-6 inline-block"
      >
        ← Back to Kanji
      </Link>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 p-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-5xl font-bold">{item.character}</div>
          <BookmarkButton itemType="kanji" itemId={item.id} />
        </div>

        <div className="text-xl text-center mb-8">{item.meaning}</div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {item.onyomi && (
            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-4">
              <div className="text-xs text-zinc-500 mb-1">On&apos;yomi</div>
              <div className="text-lg font-medium">{item.onyomi}</div>
            </div>
          )}
          {item.kunyomi && (
            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-4">
              <div className="text-xs text-zinc-500 mb-1">Kun&apos;yomi</div>
              <div className="text-lg font-medium">{item.kunyomi}</div>
            </div>
          )}
        </div>

        {item.strokeCount && (
          <div className="text-sm text-zinc-500 mb-6 text-center">
            {item.strokeCount} strokes
          </div>
        )}

        {item.compounds && (
          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
            <h3 className="text-sm font-medium text-zinc-500 mb-3">Common Compounds</h3>
            <p className="text-base">{item.compounds}</p>
          </div>
        )}
      </div>
    </article>
  );
}
