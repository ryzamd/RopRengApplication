import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../data/mockProducts';
import { Store } from '../../data/mockStores';
import { CartItem } from '../../presentation/screens/order/OrderInterfaces';

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

const orderCartSlice = createSlice({
  name: 'orderCart',
  initialState,
  reducers: {
    setSelectedStore: (state, action: PayloadAction<Store>) => {
      const newStoreId = action.payload.id;
      const oldStoreId = state.selectedStore?.id;

      if (oldStoreId && oldStoreId !== newStoreId) {
        console.log(`[OrderCart] Switching store: ${oldStoreId} → ${newStoreId}, clearing cart`);
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
      }

      state.selectedStore = action.payload;
    },

    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          product: action.payload,
          quantity: 1,
        });
      }

      state.totalItems += 1;
      state.totalPrice += action.payload.price;
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.product.id === productId);

      if (!item) return;

      const oldQuantity = item.quantity;
      const diff = quantity - oldQuantity;

      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.product.id !== productId);
        state.totalItems -= oldQuantity;
        state.totalPrice -= item.product.price * oldQuantity;
      } else {
        item.quantity = quantity;
        state.totalItems += diff;
        state.totalPrice += item.product.price * diff;
      }
    },

    removeItem: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const item = state.items.find((i) => i.product.id === productId);

      if (!item) return;

      state.items = state.items.filter((i) => i.product.id !== productId);
      state.totalItems -= item.quantity;
      state.totalPrice -= item.product.price * item.quantity;
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
});

export const {
  setSelectedStore,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
  resetCart,
} = orderCartSlice.actions;

export default orderCartSlice.reducer;