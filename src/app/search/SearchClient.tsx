"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface SearchResult {
  type: string;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  level?: string;
}

const typeColors: Record<string, string> = {
  vocabulary: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  kanji: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  grammar: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
  work: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
};

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 1) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => search(query), 300);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query, search]);

  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
            ← Home
          </Link>
          <h1 className="text-xl font-bold">Search</h1>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        <div className="relative mb-8">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vocabulary, kanji, grammar..."
            autoFocus
            className="w-full px-5 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-lg focus:outline-none focus:ring-2 focus:ring-jp-red/30 focus:border-jp-red"
          />
          {loading && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
              Searching...
            </span>
          )}
        </div>

        {query.trim().length > 0 && results.length === 0 && !loading && (
          <p className="text-center text-zinc-500 py-16">No results found for &ldquo;{query}&rdquo;</p>
        )}

        {results.length > 0 && (
          <div className="grid gap-2">
            {results.map((r) => (
              <Link
                key={`${r.type}-${r.id}`}
                href={r.href}
                className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded ${typeColors[r.type] ?? "bg-zinc-100 text-zinc-600"}`}>
                  {r.type}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{r.title}</div>
                  <div className="text-sm text-zinc-500 truncate">{r.subtitle}</div>
                </div>
                {r.level && (
                  <span className="shrink-0 text-xs text-zinc-400">{r.level}</span>
                )}
              </Link>
            ))}
          </div>
        )}

        {query.trim().length === 0 && (
          <div className="text-center py-16 text-zinc-400">
            <p className="text-lg mb-2">🔍</p>
            <p>Type something to search across all JLPT levels and business content.</p>
          </div>
        )}
      </main>
    </div>
  );
}