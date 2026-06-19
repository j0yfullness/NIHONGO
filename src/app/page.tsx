import Link from "next/link";
import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth";

const levels = [
  { slug: "n5", name: "N5", label: "Beginner", color: "border-green-500 hover:bg-green-50 dark:hover:bg-green-950" },
  { slug: "n4", name: "N4", label: "Elementary", color: "border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950" },
  { slug: "n3", name: "N3", label: "Intermediate", color: "border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950" },
  { slug: "n2", name: "N2", label: "Upper-Intermediate", color: "border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950" },
  { slug: "n1", name: "N1", label: "Advanced", color: "border-red-500 hover:bg-red-50 dark:hover:bg-red-950" },
];

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-jp-red">Hanyu</span>{" "}
              <span className="text-sm font-normal text-zinc-500">日本語</span>
            </h1>
          </Link>
          <nav className="flex gap-4 text-sm items-center">
            <Link href="/search" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Search
            </Link>
            <Link href="/work" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Business
            </Link>
            {session?.user ? (
              <>
                <Link href="/dashboard" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                  Dashboard
                </Link>
                <form action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}>
                  <button type="submit" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <Link href="/auth/login" className="px-4 py-1.5 rounded-lg bg-zinc-900 text-white text-sm font-medium dark:bg-zinc-100 dark:text-zinc-900">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-16 w-full">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Master Japanese from{" "}
            <span className="text-jp-red">N5 to N1</span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Comprehensive vocabulary, kanji, and grammar for every JLPT level.
            Plus business Japanese for working in Japan.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-8 text-center">Choose Your Level</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((level) => (
              <Link
                key={level.slug}
                href={`/${level.slug}`}
                className={`level-card ${level.color}`}
              >
                <div className="text-3xl font-bold mb-1">{level.name}</div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">{level.label}</div>
                <div className="flex gap-2">
                  <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Vocabulary</span>
                  <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Kanji</span>
                  <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Grammar</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 text-center text-sm text-zinc-500">
        <p>Hanyu — Learn Japanese. JLPT N5 to N1.</p>
      </footer>
    </div>
  );
}
