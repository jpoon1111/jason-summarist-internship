import Link from "next/link";
import { Book } from "@/components/BookCard";

interface SelectedBookProps {
  book: Book | null;
  duration: string;
  loading: boolean;
}

export default function SelectedBook({ book, duration, loading }: SelectedBookProps) {
  if (loading) {
    return <div className="skeleton selected__book--skeleton" />;
  }

  if (!book) return null;

  return (
    <Link className="selected__book" href={`/book/${book.id}`}>
      <div className="selected__book--sub-title">{book.subTitle}</div>
      <div className="selected__book--line"></div>
      <div className="selected__book--content">
        <figure className="book__image--wrapper" style={{ height: 140, width: 140, minWidth: 140 }}>
          <img
            className="book__image"
            src={book.imageLink}
            alt={book.title}
            style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
          />
        </figure>
        <div className="selected__book--text">
          <div className="selected__book--title">{book.title}</div>
          <div className="selected__book--author">{book.author}</div>
          <div className="selected__book--duration-wrapper">
            <div className="selected__book--icon">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
              </svg>
            </div>
            <div className="selected__book--duration">{duration}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
