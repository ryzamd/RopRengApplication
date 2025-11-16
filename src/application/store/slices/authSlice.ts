/**
 * Auth Slice
 * Redux slice for authentication state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../domain/entities/user/User';
import { SendOTPUseCase } from '../../usecases/auth/SendOTPUseCase';
import { VerifyOTPUseCase } from '../../usecases/auth/VerifyOTPUseCase';
import { LogoutUseCase } from '../../usecases/auth/LogoutUseCase';
import { GetCurrentUserUseCase } from '../../usecases/auth/GetCurrentUserUseCase';
import { ServiceContainer } from '../../../core/di/ServiceContainer';
import { TYPES } from '../../../core/di/types';

// State interface
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  otpExpiresAt: number | null;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
  otpSent: false,
  otpExpiresAt: null,
};

// Async thunks
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (phone: string, { rejectWithValue }) => {
    try {
      const useCase = new SendOTPUseCase();
      const result = await useCase.execute({ phone });
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (
    { phone, otp }: { phone: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const userRepository = ServiceContainer.getInstance().resolve(
        TYPES.UserRepository
      );
      const useCase = new VerifyOTPUseCase(userRepository);
      const result = await useCase.execute({ phone, otp });
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const userRepository = ServiceContainer.getInstance().resolve(
        TYPES.UserRepository
      );
      const useCase = new LogoutUseCase(userRepository);
      await useCase.execute();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const userRepository = ServiceContainer.getInstance().resolve(
        TYPES.UserRepository
      );
      const useCase = new GetCurrentUserUseCase(userRepository);
      const user = await useCase.execute();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearOTPSent(state) {
      state.otpSent = false;
      state.otpExpiresAt = null;
    },
  },
  extraReducers: (builder) => {
    // Send OTP
    builder.addCase(sendOTP.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(sendOTP.fulfilled, (state, action) => {
      state.isLoading = false;
      state.otpSent = true;
      state.otpExpiresAt = action.payload.expiresAt;
    });
    builder.addCase(sendOTP.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.otpSent = false;
    });

    // Verify OTP
    builder.addCase(verifyOTP.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyOTP.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.otpSent = false;
      state.otpExpiresAt = null;
    });
    builder.addCase(verifyOTP.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      return initialState; // Reset to initial state
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Check auth
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload;
      }
    });
  },
});

export const { clearError, clearOTPSent } = authSlice.actions;
export default authSlice.reducer;
