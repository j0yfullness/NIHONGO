import prisma from "@/lib/prisma";
import Link from "next/link";

interface Props {
  params: Promise<{ level: string }>;
}

export default async function QuizListPage({ params }: Props) {
  const { level: slug } = await params;
  const name = slug.toUpperCase() as "N5" | "N4" | "N3" | "N2" | "N1";

  const [levelData, quizzes] = await Promise.all([
    prisma.jLPTLevel.findUnique({ where: { name } }),
    prisma.quiz.findMany({
      where: { lesson: { level: { name } } },
      include: { lesson: true, _count: { select: { questions: true } } },
      orderBy: { title: "asc" },
    }),
  ]);

  if (!levelData) return <div className="text-center py-16 text-zinc-500">Level not found</div>;

  const advancementQuizzes = quizzes.filter((q) => q.isAdvancement);
  const lessonQuizzes = quizzes.filter((q) => !q.isAdvancement);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Quizzes</h2>

      {advancementQuizzes.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-zinc-500 mb-3">Advancement Tests</h3>
          <div className="space-y-3">
            {advancementQuizzes.map((q) => (
              <Link
                key={q.id}
                href={`/${slug}/quiz/${q.id}`}
                className="block p-4 rounded-xl border-2 border-jp-gold hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-colors"
              >
                <div className="font-semibold">{q.title}</div>
                <div className="text-sm text-zinc-500">{q._count.questions} questions</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-sm font-medium text-zinc-500 mb-3">Lesson Quizzes</h3>
      <div className="space-y-3">
        {lessonQuizzes.map((q) => (
          <Link
            key={q.id}
            href={`/${slug}/quiz/${q.id}`}
            className="block p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="font-semibold">{q.title}</div>
            <div className="text-sm text-zinc-500">{q._count.questions} questions</div>
          </Link>
        ))}
        {lessonQuizzes.length === 0 && (
          <p className="text-zinc-500 text-sm">No quizzes available yet.</p>
        )}
      </div>
    </section>
  );
}
