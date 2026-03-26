//this file makes it simplier
//The reason these exist is so you never have to pass the 
// TypeScript types manually every time — instead of writing 
// useDispatch<AppDispatch>() and useSelector<RootState>() 
// in every single component, you just import useAppDispatch and 
// useAppSelector and TypeScript already knows your store's exact shape.
// ❌ without hooks.ts — verbose and repetitive in every component
// const dispatch = useDispatch<AppDispatch>();
// const user = useSelector<RootState, User>((state) => state.auth.user);

// ✅ with hooks.ts — clean and simple
// const dispatch = useAppDispatch();
// const user = useAppSelector((state) => state.auth.user);


// importing 3 things from the react-redux library:
// useDispatch — the built-in Redux hook that returns the dispatch function
// useSelector — the built-in Redux hook that reads state from the store
// TypedUseSelectorHook — a TypeScript type that makes useSelector aware of your state shape
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

// importing 2 TypeScript types from your store.ts file:
// RootState — the type of your entire Redux state { auth: { user, loading, modalOpen } }
// AppDispatch — the type of your store's dispatch function
// "import type" means these are only used for TypeScript type checking, not at runtime
import type { RootState, AppDispatch } from "./store";

// useAppDispatch — a custom hook that wraps the built-in useDispatch
// useDispatch<AppDispatch>() tells TypeScript that this dispatch function
// only accepts actions that exist in your store — it will show an error
// if you try to dispatch something that doesn't exist
// use this everywhere instead of plain useDispatch()
export const useAppDispatch = () => useDispatch<AppDispatch>();

// useAppSelector — a custom hook that wraps the built-in useSelector
// TypedUseSelectorHook<RootState> tells TypeScript the shape of your state
// so when you write state.auth.user you get autocomplete and type safety
// if you try to access state.something that doesn't exist TypeScript will error
// use this everywhere instead of plain useSelector()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ^^^^^^^^^^^
// TypeScript vs Javascript
// TypeScript
// typescriptexport const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// JavaScript (React)
// javascriptexport const useAppDispatch = () => useDispatch();
// export const useAppSelector = useSelector;