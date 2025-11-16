/**
 * useCart Hook
 * Custom hook for shopping cart operations
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../application/store/hooks';
import {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  setDeliveryFee,
  setDiscount,
  applyVoucher,
  selectCartItems,
  selectCartSubtotal,
  selectCartDeliveryFee,
  selectCartDiscount,
  selectCartTotal,
  selectCartItemCount,
  selectCartIsEmpty,
  selectCheckoutSummary,
} from '../../application/store';
import { Product } from '../../domain/entities/product/Product';
import { CartService } from '../../application/services/CartService';

export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const deliveryFee = useAppSelector(selectCartDeliveryFee);
  const discount = useAppSelector(selectCartDiscount);
  const total = useAppSelector(selectCartTotal);
  const itemCount = useAppSelector(selectCartItemCount);
  const isEmpty = useAppSelector(selectCartIsEmpty);
  const checkoutSummary = useAppSelector(selectCheckoutSummary);

  // Add item to cart
  const handleAddToCart = useCallback(
    (
      product: Product,
      quantity: number = 1,
      selectedOptions?: Record<string, string>,
      optionsPriceModifier?: number
    ) => {
      dispatch(
        addToCart({
          product,
          quantity,
          selectedOptions,
          optionsPriceModifier,
        })
      );
    },
    [dispatch]
  );

  // Update item quantity
  const updateQuantity = useCallback(
    (index: number, quantity: number) => {
      dispatch(updateCartItemQuantity({ index, quantity }));
    },
    [dispatch]
  );

  // Increment item quantity
  const incrementQuantity = useCallback(
    (index: number) => {
      const currentQuantity = items[index]?.quantity || 0;
      updateQuantity(index, currentQuantity + 1);
    },
    [items, updateQuantity]
  );

  // Decrement item quantity
  const decrementQuantity = useCallback(
    (index: number) => {
      const currentQuantity = items[index]?.quantity || 0;
      if (currentQuantity > 1) {
        updateQuantity(index, currentQuantity - 1);
      } else {
        dispatch(removeFromCart(index));
      }
    },
    [items, updateQuantity, dispatch]
  );

  // Remove item from cart
  const removeItem = useCallback(
    (index: number) => {
      dispatch(removeFromCart(index));
    },
    [dispatch]
  );

  // Clear cart
  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  // Set delivery fee
  const handleSetDeliveryFee = useCallback(
    (fee: number) => {
      dispatch(setDeliveryFee(fee));
    },
    [dispatch]
  );

  // Set discount
  const handleSetDiscount = useCallback(
    (discountAmount: number) => {
      dispatch(setDiscount(discountAmount));
    },
    [dispatch]
  );

  // Apply voucher
  const handleApplyVoucher = useCallback(
    (code: string, discountAmount: number) => {
      dispatch(applyVoucher({ code, discount: discountAmount }));
    },
    [dispatch]
  );

  // Validate cart
  const validateCart = useCallback(() => {
    return CartService.validateCart(items);
  }, [items]);

  // Format price
  const formatPrice = useCallback((price: number) => {
    return CartService.formatPrice(price);
  }, []);

  // Calculate delivery fee by distance
  const calculateDeliveryFee = useCallback((distanceKm: number) => {
    const fee = CartService.calculateDeliveryFee(distanceKm);
    handleSetDeliveryFee(fee);
    return fee;
  }, [handleSetDeliveryFee]);

  return {
    // State
    items,
    subtotal,
    deliveryFee,
    discount,
    total,
    itemCount,
    isEmpty,
    checkoutSummary,

    // Actions
    addToCart: handleAddToCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart: handleClearCart,
    setDeliveryFee: handleSetDeliveryFee,
    setDiscount: handleSetDiscount,
    applyVoucher: handleApplyVoucher,

    // Utilities
    validateCart,
    formatPrice,
    calculateDeliveryFee,
  };
}
