// Import functions from the Firebase SDK to initialize and manage your app
import { initializeApp, getApps } from "firebase/app";

// Import Firestore (database service)
import { getFirestore } from "firebase/firestore";

// Import Firebase Authentication service
import { getAuth } from "firebase/auth";

// Firebase project configuration
// These values come from environment variables(.env.local file) so you don’t expose secrets in your code
const firebaseConfig = {
  // API key used to identify your Firebase project
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,

  // Domain used for authentication (login, OAuth, etc.)
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,

  // Unique ID of your Firebase project
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,

  // Storage bucket for files like images and videos
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,

  // Used for Firebase Cloud Messaging (push notifications)
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,

  // Unique app ID for your Firebase application
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// In frameworks like :contentReference[oaicite:0]{index=0},
// code can run multiple times during hot reload or server rendering.
// This prevents Firebase from being initialized more than once,
// which would otherwise cause errors.

// If no Firebase app has been created yet, initialize it.
// Otherwise, reuse the existing app.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Create and export a Firestore database instance
// This lets you import `db` anywhere in your app to interact with the database.
export const db = getFirestore(app);

// Create and export the Firebase Authentication instance
// This allows login, signup, logout, etc.
export const auth = getAuth(app);

// Export the initialized Firebase app as the default export
export default app;