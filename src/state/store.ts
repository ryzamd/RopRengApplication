import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import auth from './slices/auth';
import orderCart from './slices/orderCart';

// Persist config for auth slice only
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['isAuthenticated', 'phoneNumber', 'userId', 'pendingIntent'], // Persist these fields
};

const persistedAuthReducer = persistReducer(authPersistConfig, auth);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    orderCart,
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