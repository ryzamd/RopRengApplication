/**
 * Store Slice
 * Redux slice for stores state
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Store } from '../../../domain/entities/store/Store';
import { GetNearbyStoresUseCase } from '../../usecases/store/GetNearbyStoresUseCase';
import { ServiceContainer } from '../../../core/di/ServiceContainer';
import { TYPES } from '../../../core/di/types';

// State interface
export interface StoreState {
  stores: Store[];
  selectedStore: Store | null;
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

// Initial state
const initialState: StoreState = {
  stores: [],
  selectedStore: null,
  userLocation: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
};

// Async thunks
export const fetchNearbyStores = createAsyncThunk(
  'store/fetchNearbyStores',
  async (
    {
      latitude,
      longitude,
      radiusKm = 10,
      forceRefresh,
    }: {
      latitude: number;
      longitude: number;
      radiusKm?: number;
      forceRefresh?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const storeRepository = ServiceContainer.getInstance().resolve(
        TYPES.StoreRepository
      );

      const useCase = new GetNearbyStoresUseCase(storeRepository);
      const result = await useCase.execute({
        latitude,
        longitude,
        radiusKm,
        forceRefresh,
      });

      return {
        stores: result.stores,
        userLocation: { latitude, longitude },
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshStores = createAsyncThunk(
  'store/refreshStores',
  async (
    {
      latitude,
      longitude,
      radiusKm = 10,
    }: {
      latitude: number;
      longitude: number;
      radiusKm?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const storeRepository = ServiceContainer.getInstance().resolve(
        TYPES.StoreRepository
      );

      const useCase = new GetNearbyStoresUseCase(storeRepository);
      const result = await useCase.execute({
        latitude,
        longitude,
        radiusKm,
        forceRefresh: true,
      });

      return result.stores;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setSelectedStore(state, action) {
      state.selectedStore = action.payload;
    },
    clearSelectedStore(state) {
      state.selectedStore = null;
    },
    setUserLocation(state, action) {
      state.userLocation = action.payload;
    },
    clearStoreError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch nearby stores
    builder.addCase(fetchNearbyStores.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchNearbyStores.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stores = action.payload.stores;
      state.userLocation = action.payload.userLocation;

      // Auto-select first store if none selected
      if (!state.selectedStore && action.payload.stores.length > 0) {
        state.selectedStore = action.payload.stores[0];
      }
    });
    builder.addCase(fetchNearbyStores.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Refresh stores
    builder.addCase(refreshStores.pending, (state) => {
      state.isRefreshing = true;
      state.error = null;
    });
    builder.addCase(refreshStores.fulfilled, (state, action) => {
      state.isRefreshing = false;
      state.stores = action.payload;
    });
    builder.addCase(refreshStores.rejected, (state, action) => {
      state.isRefreshing = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setSelectedStore,
  clearSelectedStore,
  setUserLocation,
  clearStoreError,
} = storeSlice.actions;

export default storeSlice.reducer;
