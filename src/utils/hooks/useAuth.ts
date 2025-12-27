import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { registerUser, loginWithOtp, logoutUser, clearError, resetOtpFlow, setPendingIntent, clearPendingIntent, PendingIntent } from '../../state/slices/auth';

export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const sendOtp = useCallback(
    async (phone: string) => {
      const result = await dispatch(registerUser({ phone }));
      return !registerUser.rejected.match(result);
    },
    [dispatch]
  );

  const verifyOtp = useCallback(
    async (phone: string, otp: string) => {
      const result = await dispatch(loginWithOtp({ phone, otp }));
      return !loginWithOtp.rejected.match(result);
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetOtp = useCallback(() => {
    dispatch(resetOtpFlow());
  }, [dispatch]);

  const savePendingIntent = useCallback(
    (intent: PendingIntent) => {
      dispatch(setPendingIntent(intent));
    },
    [dispatch]
  );

  const removePendingIntent = useCallback(() => {
    dispatch(clearPendingIntent());
  }, [dispatch]);

  return {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: auth.user,
    phoneNumber: auth.phoneNumber,
    error: auth.error,
    otpSent: auth.otpSent,
    otpPhone: auth.otpPhone,
    pendingIntent: auth.pendingIntent,

    sendOtp,
    verifyOtp,
    logout,
    clearAuthError,
    resetOtp,
    savePendingIntent,
    removePendingIntent,
  };
}