"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { AiOutlineSearch } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { AiOutlineClockCircle } from "react-icons/ai";

interface Book {
  id: string;
  title: string;
  author: string;
  imageLink: string;
  audioLink: string;
}

function formatMM(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const SEARCH_URL =
  "https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle";

export default function SearchBar() {
  const [query,     setQuery]     = useState("");
  const [results,   setResults]   = useState<Book[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [durations, setDurations] = useState<Record<string, string>>({});
  const wrapperRef                = useRef<HTMLDivElement>(null);

  // ── Debounced search ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    const timer = setTimeout(() => {
      axios
        .get<Book[]>(SEARCH_URL, { params: { search: query } })
        .then((res) => setResults(res.data))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  // ── Load audio duration for each result ───────────────────────────────────
  useEffect(() => {
    results.forEach((book) => {
      if (!book.audioLink || durations[book.id]) return;
      const a = new Audio(book.audioLink);
      a.addEventListener("loadedmetadata", () => {
        setDurations((prev) => ({ ...prev, [book.id]: formatMM(a.duration) }));
      });
    });
  }, [results]);

  // ── Close dropdown on outside click ───────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setQuery("");
        setResults([]);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const showDropdown = query.trim().length > 0;

  return (
    <div className="bg-white border-b border-[#e1e7ea] h-20 z-[1]">
      <div
        ref={wrapperRef}
        className="relative flex items-center justify-between px-8 max-w-[1070px] mx-auto h-full"
      >
        {/* Left spacer — logo lives in Sidebar */}
        <div />

        {/* Search input */}
        <div className="flex items-center w-full gap-6 max-w-[340px]">
          <div className="flex items-center w-full">
            <div className="relative w-full">
              <input
                suppressHydrationWarning
                placeholder="Search for books"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 w-full px-4 pr-10 outline-none bg-[#f1f6f4] text-[14px] text-[#042330] border-2 border-[#e1e7ea] rounded-lg focus:border-[#2be080] transition-all"
              />
              <div className="absolute right-2 top-0 flex h-full items-center justify-end border-l-2 border-[#e1e7ea] pl-2">
                {query ? (
                  <IoClose
                    className="w-6 h-6 text-[#03314b] cursor-pointer"
                    onClick={() => { setQuery(""); setResults([]); }}
                  />
                ) : (
                  <AiOutlineSearch className="w-6 h-6 text-[#03314b]" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hamburger — mobile only */}
        <div className="flex md:hidden items-center justify-center cursor-pointer">
          <RxHamburgerMenu className="w-6 h-6 text-[#03314b]" />
        </div>

        {/* ── Dropdown results ─────────────────────────────────────────────── */}
        {showDropdown && (
          <div className="absolute top-[80px] right-6 w-full max-w-[440px] max-h-[640px] overflow-y-auto bg-white border border-[#e1e7ea] shadow-md z-50 flex flex-col">

            {loading && (
              <div className="p-4 text-[14px] text-[#6b757b]">Searching...</div>
            )}

            {!loading && results.length === 0 && (
              <div className="p-4 text-[14px] text-[#6b757b]">
                No books found for &quot;{query}&quot;
              </div>
            )}

            {!loading && results.map((book) => (
              <Link
                key={book.id}
                href={`/book/${book.id}`}
                onClick={() => { setQuery(""); setResults([]); }}
                className="flex items-center gap-6 px-4 py-3 h-[120px] border-b border-[#e1e7ea] last:border-b-0 hover:bg-[#f1f6f4] transition-colors no-underline"
              >
                {/* Book cover */}
                <figure className="w-[80px] h-[80px] min-w-[80px] m-0">
                  <img
                    src={book.imageLink}
                    alt={book.title}
                    className="w-full h-full object-cover block"
                  />
                </figure>

                {/* Book info */}
                <div className="flex flex-col gap-1">
                  <div className="text-[16px] font-medium text-[#032b41]">
                    {book.title}
                  </div>
                  <div className="text-[14px] font-light text-[#6b757b]">
                    {book.author}
                  </div>
                  <div className="flex items-center gap-1 text-[14px] font-light text-[#6b757b]">
                    <AiOutlineClockCircle className="w-4 h-4" />
                    <span>{durations[book.id] ?? "..."}</span>
                  </div>
                </div>
              </Link>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}