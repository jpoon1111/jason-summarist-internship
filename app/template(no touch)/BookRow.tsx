import BookCard, { Book } from "@/components/BookCard";
import BookSkeleton from "@/components/BookSkeleton";

interface BookRowProps {
  title: string;
  subtitle: string;
  books: (Book | null)[];
  loading: boolean;
  skeletonCount?: number;
}

export default function BookRow({ title, subtitle, books, loading, skeletonCount = 5 }: BookRowProps) {
  return (
    <div>
      <div className="for-you__title">{title}</div>
      <div className="for-you__sub--title">{subtitle}</div>
      <div className="for-you__recommended--books">
        {loading
          ? Array(skeletonCount).fill(0).map((_, i) => <BookSkeleton key={i} />)
          : books.map((book, i) =>
              book ? <BookCard key={book.id} book={book} /> : <BookSkeleton key={i} />
            )}
      </div>
    </div>
  );
}
