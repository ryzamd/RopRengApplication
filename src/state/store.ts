import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import auth from './slices/auth';
import orderCart from './slices/orderCart';
import locationReducer from './slices/location';
import preorderReducer from './slices/preorder';

// Persist config for auth slice only
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['isAuthenticated', 'phoneNumber', 'userId', 'pendingIntent'],
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['location', 'preorder'],
};

const rootReducer = combineReducers({
  location: locationReducer,
  preorder: preorderReducer,
});

const persistedAuthReducer = persistReducer(authPersistConfig, auth);
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    orderCart,
    persistedReducer,
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