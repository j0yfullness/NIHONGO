import "dotenv/config";
import { PrismaClient, JLPTLevelName, LessonCategory, WorkCategory } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import n5Vocab from "../data/n5/vocabulary.json";
import n5Kanji from "../data/n5/kanji.json";
import n5Grammar from "../data/n5/grammar.json";
import n4Vocab from "../data/n4/vocabulary.json";
import n4Kanji from "../data/n4/kanji.json";
import n4Grammar from "../data/n4/grammar.json";
import n3Vocab from "../data/n3/vocabulary.json";
import n3Kanji from "../data/n3/kanji.json";
import n3Grammar from "../data/n3/grammar.json";
import n2Vocab from "../data/n2/vocabulary.json";
import n2Kanji from "../data/n2/kanji.json";
import n2Grammar from "../data/n2/grammar.json";
import n1Vocab from "../data/n1/vocabulary.json";
import n1Kanji from "../data/n1/kanji.json";
import n1Grammar from "../data/n1/grammar.json";
import workKeigo from "../data/work/keigo.json";
import workInterview from "../data/work/interview.json";
import workVocab from "../data/work/vocabulary.json";
import workResume from "../data/work/resume.json";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const levels = [
    { name: JLPTLevelName.N5, label: "N5", description: "Beginner — Basic Japanese", order: 1 },
    { name: JLPTLevelName.N4, label: "N4", description: "Elementary — Everyday Japanese", order: 2 },
    { name: JLPTLevelName.N3, label: "N3", description: "Intermediate — Practical Japanese", order: 3 },
    { name: JLPTLevelName.N2, label: "N2", description: "Upper-Intermediate — Business Japanese", order: 4 },
    { name: JLPTLevelName.N1, label: "N1", description: "Advanced — Fluent Japanese", order: 5 },
  ];

  for (const level of levels) {
    await prisma.jLPTLevel.upsert({
      where: { name: level.name },
      update: level,
      create: level,
    });
  }
  console.log("Levels created.");

  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.vocabularyItem.deleteMany();
  await prisma.kanjiCharacter.deleteMany();
  await prisma.grammarPoint.deleteMany();
  await prisma.lesson.deleteMany();

  const n5 = await prisma.jLPTLevel.findUniqueOrThrow({ where: { name: JLPTLevelName.N5 } });
  const n4 = await prisma.jLPTLevel.findUniqueOrThrow({ where: { name: JLPTLevelName.N4 } });
  const n3 = await prisma.jLPTLevel.findUniqueOrThrow({ where: { name: JLPTLevelName.N3 } });
  const n2 = await prisma.jLPTLevel.findUniqueOrThrow({ where: { name: JLPTLevelName.N2 } });
  const n1 = await prisma.jLPTLevel.findUniqueOrThrow({ where: { name: JLPTLevelName.N1 } });

  await seedVocabulary(n5.id, n5Vocab);
  await seedKanji(n5.id, n5Kanji);
  await seedGrammar(n5.id, n5Grammar);

  await seedVocabulary(n4.id, n4Vocab);
  await seedKanji(n4.id, n4Kanji);
  await seedGrammar(n4.id, n4Grammar);

  await seedVocabulary(n3.id, n3Vocab);
  await seedKanji(n3.id, n3Kanji);
  await seedGrammar(n3.id, n3Grammar);

  await seedVocabulary(n2.id, n2Vocab);
  await seedKanji(n2.id, n2Kanji);
  await seedGrammar(n2.id, n2Grammar);

  await seedVocabulary(n1.id, n1Vocab);
  await seedKanji(n1.id, n1Kanji);
  await seedGrammar(n1.id, n1Grammar);

  await createLessons(n5.id, "N5");
  await createLessons(n4.id, "N4");
  await createLessons(n3.id, "N3");
  await createLessons(n2.id, "N2");
  await createLessons(n1.id, "N1");

  await prisma.workContent.deleteMany();
  await seedWorkContent(workKeigo, "KEEGO");
  await seedWorkContent(workInterview, "INTERVIEW");
  await seedWorkContent(workVocab, "VOCABULARY");
  await seedWorkContent(workResume, "RESUME");

  console.log("Seeding complete!");
}

async function seedVocabulary(levelId: string, items: Array<{ word: string; reading: string; meaning: string; exampleSentence?: string; exampleTranslation?: string }>) {
  for (const item of items) {
    await prisma.vocabularyItem.create({
      data: {
        word: item.word,
        reading: item.reading,
        meaning: item.meaning,
        exampleSentence: item.exampleSentence || null,
        exampleTranslation: item.exampleTranslation || null,
        levelId,
      },
    });
  }
  console.log(`  ${items.length} vocabulary items seeded.`);
}

async function seedKanji(levelId: string, items: Array<{ character: string; onyomi?: string; kunyomi?: string; strokeCount?: number; meaning: string; compounds?: string }>) {
  for (const item of items) {
    await prisma.kanjiCharacter.upsert({
      where: { character: item.character },
      update: { levelId },
      create: {
        character: item.character,
        onyomi: item.onyomi || null,
        kunyomi: item.kunyomi || null,
        strokeCount: item.strokeCount || null,
        meaning: item.meaning,
        compounds: item.compounds || null,
        levelId,
      },
    });
  }
  console.log(`  ${items.length} kanji seeded.`);
}

async function seedGrammar(levelId: string, items: Array<{ pattern: string; explanation: string; usageRules?: string; exampleSentence?: string; exampleTranslation?: string }>) {
  for (const item of items) {
    await prisma.grammarPoint.create({
      data: {
        pattern: item.pattern,
        explanation: item.explanation,
        usageRules: item.usageRules || null,
        exampleSentence: item.exampleSentence || null,
        exampleTranslation: item.exampleTranslation || null,
        levelId,
      },
    });
  }
  console.log(`  ${items.length} grammar points seeded.`);
}

async function createLessons(levelId: string, label: string) {
  const categories: Array<{ title: string; category: LessonCategory; order: number }> = [
    { title: `${label} Vocabulary`, category: LessonCategory.VOCABULARY, order: 1 },
    { title: `${label} Kanji`, category: LessonCategory.KANJI, order: 2 },
    { title: `${label} Grammar`, category: LessonCategory.GRAMMAR, order: 3 },
  ];

  for (const cat of categories) {
    await prisma.lesson.create({
      data: {
        title: cat.title,
        category: cat.category,
        order: cat.order,
        levelId,
      },
    });
  }
  console.log(`  ${label} lessons created.`);
}

async function seedWorkContent(items: Array<{ title: string; japanese?: string; reading?: string; meaning?: string; explanation?: string; examples?: string; order: number }>, category: WorkCategory) {
  for (const item of items) {
    await prisma.workContent.create({
      data: {
        category,
        title: item.title,
        japanese: item.japanese || null,
        reading: item.reading || null,
        meaning: item.meaning || null,
        explanation: item.explanation || null,
        examples: item.examples || "[]",
        order: item.order,
      },
    });
  }
  console.log(`  ${items.length} work items seeded for ${category}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
