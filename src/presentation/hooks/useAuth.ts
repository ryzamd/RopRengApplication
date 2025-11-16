/**
 * useAuth Hook
 * Custom hook for authentication operations
 */

import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../application/store/hooks';
import {
  sendOTP,
  verifyOTP,
  logout,
  checkAuth,
  clearError,
  clearOTPSent,
  selectAuth,
  selectIsAuthenticated,
  selectCurrentUser,
  selectAuthLoading,
  selectAuthError,
} from '../../application/store';
import { AuthService } from '../../application/services/AuthService';

export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  // Check auth status on mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Send OTP
  const handleSendOTP = useCallback(
    async (phone: string) => {
      // Validate phone number
      const validation = AuthService.validatePhoneNumber(phone);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const result = await dispatch(sendOTP(phone)).unwrap();
      return result;
    },
    [dispatch]
  );

  // Verify OTP
  const handleVerifyOTP = useCallback(
    async (phone: string, otp: string) => {
      // Validate OTP
      const validation = AuthService.validateOTP(otp);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const result = await dispatch(verifyOTP({ phone, otp })).unwrap();
      return result;
    },
    [dispatch]
  );

  // Logout
  const handleLogout = useCallback(async () => {
    await dispatch(logout()).unwrap();
  }, [dispatch]);

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear OTP sent flag
  const handleClearOTPSent = useCallback(() => {
    dispatch(clearOTPSent());
  }, [dispatch]);

  // Format phone number
  const formatPhone = useCallback((phone: string) => {
    return AuthService.formatPhoneNumber(phone);
  }, []);

  // Mask phone number
  const maskPhone = useCallback((phone: string) => {
    return AuthService.maskPhoneNumber(phone);
  }, []);

  return {
    // State
    isAuthenticated,
    user,
    isLoading,
    error,
    otpSent: auth.otpSent,
    otpExpiresAt: auth.otpExpiresAt,

    // Actions
    sendOTP: handleSendOTP,
    verifyOTP: handleVerifyOTP,
    logout: handleLogout,
    clearError: handleClearError,
    clearOTPSent: handleClearOTPSent,

    // Utilities
    formatPhone,
    maskPhone,
  };
}
