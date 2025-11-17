/**
 * useProducts Hook
 * Custom hook for product operations
 */

import { useCallback, useEffect } from 'react';
import {
  clearProductError,
  fetchCategories,
  fetchProducts,
  refreshProducts,
  selectCategories,
  selectFilteredProducts,
  selectProducts,
  selectProductsLoading,
  selectProductsRefreshing,
  selectSearchQuery,
  selectSelectedCategory,
  setSearchQuery,
  setSelectedCategory,
} from '../../application/store';
import { useAppDispatch, useAppSelector } from '../../application/store/hooks';

export function useProducts() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const categories = useAppSelector(selectCategories);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const searchQuery = useAppSelector(selectSearchQuery);
  const isLoading = useAppSelector(selectProductsLoading);
  const isRefreshing = useAppSelector(selectProductsRefreshing);
  const filteredProducts = useAppSelector(selectFilteredProducts);

  // Fetch products
  const loadProducts = useCallback(
    async (categoryId?: string, search?: string, forceRefresh?: boolean) => {
      await dispatch(
        fetchProducts({ categoryId, search, forceRefresh })
      ).unwrap();
    },
    [dispatch]
  );

  // Fetch categories
  const loadCategories = useCallback(
    async (forceRefresh?: boolean) => {
      await dispatch(fetchCategories(forceRefresh ?? false)).unwrap();
    },
    [dispatch]
  );

  // Refresh products
  const handleRefresh = useCallback(async () => {
    await dispatch(
      refreshProducts({ categoryId: selectedCategory || undefined, search: searchQuery || undefined })
    ).unwrap();
  }, [dispatch, selectedCategory, searchQuery]);

  // Select category
  const selectCategory = useCallback(
    (categoryId: string | null) => {
      dispatch(setSelectedCategory(categoryId));

      // Load products for selected category
      if (categoryId) {
        loadProducts(categoryId);
      } else {
        loadProducts();
      }
    },
    [dispatch, loadProducts]
  );

  // Search products
  const searchProducts = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));

      // Load products with search query
      if (query.trim().length > 0) {
        loadProducts(undefined, query);
      } else {
        loadProducts();
      }
    },
    [dispatch, loadProducts]
  );

  // Clear error
  const clearError = useCallback(() => {
    dispatch(clearProductError());
  }, [dispatch]);

  // Load initial data on mount
  useEffect(() => {
    if (categories.length === 0) {
      loadCategories();
    }
    if (products.length === 0) {
      loadProducts();
    }
  }, [loadCategories, loadProducts, categories.length, products.length]); // Only run once on mount

  return {
    // State
    products,
    categories,
    selectedCategory,
    searchQuery,
    isLoading,
    isRefreshing,
    filteredProducts,

    // Actions
    loadProducts,
    loadCategories,
    refresh: handleRefresh,
    selectCategory,
    searchProducts,
    clearError,
  };
}
