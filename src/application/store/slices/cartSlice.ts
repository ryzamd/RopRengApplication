/**
 * Cart Slice
 * Redux slice for shopping cart state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../../domain/entities/product/Product';
import { Price } from '../../../domain/entities/product/Price';

// Cart item interface
export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>;
  optionsPriceModifier: number; // Total price modifier from selected options
}

// State interface
export interface CartState {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

// Initial state
const initialState: CartState = {
  items: [],
  subtotal: 0,
  deliveryFee: 0,
  discount: 0,
  total: 0,
};

// Helper function to calculate totals
function calculateTotals(state: CartState) {
  // Calculate subtotal
  state.subtotal = state.items.reduce((sum, item) => {
    const basePrice = item.product.toObject().price.toValue();
    const itemPrice = basePrice + item.optionsPriceModifier;
    return sum + itemPrice * item.quantity;
  }, 0);

  // Calculate total
  state.total = state.subtotal + state.deliveryFee - state.discount;
}

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<{
        product: Product;
        quantity: number;
        selectedOptions?: Record<string, string>;
        optionsPriceModifier?: number;
      }>
    ) {
      const { product, quantity, selectedOptions, optionsPriceModifier = 0 } =
        action.payload;

      // Check if item already exists with same options
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedOptions) ===
            JSON.stringify(selectedOptions)
      );

      if (existingItemIndex >= 0) {
        // Update quantity
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        state.items.push({
          product,
          quantity,
          selectedOptions,
          optionsPriceModifier,
        });
      }

      calculateTotals(state);
    },

    updateCartItemQuantity(
      state,
      action: PayloadAction<{ index: number; quantity: number }>
    ) {
      const { index, quantity } = action.payload;

      if (quantity <= 0) {
        state.items.splice(index, 1);
      } else {
        state.items[index].quantity = quantity;
      }

      calculateTotals(state);
    },

    removeFromCart(state, action: PayloadAction<number>) {
      state.items.splice(action.payload, 1);
      calculateTotals(state);
    },

    clearCart(state) {
      state.items = [];
      state.subtotal = 0;
      state.deliveryFee = 0;
      state.discount = 0;
      state.total = 0;
    },

    setDeliveryFee(state, action: PayloadAction<number>) {
      state.deliveryFee = action.payload;
      calculateTotals(state);
    },

    setDiscount(state, action: PayloadAction<number>) {
      state.discount = action.payload;
      calculateTotals(state);
    },

    applyVoucher(state, action: PayloadAction<{ code: string; discount: number }>) {
      state.discount = action.payload.discount;
      calculateTotals(state);
    },
  },
});

export const {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  setDeliveryFee,
  setDiscount,
  applyVoucher,
} = cartSlice.actions;

export default cartSlice.reducer;
