import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import auth from './slices/auth';
import deliveryReducer from './slices/delivery';
import homeReducer from './slices/homeSlice';
import orderCart from './slices/orderCart';
import preOrderReducer from './slices/preOrder';

// Persist config for auth slice only
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['isAuthenticated', 'user', 'phoneNumber', 'userId', 'pendingIntent'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, auth);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    orderCart,
    delivery: deliveryReducer,
    home: homeReducer,
    preOrder: preOrderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;