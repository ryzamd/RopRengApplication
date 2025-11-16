/**
 * Redux Store Configuration
 * Configures Redux store with persistence
 */

import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { rootReducer, RootState } from './rootReducer';
import { Logger } from '../../core/utils/Logger';

// Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'cart'], // Only persist auth and cart
  blacklist: ['ui'], // Don't persist UI state
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      // Add custom middleware for logging (development only)
      (storeAPI) => (next) => (action) => {
        if (__DEV__) {
          Logger.debug('Redux Action', {
            type: action.type,
            payload: action.payload,
          });
        }
        return next(action);
      }
    ),
  devTools: __DEV__,
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type AppDispatch = typeof store.dispatch;
export type { RootState };
