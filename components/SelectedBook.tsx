import Link from "next/link"; // Next.js client-side navigation — makes the entire card a clickable link to the book's detail page
import { BookProps } from "@/components/BookCard"; // Shared Book TypeScript interface — defines the shape of the book data object

// ── PROPS INTERFACE ─────────────────────────────────────────────────────────
interface SelectedBookProps {
  book: BookProps | null;  // The featured book to display — null while the API fetch is still in progress
  duration: string;   // Human-readable audio duration string (e.g. "3 mins 05 secs") — computed in page.tsx from the <audio> element's metadata
  loading: boolean;   // True while the book is being fetched — triggers the skeleton placeholder instead of the card
}

export default function SelectedBook({ book, duration, loading }: SelectedBookProps) {

  // ── LOADING STATE ──────────────────────────────────────────────────────────
  // While the API fetch is in progress, render a grey placeholder block ("skeleton")
  // The width matches the card's actual width: 2/3 of the container
  // The height (200px) approximates the card's rendered height to prevent layout shift
  if (loading) {
    return (
      <div
        className="bg-[#e4e4e4] mb-6 animate-pulse" // animate-pulse: subtle pulsing shimmer effect to signal loading
        style={{ width: "calc((100% / 3) * 2)", height: 200 }}
      />
    );
  }

  // ── NULL GUARD ─────────────────────────────────────────────────────────────
  // If the API returned nothing (network error, bad ID, etc.), render nothing
  // This prevents a crash from trying to access properties on null
  if (!book) return null;

  return (
    // The entire card is a Link — clicking anywhere navigates to the book's detail page
    // Width is 2/3 of the container (matches the original .selected__book CSS)
    // bg-[#fbefd6]: warm yellow background — distinctive "featured" style
    // On tablet and below (max-[1200px]): stretches to full width
    // On mobile (max-md): stacks vertically instead of side-by-side
    <Link
      className="flex justify-between bg-[#fbefd6] rounded p-6 mb-6 gap-6
        max-[1200px]:w-full
        max-md:flex-col max-md:gap-6
        max-[576px]:p-4"
      style={{ width: "calc((100% / 3) * 2)" }}
      href={`/book/${book.id}`}
    >

      {/* ── LEFT: SUBTITLE ─────────────────────────────────────────────────── */}
      {/* Takes up 40% of the card width — acts as a teaser/hook for the book */}
      {/* On mobile: expands to full width and reduces font size */}
      <div className="text-[#032b41] w-[40%] max-md:w-full max-md:text-sm">
        {book.subTitle}
      </div>

      {/* ── CENTER: VERTICAL DIVIDER ────────────────────────────────────────── */}
      {/* 1px wide vertical line — visually separates the subtitle from the book info */}
      {/* Hidden on mobile (max-md:hidden) since the layout stacks vertically */}
      <div className="w-px bg-[#bac8ce] max-md:hidden" />

      {/* ── RIGHT: BOOK INFO ────────────────────────────────────────────────── */}
      {/* Takes up 60% of the card width — contains the cover image, title, author, and play button */}
      <div className="flex gap-4 w-[60%] max-md:w-full">

        {/* Book cover image — fixed 140x140px square, doesn't shrink (flex-shrink-0) */}
        <figure
          className="rounded-lg overflow-hidden flex-shrink-0" // overflow-hidden: clips the image to the rounded corners
          style={{ height: 140, width: 140, minWidth: 140 }}
        >
          <img
            src={book.image}
            alt={book.title}
            style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} // objectFit cover: fills the box without distorting the image
          />
        </figure>

        {/* Text content: title, author, and play/duration row */}
        <div className="w-full">

          {/* Book title — bold dark text */}
          <div className="font-semibold text-[#032b41] mb-2">{book.title}</div>

          {/* Author name — smaller, slightly lighter grey */}
          <div className="text-sm text-[#394547] mb-4">{book.author}</div>

          {/* ── PLAY BUTTON + DURATION ────────────────────────────────────── */}
          <div className="flex items-center gap-2">

            {/* Circular play icon — black circle with a white play triangle inside */}
            {/* This is decorative only; actual playback is handled by the AudioPlayer at the bottom of the page */}
            <div className="flex items-center w-10 min-w-[40px] h-10">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 16 16"
                className="w-full h-full bg-black text-white rounded-full"
                style={{ padding: "4px 4px 4px 6px" }} // Extra left padding visually centers the triangle (SVG triangles often look off-center)
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
              </svg>
            </div>

            {/* Duration string — e.g. "3 mins 05 secs" — passed in from page.tsx after audio metadata loads */}
            <div className="text-sm font-medium text-[#032b41]">{duration}</div>

          </div>
        </div>
      </div>
    </Link>
  );
}