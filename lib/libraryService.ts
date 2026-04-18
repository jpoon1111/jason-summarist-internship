// lib/libraryService.ts
//// this is function-based structure
import { finished } from 'stream';
import { db } from './firebase';
import { 
  doc, 
  collection, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  arrayUnion, 
  arrayRemove,
  updateDoc,
  getDocs
} from 'firebase/firestore';

// SavedBookData is a TypeScript interface that defines the shape of the book data you store in Firebase.
export interface SavedBookData {
    id: string;
    title: string;
    author: string;
    subTitle: string;
    imageLink: string;
    audioLink: string;
    averageRating: number;
    subscriptionRequired?: boolean;
    savedAt: string;
}

// this extends the SavedBookData and adds "finished AT"
export interface FinishedBookData extends SavedBookData {
    finishedAt: string;
}

// Saved Books functionality
//Func to save book. This saves a book to user's uid using `users/{uid}/savedBooks/{bookId}`
// it expects a uuserId that is a type of string and bookData that is a type of SavedBookData which expects to return a Promise
export async function saveBook (userId: string , bookData: SavedBookData ): Promise<void> {
    // doc() to generate a reference to let you know or  just points to where the document should live
    //  db = your firebase database, userId → document (the specific user), users → collection(directory/folder), savedBooks → subcollection(subfolder), bookData.id → document (the specific book)
    const ref = doc(db, 'users', userId, 'savedBooks', bookData.id);
    // using ref that stores doc()....
    // sends a request to firebase using their top-level function setDoc() with will return a promise (but since it is void we get an empty promise)
    // if doc does not exist then setDoc will automatically create a doc
    // ref = document reference, ...bookData = SavedBookData's object's blueprint, savedAt = current date and time as a string 
    await setDoc(ref, {...bookData, savedAt: new Date().toISOString() });
}

// Func to Remove a Book from the saved list                        //Promist is expected to be a void (void means just execute or do your thing but don't return anything)
export async function unsavedBook(userId: string , bookId: string): Promise<void> {
    // generate a ref for your firebase's db, users = directory for users, userId of the user, savedBooks = directory/folder, the bookId of the book
    const ref = doc(db, 'users', userId, 'savedBooks', bookId);
    await deleteDoc(ref);
}

// this func is using Promise<boolean> instead of void which means you are required to return a boolean otherwise typescript will cry 
export async function isBookSaved(userId: string, bookId:string): Promise<boolean> {
    const ref = doc(db, 'users', userId, 'savedBooks', bookId);
    //get the doc from the db for any bookId
    const snap = await getDoc(ref);
    //return if snap exists in firebase which returns a true or false but we need to return again to the caller
    return snap.exists();
}

    /** Fetch all saved books for a user */
export async function getSavedBooks(userId:string): Promise<SavedBookData[]> {
    const coll = collection(db, 'users', userId, 'savedBooks');
    const snap = await getDocs(coll);
    return snap.docs.map((d) => d.data() as SavedBookData);
}

    /** Fetch all finished books for a user */
export async function getFinishedBooks(userId: string): Promise<FinishedBookData[]> {
    // references all documents from a given  in db/users/userId/finishedBooks specified in the Parameters. The collection can be nested.
    const coll = collection(db, 'users', userId, 'finishedBooks');
    // converted 'const snap = await getDocs(coll)' to 'const {docs} = await getDocs(coll)'
    const snap = await (getDocs(coll))
    return snap.docs.map((d)=> d.data() as FinishedBookData);
}

    /** Check whether a book is finished */

export async function isBookFinished(userId: string, bookId:string): Promise<boolean> {
    const ref = doc(db, 'users', userId, 'finishedBooks', bookId);
    const snap = await getDoc(ref);
    return snap.exists();
}

export async function markBookFinished(userId: string, bookData: FinishedBookData): Promise<void> {
    const ref = doc(db, 'users', userId,  'finishedBooks', bookData.id);
    await setDoc( ref, {...bookData, finishedAt: new Date().toISOString()} )
}



// // this is class based structure but not recommended for scaling
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