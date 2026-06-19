import SearchClient from "./SearchClient";

export const metadata = {
  title: "Search — Hanyu",
  description: "Search vocabulary, kanji, grammar, and business Japanese content across all JLPT levels.",
};

export default function SearchPage() {
  return <SearchClient />;
}