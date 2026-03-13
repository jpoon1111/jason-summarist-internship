// No "use client" directive — purely static markup, no hooks or interactivity needed

// ── WHAT IS A SKELETON? ─────────────────────────────────────────────────────
// A skeleton is a blank placeholder that mimics the shape and layout of real content
// while data is still loading. It prevents jarring layout shifts and signals to the
// user that content is on its way — better UX than a blank space or spinner.
//
// This skeleton mirrors the layout of BookCard:
//   - A tall image block (172px)
//   - Three text lines of different widths (title, author, subtitle)
//   - One shorter line (metadata/duration)
//
// All blocks use bg-[#e4e4e4] — a neutral light grey that reads as "empty"
// animate-pulse gives a subtle pulsing shimmer effect to indicate loading

export default function BookSkeleton() {
  return (
    // Outer wrapper — fixed 200px wide to exactly match BookCard's max-w-[200px]
    // min-w-[200px] prevents it from shrinking in the flex row when there are many skeletons
    <div className="min-w-[200px] w-[200px]">

      {/* ── COVER IMAGE PLACEHOLDER ─────────────────────────────────────── */}
      {/* 172px height matches the fixed height of the <figure> in BookCard */}
      {/* w-full fills the 200px card width */}
      <div className="bg-[#e4e4e4] animate-pulse w-full rounded mb-2" style={{ height: 172 }} />

      {/* ── TITLE LINE ──────────────────────────────────────────────────── */}
      {/* Taller (16px) to match the bold title text in BookCard */}
      {/* 80% width — shorter than full to look like a realistic title */}
      <div className="bg-[#e4e4e4] animate-pulse rounded mb-2" style={{ height: 16, width: "80%" }} />

      {/* ── AUTHOR LINE ─────────────────────────────────────────────────── */}
      {/* Shorter (12px) matching the smaller author text */}
      {/* 60% width — authors are usually shorter than titles */}
      <div className="bg-[#e4e4e4] animate-pulse rounded mb-2" style={{ height: 12, width: "60%" }} />

      {/* ── SUBTITLE LINE ───────────────────────────────────────────────── */}
      {/* Subtitles are often longer — 90% width reflects this */}
      <div className="bg-[#e4e4e4] animate-pulse rounded mb-2" style={{ height: 12, width: "90%" }} />

      {/* ── METADATA LINE (duration / rating) ──────────────────────────── */}
      {/* Shortest line — represents the compact icon + text row at the bottom of BookCard */}
      {/* No mb-2 on the last block — no extra space needed below the card */}
      <div className="bg-[#e4e4e4] animate-pulse rounded" style={{ height: 12, width: "50%" }} />

    </div>
  );
}