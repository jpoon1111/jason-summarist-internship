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
import { auth } from "@/lib/firebase"; // auth is imported from local firebase config — the initialized Firebase app instance
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
        setError("");    // reset any previous error
        setLoading(true); // disable buttons while request is in progress

        try{
            const provider = new GoogleAuthProvider(); // GoogleAuthProvider imported from firebase/auth — creates Google provider instance
            await signInWithPopup(auth, provider); // signInWithPopup imported from firebase/auth — opens Google sign-in popup
            dispatch(closeModal()); // close the modal via Redux
            router.push("/for-you"); // redirect to /for-you after successful Google login
        } catch (err: any) {
            setError(getErrorMessage(err.code)); // display error message if Google login fails
        }

        setLoading(false); // re-enable buttons after request completes
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
                        Login with Google
                    </button>

                    {/* Divider — "or" separator between Google button and email/password form */}
                    <div className="flex items-center my-4">
                        <div className="flex-grow h-px bg-[#bac8ce]" />
                            <span className="mx-6 text-sm text-[#394547] font-medium">or</span>
                        <div className="flex-grow h-px bg-[#bac8ce]" />
                    </div>
                </>
            )}

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