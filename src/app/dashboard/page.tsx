import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Hanyu",
  description: "Track your Japanese learning progress across JLPT levels.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const [bookmarks, progress, levels] = await Promise.all([
    prisma.bookmark.findMany({ where: { userId: session.user.id } }),
    prisma.userProgress.findMany({ where: { userId: session.user.id } }),
    prisma.jLPTLevel.findMany({ orderBy: { order: "asc" } }),
  ]);

  const quizProgress = progress.filter((p) => p.quizId);
  const lessonProgress = progress.filter((p) => p.lessonId);

  return (
    <div className="flex flex-col flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-zinc-500 mb-8">Welcome, {session.user.name || session.user.email}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
          <div className="text-2xl font-bold">{quizProgress.filter((p) => p.passed).length}</div>
          <div className="text-sm text-zinc-500">Quizzes Passed</div>
        </div>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
          <div className="text-2xl font-bold">{lessonProgress.filter((p) => p.completed).length}</div>
          <div className="text-sm text-zinc-500">Lessons Completed</div>
        </div>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
          <div className="text-2xl font-bold">{bookmarks.length}</div>
          <div className="text-sm text-zinc-500">Bookmarked Items</div>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">JLPT Levels</h2>
        <div className="space-y-3">
          {levels.map((l) => (
            <Link
              key={l.id}
              href={`/${l.name.toLowerCase()}/vocabulary`}
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div>
                <span className="font-bold text-lg">{l.label}</span>
                <span className="text-sm text-zinc-500 ml-3">{l.description}</span>
              </div>
              <span className="text-sm text-zinc-400">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Bookmarks</h2>
        {bookmarks.length === 0 ? (
          <p className="text-sm text-zinc-500">No bookmarks yet. Browse content and bookmark items to save them here.</p>
        ) : (
          <div className="space-y-2">
            {bookmarks.map((b) => (
              <div key={b.id} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/30 text-sm">
                {b.itemType}: {b.itemId}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/n5/vocabulary"
            className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors dark:bg-zinc-100 dark:text-zinc-900"
          >
            Study N5 Vocabulary
          </Link>
          <Link
            href="/n5/quiz"
            className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Take a Quiz
          </Link>
        </div>
      </section>
    </div>
  );
}
