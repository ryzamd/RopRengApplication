import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { PendingIntent, setPendingIntent } from '../../state/slices/auth';
import { useAppDispatch, useAppSelector } from '../hooks';

export function useAuthGuard<T extends any[]>(action: (...args: T) => void, intentFactory?: (...args: T) => Omit<PendingIntent, 'expiresAt' | 'timestamp'>) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useCallback(
    (...args: T) => {
      if (!isAuthenticated) {
        if (intentFactory) {
          const intent = intentFactory(...args);
          dispatch(setPendingIntent({
            ...intent,
            expiresAt: Date.now() + 5 * 60 * 1000,
            timestamp: Date.now(),
          }));
        }
        router.push('/login');
      } else {
        action(...args);
      }
    },
    [isAuthenticated, router, dispatch, action, intentFactory]
  );
}