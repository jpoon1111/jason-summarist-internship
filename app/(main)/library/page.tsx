"use client";

import BookCard from '@/components/BookCard';
import ProtectedRoute from '@/components/ProtectedRoute';


function page() {
  

  return (
    <ProtectedRoute>
        <div className='border-1 w-full max-w-[1070px] mx-auto px-6'>
          <div className='border-1 py-5 w-full'>

          <h2>Saved Books</h2>
          <p>0 items</p>
          <div className='finished__books--block-wrapper border-1'></div>
            <h3>Save your favorite books!</h3>
            <p>When you save a book, it will appear here.</p>
          </div>
        </div>
        <h3>Finished</h3>
        <p>{`13 Item s`}</p>
        <BookCard />
    </ProtectedRoute>
  )
}

export default page