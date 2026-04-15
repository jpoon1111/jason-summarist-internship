/// this is your Redux Provider

"use client";

// ============================================================
// WHAT THIS FILE DOES:
// ============================================================
// ReduxProvider wraps the entire app with the Redux store
// so every component can read state and dispatch actions.
// It also contains AuthListener which connects Firebase auth
// to Redux — keeping user state in sync across the whole app.
// ============================================================
// Provider — imported from react-redux
// This is the component that makes the Redux store available
// to every child component via React context
// Without Provider, useAppSelector and useAppDispatch would throw errors
import { Provider } from "react-redux";
// store — imported from your local store.ts
// This is the configured Redux store that holds all your app state
// { auth: { user, loading, modalOpen } }
// It is passed to Provider so every component can access it
import { store } from "@/lib/store";

// useEffect — imported from React
// Used in AuthListener to run the Firebase listener once on mount
// without useEffect the listener would run on every render
import { useEffect } from "react";

// onAuthStateChanged — imported from firebase/auth
// This is a Firebase method that listens for auth state changes
// It fires automatically when:
//   - the app first loads and checks if user was already logged in
//   - or when a user logs in
//   - or when a user logs out
import { onAuthStateChanged } from "firebase/auth"; 

// auth — imported from your local firebase.ts
// This is the initialized Firebase Auth instance
// It is passed to onAuthStateChanged so Firebase knows
// which app to listen to
import { auth } from '@/lib/firebase';

// setUser, clearUser — imported from authSlice.ts
// setUser — dispatched when Firebase detects a logged in user
//           sets user to { uid, email } in Redux state
// clearUser — dispatched when Firebase detects no user
//             sets user to null in Redux state
import { setUser, clearUser, setSubscribed, setSubscription } from '@/lib/slices/authSlice'

// ============================================================
// AuthListener Component — a separate component that lives inside Provider
// It is separate from ReduxProvider because:
//   - it needs access to the store via Provider
//   - if it were outside Provider it could not dispatch actions
//   - keeping it separate makes the code cleaner and easier to read
// ============================================================
function AuthListener ({children}: {children: React.ReactNode}) {
  
  useEffect(() => {
    // onAuthStateChanged sets up a real-time listener
    // Firebase calls this function automatically whenever auth state changes
    // firebaseUser is either a Firebase User object or null
    const unsubscribe = onAuthStateChanged(auth, 
      async (firebaseUser) => {    
        if (firebaseUser) {
          //Get subscription data from Firestore
          const {db: FireStore} = await import ('@/lib/firebase');

          // firebaseUser exists — someone is logged in
          // dispatch setUser to update Redux state with their uid and email
          // this makes user !== null so handleProtectedAction will navigate instead of opening modal
          store.dispatch( setUser({uid: firebaseUser.uid, email: firebaseUser.email}) );

          //this checks firestore for subscription status
          const { db } = await import("@/lib/firebase");
          const { doc, getDoc } = await import("firebase/firestore");

          const userDoc = await getDoc( doc(db, "users", firebaseUser.uid) );
          
          if ( userDoc.exists() ) {   
              const data = userDoc.data();
              store.dispatch(setUser({uid: firebaseUser.uid, email:firebaseUser.email}));
              store.dispatch(setSubscribed(data.isSubscribed ?? false));              
              
              //if user's subscription is true 
              if (data.subscription) {
                // then set subscription
                store.dispatch(setSubscription(
                  {
                    plan:      data.subscription.plan || 'none',
                    startDate: data.subscription.startDate || null,
                    endDate:   data.subscription.endDate || null,
                    status:    data.subscription.status || 'none',
                  }
                ))
              } else {
                // create new user document in firestore
                // reason why " import {setDoc } from 'firebase/firestore' "  isn't imported at the top is because of heavy payload
                //    {payload is when everything needs to be loaded at once before user 
                //      sees anything to reduce this payload you
                //      want to only load this when user logs in }
                const { setDoc } = await import('firebase/firestore');
                
                try {      
                  await setDoc( doc(db, 'users', firebaseUser.uid), 
                      {
                        uid:firebaseUser.uid,
                        email: firebaseUser.email,
                        isSubscribed: false, 
                        subscription: {
                          plan: 'none',
                          startDate: null, 
                          endDate: null,
                          status: 'none',
                        },
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      }
                    );
                } catch(error){
                  store.dispatch(setSubscribed(false));
                  console.log("Error creating user document:", error)
                }
            
            }
          }
        } else {
        // firebaseUser is null — nobody is logged in
        // dispatch clearUser to set user back to null in Redux state
        // this makes !user = true so handleProtectedAction will open the modal
        store.dispatch(clearUser());
        }
      }
    );

    // cleanup function — returned from useEffect
    // unsubscribe() stops the Firebase listener when the component unmounts
    // without this the listener would keep running even after the component is gone
    // causing memory leaks

    return ()=> unsubscribe();
        // It fires in 4 situations:
        // ```
        // 1. App first loads    → checks if user was already logged in (e.g. from previous session)
        // 2. User logs in       → firebaseUser = { uid, email } → setUser
        // 3. User logs out      → firebaseUser = null → clearUser
        // 4. Page refreshes     → checks again → setUser or clearUser depending on session
        
  }, []);// runs once when app first loads
  
  // renders children unchanged — AuthListener is just a listener wrapper
  // it does not add any UI to the page
  return <>{children}</>
}



// ============================================================
// HOW PROVIDER AND STORE INTERACT: 
// ============================================================
//
// 1. store is created in store.ts with configureStore
//    → holds { auth: { user: null, loading: true, modalOpen: false } }
//
// 2. store is passed to <Provider store={store}>
//    → Provider puts the store into React context
//    → every child component can now access it
//
// 3. AuthListener runs onAuthStateChanged inside useEffect
//    → Firebase checks if a user is already logged in
//    → if yes: store.dispatch(setUser(...)) → user = { uid, email }
//    → if no:  store.dispatch(clearUser()) → user = null
//
// 4. Any component using useAppSelector reads from the store
//    → state.auth.user → gets the current user value
//    → state.auth.modalOpen → gets whether modal is open
//
// 5. Any component using useAppDispatch sends actions to the store
//    → dispatch(openModal()) → store updates → AuthModal re-renders
//    → dispatch(setUser(...)) → store updates → any component reading user re-renders
//
// ============================================================
// FLOW WHEN USER LOGS IN:
// ============================================================
//
// User submits login form in AuthModal
//      ↓
// Firebase authenticates the user
//      ↓
// onAuthStateChanged fires with firebaseUser object
//      ↓
// store.dispatch(setUser({ uid, email }))
//      ↓
// Redux state updates: user = { uid, email }
//      ↓
// useAppSelector in BookDetailPage gets new user value
//      ↓
// !user = false → clicking Read/Listen now navigates instead of opening modal
//
// ============================================================
// WHEN USER LOGS OUT:
// ============================================================
//
// User logs out
//      ↓
// onAuthStateChanged fires with null
//      ↓
// store.dispatch(clearUser())
//      ↓
// Redux state updates: user = null
//      ↓
// !user = true → clicking Read/Listen opens modal again
// ============================================================


export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    // Provider — makes the Redux store available to all children
    // store={store} — passes your configured store to the Provider
    
    <Provider store={store}>
      
      {/* AuthListener — listens for Firebase auth changes
          and keeps Redux user state in sync
          must be inside Provider so it can dispatch actions to the store */}
     
      <AuthListener>
        {children}
      </AuthListener>
    </Provider>

  );
}