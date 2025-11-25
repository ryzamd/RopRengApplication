import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../data/mockProducts';
import { CartItem } from '../../presentation/screens/order/OrderInterfaces';

interface OrderCartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const initialState: OrderCartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const orderCartSlice = createSlice({
  name: 'orderCart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        item => item.product.id === action.payload.id
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
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, clearCart } = orderCartSlice.actions;
export default orderCartSlice.reducer;