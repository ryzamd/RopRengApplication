import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PendingIntent {
  intent: 'PURCHASE' | 'VIEW_STORE' | 'CLAIM_PROMO' | 'BROWSE_CATEGORY' | 'VIEW_COLLECTION';
  context: {
    productId?: string;
    storeId?: string;
    promoCode?: string;
    categoryId?: string;
    collectionId?: string;
    returnTo?: string; // Route to return after action
  };
  expiresAt: number;
  timestamp: number;
}

interface AuthState {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  userId: string | null;
  pendingIntent: PendingIntent | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  phoneNumber: null,
  userId: null,
  pendingIntent: null,
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
      state.pendingIntent = null;
    },
    setPendingIntent: (state, action: PayloadAction<PendingIntent>) => {
      state.pendingIntent = action.payload;
    },
    clearPendingIntent: (state) => {
      state.pendingIntent = null;
    },
  },
});

export const { login, logout, setPendingIntent, clearPendingIntent } = authSlice.actions;
export default authSlice.reducer;