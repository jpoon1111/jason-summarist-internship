// lib/slices/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: { uid: string; email: string | null } | null;
  loading: boolean;
  modalOpen: boolean;  // ← add this
}

const initialState: AuthState = {
  user: null,
  loading: true,
  modalOpen: false,  // ← add this
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthState["user"]>) {
      state.user = action.payload;
      state.loading = false;
    },
    clearUser(state) {
      state.user = null;
      state.loading = false;
    },
    openModal(state) { state.modalOpen = true; },
    closeModal(state) { state.modalOpen = false; },
  },
});

export const { setUser, clearUser, openModal, closeModal } = authSlice.actions;
export default authSlice.reducer;