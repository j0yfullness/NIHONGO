import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Japanese — Hanyu",
  description: "Learn business Japanese: keigo (honorific language), interview preparation, workplace vocabulary, and resume/CV guidance.",
};

const sections = [
  {
    slug: "keigo",
    title: "Keigo (敬語)",
    description: "Honorific, humble, and polite language — essential for any workplace",
    color: "border-jp-red hover:bg-red-50 dark:hover:bg-red-950",
    icon: "🙇",
  },
  {
    slug: "interview",
    title: "Interview Prep",
    description: "Common questions, answers, and tips for Japanese job interviews",
    color: "border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950",
    icon: "💼",
  },
  {
    slug: "vocabulary",
    title: "Workplace Vocabulary",
    description: "Business terms, phrases, and expressions for daily office life",
    color: "border-green-500 hover:bg-green-50 dark:hover:bg-green-950",
    icon: "📝",
  },
  {
    slug: "resume",
    title: "Resume & CV Guide",
    description: "How to write rirekisho, shokumu keirekisho, and application essays",
    color: "border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950",
    icon: "📄",
  },
];

export default function WorkHubPage() {
  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
            ← Home
          </Link>
          <h1 className="text-xl font-bold">Business Japanese</h1>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-16 w-full">
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Work Japanese <span className="text-jp-red">ビジネス日本語</span>
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Master the Japanese you need for the workplace — keigo, interviews, business vocabulary, and resume writing.
          </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sections.map((section) => (
            <Link
              key={section.slug}
              href={`/work/${section.slug}`}
              className={`flex flex-col p-6 rounded-xl border-2 ${section.color} transition-colors`}
            >
              <div className="text-3xl mb-3">{section.icon}</div>
              <h3 className="text-xl font-bold mb-2">{section.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{section.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}