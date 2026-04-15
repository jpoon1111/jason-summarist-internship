"use client"; // Marks this as a Client Component in Next.js — enables hooks and browser APIs

// React
import { useState } from "react"; // useState is imported from React — used to manage local component state

// Next.js
import Image from "next/image"; // Image is imported from Next.js — optimized image component (replaces <img>)
import { useRouter } from "next/navigation"; // useRouter is imported from Next.js — enables programmatic navigation

// Firebase (third-party)
import {
  signInWithEmailAndPassword,   // Firebase method — signs in a user with email + password
  createUserWithEmailAndPassword, // Firebase method — creates a new user with email + password
  signInAnonymously,             // Firebase method — signs in a user without credentials (guest)
  sendPasswordResetEmail,        // Firebase method — sends a password reset email to the user
  GoogleAuthProvider,            // Firebase class — creates a Google auth provider instance
  signInWithPopup,               // Firebase method — opens a popup to sign in with a provider (e.g. Google)
} from "firebase/auth"; // All of the above are imported from the firebase/auth package

// Local project files
import { auth } from "@/lib/firebase"; // auth is imported from local firebase config — the initialized Firebase app instance(because you have it set to getAuth in firebase you dont need to import auth and app to do it here)
import { useAppDispatch, useAppSelector } from "@/lib/hooks"; // typed Redux hooks imported from local hooks file
import { closeModal } from "@/lib/slices/authSlice"; // closeModal is a Redux action imported from local authSlice — sets modalOpen to false

type Mode = "login" | "register" | "forgot"; // TypeScript union type — defines the 3 possible form views

