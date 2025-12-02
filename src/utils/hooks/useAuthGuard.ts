import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { PendingIntent, setPendingIntent } from '../../state/slices/auth';
import { useAppDispatch, useAppSelector } from '../hooks';

/**
 * useAuthGuard - Centralized auth protection hook
 *
 * Usage:
 * const handleAdd = useAuthGuard(() => dispatch(addToCart(product)), {
 *   intent: 'PURCHASE',
 *   context: { productId: product.id }
 * });
 */
export function useAuthGuard<T extends any[]>(action: (...args: T) => void, intent?: Omit<PendingIntent, 'expiresAt' | 'timestamp'>) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useCallback(
    (...args: T) => {
      if (!isAuthenticated) {
        // Save intent before redirecting to login
        if (intent) {
          dispatch(setPendingIntent({
            ...intent,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5min TTL
            timestamp: Date.now(),
          }));
        }
        router.push('/login');
      } else {
        action(...args);
      }
    },
    [isAuthenticated, router, dispatch, action, intent]
  );
}