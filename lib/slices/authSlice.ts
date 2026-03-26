// Importing createSlice (to create a Redux slice) and PayloadAction (to type action payloads)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Defining the shape of the auth state using a TypeScript interface
interface AuthState {
  user: { uid: string; email: string | null } | null; // user is either an object with uid & email, or null (not logged in)
  loading: boolean;   // true while we wait to know if a user is logged in
  modalOpen: boolean; // controls whether the auth modal is open or closed
  isSubscribed: boolean;
}
//  ^ From ^
// Setting the initial values for the auth state when the app first loads
const initialState: AuthState = {
  user: null,       // no user logged in at start
  loading: true,    // assume loading until Firebase/auth check completes
  modalOpen: false, // modal is closed at start
  isSubscribed: false,
};

// createSlice bundles the name, initialState, and reducers into one slice object
const authSlice = createSlice({
  name: "auth", // this prefix is used in action types e.g. "auth/setUser"
  initialState, // the initial state defined above
  reducers: {

    // setUser is called when a user logs in
    // PayloadAction<AuthState["user"]> means the payload must match the "user" type (or null)
    setUser(state, action: PayloadAction<AuthState["user"]>) {
      state.user = action.payload; // set the user to whatever was passed in (uid + email)
      state.loading = false;       // auth check is done, stop loading
    },

    // clearUser is called when a user logs out
    clearUser(state) {
      state.user = null;     // wipe the user from state
      state.loading = false; // auth check is done, stop loading
      state.isSubscribed = false;
    },
    setSubscribed(state, action: PayloadAction<boolean>){
      state.isSubscribed = action.payload;

    },

    // openModal sets modalOpen to true → triggers the modal to show in the UI
    openModal(state) { state.modalOpen = true; },

    // closeModal sets modalOpen to false → triggers the modal to hide in the UI
    closeModal(state) { state.modalOpen = false; },
  },
});

// Exporting individual action creators so components can dispatch them
// ⚠️ Fix: added openModal and closeModal — they were missing from the original export
export const { setUser, clearUser, openModal, closeModal, setSubscribed } = authSlice.actions;

// Exporting the reducer to be registered in the Redux store
export default authSlice.reducer;