export default function AuthModal(){

    // dispatch is initialized here using useAppDispatch (imported from @/lib/hooks)
    // used throughout the component to send actions to the Redux store e.g. dispatch(closeModal())
    const dispatch = useAppDispatch();

    // modalOpen is read from Redux state using useAppSelector (imported from @/lib/hooks)
    // state.auth.modalOpen is a boolean — true means the modal should be visible
    const modalOpen = useAppSelector((state) => state.auth.modalOpen);

    // router is initialized here using useRouter (imported from next/navigation)
    // used to navigate the user after a successful auth action e.g. router.push("/for-you")
    const router = useRouter();

    // mode — defined here, default is "login"
    // controls which form view is rendered: "login" | "register" | "forgot"
    // setMode is called in: the "Forgot your password?" button and the "Don't have an account?" toggle button
    const [mode, setMode] = useState<Mode>("login");

    // email — defined here, default is ""
    // stores the value typed into the email input field
    // setEmail is called in: the email input's onChange handler
    const [email, setEmail] = useState("");

    // password — defined here, default is ""
    // stores the value typed into the password input field
    // setPassword is called in: the password input's onChange handler
    const [password, setPassword] = useState("");

    // error — defined here, default is ""
    // stores a Firebase error message to display to the user e.g. "Incorrect password."
    // setError is called in: handleSubmit, handleGuest, handleGoogle (catch blocks), and mode-switch buttons (reset to "")
    const [error, setError] = useState("");

    // success — defined here, default is ""
    // stores a success message e.g. "Password reset email sent!"
    // setSuccess is called in: handleSubmit (forgot mode) and at the start of handleSubmit (reset to "")
    const [success, setSuccess] = useState("");

    // loading — defined here, default is false
    // true while an async auth request is in progress
    // used to disable buttons and show "Loading..." text
    // setLoading is called in: handleSubmit, handleGuest, handleGoogle
    const [loading, setLoading] = useState(false);

    // Early return — if modalOpen (from Redux state) is false, render nothing
    // This unmounts the modal from the DOM entirely when it's closed
    if (!modalOpen) return null;

    // getErrorMessage — defined here inside the component
    // takes a Firebase error code string and returns a human-readable message
    // called in the catch blocks of: handleSubmit, handleGuest, handleGoogle
    function getErrorMessage(code: string) {
        switch (code) {
            case "auth/invalid-email":        return "Invalid email address.";
            case "auth/user-not-found":       return "User not found.";
            case "auth/wrong-password":       return "Incorrect password.";
            case "auth/email-already-in-use": return "Email already in use.";
            case "auth/invalid-credential":   return "Account doesn't exist. Please create an account"
            // if none of the above codes match, return this generic fallback
            default:                          return "Something went wrong. Please try again.";
        }
    }

    // handleSubmit — defined here, referenced on the Submit button's onClick
    // handles form submission for all 3 modes: "login", "register", "forgot"
    async function handleSubmit(){
        setError("");    // reset any previous error message
        setSuccess("");  // reset any previous success message
        setLoading(true); // disable buttons and show "Loading..." while request is in progress

        try {
            // if mode is "login" — calls signInWithEmailAndPassword (imported from firebase/auth)
            if (mode === "login") {
                await signInWithEmailAndPassword(auth, email, password);
            }
            // if mode is "register" — calls createUserWithEmailAndPassword (imported from firebase/auth)
            else if (mode === "register"){
                await createUserWithEmailAndPassword(auth, email, password);
            }
            // if mode is "forgot" — calls sendPasswordResetEmail (imported from firebase/auth)
            // sets success message, stops loading, and returns early (no redirect needed)
            else if (mode === "forgot"){
                await sendPasswordResetEmail(auth, email);
                setSuccess("Password reset email sent!"); // show green success message in UI
                setLoading(false);
                return; // exit early — no need to close modal or redirect
            }

            // if login or register succeeded — close the modal and redirect
            dispatch(closeModal()); // dispatches closeModal action (imported from @/lib/slices/authSlice) — sets modalOpen to false
            router.push("/for-you"); // navigates user to /for-you page using router (from next/navigation)

        } catch (err: any) {
            // if Firebase throws an error — pass the error code to getErrorMessage (defined above)
            // and store the result in error state to display in the UI
            setError(getErrorMessage(err.code));
            console.log(err.code);
        }

        setLoading(false); // re-enable buttons after request completes (success or failure)
    }

    // handleGuest — defined here, referenced on the "Login as a Guest" button's onClick
    // signs in anonymously using Firebase — no email or password needed
    async function handleGuest(){
        setError("");    // reset any previous error
        setLoading(true); // disable buttons while request is in progress

        try{
            await signInAnonymously(auth); // signInAnonymously imported from firebase/auth — logs in without credentials
            dispatch(closeModal()); // close the modal via Redux (closeModal imported from @/lib/slices/authSlice)
            router.push("/for-you"); // redirect to /for-you after successful guest login
        } catch (err: any) {
            setError(getErrorMessage(err.code)); // display error message if anonymous login fails
        }

        setLoading(false); // re-enable buttons after request completes
    }

    // handleGoogle — defined here, referenced on the "Login with Google" button's onClick
    // signs in using a Google popup via Firebase
    async function handleGoogle() {
        setError("");    // // 1. clear any previous errors,reset any previous error
        setLoading(true); // 2. disable buttons,disable buttons while request is in progress

        try{
            const provider = new GoogleAuthProvider(); // 3. create Google provider,GoogleAuthProvider imported from firebase/auth — creates Google provider instance
            await signInWithPopup(auth, provider); // 4. open Google popup — user picks account,signInWithPopup imported from firebase/auth — opens Google sign-in popup
            dispatch(closeModal()); // 5. login succeeded — close modal,close the modal via Redux
            router.push("/for-you"); // 6. redirect to for-you page,redirect to /for-you after successful Google login
        } catch (err: any) {
            setError(getErrorMessage(err.code)); // 7. if anything fails — show error,display error message if Google login fails
        }

        setLoading(false); //  8. re-enable buttons
    }

    return (
    // Dark semi-transparent overlay covering the full screen
    <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-[9999] w-full">

        {/* White modal box — centered, max width 400px */}
        <div className="auth__modal relative bg-white rounded-lg shadow-lg w-full max-w-[400px] z-[9999]">

        {/* Close button — top right corner
            onClick: dispatches closeModal() (imported from @/lib/slices/authSlice)
            which sets modalOpen to false in Redux, causing the if(!modalOpen) check above to return null */}
        <button
            onClick={() => dispatch(closeModal())}
            className="absolute top-3 right-3 flex cursor-pointer hover:opacity-50 transition-opacity"
        >
            {/* X icon SVG */}
            <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" height="28" width="28">
            <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor" />
            </svg>
        </button>

        <div className="px-8 pb-6">

            {/* Dynamic heading — changes based on current mode state (defined above)
                if mode === "login"    → shows "Log in to Summarist"
                if mode === "register" → shows "Sign up to Summarist"
                if mode === "forgot"  → shows "Reset your password" */}
            <h2 className="text-center text-xl font-bold text-[#032b41] mb-6">
            {mode === "login" && "Log in to Summarist"}
            {mode === "register" && "Sign up to Summarist"}
            {mode === "forgot" && "Reset your password"}
            </h2>

            {/* Guest + Google buttons — only rendered if mode === "login" (true by default)
                hidden when mode is "register" or "forgot" */}
            {mode === "login" && (
                <>
                    {/* Guest button
                        onClick: calls handleGuest (defined above) — signs in anonymously via Firebase
                        disabled: true when loading is true — prevents multiple clicks during request */}
                    <button
                        onClick={handleGuest}
                        disabled={loading}
                        className="relative flex items-center justify-center w-full h-10 bg-[#3a579d] hover:bg-[#25396b] text-white rounded font-medium mb-4 transition-colors disabled:opacity-65 disabled:cursor-not-allowed"
                    >
                        <figure className="absolute left-[2px] flex items-center justify-center w-9 h-9 rounded bg-transparent">
                            {/* Person/user icon SVG */}
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="24" width="24">
                                <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" />
                            </svg>
                        </figure>
                        Login as a Guest
                    </button>
            
                    {/* Divider — "or" separator between Guest and Google buttons */}
                    <div className="flex items-center my-4">
                        <div className="flex-grow h-px bg-[#bac8ce]" />
                            <span className="mx-6 text-sm text-[#394547] font-medium">or</span>
                        <div className="flex-grow h-px bg-[#bac8ce]" />
                    </div>
                </>
            )}
            {mode !== "forgot" && (
                    <>
                        {/* Google button
                            onClick: calls handleGoogle (defined above) — opens Google sign-in popup via Firebase
                            disabled: true when loading is true — prevents multiple clicks during request */}
                        <button
                            onClick={handleGoogle}
                            disabled={loading}
                            className="relative flex items-center justify-center w-full h-10 bg-[#4285f4] hover:bg-[#3367d6] text-white rounded font-medium mb-4 transition-colors disabled:opacity-65 disabled:cursor-not-allowed"
                        >
                            <figure className="absolute left-[2px] flex items-center justify-center w-9 h-9 rounded bg-white">
                                {/* Google logo — uses Next.js Image component (imported from next/image)
                                    width and height are numbers as required by Next.js Image */}
                                <Image src="/assets/google.png" alt="google" width={24} height={24} />
                            </figure>
                            {mode === "login" ? "Login with Google" : "Signup with Google" }
                        </button>

                        {/* Divider — "or" separator between Google button and email/password form */}
                        <div className="flex items-center my-4">
                            <div className="flex-grow h-px bg-[#bac8ce]" />
                                <span className="mx-6 text-sm text-[#394547] font-medium">or</span>
                            <div className="flex-grow h-px bg-[#bac8ce]" />
                        </div>
                    </>
                )
            }

            {/* Email / password form — always visible regardless of mode */}
            <div className="flex flex-col gap-4">

                {/* Email input — always visible
                    value: controlled by email state (defined above)
                    onChange: calls setEmail to update email state on every keystroke */}
                <input
                    className="h-10 border-2 border-[#bac8ce] focus:border-[#2bd97c] rounded px-3 text-[#394547] outline-none"
                    type="text"
                    placeholder="Email Address"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                />

                {/* Password input — hidden when mode === "forgot" (true check)
                    because resetting a password only requires an email
                    value: controlled by password state (defined above)
                    onChange: calls setPassword to update password state on every keystroke */}
                {mode !== "forgot" && (
                    <input
                        className="h-10 border-2 border-[#bac8ce] focus:border-[#2bd97c] rounded px-3 text-[#394547] outline-none"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                )}

                {/* Error message — only rendered if error state (defined above) is a non-empty string (truthy)
                    displays red text with the Firebase error message e.g. "Incorrect password." */}
                {error && <p className="text-[#f56c6c] text-sm">{error}</p>}

                {/* Success message — only rendered if success state (defined above) is a non-empty string (truthy)
                    displays green text e.g. "Password reset email sent!" */}
                {success && <p className="text-[#2bd97c] text-sm">{success}</p>}

                {/* Submit button
                    onClick: calls handleSubmit (defined above) — handles login, register, or forgot based on mode
                    disabled: true when loading is true — prevents multiple clicks during request
                    text changes dynamically based on:
                        if loading is true         → "Loading..."
                        if mode === "login"         → "Login"
                        if mode === "register"      → "Sign Up"
                        if mode === "forgot"        → "Send Reset Email" */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="h-10 bg-[#2bd97c] hover:bg-[#20ba68] text-[#032b41] rounded font-medium text-base transition-colors disabled:opacity-65 disabled:cursor-not-allowed"
                >
                    {loading ? "Loading..." : mode === "login" ? "Login" : mode === "register" ? "Sign Up" : "Send Reset Email"}
                </button>
            </div>
        </div>

        {/* Forgot password link — only rendered if mode === "login" (true by default)
            onClick: calls setMode("forgot") to switch to forgot view
                     and setError("") to clear any existing error message */}
        {mode === "login" && (
            <button
                onClick={() => { setMode("forgot"); setError(""); }}
                className="block text-center text-[#116be9] hover:text-[#124a98] font-light text-sm w-fit mx-auto mb-4 transition-colors"
            >
                Forgot your password?
            </button>
        )}

        {/* Toggle button — switches between login and register modes
            onClick: if mode === "login"    → setMode("register")
                     if mode !== "login"   → setMode("login")
                     also calls setError("") to clear any existing error
            text changes dynamically:
                if mode === "login"    → "Don't have an account?"
                if mode !== "login"   → "Already have an account?" */}
        <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="w-full h-10 text-center bg-[#f1f6f4] hover:bg-[#e1e9e8] text-[#116be9] rounded-b-lg font-light text-base transition-colors"
        >
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
        </button>

        </div>
    </div>
    )
}



// "use client"; // Marks this as a Client Component in Next.js
// // Required because this component uses hooks (useState, useAppDispatch etc.)
// // and browser APIs — these only work on the client, not the server


// // ============================================================
// // AUTHMODAL.TSX — FULL EXPLANATION
// // ============================================================
// // This is the login/register/forgot password modal component.
// // It reads modalOpen from Redux — if true it renders, if false it returns null.
// // It handles 3 Firebase auth flows: email login, Google login, guest login.
// // It also handles register and forgot password modes.
// // ============================================================


// // LINE 1 — importing useState from React
// // useState is used to manage local component state
// // (mode, email, password, error, success, loading)
// import { useState } from "react";

// // LINE 2 — importing Image from Next.js
// // Next.js Image component is an optimized replacement for <img>
// // It handles lazy loading, sizing, and performance automatically
// // Used here for the Google logo in the Google login button
// import Image from "next/image";

// // LINE 3 — importing useRouter from Next.js
// // useRouter gives you access to the router object
// // Used here to redirect the user after successful login
// // e.g. router.push("/for-you") navigates to the for-you page
// import { useRouter } from "next/navigation";

// // LINES 4-11 — importing Firebase auth methods
// // All of these come from the firebase/auth package
// import {
//   signInWithEmailAndPassword,    // signs in existing user with email + password
//   createUserWithEmailAndPassword, // creates a new user with email + password
//   signInAnonymously,             // signs in without any credentials (guest mode)
//   sendPasswordResetEmail,        // sends a password reset email to the given address
//   GoogleAuthProvider,            // creates an instance of the Google auth provider
//   signInWithPopup,               // opens a browser popup for third-party sign-in (Google)
// } from "firebase/auth";

// // LINE 12 — importing auth from your local firebase config
// // auth is the initialized Firebase Auth instance from lib/firebase.ts
// // It is passed as the first argument to all Firebase auth functions
// import { auth } from "@/lib/firebase";

// // LINE 13 — importing typed Redux hooks from local hooks file
// // useAppDispatch — lets you dispatch actions to the Redux store
// // useAppSelector — lets you read state from the Redux store
// import { useAppDispatch, useAppSelector } from "@/lib/hooks";

// // LINE 14 — importing closeModal action from authSlice
// // closeModal sets modalOpen to false in Redux state
// // which causes this component to return null and unmount
// import { closeModal } from "@/lib/slices/authSlice";

// // LINE 15 — TypeScript union type for the 3 form modes
// // "login"    — shows email/password login form + Google + Guest buttons
// // "register" — shows email/password register form only
// // "forgot"   — shows email-only form for password reset
// type Mode = "login" | "register" | "forgot";


// export default function AuthModal(){

//     // dispatch — initialized with useAppDispatch (from @/lib/hooks)
//     // used to send actions to the Redux store
//     // e.g. dispatch(closeModal()) — sets modalOpen to false
//     const dispatch = useAppDispatch();

//     // modalOpen — reads state.auth.modalOpen from Redux store
//     // true = render the modal, false = return null (hide the modal)
//     // this value changes when openModal() or closeModal() is dispatched
//     const modalOpen = useAppSelector((state) => state.auth.modalOpen);

//     // router — initialized with useRouter (from next/navigation)
//     // used after successful auth to redirect the user
//     // e.g. router.push("/for-you")
//     const router = useRouter();

//     // mode — local state, default is "login"
//     // controls which form view is shown: "login" | "register" | "forgot"
//     // changed by: "Forgot your password?" button and the toggle button at the bottom
//     const [mode, setMode] = useState<Mode>("login");

//     // email — local state, default is ""
//     // tracks the current value of the email input field
//     // updated on every keystroke via the input's onChange handler
//     const [email, setEmail] = useState("");

//     // password — local state, default is ""
//     // tracks the current value of the password input field
//     // updated on every keystroke via the input's onChange handler
//     const [password, setPassword] = useState("");

//     // error — local state, default is ""
//     // stores Firebase error messages to show to the user
//     // e.g. "Incorrect password." or "Email already in use."
//     // reset to "" whenever the user switches modes or starts a new request
//     const [error, setError] = useState("");

//     // success — local state, default is ""
//     // stores a success message to show to the user
//     // only used in forgot mode: "Password reset email sent!"
//     // reset to "" at the start of every handleSubmit call
//     const [success, setSuccess] = useState("");

//     // loading — local state, default is false
//     // true while an async Firebase request is in progress
//     // used to disable buttons and show "Loading..." text
//     // prevents the user from clicking multiple times during a request
//     const [loading, setLoading] = useState(false);

//     // EARLY RETURN — if modalOpen is false, render nothing
//     // this completely unmounts the modal from the DOM
//     // modalOpen comes from Redux state (read above with useAppSelector)
//     if (!modalOpen) return null;


//     // getErrorMessage — converts Firebase error codes to human-readable messages
//     // Firebase throws errors with codes like "auth/wrong-password"
//     // This function maps those codes to friendly strings for the UI
//     // Called in the catch blocks of handleSubmit, handleGuest, handleGoogle
//     function getErrorMessage(code: string) {
//         switch (code) {
//             case "auth/invalid-email":        return "Invalid email address.";
//             case "auth/user-not-found":       return "User not found.";
//             case "auth/wrong-password":       return "Incorrect password.";
//             case "auth/email-already-in-use": return "Email already in use.";
//             default:                          return "Something went wrong. Please try again.";
//         }
//     }


//     // handleSubmit — handles form submission for all 3 modes
//     // async because Firebase auth calls are asynchronous (return Promises)
//     // called when the Submit button is clicked
//     async function handleSubmit(){
//         setError("");     // clear any previous error message before starting
//         setSuccess("");   // clear any previous success message before starting
//         setLoading(true); // disable buttons and show "Loading..." text

//         try {
//             if (mode === "login") {
//                 // signInWithEmailAndPassword — Firebase method, signs in existing user
//                 // auth — the Firebase Auth instance from lib/firebase.ts
//                 // email, password — from local state defined above
//                 await signInWithEmailAndPassword(auth, email, password);
//             }
//             else if (mode === "register"){
//                 // createUserWithEmailAndPassword — Firebase method, creates new user
//                 await createUserWithEmailAndPassword(auth, email, password);
//             }
//             else if (mode === "forgot"){
//                 // sendPasswordResetEmail — Firebase method, sends reset email
//                 await sendPasswordResetEmail(auth, email);
//                 setSuccess("Password reset email sent!"); // show green success message
//                 setLoading(false);
//                 return; // exit early — no need to redirect for password reset
//             }

//             // if login or register succeeded:
//             dispatch(closeModal()); // dispatch closeModal — sets modalOpen to false, hides modal
//             router.push("/for-you"); // redirect user to /for-you page

//         } catch (err: any) {
//             // if Firebase throws an error, convert the code to a friendly message
//             setError(getErrorMessage(err.code));
//         }

//         setLoading(false); // re-enable buttons after the request finishes
//     }


//     // handleGuest — signs in anonymously (no email or password needed)
//     // async because signInAnonymously returns a Promise
//     // called when the "Login as a Guest" button is clicked
//     async function handleGuest(){
//         setError("");     // clear previous errors
//         setLoading(true); // disable buttons

//         try{
//             await signInAnonymously(auth); // Firebase method — logs in without credentials
//             dispatch(closeModal());        // hide the modal
//             router.push("/for-you");       // redirect to for-you page
//         } catch (err: any) {
//             setError(getErrorMessage(err.code)); // show error if guest login fails
//         }

//         setLoading(false); // re-enable buttons
//     }


//     // handleGoogle — signs in using a Google popup
//     // async because signInWithPopup returns a Promise
//     // called when the "Login with Google" button is clicked
//     async function handleGoogle() {
//         setError("");     // clear previous errors
//         setLoading(true); // disable buttons

//         try{
//             const provider = new GoogleAuthProvider(); // create Google provider instance
//             await signInWithPopup(auth, provider);     // open Google sign-in popup
//             dispatch(closeModal());                    // hide the modal
//             router.push("/for-you");                   // redirect to for-you page
//         } catch (err: any) {
//             setError(getErrorMessage(err.code)); // show error if Google login fails
//         }

//         setLoading(false); // re-enable buttons
//     }


//     return (
//     // OVERLAY — dark semi-transparent background covering the full screen
//     // fixed + inset-0 = covers entire viewport
//     // bg-black/75 = 75% opacity black background
//     // z-[9999] = sits on top of everything else
//     <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-[9999] w-full">

//         {/* MODAL BOX — white centered box, max width 400px */}
//         <div className="auth__modal relative bg-white rounded-lg shadow-lg w-full max-w-[400px] z-[9999]">

//         {/* CLOSE BUTTON — top right corner
//             onClick: dispatch(closeModal()) — sets modalOpen to false in Redux
//             which triggers the if(!modalOpen) check above to return null */}
//         <button
//             onClick={() => dispatch(closeModal())}
//             className="absolute top-3 right-3 flex cursor-pointer hover:opacity-50 transition-opacity"
//         >
//             {/* X icon SVG */}
//             <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" height="28" width="28">
//             <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor" />
//             </svg>
//         </button>

//         <div className="px-8 pb-6">

//             {/* HEADING — changes based on current mode state
//                 mode === "login"    → "Log in to Summarist"
//                 mode === "register" → "Sign up to Summarist"
//                 mode === "forgot"   → "Reset your password" */}
//             <h2 className="text-center text-xl font-bold text-[#032b41] mb-6">
//             {mode === "login" && "Log in to Summarist"}
//             {mode === "register" && "Sign up to Summarist"}
//             {mode === "forgot" && "Reset your password"}
//             </h2>

//             {/* GUEST + GOOGLE BUTTONS — only shown when mode === "login"
//                 hidden in register and forgot modes */}
//             {mode === "login" && (
//                 <>
//                     {/* GUEST BUTTON
//                         onClick: handleGuest — signs in anonymously via Firebase
//                         disabled: when loading is true — prevents double clicks */}
//                     <button
//                         onClick={handleGuest}
//                         disabled={loading}
//                         className="relative flex items-center justify-center w-full h-10 bg-[#3a579d] hover:bg-[#25396b] text-white rounded font-medium mb-4 transition-colors disabled:opacity-65 disabled:cursor-not-allowed"
//                     >
//                         <figure className="absolute left-[2px] flex items-center justify-center w-9 h-9 rounded bg-transparent">
//                             {/* Person icon SVG */}
//                             <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="24" width="24">
//                                 <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" />
//                             </svg>
//                         </figure>
//                         Login as a Guest
//                     </button>

//                     {/* OR DIVIDER */}
//                     <div className="flex items-center my-4">
//                         <div className="flex-grow h-px bg-[#bac8ce]" />
//                             <span className="mx-6 text-sm text-[#394547] font-medium">or</span>
//                         <div className="flex-grow h-px bg-[#bac8ce]" />
//                     </div>

//                     {/* GOOGLE BUTTON
//                         onClick: handleGoogle — opens Google sign-in popup via Firebase
//                         disabled: when loading is true — prevents double clicks */}
//                     <button
//                         onClick={handleGoogle}
//                         disabled={loading}
//                         className="relative flex items-center justify-center w-full h-10 bg-[#4285f4] hover:bg-[#3367d6] text-white rounded font-medium mb-4 transition-colors disabled:opacity-65 disabled:cursor-not-allowed"
//                     >
//                         <figure className="absolute left-[2px] flex items-center justify-center w-9 h-9 rounded bg-white">
//                             {/* Google logo — Next.js Image component (imported from next/image) */}
//                             <Image src="/assets/google.png" alt="google" width={24} height={24} />
//                         </figure>
//                         Login with Google
//                     </button>

//                     {/* OR DIVIDER */}
//                     <div className="flex items-center my-4">
//                         <div className="flex-grow h-px bg-[#bac8ce]" />
//                             <span className="mx-6 text-sm text-[#394547] font-medium">or</span>
//                         <div className="flex-grow h-px bg-[#bac8ce]" />
//                     </div>
//                 </>
//             )}

//             {/* FORM FIELDS — always visible regardless of mode */}
//             <div className="flex flex-col gap-4">

//                 {/* EMAIL INPUT — always visible
//                     value: controlled by email state
//                     onChange: updates email state on every keystroke */}
//                 <input
//                     className="h-10 border-2 border-[#bac8ce] focus:border-[#2bd97c] rounded px-3 text-[#394547] outline-none"
//                     type="text"
//                     placeholder="Email Address"
//                     value={email}
//                     onChange={(ev) => setEmail(ev.target.value)}
//                 />

//                 {/* PASSWORD INPUT — hidden when mode === "forgot"
//                     because resetting a password only needs an email address
//                     value: controlled by password state
//                     onChange: updates password state on every keystroke */}
//                 {mode !== "forgot" && (
//                     <input
//                         className="h-10 border-2 border-[#bac8ce] focus:border-[#2bd97c] rounded px-3 text-[#394547] outline-none"
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                 )}

