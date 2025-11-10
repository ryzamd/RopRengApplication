import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  phoneNumber: null,
  userId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ phoneNumber: string; userId: string }>) => {
      state.isAuthenticated = true;
      state.phoneNumber = action.payload.phoneNumber;
      state.userId = action.payload.userId;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.phoneNumber = null;
      state.userId = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;