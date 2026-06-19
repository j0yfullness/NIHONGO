import prisma from "@/lib/prisma";
import Link from "next/link";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }) {
  const { level: slug } = await params;
  return { title: `${slug.toUpperCase()} Grammar — Hanyu`, description: `JLPT ${slug.toUpperCase()} grammar patterns with explanations, usage rules, and example sentences.` };
}

interface Props {
  params: Promise<{ level: string }>;
  searchParams: Promise<{ page?: string }>;
}

const PAGE_SIZE = 50;

export default async function GrammarPage({ params, searchParams }: Props) {
  const { level: slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);
  const name = slug.toUpperCase() as "N5" | "N4" | "N3" | "N2" | "N1";

  const [levelData, items, total] = await Promise.all([
    prisma.jLPTLevel.findUnique({ where: { name } }),
    prisma.grammarPoint.findMany({
      where: { level: { name } },
      orderBy: { pattern: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.grammarPoint.count({ where: { level: { name } } }),
  ]);

  if (!levelData) return <div className="text-center py-16 text-zinc-500">Level not found</div>;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-2">Grammar</h2>
      <p className="text-sm text-zinc-500 mb-6">{total} patterns</p>

      <div className="grid gap-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${slug}/grammar/${item.id}`}
            className="block p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="font-semibold text-lg mb-1">{item.pattern}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{item.explanation}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href={`/${slug}/quiz`}
          className="inline-block px-5 py-2.5 rounded-xl bg-jp-red text-white text-sm font-medium hover:bg-jp-red-light transition-colors"
        >
          Take Grammar Quiz →
        </Link>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8 text-sm">
          {page > 1 && (
            <Link
              href={`/${slug}/grammar?page=${page - 1}`}
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
              href={`/${slug}/grammar?page=${page + 1}`}
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
