import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }) {
  const { level: slug } = await params;
  const name = slug.toUpperCase();
  return {
    title: `${name} — Hanyu`,
    description: `JLPT ${name} vocabulary, kanji, and grammar. Study Japanese at the ${name} level with Hanyu.`,
  };
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ level: string }>;
}

export default async function LevelLayout({ children, params }: Props) {
  const { level: slug } = await params;
  const name = slug.toUpperCase() as "N5" | "N4" | "N3" | "N2" | "N1";

  const levelData = await prisma.jLPTLevel.findUnique({ where: { name } });
  if (!levelData) notFound();

  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
            ← Home
          </Link>
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl font-bold">{levelData.label}</h1>
            <span className="text-sm text-zinc-500">{levelData.description}</span>
          </div>
        </div>
        <nav className="max-w-5xl mx-auto px-4 flex gap-1 pb-1">
          <Tab href={`/${slug}/vocabulary`} label="Vocabulary" />
          <Tab href={`/${slug}/kanji`} label="Kanji" />
          <Tab href={`/${slug}/grammar`} label="Grammar" />
          <Tab href={`/${slug}/quiz`} label="Quiz" />
        </nav>
      </header>
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">{children}</main>
    </div>
  );
}

function Tab({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 text-sm font-medium rounded-t-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
    >
      {label}
    </Link>
  );
}
