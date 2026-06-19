import prisma from "@/lib/prisma";
import Link from "next/link";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }) {
  const { level: slug } = await params;
  return { title: `${slug.toUpperCase()} Vocabulary — Hanyu`, description: `JLPT ${slug.toUpperCase()} vocabulary list with readings, meanings, and example sentences.` };
}

interface Props {
  params: Promise<{ level: string }>;
  searchParams: Promise<{ page?: string }>;
}

const PAGE_SIZE = 100;

export default async function VocabularyPage({ params, searchParams }: Props) {
  const { level: slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);
  const name = slug.toUpperCase() as "N5" | "N4" | "N3" | "N2" | "N1";

  const [levelData, items, total] = await Promise.all([
    prisma.jLPTLevel.findUnique({ where: { name } }),
    prisma.vocabularyItem.findMany({
      where: { level: { name } },
      orderBy: { word: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.vocabularyItem.count({ where: { level: { name } } }),
  ]);

  if (!levelData) return <div className="text-center py-16 text-zinc-500">Level not found</div>;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-2">Vocabulary</h2>
      <p className="text-sm text-zinc-500 mb-6">{total} words</p>

      <div className="grid gap-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${slug}/vocabulary/${item.id}`}
            className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-lg font-semibold">{item.word}</span>
              <span className="text-sm text-zinc-500">{item.reading}</span>
            </div>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.meaning}</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href={`/${slug}/quiz`}
          className="inline-block px-5 py-2.5 rounded-xl bg-jp-red text-white text-sm font-medium hover:bg-jp-red-light transition-colors"
        >
          Take Vocabulary Quiz →
        </Link>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8 text-sm">
          {page > 1 && (
            <Link
              href={`/${slug}/vocabulary?page=${page - 1}`}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Previous
            </Link>
          )}
          <span className="px-3 py-1.5 text-zinc-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/${slug}/vocabulary?page=${page + 1}`}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
