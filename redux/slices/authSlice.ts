import { AdminProps } from "@/lib/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: AdminProps | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadUser(state, action: PayloadAction<AdminProps>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
    },
    loginSuccess(state, action: PayloadAction<AdminProps>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { loadUser, loginSuccess, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
