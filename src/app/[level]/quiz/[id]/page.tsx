import prisma from "@/lib/prisma";
import QuizClient from "@/components/QuizClient";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ level: string; id: string }>;
}

export default async function QuizPage({ params }: Props) {
  const { level: slug, id } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      lesson: { include: { level: true } },
      questions: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!quiz || quiz.lesson.level.name.toLowerCase() !== slug) notFound();

  const questions = quiz.questions.map((q) => ({
    id: q.id,
    text: q.text,
    type: q.type as "MULTIPLE_CHOICE" | "FILL_BLANK",
    options: (() => {
      try {
        const parsed = JSON.parse(q.options);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })(),
    correctAnswer: q.correctAnswer,
  }));

  return (
    <div>
      <Link
        href={`/${slug}/quiz`}
        className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 mb-6 inline-block"
      >
        ← Back to Quizzes
      </Link>

      <QuizClient questions={questions} title={quiz.title} quizId={quiz.id} lessonId={quiz.lessonId} />
    </div>
  );
}
