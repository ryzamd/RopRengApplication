import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/auth';
import orderCart from './slices/orderCart';

export const store = configureStore({
  reducer: {
    auth,
    orderCart,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;