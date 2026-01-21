import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreMapper } from '../../application/mappers/StoreMapper';
import { GetStoresByProductUseCase } from '../../application/usecases/GetStoresByProductUseCase';
import { GetStoresUseCase } from '../../application/usecases/GetStoresUseCase';
import { storeRepository } from '../../infrastructure/repositories/StoreRepositoryImpl';

const getStoresUseCase = new GetStoresUseCase(storeRepository);
const getStoresByProductUseCase = new GetStoresByProductUseCase(storeRepository);

// Use the mapper's return type instead of duplicating the interface
type SerializableStore = ReturnType<typeof StoreMapper.toSerializableStore>;

interface StoresState {
  stores: SerializableStore[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  selectedStoreId: number | null;
}

const initialState: StoresState = {
  stores: [],
  loading: false,
  loadingMore: false,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasMore: true,
  selectedStoreId: null,
};

interface FetchStoresParams {
  page?: number;
  limit?: number;
  refresh?: boolean;
}

interface FetchStoresByProductParams {
  lat: number;
  lng: number;
  productId: number;
  page?: number;
  limit?: number;
  refresh?: boolean;
}

export const fetchStores = createAsyncThunk('stores/fetch', async (params: FetchStoresParams = {}) => {
  const result = await getStoresUseCase.execute({
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  });

  return {
    stores: result.stores.map(store => StoreMapper.toSerializableStore(store)),
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
    refresh: params.refresh ?? false,
  };
}
);

export const fetchStoresByProduct = createAsyncThunk('stores/fetchByProduct', async (params: FetchStoresByProductParams) => {
  const result = await getStoresByProductUseCase.execute({
    productId: params.productId,
    lat: params.lat,
    lng: params.lng,
    page: params.page,
    limit: params.limit ?? 10,
  });

  return {
    stores: result.stores.map(store => StoreMapper.toSerializableStore(store)),
    refresh: params.refresh ?? false,
  };
}
);

const storesSlice = createSlice({
  name: 'stores', initialState, reducers: {
    clearStoresError: state => {
      state.error = null;
    },
    selectStore: (state, action: PayloadAction<number>) => {
      state.selectedStoreId = action.payload;
    },
    clearSelectedStore: state => {
      state.selectedStoreId = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchStores.pending, (state, action) => {
        const isRefresh = action.meta.arg.refresh;
        if (isRefresh) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;

        if (action.payload.refresh) {
          state.stores = action.payload.stores;
        } else {
          state.stores = [...state.stores, ...action.payload.stores];
        }

        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.hasMore = action.payload.page < action.payload.totalPages;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.error.message || 'Không thể tải danh sách cửa hàng';
      })
      .addCase(fetchStoresByProduct.pending, (state, action) => {
        const isRefresh = action.meta.arg.refresh;
        if (isRefresh) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchStoresByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.stores = action.payload.stores;
      })
      .addCase(fetchStoresByProduct.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.error.message || 'Không thể tải cửa hàng';
      });
  },
});

export const { clearStoresError, selectStore, clearSelectedStore } =
  storesSlice.actions;
export default storesSlice.reducer;

// Selectors
export const selectStores = (state: { stores: StoresState }) => state.stores.stores;
export const selectLoading = (state: { stores: StoresState }) => state.stores.loading;
export const selectLoadingMore = (state: { stores: StoresState }) => state.stores.loadingMore;
export const selectError = (state: { stores: StoresState }) => state.stores.error;
export const selectPage = (state: { stores: StoresState }) => state.stores.page;
export const selectHasMore = (state: { stores: StoresState }) => state.stores.hasMore;
export const selectSelectedStoreId = (state: { stores: StoresState }) => state.stores.selectedStoreId;
