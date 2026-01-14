import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GetHomeMenuUseCase } from '../../application/usecases/GetHomeMenuUseCase';
import { GetVouchersUseCase } from '../../application/usecases/GetVouchersUseCase';
import { Product } from '../../domain/entities/Product';
import { Voucher } from '../../domain/entities/Voucher';
import { homeRepository } from '../../infrastructure/repositories/HomeRepositoryImpl';

const getHomeMenuUseCase = new GetHomeMenuUseCase(homeRepository);
const getVouchersUseCase = new GetVouchersUseCase(homeRepository);

interface SerializableProduct {
  id: string;
  menuItemId: number;
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  originalPrice?: number;
  badge?: 'NEW' | 'HOT';
  discount?: string;
  status: 'AVAILABLE' | 'OUT_OF_STOCK';
  hasDiscount: boolean;
  discountPercentage: number;
  formattedPrice: string;
  isAvailable: boolean;
}

interface SerializableVoucher {
  id: number;
  code: string;
  name: string;
  type: 'fixed' | 'percent';
  description: string | null;
  rules: { amount?: number; percent?: number };
  canCombine: boolean;
  startAt: string;
  endAt: string;
}

interface HomeState {
  storeId: number | null;
  menuId: number | null;
  products: SerializableProduct[];
  productsLoading: boolean;
  productsLoadingMore: boolean;
  productsError: string | null;
  currentPage: number;
  hasMore: boolean;
  vouchers: SerializableVoucher[];
  vouchersLoading: boolean;
  vouchersError: string | null;
}

interface FetchParams {
  lat: number;
  lng: number;
  limit?: number;
  page?: number;
}

const toSerializableProduct = (p: Product): SerializableProduct => ({
  id: p.id,
  menuItemId: p.menuItemId,
  productId: p.productId,
  name: p.name,
  price: p.price,
  imageUrl: p.imageUrl,
  categoryId: p.categoryId,
  originalPrice: p.originalPrice,
  badge: p.badge,
  discount: p.discount,
  status: p.status,
  hasDiscount: p.hasDiscount,
  discountPercentage: p.discountPercentage,
  formattedPrice: p.formattedPrice,
  isAvailable: p.isAvailable,
});

const toSerializableVoucher = (v: Voucher): SerializableVoucher => ({
  id: v.id,
  code: v.code,
  name: v.name,
  type: v.type,
  description: v.description,
  rules: v.rules,
  canCombine: v.canCombine,
  startAt: v.startAt.toISOString(),
  endAt: v.endAt.toISOString(),
});

// Async Thunks

/** Initial fetch - replaces products */
export const fetchHomeMenu = createAsyncThunk(
  'home/fetchMenu',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const result = await getHomeMenuUseCase.execute(params);
      const products = result.products.map(toSerializableProduct);
      return {
        storeId: result.storeId,
        menuId: result.menuId,
        products,
        page: params.page ?? 0,
        hasMore: products.length === (params.limit ?? 10),
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Không thể tải menu');
    }
  }
);

/** Load more - appends products */
export const fetchHomeMenuMore = createAsyncThunk(
  'home/fetchMenuMore',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const result = await getHomeMenuUseCase.execute(params);
      const products = result.products.map(toSerializableProduct);
      return {
        products,
        page: params.page ?? 0,
        hasMore: products.length === (params.limit ?? 10),
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Không thể tải thêm');
    }
  }
);

export const fetchVouchers = createAsyncThunk(
  'home/fetchVouchers',
  async (params: FetchParams, { rejectWithValue }) => {
    try {
      const result = await getVouchersUseCase.execute(params);
      return result.vouchers.map(toSerializableVoucher);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Không thể tải voucher');
    }
  }
);

// Initial state
const initialState: HomeState = {
  storeId: null,
  menuId: null,
  products: [],
  productsLoading: false,
  productsLoadingMore: false,
  productsError: null,
  currentPage: 0,
  hasMore: true,
  vouchers: [],
  vouchersLoading: false,
  vouchersError: null,
};

// Slice
const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearHomeError: (state) => {
      state.productsError = null;
      state.vouchersError = null;
    },
    resetHomeData: (state) => {
      state.products = [];
      state.currentPage = 0;
      state.hasMore = true;
      state.productsError = null;
    },
  },
  extraReducers: (builder) => {
    // Initial fetch
    builder
      .addCase(fetchHomeMenu.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(fetchHomeMenu.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.storeId = action.payload.storeId;
        state.menuId = action.payload.menuId;
        state.products = action.payload.products;
        state.currentPage = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchHomeMenu.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload as string;
      });

    // Load more
    builder
      .addCase(fetchHomeMenuMore.pending, (state) => {
        state.productsLoadingMore = true;
      })
      .addCase(fetchHomeMenuMore.fulfilled, (state, action) => {
        state.productsLoadingMore = false;
        // Append new products (avoid duplicates by id)
        const existingIds = new Set(state.products.map((p) => p.id));
        const newProducts = action.payload.products.filter((p) => !existingIds.has(p.id));
        state.products = [...state.products, ...newProducts];
        state.currentPage = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchHomeMenuMore.rejected, (state, action) => {
        state.productsLoadingMore = false;
        state.productsError = action.payload as string;
      });

    // Vouchers
    builder
      .addCase(fetchVouchers.pending, (state) => {
        state.vouchersLoading = true;
        state.vouchersError = null;
      })
      .addCase(fetchVouchers.fulfilled, (state, action) => {
        state.vouchersLoading = false;
        state.vouchers = action.payload;
      })
      .addCase(fetchVouchers.rejected, (state, action) => {
        state.vouchersLoading = false;
        state.vouchersError = action.payload as string;
      });
  },
});

export const { clearHomeError, resetHomeData } = homeSlice.actions;
export default homeSlice.reducer;

export const selectProducts = (state: { home: HomeState }) => state.home.products;
export const selectProductsLoading = (state: { home: HomeState }) => state.home.productsLoading;
export const selectProductsLoadingMore = (state: { home: HomeState }) => state.home.productsLoadingMore;
export const selectProductsError = (state: { home: HomeState }) => state.home.productsError;
export const selectCurrentPage = (state: { home: HomeState }) => state.home.currentPage;
export const selectHasMoreProducts = (state: { home: HomeState }) => state.home.hasMore;
export const selectVouchers = (state: { home: HomeState }) => state.home.vouchers;
export const selectVouchersLoading = (state: { home: HomeState }) => state.home.vouchersLoading;
export const selectStoreId = (state: { home: HomeState }) => state.home.storeId;