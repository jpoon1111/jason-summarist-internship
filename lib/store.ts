// ============================================================
// STORE.TS — FULL EXPLANATION
// ============================================================
// This file creates the single global Redux store for your app.
// Think of the store as one big JavaScript object that holds
// ALL of your app's state in one place.
// Every component can read from it or send actions to update it.
// ============================================================


// LINE 1 — importing configureStore from Redux Toolkit
// configureStore is a function that creates your Redux store
// It automatically sets up:
//   - Redux DevTools (so you can inspect state in the browser)
//   - Thunk middleware (so you can do async actions later)
// Without this import you cannot create a store
import { configureStore } from "@reduxjs/toolkit";


// LINE 2 — importing your authReducer from the authSlice file
// A reducer is a function that decides HOW state changes
// when an action is dispatched (e.g. setUser, openModal)
// authReducer handles all auth-related state changes
// The path "./slices/authSlice" points to lib/slices/authSlice.ts
import authReducer from "./slices/authSlice";


// LINE 3 — creating the store and exporting it
// configureStore takes a config object with a "reducer" key
// The reducer key maps slice names to their reducer functions
// "export" makes the store importable in other files
// e.g. ReduxProvider.tsx imports it to give the whole app access
export const store = configureStore({

    // LINE 4 — the reducer object
    // Each key here becomes a "namespace" in your global state
    // You can have multiple slices: auth, cart, theme, etc.
    reducer: {

        // LINE 5 — registering authReducer under the key "auth"
        // This means your global state shape will look like:
        // {
        //   auth: {
        //     user: null,
        //     loading: true,
        //     modalOpen: false
        //   }
        // }
        // The key name "auth" is what you reference in useAppSelector
        // e.g. state.auth.user    ← reads the user
        // e.g. state.auth.modalOpen  ← reads if modal is open
        auth: authReducer,

    },
});
// store is now created — it holds all state and can receive actions


// LINE 6 — creating and exporting the RootState type
// RootState is a TypeScript type that represents the full shape
// of your Redux state at any point in time
//
// ReturnType<...> is a TypeScript utility that extracts
// the return type of a function
//
// store.getState is the built-in Redux function that returns
// the current state — so ReturnType<typeof store.getState>
// gives you the TypeScript type of that state
//
// Result: RootState = { auth: { user, loading, modalOpen } }
//
// This is used in useAppSelector so TypeScript knows what
// state is available and can give you autocomplete + errors
// e.g. in hooks.ts: TypedUseSelectorHook<RootState>
export type RootState = ReturnType<typeof store.getState>;


// LINE 7 — creating and exporting the AppDispatch type
// AppDispatch is a TypeScript type for the dispatch function
//
// store.dispatch is the built-in Redux function used to
// send actions to the store e.g. dispatch(openModal())
//
// typeof extracts the TypeScript type of store.dispatch
//
// This is used in useAppDispatch so TypeScript knows
// which actions are valid to dispatch — it will show
// an error if you try to dispatch something that doesn't exist
//
// e.g. in hooks.ts: useDispatch<AppDispatch>()
export type AppDispatch = typeof store.dispatch;


// ============================================================
// HOW IT ALL CONNECTS:
// ============================================================
//
// store.ts                 ← YOU ARE HERE — creates the store
//      ↓
// ReduxProvider.tsx        ← wraps the app with <Provider store={store}>
//      ↓
// hooks.ts                 ← useAppDispatch and useAppSelector use
//                             AppDispatch and RootState from here
//      ↓
// Any component            ← uses useAppSelector(state => state.auth.user)
//                             or useAppDispatch() to dispatch actions
//      ↓
// authSlice.ts             ← reducer handles the action, updates state
//      ↓
// Component re-renders     ← because state changed
// ============================================================