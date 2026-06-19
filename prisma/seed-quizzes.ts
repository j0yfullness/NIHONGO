import "dotenv/config";
import { PrismaClient, QuestionType, LessonCategory } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});
const prisma = new PrismaClient({ adapter });

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[], count: number): T[] {
  return shuffle(arr).slice(0, count);
}

async function seedLessonQuizzes() {
  const lessons = await prisma.lesson.findMany({ include: { level: true } });

  for (const lesson of lessons) {
    const existingQuiz = await prisma.quiz.findFirst({ where: { lessonId: lesson.id } });
    if (existingQuiz) continue;

    const quiz = await prisma.quiz.create({
      data: {
        title: `${lesson.title} Quiz`,
        lessonId: lesson.id,
      },
    });

    const items = await getLessonItems(lesson);
    const selected = pickRandom(items, Math.min(items.length, 20));

    for (const item of selected) {
      const wrong = pickRandom(
        items.filter((i) => i.correct !== item.correct && i.type === item.type),
        3
      );

      const options = shuffle([item.correct, ...wrong.map((w) => w.correct)]);
      const type = Math.random() < 0.2 ? QuestionType.FILL_BLANK : QuestionType.MULTIPLE_CHOICE;

      await prisma.question.create({
        data: {
          text: item.question,
          type,
          options: type === QuestionType.MULTIPLE_CHOICE ? JSON.stringify(options) : "[]",
          correctAnswer: item.correct,
          quizId: quiz.id,
        },
      });
    }

    console.log(`  Quiz "${quiz.title}": ${selected.length} questions`);
  }
}

async function getLessonItems(lesson: { id: string; category: LessonCategory; levelId: string }) {
  switch (lesson.category) {
    case LessonCategory.VOCABULARY: {
      const items = await prisma.vocabularyItem.findMany({ where: { levelId: lesson.levelId } });
      return items.flatMap((v) => [
        { question: `What is the meaning of "${v.word}"?`, correct: v.meaning, type: "vocab" },
        { question: `How do you read "${v.word}"?`, correct: v.reading, type: "vocab-read" },
        { question: `Translate to Japanese: "${v.meaning}"`, correct: v.word, type: "vocab-jp" },
      ]);
    }
    case LessonCategory.KANJI: {
      const items = await prisma.kanjiCharacter.findMany({ where: { levelId: lesson.levelId } });
      return items.flatMap((k) => [
        { question: `What is the meaning of "${k.character}"?`, correct: k.meaning, type: "kanji" },
        ...(k.onyomi ? [{ question: `What is the on'yomi of "${k.character}"?`, correct: k.onyomi, type: "kanji-on" }] : []),
        ...(k.kunyomi ? [{ question: `What is the kun'yomi of "${k.character}"?`, correct: k.kunyomi, type: "kanji-kun" }] : []),
      ]);
    }
    case LessonCategory.GRAMMAR: {
      const items = await prisma.grammarPoint.findMany({ where: { levelId: lesson.levelId } });
      return items.map((g) => ({
        question: `What does "${g.pattern}" mean?`,
        correct: g.explanation,
        type: "grammar",
      }));
    }
    default:
      return [];
  }
}

async function seedAdvancementQuizzes() {
  const levels = await prisma.jLPTLevel.findMany({ orderBy: { order: "asc" } });

  for (let i = 0; i < levels.length - 1; i++) {
    const level = levels[i];
    const nextLevel = levels[i + 1];

    const existing = await prisma.quiz.findFirst({
      where: { title: `${nextLevel.label} Advancement Test` },
    });
    if (existing) continue;

    const allVocab = await prisma.vocabularyItem.findMany({ where: { levelId: level.id } });
    const allKanji = await prisma.kanjiCharacter.findMany({ where: { levelId: level.id } });
    const allGrammar = await prisma.grammarPoint.findMany({ where: { levelId: level.id } });

    const firstLesson = await prisma.lesson.findFirst({ where: { levelId: level.id } });
    if (!firstLesson) continue;

    const quiz = await prisma.quiz.create({
      data: {
        title: `${nextLevel.label} Advancement Test`,
        isAdvancement: true,
        lessonId: firstLesson.id,
      },
    });

    const vocabItems = allVocab.flatMap((v) => [
      { question: `What is the meaning of "${v.word}"?`, correct: v.meaning },
      { question: `How do you read "${v.word}"?`, correct: v.reading },
    ]);
    const kanjiItems = allKanji.flatMap((k) => [
      { question: `What is the meaning of "${k.character}"?`, correct: k.meaning },
    ]);
    const grammarItems = allGrammar.flatMap((g) => [
      { question: `What does "${g.pattern}" mean?`, correct: g.explanation },
    ]);

    const allItems = shuffle([...vocabItems, ...kanjiItems, ...grammarItems]);
    const selected = allItems.slice(0, 30);

    for (const item of selected) {
      const wrong = pickRandom(
        allItems.filter((x) => x.correct !== item.correct),
        3
      );
      const options = shuffle([item.correct, ...wrong.map((w) => w.correct)]);

      await prisma.question.create({
        data: {
          text: item.question,
          type: QuestionType.MULTIPLE_CHOICE,
          options: JSON.stringify(options),
          correctAnswer: item.correct,
          quizId: quiz.id,
        },
      });
    }

    console.log(`  Advancement test "${nextLevel.label}": ${selected.length} questions`);
  }
}

async function main() {
  console.log("Seeding quizzes...");

  await seedLessonQuizzes();
  await seedAdvancementQuizzes();

  console.log("Quiz seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
