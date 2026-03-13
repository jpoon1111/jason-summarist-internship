// No "use client" directive — this is a pure presentational Server Component.
// It receives all data as props and renders static markup with no hooks or browser APIs.

import BookCard, { Book } from "./BookCard"; // BookCard renders an individual book; Book is the shared TypeScript interface
import BookSkeleton from "./BookSkeleton";   // Placeholder UI shown while books are loading — same width as a BookCard

// ── PROPS INTERFACE ─────────────────────────────────────────────────────────
interface BookRowProps {
  title: string;             // Section heading (e.g. "Recommended For You")
  subtitle: string;          // Section subheading (e.g. "We think you'll like these")
  books: (Book | null)[];    // Array of book objects — individual items can be null while their data is still loading
  loading: boolean;          // True = entire row is loading → show all skeletons; False = render actual books
  skeletonCount?: number;    // How many skeleton placeholders to show — defaults to 5 if not specified
}

export default function BookRow({
  title,
  subtitle,
  books,
  loading,
  skeletonCount = 5, // Default: show 5 skeletons — enough to fill most screen widths
}: BookRowProps) {
  return (
    <div>

      {/* ── SECTION HEADING ─────────────────────────────────────────────── */}
      {/* Large bold title — matches the .for-you__title style from the original CSS */}
      <div className="text-[22px] font-bold text-[#032b41] mb-4">{title}</div>

      {/* ── SECTION SUBHEADING ──────────────────────────────────────────── */}
      {/* Lighter weight, slightly muted — acts as a short descriptor under the title */}
      <div className="font-light text-[#394547] mb-4">{subtitle}</div>

      {/* ── BOOK CARDS SCROLL ROW ───────────────────────────────────────── */}
      {/* flex: lays cards out in a single horizontal row */}
      {/* overflow-x-auto: makes the row horizontally scrollable when there are more cards than screen width allows */}
      {/* gap-4: 16px space between each card */}
      {/* scrollSnapType: "x mandatory" — paired with scrollSnapAlign: "start" on each BookCard,
          this makes the row snap to card boundaries as the user scrolls horizontally */}
      <div
        className="flex overflow-x-auto gap-4 mb-8"
        style={{ scrollSnapType: "x mandatory" }}
      >

        {loading
          // LOADING STATE: replace all cards with the specified number of skeleton placeholders
          // Array(skeletonCount).fill(0) creates [0,0,0,0,0] — we only care about the indices
          ? Array(skeletonCount).fill(0).map((_, i) => <BookSkeleton key={i} />)

          // LOADED STATE: render each book as a BookCard
          // Individual items can still be null (e.g. a fetch for one book failed) — fall back to a skeleton
          : books.map((book, i) =>
              book
                ? <BookCard key={book.id} book={book} /> // key={book.id}: stable unique key for React's reconciler
                : <BookSkeleton key={i} />               // key={i}: index-based fallback when we have no book ID
            )
        }

      </div>
    </div>
  );
}