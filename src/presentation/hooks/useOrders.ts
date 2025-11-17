/**
 * useOrders Hook
 * Custom hook for order operations
 */

import { useCallback, useEffect } from 'react';
import {
  clearCurrentOrder,
  clearOrderError,
  createOrder,
  CreateOrderInput,
  fetchOrders,
  refreshOrders,
  selectActiveOrders,
  selectCurrentOrder,
  selectOrders,
  selectOrdersCreating,
  selectOrdersLoading,
  selectPaymentUrl,
} from '../../application/store';
import { useAppDispatch, useAppSelector } from '../../application/store/hooks';
import { OrderStatus } from '../../domain/entities/order/OrderStatus';

export function useOrders() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const activeOrders = useAppSelector(selectActiveOrders);
  const currentOrder = useAppSelector(selectCurrentOrder);
  const paymentUrl = useAppSelector(selectPaymentUrl);
  const isLoading = useAppSelector(selectOrdersLoading);
  const isCreating = useAppSelector(selectOrdersCreating);

  // Create order
  const handleCreateOrder = useCallback(
    async (input: CreateOrderInput) => {
      const result = await dispatch(createOrder(input)).unwrap();
      return result;
    },
    [dispatch]
  );

  // Fetch orders
  const loadOrders = useCallback(
    async (status?: OrderStatus, forceRefresh?: boolean) => {
      await dispatch(fetchOrders({ status, forceRefresh })).unwrap();
    },
    [dispatch]
  );

  // Refresh orders
  const handleRefresh = useCallback(async () => {
    await dispatch(refreshOrders()).unwrap();
  }, [dispatch]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch(clearOrderError());
  }, [dispatch]);

  // Clear current order
  const clearCurrent = useCallback(() => {
    dispatch(clearCurrentOrder());
  }, [dispatch]);

  // Load orders on mount
  useEffect(() => {
    if (orders.length === 0) {
      loadOrders();
    }
  }, [loadOrders, orders.length]); // Only run once on mount

  // Get order by status
  const getOrdersByStatus = useCallback(
    (status: OrderStatus) => {
      return orders.filter((order) => order.toObject().status === status);
    },
    [orders]
  );

  return {
    // State
    orders,
    activeOrders,
    currentOrder,
    paymentUrl,
    isLoading,
    isCreating,

    // Actions
    createOrder: handleCreateOrder,
    loadOrders,
    refresh: handleRefresh,
    clearError,
    clearCurrentOrder: clearCurrent,

    // Utilities
    getOrdersByStatus,
  };
}