//                 {/* ERROR MESSAGE — only shown if error state is a non-empty string
//                     displays red text with the Firebase error e.g. "Incorrect password." */}
//                 {error && <p className="text-[#f56c6c] text-sm">{error}</p>}

//                 {/* SUCCESS MESSAGE — only shown if success state is a non-empty string
//                     displays green text e.g. "Password reset email sent!" */}
//                 {success && <p className="text-[#2bd97c] text-sm">{success}</p>}

//                 {/* SUBMIT BUTTON
//                     onClick: handleSubmit — handles login, register, or forgot based on mode
//                     disabled: when loading is true — prevents double clicks
//                     text changes dynamically:
//                       loading = true      → "Loading..."
//                       mode = "login"      → "Login"
//                       mode = "register"   → "Sign Up"
//                       mode = "forgot"     → "Send Reset Email" */}
//                 <button
//                     onClick={handleSubmit}
//                     disabled={loading}
//                     className="h-10 bg-[#2bd97c] hover:bg-[#20ba68] text-[#032b41] rounded font-medium text-base transition-colors disabled:opacity-65 disabled:cursor-not-allowed"
//                 >
//                     {loading ? "Loading..." : mode === "login" ? "Login" : mode === "register" ? "Sign Up" : "Send Reset Email"}
//                 </button>
//             </div>
//         </div>

//         {/* FORGOT PASSWORD LINK — only shown when mode === "login"
//             onClick: setMode("forgot") — switches to forgot view
//                      setError("") — clears any existing error */}
//         {mode === "login" && (
//             <button
//                 onClick={() => { setMode("forgot"); setError(""); }}
//                 className="block text-center text-[#116be9] hover:text-[#124a98] font-light text-sm w-fit mx-auto mb-4 transition-colors"
//             >
//                 Forgot your password?
//             </button>
//         )}

//         {/* TOGGLE BUTTON — switches between login and register
//             onClick: if mode === "login"  → setMode("register")
//                      if mode !== "login" → setMode("login")
//                      also clears any error message
//             text changes:
//               mode = "login"    → "Don't have an account?"
//               mode != "login"  → "Already have an account?" */}
//         <button
//             onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
//             className="w-full h-10 text-center bg-[#f1f6f4] hover:bg-[#e1e9e8] text-[#116be9] rounded-b-lg font-light text-base transition-colors"
//         >
//             {mode === "login" ? "Don't have an account?" : "Already have an account?"}
//         </button>

//         </div>
//     </div>
//     )
// }