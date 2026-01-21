import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { AuthActionContext, AuthActionService, AuthActionType } from '../../domain/services/AuthActionService';
import { setPendingAction } from '../../state/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

export function useAuthGuard<TArgs extends any[]>(action: (...args: TArgs) => void, authActionType?: AuthActionType, authActionContextFactory?: (...args: TArgs) => AuthActionContext) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useCallback(
    (...args: TArgs) => {
      if (!isAuthenticated) {
        if (authActionType && authActionContextFactory) {
          const context = authActionContextFactory(...args);
          const pendingAction = AuthActionService.create(authActionType, context);
          dispatch(setPendingAction(pendingAction));
        }
        router.push('../(auth)/login');
      } else {
        action(...args);
      }
    },
    [isAuthenticated, router, dispatch, action, authActionType, authActionContextFactory]
  );
}