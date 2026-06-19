import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookmarkButton from "@/components/BookmarkButton";

interface Props {
  params: Promise<{ level: string; id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const item = await prisma.vocabularyItem.findUnique({ where: { id }, select: { word: true, reading: true, meaning: true, level: { select: { label: true } } } });
  if (!item) return { title: "Not Found — Hanyu" };
  return { title: `${item.word} (${item.reading}) — ${item.level.label} Vocabulary — Hanyu`, description: item.meaning };
}

export default async function VocabDetailPage({ params }: Props) {
  const { level: slug, id } = await params;

  const item = await prisma.vocabularyItem.findUnique({
    where: { id },
    include: { level: true },
  });

  if (!item || item.level.name.toLowerCase() !== slug) notFound();

  return (
    <article className="max-w-2xl mx-auto">
      <Link
        href={`/${slug}/vocabulary`}
        className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 mb-6 inline-block"
      >
        ← Back to Vocabulary
      </Link>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 p-8">
        <div className="flex items-center justify-between mb-2">
          <div className="text-3xl font-bold">{item.word}</div>
          <BookmarkButton itemType="vocabulary" itemId={item.id} />
        </div>
        <div className="text-lg text-zinc-500 mb-6">{item.reading}</div>

        <div className="text-xl mb-6">{item.meaning}</div>

        {item.exampleSentence && (
          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6 mt-6">
            <h3 className="text-sm font-medium text-zinc-500 mb-2">Example</h3>
            <p className="text-lg mb-1">{item.exampleSentence}</p>
            {item.exampleTranslation && (
              <p className="text-sm text-zinc-500">{item.exampleTranslation}</p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
