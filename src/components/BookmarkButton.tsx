"use client";

import { useCallback, useState } from "react";

interface BookmarkButtonProps {
  itemType: string;
  itemId: string;
  initialBookmarked?: boolean;
}

export default function BookmarkButton({ itemType, itemId, initialBookmarked }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked ?? false);

  const toggle = useCallback(async () => {
    const res = await fetch("/api/bookmark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemType, itemId }),
    });
    if (res.ok) {
      const data = await res.json();
      setBookmarked(data.bookmarked);
    }
  }, [itemType, itemId]);

  return (
    <button
      onClick={toggle}
      className={`text-sm transition-colors ${
        bookmarked ? "text-jp-red" : "text-zinc-400 hover:text-zinc-600"
      }`}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {bookmarked ? "♥ Bookmarked" : "♡ Bookmark"}
    </button>
  );
}
