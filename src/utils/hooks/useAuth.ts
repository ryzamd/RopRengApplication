import { useCallback } from 'react';
import { PendingAuthAction } from '../../domain/services/AuthActionService';
import { clearError, clearPendingAction, loginWithOtp, logoutUser, registerUser, resetOtpFlow, setPendingAction } from '../../state/slices/auth';
import { useAppDispatch, useAppSelector } from '../hooks';

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

  const savePendingAction = useCallback(
    (action: PendingAuthAction) => {
      dispatch(setPendingAction(action));
    },
    [dispatch]
  );

  const removePendingAction = useCallback(() => {
    dispatch(clearPendingAction());
  }, [dispatch]);

  return {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: auth.user,
    phoneNumber: auth.phoneNumber,
    error: auth.error,
    otpSent: auth.otpSent,
    otpPhone: auth.otpPhone,
    pendingAction: auth.pendingAction,

    sendOtp,
    verifyOtp,
    logout,
    clearAuthError,
    resetOtp,
    savePendingAction,
    removePendingAction,
  };
}