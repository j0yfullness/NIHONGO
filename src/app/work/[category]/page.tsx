import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkCategory } from "@prisma/client";
import BookmarkButton from "@/components/BookmarkButton";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const label = categoryLabels[category];
  if (!label) return { title: "Business Japanese — Hanyu" };
  return { title: `${label.title} — Hanyu`, description: label.description };
}

const PAGE_SIZE = 20;

const categoryLabels: Record<string, { title: string; description: string }> = {
  keigo: { title: "Keigo (敬語)", description: "Honorific, humble, and polite language lessons" },
  interview: { title: "Interview Prep", description: "Japanese job interview questions, answers, and tips" },
  vocabulary: { title: "Workplace Vocabulary", description: "Business terms, phrases, and office expressions" },
  resume: { title: "Resume & CV Guide", description: "Rirekisho, shokumu keirekisho, and application guidance" },
};

const categoryToDb: Record<string, WorkCategory> = {
  keigo: "KEEGO",
  interview: "INTERVIEW",
  vocabulary: "VOCABULARY",
  resume: "RESUME",
};

export default async function WorkCategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  const dbCategory = categoryToDb[category];
  if (!dbCategory) notFound();

  const label = categoryLabels[category];
  if (!label) notFound();

  const [items, total] = await Promise.all([
    prisma.workContent.findMany({
      where: { category: dbCategory },
      orderBy: { order: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.workContent.count({ where: { category: dbCategory } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <section>
      <Link
        href="/work"
        className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 mb-4 inline-block"
      >
        ← All Business
      </Link>
      <h2 className="text-2xl font-bold mb-1">{label.title}</h2>
      <p className="text-sm text-zinc-500 mb-8">{label.description} — {total} items</p>

      <div className="grid gap-4">
        {items.map((item) => {
          let parsedExamples: Array<{ japanese: string; reading: string; meaning: string }> = [];
          try {
            parsedExamples = JSON.parse(item.examples || "[]");
          } catch {}

          return (
            <article
              key={item.id}
              className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-700"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  {item.japanese && (
                    <div className="text-sm text-zinc-500 mt-1">
                      <span>{item.japanese}</span>
                      {item.reading && <span className="ml-2 text-xs">({item.reading})</span>}
                    </div>
                  )}
                </div>
                <BookmarkButton itemType="work" itemId={item.id} />
              </div>

              {item.meaning && (
                <p className="text-zinc-700 dark:text-zinc-300 mb-2">{item.meaning}</p>
              )}

              {item.explanation && (
                <details className="mt-3 group">
                  <summary className="text-sm font-medium text-zinc-500 cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200">
                    Details & Examples
                  </summary>
                  <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.explanation}
                  </div>

                  {parsedExamples.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {parsedExamples.map((ex, i) => (
                        <div
                          key={i}
                          className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3"
                        >
                          <div className="font-medium text-sm">{ex.japanese}</div>
                          {ex.reading && (
                            <div className="text-xs text-zinc-500 mt-0.5">{ex.reading}</div>
                          )}
                          <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                            {ex.meaning}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </details>
              )}
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8 text-sm">
          {page > 1 && (
            <Link
              href={`/work/${category}?page=${page - 1}`}
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
              href={`/work/${category}?page=${page + 1}`}
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