import Link from "next/link";

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
            ← Home
          </Link>
          <Link href="/work" className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
            Business
          </Link>
          <h1 className="text-xl font-bold">Business Japanese</h1>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">{children}</main>
    </div>
  );
}