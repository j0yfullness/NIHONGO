import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookmarkButton from "@/components/BookmarkButton";

interface Props {
  params: Promise<{ level: string; id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const item = await prisma.grammarPoint.findUnique({ where: { id }, select: { pattern: true, explanation: true, level: { select: { label: true } } } });
  if (!item) return { title: "Not Found — Hanyu" };
  return { title: `${item.pattern} — ${item.level.label} Grammar — Hanyu`, description: item.explanation.slice(0, 160) };
}

export default async function GrammarDetailPage({ params }: Props) {
  const { level: slug, id } = await params;

  const item = await prisma.grammarPoint.findUnique({
    where: { id },
    include: { level: true },
  });

  if (!item || item.level.name.toLowerCase() !== slug) notFound();

  return (
    <article className="max-w-2xl mx-auto">
      <Link
        href={`/${slug}/grammar`}
        className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 mb-6 inline-block"
      >
        ← Back to Grammar
      </Link>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 p-8">
        <div className="flex items-center justify-between mb-2">
          <div className="text-3xl font-bold">{item.pattern}</div>
          <BookmarkButton itemType="grammar" itemId={item.id} />
        </div>
        <div className="text-lg mb-6">{item.explanation}</div>

        {item.usageRules && (
          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-4 mb-6">
            <h3 className="text-sm font-medium text-zinc-500 mb-1">Formation</h3>
            <p className="text-sm">{item.usageRules}</p>
          </div>
        )}

        {item.exampleSentence && (
          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
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
