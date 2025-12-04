// src/state/slices/orderCart.ts - REPLACE with updated logic
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { randomUUID } from 'expo-crypto';
import { Product } from '../../data/mockProducts';
import { Store } from '../../data/mockStores';
import { CartItem, CART_DEFAULTS } from '../../presentation/screens/order/OrderInterfaces';
import { logout } from './auth';

interface OrderCartState {
  selectedStore: Store | null;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const initialState: OrderCartState = {
  selectedStore: null,
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const SIZE_PRICE_ADJUSTMENTS = {
  small: -10000,
  medium: 0,
  large: 10000,
};

const calculateFinalPrice = (item: CartItem): number => {
  const sizeAdjust = SIZE_PRICE_ADJUSTMENTS[item.customizations.size];
  const toppingTotal = item.customizations.toppings.reduce((sum, t) => sum + t.price, 0);
  return (item.product.price + sizeAdjust + toppingTotal) * item.quantity;
};

const orderCartSlice = createSlice({
  name: 'orderCart',
  initialState,
  reducers: {
    setSelectedStore: (state, action: PayloadAction<Store>) => {
      const newStoreId = action.payload.id;
      const oldStoreId = state.selectedStore?.id;

      if (oldStoreId && oldStoreId !== newStoreId) {
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      }

      state.selectedStore = action.payload;
    },

    addToCart: (state, action: PayloadAction<Product>) => {
      const newItem: CartItem = {
        id: randomUUID(),
        product: action.payload,
        quantity: 1,
        customizations: { ...CART_DEFAULTS },
        finalPrice: 0,
      };
      newItem.finalPrice = calculateFinalPrice(newItem);
      
      state.items.push(newItem);
      state.totalItems += 1;
      state.totalPrice += newItem.finalPrice;
    },

    updateCartItem: (state, action: PayloadAction<CartItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        const oldPrice = state.items[index].finalPrice;
        const oldQty = state.items[index].quantity;
        
        const updated = { ...action.payload };
        updated.finalPrice = calculateFinalPrice(updated);
        
        state.items[index] = updated;
        state.totalItems += (updated.quantity - oldQty);
        state.totalPrice += (updated.finalPrice - oldPrice);
      }
    },

    removeCartItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;

      state.items = state.items.filter((i) => i.id !== action.payload);
      state.totalItems -= item.quantity;
      state.totalPrice -= item.finalPrice;
    },

    removeItem: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const item = state.items.find((i) => i.product.id === productId);
      if (!item) return;

      state.items = state.items.filter((i) => i.product.id !== productId);
      state.totalItems -= item.quantity;
      state.totalPrice -= item.finalPrice;
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },

    resetCart: (state) => {
      state.selectedStore = null;
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.selectedStore = null;
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    });
  },
});

export const {
  setSelectedStore,
  addToCart,
  updateCartItem,
  removeCartItem,
  removeItem,
  clearCart,
  resetCart,
} = orderCartSlice.actions;

export default orderCartSlice.reducer;