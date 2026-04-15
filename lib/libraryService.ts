// // lib/libraryService.ts
// import { db } from './firebase';
// import { 
//   doc, 
//   collection, 
//   getDoc, 
//   setDoc, 
//   deleteDoc, 
//   arrayUnion, 
//   arrayRemove,
//   updateDoc
// } from 'firebase/firestore';

// export class LibraryService {
  
//   // Save a book to user's library (bookmark)
//   static async saveBook(userId: string, bookId: string, bookData: any) {
//     try {
//       const userRef = doc(db, 'users', userId);
      
//       // Option 1: Store book IDs in an array
//       await updateDoc(userRef, {
//         savedBooks: arrayUnion(bookId),
//         updatedAt: new Date().toISOString()
//       });
      
//       // Option 2: Store full book data in a subcollection
//       const bookRef = doc(db, 'users', userId, 'library', bookId);
//       await setDoc(bookRef, {
//         ...bookData,
//         savedAt: new Date().toISOString()
//       });
      
//       return { success: true };
//     } catch (error) {
//       console.error('Error saving book:', error);
//       return { success: false, error };
//     }
//   }
  
//   // Remove a book from user's library
//   static async removeBook(userId: string, bookId: string) {
//     try {
//       const userRef = doc(db, 'users', userId);
      
//       // Option 1: Remove from array
//       await updateDoc(userRef, {
//         savedBooks: arrayRemove(bookId),
//         updatedAt: new Date().toISOString()
//       });
      
//       // Option 2: Delete from subcollection
//       const bookRef = doc(db, 'users', userId, 'library', bookId);
//       await deleteDoc(bookRef);
      
//       return { success: true };
//     } catch (error) {
//       console.error('Error removing book:', error);
//       return { success: false, error };
//     }
//   }
  
//   // Get all saved books
//   static async getSavedBooks(userId: string) {
//     try {
//       // Option 1: Get from array (need to fetch each book)
//       const userRef = doc(db, 'users', userId);
//       const userDoc = await getDoc(userRef);
      
//       if (!userDoc.exists()) {
//         return { success: true, books: [] };
//       }
      
//       const savedBookIds = userDoc.data().savedBooks || [];
      
//       // Fetch full book data for each ID
//       const { getDoc } = await import("firebase/firestore");
//       const books = [];
//       for (const bookId of savedBookIds) {
//         const bookRef = doc(db, 'books', bookId);
//         const bookDoc = await getDoc(bookRef);
//         if (bookDoc.exists()) {
//           books.push({ id: bookDoc.id, ...bookDoc.data() });
//         }
//       }
      
//       return { success: true, books };
      
//     } catch (error) {
//       console.error('Error getting saved books:', error);
//       return { success: false, books: [], error };
//     }
//   }
  
//   // Check if a book is saved
//   static async isBookSaved(userId: string, bookId: string) {
//     try {
//       const userRef = doc(db, 'users', userId);
//       const userDoc = await getDoc(userRef);
      
//       if (!userDoc.exists()) {
//         return false;
//       }
      
//       const savedBooks = userDoc.data().savedBooks || [];
//       return savedBooks.includes(bookId);
      
//     } catch (error) {
//       console.error('Error checking saved book:', error);
//       return false;
//     }
//   }
// }