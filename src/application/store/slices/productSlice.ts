/**
 * Product Slice
 * Redux slice for products and categories state
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../../../domain/entities/product/Product';
import { Category } from '../../../domain/entities/product/Category';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { GetProductsUseCase } from '../../usecases/product/GetProductsUseCase';
import { GetCategoriesUseCase } from '../../usecases/product/GetCategoriesUseCase';
import { ServiceContainer } from '../../../core/di/ServiceContainer';
import { TYPES } from '../../../core/di/types';

// State interface
export interface ProductState {
  products: Product[];
  categories: Category[];
  selectedCategory: string | null;
  searchQuery: string;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}

// Initial state
const initialState: ProductState = {
  products: [],
  categories: [],
  selectedCategory: null,
  searchQuery: '',
  isLoading: false,
  isRefreshing: false,
  error: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (
    {
      categoryId,
      search,
      forceRefresh,
    }: {
      categoryId?: string;
      search?: string;
      forceRefresh?: boolean;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const productRepository = ServiceContainer.getInstance().resolve<IProductRepository>(
        TYPES.ProductRepository
      );
      const useCase = new GetProductsUseCase(productRepository);
      const result = await useCase.execute({
        categoryId,
        search,
        forceRefresh,
      });
      return result.products;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'product/fetchCategories',
  async (forceRefresh: boolean = false, { rejectWithValue }) => {
    try {
      const categoryRepository = ServiceContainer.getInstance().resolve<ICategoryRepository>(
        TYPES.CategoryRepository
      );
      const useCase = new GetCategoriesUseCase(categoryRepository);
      const result = await useCase.execute(forceRefresh);
      return result.categories;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshProducts = createAsyncThunk(
  'product/refreshProducts',
  async (
    { categoryId, search }: { categoryId?: string; search?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const productRepository = ServiceContainer.getInstance().resolve<IProductRepository>(
        TYPES.ProductRepository
      );
      const useCase = new GetProductsUseCase(productRepository);
      const result = await useCase.execute({
        categoryId,
        search,
        forceRefresh: true,
      });
      return result.products;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
      state.searchQuery = ''; // Clear search when selecting category
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.selectedCategory = null; // Clear category when searching
    },
    clearProductError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder.addCase(fetchProducts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch categories
    builder.addCase(fetchCategories.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Refresh products
    builder.addCase(refreshProducts.pending, (state) => {
      state.isRefreshing = true;
      state.error = null;
    });
    builder.addCase(refreshProducts.fulfilled, (state, action) => {
      state.isRefreshing = false;
      state.products = action.payload;
    });
    builder.addCase(refreshProducts.rejected, (state, action) => {
      state.isRefreshing = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSelectedCategory, setSearchQuery, clearProductError } =
  productSlice.actions;
export default productSlice.reducer;
