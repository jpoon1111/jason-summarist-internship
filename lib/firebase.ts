// ============================================================
// FIREBASE.TS — FULL EXPLANATION
// ============================================================
// This file is the single entry point for all Firebase services
// in your app. It initializes the Firebase app once and exports
// the services (auth, db) that other files need.
//
// Think of it as the "Firebase setup file" — without this file
// nothing Firebase related would work in your app.
// ============================================================


// ============================================================
// WHAT IS FIREBASE?
// ============================================================
// Firebase is a backend service by Google that gives you:
//   - Authentication (login, signup, Google login, guest login)
//   - Firestore (a NoSQL database to store user data, books etc.)
//   - Storage (for files like images and audio)
// Instead of building your own backend server, Firebase handles
// all of this for you out of the box.
// ============================================================


// initializeApp — creates your Firebase app instance
// Must be called first before any other Firebase service can be used
// Takes your firebaseConfig object and connects to your Firebase project
//
// getApps — returns an array of all currently initialized Firebase apps
// Used to check if Firebase has already been initialized
// Prevents the "Firebase app already exists" error during hot reload
import { initializeApp, getApps } from "firebase/app";


// getFirestore — creates a Firestore database instance
// Firestore is Firebase's NoSQL database
// Used in your app to store and retrieve data like:
//   - user library (saved books)
//   - user preferences
//   - subscription status
import { getFirestore } from "firebase/firestore";


// getAuth — creates a Firebase Authentication instance
// Used to handle all auth operations:
//   - email/password login and signup
//   - Google OAuth login
//   - anonymous/guest login
//   - password reset
//   - listening for auth state changes (onAuthStateChanged)
import { getAuth } from "firebase/auth";


// ============================================================
// FIREBASE CONFIG
// ============================================================
// These are the credentials that connect your app to YOUR
// specific Firebase project on Google's servers.
//
// They come from environment variables (.env.local file)
// so they are not exposed in your source code.
// process.env.NEXT_PUBLIC_* means Next.js exposes these
// values to the browser (client side) — safe for Firebase config
// but should never be used for truly secret server keys.
//
// You get these values from:
// Firebase Console → Project Settings → Your Apps → SDK setup
// ============================================================

// How it works
// Step 1 — Your credentials live in .env.local
// firebaseConfig is just an object of keys that tell Firebase which project to connect to. Instead of hardcoding them, they're pulled from .env.local so they're not exposed in your code.
// Step 2 — Firebase starts up once
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // identifies your Firebase project to Google's servers
  // used in every request Firebase makes to your project

  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // the domain Firebase uses for OAuth popups (Google login)
  // format: your-project-id.firebaseapp.com

  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // unique ID of your Firebase project
  // used to route requests to the correct Firestore database

  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  // URL of your Firebase Storage bucket
  // used when uploading/downloading files like book images or audio

  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  // used for Firebase Cloud Messaging (push notifications)
  // not used in your app currently but required for full config

  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // unique ID for this specific Firebase app
  // a Firebase project can have multiple apps (web, iOS, Android)
  // this ID identifies which one is yours
};


// ============================================================
// WHY getApps().length === 0 CHECK?
// ============================================================
// Next.js runs code multiple times:
//   - once on the server (SSR/SSG)
//   - once on the client (hydration)
//   - multiple times during hot reload in development
//
// Without this check, initializeApp() would be called multiple
// times and Firebase would throw:
// "Firebase: Firebase App named '[DEFAULT]' already exists"
//
// getApps() returns all initialized apps
// if length === 0 → no app exists yet → initialize a new one
// if length > 0  → app already exists → reuse the existing one
// ============================================================
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];


// db — the Firestore database instance
// exported so other files can import it to read/write data
// e.g. saving a book to a user's library:
// import { db } from "@/lib/firebase"
// await setDoc(doc(db, "users", uid, "library", bookId), bookData)

// This says: "if Firebase isn't running yet, start it — otherwise reuse the one that's already running." This prevents crashes during Next.js hot reloads.
// Step 3 — Two services get created from that app and exported
export const db = getFirestore(app);


// auth — the Firebase Authentication instance
// exported so other files can import it to handle auth operations
// e.g. in AuthModal.tsx:
// import { auth } from "@/lib/firebase"
// await signInWithEmailAndPassword(auth, email, password)
export const auth = getAuth(app);


// default export — the Firebase app instance itself
// rarely needed directly but exported for completeness
// some Firebase services require the app instance directly
export default app;


// ============================================================
// HOW OTHER FILES IN YOUR PROJECT DEPEND ON THIS FILE:
// ============================================================
//
// components/AuthModal.tsx
//   → imports { auth } from "@/lib/firebase"
//   → uses auth with:
//        signInWithEmailAndPassword(auth, email, password)
//        createUserWithEmailAndPassword(auth, email, password)
//        signInAnonymously(auth)
//        sendPasswordResetEmail(auth, email)
//        signInWithPopup(auth, provider)
//   → without firebase.ts, AuthModal cannot log users in
//
// components/ReduxProvider.tsx
//   → imports { auth } from "@/lib/firebase"
//   → uses auth with:
//        onAuthStateChanged(auth, (firebaseUser) => {...})
//   → without firebase.ts, ReduxProvider cannot listen for
//     auth state changes and Redux user will always be null
//
// app/(main)/book/[id]/page.tsx (future)
//   → will import { db } from "@/lib/firebase"
//   → will use db to save books to user's library in Firestore
//   → without firebase.ts, no database operations are possible
//
// ============================================================
// HOW THIS FILE DEPENDS ON OTHER FILES:
// ============================================================
//
// .env.local
//   → firebase.ts reads all config values from here
//   → without .env.local, firebaseConfig values are undefined
//   → Firebase initialization would fail silently or throw errors
//
// ============================================================
// THE FULL DEPENDENCY CHAIN:
// ============================================================
//
// .env.local                   ← stores your Firebase credentials
//      ↓
// firebase.ts                  ← YOU ARE HERE — initializes Firebase
//      ↓
//      ├── auth exported ───→ AuthModal.tsx (login/signup/google/guest)
//      │                  ───→ ReduxProvider.tsx (onAuthStateChanged)
//      │
//      └── db exported ─────→ book/[id]/page.tsx (save to library - future)
//                         ───→ for-you/page.tsx (fetch user data - future)
//                         ───→ settings/page.tsx (user preferences - future)
//
// ============================================================
// IN SIMPLE TERMS:
// ============================================================
// firebase.ts is the bridge between your Next.js app and
// Google's Firebase servers. Every file that needs to talk
// to Firebase imports auth or db from this file.
// Without firebase.ts your app has no connection to Firebase
// and none of the authentication or database features work.
// ============================================================






