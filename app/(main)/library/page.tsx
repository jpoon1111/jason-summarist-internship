"use client";

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import BookCard from '@/components/BookCard';
import { getFinishedBooks, getSavedBooks} from '@/lib/libraryService';
import type {SavedBookData } from '@/lib/libraryService';
import { useAppSelector } from '@/lib/hooks';


//Based on the code you just showed, EmptyState is a presentational component that renders a placeholder message when a user has no books in a given category (Saved Books or Finished Books).
// the two objects is destructuring so now title = title:string and subtitle = subtitle:string in order
//so title and subTitle stores them the reason is because...
// title and subtitle props becomes key value pairs
// this is what it turns into....
// React.createElement(EmptyState, {
//   title: "Done and dusted!",
//   subtitle: "When you finish a book..."
// });
// which then becomes 
// {
//   type: EmptyState,        // reference to the function
//   props: { title: "Done and dusted!" },
//   key: null,
//   ref: null,
//   // ... other internal fields
// }
function EmptyState ({title, subtitle}: {title: string; subtitle: string}) {
  //This function is going to show only if no Books is saved or getSavedBooks = 0 or getFinishedBooks = 0
  return (
    <div className='bg-[#f1f6f4] max-w-fit flex flex-col items-center gap-2 p-8 rounded-xl mx-auto mb-14 text-center'>
      <div className='text-[#042330] font-semibold text-lg'>{title}</div>
      <div className='text-[#394547]'>{subtitle}</div>
    </div>
  );
}

// this is the book grid and it will genrate an array of books referencing "SavedBookData" object
function BookGrid( {books}: {books: SavedBookData[]}) {
  return (
    <div 
      className='flex flex-wrap gap-4 mb-14'> {/* gap-4 → 1rem (16px) mb-14 → 3.5rem (56px) */}
    {books.map((b) => (
      <BookCard
        key={b.id}
        id={b.id}
        title={b.title}
        author={b.author}
        subTitle={b.subTitle}
        image={b.imageLink}
        audioLink={b.audioLink}
        rating={String(b.averageRating)}
        subscriptionRequired={b.subscriptionRequired}
      />
    ))}
    </div>
  )
}

export default function LibraryPage() {
  //get state from redux
  const user = useAppSelector((state)=> state.auth.user);
  const [savedBooks, setSavedBooks] = useState<SavedBookData[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<SavedBookData[]>([]);
  const [loadingSaved, setLoadingSaved] = useState<boolean>(true);
  const [loadingFinished, setLoadingFinished] = useState<boolean>(true);

  useEffect(()=> {
    // if user is not logged in then set all empty and false since there is nothing to show
    if (!user) {
      setSavedBooks([]);
      setFinishedBooks([]);
      setLoadingSaved(false);
      setLoadingFinished(false);
      return;
    }

    setLoadingSaved(true);
    getSavedBooks(user.uid)
      .then(setSavedBooks)
      .catch(()=> setSavedBooks([]))
      .finally(()=> setLoadingSaved(false));

    setLoadingFinished(true);
    getFinishedBooks(user.uid)
      .then(setFinishedBooks)
      .catch(()=> setFinishedBooks([]))
      .finally(()=> setLoadingFinished(false));
  }, [user]);

  return (
    <ProtectedRoute>
        <div className='max-w-[1070px] w-full mx-auto px-6'>
          <div className='py-10 w-full'>
            {/* Saved Books section */}
            {/* Header for "Saved" */}
            <h2 className='font-[22px] font-bold text-[#032b41] mb-4'>Saved Books</h2>
            {/* Sub header for "items" count  */}
            <div className='text-[#394547] font-light mb-4'>
              { loadingSaved 
                  ? "Loading..." 
                  :`${savedBooks.length} item${savedBooks.length !==1 ? 's': ''}` }
            </div>

            {!loadingSaved && savedBooks.length === 0 ? (
              <EmptyState 
                title="Save your favorite books!"
                subtitle="When you save a book, it will appear here."
              />
            ) : (
              <BookGrid books={savedBooks} />
            )}
          

            {/* Finished section */}
            {/* Header for "Finished" */}
            <h3 className='text-[22px] font-bold text-[#032b41] mb-4'>Finished</h3>
            {/* Sub header for "items" count */}
            <div className='font-light text-[#394547] mb-4'>
              {loadingFinished ? "Loading..." : `${finishedBooks.length} item${finishedBooks.length !== 1? "s": ""}` }
            </div>

              {!loadingFinished && finishedBooks.length === 0 ? (
                <EmptyState
                  title="Done and dusted!"
                  subtitle="When you finish a book, you can find it here later."
                />
              ) : (
                <BookGrid books={finishedBooks}/>
              )}
          </div>
        </div>
    </ProtectedRoute>
  )
}


