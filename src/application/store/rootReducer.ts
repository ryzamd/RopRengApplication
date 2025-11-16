/**
 * Root Reducer
 * Combines all Redux slices
 */

import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import storeReducer from './slices/storeSlice';
import uiReducer from './slices/uiSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  cart: cartReducer,
  order: orderReducer,
  store: storeReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
