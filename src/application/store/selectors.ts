/**
 * Redux Selectors
 * Memoized selectors for derived state
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { OrderStatus } from '../../domain/entities/order/OrderStatus';

// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Product selectors
export const selectProducts = (state: RootState) => state.product.products;
export const selectCategories = (state: RootState) => state.product.categories;
export const selectSelectedCategory = (state: RootState) => state.product.selectedCategory;
export const selectSearchQuery = (state: RootState) => state.product.searchQuery;
export const selectProductsLoading = (state: RootState) => state.product.isLoading;
export const selectProductsRefreshing = (state: RootState) => state.product.isRefreshing;

// Filtered products by category or search
export const selectFilteredProducts = createSelector(
  [selectProducts, selectSelectedCategory, selectSearchQuery],
  (products, selectedCategory, searchQuery) => {
    let filtered = products;

    if (selectedCategory) {
      filtered = products.filter(
        (p) => p.toObject().categoryId === selectedCategory
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = products.filter((p) => {
        const product = p.toObject();
        return (
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }
);

// Cart selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartSubtotal = (state: RootState) => state.cart.subtotal;
export const selectCartDeliveryFee = (state: RootState) => state.cart.deliveryFee;
export const selectCartDiscount = (state: RootState) => state.cart.discount;
export const selectCartTotal = (state: RootState) => state.cart.total;

// Cart item count
export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.quantity, 0)
);

// Cart is empty
export const selectCartIsEmpty = createSelector(
  [selectCartItems],
  (items) => items.length === 0
);

// Order selectors
export const selectOrders = (state: RootState) => state.order.orders;
export const selectActiveOrders = (state: RootState) => state.order.activeOrders;
export const selectCurrentOrder = (state: RootState) => state.order.currentOrder;
export const selectPaymentUrl = (state: RootState) => state.order.paymentUrl;
export const selectOrdersLoading = (state: RootState) => state.order.isLoading;
export const selectOrdersCreating = (state: RootState) => state.order.isCreating;

// Orders by status
export const selectOrdersByStatus = (status: OrderStatus) =>
  createSelector([selectOrders], (orders) =>
    orders.filter((order) => order.toObject().status === status)
  );

// Store selectors
export const selectStores = (state: RootState) => state.store.stores;
export const selectSelectedStore = (state: RootState) => state.store.selectedStore;
export const selectUserLocation = (state: RootState) => state.store.userLocation;
export const selectStoresLoading = (state: RootState) => state.store.isLoading;

// UI selectors
export const selectActiveModal = (state: RootState) => state.ui.activeModal;
export const selectModalData = (state: RootState) => state.ui.modalData;
export const selectToasts = (state: RootState) => state.ui.toasts;
export const selectGlobalLoading = (state: RootState) => state.ui.globalLoading;
export const selectIsOnline = (state: RootState) => state.ui.isOnline;
export const selectBottomSheetVisible = (state: RootState) => state.ui.bottomSheetVisible;
export const selectBottomSheetContent = (state: RootState) => state.ui.bottomSheetContent;

// Combined selectors
export const selectCheckoutSummary = createSelector(
  [selectCartItems, selectCartSubtotal, selectCartDeliveryFee, selectCartDiscount, selectCartTotal],
  (items, subtotal, deliveryFee, discount, total) => ({
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    deliveryFee,
    discount,
    total,
  })
);
